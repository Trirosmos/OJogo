async function handleSuccess (stream) {
	const context = new AudioContext();
	const source = context.createMediaStreamSource(stream);

	await context.audioWorklet.addModule("worklet_bundle.js");
	const worklet = new AudioWorkletNode(context, "teste");

	source.connect(worklet);
	worklet.connect(context.destination);

};

navigator.mediaDevices
	.getUserMedia({audio: true, video: false})
	.then(handleSuccess);