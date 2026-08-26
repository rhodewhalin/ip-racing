import { simulateRace, mulberry32, Profile } from "./simlib";
import { CONFIG } from "./src/gameConfig";
const N=Number(process.argv[2]??6000), CAP=900;
const rnd=mulberry32(20260826); const R=(a:number,b:number)=>a+rnd()*(b-a);
const profs:Profile[]=[];
for(let i=0;i<N;i++) profs.push({name:"r",lookahead:R(300,700),gain:R(0.3,2.6),reactTicks:Math.floor(R(0,32)),
  inputHz:R(1,25),driftChance:R(0,1),brakeSkill:rnd()<0.35?0:R(0.1,1),quizAccuracy:R(0.1,0.95),
  idleChance:R(0,0.6),quizLiftSec:R(0,8),quizStop:rnd()<0.5});
console.log("랩수별 비교 (무작위 프로파일 " + N + "회)\n");
console.log("랩  완주율   중앙값   75%    90%    99%    최대   5분초과");
for(const L of [3,2,1]){
  const t:number[]=[]; let fin=0,over=0;
  profs.forEach((p,i)=>{const r=simulateRace(p,CAP,mulberry32(i*104729+7),L);
    if(r.finished){fin++;t.push(r.timeSec); if(r.timeSec>300)over++;}});
  t.sort((a,b)=>a-b);
  const q=(f:number)=>t[Math.min(t.length-1,Math.floor(t.length*f))];
  console.log(`${L}  ${(fin/N*100).toFixed(2).padStart(6)}%  ${q(0.5).toFixed(0).padStart(5)}s ${q(0.75).toFixed(0).padStart(5)}s ${q(0.9).toFixed(0).padStart(5)}s ${q(0.99).toFixed(0).padStart(5)}s ${t[t.length-1].toFixed(0).padStart(5)}s  ${(over/fin*100).toFixed(1).padStart(6)}%`);
}
