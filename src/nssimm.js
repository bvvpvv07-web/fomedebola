// ================== TREINO EM LANCES 3D, FOFOCAGRAM, MENSAGENS E TELA PRINCIPAL IMERSIVA ==================
// Treino: cada sessão é uma série de lances de jogo em 3D da habilidade escolhida, com 3 vidas.
// Fofocagram: o app de fotos do jogo; o Nardo Meses posta do perfil dele, com a SUA foto e a matéria por cima.
// Mensagens: técnico, agente, namorada, marcas e o Nardo falam com você, cada mensagem com o botão que leva direto ao lugar certo.
// Tela principal: cartão do jogador com as cores do clube, rosto, OVR, estrela e energia.

// ---------- treino em lances 3D ----------
const NS_TR3D={vel:[['contra','finish'],['mano','dribble'],['lanca','long'],['contra3','pass']],for:[['longe','finish'],['cabeca','header'],['voleio','finish'],['rebote','finish']],
 tec:[['mano','dribble'],['area','finish'],['pivo','dribble'],['rebote','finish']],vis:[['enfiada','pass',1],['virada','pass',1],['tabela','pass',1],['saida','pass',1],['cruz','cross',1]],
 bp:[['falta','fk'],['penalti','pen'],['faltaLonge','fk'],['faltaLat','cross',1]]};
const NS_TR3D_GK={vel:[['gkMano','keeper'],['gkShot','keeper']],for:[['gkCab','keeper'],['gkShot','keeper']],tec:[['tiroMeta','pass',1],['gkShot','keeper']],vis:[['tiroMeta','pass',1],['gkMano','keeper']],bp:[['gkPen','keeper'],['gkFk','keeper']]};
async function nsTrain3D(k){const L=(S.pos==='GOL'?NS_TR3D_GK:NS_TR3D)[k];const nm=NSK.find(x=>x[0]===k)[1];let lives=3,score=0,i=0;const off=RI(0,L.length-1);
 while(lives>0&&i<15){const[sc,kind,po]=L[(i+off)%L.length];i++;
  const o={kind,scen:sc,passOnly:!!po,planned:true,quick:i>1,comp:`Treino · ${nm} · ${'❤️'.repeat(lives)}${'🖤'.repeat(3-lives)} · ${score} acerto${score===1?'':'s'}`,title:`Treino de ${nm}`,skill:.6,keeper:.5,okTxt:'Boa!',pen:sc==='gkPen'};
  let res;try{res=await lance3dPlay(o)}catch(e){L3D.failed=true;return i>1?score:null}
  if(!res||res.skip)break;
  let ok=false;try{ok=!!l3dResult(o,res).ok}catch(e){}if(ok)score++;else lives--}
 return score}
{const _cfgT=l3dCfg;l3dCfg=function(o){const c=_cfgT(o);try{if(o&&o.quick)c.quick=true}catch(e){}return c}}
nsTrainSession=async function(k){const n=S.n;const cost=nsTrainCost();
 if((n.trainW||0)>=NS_TRAIN_MAX){await nsPop({ic:'🗓️',title:'Treinos da rodada feitos',txt:'Você já fez as 3 sessões desta rodada. Jogue a próxima partida pra liberar mais.'});return}
 if(n.en<cost){const q=await nsPop({ic:'❤️',title:'Sem energia pra treinar',txt:`O treino gasta ${cost}% e você está com ${Math.round(n.en)}%.`,opts:[['dr','🥤 Tomar energético']],ok:'Voltar'});if(q==='dr')await nsDrinkPick();return}
 const nm=NSK.find(x=>x[0]===k)[1];const in3d=typeof lanceMode==='function'&&lanceMode()==='jogar'&&!L3D.failed;
 const q=await nsPop({ic:NSK.find(x=>x[0]===k)[2],title:`Treino de ${nm}`,txt:in3d?'Lances de jogo em 3D, um atrás do outro. Você tem 3 vidas: cada lance que não der certo tira uma. Quanto mais acertos, mais a habilidade sobe.':'Minigame com 3 vidas. Quanto mais acertos, mais a habilidade sobe.',opts:[['go','▶ Começar']],ok:'Voltar'});if(q!=='go')return;
 n.en=clamp(n.en-cost,0,100);const h=nsHost();const was=!h.hidden;h.hidden=true;let sc=null,d3=false;
 try{if(in3d){sc=await nsTrain3D(k);d3=sc!=null}if(sc==null)sc=await nsTrainGame(k)}catch(e){console.error(e);sc=sc||0}
 $ov.hidden=true;$ov.innerHTML='';if(was)h.hidden=false;
 n.tbest=n.tbest||{};const rec=sc>(n.tbest[k]||0);if(rec)n.tbest[k]=sc;
 const mul=d3?clamp(.5+sc*.32,.5,2.8):clamp(.45+sc*.11,.45,2.8);const g=nsGain(k,mul);const s=n.sk[k];const l0=s.l;nsAddP(k,g);n.last[k]=n.week;n.trainW=(n.trainW||0)+1;n.trainT=(n.trainT||0)+1;
 if(n.coachAsk===k&&!n.coachAskDone){n.coachAskDone=true;n.rel.coach=clamp(n.rel.coach+5,0,100);toast({ic:'🪑',title:'O técnico viu',txt:'Você treinou o que ele pediu. Relação +5.',ms:2400})}
 nsSync();try{nsAchCheck()}catch(e){}
 const big=d3?sc>=4:sc>=10,mid=d3?sc>=2:sc>=5;
 await nsPop({ic:big?'🔥':mid?'👍':'😅',title:big?'Treino de craque!':mid?'Bom treino':'Treino fraco',html:`<div class="nstg-res"><b>${sc}</b><span>acerto${sc===1?'':'s'}${rec?' · NOVO RECORDE':''}</span></div>`,txt:`${nm}: +${g}% de progresso${s.l>l0?` e subiu pro nível ${s.l}!`:'.'} Treinos: ${n.trainW} de ${NS_TRAIN_MAX}.`});nsRefresh()};

