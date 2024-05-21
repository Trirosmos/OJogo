async function handleSuccess(stream) {
	const context = new AudioContext({latencyHint: "playback"});
	const source = context.createMediaStreamSource(stream);

	await context.audioWorklet.addModule("worklet_bundle.js");
	const worklet = new AudioWorkletNode(context, "teste");
	source.connect(worklet);

	const gainNode = context.createGain();

	const compressor = context.createDynamicsCompressor();
	compressor.threshold.setValueAtTime(-50, context.currentTime);
	compressor.knee.setValueAtTime(40, context.currentTime);
	compressor.ratio.setValueAtTime(12, context.currentTime);
	compressor.attack.setValueAtTime(0, context.currentTime);
	compressor.release.setValueAtTime(0.25, context.currentTime);

	const notch1 = context.createBiquadFilter();
	notch1.type = "notch";
	notch1.frequency.setValueAtTime(60, context.currentTime);
	notch1.gain.setValueAtTime(-30, context.currentTime);
	notch1.Q.setValueAtTime(2, context.currentTime);

	const notch2 = context.createBiquadFilter();
	notch2.type = "notch";
	notch2.frequency.setValueAtTime(120, context.currentTime);
	notch2.gain.setValueAtTime(-30, context.currentTime);
	notch2.Q.setValueAtTime(2, context.currentTime);

	const pa = context.createBiquadFilter();
	pa.type = "highpass";
	pa.frequency.setValueAtTime(200, context.currentTime);

	const pb = context.createBiquadFilter();
	pb.type = "lowpass";
	pb.frequency.setValueAtTime(2500, context.currentTime);

	source.connect(gainNode);
	gainNode.connect(compressor);
	compressor.connect(pa);
	pa.connect(pb);
	pb.connect(notch1);
	notch1.connect(notch2);
	notch2.connect(worklet);
	worklet.connect(context.destination);

	const tela = document.createElement("canvas");
	tela.width = window.innerWidth;
	tela.height = window.innerHeight;
	const ctx = tela.getContext("2d");

	const volume = document.createElement("input");
	volume.type = "range";
	volume.min = 0;
	volume.max = 40;
	volume.value = "1";
	volume.step = 0.1;

	volume.onchange = function (e) {
		gainNode.gain.setValueAtTime(Number(e.target.value), context.currentTime);
		console.log(gainNode);
	}

	document.body.appendChild(volume);
	document.body.appendChild(tela);

	const notas = [];

	worklet.port.onmessage = function (e) {
		if(e.data === null || e.data === -1) notas.push(-1);
		else notas.push(Math.log(e.data/51.91309) / Math.log(Math.pow(2, 1/12)));
	}


	const showPeriod = 3;
	const detectTime = 50;
	let last = new Date();

	function atualizarNotas() {
		let now = new Date();
		let delta = now - last;
		let windowDiff = (notas.length * detectTime / 1000) - showPeriod;

		if(windowDiff > 0) {
			windowDiff *= 1000;
			windowDiff = Math.round(windowDiff / 50);
			notas.splice(0, windowDiff);
		}

		let blockWidth = tela.width / notas.length;
		let blockHeight = tela.height / (12 * 5);

		ctx.clearRect(0, 0, tela.width, tela.height);
		ctx.fillStyle = "orange";

		for(let i = 0; i < notas.length; i++) {
			ctx.fillRect(blockWidth * i, window.innerHeight - blockHeight * notas[i], blockWidth, blockHeight);
		}

		window.requestAnimationFrame(atualizarNotas);
	}

	atualizarNotas();
};

let bot = document.createElement("button");
bot.innerText = "Começar!";
document.body.appendChild(bot);

bot.onclick = function () {
	navigator.mediaDevices
	.getUserMedia({
		audio: {
			autoGainControl: false,
			echoCancellation: false,
			noiseSuppression: false
		},
		video: false
	})
	.then(handleSuccess);
}