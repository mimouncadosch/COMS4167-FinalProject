/**
 * Matrix of rows x cols zeros
 */
function zeros(rows,cols) {
	var array = []; 
	var row = [];
	while (cols--) row.push(0);
	while (rows--) array.push(row.slice());
	return array;
}

function cos (argument) {
	return Math.cos(argument);
}

function sin (argument) {
	return Math.sin(argument);
}

/**
 * Cross product in 3-D
 */
function crossProduct (a, b) {
	var res = [	(a[1]*b[2] - a[2]*b[1]),
				(a[2]*b[0] - a[0]*b[2]),
				(a[0]*b[1] - a[1]*b[0])];
	return res;
}

/**
 * Sum of matrix values
 */
function sumMatrix (matrix) {
	var m = 0;

	var cols = matrix[0].length;
	var rows = matrix.length;

	for (var r = 0; r < rows; r++) {
		for (var c = 0; c < cols; c++) {
			m += matrix[r][c];
		}
	}
	return m;
}

/**
 * Set column of matrix to array of values
 */
function setCol(matrix, col, val) {
	matrix = numeric.transpose(matrix);
	val = undoArray(val);
	matrix[col] = val;
	matrix = numeric.transpose(matrix);
	return matrix;
}

function setVal(matrix, row, col, val) {
	matrix[row][col] = val;
	return matrix;
}

/**
 * Set all matrix entries equal to a given value
 */
function setMatrix (matrix, val) {
	var cols = matrix[0].length;
	var rows = matrix.length;
	for (var r = 0; r < rows; r++) {
		for (var c = 0; c < cols; c++) {
			matrix[r][c] = val;
		}
	}
}

/**
 * Create matrix of random variables
 */
function rand (rows, cols) {
	var mat = zeros(rows, cols);
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			mat[i][j] = Math.random();
		}
	}
	return mat;
}

/**
 * Takes an array an turns the values into arrays
 */
function makeIntoArray (arr) {
	for (var i = 0; i < arr.length; i++) {
			arr[i] = [arr[i]];
	}
	return arr;
}

/**
 * Turns an array of arrays into an array of values
 * Only works when the arrays inside only have one value
 */
function undoArray (arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] = arr[i][0];
	}
	return arr;
}