// ============ NSS · competições em destaque, Seleção, Copa do Mundo e metas por jogo ============
// Tudo aqui é pra prender: o que está em jogo aparece antes da partida, as metas pagam bônus,
// a convocação vira um momento e a tela principal mostra manchetes que giram.
const NSGO_TOUR={wc:'🌍',natc:'🏆',oly:'🥇'};
function nsgoNat(){return NATS[S.nat]||{n:'Seleção',f:'🏳️',s:80}}
function nsgoNeed(){const nat=nsgoNat();const fama=(S.life&&S.life.fama)||0;return Math.round(nat.s-7-(fama-50)/25)}
function nsgoWcIn(){const end=S.year+1;let k=(2-end%4+4)%4;return{k,year:end+k}} // k=0: a Copa é nesta temporada
function nsgoCompIc(c){if(!c)return'🏆';if(c.kind==='tour')return NSGO_TOUR[c.id]||'🏆';if(c.id==='mun')return'🌐';if(/cont|int|usc|rec/.test(c.id||''))return'🌎';if(c.youth)return'🌱';return'🏆'}
function nsgoLgPos(){try{const st=S.st;const rows=sortTable(st.table,st.lg);const i=rows.findIndex(x=>x.id===S.club);if(i<0)return null;return{pos:i+1,n:rows.length,pts:rows[i].p,lead:rows[0].p,gapTop:rows[0].p-rows[i].p,rows}}catch(e){return null}}
function nsgoCst(c){const st=S.st;if(!c)return['',''];if(c.won)return['🏆 Campeão','gold'];if(c.alive===false)return[c.skip?'Não disputa':c.out?`Fora · ${c.out}`:'Eliminado','off'];
 const pend=k=>(st.cal||[]).slice(st.idx||0).some(it=>it.k===k&&(it.cid||'est')===c.id);
 if(pend('grp'))return[c.kind==='grp'?'Fase de grupos':'Fase de liga','on'];if(c.id==='mun'&&pend('est'))return['Fase de grupos','on'];
 if(c.campPO&&!c.setup)return['Playoff: só se terminar na zona','soft'];
 const rd=c.rounds&&c.rounds[c.stage];return rd?[`Próxima: ${rd.n}${c.leg1?` · ida ${c.leg1.ag}×${c.leg1.at}`:''}`,'on']:['Em andamento','on']}
function nsgoInjured(o){const st=S.st;if(!st)return true;if(st.injLeft>0)return true;const k=(o&&o.kind)||'club';if(k==='club'&&st.suspLeft>0)return true;if(typeof HIDDEN_PRO!=='undefined'&&HIDDEN_PRO)return true;try{if(typeof inPrison==='function'&&inPrison()&&k==='club')return true}catch(e){}if(k==='club'&&S.youth&&o&&!(o.youthS||o.debut))return true;return false}
// ---------- etiquetas do jogo (FINAL, CLÁSSICO, VOLTA...) ----------
function nsgoKO(o){if(!o)return false;if(o.ko!==undefined)return!!o.ko;if('final' in o)return true;const lb=String(o.label||'');return /Final|Semifinal|Quartas|Oitavas|16 avos|ª fase|Playoff|Repescagem|Preliminar/i.test(lb)&&!/jogo \d|rodada|grupo|liga/i.test(lb)}
function nsgoTags(o){const T=[];if(!o)return T;const lb=String(o.label||''),cp=String(o.comp||'');const me=club();
 const oppId=o.opp||(o.them&&o.them.id);const opp=oppId&&CLUB[oppId];
 if(/Copa do Mundo/i.test(cp))T.push(['🌍 COPA DO MUNDO','gold']);
 else if(o.kind==='nat'||(o.us&&o.us.nat))T.push([`${nsgoNat().f} SELEÇÃO`,'nat']);
 const ko=nsgoKO(o);
 if(ko&&(o.final||/^Final/.test(lb)))T.push(['🏆 FINAL','gold']);
 else if(ko&&/Semifinal/.test(lb))T.push(['SEMIFINAL','red']);
 else if(ko)T.push(['MATA-MATA','red']);
 if(ko&&(/\bvolta\b/.test(lb)||o.agg))T.push(['JOGO DE VOLTA','vio']);else if(ko&&/\bida\b/.test(lb))T.push(['JOGO DE IDA','vio']);
 if(opp&&me&&opp.uf&&me.uf&&opp.uf===me.uf&&opp.id!==me.id&&!(o.kind==='nat'))T.push(['🔥 CLÁSSICO','fire']);
 try{const st=S.st;if(st&&me&&cp===LG[st.lg].n&&opp){const L=nsgoLgPos();if(L){const op=L.rows.findIndex(x=>x.id===opp.id)+1;
  if(L.pos===1&&op&&op<=3)T.push(['⚔️ VALE A LIDERANÇA','gold']);else if(op&&L.pos<=4&&op<=4)T.push(['CONFRONTO DIRETO','red']);else if(L.pos===1)T.push(['👑 LÍDER EM CAMPO','gold'])}}}catch(e){}
 return T.slice(0,3)}
function nsgoTagsHTML(T,cls){return T.length?`<div class="nsgo-tags ${cls||''}">${T.map(([t,c])=>`<span class="${c}">${esc(t)}</span>`).join('')}</div>`:''}
function nsgoStakes(o){const lb=String(o.label||''),cp=String(o.comp||'');const ko=nsgoKO(o);
 if(ko&&(o.final||/^Final/.test(lb)))return /Copa do Mundo/.test(cp)?'O mundo inteiro assistindo. Ganhou, virou lenda.':'Vale a taça. Quem ganhar levanta o troféu hoje.';
 if(o.agg){const[a,b]=o.agg;return a>b?`Na ida deu ${a}×${b} pra vocês. Segura que a vaga é sua.`:a<b?`Na ida perderam por ${b}×${a}. Precisa virar!`:`A ida terminou ${a}×${b}. Quem ganhar hoje passa.`}
 if(ko&&/Semifinal/.test(lb))return'Ganhou, está na final.';
 if(ko&&/\bida\b/.test(lb))return'Primeiro jogo do mata-mata. A volta é daqui a algumas rodadas.';
 if(ko)return'Mata-mata: perdeu, está fora.';
 if(o.kind==='nat')return /Copa do Mundo/.test(cp)?'Jogo de Copa do Mundo. O país inteiro para.':'Cada jogo pela seleção conta pra convocação da Copa.';
 const T=nsgoTags(o).map(x=>x[0]).join(' ');if(/CLÁSSICO/.test(T))return'Clássico: a torcida não aceita perder pro rival.';if(/LIDERANÇA/.test(T))return'Ganhou, segue na ponta. Perdeu, o rival encosta.';if(/CONFRONTO/.test(T))return'Briga direta lá em cima da tabela.';
 return''}
