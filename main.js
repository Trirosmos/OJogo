async function handleSuccess(stream) {
	const context = new AudioContext({latencyHint: "playback"});
	const source = context.createMediaStreamSource(stream);

	await context.audioWorklet.addModule("worklet_bundle.js");
	const worklet = new AudioWorkletNode(context, "teste");
	source.connect(worklet);
	worklet.connect(context.destination);

	const tela = document.createElement("canvas");
	tela.width = window.innerWidth;
	tela.height = window.innerHeight;
	const ctx = tela.getContext("2d");

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