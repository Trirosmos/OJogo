async function handleSuccess(stream) {
	const context = new AudioContext();
	const source = context.createMediaStreamSource(stream);

	await context.audioWorklet.addModule("worklet_bundle.js");
	const worklet = new AudioWorkletNode(context, "teste");
	source.connect(worklet);
	worklet.connect(context.destination);

	const tela = document.createElement("canvas");
	tela.width = window.innerWidth;
	tela.height = window.innerHeight;
	const ctx = tela.getContext("2d");

	const notas = [];

	worklet.port.onmessage = function (e) {
		console.log(e.data);
	}

	function atualizarNotas() {

	}



};

navigator.mediaDevices
	.getUserMedia({audio: true, video: false})
	.then(handleSuccess);