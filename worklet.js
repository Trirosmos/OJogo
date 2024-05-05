const Pitchfinder = require("pitchfinder");

const detectPitch = Pitchfinder.AMDF({
	sampleRate: sampleRate
});

const detectTime = 100;

const detectSize = Math.round(sampleRate * (detectTime / 1000))

let buffer = [];


class teste extends AudioWorkletProcessor {
	constructor() {
		super();

		this.port.onmessage = function (e) {
			//
    }
  }
  process(inputs, outputs, parameters) {
		const entrada = Array.from(inputs[0][0]);
		buffer = buffer.concat(entrada);

		if(buffer.length > detectSize) {
			let analise = buffer.splice(0, detectSize);
			this.port.postMessage(detectPitch(Float32Array.from(entrada))); 
			//this.port.postMessage(detectPitch);
		}

    return true;
  }
}

registerProcessor("teste", teste);
