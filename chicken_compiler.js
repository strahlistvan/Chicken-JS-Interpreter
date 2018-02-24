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
										return str.split(' ')[0]; 
									}
									return asm;
									
								}											
							};
/** Convert chicken source code into Opcode. Return Array of Opcodes. */
function chicken2Optcode(input) {
	var output = [];
	var input = input.replace(/[\r\n]/g, ' \r\n'); //handle zero chickens
	var linesArray = input.split(/[\r\n]+/);
	
	//optcode = chicken keywords  count in a line
	output = linesArray.map(str => (str.trim() == "")? 0 : str.split(/\s+/).length);
	
	return output;
}

/** Convert Opcode to ChickenASM code
 * Input: Array of Opcodes or Opcode string delimeted by new lines
 * Output: Array of ChickenASM instructions
 */
function optcode2chickenASM(input) {
	var output = [];
	var isNewToken = true;
	
	//handle raw string and line splitted input too
	var optcodeArray = (typeof(input) == "string") ? input.split(/[\r\n]+/) : input;

	for (var i=0; i<optcodeArray.length; ++i) {
		 	
		switch (optcodeArray[i]) {
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
			asmLine = "push "+(parseInt(optcodeArray[i])-10);
		}
		
		//load instruction is double-wide instruction
		isNewToken = (asmLine !== "load");
		
		if (isNewToken) {
			output.push(asmLine);
		}
	}	
	
	return output;
}

/** Convert native Chicken source code to ChickenASM code
 * Input: Chicken source code string
 * Output: Array of ChickenASM instructions
 */
function chicken2chickenASM(input) {
	document.getElementById('output').value = "";
	
	var optcode = chicken2Optcode(input);
	var output = optcode2chickenASM(optcode);
	
	for (var i=0; i<output.length; ++i) {
		document.getElementById('output').value += output[i] + '\n';	
	}
	
	return output;
}

/** Convert ChickenASM code to Eggsembly code
 * Input: Array of ChickenASM instructions or ChickenASM source code string
 * Output: Array of Eggsembly instructions
 */
function chickenASM2Eggsembly(input) {
	var output = [];

	//handle raw string and line splitted input too
	var linesArray = (typeof(input) == "string") ? input.split(/[\r\n]+/) : input;
	
	for (var i=0; i<linesArray.length; ++i) {
		output.push(asmEggsemblyConverter.convertAsm2Egg(linesArray[i]));
	}

	return output;
}

/** Convert native Chicken source code to Eggsembly code
 * Input: Chicken source code string
 * Output: Array of Eggsembly instructions
 */
function chicken2Eggsembly(input) {
	var chickenAsmArray = chicken2chickenASM(input);
	var eggsemblyArray = chickenASM2Eggsembly(chickenAsmArray);
	
	for (var i=0; i<eggsemblyArray.length; ++i) {
		document.getElementById("output_egg").innerHTML += eggsemblyArray[i] + "\n";
	}
}