// ---------- Fofocagram: Nardo Meses posta do perfil dele, com a sua foto ----------
const NS_NARDO={custom:{skin:'#e3b088',hairC:'#3a2a1a',style:'lateral',beard:'cavanhaque',acc:''}};
{const _fa2=fdAcc;fdAcc=function(kind){if(kind==='nardo')return{h:'nardomeses',av:`<span class="fd-av face nardo">${faceSVG(NS_NARDO,'#ff2bd6','#111')}</span>`,ver:true};return _fa2(kind)}}
const NS_FOFO_IC=[[/namor|jantar|aliança|casa maior|herdeiro|misteriosa|curtiu|ex\?/i,'💘'],[/festa|balada|camarote/i,'🥂'],[/carro|CT com brinquedo/i,'🏎️'],[/imóvel|mansão|castelo/i,'🏰'],[/BETTIGER|apostando/i,'🎰'],[/quer |acertou|empresário/i,'✈️'],[/técnico|vestiário|churrasco/i,'🗣️'],[/imprensa|apagada/i,'🙊'],[/cabelo|tatuagem/i,'✂️'],[/pizza/i,'🍕'],[/seleção/i,'🇧🇷']];
{const _g=nsGossip;nsGossip=function(){return _g().map(p=>{const ic=(NS_FOFO_IC.find(x=>x[0].test(p.title))||[0,'👀'])[1];let head=p.title.replace(/^🚨\s*/,'');const sents=head.match(/[^.!?]+[.!?]?/g)||[head];head=sents[0].trim();if(head.length<28&&sents[1])head+=' '+sents[1].trim();head=head.replace(/[.]$/,'');if(head.length>90)head=head.slice(0,88)+'…';
  return{...p,tag:'',media:`<div class="nsfofo2">${npPlayerPhoto({})}<span class="st">${ic}</span><div class="cap"><i>🚨 EXCLUSIVO · FOFOCAGRAM</i><b>${esc(head)}</b></div></div>`,deck:'Comenta aí 👇'}})}}
