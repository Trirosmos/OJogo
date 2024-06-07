import { WebSocketServer } from 'ws';

const playerColors = ["orange", "blue", "green", "white", "grey", "purple", "red"];
let voiceTaken = [false, false, false, false, false, false, false];

let players = {};
let idCounter = 0;


function getId() {
  idCounter++;
  return idCounter;
}

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws, req) {
  let inicioPing = new Date();
  let fimPing;

  ws.id = getId();
  ws.latency = 0;

  const taVivo = setInterval(() => {
    inicioPing = new Date()
    ws.send(JSON.stringify({
      type: "ping"
    }));

    if(Date.now() - ws.lastPing > 500 && !ws.espectador) {
      clearInterval(taVivo);
      console.log("Desconectando cliente de id " + ws.id + " e cor " + ws.color);

      let colorIndex = playerColors.indexOf(ws.color);

      if(colorIndex !== -1) {
        voiceTaken[colorIndex] = false;
      }

      wss.clients.forEach(function each(client) {
        if(client.espectador) {
          client.send(JSON.stringify({
            type: "disconnect",
            voice: ws.voz
          }));
        }
      });

      return ws.terminate();
    }
  }, 200);

  ws.on('message', function message(e) {
    let msg = JSON.parse(e.toString());

    if(msg.type === "initial") {
      if(!msg.espectador) {
        let nextAvailableVoice = voiceTaken.indexOf(false);
        if(nextAvailableVoice != -1) {
          ws.send(JSON.stringify({
            type: "atribuirVoz",
            voz: nextAvailableVoice,
            cores: playerColors
          }));
  
          ws.color = playerColors[nextAvailableVoice];
          ws.voz = nextAvailableVoice;
        
          voiceTaken[nextAvailableVoice] = true;
        }
      }
      ws.espectador = msg.espectador;
      ws.nome = msg.nome;
    }

    if(msg.type === "start") {
      console.log("Deu start");
      wss.clients.forEach(function each(client) {
        client.send(JSON.stringify({
          type: "start",
          timestamp: (Number(msg.timestamp) + (client.latency)),
          latency: client.latency
        }));
      });
    }

    if(msg.type === "timestamp") {
      wss.clients.forEach(function each(client) {
        if(!client.espectador) {
          client.send(JSON.stringify({
            type: "timestamp",
            value: (Number(msg.value) + (client.latency)),
          }));
        }
      });
    }

    if(msg.type === "stop") {
      wss.clients.forEach(function each(client) {
        client.send(JSON.stringify({
          type: "stop"
        }));
      });
    }

    if(msg.type === "score") {
      wss.clients.forEach(function each(client) {
        if(client.espectador) {
          client.send(JSON.stringify(msg));
        }
      });
    }


    if(msg.type === "pong") {
      fimPing = new Date();
      ws.latency = (fimPing - inicioPing) / 2;
      ws.lastPing = fimPing;
    }

  });
});
