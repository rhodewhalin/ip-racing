// ============================================================
// 서버 부트스트랩 (Colyseus 0.15.x)
// 참고: 더 최신(0.16+) Colyseus를 쓰면 transport import가 달라질 수 있음.
// 그 경우 @colyseus/ws-transport 를 추가하고 아래 Server 생성부만 교체.
// ============================================================

import http from "http";
import express from "express";
import { Server } from "colyseus";
import { RaceRoom } from "./RaceRoom";

const port = Number(process.env.PORT) || 2567;
const app = express();
app.get("/", (_req, res) => res.send("IP Racing server is running."));

const gameServer = new Server({ server: http.createServer(app) });
gameServer.define("race", RaceRoom);

gameServer.listen(port).then(() => {
  console.log(`[IP Racing] Colyseus listening on ws://localhost:${port}`);
});
