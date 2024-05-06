async function handleSuccess(stream) {
	const context = new AudioContext({latencyHint: "playback"});
	const source = context.createMediaStreamSource(stream);

	console.log(source);

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

window.addEventListener("touchstart", function () {
	navigator.mediaDevices
	.getUserMedia({audio: true, video: false})
		.then(handleSuccess);
	
	this.document.body.innerHTML = "Hey";
});

window.addEventListener("onclick", function () {
	navigator.mediaDevices
	.getUserMedia({audio: true, video: false})
		.then(handleSuccess);
	
	this.document.body.innerHTML = "Hey";
});

window.addEventListener("mousedown", function () {
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
});