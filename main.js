document.body.style.backgroundColor = "rgb(48,48,48)";

let sock;

let backingTrack = document.createElement("audio");
backingTrack.src = "bt.mp3";
document.body.appendChild(backingTrack);

function randNote() {
	return Math.round(Math.random() * 49);
}

let colecao = [
	[{ altura: 0, duracao: 4 },
	 { altura: 30, duracao: 4 },
	 { altura: 40, duracao: 4 },
	 { altura: 49, duracao: 4 }],
	
	[{ altura: 0, duracao: 4 },
	 { altura: 10, duracao: 4 },
	 { altura: 20, duracao: 4 },
	 { altura: 30, duracao: 4 }],
	
	[{ altura: 4, duracao: 4 },
	 { altura: 5, duracao: 4 },
	 { altura: 6, duracao: 4 },
	 { altura: 8, duracao: 4 }],
	
	[{ altura: 2, duracao: 8 },
	 { altura: -1, duracao: 8 }],
	
	[{ altura: 12, duracao: 8 },
	 { altura: 10, duracao: 8 }],
	
	[{ altura: 7, duracao: 8 },
	 { altura: 3, duracao: 8 }],

	[{ altura: 29, duracao: 8 },
	 { altura: randNote(), duracao: 8 }],
	 
	[{ altura: -1, duracao: 8 },
	 { altura: randNote(), duracao: 8 }],
		
	[{ altura: randNote(), duracao: 8 },
	 { altura: -1, duracao: 8 }],
	
	[{ altura: 20, duracao: 16 }],
	[{ altura: 12, duracao: 16 }],
	[{ altura: 13, duracao: 16 }],
	[{ altura: 40, duracao: 16 }],
	[{ altura: 29, duracao: 16 }],
	[{ altura: 10, duracao: 16 }],
	[{ altura: randNote(), duracao: 16 }],
	[{ altura: randNote(), duracao: 16 }],
	[{ altura: randNote(), duracao: 16 }],
	[{ altura: randNote(), duracao: 16 }],

	[{ altura: randNote(), duracao: 4 },
	 { altura: randNote(), duracao: 4 },
	 { altura: randNote(), duracao: 4 },
	 { altura: randNote(), duracao: 4 }],

	[{ altura: 0, duracao: 4 },
	 { altura: 10, duracao: 4 },
	 { altura: 11, duracao: 4 },
	 { altura: 12, duracao: 4 }],

	[{ altura: 13, duracao: 4 },
	 { altura: 14, duracao: 4 },
	 { altura: 16, duracao: 4 },
	 { altura: 17, duracao: 4 }],
	
	[{ altura: 0, duracao: 4 },
	 { altura: 10, duracao: 4 },
	 { altura: 20, duracao: 4 },
	 { altura: 30, duracao: 4 }],
	
	[{ altura: -1, duracao: 4 },
	 { altura: -1, duracao: 4 },
	 { altura: 20, duracao: 8 },],
	
	[{ altura: -1, duracao: 2 },
	 { altura: 10, duracao: 2 },
	 { altura: 22, duracao: 2 },
	 { altura: -1, duracao: 10 },
	],

	[{ altura: 10,  duracao: 1 },
		{ altura: 12, duracao: 1 },
		{ altura: 14, duracao: 1 },
		{ altura: 16, duracao: 1 },
		{ altura: 18, duracao: 1 },
		{ altura: 17, duracao: 1 },
		{ altura: 15, duracao: 1 },
		{ altura: 13, duracao: 1 },
		{ altura: 11, duracao: 1 },
		{ altura: 8,  duracao: 1 },
		{ altura: 12, duracao: 1 },
		{ altura: 16, duracao: 1 },
		{ altura: 20, duracao: 1 },
		{ altura: 24, duracao: 1 },
		{ altura: 28, duracao: 1 },
		{ altura: 32, duracao: 1 },
  ],

	[{ altura: randNote(),  duracao: 1 },
		{ altura: 12, duracao: 1 },
		{ altura: 14, duracao: 1 },
		{ altura: 7, duracao: 1 },
		{ altura: randNote(), duracao: 1 },
		{ altura: 9, duracao: 1 },
		{ altura: 10, duracao: 1 },
		{ altura: 13, duracao: 1 },
		{ altura: 11, duracao: 1 },
		{ altura: 30,  duracao: 1 },
		{ altura: 29, duracao: 1 },
		{ altura: 28, duracao: 1 },
		{ altura: 27, duracao: 1 },
		{ altura: 24, duracao: 1 },
		{ altura: randNote(), duracao: 1 },
		{ altura: randNote(), duracao: 1 },
	],
	
	[{ altura: 30, duracao: 8 },
	 { altura: 28, duracao: 4 },
	 { altura: 10, duracao: 2 },
	 { altura: 12, duracao: 2 },
	],

	[{ altura: 30, duracao: 8 },
		{ altura: -1, duracao: 4 },
		{ altura: 10, duracao: 2 },
		{ altura: 12, duracao: 2 },
	],
	
	[{ altura: 25, duracao: 8 },
		{ altura: -1, duracao: 4 },
		{ altura: 10, duracao: 2 },
		{ altura: -1, duracao: 2 },
	],
	
	[{ altura: 44, duracao: 8 },
		{ altura: -1, duracao: 4 },
		{ altura: 5, duracao: 2 },
		{ altura: 4, duracao: 2 },
	],

	[{ altura: 10, duracao: 8 },
		{ altura: 11, duracao: 4 },
		{ altura: -1, duracao: 2 },
		{ altura: -1, duracao: 2 },
	],

	[{ altura: 1,  duracao: 1 },
		{ altura: -1, duracao: 1 },
		{ altura: 2, duracao: 1 },
		{ altura: 3, duracao: 1 },
		{ altura: 5, duracao: 1 },
		{ altura: 7, duracao: 1 },
		{ altura: 11, duracao: 1 },
		{ altura: -1, duracao: 1 },
		{ altura: 13, duracao: 1 },
		{ altura: 17,  duracao: 1 },
		{ altura: 19, duracao: 1 },
		{ altura: 23, duracao: 1 },
		{ altura: -1, duracao: 1 },
		{ altura: 29, duracao: 1 },
		{ altura: 31, duracao: 1 },
		{ altura: -1, duracao: 1 },
	],
	
	[{ altura: 8, duracao: 4 },
		{ altura: 15, duracao: 8 },
		{ altura: 13, duracao: 4 },
	],

	[{ altura: 8, duracao: 4 },
		{ altura: -1, duracao: 8 },
		{ altura: 13, duracao: 4 },
	],

	[{ altura: 8, duracao: 4 },
		{ altura: -1, duracao: 8 },
		{ altura: -1, duracao: 2 },
		{ altura: randNote(), duracao: 2 },
	],
];

