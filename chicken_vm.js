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
	},
	
	parseChickenAsm: function() {
		
		for (var i=0; i<this.code.length; ++i) {
			var instr = this.code[i].split(' ')[0];
			
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
			}

		}
		
		console.log(this.stack);	
	},
}