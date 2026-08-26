// 무작위 파라미터 대규모 검증: 어떤 조합에서도 완주가 되는가
import { simulateRace, mulberry32, Profile } from "./simlib";
import { CONFIG } from "./src/gameConfig";

const N = Number(process.argv[2] ?? 10000);
const CAP = Number(process.argv[3] ?? 900);
const rnd = mulberry32(20260826);
const R = (a:number,b:number)=>a+rnd()*(b-a);

let fin=0, afkCut=0, over300=0, over600=0;
const times:number[]=[]; const fails:any[]=[];
let maxNoAdv=0, maxResp=0;

for(let i=0;i<N;i++){
  const p:Profile={
    name:"rand",
    lookahead:R(300,700), gain:R(0.3,2.6), reactTicks:Math.floor(R(0,32)),
    inputHz:R(1,25), driftChance:R(0,1), brakeSkill:rnd()<0.35?0:R(0.1,1),
    quizAccuracy:R(0.1,0.95), idleChance:R(0,0.6),
    quizLiftSec:R(0,8), quizStop:rnd()<0.5,
  };
  const r=simulateRace(p,CAP,mulberry32(i*104729+7));
  maxNoAdv=Math.max(maxNoAdv,r.maxNoAdvanceSec);
  maxResp=Math.max(maxResp,r.respawns);
  if(r.maxNoAdvanceSec*1000>CONFIG.afkMs) afkCut++;
  if(r.finished){fin++;times.push(r.timeSec); if(r.timeSec>300)over300++; if(r.timeSec>600)over600++;}
  else fails.push({p,r});
}
times.sort((a,b)=>a-b);
const q=(f:number)=>times[Math.min(times.length-1,Math.floor(times.length*f))];
console.log(`무작위 프로파일 ${N}회 (${CONFIG.laps}바퀴, 상한 ${CAP}초)\n`);
console.log(`완주율        : ${(fin/N*100).toFixed(2)}%  (${fin}/${N})`);
console.log(`AFK 기준 초과 : ${afkCut}건  (기준 ${CONFIG.afkMs/1000}초)`);
console.log(`최장 무진행   : ${maxNoAdv.toFixed(0)}초 · 최다 리스폰 ${maxResp}회`);
console.log(`\n완주 시간   중앙값 ${q(0.5).toFixed(0)}s · 90% ${q(0.9).toFixed(0)}s · 99% ${q(0.99).toFixed(0)}s · 최대 ${times[times.length-1].toFixed(0)}s`);
console.log(`300초 초과 ${over300}건(${(over300/fin*100).toFixed(1)}%) · 600초 초과 ${over600}건(${(over600/fin*100).toFixed(1)}%)`);
if(fails.length){
  console.log(`\n⚠️ 미완주 ${fails.length}건 — 최악 사례:`);
  fails.slice(0,3).forEach(f=>console.log(`  랩 ${f.r.laps}/${CONFIG.laps} 무진행 ${f.r.maxNoAdvanceSec.toFixed(0)}s gain=${f.p.gain.toFixed(2)} react=${f.p.reactTicks} hz=${f.p.inputHz.toFixed(1)} idle=${f.p.idleChance.toFixed(2)} lift=${f.p.quizLiftSec.toFixed(1)} stop=${f.p.quizStop}`));
} else {
  console.log(`\n✅ 미완주 0건`);
}