function nsgoBig(o){const t=nsgoTags(o).map(x=>x[0]).join(' ');return /FINAL|COPA DO MUNDO/.test(t)?3:/SEMI|MATA|VOLTA|CLÁSSICO|LIDERANÇA|CONFRONTO|SELEÇÃO/.test(t)?2:1}
// ---------- metas da partida ----------
const NSGO_ATT=['ATA','SA','PE','PD'],NSGO_MID=['MEI','MC','ME','MD'],NSGO_DEF=['ZAG','LE','LD','VOL'];
function nsgoMetas(o){const p=S.pos;const lv=(S.n&&S.n.star&&S.n.star.l)||1;const big=nsgoBig(o);const mult=big===3?3:big===2?2:1;
 const nt=Math.min(7.6,Math.round((6.7+lv*.1)*10)/10);const L=[];
 const add=(k,t,v,m,st)=>L.push({k,t,v,din:nsW(m*mult),st:st*mult});
 add('nota',`Nota ${fmt1(nt)} ou mais`,nt,.3,5);
 if(p==='GOL')add('cs','Não levar gol',0,.6,6);
 else if(NSGO_ATT.includes(p))(lv>=4&&ch(.5))?add('g2','Fazer 2 gols',2,1,12):add('g','Marcar um gol',1,.6,7);
 else if(NSGO_MID.includes(p))ch(.5)?add('a','Dar uma assistência',1,.5,6):add('ga','Gol ou assistência',1,.45,6);
 else ch(.6)?add('cs','Time não levar gol',0,.5,5):add('ps','12 passes certos ou mais',12,.3,4);
 add('win',o.agg||/\b(ida|volta)\b/.test(o.label||'')?'Vencer este jogo':'Vencer o jogo',0,.5,4);
 return{list:L,big,key:(o.comp||'')+'|'+(o.label||'')+'|'+(S.st?S.st.idx:0)}}
function nsgoMetaOk(m,me,r,ps){if(!me||!me.play)return false;switch(m.k){case'nota':return me.nota!=null&&me.nota>=m.v;case'cs':return r.gt===0&&me.min>=60;case'g':return me.g>=1;case'g2':return me.g>=2;case'a':return me.a>=1;case'ga':return me.g+me.a>=1;case'ps':return ps>=m.v;case'win':return r.gu>r.gt}return false}
function nsgoRwd(m){return`<span class="rw">+${money(m.din)}${m.st?` · ⭐+${Math.round(m.st)}`:''}</span>`}
{const _am=nsAfterMatch;nsAfterMatch=function(r,o,cur){const p=_am.apply(this,arguments);try{const n=S.n;const M=n&&n.goMeta;if(M&&!M.done){M.done=true;
  const me=p.me;const res=M.list.map(m=>({...m,ok:nsgoMetaOk(m,me,r,p.ps||0)}));const played=!!(me&&me.play);let din=0,st=0;
  for(const m of res)if(m.ok){din+=m.din;st+=m.st}
  const all=played&&res.every(m=>m.ok);if(all){st+=8;if(S.life)S.life.fama=clamp((S.life.fama||0)+2,0,100)}
  if(din)S.din+=din;if(st)nsStarAdd(st);p.st1={l:n.star.l,p:n.star.p};
  n.goStats=n.goStats||{m:0,ok:0,all:0};n.goStats.m+=res.length;n.goStats.ok+=res.filter(x=>x.ok).length;if(all)n.goStats.all++;
  p.metas={res,played,din,all};n.goMeta=null;try{nsSync()}catch(e){}}}catch(e){console.error(e)}return p}}
{const _sr=nsStarRowHTML;nsStarRowHTML=function(p){let h=_sr.apply(this,arguments);try{const M=p&&p.metas;if(M){
  h+=`<div class="nsgo-mres ${M.all?'all':''}"><div class="hd"><b>🎯 Metas do jogo</b><span>${M.played?`${M.res.filter(x=>x.ok).length}/${M.res.length}${M.din?` · +${money(M.din)}`:''}`:'não entrou'}</span></div>
  ${M.res.map(m=>`<div class="mt ${m.ok?'ok':'no'}"><i>${m.ok?'✅':'❌'}</i><b>${esc(m.t)}</b>${m.ok?nsgoRwd(m):'<span class="rw off">—</span>'}</div>`).join('')}
  ${M.all?'<div class="all">🔥 TRINCA! Bateu todas as metas: ⭐ +8 e fama +2</div>':M.played?'':'<small class="muted">Sem entrar em campo as metas não contam. Melhore a relação com o técnico pra jogar mais.</small>'}</div>`}}catch(e){}return h}}
// ---------- telas cheias (início de temporada, convocação, pré-jogo) ----------
function nsgoShow(html,cls,bind){return new Promise(res=>{const h=document.createElement('div');h.className='nsgo-host '+(cls||'');h.innerHTML=`<div class="nsgo-card">${html}</div>`;document.body.appendChild(h);
 const end=v=>{if(!h.isConnected)return;h.classList.add('out');setTimeout(()=>h.remove(),180);res(v)};
 h.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>end(b.dataset.go));try{if(bind)bind(h,end)}catch(e){console.error(e)}})}
