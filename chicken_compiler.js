/** ChickenASM <-> Eggsembly dictionary object. */
var asmEggsemblyConverter = {	asmEggsemblyMap : { exit: "axe", 
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
	output = linesArray.map(str => (str.trim() == "")? 0 : str.trim()
	.split(/\s+/).length);
	
	return output;
}

/** Compile Opcode to ChickenASM code
 * Input: Array of Opcodes or Opcode string delimeted by new lines
 * Output: Array of ChickenASM instructions
 */
function opcode2chickenASM(input) {
	var output = [];
	var isNewToken = true;
	
	//handle raw string and line splitted input too
	var opcodeArray = (typeof(input) == "string") ? input.split(/[\r\n]+/) : input;

	for (var i=0; i<opcodeArray.length; ++i) {
		 	
		switch (opcodeArray[i]) {
		case 0:
			if (isNewToken)
				asmLine = "exit";
			else 
				asmLine += " 0";
			break;
		case 1: 
			if (isNewToken)
				asmLine = "chicken";
			else 
				asmLine += " 1";
			break;
		case 2: 
			asmLine = "add";
			break;
		case 3: 
			asmLine = "substract";
			break;
		case 4: 
			asmLine = "multiply";
			break;
		case 5:
			asmLine = "compare";
			break;
		case 6: 
			asmLine = "load";
			break;
		case 7: 
			asmLine = "store";
			break;
		case 8:
			asmLine = "jump";
			break;
		case 9:
			asmLine = "char";
			break;
		default: 
			asmLine = "push "+(parseInt(opcodeArray[i])-10);
		}
		
		//load instruction is double-wide instruction
		isNewToken = (asmLine !== "load");
		
		if (isNewToken) {
			output.push(asmLine);
		}
	}	
	
	return output;
}

/** Compile Chicken source code to ChickenASM code
 * Input: Chicken source code string
 * Output: Array of ChickenASM instructions
 */
function chicken2chickenASM(input) {
	document.getElementById('output').value = "";
	
	var opcode = chicken2opcode(input);
	var output = opcode2chickenASM(opcode);
	
	for (var i=0; i<output.length; ++i) {
		document.getElementById('output').value += output[i] + '\n';	
	}
	
	console.log("chickenAsm2chicken");
	console.log(chickenAsm2chicken(output));
	
	return output;
}

/** Convert ChickenASM code to Eggsembly code
 * Input: Array of ChickenASM instructions or ChickenASM source code string
 * Output: Array of Eggsembly instructions
 */
function chickenAsm2Eggsembly(input) {
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
function eggsembly2ChickenAsm(input) {
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
function chicken2Eggsembly(input) {
	var chickenAsmArray = chicken2chickenASM(input);
	var eggsemblyArray = chickenAsm2Eggsembly(chickenAsmArray);
	
	for (var i=0; i<eggsemblyArray.length; ++i) {
		document.getElementById("output_egg").innerHTML += eggsemblyArray[i] + "\n";
	}
	
	console.log(" eggsembly2chicken: ");
	console.log(eggsembly2chicken(eggsemblyArray));
	
	return eggsemblyArray;
}

/** Decompile opcode array to chicken source string */
function opcode2chicken(input) {
	var output = "";
	for (var i=0; i<input.length; ++i) {
		var output = output + Array(input[i]+1).join(" chicken") + "\n";
	}
	
	return output;
}

/** Decompile ChickenASM code to optocodes.
	Input: Array of ChickenASM instructions or ChickenASM source code string.
	Output: Array of Opcodes
*/
function chickenAsm2opcode(input) {
	
	var output = [];
	//handle raw string and line splitted input too
	var linesArray = (typeof(input) == "string") ? input.split(/[\r\n]+/) : input;
	
	var instructions = ["exit", "chicken", "add", "substract", "multiply", "compare", "load", "store", "jump", "char"];
	
	for (var i=0; i<linesArray.length; ++i) {
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
			var pushParam = line.split(' ')[1];
			output.push(pushParam+10);
		}
	}
	
	return output;
}

/** Decompile ChickenASM to Chicken source code */
function chickenAsm2chicken(input) {	
	var opcodeArray = chickenAsm2opcode(input);
	var chickenCode = opcode2chicken(opcodeArray);
	
	return chickenCode;
}

/** Decompile Eggsembly code to Chicken source code */
function eggsembly2chicken(input) {
	var asmArray = eggsembly2ChickenAsm(input);
	var opcodeArray = chickenAsm2opcode(asmArray);
	var chickenCode = opcode2chicken(opcodeArray);
	
	return chickenCode;
}