var ChickenVM = {
	stack : [],
	userInput : null, 
	stackPointer: -1,
	code: [],
	
	stackPush: function(elem) {
		this.stack[++this.stackPointer] = parseInt(elem);
	},
	stackPop: function() {
		if (this.stackPointer >= 0) {
			--this.stackPointer;
			return this.stack.pop();
		}
	},
	
	readChickenAsmCode: function(input) {
		//handle raw string and line splitted input too
		this.code = (typeof(input) == "string") ? input.split(/[\r\n]+/) : input;
			
		for (var i=0; i<this.code.length; ++i) {
			chickenasm2opcode(this.code[i]);
		}
	},
	
	parseChickenAsm: function() {
		
		for (var i=0; i<this.code.length; ++i) {
			var asmLine = opcode2chickenasm(this.code[i])[0];
			console.log("asmLine type " + typeof asmLine);
			var instr = asmLine.split(' ')[0];
			
			switch (instr) {
				case "push":
					var arg = this.code[i].split(' ')[1];
					this.stackPush(arg);
					break;
				case "add":
					var top = this.stackPop();
					var prev = this.stack[this.stackPointer];
					this.stackPush(top + prev);
					break;
				case "substract":
					var top = this.stackPop();
					var prev = this.stack[this.stackPointer];
					this.stackPush(prev - top);
					break;
				case "multiply":
					var top = this.stackPop();
					var prev = this.stack[this.stackPointer];
					this.stackPush(top * prev);
					break;
				case "compare":
					var top = this.stackPop();
					var prev = this.stack[this.stackPointer];
					this.stackPush(parseInt(top === prev));
					break;
				case "load":
					var arg = asmLine.split(' ')[1];
					if (arg == 0) {
						userInput= this.stackPop();
					}
					else if (arg == 1) {
						userInput = prompt('Read element: ');
					}
					break;
				case 'store':
					var storeTo = this.stackPop();
					var condition = this.stackPop();
					if (condition && storeTo < this.stackPointer) {
						this.stackPointer = storeTo;
					}
					break;
				case 'char': 
					String.fromCharCode(this.stackPop());
					break;
				default: 
					this.stackPush(this.code-10);
			}

		}
		
		console.log(this.stack.toString());	
	},
}