nsFeedPage=function(){return{t:'Fofocagram',cls:'feed',html:()=>{let posts=[];try{posts=fdPosts()}catch(e){}const g=nsGossip();FD.posts=g.concat(posts);
  return`<div class="fgram-h"><b>Fofocagram</b><span>📷 o app de fotos dos boleiros</span></div><div class="nsstories">${[['nardo','nardomeses'],['me','você'],['club','clube'],['gazeta','gazeta'],['mercado','mercado']].map(([k,t])=>{const a=fdAcc(k);return`<div><i>${a.av}</i><small>${esc(t)}</small></div>`}).join('')}</div>
  <div class="nsfeedv">${FD.posts.map((p,i)=>{try{return fdPostHTML(p,i)}catch(e){return''}}).join('')}</div>`},
 bind:B=>{B.querySelectorAll('[data-fo]').forEach(el=>el.onclick=()=>fdOpen(+el.dataset.fo));
  B.querySelectorAll('[data-fl]').forEach(b=>b.onclick=e=>{e.stopPropagation();const p=FD.posts[+b.dataset.fl];FD.likes[p.id]=!FD.likes[p.id];fdSync()});
  B.querySelectorAll('[data-fm]').forEach(m=>{m.onclick=()=>fdOpen(+m.dataset.fm)})}}};

// ---------- mensagens (técnico, agente, namorada, marcas, Nardo) ----------
function nsMsgAdd(m){const n=S.n;n.inbox=n.inbox||[];if(n.inbox.some(x=>x.key&&x.key===m.key&&!x.done))return;n.inbox.unshift({id:'m'+Date.now().toString(36)+RI(0,999),wk:n.week,read:false,done:false,...m});if(n.inbox.length>10)n.inbox.length=10}
function nsMsgWeek(){const n=S.n;if(!n)return;n.inbox=(n.inbox||[]).filter(m=>n.week-m.wk<5);const c=club();n.coachAskDone=false;
 const weak=nsWeakest();const nm=NSK.find(x=>x[0]===weak)[1];n.coachAsk=weak;
 const role=(()=>{try{return roleFor(S.ovr,c.s,S.age)}catch(e){return''}})();
 nsMsgAdd({key:'coach'+n.week,from:'Técnico',ic:'🪑',txt:role==='Titular'?`Mantém o nível. Essa semana quero você caprichando em ${nm}.`:`Quer jogar mais? Me mostra ${nm} no treino essa semana.`,acts:[['Ir treinar','train']]});
 if((n.offers||[]).length&&!S.agreed){const o=CLUB[n.offers[0].club];if(o)nsMsgAdd({key:'off'+o.id,from:nsAgTier()?'Seu agente':'Mercado',ic:'💼',txt:`O ${o.n} mandou proposta. Quer ver?`,acts:[['Ver proposta','market']]})}
 if(S.contract<=1&&!S.loan&&!S.agreed)nsMsgAdd({key:'renew'+S.year,from:nsAgTier()?'Seu agente':'Diretoria',ic:'✍️',txt:'Seu contrato acaba no fim da temporada. Bora sentar pra renovar?',acts:[['Renovar','renew']]});
 if(n.spOffer)nsMsgAdd({key:'sp'+n.spOffer.b,from:n.spOffer.b,ic:'🤝',txt:`Oi! Queremos você na nossa campanha. ${nsK(n.spOffer.w)} por jogo.`,acts:[['Ver proposta','spon']]});
 if(S.gf&&ch(.5))nsMsgAdd({key:'gf'+n.week,from:S.gf.n,ic:'💬',txt:pick(['Saudade… janta comigo hoje?','Vi seu jogo! Orgulho 😍 Bora sair?','Tô te esperando pro cinema 🍿']),acts:[['Topar','gf']]});
 else if(!S.gf&&n.happy<50&&ch(.4))nsMsgAdd({key:'amigo'+n.week,from:'Amigo da base',ic:'🎉',txt:'Festa no sábado, vai ter gente nova. Cola?',acts:[['Ir','vida']]});
 if(ch(.35))nsMsgAdd({key:'nardo'+n.week,from:'Nardo Meses',ic:'🗞️',txt:'Oi, aqui é o Nardo Meses. Vou publicar uma sobre você hoje. Quer ver antes de todo mundo?',acts:[['Abrir o Fofocagram','feed']]});
 if((S.board||50)<30)nsMsgAdd({key:'board'+n.week,from:'Diretoria',ic:'🏛️',txt:'A diretoria está insatisfeita. Treine, jogue bem e evite polêmica.',acts:[['Ver relações','vida']]});
 if(n.en<35)nsMsgAdd({key:'en'+n.week,from:'Preparador físico',ic:'🧃',txt:`Você está com ${Math.round(n.en)}% de energia. Toma um energético antes do jogo.`,acts:[['Tomar','drink']]})}
{const _wkI=nsWeek;nsWeek=function(){const r=_wkI.apply(this,arguments);try{nsMsgWeek()}catch(e){console.error(e)}return r}}
{const _bsI=buildSeason;buildSeason=function(...a){const r=_bsI.apply(this,a);try{if(S.n&&!(S.n.inbox||[]).length)setTimeout(()=>{try{nsMsgWeek();if(document.body.classList.contains('nshub'))renderHub()}catch(e){}},0)}catch(e){}return r}}
async function nsMsgAct(m,k){m.done=true;m.read=true;
 if(k==='train')return nsPush0(nsHabPage());if(k==='market'){NS_MK='prop';return nsPush0(nsMarketPage())}if(k==='renew'){nsClose0();return nsRenew()}
 if(k==='spon'){await nsSpOfferPop();return nsRefresh()}if(k==='gf'){await nsRelAct('gf');return}if(k==='vida')return nsPush0(nsVidaPage());if(k==='feed')return nsPush0(nsFeedPage());if(k==='drink'){await nsDrinkPick();return nsRefresh()}}
