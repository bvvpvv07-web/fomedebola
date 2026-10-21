// ================== CAMPEONATOS: regras reais, playoffs, continentais e balanço por competição ==================
// Critérios de desempate por país, acesso/rebaixamento com playoffs (Inglaterra, Espanha, Itália, Alemanha, França,
// Portugal, Holanda), suspensão por cartão por liga, Champions/Europa/Conference com fase de liga de 36 clubes,
// Libertadores com o 3º do grupo caindo pra Sul-Americana, todas as ligas simuladas rodada a rodada e, no balanço,
// pop-ups de cada campeonato + briga de artilharia e de assistências.

// ---------- regras ----------
const CAMP_TB={BRA:['p','v','sg','gp','h2h'],ENG:['p','sg','gp','h2h'],ESP:['p','h2h','sg','gp'],ITA:['p','h2h','sg','gp'],GER:['p','sg','gp','h2h'],FRA:['p','sg','gp','h2h'],POR:['p','h2h','sg','gp'],NED:['p','sg','gp','h2h'],ARG:['p','sg','gp','h2h'],USA:['p','v','sg','gp'],KSA:['p','h2h','sg','gp']};
const CAMP_TB_TXT={p:'pontos',v:'vitórias',sg:'saldo de gols',gp:'gols marcados',h2h:'confronto direto'};
// playoff de acesso na liga de baixo (posições) e playoff de rebaixamento na de cima (posição que joga contra o 3º de baixo)
const CAMP_PO={ENG2:{po:[3,6],n:'Playoff da Championship',fin:'Final em Wembley'},ESP2:{po:[3,6],n:'Playoff de ascenso',seed:true},ITA2:{po:[3,8],n:'Playoff da Serie B',seed:true},
 GER1:{rpo:16,n:'Relegation (playoff de rebaixamento)'},FRA1:{rpo:16,n:'Barrage (playoff de rebaixamento)'},POR1:{rpo:16,n:'Playoff de manutenção'},NED1:{rpo:16,n:'Playoff de rebaixamento'}};
const CAMP_YEL={BRA:3,FRA:3,ITA:5,ENG:5,ESP:5,GER:5,POR:5,NED:5,ARG:5,USA:5,KSA:5};
const CAMP_LP={UCL:{size:36,direct:8,po:24},UEL:{size:36,direct:8,po:24},UECL:{size:36,direct:8,po:24},ACL:{size:24,direct:16,po:16}};
function campYel(){try{return CAMP_YEL[LG[S.st.lg].c]||5}catch(e){return 5}}
function campAutoUp(lower){const L=LG[lower];if(!L||!L.prev)return 0;const n=LG[L.prev].down||0;return CAMP_PO[lower]&&CAMP_PO[lower].po?Math.max(0,n-1):n}

// ---------- tabela com confronto direto ----------
{const _ta=tabAdd;tabAdd=function(tab,h,a,gh,ga){_ta(tab,h,a,gh,ga);const H=tab[h],A=tab[a];if(!H||!A)return;
 H.h2h=H.h2h||{};A.h2h=A.h2h||{};const x=H.h2h[a]=H.h2h[a]||[0,0,0],y=A.h2h[h]=A.h2h[h]||[0,0,0];
 x[1]+=gh;x[2]+=ga;y[1]+=ga;y[2]+=gh;if(gh>ga)x[0]+=3;else if(gh<ga)y[0]+=3;else{x[0]++;y[0]++}}}
function campCmp(rules){return(a,b)=>{for(const r of rules){let d=0;
  if(r==='p')d=b.p-a.p;else if(r==='v')d=(b.v||0)-(a.v||0);else if(r==='sg')d=(b.gp-b.gc)-(a.gp-a.gc);else if(r==='gp')d=b.gp-a.gp;
  else if(r==='h2h'&&a.p===b.p){const x=(a.h2h||{})[b.id],y=(b.h2h||{})[a.id];if(x&&y){d=(y[0]-x[0])||((y[1]-y[2])-(x[1]-x[2]))}}
  if(d)return d}return 0}}
function campRules(lg){const c=lg&&LG[lg]?LG[lg].c:null;return CAMP_TB[c]||['p','sg','gp','v']}
{const _st=sortTable;sortTable=function(tab,lg){try{if(!lg&&S&&S.st&&tab===S.st.table)lg=S.st.lg;return Object.values(tab).sort(campCmp(campRules(lg)))}catch(e){return _st(tab)}}}

