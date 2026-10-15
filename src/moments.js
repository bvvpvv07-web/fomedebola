// ================== MOMENTOS E CELEBRAÇÕES ==================
const GOAL_MS=[25,50,100,150,200,250,300,400,500,600,700,800,900,1000];
function careerGoals(){const h=(S.history||[]).reduce((s,x)=>s+(x.goals||0),0);const st=S.st&&S.st.stats||{};let c=0;for(const k in st)if(k!=='Base')c+=st[k].g||0;return h+c}
async function postMatchMoments(list,io){
 for(const r of list){
  if(!r||r.k!=='match'||!r.me||!r.me.play)continue;const m=r.me;const youth=r.cid==='yl'||/Sub-|Primavera|Reserva|Copinha|Youth|Junioren|Juvenil|Revelação|O19|U19|U-21|NEXT|Gambardella|Proyecci/.test(r.comp);
  const opp=r.home&&r.away?(r.home.id===S.club||r.home.n.startsWith(club().n)?r.away:r.home):null;
  if(m.g>=3&&((S.flags.hats=(S.flags.hats||0)+1)<=3||m.g>=4))await io.moment({k:'hat',emoji:'⚽'.repeat(Math.min(m.g,5)),eyebrow:`${r.comp} · ${r.label}`,big:m.g===3?'HAT-TRICK!':m.g===4?'POKER!':`${m.g} GOLS!`,title:`${m.g} gols${opp?' contra o '+opp.n:''}`,lines:[`Placar: ${r.hg}–${r.ag}`,`Nota ${m.nota??'—'}`],ball:true});
  if(!youth&&m.g>0&&!S.flags.firstGoal){S.flags.firstGoal=true;await io.moment({k:'first',emoji:'🥹',eyebrow:'Um dia pra nunca esquecer',big:'PRIMEIRO GOL!',title:`Seu primeiro gol como profissional${opp?' contra o '+opp.n:''}`,lines:[`${r.comp} · ${r.label}`],ball:true})}
  if(!youth&&m.g>0){const tot=careerGoals();const last=S.flags.goalMs||0;const hit=GOAL_MS.filter(x=>x>last&&x<=tot).pop();if(hit){S.flags.goalMs=hit;await io.moment({k:'goals',emoji:'🎯',eyebrow:'Marca histórica',big:String(hit),count:hit,title:`${hit} gols na carreira`,lines:[`Aos ${S.age} anos`,`${club().n}`]})}}
  if(r.koWin&&/Semifinal/.test(r.label)&&!r.final)await io.moment({k:'final',emoji:'🏟️',eyebrow:r.comp,big:'NA FINAL!',title:`Vocês estão na final da ${r.comp}`,lines:['A final vai passar ao vivo','Um passo do título']});
 }
}
function momentUI(m){
 return new Promise(res=>{
  $ov.hidden=false;const c=club();
  $ov.innerHTML=`<div class="ovwrap celeb moment"><div class="rays"></div><div class="spot"></div>
  <div class="eyebrow">${esc(m.eyebrow||'')}</div>
  <div class="mem">${m.emoji||'⭐'}</div>
  <h2 class="champ mbig" id="mBig">${esc(m.count?'0':m.big)}</h2>
  <div class="cname">${esc(m.title||'')}</div>
  ${(m.lines||[]).length?`<div class="chipsrow" style="justify-content:center;margin-top:10px">${m.lines.map(l=>`<span class="chip">${esc(l)}</span>`).join('')}</div>`:''}
  <div class="row" style="justify-content:center;margin:14px 0 6px">${c?shieldHTML(c,'lg'):''}</div>
  <button class="btn wide" id="celOk">Continuar</button></div>`;
  confetti($ov,clubColors(S.club),2600);
  if(m.count){const el=document.getElementById('mBig');const t0=performance.now();const d=reduced?10:1100;const tick=t=>{const k=Math.min(1,(t-t0)/d);el.textContent=Math.round(m.count*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}
  document.getElementById('celOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()};
 });
}
IO_UI.moment=momentUI;
// Celebração de título em 3 tempos: apito → taça → festa
celebrateUI=function(t){
 return new Promise(async res=>{
  $ov.hidden=false;const c=t.club?CLUB[t.club]:null;const nat=t.nat?NATS[t.nat]:null;const acesso=t.t==='acesso';
  const kind=acesso?'acesso':(t.ic||t.t);
  const nTit=(S.titles||[]).length+((S.st&&S.st.titles)||[]).length+(t.t==='liga'?1:0);
  $ov.innerHTML=`<div class="ovwrap celeb splash"><div class="whistle">${acesso?'SUBIU!':t.clinch?'NINGUÉM ALCANÇA MAIS':'APITO FINAL'}</div><div class="cname" style="margin-top:8px">${esc(t.n)}</div></div>`;
  await sleep(reduced?200:1300);
  $ov.innerHTML=`<div class="ovwrap celeb"><div class="rays"></div><div class="spot"></div><div class="fw"><i></i><i></i><i></i><i></i><i></i></div>
  <div class="eyebrow">${acesso?'Acesso garantido':t.clinch?'Título garantido com rodadas de antecedência':'Título conquistado'}</div>
  <div class="tro-stage"><div class="tro rise">${TROPHY(kind,{c1:c?c.c1:'#f2c443',c2:c?c.c2:'#fff',n:t.n})}</div><div class="plinth"></div></div>
  <h2 class="champ">${acesso?'SUBIU!':'CAMPEÃO!'}</h2>
  <div class="cname">${esc(t.n)}</div>
  <div class="row" style="justify-content:center;margin:8px 0 6px">${c?shieldHTML(c,'lg'):nat?`<span style="font-size:40px">${nat.f}</span>`:''}<b style="font-size:18px">${esc(c?c.n:nat?nat.n:'')}</b></div>
  <div class="chipsrow" style="justify-content:center;margin-bottom:12px">${!acesso?`<span class="chip gold">${nTit}º título da carreira</span>`:''}${t.stat?`<span class="chip">${esc(t.stat)}</span>`:''}${S.captain&&!acesso?'<span class="chip gold">Você levantou a taça como capitão</span>':''}</div>
  <button class="btn wide" id="celOk">Continuar</button></div>`;
  confetti($ov,clubColors(t.club),5200);
  const b=document.getElementById('celOk');b.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()};b.focus({preventScroll:true});
 });
};
IO_UI.celebrate=celebrateUI;
