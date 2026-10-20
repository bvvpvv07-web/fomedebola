// ================== RPG: nível, XP e árvore de habilidades ==================
// Tudo que você faz em campo e no treino dá XP. Cada nível vale 1 ponto para destravar uma habilidade.
// As habilidades mexem de verdade no jogo: nos lances (precisão, passe, drible, velocidade) e na carreira (lesão, salário, fama, liderança).
const RPG_TREE=[
 {k:'craque',n:'Craque',ic:'🎯',d:'Técnica que decide jogo',p:[
  {id:'pe',n:'Pé calibrado',d:'Chutes 18% mais precisos nos lances.'},
  {id:'visao',n:'Visão de jogo',d:'Passes mais certeiros e a assistência puxa mais pro companheiro.'},
  {id:'drible',n:'Drible curto',d:'Dribles dão mais certo e o marcador desarma menos.'},
  {id:'decisivo',n:'Decisivo',d:'Rende mais em todo jogo: +1 de desempenho na simulação.'}]},
 {k:'atleta',n:'Atleta',ic:'💪',d:'Corpo pronto pra 20 anos de carreira',p:[
  {id:'pulmao',n:'Pulmão',d:'Risco de lesão 25% menor.'},
  {id:'arranque',n:'Arranque',d:'Mais rápido com e sem bola nos lances.'},
  {id:'aco',n:'Corpo de aço',d:'Lesões 40% mais curtas.'},
  {id:'longe',n:'Longevidade',d:'Depois dos 31, metade da queda de nível por idade.'}]},
 {k:'estrela',n:'Estrela',ic:'⭐',d:'Fora de campo também se joga',p:[
  {id:'carisma',n:'Carisma',d:'+3 de fama todo fim de temporada.'},
  {id:'negocia',n:'Negociador',d:'Propostas com salário 10% maior.'},
  {id:'lider',n:'Líder',d:'+4 de diretoria por temporada e mais chance de ser capitão.'},
  {id:'idolo',n:'Ídolo',d:'A torcida do seu clube sobe toda temporada e sua cabeça fica mais forte.'}]},
];
function rpgS(){if(!S)return null;S.rpg=S.rpg||{lvl:1,xp:0,pts:0,has:{},total:0};return S.rpg}
function rpgHas(id){try{return!!(S&&S.rpg&&S.rpg.has[id])}catch(e){return false}}
function rpgNeed(l){return 60+l*40}
function rpgGain(n,why){const R=rpgS();if(!R||!(n>0))return;n=Math.round(n);R.xp+=n;R.total+=n;let up=0;while(R.xp>=rpgNeed(R.lvl)){R.xp-=rpgNeed(R.lvl);R.lvl++;R.pts++;up++}
 if(up){try{toast({ic:'⬆️',title:`Nível ${R.lvl}!`,txt:`Você ganhou ${up>1?up+' pontos':'1 ponto'} de habilidade. Toque em "Habilidades" no início.`,ms:3800,kind:'gold'})}catch(e){}}
 return up}
function rpgCan(br,i){const R=rpgS();const p=RPG_TREE[br].p[i];if(R.has[p.id]||R.pts<1)return false;return i===0||!!R.has[RPG_TREE[br].p[i-1].id]}
function rpgCardHTML(){const R=rpgS();const need=rpgNeed(R.lvl);const n=Object.keys(R.has).length;
 return`<section class="card rpgc"><div class="rpg-row"><div class="rpg-lv"><small>NÍVEL</small><b class="mono">${R.lvl}</b></div>
 <div class="rpg-mid"><div class="rpg-t"><b>Habilidades</b><span class="muted">${n}/12 destravadas</span></div><div class="pbar rpg-bar"><i style="width:${Math.round(R.xp/need*100)}%"></i></div><small class="muted mono">${R.xp}/${need} XP</small></div>
 <button class="btn small ${R.pts?'':'ghost'}" id="rpgOpen">${R.pts?`⭐ ${R.pts} ponto${R.pts>1?'s':''}`:'Ver árvore'}</button></div></section>`}