// ---------- todas as ligas simuladas de verdade (turno e returno) ----------
function campSimLeague(l){const cl=leagueClubs(l);const ids=cl.map(c=>c.id);const tab={};ids.forEach(id=>tab[id]={id,p:0,j:0,v:0,e:0,d:0,gp:0,gc:0});
 let rounds=roundRobin(shuffle(ids.slice()));if(LG[l].rr)rounds=rounds.slice(0,rounds.length/2);
 for(const rd of rounds)for(const[h,a]of rd){const[gh,ga]=quickScore(CLUB[h].s,CLUB[a].s);tabAdd(tab,h,a,gh,ga)}
 const rows=sortTable(tab,l);W.tables=W.tables||{};W.tables[l]={y:S.year,rows:rows.map(r=>({id:r.id,p:r.p,j:r.j,v:r.v,e:r.e,d:r.d,gp:r.gp,gc:r.gc}))};return rows}
function campSimOrder(l){return campSimLeague(l).map(r=>r.id)}

// ---------- acesso, rebaixamento e playoffs ----------
function campTie(a,b,legs,seed){let ga=0,gb=0;for(let i=0;i<legs;i++){const home=legs===1?null:(i===0?b:a);const[x,y]=quickScore(CLUB[a].s,CLUB[b].s,legs===1?0:(home===a?2:-2));ga+=x;gb+=y}
 if(ga!==gb)return ga>gb?a:b;if(seed)return a;return ch(clamp(.5+(CLUB[a].s-CLUB[b].s)/40,.25,.75))?a:b}
function campPOWinner(lower,ids){const R=CAMP_PO[lower];let t=ids.slice();
 if(t.length===6){const w1=campTie(t[2],t[5],1,R.seed),w2=campTie(t[3],t[4],1,R.seed);t=[t[0],t[1],w2,w1]}
 const s1=campTie(t[0],t[3],2,R.seed),s2=campTie(t[1],t[2],2,R.seed);return campTie(s1,s2,R.fin?1:2,R.seed&&CLUB[s1]&&ids.indexOf(s1)<ids.indexOf(s2))}
function campMoves(order,me,st){const moves=[];let my=null;const recap=[];
 for(const l in LG){const Lx=LG[l];if(!Lx.next||!Lx.down)continue;const n=Lx.next;const Ru=CAMP_PO[l]||{},Rn=CAMP_PO[n]||{};
  const down=order[l].slice(-Lx.down);const up=order[n].slice(0,campAutoUp(n));
  if(Rn.po){const ids=order[n].slice(Rn.po[0]-1,Rn.po[1]);let w;const acc=st.comps.acc;
   if(ids.includes(me.id)&&acc&&acc.done)w=acc.won?me.id:(acc.otherWinner&&ids.includes(acc.otherWinner)?acc.otherWinner:ids.find(x=>x!==me.id));
   else{w=campPOWinner(n,ids);if(ids.includes(me.id)&&acc&&!acc.done&&w===me.id)w=ids.find(x=>x!==me.id)}
   up.push(w);recap.push({k:'po',l:n,n:Rn.n,w})}
  if(Ru.rpo){const a=order[l][Ru.rpo-1],b=order[n][2];if(a&&b){let w;if(st.comps.rpo&&st.comps.rpo.done&&(a===me.id))w=st.comps.rpo.won?a:b;else if(st.comps.rpo&&st.comps.rpo.done&&b===me.id)w=st.comps.rpo.won?b:a;else w=campTie(a,b,2,false);
    if(w===b){down.push(a);up.push(b)}recap.push({k:'rpo',l,n:Ru.n,a,b,w})}}
  for(const id of down){CLUB[id].l=n;moves.push([id,'down',n]);if(id===me.id)my={dir:'down',to:n}}
  for(const id of up){CLUB[id].l=l;moves.push([id,'up',l]);if(id===me.id)my={dir:'up',to:l}}
 }
 S.campPO=recap;return{moves,my}}

