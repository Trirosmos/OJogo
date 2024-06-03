function getSongData(musica) {
	return {
		tempoPorCompasso: 4 / (musica.bpm / 60),
		tempoPorSemicolcheia: (4 / (musica.bpm / 60))/16
	}
}

function desenharFundo(canvas, conf, musica, tempo, corPlayer) {
	let divisoesNotas = conf.divisoesNotas;
	let compassosPorTela = conf.compassosPorTela;

	let ctx = canvas.getContext("2d");
	let blockHeight = canvas.height / (divisoesNotas);
	let tempoPorCompasso = 4 / (musica.bpm / 60);
	let cOffset = (tempo % tempoPorCompasso)/tempoPorCompasso;
	let notaStartPos = -cOffset * (canvas.width / compassosPorTela);

	//Cor de fundo
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(48,48,48)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "white";
	ctx.fillText(Math.round(tempo * 100)/100, canvas.width / 2, 13);

	//Divisões de altura (eixo Y)
	for(let i = -1; i < divisoesNotas + 1; i++) {
		ctx.fillStyle = "rgb(59,59,59)";
		ctx.fillRect(0, canvas.height - blockHeight * i, canvas.width, 2);

		ctx.fillStyle = "white";
		ctx.fillText(i, 5, canvas.height - blockHeight * i - 4);
	}

	//Divisões de compasso (eixo X)
	let largura = canvas.width / compassosPorTela; 

	for(let i = 0; i < (compassosPorTela + 1); i++) {
		ctx.fillStyle = "rgb(91,91,91)";
		ctx.fillRect(notaStartPos + (i * largura) - 1, 0, 3, canvas.height);
	}

	ctx.save();
	ctx.fillStyle = corPlayer;
	ctx.globalAlpha = 0.8;
	ctx.fillRect(canvas.width / 2, 0, 3, canvas.height);
	ctx.restore();
}

function desenharVoz(canvas, conf,  musica, tempo, numVoz, cor) {
	let divisoesNotas = conf.divisoesNotas;
	let compassosPorTela = conf.compassosPorTela;

	let ctx = canvas.getContext("2d");
	let blockHeight = canvas.height / (divisoesNotas);
	let semicolcheiaWidth = canvas.width / (compassosPorTela * 16);

	let tempoPorCompasso = getSongData(musica).tempoPorCompasso;

	tempo -= Math.floor(compassosPorTela / 2) * tempoPorCompasso;

	let c = tempo > 0 ? Math.floor(tempo / tempoPorCompasso) : -Math.floor((-tempo) / tempoPorCompasso);
	let cOffset = (tempo % tempoPorCompasso)/tempoPorCompasso;
	let notaStartPos =  -cOffset * (canvas.width / compassosPorTela);

	ctx.fillStyle = cor;

	while(c < musica.compassos.length) {
		if(c < 0) {
			c++;
			notaStartPos += semicolcheiaWidth * 16;
			continue;
		}

		let compasso = musica.compassos[c];
		let voz = compasso.vozes[numVoz];

		let semicolcheiaCounter = 0;

		if(notaStartPos >= canvas.width) {
			break;
		}

		for(n in voz.notas) {
			let nota = voz.notas[n];
			let duracao = Math.min(16 - semicolcheiaCounter, nota.duracao);

			ctx.save();
			ctx.globalAlpha = 0.8;
			ctx.fillRect(notaStartPos, canvas.height - blockHeight * (nota.altura + 1), semicolcheiaWidth * duracao, blockHeight);
			ctx.restore();

			notaStartPos += semicolcheiaWidth * nota.duracao;
			semicolcheiaCounter += duracao;
		}

		c++;
	}
}

function desenharPitchDetect(canvas, conf, musica, tempo, notas) {
	let detectTime = conf.detectTime;
	let divisoesNotas = conf.divisoesNotas;
	let compassosPorTela = conf.compassosPorTela;

	let ctx = canvas.getContext("2d");

	let blockHeight = canvas.height / (divisoesNotas);
	let blockWidth = canvas.width * (detectTime / 1000) / (compassosPorTela * getSongData(musica).tempoPorCompasso);
	let startIndex = Math.round((tempo * 1000) / detectTime);

	ctx.fillStyle = "rgb(100,100, 255)";

	for(let i = startIndex; i > 0; i--) {
		let nota = notas[i];
		ctx.fillRect((canvas.width / 2) - (blockWidth * (startIndex - i)), (canvas.height - blockHeight * nota) + blockHeight / 2, blockWidth, 2);
	}
}

function iir(buff,cutoff,lowpass, sampleRate) {
	//https://en.wikipedia.org/wiki/High-pass_filter#Discrete-time_realization
	//https://en.wikipedia.org/wiki/Low-pass_filter#Discrete-time_realization
	var rc = 1/(2 * Math.PI * cutoff);
	var sampleTime = 1/sampleRate;
	var alpha = lowpass ? sampleTime / (sampleTime + rc) : rc / (sampleTime + rc);
	
	if(buff.length < 1) return [];

	var result = Array(buff.length);
	var lastOut = 0;

	for(x = 0; x < result.length; x++) {
			if(lowpass) result[x] = lastOut + alpha * (buff[x] - lastOut);
			else {
					var lastIn = x === 0 ? 0 : buff[x - 1];
					result[x] = lastOut * alpha + (buff[x] - lastIn) * alpha
			}

			lastOut = result[x];
	}

	return result;
}