function nsgoSide(s){if(!s)return'';const c=CLUB[s.id];if(s.nat||!c)return`<span class="sd"><i class="fl">${s.f||'🏳️'}</i><b>${esc(s.n||'')}</b></span>`;return`<span class="sd">${shieldHTML(c)}<b>${esc(c.n)}</b></span>`}
function nsgoSeasonList(){const st=S.st;const L=[];try{L.push(['📊',LG[st.lg].n,'Liga · todas as rodadas'])}catch(e){}
 for(const c of Object.values(st.comps||{})){if(!c||c.youth)continue;if(c.kind==='tour'){if(c.qualified===false){L.push([nsgoCompIc(c),c.n,`${nsgoNat().n} não se classificou`,'off']);continue}L.push([nsgoCompIc(c),c.n,'Seleções · precisa ser convocado','hot']);continue}
  if(c.skip)continue;const[t,k]=nsgoCst(c);L.push([nsgoCompIc(c),c.n,t.replace(/^Próxima: /,''),k==='soft'?'off':''])}
 return L}
async function nsgoSeasonIntro(){const st=S.st;st.goIntro=true;const W2=nsgoWcIn();const L=nsgoSeasonList();const need=nsgoNeed();
 const wc=W2.k===0?`<div class="nsgo-wc"><b>🌍 É ANO DE COPA DO MUNDO!</b><small>${nsgoNat().f} ${esc(nsgoNat().n)} ${st.comps.wc&&st.comps.wc.qualified===false?'ficou fora.':`vai à Copa. Pra ser convocado: OVR perto de ${need} (você: ${S.ovr}).`}</small></div>`
  :`<div class="nsgo-wc soft"><b>🌍 Copa do Mundo ${W2.year}</b><small>Faltam ${W2.k} temporada${W2.k>1?'s':''}. Chegue com OVR ${need}+ pra ir.</small></div>`;
 await nsgoShow(`<div class="nsgo-ey">Temporada ${esc(seasonLbl(S.year))}</div><h2>O que está em jogo</h2>
  <div class="nsgo-list">${L.map(([ic,n,d,c])=>`<div class="${c||''}"><span>${ic}</span><div><b>${esc(n)}</b><small>${esc(d||'')}</small></div></div>`).join('')}</div>${wc}
  <button class="btn wide nsgo-go" data-go="1">Começar a temporada ➜</button>`,'season')}
async function nsgoCallUp(o){const nat=nsgoNat();const wc=/Copa do Mundo/.test(o.comp||'');const tour=!!(Object.values(S.st.comps||{}).find(c=>c&&c.kind==='tour'&&c.n===o.comp));const first=!(S.caps>0)&&!S.n.natFirst;
 if(first){S.n.natFirst=1;if(S.life)S.life.fama=clamp((S.life.fama||0)+5,0,100);nsStarAdd(10)}
 const team=(()=>{try{return shuffle((W.stars||[]).filter(s=>s.nat===S.nat)).slice(0,3).map(s=>s.n)}catch(e){return[]}})();
 await nsgoShow(`<div class="nsgo-flag">${nat.f}</div><div class="nsgo-ey">${wc?'Lista final da Copa do Mundo':tour?esc(o.comp):'Data FIFA'}</div><h2 class="cv">${wc?'VOCÊ VAI À COPA!':'CONVOCADO!'}</h2>
  <p>${wc?`O técnico leu o seu nome na lista dos 26. ${esc(nat.n)} conta com você no maior torneio do planeta.`:`O técnico de ${esc(nat.n)} chamou você pra ${tour?esc(o.comp):'os próximos jogos'}.`}${team.length?` Você vai treinar ao lado de ${team.map(esc).join(', ')}.`:''}</p>
  <div class="nsgo-nst"><div><span>Jogos pela seleção</span><b>${S.caps||0}</b></div><div><span>Gols</span><b>${S.natGoals||0}</b></div></div>
  ${first?'<div class="nsgo-first">🎉 Primeira convocação! Fama +5 · ⭐ +10</div>':''}
  <button class="btn wide nsgo-go" data-go="1">${S.nat==='BRA'?'Vestir a amarelinha':'Vestir a camisa'} ➜</button>`,'callup')}
async function nsgoHype(o,M){const T=nsgoTags(o);const sk=nsgoStakes(o);const big=M.big;
 await nsgoShow(`${nsgoTagsHTML(T,'lg')}<div class="nsgo-ey">${esc(o.comp||'')}${o.label?' · '+esc(o.label):''}</div>
  <div class="nsgo-vs">${nsgoSide(o.home===false&&!o.neutral?o.them:o.us)}<em>×</em>${nsgoSide(o.home===false&&!o.neutral?o.us:o.them)}</div>
  ${sk?`<p class="nsgo-sk">${esc(sk)}</p>`:''}
  <div class="nsgo-metas"><div class="hd"><b>🎯 Suas metas</b><small>${big>1?`Jogo grande: bônus ×${big}`:'Bônus pago pelo clube'}</small></div>${M.list.map(m=>`<div class="mt"><i>◻️</i><b>${esc(m.t)}</b>${nsgoRwd(m)}</div>`).join('')}<small class="muted">Bata as 3 e ganhe a TRINCA: ⭐ +8 e fama.</small></div>
  <button class="btn wide nsgo-go ${big>1?'hot':''}" data-go="1">${big===3?'É AGORA! ⚽':'BORA! ⚽'}</button>`,'hype b'+big)}
