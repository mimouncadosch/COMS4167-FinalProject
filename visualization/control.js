// omegas[0][0] -= 0.00001;	// √ D
// omegas[1][0] -= 0.00001;	// √ A
// omegas[2][0] -= 0.00001;	// √ B
// omegas[3][0] -= 0.00001;	// √ C
function Control (omegas) {
	document.addEventListener('keydown', function(event) {
		if (event.keyCode == 38) {
			console.log('Pitch Forward');
			omegas[1][0] -= 0.000005;	// √ A
			omegas[0][0] -= 0.000005;	// √ D

			omegas[2][0] += 0.000005;	// √ B
			omegas[3][0] += 0.000005;	// √ C
			dir = 1;
		}
		else if (event.keyCode == 40) {
			console.log('Pitch Backward');
			omegas[1][0] += 0.000005;	// √ A
			omegas[0][0] += 0.000005;	// √ D

			omegas[2][0] -= 0.000005;	// √ B
			omegas[3][0] -= 0.000005;	// √ C
			dir = 1;
		}
		else if (event.keyCode == 37) {
			console.log('Roll Left');
			omegas[0][0] -= 0.000005;	// √ D
			omegas[3][0] -= 0.000005;	// √ C

			omegas[1][0] += 0.000005;	// √ A
			omegas[2][0] += 0.000005;	// √ B
			dir = 1;
		}
		else if (event.keyCode == 39) {
			console.log('Roll Right');
			omegas[0][0] += 0.000005;	// √ D
			omegas[3][0] += 0.000005;	// √ C

			omegas[1][0] -= 0.000005;	// √ A
			omegas[2][0] -= 0.000005;	// √ B
			dir = 1;
		}
		else if(event.keyCode == 65) {
			console.log('Yaw Left');
			omegas[2][0] -= 0.000005;	// √ B
			omegas[0][0] -= 0.000005;	// √ D

			omegas[1][0] += 0.000005;	// √ A
			omegas[3][0] += 0.000005;	// √ C

			dir = 1;
		}
		else if(event.keyCode == 70) {
			console.log('Yaw Right');
			omegas[1][0] -= 0.000005;	// √ A
			omegas[3][0] -= 0.000005;	// √ C

			omegas[2][0] += 0.000005;	// √ B
			omegas[0][0] += 0.000005;	// √ D

			dir = 1;
		}
		else if(event.keyCode == 78) {
			console.log('All rotors up');
			for (var i = 0; i < 4; i++) {
				omegas[i][0] += 1;
			}
			dir = -1;
		}
		else if(event.keyCode == 70) {
			console.log('All rotors down');
			for (var i = 0; i < 4; i++) {
				omegas[i][0] -= 1;
			}
			dir = 1;
		}
		else if(event.keyCode == 83) {
			console.log('All rotors up');
			for (var i = 0; i < 4; i++) {
				omegas[i][0] += 10;
			}
			dir = -1;
		}
		else if(event.keyCode == 68) {
			console.log('All rotors down');
			for (var i = 0; i < 4; i++) {
				omegas[i][0] -= 10;
			}
			dir = 1;
		}
		
	});

}