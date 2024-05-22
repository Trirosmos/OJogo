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
	notch1.Q.setValueAtTime(1, context.currentTime);

	const notch2 = context.createBiquadFilter();
	notch2.type = "notch";
	notch2.frequency.setValueAtTime(120, context.currentTime);
	notch2.gain.setValueAtTime(-30, context.currentTime);
	notch2.Q.setValueAtTime(1, context.currentTime);

	const pa = context.createBiquadFilter();
	pa.type = "highpass";
	pa.frequency.setValueAtTime(60, context.currentTime);

	const pb = context.createBiquadFilter();
	pb.type = "lowpass";
	pb.frequency.setValueAtTime(5000, context.currentTime);

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
	let notas_interp = [];

	worklet.port.onmessage = function (e) {
		let nota = e.data;

		if(nota === null || nota === -1) notas.push(-1);
		else notas.push(Math.log(nota/51.91309) / Math.log(Math.pow(2, 1/12)));
	}


	const showPeriod = 3;
	const detectTime = 6.25;
	const divisoesNotas = 50;
	let last = new Date();

	function iir(buff,cutoff,lowpass, sampleRate) {
    //https://en.wikipedia.org/wiki/High-pass_filter#Discrete-time_realization
    //https://en.wikipedia.org/wiki/Low-pass_filter#Discrete-time_realization
    var rc = 1/(2 * Math.PI * cutoff);
    var sampleTime = 1/sampleRate;
		var alpha = lowpass ? sampleTime / (sampleTime + rc) : rc / (sampleTime + rc);
		
		if(buff.length < 1) return [];

		var result = Array(buff.length);
    var lastOut = 0;

    for(x = 0; x < result.length; x++) {
        if(lowpass) result[x] = lastOut + alpha * (buff[x] - lastOut);
        else {
            var lastIn = x === 0 ? 0 : buff[x - 1];
            result[x] = lastOut * alpha + (buff[x] - lastIn) * alpha
        }

        lastOut = result[x];
    }

    return result;
}

	function atualizarNotas() {
		let now = new Date();
		let delta = now - last;
		let windowDiff = (notas.length * detectTime / 1000) - showPeriod;

		let lastNote = 0;
		for(let i = 0; i < notas.length; i++) {
			let nota = notas[i];
			if(nota != -1) {
				lastNote = nota;
				notas_interp[i] = nota;
			}
			else notas_interp[i] = lastNote;
		}

		notas_interp = iir(notas_interp, 10, true, 1000/detectTime);

		if(windowDiff > 0) {
			windowDiff *= 1000;
			windowDiff = Math.round(windowDiff / divisoesNotas);
			notas.splice(0, windowDiff);
		}

		let blockWidth = tela.width / notas.length;
		let blockHeight = tela.height / (divisoesNotas);

		ctx.clearRect(0, 0, tela.width, tela.height);
		ctx.fillStyle = "rgb(48,48,48)";
		ctx.fillRect(0, 0, tela.width, tela.height);

		for(let i = 0; i < divisoesNotas; i++) {
			ctx.fillStyle = "rgb(59,59,59)";
			ctx.fillRect(0, window.innerHeight - blockHeight * i, tela.width, 2);
		}

		for(let i = 0; i < 4; i++) {
			let largura = tela.width / 4; 
			ctx.fillStyle = "rgb(91,91,91)";
			ctx.fillRect((i * largura) - 1, 0, 3, tela.height);
		}

		ctx.fillStyle = "orange";

		for(let i = 0; i < notas.length; i++) {
			ctx.fillRect(blockWidth * i, window.innerHeight - blockHeight * notas[i], blockWidth, blockHeight);
		}

		ctx.fillStyle = "rgb(100,100, 255)";

		for(let i = 0; i < notas_interp.length; i++) {
			ctx.fillRect(blockWidth * i, (window.innerHeight - blockHeight * notas_interp[i]) + blockHeight / 2, blockWidth, 2);
		}

		window.requestAnimationFrame(atualizarNotas);
	}

	window.addEventListener("resize", function () {
		tela.width = window.innerWidth;
		tela.height = window.innerHeight;
	});

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