async function nsgoBefore(o){const n=S.n;if(!n||!S.st)return;
 if(!S.st.goIntro&&!S.youth){try{await nsgoSeasonIntro()}catch(e){console.error(e)}}
 if(o.kind==='nat'){const tour=Object.values(S.st.comps||{}).find(c=>c&&c.kind==='tour'&&c.n===o.comp);const key=tour?'t:'+tour.id+':'+S.year:'i:'+S.st.idx;S.st.natSeen=S.st.natSeen||{};
  if(!S.st.natSeen[key]){S.st.natSeen[key]=1;try{await nsgoCallUp(o)}catch(e){console.error(e)}}}
 if(nsgoInjured(o)){n.goMeta=null;return}
 const M=nsgoMetas(o);n.goMeta={...M,done:false};try{await nsgoHype(o,M)}catch(e){console.error(e)}}
{const _pmG=playMine;playMine=async function(o,io){try{if(nsOn()&&typeof NSSM!=='undefined'&&NSSM.inPost&&o&&o.us&&!o.debut)await nsgoBefore(o)}catch(e){console.error(e)}return _pmG.apply(this,arguments)}}
// ficou fora da lista: mostra quanto falta
{const _pi=processItem;processItem=async function(it,io){const r=await _pi.apply(this,arguments);try{if(nsOn()&&r&&r.k==='info'&&/não foi convocado/.test(r.txt||'')){const need=nsgoNeed();const gap=Math.max(1,need-S.ovr);const wc=/Copa do Mundo/.test(r.txt);
  S.n.natMiss={y:S.year,gap,wc};
  if(wc&&typeof NSSM!=='undefined'&&NSSM.inPost)await nsPop({ic:'🌍',title:'Fora da Copa do Mundo',txt:`O técnico da seleção não chamou você. Ele quer OVR perto de ${need} (você tem ${S.ovr}). Fama e boa fase também pesam. A próxima Copa é daqui a 4 anos.`,ok:'Bola pra frente'});
  else if(S.age>=18&&gap<=8)toast({ic:nsgoNat().f,title:'Quase convocado',txt:`Faltam uns ${gap} de OVR pra entrar na lista da seleção.`,ms:2600})}}catch(e){console.error(e)}return r}}
// ---------- manchetes que giram na tela principal ----------
function nsgoHeads(){const H=[];const st=S.st;if(!st)return H;const me=club();
 try{const L=nsgoLgPos();if(L&&L.rows.some(r=>r.j>0)){const lg=LG[st.lg].n;H.push(L.pos===1?{ic:'👑',l:lg,b:`Vocês são LÍDERES!`,e:`${L.pts} pts`,hot:1,go:'liga'}:{ic:'📊',l:lg,b:`${L.pos}º lugar`,e:L.gapTop?`${L.gapTop} pt${L.gapTop>1?'s':''} do líder`:'',go:'liga'})}}catch(e){}
 try{const R=nsRace();if(R&&R.gl.length){const top=R.gl[0];const mi=R.gl.findIndex(x=>x.me);if(top.v>0)H.push({ic:'⚽',l:'Artilharia',b:top.me?`Você lidera com ${top.v} gols!`:`${top.n} · ${top.v} gols`,e:mi>=0&&S.pos!=='GOL'?`você: ${R.gl[mi].v}`:'',hot:top.me?1:0,go:'art'})}}catch(e){}
 try{for(const c of Object.values(st.comps||{})){if(!c||c.youth||c.kind==='tour')continue;if(c.won)H.push({ic:'🏆',l:c.n,b:'CAMPEÃO!',e:'',hot:1,go:'comp'});else if(c.alive&&c.rounds&&c.rounds[c.stage]&&c.stage>0&&!(c.campPO&&!c.setup))H.push({ic:nsgoCompIc(c),l:c.n,b:`Vivos: ${c.rounds[c.stage].n}`,e:c.leg1?`ida ${c.leg1.ag}×${c.leg1.at}`:'',go:'comp'})}}catch(e){}
 try{const nat=nsgoNat();const need=nsgoNeed();const W2=nsgoWcIn();
  if(st.natCalled||(S.caps>0&&S.ovr>=need-1))H.push({ic:nat.f,l:'Seleção',b:st.natCalled?'Você está na lista!':'De olho na convocação',e:`${S.caps||0} jogos · ${S.natGoals||0} gols`,go:'comp'});
  else if(S.age>=17)H.push({ic:nat.f,l:'Seleção',b:`Quer OVR ${need}`,e:`você: ${S.ovr}`,go:'comp'});
  const wc=st.comps&&st.comps.wc;H.push(W2.k===0?{ic:'🌍',l:'Copa do Mundo',b:wc&&wc.won?'CAMPEÃO DO MUNDO!':wc&&wc.called?'Você está na Copa!':wc&&wc.qualified===false?`${nat.n} ficou fora`:'É ANO DE COPA!',e:'',hot:1,go:'comp'}:{ic:'🌍',l:`Copa do Mundo ${W2.year}`,b:`Faltam ${W2.k} temporada${W2.k>1?'s':''}`,e:'',go:'comp'})}catch(e){}
 try{const B=(typeof W!=='undefined'&&W.bolaHist)||[];const last=B[B.length-1];H.push({ic:'🏅',l:'Bola de Ouro',b:last?`${last.y}: ${last.n}${last.me?' (VOCÊ!)':''}`:'Cerimônia no fim do ano',e:'',go:'bola'})}catch(e){}
 return H.slice(0,7)}
function nsgoPromoHTML(){const H=nsgoHeads();if(!H.length)return'';
 return`<div class="nsgo-promo" id="nsPromoB" role="button" aria-label="Manchetes">${H.map((h,i)=>`<div class="sl ${i?'':'on'} ${h.hot?'hot':''}" data-gk="${h.go}"><span class="ic">${h.ic}</span><div><small><i class="live"></i>${esc(h.l)}</small><b>${esc(h.b)}</b></div><em>${esc(h.e||'')}</em></div>`).join('')}<div class="dots">${H.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div></div>`}