// playoffs jogáveis quando o SEU clube termina na zona
{const _bs=buildSeason;buildSeason=function(){const st=_bs();try{const me=club();const L=LG[me.l];const R=CAMP_PO[me.l];if(!R||S.youth)return st;
  let n=0;if(R.po){st.comps.acc={id:'acc',n:R.n,ic:'acesso',t:'acesso',kind:'ko',rounds:[{n:'Semifinal',legs:2},{n:R.fin?'Final':'Final',legs:R.fin?1:2,neutral:!!R.fin}],stage:0,alive:true,path:[],pool:[],campPO:true};n=R.po[1]-R.po[0]>3?3:2;if(R.po[1]-R.po[0]>3)st.comps.acc.rounds.unshift({n:'Preliminar',legs:1})}
  if(R.rpo){st.comps.rpo={id:'rpo',n:R.n,ic:'liga',t:'rpo',kind:'ko',rounds:[{n:'Playoff',legs:2}],stage:0,alive:true,path:[],pool:[],campPO:true};n=1}
  const cid=R.po?'acc':'rpo';let at=-1;st.cal.forEach((it,i)=>{if(it.k==='lg')at=i});
  while(at+1<st.cal.length&&st.cal[at+1].k!=='tg'&&!['mun','mlscup','wc','natc','oly'].includes(st.cal[at+1].cid))at++;
  const add=[];for(let i=0;i<(st.comps[cid].rounds.length);i++)add.push({k:'ko',cid});st.cal.splice(at+1,0,...add)}catch(e){console.warn(e)}return st}}
{const _pi=processItem;processItem=async function(it,io){try{const st=S.st;if(it.k==='ko'&&(it.cid==='acc'||it.cid==='rpo')){const comp=st.comps[it.cid];if(!comp||!comp.alive)return null;
   if(!comp.setup){comp.setup=true;const me=club();const t=sortTable(st.table);const pos=t.findIndex(x=>x.id===me.id)+1;const R=CAMP_PO[me.l];
    if(it.cid==='acc'){const[a,b]=R.po;if(pos<a||pos>b){comp.alive=false;comp.skip=true;return null}
     const ids=t.slice(a-1,b).map(x=>x.id);
     if(ids.length===6){// preliminar: 5x8, 6x7 (jogo único na casa do melhor); semis: 3 x vencedor 6x7... simplificado: 3x(6/7), 4x(5/8)
      const idx=ids.indexOf(me.id);if(idx<=1){comp.rounds.shift();const other=idx===0?campTie(ids[3],ids[4],1,true):campTie(ids[2],ids[5],1,true);comp.rounds[0].opp=other;comp.semiOther=idx===0?[ids[1],campTie(ids[2],ids[5],1,true)]:[ids[0],campTie(ids[3],ids[4],1,true)]}
      else{const pair={2:5,3:4,4:3,5:2}[idx];comp.rounds[0].opp=ids[pair];comp.rounds[1].opp=idx===2||idx===5?ids[1]:ids[0];comp.semiOther=idx===2||idx===5?[ids[0],campTie(ids[3],ids[4],1,true)]:[ids[1],campTie(ids[2],ids[5],1,true)]}}
     else{const idx=ids.indexOf(me.id);comp.rounds[0].opp=ids[3-idx];comp.semiOther=idx===0||idx===3?[ids[1],ids[2]]:[ids[0],ids[3]]}
     const so=comp.semiOther;comp.otherWinner=campTie(so[0],so[1],2,!!R.seed);comp.rounds[comp.rounds.length-1].opp=comp.otherWinner;comp.zone=`${pos}º lugar`}
    else{if(pos!==R.rpo){comp.alive=false;comp.skip=true;return null}const lower=LG[me.l].next;const lt=campSimLeague(lower);comp.rounds[0].opp=lt[2].id;comp.zone=`${pos}º lugar`}
    try{toast({ic:it.cid==='acc'?'⬆️':'⚠️',title:comp.n,txt:it.cid==='acc'?`Você terminou em ${pos}º: vai disputar o playoff de acesso.`:`Você terminou em ${pos}º: playoff contra o 3º da divisão de baixo pra não cair.`,ms:4200})}catch(e){}}
   const nT=st.titles.length;const r=await _pi(it,it.cid==='rpo'?{...io,celebrate:null}:io);if(st.titles.length>nT&&st.titles[st.titles.length-1].n===comp.n)st.titles.pop();if(!comp.alive||comp.won){comp.done=true}return r}}catch(e){console.warn(e)}return _pi(it,io)}}

