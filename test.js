var out = [[0,0,0,0], [0,0,0,0], [0,0,0,0]];
// console.log(out);

var _in = [[1],[2],[3]];
var _in2 = [[4], [5], [6]];
// console.log(_in);

// out = setColumn(out, 0, _in);
// console.log(out);

function setColumn(matrix, col, val) {
	console.log('setcol in test.js');
	matrix = numeric.transpose(matrix);
	console.log(matrix);
	console.log('finished transposing');
	val = undoArray(val);
	console.log(val);
	matrix[col] = val;
	matrix = numeric.transpose(matrix);
	return matrix;
}


// var inp = [[0], [0]];
// var inp = zeros(2,1);
// var b = [[1,2], [4,5]];
// var c = sumMatrix(b);
// console.log(c);
// var a = zeros(2,2);
// console.log(a);
// var b = zeros(2,1);
// console.log(b);
// var a = rand(3,1);
// console.log(a);
// console.log(twos);
// setMatrix(inp, 700);
// Even propellers
// inp[0] = inp[0] + 150;
// inp[2] = inp[2] + 150;
// var twos = zeros(4,1);
// setMatrix(twos, 2);
// inp = numeric.pow(inp, twos);
// inp = setVal(inp, 0, 0, 1);
// console.log(inp);
// console.log(inp2);

// for (var i = 0; i < inp.length; i++) {
	// console.log(inp[i] == inp2[i]);
// }
// a = 4;
// console.log(a);
// var inp = zeros(2,2);
	// numeric.setBlock(inp, [0, ]
// setMatrix(inp, 700);
// console.log(inp);
// numeric.transpose(b);
// var c = numeric.mul(a, b);
// var at = numeric.transpose(a)
// console.log(at);
// console.log(c);
// var d = numeric.transpose([[1,2,3],[4,5,6]]);
// var prd = numeric.dot(a, b);
// console.log(prd);
// inp[0][0] = 1;
// console.log(inp);
// var inp = zeros(2,2);
// console.log(inp[0][0]);

// setMatrix(inp, 700);
// var addend = zeros(4,1);
// console.log(addend);

// inp = numeric.add(addend, inp);
// Even propellers



// inp[0] = inp[0] + 150;
// inp[2] = inp[2] + 150;
// var twos = zeros(4,1);
// setMatrix(twos, 2);
// inp = numeric.pow(inp, twos);

// console.log(a);
// setMatrix(inp, 700);
// console.log(inp);
// // Even propellers
// inp[0][0] += 150;
// inp[0][2] += 150;
// console.log(inp);
// var twos = zeros(4,1);
// console.log(twos);
// setMatrix(twos, 2);
// console.log(twos);
// inp = numeric.pow(inp, twos);