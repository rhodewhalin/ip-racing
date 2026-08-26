import { simulateRace, mulberry32, PROFILES } from "./simlib";
import { CONFIG } from "./src/gameConfig";
const PER=Number(process.argv[2]??500), CAP=Number(process.argv[3]??900);
console.log(`프로파일 ${PROFILES.length}종 × ${PER}회 = ${PROFILES.length*PER}회 (${CONFIG.laps}바퀴)\n`);
console.log("프로파일         완주율  중앙값   90%    99%    최대   리스폰  최장무진행  AFK컷");
let cut=0, tot=0, worstNo=0;
for(const p of PROFILES){
  const times:number[]=[]; let fin=0,resp=0,afk=0,noadv=0;
  for(let i=0;i<PER;i++){
    const r=simulateRace(p,CAP,mulberry32(i*7919+p.name.length*31));
    tot++;
    if(r.finished){fin++;times.push(r.timeSec);}
    resp+=r.respawns; noadv=Math.max(noadv,r.maxNoAdvanceSec);
    if(r.maxNoAdvanceSec*1000>CONFIG.afkMs){afk++;cut++;}
  }
  worstNo=Math.max(worstNo,noadv);
  times.sort((a,b)=>a-b);
  const q=(f:number)=>times.length?times[Math.min(times.length-1,Math.floor(times.length*f))]:NaN;
  console.log(`${p.name} ${(fin/PER*100).toFixed(1).padStart(6)}% ${q(0.5).toFixed(0).padStart(5)}s ${q(0.9).toFixed(0).padStart(5)}s ${q(0.99).toFixed(0).padStart(5)}s ${(times.length?times[times.length-1]:0).toFixed(0).padStart(5)}s ${(resp/PER).toFixed(1).padStart(6)} ${noadv.toFixed(0).padStart(9)}s ${String(afk).padStart(6)}`);
}
console.log(`\n총 ${tot}회 · AFK 기준(${CONFIG.afkMs/1000}초) 초과로 끊길 뻔한 판: ${cut}건`);
console.log(`최장 무진행 구간: ${worstNo.toFixed(0)}초 → AFK 기준 ${CONFIG.afkMs/1000}초와의 여유 ${(CONFIG.afkMs/1000-worstNo).toFixed(0)}초`);