// ---------- continentais com formato real ----------
function campLP(comp,res,I,me){const F=CAMP_LP[comp.code]||{size:36,direct:8,po:24};
 let parts=(comp.pool||[]).filter(x=>CLUB[x]&&x!==me.id);
 const conf=comp.code==='ACL'?'AS':'EU';const extra=CLUBS.filter(c=>COUNTRY[c.country]&&COUNTRY[c.country].conf===conf&&LG[c.l].tier===1&&!parts.includes(c.id)&&c.id!==me.id).sort((a,b)=>b.s-a.s);
 parts=parts.concat(extra.slice(0,Math.max(0,F.size-1-parts.length)).map(c=>c.id)).slice(0,F.size-1);
 const tab={};[me.id,...parts].forEach(id=>tab[id]={id,p:0,j:0,v:0,e:0,d:0,gp:0,gc:0});
 for(const r of comp.path){if(r.cid!=='cont')continue;const gh=r.hg,ga=r.ag;const h=r.home.id,a=r.away.id;const T=tab[me.id];T.j++;const us=h===me.id?gh:ga,th=h===me.id?ga:gh;T.gp+=us;T.gc+=th;if(us>th){T.v++;T.p+=3}else if(us===th){T.e++;T.p++}else T.d++}
 const m=I.m||8;for(const id of parts){const T=tab[id];for(let i=0;i<m;i++){const o=parts[RI(0,parts.length-1)];const[x,y]=quickScore(CLUB[id].s,CLUB[o]?CLUB[o].s:75,i%2?2:-2);T.j++;T.gp+=x;T.gc+=y;if(x>y){T.v++;T.p+=3}else if(x===y){T.e++;T.p++}else T.d++}}
 const rows=Object.values(tab).sort(campCmp(['p','sg','gp','v']));const pos=rows.findIndex(x=>x.id===me.id)+1;comp.lpPos=pos;comp.lpTable=rows.map(r=>({id:r.id,p:r.p,j:r.j,v:r.v,e:r.e,d:r.d,gp:r.gp,gc:r.gc}));
 const hasPO=comp.rounds[0]&&comp.rounds[0].po;
 if(pos<=F.direct){comp.stage=hasPO?1:0;res.note=`${pos}º na fase de liga: direto pras oitavas`}
 else if(hasPO&&pos<=F.po){comp.stage=0;res.note=`${pos}º na fase de liga: vai pro playoff`;const opp=rows[Math.min(rows.length-1,F.direct+(F.po-pos))];if(opp)comp.rounds[0].opp=opp.id}
 else{comp.alive=false;comp.out='Fase de liga';res.note=`${pos}º na fase de liga: eliminado`}}
function campGrp(comp,res,I,me){const t=sortTable(comp.gtab,null);const pos=t.findIndex(x=>x.id===me.id)+1;comp.gpos=pos;comp.gTable=t.map(r=>({id:r.id,p:r.p,j:r.j,gp:r.gp,gc:r.gc,v:r.v||0}));
 if(comp.code==='SUD'){if(pos===1){comp.stage=1;res.note='1º do grupo: direto pras oitavas'}else if(pos===2){comp.stage=0;res.note='2º do grupo: playoff contra um 3º da Libertadores';const lib=contParticipants('LIB').filter(x=>CLUB[x]);if(lib.length)comp.rounds[0].opp=pick(lib)}else{comp.alive=false;comp.out='Fase de grupos';res.note=`${pos}º do grupo: eliminado`}return}
 if(pos<=(I.adv||2)){comp.stage=0;res.note=`${pos}º do grupo: classificado pras oitavas`;return}
 if(comp.code==='LIB'&&pos===3){// regra real: 3º da Libertadores cai pro playoff da Sul-Americana
  const SI=CONT_INFO.SUD;comp.fromLIB=true;comp.code='SUD';comp.n=SI.n;comp.ic=SI.ic;comp.pts=SI.pts;comp.pool=contParticipants('SUD');
  comp.rounds=[{n:'Playoff',legs:2,po:true}].concat(SI.ko.map(n=>({n,legs:2}))).concat([{n:SI.fin,legs:1,neutral:true}]);comp.stage=0;comp.alive=true;
  const sud=comp.pool.filter(x=>CLUB[x]);if(sud.length)comp.rounds[0].opp=pick(sud);
  try{S.st.cal.splice(S.st.idx+1,0,{k:'ko',cid:'cont'})}catch(e){}
  res.note='3º do grupo: cai pro playoff da Copa Sul-Americana';return}
 comp.alive=false;comp.out='Fase de grupos';res.note=`${pos}º do grupo: eliminado`}

// ---------- briga de artilharia e de assistências ----------
const CAMP_GW={ATA:3.2,PON:2,SA:1.6,PE:1.2,PD:1.2,MEI:.7,ME:.5,MD:.5,MC:.35,VOL:.12,ZAG:.15,LE:.1,LD:.1,GOL:0};
const CAMP_AW={MEI:2.2,PE:1.6,PD:1.6,ME:1.2,MD:1.2,SA:1.1,MC:.9,LE:.9,LD:.9,ATA:.8,PON:.9,VOL:.35,ZAG:.15,GOL:.03};
function campRace(l,rows,meId,meG,meA){const gl=[],as=[];const rr=seeded(hash(l+'#race'+S.year));
 for(const r of rows){const isMe=r.id===meId;const ros=roster(r.id).map(p=>{const st=W.stars.find(s=>s.n===p.n&&s.club===r.id);return{...p,q:st?Math.pow(Math.max(.5,(st.r-60)/25),1.3)*1.2:1}});
  const tg=Math.max(0,r.gp*.93-(isMe?meG:0)),ta=Math.max(0,r.gp*.7-(isMe?meA:0));
  const wg=ros.map(p=>(CAMP_GW[p.pos]??.2)*p.q*(.7+rr()*.6)),wa=ros.map(p=>(CAMP_AW[p.pos]??.3)*p.q*(.7+rr()*.6));const sg=wg.reduce((a,b)=>a+b,0)||1,sa=wa.reduce((a,b)=>a+b,0)||1;
  ros.forEach((p,i)=>{const g=Math.round(tg*wg[i]/sg),a=Math.round(ta*wa[i]/sa);if(g>0)gl.push({n:p.n,club:r.id,v:g});if(a>0)as.push({n:p.n,club:r.id,v:a})})}
 if(meId){gl.push({n:S.name,club:meId,v:meG,me:true});as.push({n:S.name,club:meId,v:meA,me:true})}
 const sortR=a=>a.sort((x,y)=>y.v-x.v||(x.me?-1:y.me?1:0));return{gl:sortR(gl),as:sortR(as)}}

