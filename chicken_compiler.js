/** ChickenASM <-> Eggsembly dictionary object. */
var asmEggsemblyConverter = {	
	asmEggsemblyMap : { exit: "axe", 
						substract: "fox", 
						multiply: "rootster", 
						load: "pick", 
						store: "peck", 
						jump: "fr", 
						char: "BBQ" },
						
	convertAsm2Egg : function(asm) {
		if (this.asmEggsemblyMap[asm]) {
			var str = this.asmEggsemblyMap[asm];
			return str.split(' ')[0];  // only instructions, without arguments
		}
		return asm;	
	},

	convertEggsm2Asm : function(eggsm) {
		for (var prop in this.asmEggsemblyMap) {
			if (this.asmEggsemblyMap[prop] == eggsm) {
				return prop;
			}
		}
		return eggsm; // if not found in dictionary
	}
};

/** Compile chicken source code into Opcode. Return Array of Opcodes. */
function chicken2opcode(input) {
	var output = [];
	var linesArray = input.split(/[\r\n]+/);
	
	//opcode = chicken keywords  count in a line
	output = linesArray.map( str => (str.trim() == "")? 0 : str.trim().split(/\s+/).length );
	
	return output;
}

/** Compile Opcode to ChickenASM code
 * Input: Array of Opcodes or Opcode string delimeted by new lines
 * Output: Array of ChickenASM instructions
 */
function opcode2chickenasm(input) {
	var output = [];
	var isNewToken = true;
	
	//handle raw string and line splitted input too
	var opcodeArray = (typeof(input) == "string") ? input.split(/[\r\n]+/) : input;

	var instrucionArray = ["exit", "chicken", "add", "substract", "multiply", "compare", "load", "store", "jump", "char"];
	
	for (var i=0; i<opcodeArray.length; ++i) {
		var code = parseInt(opcodeArray[i]);
		
		if (!isNewToken && (code === 0 || code === 1)) {
			asmLine += " " + code;
		}
		else if (code >= 10) {
			asmLine = "push " + (code-10);
		}
		else {
			asmLine = instrucionArray[code];
		}
		
		//load instruction is double-wide instruction
		isNewToken = (asmLine !== "load");
		
		if (isNewToken) {
			output.push(asmLine);
		}
	}	
	
	return output;
}

/** Compile Opcode array or string to Eggsembly array */
function opcode2eggsembly(input) {
	var chickenASM = opcode2chickenasm(input);	
	var eggsembly = chickenasm2eggsembly(chickenASM);
	
	return eggsembly;
}

/** Compile Chicken source code to ChickenASM code
 * Input: Chicken source code string
 * Output: Array of ChickenASM instructions
 */
function chicken2chickenasm(input) {	
	var opcode = chicken2opcode(input);
	var output = opcode2chickenasm(opcode);
	
	return output;
}

/** Convert ChickenASM code to Eggsembly code
 * Input: Array of ChickenASM instructions or ChickenASM source code string
 * Output: Array of Eggsembly instructions
 */
function chickenasm2eggsembly(input) {
	var output = [];

	//handle raw string and line splitted input too
	var linesArray = (typeof(input) == "string") ? input.split(/[\r\n]+/) : input;
	
	for (var i=0; i<linesArray.length; ++i) {
		var eggsm = asmEggsemblyConverter.convertAsm2Egg(linesArray[i])
		output.push(eggsm);		
	}

	return output;
}

/** Convert Eggsembly code to ChickenASM code
 * Input: Array of Eggsembly instructions or Eggsembly source code string
 * Output: Array of ChickenASM instructions
 */
function eggsembly2chickenasm(input) {
	var output = [];

	//handle raw string and line splitted input too
	var linesArray = (typeof(input) == "string") ? input.split(/[\r\n]+/) : input;
	
	for (var i=0; i<linesArray.length; ++i) {
		var asm = asmEggsemblyConverter.convertEggsm2Asm(linesArray[i])
		output.push(asm);		
	}

	return output;
}

/** Compile Chicken source code to Eggsembly code
 * Input: Chicken source code string
 * Output: Array of Eggsembly instructions
 */
function chicken2eggsembly(input) {
	var chickenAsmArray = chicken2chickenasm(input);
	var eggsemblyArray = chickenasm2eggsembly(chickenAsmArray);

	return eggsemblyArray;
}

/** Decompile opcode array to chicken source string */
function opcode2chicken(input) {
	var output = "";
	
	//handle raw string and line splitted input too
	var linesArray = (typeof(input) == "string") ? input.split(/[\r\n]+/) : input;
	
	for (var i=0; i<input.length; ++i) {
		
		if (input[i] == 0) //do not print anything to opcode=0
			continue;
		
		var line = "";
		for (var j=0; j<input[i]; ++j) {
			console.log(j);
			line = line + "chicken ";
		}
		//var output = output + Array(input[i]+1).join(" chicken") + "\n";
		var output = output + line + "\n";
	}
	
	return output;
}

/** Decompile ChickenASM code to optocodes.
	Input: Array of ChickenASM instructions or ChickenASM source code string.
	Output: Array of Opcodes
*/
function chickenasm2opcode(input) {
	
	var output = [];
	//handle raw string and line splitted input too
	var linesArray = (typeof(input) == "string") ? input.split(/[\r\n]+/) : input;
	
	var instructions = ["exit", "chicken", "add", "substract", "multiply", "compare", "load", "store", "jump", "char"];
	
	for (var i=0; i<linesArray.length; ++i) {
		
		if (linesArray[i].trim() === "") //do not compile empty lines
			continue;
		
		var line = linesArray[i];

		var instr = line.split(' ')[0]; 
		if (instr !== "push") {
			output.push(instructions.indexOf(instr));
			if (instr == "load") { //load is double-wide instruction
				var loadParam = line.split(' ')[1];
				output.push(loadParam);
			}
		}
		else { //push
			var pushParam = parseInt(line.split(' ')[1]);
			output.push(pushParam+10);
		}
	}
	
	return output;
}

/** Decompile ChickenASM to Chicken source code */
function chickenasm2chicken(input) {	
	var opcodeArray = chickenasm2opcode(input);
	var chickenCode = opcode2chicken(opcodeArray);
	
	return chickenCode;
}

/** Decompile Eggsembly code to Chicken source code */
function eggsembly2chicken(input) {
	var asmArray = eggsembly2chickenasm(input);
	var opcodeArray = chickenasm2opcode(asmArray);
	var chickenCode = opcode2chicken(opcodeArray);
	
	return chickenCode;
}