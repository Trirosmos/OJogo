let config = {
	showPeriod: 3,
	detectTime: 6.25,
	divisoesNotas: 50,
	compassosPorTela: 4,
	preRollBeats: 8,
};
let serverConfig;

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
		espectador: false,
		playerColors: ["orange","blue", "green"],
		voz: 0
	};
}