let NSGO_T=0;
function nsgoGo(k){if(k==='art')nsOpen(nsArtPage());else if(k==='bola')nsOpen(nsBolaPage());else if(k==='liga'&&typeof nsLigaPage==='function')nsOpen(nsLigaPage());else nsOpen(nsCompPage())}
{const _ini=nsInicioHTML;nsInicioHTML=function(){let h=_ini();try{const pr=nsgoPromoHTML();if(pr){h=h.replace(/<button class="nsx-art[^"]*" id="nsArtB">[\s\S]*?<\/button>/,'');h=h.replace(/<\/div>$/,pr+'</div>')}}catch(e){console.error(e)}return h}}
{const _rnG=nsRenderHub;nsRenderHub=function(){const r=_rnG.apply(this,arguments);try{clearInterval(NSGO_T);const b=document.getElementById('nsPromoB');
  if(b){const sl=[...b.querySelectorAll('.sl')],dt=[...b.querySelectorAll('.dots i')];let i=0;b.onclick=()=>nsgoGo(sl[i].dataset.gk);
   if(sl.length>1)NSGO_T=setInterval(()=>{if(!b.isConnected){clearInterval(NSGO_T);return}sl[i].classList.remove('on');dt[i].classList.remove('on');i=(i+1)%sl.length;sl[i].classList.add('on');dt[i].classList.add('on')},3400)}
  const j=document.getElementById('nsJogar');if(j&&S.n&&!S.st.done){const left=Math.max(0,NS_TRAIN_MAX-(S.n.trainW||0));j.classList.toggle('pulse',!left||S.n.en<40)}
  const ct=document.getElementById('nsCompB');if(ct)ct.onclick=()=>nsOpen(nsCompPage())}catch(e){console.error(e)}return r}}
// etiquetas no cartão do próximo jogo
{const _nc=nsNextCard;nsNextCard=function(){let h=_nc.apply(this,arguments);try{const nm=nextMatchInfo();if(!h||!nm)return h;const st=S.st;const c=st.comps&&Object.values(st.comps).find(x=>x&&x.n===nm.comp);const rd=c&&c.rounds&&c.rounds[c.stage];
  const ko=!!(rd&&nm.label===rd.n);const o={comp:nm.comp,label:nm.label+(ko&&c.leg1?' · volta':ko&&rd.legs===2?' · ida':''),opp:nm.opp,ko,final:ko&&rd.n==='Final',agg:ko&&c.leg1?[c.leg1.ag,c.leg1.at]:null};const T=nsgoTags(o);
  if(T.length)h=h.replace(/(<small>Próximo jogo[^<]*<\/small>)/,`$1${nsgoTagsHTML(T)}`)}catch(e){}return h}}
// ---------- página de competições ----------
function nsCompPage(){return{t:'Competições',cls:'comp',html:()=>{const st=S.st;const nat=nsgoNat();const need=nsgoNeed();const W2=nsgoWcIn();const wc=st.comps&&st.comps.wc;
 const pct=clamp(Math.round((S.ovr-(need-20))/25*100),0,100);
 const natSt=st.natCalled?'Convocado nesta temporada':S.age<18?'A seleção principal chama a partir dos 18':S.ovr>=need?'Na briga por uma vaga':`Faltam ${need-S.ovr} de OVR`;
 const L=nsgoLgPos();
 const comps=Object.values(st.comps||{}).filter(c=>c&&!c.youth&&c.kind!=='tour'&&!c.skip);
 const cst=nsgoCst;
 return`<div class="nsgo-wcbig ${W2.k===0?'now':''}"><span>🌍</span><div><small>Copa do Mundo ${W2.year}</small><b>${W2.k===0?(wc&&wc.won?'CAMPEÃO DO MUNDO!':wc&&wc.called?'Você está na Copa!':wc&&wc.qualified===false?`${esc(nat.n)} ficou fora`:'É ESTE ANO!'):`Faltam ${W2.k} temporada${W2.k>1?'s':''}`}</b><em>De 4 em 4 anos. Os 26 melhores do país vão. Gol em Copa vale fama pra vida toda.</em></div></div>
 <div class="nsgo-natc"><div class="hd"><span class="fl">${nat.f}</span><div><b>Seleção ${esc(nat.n)}</b><small>${esc(natSt)}</small></div></div>
  <div class="bar"><i style="width:${pct}%"></i><b style="left:80%"></b></div><div class="lg"><span>Você: OVR ${S.ovr}</span><span>Convocação: ~${need}</span></div>
  <div class="nsgo-nst"><div><span>Jogos</span><b>${S.caps||0}</b></div><div><span>Gols</span><b>${S.natGoals||0}</b></div><div><span>Títulos</span><b>${(S.titles||[]).filter(t=>!t.club).length}</b></div></div>
  <small class="muted">Como ser chamado: subir o OVR treinando, ganhar fama (Fofocagram, gols, títulos) e estar em boa fase. A Data FIFA acontece 3 vezes por temporada.</small></div>
 <div class="nsx-sh"><b>Temporada ${esc(seasonLbl(S.year))}</b><small>Onde você está vivo.</small></div>
 <div class="nsgo-cl">${L?`<button class="row on" data-cg="liga"><span>📊</span><div><b>${esc(LG[st.lg].n)}</b><small>${L.pos}º de ${L.n} · ${L.pts} pts${L.pos>1?` · ${L.gapTop} pt${L.gapTop>1?'s':''} do líder`:' · líder'}</small></div><em>›</em></button>`:''}
 ${comps.map(c=>{const[t,k]=cst(c);return`<div class="row ${k}"><span>${nsgoCompIc(c)}</span><div><b>${esc(c.n)}</b><small>${esc(t)}</small></div></div>`}).join('')}
 ${Object.values(st.comps||{}).filter(c=>c&&c.kind==='tour').map(c=>{const[t,k]=c.qualified===false?['Seleção não se classificou','off']:c.called===false?['Você não foi convocado','off']:cst(c);return`<div class="row ${k}"><span>${nsgoCompIc(c)}</span><div><b>${esc(c.n)}</b><small>${esc(t)}</small></div></div>`}).join('')}</div>
 <div class="nsgo-cl"><button class="row" data-cg="art"><span>⚽</span><div><b>Artilharia</b><small>Gols e assistências da liga</small></div><em>›</em></button><button class="row" data-cg="bola"><span>🏅</span><div><b>Bola de Ouro</b><small>Todos os vencedores</small></div><em>›</em></button></div>
 ${S.n.goStats?`<p class="muted nsgo-gs">🎯 Metas batidas: ${S.n.goStats.ok} de ${S.n.goStats.m} · ${S.n.goStats.all} trinca${S.n.goStats.all===1?'':'s'}</p>`:''}`},
 bind:B=>B.querySelectorAll('[data-cg]').forEach(b=>b.onclick=()=>{const k=b.dataset.cg;if(k==='art')nsPush(nsArtPage());else if(k==='bola')nsPush(nsBolaPage());else if(typeof nsLigaPage==='function')nsPush(nsLigaPage())})}}
{const _ct3=nsCarreiraTiles;nsCarreiraTiles=function(){const h=_ct3();const nat=nsgoNat();return h.replace(/<div class="nsx-grid">/,`<div class="nsx-grid"><button class="nsx-tile hot" id="nsCompB"><span>🌍</span><b>Competições</b><small>Seleção, Copa do Mundo e copas</small></button>`)}}
{const st=document.createElement('style');st.textContent=`
.nsgo-tags{display:flex;flex-wrap:wrap;gap:5px;margin:4px 0 2px}
.nsgo-tags span{font:900 12px var(--f-body);letter-spacing:.05em;padding:4px 8px;border-radius:7px;color:#fff;background:#2a3a31;white-space:nowrap}
.nsgo-tags .gold{background:linear-gradient(180deg,#ffe27a,#d6a21e);color:#2a1a00}.nsgo-tags .red{background:#d7263d}.nsgo-tags .fire{background:linear-gradient(90deg,#ff7a2b,#d7263d)}.nsgo-tags .vio{background:#6c3bd1}.nsgo-tags .nat{background:#0b7a3b;border:1px solid #ffd84a}
.nsgo-tags.lg{justify-content:center;gap:8px}.nsgo-tags.lg span{font-size:15px;padding:7px 12px;border-radius:9px;animation:nsgoPop .45s cubic-bezier(.2,1.6,.4,1) both}
.nsgo-tags.lg span:nth-child(2){animation-delay:.08s}.nsgo-tags.lg span:nth-child(3){animation-delay:.16s}
@keyframes nsgoPop{from{transform:scale(.3);opacity:0}to{transform:none;opacity:1}}
.nsgo-host{position:fixed;inset:0;z-index:9500;display:grid;place-items:center;padding:16px;background:rgba(3,10,7,.86);backdrop-filter:blur(3px);animation:nsgoIn .2s ease both}
.nsgo-host.out{animation:nsgoOut .18s ease both}@keyframes nsgoIn{from{opacity:0}}@keyframes nsgoOut{to{opacity:0}}
.nsgo-card{width:min(560px,100%);max-height:calc(100dvh - 32px);overflow:auto;border-radius:24px;padding:22px 20px;text-align:center;color:var(--chalk);background:linear-gradient(180deg,#123222,#0a1912);border:1px solid #2f6a4b;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:nsgoUp .35s cubic-bezier(.2,1.3,.4,1) both}
@keyframes nsgoUp{from{transform:translateY(30px) scale(.94);opacity:0}}
.nsgo-card h2{font:900 30px/1.05 var(--f-display);margin:6px 0 12px}
.nsgo-ey{font:900 13px var(--f-body);letter-spacing:.12em;text-transform:uppercase;color:#ffd84a}
.nsgo-card p{font:600 17px/1.4 var(--f-body);margin:8px 0 14px;color:#dcebe2}
.nsgo-go{margin-top:14px;min-height:58px;font-size:20px}
.nsgo-go.hot{background:linear-gradient(180deg,#ffd84a,#ff9a1f);color:#241300;box-shadow:0 0 0 3px #ffd84a55,0 6px 20px #ff9a1f66;animation:nsgoBeat 1.1s ease-in-out infinite}
@keyframes nsgoBeat{50%{transform:scale(1.03)}}
.nsgo-vs{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;margin:14px 0 6px}
.nsgo-vs em{font:900 26px var(--f-display);color:#7fa58e;font-style:normal}
.nsgo-vs .sd{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:0}.nsgo-vs .sd b{font:900 18px var(--f-display);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nsgo-vs .sd .shield{transform:scale(1.5);margin:10px 0}.nsgo-vs .fl{font-size:48px;font-style:normal;line-height:1}
.nsgo-sk{font-weight:800!important;color:#ffe9a8!important}
.nsgo-metas,.nsgo-mres{text-align:left;background:#0b2116;border:1px solid #2a5a40;border-radius:16px;padding:12px 14px;margin-top:8px}
.nsgo-metas .hd,.nsgo-mres .hd{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:6px}.nsgo-metas .hd b,.nsgo-mres .hd b{font:900 17px var(--f-body)}.nsgo-metas .hd small,.nsgo-mres .hd span{font:800 13px var(--f-body);color:#ffd84a}
.nsgo-metas .mt,.nsgo-mres .mt{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:8px 0;border-top:1px solid #ffffff12}
.nsgo-metas .mt b,.nsgo-mres .mt b{font:800 16px var(--f-body)}.nsgo-metas .mt i,.nsgo-mres .mt i{font-style:normal;font-size:18px}
.nsgo-metas .rw,.nsgo-mres .rw{font:900 13px var(--f-mono);color:#7dff9b;white-space:nowrap}.nsgo-mres .rw.off{color:#6b8576}
.nsgo-mres .mt.no b{color:#9fb5a8;text-decoration:line-through;text-decoration-color:#d7263d88}
.nsgo-mres.all{border-color:#ffd84a;box-shadow:0 0 0 2px #ffd84a44}.nsgo-mres .all{margin-top:8px;font:900 15px var(--f-body);color:#ffd84a;text-align:center}
.nsgo-metas>small{display:block;margin-top:6px}
.nsgo-list{display:grid;gap:8px;text-align:left;margin:6px 0 10px}
.nsgo-list>div{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;padding:10px 12px;border-radius:14px;background:#0b2116;border:1px solid #2a5a40;animation:nsgoUp .3s ease both}
.nsgo-list>div:nth-child(2){animation-delay:.06s}.nsgo-list>div:nth-child(3){animation-delay:.12s}.nsgo-list>div:nth-child(4){animation-delay:.18s}.nsgo-list>div:nth-child(5){animation-delay:.24s}
.nsgo-list span{font-size:28px}.nsgo-list b{font:900 17px var(--f-body);display:block}.nsgo-list small{font:700 13px var(--f-body);color:#9fbfac}
.nsgo-list .hot{border-color:#ffd84a}.nsgo-list .off{opacity:.55}
.nsgo-wc{border-radius:16px;padding:14px;background:linear-gradient(110deg,#5a3d00,#1d4d2c);border:2px solid #ffd84a;display:grid;gap:4px;animation:nsgoBeat 1.4s ease-in-out infinite}
.nsgo-wc.soft{animation:none;border-width:1px;background:linear-gradient(110deg,#2c2205,#13261a)}
.nsgo-wc b{font:900 19px var(--f-display);color:#ffd84a}.nsgo-wc small{font:700 14px var(--f-body);color:#f2ead0}
.nsgo-flag{font-size:92px;line-height:1;animation:nsgoWave 1.6s ease-in-out infinite;display:inline-block;transform-origin:10% 90%}
@keyframes nsgoWave{50%{transform:rotate(-6deg) scale(1.05)}}
.nsgo-host.callup .nsgo-card{background:radial-gradient(120% 80% at 50% 0%,#1f7a3d,#0a1912 70%);border-color:#ffd84a}
h2.cv{font-size:44px!important;background:linear-gradient(180deg,#fff6b0,#ffd84a 45%,#e0a11a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 #0006);animation:nsgoPop .5s cubic-bezier(.2,1.6,.4,1) both}
.nsgo-nst{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px;margin:8px 0}
.nsgo-nst>div{background:#0b2116;border:1px solid #2a5a40;border-radius:12px;padding:8px}.nsgo-nst span{display:block;font:800 12px var(--f-body);color:#9fbfac;text-transform:uppercase}.nsgo-nst b{font:900 24px var(--f-mono)}
.nsgo-first{font:900 16px var(--f-body);color:#ffd84a;margin-top:6px}
.nsgo-host.b3 .nsgo-card{border-color:#ffd84a;background:radial-gradient(120% 70% at 50% 0%,#4a3600,#0a1912 72%)}
.nsgo-host.b2 .nsgo-card{border-color:#d7263d;background:radial-gradient(120% 70% at 50% 0%,#3d0f18,#0a1912 72%)}
.nsgo-promo{position:relative;width:100%;min-height:74px;border-radius:18px;border:1px solid #d6a21e66;background:linear-gradient(110deg,#2c2205,#13261a 70%);overflow:hidden;cursor:pointer}
.nsgo-promo .sl{position:absolute;inset:0 0 8px 0;display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:8px 16px;text-align:left;opacity:0;transform:translateY(12px);transition:opacity .35s,transform .35s;pointer-events:none}
.nsgo-promo .sl.on{opacity:1;transform:none}
.nsgo-promo .ic{font-size:32px}.nsgo-promo small{display:flex;align-items:center;gap:6px;font:900 12px var(--f-body);color:#ffd84a;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;overflow:hidden}
.nsgo-promo b{display:block;font:900 18px var(--f-display);color:var(--chalk);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nsgo-promo em{font:900 14px var(--f-mono);font-style:normal;color:#ffd84a;white-space:nowrap}
.nsgo-promo .live{width:8px;height:8px;border-radius:50%;background:#ff3b3b;box-shadow:0 0 0 0 #ff3b3b;animation:nsgoLive 1.4s infinite;flex:none}
@keyframes nsgoLive{70%{box-shadow:0 0 0 7px #ff3b3b00}100%{box-shadow:0 0 0 0 #ff3b3b00}}
.nsgo-promo .sl.hot b{color:#ffe27a}
.nsgo-promo .dots{position:absolute;left:0;right:0;bottom:5px;display:flex;justify-content:center;gap:4px}.nsgo-promo .dots i{width:5px;height:5px;border-radius:3px;background:#ffffff33;transition:all .3s}.nsgo-promo .dots i.on{width:14px;background:#ffd84a}
.nsh[data-fit="5"] .nsgo-promo,.nsh[data-fit="6"] .nsgo-promo,.nsh[data-fit="7"] .nsgo-promo{min-height:56px}
.nsh[data-fit="5"] .nsgo-promo .ic,.nsh[data-fit="6"] .nsgo-promo .ic,.nsh[data-fit="7"] .nsgo-promo .ic{font-size:24px}
.nsh[data-fit="6"] .nsgo-promo small,.nsh[data-fit="7"] .nsgo-promo small{font-size:10px}.nsh[data-fit="6"] .nsgo-promo b,.nsh[data-fit="7"] .nsgo-promo b{font-size:15px}
#nsJogar.pulse{animation:nsgoBeat 1.2s ease-in-out infinite;box-shadow:0 0 0 3px #ffd84a66}
.nsgo-wcbig{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:center;padding:16px;border-radius:20px;border:1px solid #d6a21e;background:linear-gradient(115deg,#4a3600,#13261a 75%);margin-bottom:12px}
.nsgo-wcbig.now{border-width:2px;box-shadow:0 0 0 3px #ffd84a33}
.nsgo-wcbig>span{font-size:54px}.nsgo-wcbig small{font:900 13px var(--f-body);color:#ffd84a;text-transform:uppercase;letter-spacing:.08em}.nsgo-wcbig b{display:block;font:900 26px var(--f-display)}.nsgo-wcbig em{display:block;font:600 14px var(--f-body);font-style:normal;color:#cfe0d5;margin-top:4px}
.nsgo-natc{padding:14px;border-radius:18px;background:#0b2116;border:1px solid #2a5a40;margin-bottom:14px;display:grid;gap:8px}
.nsgo-natc .hd{display:flex;align-items:center;gap:12px}.nsgo-natc .fl{font-size:44px}.nsgo-natc .hd b{font:900 20px var(--f-display);display:block}.nsgo-natc .hd small{font:800 14px var(--f-body);color:#ffd84a}
.nsgo-natc .bar{position:relative;height:14px;border-radius:7px;background:#031009;overflow:visible}.nsgo-natc .bar i{display:block;height:100%;border-radius:7px;background:linear-gradient(90deg,#1aa34a,#ffd84a)}
.nsgo-natc .bar b{position:absolute;top:-4px;bottom:-4px;width:3px;margin-left:-2px;background:#fff;border-radius:2px}
.nsgo-natc .lg{display:flex;justify-content:space-between;font:800 13px var(--f-mono);color:#9fbfac}
.nsgo-cl{display:grid;gap:8px;margin:8px 0 14px}
.nsgo-cl .row{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;width:100%;text-align:left;padding:12px 14px;border-radius:14px;background:#0b2116;border:1px solid #2a5a40;color:var(--chalk)}
.nsgo-cl .row>span{font-size:28px}.nsgo-cl .row b{font:900 17px var(--f-body);display:block}.nsgo-cl .row small{font:700 14px var(--f-body);color:#9fbfac}.nsgo-cl .row em{font-style:normal;font-size:22px;color:#7fa58e}
.nsgo-cl .row.soft small{color:#c9b98a}.nsgo-cl .row.gold{border-color:#ffd84a}.nsgo-cl .row.gold small{color:#ffd84a}.nsgo-cl .row.off{opacity:.55}.nsgo-cl .row.on small{color:#7dff9b}
.nsx-tile.hot{border-color:#ffd84a!important;box-shadow:0 0 0 2px #ffd84a33}
.nsgo-gs{text-align:center}
`;document.head.appendChild(st)}
// ---------- plantão: manchete quando algo grande muda depois do jogo ----------
function nsgoSnap(){try{const st=S.st;const L=nsgoLgPos();let art=false;try{const R=nsRace();art=!!(R&&R.gl[0]&&R.gl[0].me&&R.gl[0].v>0)}catch(e){}
 const cs={};for(const c of Object.values(st.comps||{}))if(c)cs[c.id]={st:c.stage||0,al:c.alive!==false,won:!!c.won};
 return{pos:L&&L.rows.some(r=>r.j>0)?L.pos:0,n:L?L.n:0,art,cs,y:S.year}}catch(e){return null}}
function nsgoNews(a,b){const H=[];if(!a||!b||a.y!==b.y)return H;const me=club();const st=S.st;
 if(b.pos===1&&a.pos!==1)H.push(['👑',`${me.n} assume a liderança!`,`Vocês estão no topo do ${LG[st.lg].n}.`]);
 else if(b.pos&&a.pos&&b.pos<=4&&a.pos>4)H.push(['📈','Entrou no G4!',`${me.n} subiu pro ${b.pos}º lugar.`]);
 else if(b.pos&&b.n&&b.pos>b.n-4&&!(a.pos>a.n-4))H.push(['⚠️','Zona de rebaixamento',`${me.n} caiu pro ${b.pos}º. A torcida está em alerta.`]);
 if(b.art&&!a.art&&S.pos!=='GOL')H.push(['⚽','Você é o artilheiro!','Ninguém fez mais gols que você no campeonato.']);
 for(const id in b.cs){const x=a.cs[id],y=b.cs[id];const c=st.comps[id];if(!x||!c||c.youth||y.won)continue;
  if(y.st>x.st&&y.al){const rd=c.rounds&&c.rounds[c.stage];H.push([nsgoCompIc(c),'Classificados!',`${c.n}: agora é ${rd?rd.n.toLowerCase():'a próxima fase'}.`])}
  else if(x.al&&!y.al&&c.qualified!==false&&c.called!==false&&!c.skip)H.push(['💔',`Fora da ${c.n}`,c.out?`Caíram na fase: ${c.out}.`:'A campanha acabou.'])}
 return H.slice(0,3)}
{const _npG=nsPlay;nsPlay=async function(){const a=nsOn()&&S.st?nsgoSnap():null;const r=await _npG.apply(this,arguments);
 try{if(a&&S.st){const H=nsgoNews(a,nsgoSnap());if(H.length)await nsgoShow(`<div class="nsgo-plant">🔴 PLANTÃO</div>${H.map(([ic,t,d])=>`<div class="nsgo-nw"><span>${ic}</span><div><b>${esc(t)}</b><small>${esc(d)}</small></div></div>`).join('')}<button class="btn wide nsgo-go" data-go="1">Show! ➜</button>`,'flash')}}catch(e){console.error(e)}return r}}
if(typeof TOUR_HUB!=='undefined')TOUR_HUB.push({sel:'#nsPromoB',t:'Manchetes',d:'O que está acontecendo: tabela, artilharia, copas, Seleção e a contagem pra Copa do Mundo. Toque pra ver tudo.'});
{const st=document.createElement('style');st.textContent=`
.nsgo-plant{display:inline-block;font:900 15px var(--f-body);letter-spacing:.14em;color:#fff;background:#d7263d;padding:6px 14px;border-radius:8px;margin-bottom:12px;animation:nsgoBeat 1s ease-in-out infinite}
.nsgo-host.flash .nsgo-card{border-color:#d7263d}
.nsgo-nw{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;text-align:left;padding:12px;border-radius:14px;background:#0b2116;border:1px solid #2a5a40;margin-top:8px;animation:nsgoUp .35s ease both}
.nsgo-nw span{font-size:34px}.nsgo-nw b{display:block;font:900 20px var(--f-display)}.nsgo-nw small{font:700 14px var(--f-body);color:#cfe0d5}
`;document.head.appendChild(st)}