// ---------- recap guardado no fim da temporada ----------
function campRecap(){const st=S.st;const me=club();if(!st||!me)return null;const lg=st.lg;const rows=sortTable(st.table,lg);
 const lgS=st.stats['Liga']||{g:0,a:0,j:0};const race=S.pos==='GOL'?null:campRace(lg,rows,me.id,lgS.g||0,lgS.a||0);
 const comps=Object.values(st.comps).filter(c=>c&&!c.skip&&((c.path&&c.path.length)||c.lpTable||c.gTable)).map(c=>({id:c.id,n:c.n,ic:c.ic,code:c.code||null,won:!!c.won,out:c.out||null,fromLIB:!!c.fromLIB,
  lpPos:c.lpPos||null,lpTable:c.lpTable?c.lpTable.slice(0,40):null,gTable:c.gTable||null,zone:c.zone||null,
  path:(c.path||[]).map(r=>({label:r.label,h:r.home&&r.home.n,a:r.away&&r.away.n,hid:r.home&&r.home.id,aid:r.away&&r.away.id,hg:r.hg,ag:r.ag,pens:r.pens,agg:r.agg,note:r.note,wdl:r.wdl,g:r.me&&r.me.g||0,as:r.me&&r.me.a||0}))}));
 return{y:S.year,lg,club:me.id,rows:rows.map(r=>({id:r.id,p:r.p,j:r.j,v:r.v,e:r.e,d:r.d,gp:r.gp,gc:r.gc})),race,comps,stats:st.stats}}
{const _es=endSeason;endSeason=function(...a){try{S.campRecap=campRecap()}catch(e){console.warn(e);S.campRecap=null}const r=_es.apply(this,a);try{if(S.campRecap){S.campRecap.po=S.campPO||[];S.campRecap.myMove=r&&r.myMove||(S.lastSeason&&S.lastSeason.myMove)||null}}catch(e){}return r}}

// ---------- pop-ups do balanço ----------
function campZones(lg,n){const L=LG[lg];const C=COUNTRY[L.c];const z={};const lab=(i,t,c)=>{if(!z[i])z[i]={t,c}};
 if(L.tier===1&&C.slots){const col={UCL:'#3d7bff',LIB:'#3d7bff',UEL:'#ff9a3c',SUD:'#ff9a3c',UECL:'#3ccf8e',CCC:'#3d7bff',ACL:'#3d7bff'};
  for(const k in C.slots){const[a,b]=C.slots[k];for(let i=a;i<=b;i++)lab(i,k==='LIB'&&i>=5?'Pré-Libertadores':CONT_INFO[k].n,col[k]||'#3d7bff')}}
 if(L.prev){const au=campAutoUp(lg);for(let i=1;i<=au;i++)lab(i,'Acesso','#3ccf8e');const R=CAMP_PO[lg];if(R&&R.po)for(let i=R.po[0];i<=R.po[1];i++)lab(i,'Playoff de acesso','#f2c443')}
 if(L.next&&L.down){const R=CAMP_PO[lg];for(let i=n-L.down+1;i<=n;i++)lab(i,'Rebaixamento','#ff5a4a');if(R&&R.rpo)lab(R.rpo,'Playoff de rebaixamento','#f2c443')}
 if(L.po)for(let i=1;i<=L.po;i++)lab(i,'Playoffs da MLS','#3d7bff');return z}
