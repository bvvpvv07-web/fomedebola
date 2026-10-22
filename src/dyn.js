// ================== DINÂMICA: pop-ups de decisão, reel de resultados, toasts ==================
let LIVE_USED=false;
{const s0=IO_UI.live.start;IO_UI.live.start=async function(...a){LIVE_USED=true;return s0.apply(this,a)}}
// ---------- toast ----------
function toast(o){
 let host=document.getElementById('toasts');if(!host){host=document.createElement('div');host.id='toasts';document.body.appendChild(host)}
 // avisos iguais em sequência (ex.: vários "Nível N!") viram um só, e nunca mais de 2 na tela
 const grp=o.group||(/^Nível \d+!?$/.test(o.title||'')?'lvl':null);let el=grp?host.querySelector(`.toast[data-g="${grp}"]`):null;
 if(el){clearTimeout(el._t1);clearTimeout(el._t2);el.classList.remove('out');el._n=(el._n||1)+1}else{el=document.createElement('div');el._n=1;host.appendChild(el)}
 el.className='toast '+(o.kind||'');if(grp)el.dataset.g=grp;
 const extra=grp==='lvl'&&el._n>1?`+${el._n} pontos de habilidade. Vá em Treino → Árvore.`:o.txt;
 el.innerHTML=`${o.ic?`<span class="tic">${o.ic}</span>`:''}<div><b>${esc(o.title||'')}</b>${extra?`<span>${esc(extra)}</span>`:''}${o.chips&&o.chips.length?`<div class="chipsrow">${o.chips.map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div>`:''}</div>`;
 el.onclick=()=>el.remove();
 const all=[...host.querySelectorAll('.toast:not(.out)')];if(all.length>2)all.slice(0,all.length-2).forEach(x=>x.remove());
 el._t1=setTimeout(()=>{el.classList.add('out');el._t2=setTimeout(()=>el.remove(),400)},o.ms||3200);
}
// ---------- pop-up de decisão ----------
function choicePopup(m){
 return new Promise(res=>{
  $ov.hidden=false;
  $ov.innerHTML=`<div class="ovwrap decpop ${m.kind||''}"><div class="dp-top"><span class="tag ${m.tagc||'vida'}">${esc(m.tag||'Decisão')}</span><span class="eyebrow">${esc(m.eyebrow||'')}</span></div>
  <div class="dp-ic">${m.ic||'⚡'}</div><h2 class="dp-t">${esc(m.title)}</h2><p class="dp-d">${esc(m.text||'')}</p>
  <div class="choices" id="dpC">${m.options.map((o,i)=>`<button class="choice" data-dp="${i}" style="animation-delay:${.25+i*.08}s"><span>${esc(o)}</span><span class="arrow">→</span></button>`).join('')}</div><div id="dpR"></div></div>`;
  $ov.querySelectorAll('[data-dp]').forEach(b=>b.onclick=async()=>{
   $ov.querySelectorAll('[data-dp]').forEach(x=>{x.disabled=true;if(x!==b)x.classList.add('fade')});b.classList.add('picked');
   const r=document.getElementById('dpR');r.innerHTML='<div class="suspense"><i></i><i></i><i></i></div>';
   await sleep(reduced?100:750);
   const out=m.pick(+b.dataset.dp);
   r.innerHTML=`<div class="outcome dp-out"><p>${esc(out.txt)}</p><div class="chipsrow">${(out.chips&&out.chips.length?out.chips:[['Nada muda','']]).map(([t,k],i)=>`<span class="chip ${k}" style="animation:pop .35s ${i*.08}s both">${esc(t)}</span>`).join('')}</div></div><button class="btn wide" id="dpOk" style="margin-top:12px">Continuar</button>`;
   document.getElementById('dpOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(out)};
  });
 });
}
function eventPopup(ev){
 return choicePopup({tag:ev.k==='vida'?'Fora de campo':'Em campo',tagc:ev.k,eyebrow:seasonLbl(S.year)+' · '+S.age+' anos',ic:ev.k==='vida'?'🏠':'⚽',title:ev.t,text:ev._d||(typeof ev.d==='function'?ev.d():ev.d),options:ev.o.map(o=>o[0]),
  pick:i=>{const r=resolveOption(ev,i);S.st.evlog.push({t:ev.t,txt:r.txt});return r}});
}
// ---------- reel de resultados ----------
function resultsReel(list,title){
 return new Promise(res=>{
  const ms=list.filter(r=>r.k==='match');if(!ms.length)return res();
  $ov.hidden=false;
  $ov.innerHTML=`<div class="ovwrap rreel"><div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(title)}</span><button class="btn ghost small" id="rlSkip">Pular</button></div>
  <div class="rltally"><div class="v"><b id="tV">0</b><span>vitórias</span></div><div class="e"><b id="tE">0</b><span>empates</span></div><div class="d"><b id="tD">0</b><span>derrotas</span></div><div class="g"><b id="tG">0</b><span>${S.pos==='GOL'?'sem sofrer':'seus gols'}</span></div></div>
  <div class="rllist" id="rlL"></div><div id="rlEnd"></div></div>`;
  const L=document.getElementById('rlL');let i=0,V=0,E=0,D=0,G=0,skip=false;
  const add=r=>{if(r.wdl==='V')V++;else if(r.wdl==='E')E++;else D++;G+=S.pos==='GOL'?(r.me&&r.me.cs?1:0):(r.me&&r.me.g||0);
   const mine=r.me&&r.me.play?`${r.me.g?'⚽'.repeat(Math.min(r.me.g,4)):''}${r.me.a?' 🅰️'.repeat(Math.min(r.me.a,3)):''} <b>${fmt1(r.me.nota)}</b>`:'<span class="muted">—</span>';
   L.insertAdjacentHTML('beforeend',`<div class="rlrow ${r.wdl}${r.final&&r.koWin?' title':''}"><span class="wdl ${r.wdl}">${r.wdl}</span><div class="rlmid"><small>${esc(r.comp)}</small><span>${shieldHTML(r.home,'sm')}<b>${r.hg}–${r.ag}</b>${shieldHTML(r.away,'sm')}<em>${esc((r.home.id===S.club?r.away:r.home).n)}</em></span></div><span class="rlme">${mine}</span></div>`);
   L.scrollTop=L.scrollHeight;
   for(const[id,v]of[['tV',V],['tE',E],['tD',D],['tG',G]]){const e=document.getElementById(id);if(e&&e.textContent!=String(v)){e.textContent=v;e.parentElement.classList.remove('bump');void e.offsetWidth;e.parentElement.classList.add('bump')}}};
  const end=()=>{document.getElementById('rlSkip').remove();document.getElementById('rlEnd').innerHTML=`<button class="btn wide" id="rlOk" style="margin-top:10px">Continuar</button>`;document.getElementById('rlOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()}};
  document.getElementById('rlSkip').onclick=()=>{skip=true};
  const step=()=>{if(skip){while(i<ms.length)add(ms[i++]);return end()}if(i>=ms.length)return end();add(ms[i++]);setTimeout(step,reduced?0:260)};
  setTimeout(step,250);
 });
}
function resultToast(r){
 const w={V:'VITÓRIA',E:'EMPATE',D:'DERROTA'}[r.wdl]||'';const m=r.me||{};
 const bits=[];if(m.play){if(m.g)bits.push(`${m.g} gol${m.g>1?'s':''}`);if(m.a)bits.push(`${m.a} assist.`);if(m.nota!=null)bits.push(`nota ${fmt1(m.nota)}`)}else bits.push(m.why==='base'?'você jogou na base':'você não jogou');
 toast({kind:'res '+r.wdl,ic:r.wdl==='V'?'✅':r.wdl==='E'?'🤝':'❌',title:`${w} ${r.hg}–${r.ag}`,txt:`${(r.home.id===S.club?r.away:r.home).n} · ${bits.join(' · ')}`,ms:2600});
}
// ---------- advance com fluxo contínuo ----------
const _advance0=advance;
advance=async function(mode,acc){
 if(BUSY)return;LIVE_USED=false;
 await _advance0(mode);
 const all=(acc||[]).concat(LASTR||[]);
 if(PAUSE){const ev=PAUSE;await eventPopup(ev);PAUSE=null;EVRES=null;saveNow('season');
  if(!S.st.done&&mode!=='decision'){LASTR=all;BUSY=false;return advance(mode,all)}}
 LASTR=all;
 if((mode==='block'||mode==='auto')&&all.filter(r=>r.k==='match').length>=2&&!LIVE_USED){const n=all.filter(r=>r.k==='match').length;await resultsReel(all,`Resultados · ${n} jogos`);}
 else if(!LIVE_USED){const m=all.filter(r=>r.k==='match').pop();if(m)resultToast(m)}
 KEEPSC=false;renderHub();
};
// ---------- decisão da semana vira pop-up ----------
const _weekHTMLd=weekHTML;
weekHTML=function(){return _weekHTMLd().replace(/<section class="card wildev">[\s\S]*?<\/section>/,'')};
const _bindWeekd=bindWeek;
bindWeek=function(){_bindWeekd();
 const ev=S.week&&S.week.ev&&!S.week.evDone&&!S.week.evShown&&typeof WILD!=='undefined'?WILD.find(e=>e.id===S.week.ev):null;
 if(ev&&$ov.hidden){S.week.evShown=true;setTimeout(async()=>{if(!$ov.hidden){S.week.evShown=false;return}
  await choicePopup({tag:'Aconteceu',tagc:'vida',eyebrow:'decida agora',ic:'🎲',title:ev.t,text:S.week.evD||'',options:ev.o.map(o=>o[0]),pick:i=>{const[txt,fx]=ev.o[i][1]();S.week.evDone=true;(S.st.evlog=S.st.evlog||[]).push({t:ev.t,txt});return{txt,chips:applyFx(fx)}}});
  KEEPSC=true;renderHub();if(typeof showPendingMoments==='function')showPendingMoments()},450)}
};
// ---------- resultados de ação viram toast ----------
const _lifeRefreshd=lifeRefresh;let LAST_TOAST=null;
lifeRefresh=function(){if(LIFE_MSG&&LIFE_MSG!==LAST_TOAST){LAST_TOAST=LIFE_MSG;toast({ic:'✨',title:LIFE_MSG.txt,chips:LIFE_MSG.chips,ms:3600})}_lifeRefreshd()};
