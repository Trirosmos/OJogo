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
	ipInput.value = serverConfig.ip;

	ipInput.onchange = function () {
		serverConfig.ip = ipInput.value;
		localStorage.setItem("serverConfig", JSON.stringify(serverConfig));
	}

	const nomeInput = document.createElement("input");
	nomeInput.value = serverConfig.nome;

	nomeInput.onchange = function () {
		serverConfig.nome = nomeInput.value;
		localStorage.setItem("serverConfig", JSON.stringify(serverConfig));
	}

	const espectadorToggle = document.createElement("input");
	espectadorToggle.type = "checkbox";

	espectadorToggle.onchange = function () {
		serverConfig.espectador = espectadorToggle.checked;
		localStorage.setItem("serverConfig", JSON.stringify(serverConfig));
	}

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

			sock.send(JSON.stringify({
				type: "initial",
				espectador: serverConfig.espectador,
				nome: serverConfig.nome
			}));

			window.setInterval(() => {
				if(sock && !serverConfig.espectador) {
					sock.send(JSON.stringify({
						type: "score",
						score: atribuiPontos(song, notas, 0, config),
						voz: serverConfig.voz,
						cor: serverConfig.playerColors[serverConfig.voz],
						nome: serverConfig.nome
					}));
				}
			});
		}

		sock.onmessage = (e) => {
			let msg = JSON.parse(e.data);

			if(msg.type === "atribuirVoz") {
				serverConfig.voz = msg.voz;
				serverConfig.playerColors = msg.cores;
				localStorage.setItem("serverConfig", JSON.stringify(serverConfig));
			}

			if(msg.type === "start" && !serverConfig.espectador) {
				notas = [];
				//timeStamp0 = new Date(msg.timestamp)
				timeStamp0 = new Date();
				timeStamp0 -= msg.latency;
				started = true;

				console.log("Começamo");
				console.log(timeStamp0);
			}

			if(msg.type === "ping" && !serverConfig.espectador) {
				sock.send(JSON.stringify({
					type: "pong"
				}));
			}

			if(msg.type === "timestamp" && !serverConfig.espectador) {
				let now = new Date();
				let then = msg.value;
				timeStamp0 = now - then;
			}

			if(msg.type === "stop" && !serverConfig.espectador) {
				started = false;
				backingTrack.currentTime = 0;
				backingTrack.pause();
			}

			if(msg.type === "score" && serverConfig.espectador) {
				if(!playerData[msg.voz]) playerData[msg.voz] = {};

				playerData[msg.voz].score = msg.score;
				playerData[msg.voz].cor = msg.cor;
				playerData[msg.voz].nome = msg.nome;
			}

			if(msg.type === "disconnect" && serverConfig.espectador) {
				playerData.splice(msg.voz, 1);
				console.log(playerData);
			}
		};
	}

	

	let localStorageBot = document.createElement("button");
	localStorageBot.innerHTML = "Resetar localstorage";

	localStorageBot.onclick = function () {
		localStorage.removeItem("serverConfig");
	};

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
	wind.appendChild(document.createElement("br"));
	wind.appendChild(localStorageBot);

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