function campTableHTML(rows,meId,zones,opt={}){const n=rows.length;const mi=rows.findIndex(r=>r.id===meId);const show=new Set();
 const top=opt.full?n:6;for(let i=0;i<Math.min(top,n);i++)show.add(i);for(let i=Math.max(0,mi-2);i<=Math.min(n-1,mi+2);i++)show.add(i);if(!opt.full)for(let i=Math.max(0,n-(zones&&Object.values(zones).some(z=>z.t==='Rebaixamento')?4:0));i<n;i++)show.add(i);
 let last=-1,html='';for(const i of[...show].sort((a,b)=>a-b)){if(i>last+1)html+=`<tr class="cp-gap"><td colspan="7">···</td></tr>`;last=i;const r=rows[i];const c=CLUB[r.id]||{n:r.id};const z=zones&&zones[i+1];
  html+=`<tr class="${r.id===meId?'me':''}"><td class="pos" style="${z?`box-shadow:inset 3px 0 ${z.c}`:''}">${i+1}</td><td class="cl">${CLUB[r.id]?shieldHTML(c):''}<span>${esc(c.n)}</span></td><td class="mono b">${r.p}</td><td class="mono">${r.j}</td><td class="mono">${r.v??'-'}</td><td class="mono">${(r.gp-r.gc)>0?'+':''}${r.gp-r.gc}</td><td class="mono">${r.gp}</td></tr>`}
 const leg=zones?[...new Map(Object.values(zones).map(z=>[z.t,z])).values()].map(z=>`<span><i style="background:${z.c}"></i>${esc(z.t)}</span>`).join(''):'';
 return`<div class="cp-tbl"><table><thead><tr><th>#</th><th>Clube</th><th>P</th><th>J</th><th>V</th><th>SG</th><th>GP</th></tr></thead><tbody>${html}</tbody></table></div>${leg?`<div class="cp-leg">${leg}</div>`:''}`}
function campRaceHTML(list,unit){const mi=list.findIndex(x=>x.me);const top=list.slice(0,5);const meIn=mi>=0&&mi<5;
 const row=(x,i)=>{const c=CLUB[x.club];return`<div class="cp-rr ${x.me?'me':''}"><span class="pos mono">${x.me&&i>=30?'—':(i+1)+'º'}</span>${c?shieldHTML(c):''}<div class="nm"><b>${esc(x.n)}</b><small>${esc(c?c.n:'')}</small></div><span class="v mono">${x.v}<small> ${unit}</small></span></div>`};
 return top.map(row).join('')+(!meIn&&mi>=0?`<div class="cp-gap">···</div>${row(list[mi],mi)}`:'')}
