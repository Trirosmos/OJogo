document.body.style.backgroundColor = "rgb(48,48,48)";

window.tempo = 0;

let musica = {
	bpm: 80,
	compassos: [
		{
			vozes: [
					{
						notas: [
							{ altura: 0, duracao: 4 },
							{ altura: 30, duracao: 4 },
							{ altura: 40, duracao: 4 },
							{altura: 49, duracao: 4},
						]
					},
					{
						notas: [
							{ altura: 0, duracao: 4 },
							{ altura: 10, duracao: 4 },
							{ altura: 20, duracao: 4 },
							{altura: 30, duracao: 4},
						]
					},
					{
						notas: [
							{ altura: 0, duracao: 4 },
							{ altura: 10, duracao: 4 },
							{ altura: 25, duracao: 4 },
							{altura: 35, duracao: 4},
					]}
			]
		},
		{
			vozes: [
					{
						notas: [
							{ altura: 12, duracao: 4 },
							{ altura: 13, duracao: 4 },
							{ altura: 24, duracao: 4 },
							{altura: 27, duracao: 4},
						]
					},
					{
						notas: [
							{ altura: 28, duracao: 4 },
							{ altura: 27, duracao: 4 },
							{ altura: 25, duracao: 4 },
							{altura: 20, duracao: 4},
						]
					},
					{
						notas: [
							{ altura: 10, duracao: 4 },
							{ altura: 20, duracao: 4 },
							{ altura: 10, duracao: 4 },
							{altura: 20, duracao: 4},
					]}
			]
		},
		{
			vozes: [
					{
						notas: [
							{ altura: 13, duracao: 4 },
							{ altura: 14, duracao: 4 },
							{ altura: 13, duracao: 4 },
							{altura: 10, duracao: 4},
						]
					},
					{
						notas: [
							{ altura: 0, duracao: 4 },
							{ altura: 10, duracao: 4 },
							{ altura: 20, duracao: 4 },
							{altura: 30, duracao: 4},
						]
					},
					{
						notas: [
							{ altura: 0, duracao: 4 },
							{ altura: 10, duracao: 4 },
							{ altura: 20, duracao: 4 },
							{altura: 30, duracao: 4},
					]}
			]
		},
		{
			vozes: [
					{
						notas: [
							{ altura: 12, duracao: 8 },
							{ altura: 10, duracao: 8 },
						]
					},
					{
						notas: [
							{ altura: 20, duracao: 8 },
							{ altura: 10, duracao: 8 },
						]
					},
					{
						notas: [
							{ altura: 0, duracao: 4 },
							{ altura: 10, duracao: 4 },
							{ altura: 20, duracao: 4 },
							{altura: 30, duracao: 4},
					]}
			]
		},
		{
			vozes: [
					{
						notas: [
							{ altura: 10, duracao: 8 },
							{ altura: 1, duracao: 8 },
						]
					},
					{
						notas: [
							{ altura: 2, duracao: 8 },
							{ altura: 3, duracao: 8 },
						]
					},
					{
						notas: [
							{ altura: 4, duracao: 4 },
							{ altura: 5, duracao: 4 },
							{ altura: 6, duracao: 4 },
							{altura: 8, duracao: 4},
					]}
		 ]}
	]
}

function desenharFundo(canvas, divisoesNotas, compassosPorTela, musica) {
	let ctx = canvas.getContext("2d");
	let blockHeight = canvas.height / (divisoesNotas);
	let tempoPorCompasso = 4 / (musica.bpm / 60);
	let cOffset = (tempo % tempoPorCompasso)/tempoPorCompasso;
	let notaStartPos = -cOffset * (canvas.width / compassosPorTela);

	//Cor de fundo
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(48,48,48)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//Divisões de altura (eixo Y)
	for(let i = -1; i < divisoesNotas + 1; i++) {
		ctx.fillStyle = "rgb(59,59,59)";
		ctx.fillRect(0, canvas.height - blockHeight * i, canvas.width, 2);

		ctx.fillStyle = "white";
		ctx.fillText(i, 5, canvas.height - blockHeight * i - 4);
	}

	//Divisões de compasso (eixo X)
	for(let i = 0; i < 5; i++) {
		let largura = canvas.width / compassosPorTela; 
		ctx.fillStyle = "rgb(91,91,91)";
		ctx.fillRect(notaStartPos + (i * largura) - 1, 0, 3, canvas.height);
	}
}

