async function handleSuccess(stream) {
	const context = new AudioContext({latencyHint: "playback"});
	const source = context.createMediaStreamSource(stream);

	console.log(source);

	await context.audioWorklet.addModule("worklet_bundle.js");
	const worklet = new AudioWorkletNode(context, "teste");
	source.connect(worklet);
	worklet.connect(context.destination);

	const tela = document.createElement("canvas");
	tela.width = 640;
	tela.height = 480;
	const ctx = tela.getContext("2d");

	document.body.appendChild(tela);

	const notas = [];

	worklet.port.onmessage = function (e) {
		if(e.data === null) notas.push(-1);
		else notas.push(e.data);

		console.log(notas);
	}

	function atualizarNotas() {
		ctx.clearRect(0, 0, tela.width, tela.height);
		ctx.fillStyle = "orange";

		if(notas.length >= 10) {
			for(let x = 0; x < notas.length; x++) {
				let nota = notas.splice(0, 1);

				if(nota > 0) {
					ctx.fillRect((tela.width / 10) * x, (tela.height / 2) - ((nota / 200) - 1) * (tela.height / 2), tela.width / 10, tela.height / 10);
				}
			}
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