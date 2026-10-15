const run=require('./t.js');
(async()=>{const N=+process.argv[2]||40;const tiers=Array(11).fill(0);const byPos={};
for(const pos of ['GOL','ZAG','LE','LD','VOL','MC','ME','MD','MEI','PE','PD','SA','ATA']){const rs=[];for(let i=0;i<N;i++){rs.push(await run(pos))}
 rs.forEach(r=>tiers[r.tier]++);const avg=k=>(rs.reduce((s,r)=>s+r[k],0)/rs.length).toFixed(1);
 console.log(pos,'tier',avg('tier'),'pts',avg('pts'),'peak',avg('peak'),'titles',avg('t'),'bolas',avg('b'),'idols',avg('idols'),'max',Math.max(...rs.map(r=>r.pts)))}
console.log(tiers.map((v,i)=>`${i+1}:${(v/(N*9)*100).toFixed(1)}%`).join(' '))})();
