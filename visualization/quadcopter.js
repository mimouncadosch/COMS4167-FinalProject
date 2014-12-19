/**
 * Quadcopter object
 * For simplicity, the quadcopter consists of two perpendicular arms
 */
function Quadcopter (armLength) {

	// Quadcopter arms
	var armOne = new THREE.BoxGeometry( 1, armLength, 1 );
	var armTwo = new THREE.BoxGeometry( armLength, 1, 1 );
	
	// var geometry = new THREE.Geometry();
	// var material = new THREE.LineBasicMaterial({ linewidth : 10, color: 0x000000 });
	// var src = new THREE.Vector3(1, 1, 1);
	// var dst = new THREE.Vector3(0, armLength, 0);
	// var dst2 = new THREE.Vector3(armLength, 0, 0);
	// geometry.vertices.push( src.clone() );
	// geometry.vertices.push( dst.add(src.clone()) );
	// geometry.vertices.verticesNeedUpdate = true;
	// geometry.vertices.push( dst2.add(src.clone()) );
	// var mesh = new THREE.Line( geometry, material, THREE.LinePieces );

	// Array containing the four thrust lines
	// var axis;
	
	// Thrust vectors
	var thrust_material = new THREE.LineBasicMaterial({ color: 0x000000 });

	THREE.GeometryUtils.merge(armOne, armTwo);
	var mesh = new THREE.Mesh( armOne, thrust_material );

	this.getPos = function () {
		// console.log(mesh);
		
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
		
		// var p1 = armOne.vertices[0].clone();
		// var p2 = armOne.vertices[2].clone();
		// var p3 = armOne.vertices[5].clone();
		var p1 = mesh.geometry.vertices[0].clone();
		p1.applyMatrix4( mesh.matrixWorld );
		var p2 = mesh.geometry.vertices[2].clone();
		p1.applyMatrix4( mesh.matrixWorld );
		var p3 = mesh.geometry.vertices[5].clone();
		p1.applyMatrix4( mesh.matrixWorld );


		// var p4 = armOne.vertices[7].clone();
		// var p5 = armOne.vertices[8].clone();
		// var p6 = armOne.vertices[13].clone();
		// var p7 = armOne.vertices[15].clone();
		// var p8 = armOne.vertices[10].clone();

		// Vectors along the quadcopter's arms necessary to calculate thrust vector
		var p1p2 = p2.clone().sub(p1.clone());
		var p1p3 = p3.clone().sub(p1.clone());
		// var p2p4 = p4.clone().sub(p2.clone());

		// var p5p7 = p7.clone().sub(p5.clone());
		// var p6p7 = p7.clone().sub(p6.clone());
		// var p5p8 = p8.clone().sub(p5.clone());
		// var p5p6 = p6.clone().sub(p5.clone());

		// Calculate normals to the quadcopter's arms
		// p2p4.cross(p1p2);
		p1p2.cross(p1p3);
		// p5p7.cross(p6p7);
		// p5p8.cross(p5p6);

		// Point all vectors in same direction
		// p5p8.multiplyScalar(-1);
		p1p2.multiplyScalar(-1);

		// p2p4.multiplyScalar(magnitudes[0]);
		p1p2.multiplyScalar(magnitudes[1])
		// p5p7.multiplyScalar(magnitudes[2])
		// p5p8.multiplyScalar(magnitudes[3])

		var axis1 = getAxis(p1, p1p2);
		// var axis2 = getAxis(p2, p2p4);
		// var axis3 = getAxis(p5, p5p7);
		// var axis4 = getAxis(p6, p5p8);

		// armOne.axis1.

		var axis = [];
		axis[0] = axis1;
		// axis[1] = axis2;
		// axis[2] = axis3;
		// axis[3] = axis4;
		// console.log(axis1.position);
		return axis;
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