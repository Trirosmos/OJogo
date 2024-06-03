document.body.style.backgroundColor = "rgb(48,48,48)";

let sock;


let song = {
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

let notas = [];

let started = false;
let timeStamp0 = 0;

let context;
let gainNode;
let worklet;

async function setupWebAudio(stream) {
	context = new AudioContext({latencyHint: "playback"});
	const source = context.createMediaStreamSource(stream);

	await context.audioWorklet.addModule("worklet_bundle.js");
	worklet = new AudioWorkletNode(context, "teste");
	source.connect(worklet);

	//handleSuccess(stream, worklet);

	gainNode = context.createGain();

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

		synth.frequency.setValueAtTime(880 * 4 * frac, context.currentTime);
	});

	//source.connect(gainNode);
	synth.connect(gainNode);
	gainNode.connect(compressor);
	compressor.connect(pa);
	pa.connect(pb);
	pb.connect(notch1);
	notch1.connect(notch2);
	notch2.connect(worklet);
	worklet.connect(context.destination);
}

async function handleSuccess(stream, worklet) {
	window.addEventListener("keydown", function (e) {
		if(e.key === "a") {
			started = true;
			timeStamp0 = new Date();
			notas = [];
		}
	});

	const tela = document.createElement("canvas");
	tela.width = window.innerWidth;
	tela.height = window.innerHeight * 0.9;

	document.body.appendChild(tela);

	worklet.port.onmessage = function (e) {
		let nota = e.data;

		let tempo;

		if(started) {
			tempo = new Date();
			tempo -= timeStamp0;
			tempo /= 1000;
			tempo -= config.preRollSeconds;
		}

		if(started && tempo > 0) {
			if(nota === null || nota === -1) notas.push(-1);
			else notas.push(Math.log(nota / 160) / Math.log(Math.pow(2, 1 / 12)));
			
			if(notas.length > 80000) {
				notas.splice(0, notas.length - 80000);
			}
		}
	}

	let last = new Date();

	function update() {
		let tempo;
		let lastTempo = getSongData(song).tempoPorCompasso * song.compassos.length;

		if(started) {
			tempo = new Date();
			tempo -= timeStamp0;
			tempo /= 1000;
			tempo -= config.preRollSeconds;
		}

		if(tempo > lastTempo + (config.compassosPorTela * getSongData(song).tempoPorCompasso)) {
			tempo = lastTempo + (config.compassosPorTela * getSongData(song).tempoPorCompasso);
			//started = false;
		}

		desenharFundo(tela, config, song, tempo, "orange");

		desenharVoz(tela, config, song, tempo, 0, "orange");
		//desenharVoz(tela, config, song, tempo, 1, "blue");
		desenharPitchDetect(tela, config, song, tempo, notas);

		let ctx = tela.getContext("2d");
		ctx.save();
		ctx.font = "bold 48px serif";
		ctx.fillStyle = "orange";
		ctx.globalAlpha = 0.6;
		ctx.fillText(atribuiPontos(song, notas, 0, config), -15 + tela.width / 2, -24 + tela.height / 2);
		ctx.restore();


		window.requestAnimationFrame(update);
	}

	update();

	window.addEventListener("resize", function () {
		tela.width = window.innerWidth;
		tela.height = window.innerHeight * 0.9;
	});
};

createSetupWindow();