import { WebSocketServer } from 'ws';

const playerColors = ["orange", "blue", "green"];
let nextAvailableVoice = 0;

let players = {};

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  let inicioPing = new Date();
  let fimPing;
  let ip = req.socket.remoteAddress;

  players[ip] = {
    latency: 0
  };

  ws.send(JSON.stringify({
    type: "ping"
  }));

  setInterval(() => {
    inicioPing = new Date()
    ws.send(JSON.stringify({
      type: "ping"
    }));
  }, 200);

  ws.on('message', function message(e) {
    let msg = JSON.parse(e.toString());

    if(msg.type === "initial") {
      if(!msg.espectador) {
        ws.send(JSON.stringify({
          type: "atribuirVoz",
          voz: nextAvailableVoice,
          cores: playerColors
        }));
      
        if(nextAvailableVoice < 3) nextAvailableVoice++;
      }
    }

    if(msg.type === "start") {
      console.log("Deu start");
      wss.clients.forEach(function each(client) {
        let player = players[client._socket._peername.address];
        if(player) {
          let latencia = player.latency;
          client.send(JSON.stringify({
            type: "start",
            timestamp: (Number(msg.timestamp) + (latencia)),
            latency: latencia
          }));
        }
      });
    }

    if(msg.type === "timestamp") {
      wss.clients.forEach(function each(client) {
        let player = players[client._socket._peername.address];
        if(player) {
          let latencia = player.latency;
          client.send(JSON.stringify({
            type: "timestamp",
            value: (Number(msg.value) + (latencia)),
          }));
        }
      });
    }

    if(msg.type === "stop") {
      wss.clients.forEach(function each(client) {
        let player = players[client._socket._peername.address];
        if(player) {
          client.send(JSON.stringify({
            type: "stop"
          }));
        }
      });
    }


    if(msg.type === "pong") {
      fimPing = new Date();
      players[ip].latency = (fimPing - inicioPing) / 2;
    }

  });
});
