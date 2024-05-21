//import {Analyzer} from "./lib/pitch.js"

const Pitchfinder = require("pitchfinder");

const detectPitch = Pitchfinder.ACF2PLUS({
	sampleRate: sampleRate,
});

const detectTime = 25;

const detectSize = Math.round(sampleRate * (detectTime / 1000))

let buffer = [];

const usePitchfinder = true;

const notas = [];

//const pitch = new Analyzer(sampleRate);

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
			if(buffer.length > detectSize) {
				let analise = buffer.splice(0, detectSize);
	
				for(let x = 0; x < analise.length; x++) {
					//Apply sine window
					//I know there are better ones, idgaf, this one is super easy to generate
					let windowValue = Math.sin((Math.PI / analise.length) * x);
					analise[x] = windowValue * analise[x];
				}
	
				//notas.push(detectPitch(Float32Array.from(analise)));
				this.port.postMessage([detectPitch(Float32Array.from(analise))]);
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

		if(notas.length > 10) {
			let subset = notas.splice(0, Math.round(1000 / detectTime));
			this.port.postMessage(subset);
			//console.log(subset);
		}

    return true;
  }
}

registerProcessor("teste", teste);
