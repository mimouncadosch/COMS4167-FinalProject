function Control (omegas) {
	document.addEventListener('keydown', function(event) {
		if(event.keyCode == 78) {
			console.log('All rotors up');
			for (var i = 0; i < 4; i++) {
				omegas[i][0] += 0.1;
			}
		}
		else if(event.keyCode == 70) {
			console.log('All rotors down');
			for (var i = 0; i < 4; i++) {
				omegas[i][0] -= 0.1;
			}
		}
		if (event.keyCode == 38) {
			console.log('pitch forward');
			// omegas[1][0] += 0.00001;
			// omegas[3][0] += 0.00001;
			// omegas[0][0] += 0.000005;
			omegas[2][0] += 0.000005;
			// omegas[3][0] += 0.000005;
		}
		else if (event.keyCode == 40) {
			console.log('pitch backward');
			// omegas[2][0] += 0.000005;
			// omegas[3][0] += 0.000005;
			// omegas[0][0] -= 0.000005;
			// omegas[1][0] -= 0.000005;
		}
		else if (event.keyCode == 37) {
			console.log('roll left');
			omegas[1][0] += 0.00001;
			omegas[2][0] += 0.00001;
		}
		else if (event.keyCode == 39) {
			console.log('roll right');
			// omegas[3][0] += 0.00001;
			// omegas[0][0] += 0.00001;
			omegas[1][0] -= 0.00001;
			omegas[2][0] -= 0.00001;
		}
		else if (event.keyCode == 89) {
			console.log('yaw right');
			// omegas[3][0] += 0.00001;
			// omegas[0][0] += 0.00001;
			omegas[1][0] -= 0.00001;
			omegas[3][0] -= 0.00001;
		}
	});

}