function gerarMusica(duracao, bpm, vozes) {
	let musica = {
		bpm: bpm,
		compassos: []
	}

	for(let c = 0; c < duracao; c++) {
		let compasso = {
			vozes: []
		};

		for(let v = 0; v < vozes; v++) {
			let voz = {};
			voz.notas = colecao[Math.round(Math.random() * colecao.length - 1)];

			compasso.vozes.push(voz);
		}

		musica.compassos.push(compasso);
	}

	return musica;
}


let song = {
	bpm: 60,
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

/*let playerData = [{
	nome: "Beltrano",
	cor: "grey",
	score: "30"
},
{
	nome: "Fulano",
	cor: "orange",
	score: "20"
	},
	{
		nome: "Ciclano",
		cor: "blue",
		score: "155"
	}];*/

let playerData = [];

let started = false;
let timeStamp0 = 0;

let context;
let gainNode;
let worklet;
let stream;

let scoreScreen;
let scoreCtx;

async function setupWebAudio(flux) {
	stream = flux;

	context = new AudioContext({latencyHint: 0});
	const source = context.createMediaStreamSource(stream);

	await context.audioWorklet.addModule("worklet_bundle.js");
	worklet = new AudioWorkletNode(context, "teste");
	//source.connect(worklet);

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
	//synth.start();

	window.addEventListener("mousemove", function (e) {
		let frac = 1 - (e.y / this.window.innerHeight);
		let fracX = (e.x / this.window.innerWidth);

		synth.frequency.setValueAtTime(880 * 4 * frac, context.currentTime);
	});

	source.connect(gainNode);
	//synth.connect(gainNode);
	gainNode.connect(compressor);
	compressor.connect(pa);
	pa.connect(pb);
	pb.connect(notch1);
	notch1.connect(notch2);
	notch2.connect(worklet);
	worklet.connect(context.destination);
}

async function handleSuccess() {
	window.addEventListener("keydown", async function (e) {
		if(e.key === "a" && serverConfig.espectador) {
			started = true;
			let comeco = Date.now();
			timeStamp0 = new Date(comeco);

			backingTrack.currentTime = 0;
			backingTrack.play();

			if(sock) {
				song = gerarMusica(config.songLegthInMeasures, 60, config.numberOfPlayers);
				await sock.send(JSON.stringify({
					type: "newSong",
					song: song
				}));

				sock.send(JSON.stringify({
					type: "start",
					timestamp: comeco
				}));
			}
		}

		if(e.key === "p" && serverConfig.espectador) {
			started = false;
			backingTrack.currentTime = 0;
			backingTrack.pause();

			playerData = [];

			if(sock) {
				sock.send(JSON.stringify({
					type: "stop"
				}));
			}
		}
	});

	const tela = document.createElement("canvas");
	tela.width = window.innerWidth;
	tela.height = window.innerHeight * 0.9;

	document.body.appendChild(tela);

	scoreScreen = document.createElement("canvas");
	scoreScreen.width = window.innerWidth * 0.2;
	scoreScreen.height = window.innerHeight * 0.4;
	scoreScreen.style.position = "absolute";
	scoreScreen.style.left = "10%";
	scoreScreen.style.top = "10%";
	scoreScreen.style.visibility = "hidden";
	scoreCtx = scoreScreen.getContext("2d");

	document.body.appendChild(scoreScreen);

	worklet.port.onmessage = function (e) {
		let nota = e.data;

		let tempo;

		if(started) {
			tempo = new Date();
			tempo -= timeStamp0;
			tempo /= 1000;
			tempo -= config.preRollBeats * getSongData(song).tempoPorCompasso/4;
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
	let frames = 0;

	function update() {
		let tempo;
		let lastTempo = getSongData(song).tempoPorCompasso * song.compassos.length;

		if(started) {
			tempo = new Date();
			tempo -= timeStamp0;
			tempo /= 1000;
			tempo -= config.preRollBeats * getSongData(song).tempoPorCompasso/4;
		}

		if(tempo > lastTempo + (config.compassosPorTela * getSongData(song).tempoPorCompasso)) {
			tempo = lastTempo + (config.compassosPorTela * getSongData(song).tempoPorCompasso);
			backingTrack.pause();
			backingTrack.currentTime = 0;
			//started = false;
		}

		frames++;
		if(frames > 10) {
			frames = 0;
			if(serverConfig.espectador) {
				if(sock) {
					sock.send(JSON.stringify({
						type: "timestamp",
						value: Date.now() - timeStamp0
					}));
				}
			}
		}

		desenharFundo(tela, config, song, tempo, "orange");

		if(serverConfig.espectador) {
			if(playerData.length > 0) {
				for(let p in playerData) {
					let player = playerData[p];

					desenharVoz(tela, config, song, tempo, p, serverConfig.playerColors[p]);
				}
			}

			scoreScreen.style.visibility = "visible";
			scoreCtx.clearRect(0, 0, scoreScreen.width, scoreScreen.height);

			if(playerData.length > 0) {
				let amntP = playerData.length;
				let pSpaceWidth = scoreScreen.width / amntP;
				let barHeight = scoreScreen.height * 0.6;
				let baseLeft = pSpaceWidth * 0.2;
				let bottomBase = (scoreScreen.height * 0.8);
				let fontSize = pSpaceWidth * 0.6 * (1 / 3);
				let maxScore = 0;

				for(let p = 0; p < amntP; p++) {
					let pData = playerData[p];
					if(pData) {
						if(pData.score > maxScore) maxScore = pData.score;
					}
				}

				for(let p = 0; p < amntP; p++) {
					let pData = playerData[p];
					if(!pData) continue;

					scoreCtx.fillStyle = pData.cor;
					scoreCtx.textAlign = "center";
					scoreCtx.textBaseline = "middle";
					scoreCtx.fillRect(baseLeft, bottomBase, pSpaceWidth * 0.6, -barHeight * (pData.score / maxScore));
					//scoreCtx.fillRect(baseLeft, bottomBase, pSpaceWidth * 0.6, -barHeight);
					scoreCtx.font = fontSize + "px mono";

					scoreCtx.fillStyle = "white";
					scoreCtx.fillText(pData.score, baseLeft + (fontSize * 1.5), bottomBase - barHeight * 1.1);

					scoreCtx.font = (fontSize / 1.5) + "px mono";
					scoreCtx.fillText(pData.nome.slice(0, 10), baseLeft + pSpaceWidth * 0.3, bottomBase * 1.1);

					baseLeft += pSpaceWidth;
				}
			}
		}
		else {
			desenharVoz(tela, config, song, tempo, serverConfig.voz, serverConfig.playerColors[serverConfig.voz]);
			desenharPitchDetect(tela, config, song, tempo, notas);

			let ctx = tela.getContext("2d");
			ctx.save();
			ctx.font = "bold 48px serif";
			ctx.fillStyle = "orange";
			ctx.globalAlpha = 0.6;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(atribuiPontos(song, notas, 0, config), tela.width / 2, -24 + tela.height / 2);
			//ctx.fillText(timeStamp0, tela.width / 2, -24 + tela.height / 2);
			ctx.restore();
		}

		window.requestAnimationFrame(update);
	}

	update();

	window.addEventListener("resize", function () {
		tela.width = window.innerWidth;
		tela.height = window.innerHeight * 0.9;
	});
};

createSetupWindow();
