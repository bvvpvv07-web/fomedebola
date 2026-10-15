const fs=require('fs');
eval(fs.readFileSync('data.js','utf8')+fs.readFileSync('logic.js','utf8')+fs.readFileSync('youth.js','utf8')+`
async function run(pos){
 const bag=shuffle(LEGENDS.map((_,i)=>i));const attrs={};
 for(let r=0;r<8;r++){const L=LEGENDS[bag.pop()];const vals=Object.fromEntries(ATTRS.map((k,j)=>[k,L[4][j]]));let best=null,bv=-1;for(const k of ATTRS){if(attrs[k]!=null)continue;const v=(POS[pos].w[k]||0.001)*(vals[k]-60);if(v>bv){bv=v;best=k}}attrs[best]=vals[best]}
 newCareer({name:'T',num:9,nat:'BRA',pos,diff:'pro',attrs});
 acceptOffer(autoOffer(academyOffers()));
 let g=0;
 while(g++<30){buildSeason();await stepSeason(IO_AUTO,'sim');const ls=endSeason();
  if(process.env.V)console.log(S.age-1,S.club,LG[CLUB[S.club].l].n,'ovr',ls.row.ovr,'j',ls.row.games,'g',ls.row.goals,'a',ls.row.assists,'n',ls.row.nota,'rk',ls.rank,ls.myMove?ls.myMove.dir:'','T:',ls.titles.map(t=>t.n).join('|'),'A:',ls.awards.map(a=>a.n).join('|'));
  if(mustRetire()||S.age>=36&&S.ovr<70||S.age>=39)break;
  const w=windowState();if(w.forced)endLoan();else if(w.open){let o=genOffers();if(w.stay||w.renew)o.unshift(stayOffer());if(o.length)acceptOffer(autoOffer(o.slice(0,3)))}}
 const L=legacy();return{tier:L.tier,pts:L.pts,b:L.bolas,peak:S.peak,t:S.titles.length,idols:S.idols.length};
}
module.exports=run;`);
