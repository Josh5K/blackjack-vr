import { Request } from "express";
import { Socket } from "dgram";
import { MessageHandler } from "./lib/message-handler"
import { Update, UpdateType } from './lib/update'
import { replaceWs } from './lib/utility'

const express = require('express');
const ws = require('ws');
const app = express();
const maxPlayers = 3;

export const wss = new ws.Server({ noServer: true });

wss.on('connection',(ws: any) => {
  if(wss.clients.size > maxPlayers) {
    ws.send(JSON.stringify({"type": "ServerFull", "value": "Server Full!"}))
    ws.terminate();
  }

  ws.id = wss.getUniqueID();
  ws.isAlive = true;

  var clientUpdate:Update = new Update(UpdateType.Client, ws.id, {"id": ws.id})
  ws.send(JSON.stringify(clientUpdate, replaceWs))

  ws.on('message', (message: string) => {
    MessageHandler.handleMessage(JSON.parse(message), ws);
  });

  ws.on('close', () => {
    MessageHandler.gm.DeletePlayer(ws.id);
    console.log(`Client ${ws.id} disconnected!`);
  })

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  setInterval(() => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping(() => {});
  }, 5000);
});

wss.getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

wss.broadcast = function broadcast(msg: string) {
  wss.clients.forEach(function each(client: any) {
      client.send(msg);
   });
};

const server = app.listen(3000);

server.on('upgrade', (request: Request, socket: Socket, head: any) => {
  wss.handleUpgrade(request, socket, head, (socket: any) => {
    wss.emit('connection', socket, request);
  });
});
