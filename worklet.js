//import {Analyzer} from "./lib/pitch.js"

const Pitchfinder = require("pitchfinder");

const detectPitch = Pitchfinder.ACF2PLUS({
	sampleRate: sampleRate,
});

const detectTime = 12.5;

const detectSize = Math.round(sampleRate * (detectTime / 1000))

let buffer = [];

const usePitchfinder = true;

//const pitch = new Analyzer(sampleRate);

const notas = [];

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

		if(usePitchfinder) {
			while(buffer.length > detectSize) {
				let analise = buffer.splice(0, detectSize);
	
				for(let x = 0; x < analise.length; x++) {
					//Apply sine window
					//I know there are better ones, idgaf, this one is super easy to generate
					let windowValue = Math.sin((Math.PI / analise.length) * x);
					analise[x] = windowValue * analise[x];
				}
				let pitch = detectPitch(Float32Array.from(analise));
				//notas.push(pitch);
				this.port.postMessage(pitch);
			}
		}
		else {
			while(buffer.length > detectSize) {
				let analise = buffer.splice(0, detectSize);

				pitch.input(analise);
				pitch.process();

				let tone = pitch.findTone();

				if(tone === null) notas.push(-1);
				else notas.push(tone.freq);
			}
		}

		if(notas.length >= 8) {
			let set = notas.splice(0, 8);
			let media = 0;

			for(let i in set) {
				media += set[i];
			}

			media /= 8;

			this.port.postMessage(media);
		}

    return true;
  }
}

registerProcessor("teste", teste);