function rpgOpen(){const R=rpgS();
 const draw=()=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap rpgov"><div class="eyebrow">Nível ${R.lvl} · ${R.pts} ponto${R.pts===1?'':'s'} pra gastar</div><h2 class="pkh" style="margin:6px 0 4px">Árvore de habilidades</h2>
  <p class="muted" style="margin:0 0 12px">Cada nível dá 1 ponto. Em cada trilha, destrave na ordem. XP vem de jogos, gols, assistências, lances certos e treino.</p>
  <div class="rpg-tree">${RPG_TREE.map((b,bi)=>`<div class="rpg-br"><div class="rpg-bh"><span>${b.ic}</span><div><b>${b.n}</b><small>${b.d}</small></div></div>${b.p.map((p,i)=>{const on=R.has[p.id],can=rpgCan(bi,i);return`<button class="rpg-p ${on?'on':can?'can':'lock'}" data-b="${bi}" data-i="${i}" ${can?'':'disabled'}><b>${on?'✓ ':can?'＋ ':'🔒 '}${esc(p.n)}</b><small>${esc(p.d)}</small></button>`}).join('')}</div>`).join('')}</div>
  <button class="btn wide" id="rpgX" style="margin-top:12px">Fechar</button></div>`;
  $ov.querySelectorAll('.rpg-p.can').forEach(b=>b.onclick=()=>{const p=RPG_TREE[+b.dataset.b].p[+b.dataset.i];if(!rpgCan(+b.dataset.b,+b.dataset.i))return;R.has[p.id]=true;R.pts--;try{SFX.tone({f:880,dur:.12,gain:.1})}catch(e){}toast({ic:'✨',title:p.n,txt:p.d,ms:2600});try{saveNow('rpg')}catch(e){}draw()});
  document.getElementById('rpgX').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';renderHub()}};draw()}
// card no início
{const _rh=renderHub;renderHub=function(...a){const r=_rh.apply(this,a);try{if(!S.youth||S.flags&&S.flags.pro||true){const w=$app.querySelector('.wrap');if(w&&!w.querySelector('.rpgc')){w.insertAdjacentHTML('afterbegin',rpgCardHTML());const b=document.getElementById('rpgOpen');if(b)b.onclick=rpgOpen}}}catch(e){}return r}}
// XP: jogos
{const _pm=playMine;playMine=async function(o,io){const r=await _pm(o,io);try{const m=r&&r.me;if(m&&m.play){let x=8+m.min/9+m.g*14+m.a*9+(m.nota!=null?(m.nota-6)*7:0)+(r.gu>r.gt?5:0)+(m.cs?8:0);if(o&&/final/i.test(o.label||''))x*=1.5;rpgGain(Math.max(4,x))}
  if(m&&m.inj&&rpgHas('aco')&&S.st&&S.st.injLeft>0){const cut=Math.round(m.inj*.4);S.st.injLeft=Math.max(1,S.st.injLeft-cut)}}catch(e){}return r}}
// XP: lances certos
{const _nm=nssMoment;nssMoment=async function(o){const r=await _nm(o);try{if(r&&r.ok)rpgGain(r.perfect?14:8);else rpgGain(2)}catch(e){}return r}}
// XP: treino
{const _wt=weeklyTraining;weeklyTraining=async function(k){const r=await _wt(k);try{rpgGain(5)}catch(e){}return r}}
// desempenho: Decisivo
{const _bp=bootPerf;bootPerf=function(){return _bp()+(rpgHas('decisivo')?1.5:0)}}
// salário: Negociador
{const _wf=wageFor;wageFor=function(c,ovr){const w=_wf(c,ovr);return rpgHas('negocia')?Math.round(w*1.1):w}}
// fim de temporada: carisma, líder, ídolo, longevidade + XP do balanço
{const _es=endSeason;endSeason=function(...a){const ovr0=S.ovr,age0=S.age;const r=_es.apply(this,a);try{
  if(rpgHas('longe')&&age0>=31&&S.ovr<ovr0){const back=Math.floor((ovr0-S.ovr)/2);S.ovr+=back;if(S.attrs&&back){for(const k in S.attrs)S.attrs[k]=clamp(S.attrs[k]+Math.ceil(back/2),10,99)}}
  if(rpgHas('carisma'))S.life.fama=clamp(S.life.fama+3,0,100);
  if(rpgHas('lider')){S.board=clamp((S.board??50)+4,0,100);if(!S.captain&&S.age>=24&&ch(.12))S.captain=true}
  if(rpgHas('idolo')&&S.club){S.fans=S.fans||{};S.fans[S.club]=clamp((S.fans[S.club]??55)+6,0,100);S.life.cab=clamp(S.life.cab+3,0,100)}
  const ls=S.lastSeason;if(ls&&ls.nota)rpgGain(20+Math.max(0,(ls.nota-6.5)*30))}catch(e){}return r}}
// estilo
{const st=document.createElement('style');st.textContent=`
.rpgc{padding:12px 14px}.rpg-row{display:flex;align-items:center;gap:12px}.rpg-lv{display:grid;place-items:center;width:52px;height:52px;border-radius:14px;background:linear-gradient(160deg,#f2c443,#d48a12);color:#1a1200;flex:0 0 auto}
.rpg-lv small{font-size:9px;font-weight:800;letter-spacing:.08em;margin-bottom:-6px}.rpg-lv b{font-size:24px;line-height:1}.rpg-mid{flex:1;min-width:0;display:grid;gap:4px}.rpg-t{display:flex;justify-content:space-between;gap:8px;font-size:14px}.rpg-t span{font-size:12px}
.rpg-bar{height:8px}.rpg-tree{display:grid;gap:10px}.rpg-br{display:grid;gap:6px;padding:10px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
.rpg-bh{display:flex;gap:10px;align-items:center;text-align:left}.rpg-bh>span{font-size:22px}.rpg-bh small{display:block;color:var(--muted);font-size:12px}
.rpg-p{display:grid;gap:2px;width:100%;margin:0;text-align:left;padding:9px 11px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.2);color:inherit;font:inherit}
.rpg-p small{color:var(--muted);font-size:12px}.rpg-p.on{border-color:#3cdc5a;background:rgba(60,220,90,.12)}.rpg-p.can{border-color:#f2c443;background:rgba(242,196,67,.12);cursor:pointer}.rpg-p.lock{opacity:.55}
@media(min-width:720px){.rpg-tree{grid-template-columns:repeat(3,1fr)}}`;document.head.appendChild(st)}
