let config;
let serverConfig;

if(localStorage.getItem("config")) {
	config = JSON.parse(localStorage.getItem("config"));
}
else {
	config = {
		showPeriod: 3,
		detectTime: 6.25,
		divisoesNotas: 50,
		compassosPorTela: 4,
		preRollBeats: 4
	};

	localStorage.setItem("config", JSON.stringify(config));
}


if(localStorage.getItem("serverConfig")) {
	serverConfig = JSON.parse(localStorage.getItem("serverConfig"));
}
else {
	serverConfig = {
		showPeriod: 3,
		detectTime: 6.25,
		divisoesNotas: 50,
		compassosPorTela: 4,
		preRollBeats: 4
	};

	localStorage.setItem("serverConfig", JSON.stringify(serverConfig));

	serverConfig = {
		ip: "127.0.0.1",
		nome: "Fulano",
		espectador: true
	};
}