function nsPush0(p){if(NSP.stack.length)nsPush(p);else nsOpen(p)}
function nsClose0(){if(NSP.stack.length){const h=nsHost();h.hidden=true;h.innerHTML='';NSP.stack=[];document.body.classList.remove('nsp-open')}}
function nsInboxPage(){return{t:'Mensagens',cls:'inbox',html:()=>{const n=S.n;const L=n.inbox||[];
  if(!L.length)return`<div class="nsempty"><span>📱</span><b>Nenhuma mensagem</b><p class="muted">Depois de cada jogo chegam recados do técnico, do agente, da namorada, das marcas e do Nardo Meses.</p></div>`;
  return`<div class="nsmsgs" data-pg>${L.map((m,i)=>`<div class="nsmsg ${m.read?'':'new'} ${m.done?'done':''}"><span class="av">${m.ic}</span><div class="bd"><b>${esc(m.from)}</b><p>${esc(m.txt)}</p>${!m.done&&m.acts?`<div class="ac">${m.acts.map(([t,k])=>`<button class="btn small" data-ma="${i}:${k}">${esc(t)}</button>`).join('')}</div>`:''}</div></div>`).join('')}</div>`},
 bind:B=>{const n=S.n;(n.inbox||[]).forEach(m=>m.read=true);B.querySelectorAll('[data-ma]').forEach(b=>b.onclick=()=>{const[i,k]=b.dataset.ma.split(':');const m=n.inbox[+i];if(m)nsMsgAct(m,k)})}}}
{const _ws2=nsWeekStrip;nsWeekStrip=function(){let h=_ws2();const u=((S.n&&S.n.inbox)||[]).filter(m=>!m.read).length;if(h)h=h.replace('<div class="nsweek">',`<div class="nsweek"><button class="nsw ${u?'hot':'ok'}" id="nwMsg"><span>📱</span>${u?`${u} nova${u>1?'s':''}`:'Mensagens'}</button>`);return h}}

