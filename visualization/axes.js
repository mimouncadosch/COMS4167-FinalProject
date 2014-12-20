/*
This file contains the functions you need to construct axes in 
three dimensions
 */

function buildAxes (length, origin) {
	var axes = new THREE.Object3D();
	var origin = new THREE.Vector3( 0, 0, 0 );
	axes.add( buildAxis( origin, new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); 	// +X
	axes.add( buildAxis( origin, new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); 	// -X
	axes.add( buildAxis( origin, new THREE.Vector3( 0, length, 0 ), 0x0000FF, false ) ); 	// +Y
	axes.add( buildAxis( origin, new THREE.Vector3( 0, -length, 0 ), 0x0000FF, true ) ); 	// -Y
	axes.add( buildAxis( origin, new THREE.Vector3( 0, 0, length ), 0x00FF00, false ) ); 	// +Z
	axes.add( buildAxis( origin, new THREE.Vector3( 0, 0, -length ), 0x00FF00, true ) ); 	// -Z

	return axes;
}

function buildAxis( src, dst, colorHex, dashed ) {
	var geometry = new THREE.Geometry();
	var material; 

	if(dashed) {
		material = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
	} else {
		material = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
	}

	geometry.vertices.push( src.clone() );
	geometry.vertices.push( dst.clone() );
	geometry.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

	var axis = new THREE.Line( geometry, material, THREE.LinePieces );
	return axis;
}

function buildArrows (origin) {
	var arrowHelperArr = [];
	var x_dir = new THREE.Vector3( 1, 0, 0 );
	var y_dir = new THREE.Vector3( 0, 1, 0 );
	var z_dir = new THREE.Vector3( 0, 0, 1 );
	var length = 1;
	var hex = 0xffff00;
	arrowHelperArr.push(new THREE.ArrowHelper( x_dir, origin, length, hex ));
	arrowHelperArr.push(new THREE.ArrowHelper( y_dir, origin, length, hex ));
	arrowHelperArr.push(new THREE.ArrowHelper( z_dir, origin, length, hex ));
	return arrowHelperArr;
}

function drawLine(src, dst, colorHex) {
	var geometry = new THREE.Geometry(); 
	var material = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
	geometry.vertices.push( src.clone() );
	geometry.vertices.push( dst.clone() );

	var line = new THREE.Line( geometry, material);
	return line;
}
