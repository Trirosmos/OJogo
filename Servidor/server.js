import { WebSocketServer } from 'ws';

const playerColors = ["orange", "blue", "green"];
let nextAvailableVoice = 0;

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
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
        client.send(JSON.stringify(msg));
      });
    }

  });
});