function desenharVoz(canvas, divisoesNotas, compassosPorTela, musica, tempo, numVoz, cor) {
	let ctx = canvas.getContext("2d");
	let blockHeight = canvas.height / (divisoesNotas);
	let semicolcheiaWidth = canvas.width / (compassosPorTela * 16);

	let tempoPorCompasso = 4 / (musica.bpm / 60);
	let c = tempo > 0 ? Math.floor(tempo / tempoPorCompasso) : -Math.floor((-tempo) / tempoPorCompasso);
	let cOffset = (tempo % tempoPorCompasso)/tempoPorCompasso;
	let notaStartPos = -cOffset * (canvas.width / compassosPorTela);

	ctx.fillStyle = cor;

	while(c < musica.compassos.length) {
		if(c < 0) {
			c++;
			notaStartPos += semicolcheiaWidth * 16;
			continue;
		}

		let compasso = musica.compassos[c];
		let voz = compasso.vozes[numVoz];

		let semicolcheiaCounter = 0;

		if(notaStartPos >= canvas.width) {
			break;
		}

		for(n in voz.notas) {
			let nota = voz.notas[n];
			let duracao = Math.min(16 - semicolcheiaCounter, nota.duracao);

			ctx.save();
			ctx.globalAlpha = 0.8;
			ctx.fillRect(notaStartPos, canvas.height - blockHeight * (nota.altura + 1), semicolcheiaWidth * duracao, blockHeight);
			ctx.restore();

			notaStartPos += semicolcheiaWidth * nota.duracao;
			semicolcheiaCounter += duracao;
		}

		c++;
	}
}

function desenharPitchDetect(canvas, notas, detectTime, showPeriod, divisoesNotas) {
	let ctx = canvas.getContext("2d");
	let windowDiff = (notas.length * detectTime / 1000) - showPeriod;

	let notas_interp = [];

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

	let blockWidth = canvas.width / notas.length;
	let blockHeight = canvas.height / (divisoesNotas);

	ctx.fillStyle = "rgb(100,100, 255)";

	for(let i = 0; i < notas_interp.length; i++) {
		ctx.fillRect(blockWidth * i, (canvas.height - blockHeight * notas_interp[i]) + blockHeight / 2, blockWidth, 2);
	}
}

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

	const synth = context.createOscillator();
	synth.frequency.setValueAtTime(110, context.currentTime);
	synth.start();

	window.addEventListener("mousemove", function (e) {
		let frac = 1 - (e.y / this.window.innerHeight);
		let fracX = (e.x / this.window.innerWidth);

		window.tempo = -3 * compassosPorTela + fracX * musica.compassos.length * 6;

		synth.frequency.setValueAtTime(880 * frac, context.currentTime);
	});

	//source.connect(gainNode);
	synth.connect(gainNode);
	gainNode.connect(compressor);
	compressor.connect(pa);
	pa.connect(pb);
	pb.connect(notch1);
	notch1.connect(notch2);
	notch2.connect(worklet);
	//worklet.connect(context.destination);

	const tela = document.createElement("canvas");
	tela.width = window.innerWidth;
	tela.height = window.innerHeight * 0.9;

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
		let nota = e.data;

		if(nota === null || nota === -1) notas.push(-1);
		else notas.push(Math.log(nota/51.91309) / Math.log(Math.pow(2, 1/12)));
	}


	const showPeriod = 3;
	const detectTime = 6.25;
	const divisoesNotas = 50;
	const compassosPorTela = 4;
	let last = new Date();

	function update() {
		desenharFundo(tela, divisoesNotas, compassosPorTela, musica);

		desenharVoz(tela, divisoesNotas, compassosPorTela, musica, tempo, 0, "orange");
		desenharVoz(tela, divisoesNotas, compassosPorTela, musica, tempo, 1, "blue");
		desenharPitchDetect(tela, notas, detectTime, showPeriod, divisoesNotas);

		window.requestAnimationFrame(update);
	}

	update();

	window.addEventListener("resize", function () {
		tela.width = window.innerWidth;
		tela.height = window.innerHeight * 0.9;
	});
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