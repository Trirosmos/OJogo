const Pitchfinder = require("pitchfinder");

const detectPitch = Pitchfinder.ACF2PLUS({
	sampleRate: sampleRate,
	minFrequency: 50,
	maxFrequency: 2000
});

const detectTime = 50;

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
		const saida = outputs[0];

		for(let x = 0; x < saida[0].length; x++) {
			saida[0][x] = entrada[x];
			if(saida[1]) saida[1][x] = entrada[x];
		}

		buffer = buffer.concat(entrada);

		while(buffer.length > detectSize) {
			let analise = buffer.splice(0, detectSize);

			for(let x = 0; x < analise.length; x++) {
				//Apply sine window
				//I know there are better ones, idgaf, this one is super easy to generate
				let windowValue = Math.sin((Math.PI / analise.length) * x);
				analise[x] = windowValue * analise[x];
			}

			this.port.postMessage(detectPitch(Float32Array.from(analise))); 
			//this.port.postMessage(inputs[0][0].length);
		}

    return true;
  }
}

registerProcessor("teste", teste);
