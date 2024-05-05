const Pitchfinder = require("pitchfinder");

const detectPitch = Pitchfinder.AMDF();


class teste extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = (Math.random() * 2 - 1) * 0.1;
      }
    });
    return true;
  }
}

registerProcessor("teste", teste);