// ---------- tela principal imersiva ----------
function nsHeroHTML(){const n=S.n;const c=club()||{};const c1=c.c1||'#c8102e',c2=c.c2||'#ffffff';const role=nsStatusRole();
 return`<div class="nshero" style="--c1:${c1};--c2:${c2}"><div class="nshero-bg"></div>
 <div class="nshero-tb"><button class="nsico" id="nsExit" aria-label="Sair">✕</button><span class="nshero-cl">${shieldHTML(c,'sm')}<b>${esc(c.n||'')}</b></span><button class="nsico" id="nsCfg" aria-label="Opções">⚙️</button><button class="nsico" id="nsHelp" aria-label="Ajuda">?</button></div>
 <div class="nshero-m"><button class="nshero-av" id="nsNameB" aria-label="Seu visual">${faceSVG(S.face||{preset:0},c1,c2)}<i>${S.shirt||S.num}</i></button>
  <div class="nshero-i"><b>${esc(S.name)}</b><span>${esc(POS[S.pos].n)} · ${S.age} anos · <em class="${role[2]}">${role[0]} ${esc(role[1])}</em></span>
   <div class="nshero-row"><span class="ovr"><small>OVR</small>${S.ovr}</span>
    <button class="hm star" id="nsStarB"><span>⭐ Estrela ${n.star.l}</span><i style="width:${Math.round(n.star.p)}%"></i></button>
    <button class="hm en ${n.en<30?'low':''}" id="nsEnB"><span>❤️ Energia ${Math.round(n.en)}%</span><i style="width:${Math.round(n.en)}%"></i></button></div></div></div></div>`}
{const _hh3=nsHubHTML;nsHubHTML=function(){let h=_hh3.apply(this,arguments);
 h=h.replace(/<div class="nsh-top">[\s\S]*?id="nsEnB"[\s\S]*?<\/button><\/div>/,nsHeroHTML());
 // botão Jogar mostra o adversário
 try{const nm=typeof nextMatchInfo==='function'?nextMatchInfo():null;const o=nm&&nm.opp&&CLUB[nm.opp];if(o&&!S.st.done)h=h.replace('<button id="nsJogar" class="go"><span>➜⚽</span>',`<button id="nsJogar" class="go"><span class="vs">${shieldHTML(o,'sm')}</span>`)}catch(e){}
 return h}}
{const _rnh4=nsRenderHub;nsRenderHub=function(){const r=_rnh4.apply(this,arguments);try{const e=document.getElementById('nwMsg');if(e)e.onclick=()=>nsOpen(nsInboxPage());const nb=document.getElementById('nsNameB');if(nb)nb.onclick=()=>nsOpen(nsLookPage())}catch(e){}return r}}
if(typeof TOUR_HUB!=='undefined'){for(const t of TOUR_HUB){if(t.sel==='.nsh-bars'){t.sel='.nshero';t.t='Seu craque';t.d='Toque no rosto pra mudar o visual. <b>Estrela</b> sobe com boas atuações; <b>energia</b> cai no treino e no jogo.'}}TOUR_HUB.splice(1,0,{sel:'#nwMsg',t:'Mensagens',d:'Técnico, agente, namorada, marcas e o Nardo Meses falam com você aqui. Cada recado tem o botão que leva direto ao lugar certo.'})}
// páginas com a cara do clube
{const _d2=nsDraw;nsDraw=function(){_d2.apply(this,arguments);try{const c=club()||{};const pg=document.querySelector('#nsp .nspg');if(pg){pg.style.setProperty('--c1',c.c1||'#c8102e');pg.style.setProperty('--c2',c.c2||'#fff')}}catch(e){}}}

