function getNoteAvgFreq(duracao, musica, notas, conf) {
	let intervalo = duracao * getSongData(musica).tempoPorSemicolcheia;
	let quantidadeMedidas = Math.floor(intervalo / (conf.detectTime / 1000));

	if(notas.length > quantidadeMedidas) {
		let notasInteresse = notas.splice(0, quantidadeMedidas).filter((a) => a !== -1);
		if(notasInteresse.length > 0) {
			let avg = notasInteresse.reduce((acc, curr) => acc + curr) / notasInteresse.length;
			return avg;
		}
		else return -1;
	}
	else return -1;
}

function atribuiPontos(musica, notas, numVoz, conf) {
	let notasCopy = Array.from(notas);
	let c = 0;
	let paresPontuacao = [];
	let deltas = [];
	let pontos = 0;

	while(c < musica.compassos.length && notasCopy.length > 0) {
		let compasso = musica.compassos[c];
		let voz = compasso.vozes[numVoz];

		let semicolcheiaCounter = 0;

		for(n in voz.notas) {
			let nota = voz.notas[n];
			let duracao = Math.min(16 - semicolcheiaCounter, nota.duracao);
			semicolcheiaCounter += duracao;

			paresPontuacao.push({
				detectada: getNoteAvgFreq(duracao, musica, notasCopy, conf),
				suposta: nota.altura
			});
		}

		c++;
	}

	for(let i = 1; i < paresPontuacao.length; i++) {
		let antiga = paresPontuacao[i - 1];
		let atual = paresPontuacao[i];

		deltas.push({
			detectada: atual.detectada > antiga.detectada ? 1 : -1,
			suposta: atual.suposta > antiga.suposta ? 1 : -1,
		});
	}

	for(let i = 0; i < deltas.length; i++) {
		if(deltas[i].detectada === deltas[i].suposta) pontos++;
	}

	return pontos;
}