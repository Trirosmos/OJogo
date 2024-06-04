function criarSpan(texto, cor) {
	let coiso = document.createElement("span");
	coiso.innerHTML = texto;
	if(cor) coiso.style.color = cor;

	return coiso;
}

function createSetupControls(wind) {
	const audioText = document.createElement("h2");
	audioText.innerHTML = "Opções de áudio:"
	audioText.style.color = "white";

	const volume = document.createElement("input");
	volume.type = "range";
	volume.min = 0;
	volume.max = 40;
	volume.value = "1";
	volume.step = 0.1;

	const volumeShow = criarSpan("1 dB", "white");

	volume.onchange = function (e) {
		if(gainNode) gainNode.gain.setValueAtTime(Number(e.target.value), context.currentTime);
		volumeShow.innerHTML = volume.value + " dB";
	}

	const gateLevel = document.createElement("input");
	gateLevel.type = "range";
	gateLevel.max = 0;
	gateLevel.min = -60;
	gateLevel.value = -20;
	gateLevel.step = 0.5;

	const gateShow = criarSpan("1 dB", "white");

	gateLevel.onchange = function (e) {
		if(worklet) {
			worklet.port.postMessage({type: "gateLevel", value: Math.abs(Number(gateLevel.value))});
		}
		gateShow.innerHTML = gateLevel.value + " dB";
	}

	const monitorarToggle = document.createElement("input");
	monitorarToggle.type = "checkbox";

	monitorarToggle.onchange = function (e) {
		if(worklet) {
			worklet.port.postMessage({ type: "monitorarToggle", value: monitorarToggle.checked });
		}
	}

	const conexaoText = document.createElement("h2");
	conexaoText.innerHTML = "Opções de conexão:"
	conexaoText.style.color = "white";

	const ipInput = document.createElement("input");

	ipInput.onchange = function () {
		serverConfig.ip = ipInput.value;
	}

	const nomeInput = document.createElement("input");

	nomeInput.onchange = function () {
		serverConfig.nome = nomeInput.value;
	}

	const espectadorToggle = document.createElement("input");
	espectadorToggle.type = "checkbox";

	let bot = document.createElement("button");
	bot.innerText = "Conectar";
	bot.style.width = "20%";
	bot.style.height = "20%";

	bot.onclick = function () {
		sock = new WebSocket(
			"ws://" + serverConfig.ip
		);

		sock.onerror = function (e) {
			alert("Erro ao conectar ao servidor de websocket");
		};

		sock.onopen = function (e) {
			console.log("Conectou!");
			handleSuccess();
			wind.remove();
		}
	}

	espectadorToggle.onchange = function () {
		serverConfig.espectador = espectadorToggle.checked;
	}

	wind.appendChild(audioText);
	wind.appendChild(criarSpan("Volume:", "white"));
	wind.appendChild(volume);
	wind.appendChild(volumeShow);
	wind.appendChild(document.createElement("br"));
	wind.appendChild(document.createElement("br"));

	wind.appendChild(criarSpan("Nível de gate:", "white"));
	wind.appendChild(gateLevel);
	wind.appendChild(gateShow);
	wind.appendChild(document.createElement("br"));
	wind.appendChild(document.createElement("br"));

	wind.appendChild(criarSpan("Monitorar áudio?", "white"));
	wind.appendChild(monitorarToggle);
	wind.appendChild(document.createElement("br"));

	wind.appendChild(conexaoText);

	wind.appendChild(criarSpan("IP do servidor:", "white"));
	wind.appendChild(ipInput);
	wind.appendChild(document.createElement("br"));

	wind.appendChild(criarSpan("Nome de usuário:", "white"));
	wind.appendChild(nomeInput);
	wind.appendChild(document.createElement("br"));

	wind.appendChild(criarSpan("Espectador?", "white"));
	wind.appendChild(espectadorToggle);
	wind.appendChild(document.createElement("br"));
	wind.appendChild(document.createElement("br"));
	wind.appendChild(document.createElement("br"));
	wind.appendChild(bot);

}

function createSetupWindow() {
	let wind = document.createElement("div");
	let bot = document.createElement("button");

	let largura = Math.round(window.innerWidth * 0.7);
	let altura = Math.round(window.innerHeight * 0.7);

	wind.style.position = "absolute";
	wind.style.width = largura + "px";
	wind.style.height = altura + "px";
	wind.style.top = Math.round((window.innerHeight - altura) / 2) + "px";
	wind.style.left = Math.round((window.innerWidth - largura) / 2) + "px";
	wind.style.border = "4px solid white";
	wind.style.borderRadius = "10px";

	bot.innerText = "Começar!";
	bot.style.position = "absolute";
	bot.style.left = "40%";
	bot.style.top = "40%";
	bot.style.width = "20%";
	bot.style.height = "20%";

	wind.appendChild(bot);

	bot.onclick = function () {
		navigator.mediaDevices
		.getUserMedia({
			audio: {
				autoGainControl: false,
				echoCancellation: false,
				noiseSuppression: false
			},
			video: false
		})
			.then(setupWebAudio);
		
		createSetupControls(wind);
		bot.remove();

		
	}

	document.body.appendChild(wind);

}