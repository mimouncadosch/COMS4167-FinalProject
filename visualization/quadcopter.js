/**
 * Quadcopter object
 * For simplicity, the quadcopter consists of two perpendicular arms
 */
function Quadcopter (armLength) {

	// Quadcopter arms
	var armOne = new THREE.BoxGeometry( 1, armLength, 1 );
	var armTwo = new THREE.BoxGeometry( armLength, 1, 1 );
	var thrust_material = new THREE.LineBasicMaterial({ color: 0x000000 });
	THREE.GeometryUtils.merge(armOne, armTwo);	
	var mesh = new THREE.Mesh( armOne, thrust_material );
	var p0, p1, p2, p3, p4, p5, p6, p7, p8;
	
	// Updates position of quadcopter vertices
	this.updateVertices = function  () {
		p0 = mesh.geometry.vertices[0].clone();
		p0.applyMatrix4( quad.quad.matrixWorld );
		p1 = mesh.geometry.vertices[2].clone();
		p1.applyMatrix4( quad.quad.matrixWorld );
		p2 = mesh.geometry.vertices[5].clone();
		p2.applyMatrix4( quad.quad.matrixWorld );
		p4 = quad.quad.geometry.vertices[7].clone();
		p4.applyMatrix4( quad.quad.matrixWorld );
		p5 = quad.quad.geometry.vertices[8].clone();
		p5.applyMatrix4( quad.quad.matrixWorld );
		p6 = quad.quad.geometry.vertices[13].clone();
		p6.applyMatrix4( quad.quad.matrixWorld );
		p7 = quad.quad.geometry.vertices[15].clone();
		p7.applyMatrix4( quad.quad.matrixWorld );
		p8 = quad.quad.geometry.vertices[10].clone();
		p8.applyMatrix4( quad.quad.matrixWorld );
	}

	// Returns normal to quadcopter plane
	this.getNormal = function () {	
		// Calculate two vectors in the quadcopter plane
		var p0p1 = p1.clone().sub(p0.clone());
		var p1p2 = p2.clone().sub(p1.clone());
		// Vector normal to quadcopter plane
		p0p1.cross(p1p2);		
		
		return p0p1.clone();
	}

	// Returns the vertices of quadcopter where the thrust vectors will be drawn
	// Corresponds to the position of the rotors
	this.getVertices = function (argument) {
		var vertices = [p0, p1, p2, p3, p4, p5, p6, p7, p8];
		return vertices;
	}

	this.getPos = function () {
		var vector = mesh.geometry.vertices[0].clone();
		vector.applyMatrix4( mesh.matrixWorld );
		return vector;
	}

	// Pitch angle theta corresponds to rotation 
	// along the y axis
	this.pitch = function (theta) {
		mesh.rotation.y += theta;
	}

	// Roll angle phi corresponds to rotation
	// along the x axis
	this.roll = function (phi) {
		mesh.rotation.x += phi;
	}

	// Yaw angle psi corresponds to rotation
	// along the z axis
	this.yaw = function (psi) {
		mesh.rotation.z += psi;
	}

	// Returns the thrust lines at each rotor
	// Input is magnitudes: an array of the thrust vector at each rotor
	this.getThrust = function (magnitudes) {
		// Rotor locations
		return 0;
	}
	
	this.updateQuad = function () {
		// thrust_geometry.verticesNeedUpdate = true;
	}

	this.quad = mesh;
	return this;
}

/**
 * Draws axis from origin (src) plus vector (dst)
 */
function getAxis (src, dst) {
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial({ linewidth : 3, color: 0x999999 });
	geometry.vertices.push( src.clone() );
	geometry.vertices.push( dst.add(src) );

	var axis = new THREE.Line( geometry, material, THREE.LinePieces );
	return axis;
}