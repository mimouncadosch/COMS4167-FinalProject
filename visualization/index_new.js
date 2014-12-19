"use strict";

// Scene Settings
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 20, 20, 40 );

camera.up = new THREE.Vector3(0,0,1);
camera.lookAt(new THREE.Vector3(0,0,0));

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer({ alpha: true});
renderer.setClearColor(0xeeeeee, 1.0);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0xfa8000 , wireframe: true} );
var cube = new THREE.Mesh( geometry, material );
cube.position.set( 0, 0, 0 );
scene.add( cube );

// Set reference axes
var origin = new THREE.Vector3( 0, 0, 0 );
var axes = buildAxes( 1000 );
scene.add( axes );
var render = function () {
	requestAnimationFrame( render );
	
	renderer.render(scene, camera);

}

render();