function campPathHTML(c){return c.path.map(r=>`<div class="cp-m ${r.wdl==='V'?'w':r.wdl==='D'?'l':'d'}"><small>${esc(r.label||'')}</small><div><span>${esc(r.h||'')}</span><b class="mono">${r.hg}–${r.ag}${r.pens?` <small>(${r.pens[0]}–${r.pens[1]} pên.)</small>`:''}</b><span>${esc(r.a||'')}</span></div>${r.agg?`<small class="mono">Agregado ${r.agg[0]}–${r.agg[1]}</small>`:''}${r.g||r.as?`<small class="me">Você: ${r.g?r.g+' gol'+(r.g>1?'s':''):''}${r.g&&r.as?' · ':''}${r.as?r.as+' assist.':''}</small>`:''}${r.note?`<em>${esc(r.note)}</em>`:''}</div>`).join('')}
function campPop(o){return new Promise(res=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap cp"><div class="cp-top"><span class="cp-ic">${o.ic||'🏆'}</span><div><div class="eyebrow">${esc(o.eyebrow||'')}</div><h2 class="pkh" style="margin:2px 0 0">${esc(o.title)}</h2></div></div>
 ${o.big?`<div class="cp-big ${o.good?'good':o.bad?'bad':''}">${o.big}</div>`:''}${o.sub?`<p class="muted" style="margin:0 0 10px">${o.sub}</p>`:''}<div class="cp-body">${o.body||''}</div>
 <button class="btn wide" id="cpNx" style="margin-top:12px">${o.last?'Ver o balanço':'Próximo →'}</button>${o.last?'':'<button class="lnk" id="cpSk" style="margin-top:6px;width:100%">Pular resumo</button>'}</div>`;
 document.getElementById('cpNx').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(true)};const sk=document.getElementById('cpSk');if(sk)sk.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(false)}})}
async function campRecapShow(){const R=S.campRecap;if(!R||R.shown)return;R.shown=true;const me=R.club;const L=LG[R.lg];const pages=[];
 // liga
 const pos=R.rows.findIndex(r=>r.id===me)+1;const row=R.rows[pos-1]||{};const champ=CLUB[R.rows[0].id];const zones=campZones(R.lg,R.rows.length);
 const zt=zones[pos]?zones[pos].t:null;const mv=R.myMove;
 pages.push({ic:'🏟️',eyebrow:`${seasonLbl(R.y)} · ${L.n}`,title:pos===1?'CAMPEÃO DA LIGA!':`${pos}º lugar`,big:`${row.p} pts · ${row.v}V ${row.e}E ${row.d}D · ${row.gp} gols`,good:pos===1||(mv&&mv.dir==='up'),bad:mv&&mv.dir==='down',
  sub:`${pos===1?'Ninguém fez mais pontos.':`O campeão foi o ${esc(champ?champ.n:'—')}.`} ${zt?`Zona: <b>${esc(zt)}</b>.`:''} ${mv?(mv.dir==='up'?`Acesso à ${esc(LG[mv.to].n)}!`:`Rebaixado pra ${esc(LG[mv.to].n)}.`):''} Desempate: ${campRules(R.lg).map(k=>CAMP_TB_TXT[k]).join(', ')}.`,
  body:campTableHTML(R.rows,me,zones)});
 // playoffs da sua liga
 for(const p of R.po||[]){if(p.l!==R.lg&&!(p.k==='rpo'&&LG[R.lg].next===p.l))continue;const w=CLUB[p.w];pages.push({ic:p.k==='po'?'⬆️':'⚠️',eyebrow:'Playoff',title:p.n,big:w?`${esc(w.n)}${p.k==='po'?' subiu':p.w===p.a?' ficou':' subiu'}`:'',body:p.k==='rpo'?`<p class="muted">${esc(CLUB[p.a].n)} (16º) × ${esc(CLUB[p.b].n)} (3º da divisão de baixo)</p>`:''})}
 // copas e continentais
 for(const c of R.comps){if(c.id==='acc'||c.id==='rpo'){if(!c.path.length)continue}
  const lastN=c.path.length?c.path[c.path.length-1]:null;const res=c.won?'CAMPEÃO!':c.out?`Caiu: ${c.out}`:lastN&&lastN.note?lastN.note:'';
  let body='';if(c.lpTable){const zz={};for(let i=1;i<=c.lpTable.length;i++)zz[i]=i<=8?{t:'Oitavas direto',c:'#3ccf8e'}:i<=24?{t:'Playoff',c:'#f2c443'}:{t:'Eliminado',c:'#ff5a4a'};body+=`<div class="eyebrow" style="margin:4px 0">Fase de liga (${c.lpTable.length} clubes)</div>`+campTableHTML(c.lpTable,me,zz)}
  if(c.gTable){body+=`<div class="eyebrow" style="margin:4px 0">Seu grupo</div>`+campTableHTML(c.gTable.map(r=>({...r,v:r.v??'-'})),me,{1:{t:'Oitavas',c:'#3ccf8e'},2:{t:'Oitavas',c:'#3ccf8e'},3:{t:c.fromLIB?'Sul-Americana':'Eliminado',c:'#f2c443'}},{full:true})}
  const ko=c.path.filter(r=>!/Grupo|Fase de liga|fase · jogo|Fase de grupos|1ª fase/.test(r.label||''));if(ko.length)body+=`<div class="eyebrow" style="margin:8px 0 4px">Mata-mata</div>`+campPathHTML({path:ko});else if(!c.lpTable&&!c.gTable)body+=campPathHTML(c);
  const gs=c.path.reduce((s,r)=>s+(r.g||0),0),as=c.path.reduce((s,r)=>s+(r.as||0),0);
  pages.push({ic:c.won?'🏆':c.code?'🌎':'🏅',eyebrow:`${seasonLbl(R.y)}${c.fromLIB?' · veio da Libertadores':''}`,title:c.n,big:res,good:c.won,bad:!c.won&&!!c.out,sub:`${c.path.length} jogo${c.path.length===1?'':'s'} · você: ${gs} gol${gs===1?'':'s'}, ${as} assist.`,body})}
 // briga de artilharia e de assistências
 if(R.race){const gi=R.race.gl.findIndex(x=>x.me),ai=R.race.as.findIndex(x=>x.me);const lead=R.race.gl[0],alead=R.race.as[0];
  pages.push({ic:'⚽',eyebrow:`Artilharia · ${L.n}`,title:gi===0?'VOCÊ É O ARTILHEIRO!':R.race.gl[gi].v===0?'Você não marcou na liga':gi>=30?'Fora da briga':`Você terminou em ${gi+1}º`,big:gi===0?`${lead.v} gols`:`${esc(lead.n)} levou com ${lead.v} gols`,good:gi===0,sub:gi===0?`${R.race.gl[1]?`${esc(R.race.gl[1].n)} ficou ${lead.v-R.race.gl[1].v} gol${lead.v-R.race.gl[1].v===1?'':'s'} atrás.`:''}`:`Faltaram ${lead.v-R.race.gl[gi].v} gols pra você.`,body:campRaceHTML(R.race.gl,'gols')});
  pages.push({ic:'🎯',eyebrow:`Assistências · ${L.n}`,title:ai===0?'VOCÊ É O GARÇOM DA LIGA!':R.race.as[ai].v===0?'Nenhuma assistência na liga':ai>=30?'Fora da briga':`Você terminou em ${ai+1}º`,big:ai===0?`${alead.v} assistências`:`${esc(alead.n)} liderou com ${alead.v}`,good:ai===0,sub:ai===0?'Ninguém deu mais passes pra gol.':`Faltaram ${alead.v-R.race.as[ai].v} assistências.`,body:campRaceHTML(R.race.as,'assist.')})}
 // números da temporada em todas as competições
 const sts=Object.entries(R.stats||{}).filter(([k,v])=>v&&v.j);if(sts.length)pages.push({ic:'📊',eyebrow:seasonLbl(R.y),title:'Seus números por competição',body:`<div class="cp-tbl"><table><thead><tr><th>Competição</th><th>J</th><th>G</th><th>A</th><th>Nota</th></tr></thead><tbody>${sts.map(([k,v])=>`<tr><td class="cl"><span>${esc(k)}</span></td><td class="mono">${v.j}</td><td class="mono b">${v.g}</td><td class="mono">${v.a}</td><td class="mono">${v.nn?(v.ns/v.nn).toFixed(2).replace('.',','):'—'}</td></tr>`).join('')}</tbody></table></div>`});
 for(let i=0;i<pages.length;i++){const go=await campPop({...pages[i],last:i===pages.length-1});if(!go)break}}
{const _rs=runSeasonEndShow;runSeasonEndShow=async function(ls){try{await campRecapShow()}catch(e){console.warn(e)}return _rs(ls)}}

// ---------- estilo ----------
{const st=document.createElement('style');st.textContent=`
.cp{max-width:520px}.cp-top{display:flex;gap:12px;align-items:center;margin-bottom:8px}.cp-ic{font-size:34px}
.cp-big{font-family:var(--f-display,inherit);font-weight:900;font-size:22px;margin:4px 0 8px;padding:8px 12px;border-radius:12px;background:rgba(255,255,255,.06)}.cp-big.good{color:#7dff9a;background:rgba(60,220,90,.12)}.cp-big.bad{color:#ff8a7a;background:rgba(255,80,60,.1)}
.cp-body{max-height:52vh;overflow:auto}.cp-tbl table{width:100%;border-collapse:collapse;font-size:13px}.cp-tbl th{font-size:11px;color:var(--muted);text-align:left;padding:4px 6px}.cp-tbl td{padding:5px 6px;border-top:1px solid rgba(255,255,255,.06)}
.cp-tbl td.pos{width:28px;text-align:center;font-weight:800}.cp-tbl td.cl{display:flex;gap:6px;align-items:center;min-width:0}.cp-tbl td.cl span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px}.cp-tbl td.cl .shield,.cp-tbl td.cl svg{width:18px;height:18px;flex:0 0 auto}
.cp-tbl td.b{font-weight:900}.cp-tbl tr.me td{background:rgba(242,196,67,.16);font-weight:800}.cp-gap td,.cp-gap{text-align:center;color:var(--muted);font-size:12px;padding:2px}
.cp-leg{display:flex;flex-wrap:wrap;gap:6px 12px;margin-top:8px;font-size:11px;color:var(--muted)}.cp-leg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}
.cp-rr{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:10px}.cp-rr.me{background:rgba(242,196,67,.16)}.cp-rr .pos{width:28px;font-weight:800}.cp-rr .nm{flex:1;min-width:0}.cp-rr .nm b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cp-rr .nm small{color:var(--muted);font-size:11px}.cp-rr .v{font-weight:900;font-size:16px}.cp-rr .v small{font-size:10px;color:var(--muted);font-weight:600}.cp-rr .shield,.cp-rr svg{width:22px;height:22px;flex:0 0 auto}
.cp-m{display:grid;gap:2px;padding:7px 9px;border-radius:10px;margin-bottom:6px;background:rgba(255,255,255,.04);border-left:3px solid #888}.cp-m.w{border-color:#3ccf8e}.cp-m.l{border-color:#ff5a4a}.cp-m.d{border-color:#f2c443}
.cp-m>div{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;font-size:13px}.cp-m>div span:last-child{text-align:right}.cp-m small{color:var(--muted);font-size:11px}.cp-m small.me{color:#f2c443}.cp-m em{font-size:12px;color:#cfe;font-style:normal;font-weight:700}`;document.head.appendChild(st)}
