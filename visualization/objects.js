function Sphere (radius, vector) {

	var geometry = new THREE.SphereGeometry( radius, 32, 32 );
	var material = new THREE.MeshBasicMaterial( { color: 0xfa8000 , wireframe: false} );
	this.sphere = new THREE.Mesh( geometry, material );
	
	this.sphere.radius = radius;
	this.sphere.position.x = vector.x;
	this.sphere.position.y = vector.y;
	this.sphere.position.z = vector.z;
	
	this.getRadius = function (argument) {
		return this.sphere.radius;
	}

	this.updatePosition = function (vector) {
		this.sphere.position.x = vector.x;
		this.sphere.position.y = vector.y;
		this.sphere.position.z = vector.z;
	}

	// Get coordinates of center of mass
	this.getPosition = function() {
		return this.sphere.position;
	}
	
	this.getType = function () {
		return 'sphere';
	}
	
	this.math_sphere = new THREE.Sphere(this.sphere.position, this.sphere.radius);
	return this;
}

function Cube (width, height, vector) {	
	var geometry = new THREE.BoxGeometry( width, height, 1 );
	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	this.cube = new THREE.Mesh( geometry, material );
	
	this.cube.position.x = vector.x;
	this.cube.position.y = vector.y;
	this.cube.position.z = vector.z;
	
	this.updatePosition = function (vector) {
		this.cube.position.x = vector.x;
		this.cube.position.y = vector.y;
		this.cube.position.z = vector.z;
	}

	return this;
}

function Tube () {
	var CustomSinCurve = THREE.Curve.create(
		function ( scale ) { 	//custom curve constructor
			this.scale = (scale === undefined) ? 1 : scale;
		},
		function ( t ) { //getPoint: t is between 0-1
			var tx = t * 3 - 1.5,
				ty = 3 * t,
				// ty = Math.sin( 2 * Math.PI * t ),
				tz = 1;
			return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
		}
	);

	var path = new CustomSinCurve( 10 );

	var geometry = new THREE.TubeGeometry(
		path,  //path
		20,    //segments
		2,     //radius
		8,     //radiusSegments
		false  //closed
	);

	var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	var tube = new THREE.Mesh( geometry, material );

	return tube;
	// scene.add( tube );
}