{const st=document.createElement('style');st.textContent=`
body.nshub,#nsp{background:radial-gradient(120% 60% at 50% -10%,#1f5a3a 0,#0d2a1c 45%,#081a11 100%)}
.nshero{position:relative;border-radius:20px;overflow:hidden;padding:8px 10px 10px;background:linear-gradient(135deg,var(--c1),color-mix(in srgb,var(--c1) 45%,#0b1610));box-shadow:0 6px 18px #0008,inset 0 0 0 1px #ffffff22;color:#fff;flex:none}
.nshero-bg{position:absolute;inset:0;background:radial-gradient(60% 80% at 85% 0%,#ffffff40,transparent 60%),repeating-linear-gradient(90deg,#ffffff08 0 30px,transparent 30px 60px),linear-gradient(180deg,transparent 40%,#0006);pointer-events:none}
.nshero-tb{position:relative;display:flex;align-items:center;gap:6px}.nshero-tb .nsico{width:36px;height:36px;background:#0005;border-color:#ffffff30;color:#fff}.nshero-cl{flex:1;display:flex;align-items:center;gap:8px;min-width:0}.nshero-cl b{font:800 15px var(--f-display);letter-spacing:.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 2px #0008}
.nshero-m{position:relative;display:flex;gap:12px;align-items:flex-end;margin-top:4px}
.nshero-av{position:relative;flex:none;width:clamp(78px,20vw,120px);aspect-ratio:1;border-radius:18px;border:3px solid #ffffffcc;background:linear-gradient(180deg,#ffffff30,#0003);padding:0;overflow:hidden;box-shadow:0 4px 12px #0007}.nshero-av svg,.nshero-av img{width:100%;height:100%;display:block}.nshero-av i{position:absolute;right:4px;bottom:4px;font:900 15px var(--f-display);font-style:normal;background:var(--c2);color:var(--c1);border-radius:8px;padding:0 6px;box-shadow:0 1px 3px #0008}
.nshero-i{flex:1;min-width:0;display:grid;gap:4px}.nshero-i>b{font:900 clamp(20px,5.2vw,30px)/1 var(--f-display);letter-spacing:.4px;text-shadow:0 2px 3px #0009;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nshero-i>span{font:700 12.5px var(--f-body);opacity:.95;text-shadow:0 1px 2px #0009}.nshero-i em{font-style:normal;background:#0006;border-radius:6px;padding:1px 6px}.nshero-i em.good{background:#1d6b2acc}.nshero-i em.warn{background:#8a6a12cc}.nshero-i em.bad{background:#8a3329cc}
.nshero-row{display:grid;grid-template-columns:auto 1fr 1fr;gap:6px;align-items:stretch}.nshero-row .ovr{display:grid;place-items:center;background:#0008;border-radius:12px;padding:2px 10px;font:900 24px/1 var(--f-display);color:#ffd23c}.nshero-row .ovr small{font:800 9px var(--f-body);color:#fff;opacity:.8}
.hm{position:relative;overflow:hidden;border-radius:12px;border:1px solid #ffffff40;background:#0007;color:#fff;font:800 12.5px var(--f-body);padding:0 8px;min-height:38px;text-align:left}.hm span{position:relative;z-index:1;text-shadow:0 1px 2px #000}.hm i{position:absolute;left:0;top:0;bottom:0;z-index:0}.hm.star i{background:linear-gradient(90deg,#b8860b,#f2c443)}.hm.en i{background:linear-gradient(90deg,#2f9e44,#7be36b)}.hm.en.low i{background:linear-gradient(90deg,#b0261c,#ff6a5c)}
.nsh-nav .go .vs{display:grid;place-items:center;height:26px}.nsh-nav .go .vs .shield{transform:scale(1.05)}
.nsp-h{background:linear-gradient(90deg,color-mix(in srgb,var(--c1,#1d4a2c) 70%,#0b1610),transparent);border-radius:14px;padding:6px 8px}
.fgram-h{display:flex;align-items:baseline;justify-content:center;gap:10px}.fgram-h b{font:italic 900 30px/1 'Brush Script MT','Segoe Script',var(--f-display);background:linear-gradient(90deg,#ffd400,#ff2bd6,#7a5cff);-webkit-background-clip:text;background-clip:text;color:transparent}.fgram-h span{font:700 12px var(--f-body);color:var(--muted)}
.fd-av.nardo{background:#ffd400}.fd-av.nardo svg{width:100%;height:100%}
.nsfofo2{position:absolute;inset:0}.nsfofo2 .np-ph{position:absolute;inset:0;height:auto!important;border:0}.nsfofo2 .np-ph-face{width:min(300px,64%)}
.nsfofo2 .st{position:absolute;top:10px;right:12px;font-size:44px;filter:drop-shadow(0 3px 4px #0008);transform:rotate(8deg)}
.nsfofo2 .cap{position:absolute;left:0;right:0;bottom:0;padding:14px 14px 12px;background:linear-gradient(180deg,transparent,#000d 38%);display:grid;gap:4px;text-align:left}.nsfofo2 .cap i{font-style:normal;justify-self:start;font:900 11px var(--f-body);letter-spacing:1px;background:#ff2bd6;color:#fff;padding:3px 8px;border-radius:6px}.nsfofo2 .cap b{font:900 clamp(18px,4.8vw,26px)/1.12 var(--f-display);color:#fff;text-shadow:0 2px 4px #000}
.nsmsgs{display:grid;gap:8px}.nsmsg{display:flex;gap:10px;align-items:flex-start;background:var(--panel);border:1px solid var(--line-2);border-radius:16px;padding:10px 12px}.nsmsg.new{border-color:#ff9f1c;box-shadow:0 0 0 2px #ff9f1c33}.nsmsg.done{opacity:.6}.nsmsg .av{flex:none;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#2a6a49,#123b27);font-size:22px}
.nsmsg .bd{flex:1;min-width:0}.nsmsg b{font:800 14.5px var(--f-body)}.nsmsg p{margin:2px 0 6px;background:#0d2118;border-radius:4px 14px 14px 14px;padding:8px 10px;line-height:1.35}.nsmsg .ac{display:flex;gap:6px;flex-wrap:wrap}
@media (max-height:740px){.nshero-av{width:68px}.nshero-i>b{font-size:20px}.hm{min-height:32px}}
`;document.head.appendChild(st)}
