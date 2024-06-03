function createSetupControls() {

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