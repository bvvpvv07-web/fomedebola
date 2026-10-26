// ================== EDITOR DE TIMES ==================
// Os times, ligas e lendas do jogo são inventados. Aqui o jogador muda nome, sigla, cores e escudo,
// renomeia ligas e lendas, e salva ou carrega tudo num arquivo (.json) pra trocar com os amigos.
// Fica só no aparelho dele (localStorage 'fdb_patch'), por cima dos nomes inventados.
const ED={tab:'times',lg:'BRA1',open:null,q:''};
const hex6=h=>{h=String(h||'#000').trim().toLowerCase();if(/^#[0-9a-f]{3}$/.test(h))h='#'+h.slice(1).split('').map(x=>x+x).join('');return/^#[0-9a-f]{6}$/.test(h)?h:'#000000'};
function edSave(P){try{localStorage.setItem('fdb_patch',JSON.stringify(P));FICT.patch=P;applyFict();return true}catch(e){toast({ic:'⚠️',title:'Não coube',txt:'O aparelho ficou sem espaço pro editor. Use escudos menores ou tire alguns.',ms:3600});return false}}
function edClean(P){for(const id in P.clubs){const o=P.clubs[id];for(const k in o)if(!o[k])delete o[k];if(!Object.keys(o).length)delete P.clubs[id]}return P}
function edImg(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onerror=rej;fr.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{const N=112;const cv=document.createElement('canvas');cv.width=N;cv.height=N;const g=cv.getContext('2d');
  const k=Math.min(N/im.width,N/im.height);const w=im.width*k,h=im.height*k;g.drawImage(im,(N-w)/2,(N-h)/2,w,h);let u=cv.toDataURL('image/webp',.86);if(!/^data:image\/webp/.test(u))u=cv.toDataURL('image/png');res(u)};im.src=fr.result};fr.readAsDataURL(file)})}
function edLgOpts(){const by={};for(const k in LG){const c=LG[k].c;(by[c]=by[c]||[]).push(k)}
 return Object.entries(by).map(([c,ks])=>`<optgroup label="${esc((COUNTRY[c]&&COUNTRY[c].n)||c)}">${ks.map(k=>`<option value="${k}" ${ED.lg===k?'selected':''}>${esc(LG[k].n)}</option>`).join('')}</optgroup>`).join('')+`<option value="ext" ${ED.lg==='ext'?'selected':''}>Clubes de fora (torneios)</option>`}
function edClubs(){return ED.lg==='ext'?Object.values(CLUB).filter(c=>c.ext):leagueClubs(ED.lg).slice().sort((a,b)=>b.s-a.s)}
function edClubRow(c){const P=fictPatch();const p=P.clubs[c.id]||{};const op=ED.open===c.id;const f=FICT.names[c.id]||{};
 return`<div class="ed-row ${op?'on':''}" data-cid="${esc(c.id)}"><button class="ed-h" data-edo="${esc(c.id)}">${shieldHTML(c)}<span class="ed-n"><b>${esc(c.n)}</b><small>${esc(c.a)}${Object.keys(p).length?' · editado':''}</small></span><em>${op?'▴':'✎'}</em></button>
 ${op?`<div class="ed-f"><label>Nome<input class="input" id="edN" maxlength="28" value="${esc(c.n)}"></label>
  <div class="ed-2"><label>Sigla<input class="input" id="edA" maxlength="4" value="${esc(c.a)}" style="text-transform:uppercase"></label><label>Cor 1<input type="color" id="edC1" value="${hex6(c.c1)}"></label><label>Cor 2<input type="color" id="edC2" value="${hex6(c.c2)}"></label></div>
  <div class="ed-2"><label class="btn ghost small ed-up">🖼️ Escudo (imagem)<input type="file" id="edF" accept="image/*" hidden></label>${p.img?'<button class="btn ghost small" id="edFx">Tirar imagem</button>':''}</div>
  <div class="ed-2"><button class="btn small" id="edOk">Salvar</button><button class="lnk" id="edR">Voltar ao original (${esc(f.n||'')})</button></div></div>`:''}</div>`}
function renderEditor(){CLOUD.screen='account';const P=fictPatch();const T=ED.tab;const nC=Object.keys(P.clubs).length,nL=Object.keys(P.leagues).length,nP=Object.keys(P.players).length;
 const tabs=[['times','Times'],['ligas','Ligas'],['lendas','Lendas'],['arquivo','Arquivo']].map(([k,n])=>`<button class="lmbtn ${T===k?'on':''}" data-edt="${k}">${n}</button>`).join('');
 let body='';
 if(T==='times')body=`<select class="input" id="edLg">${edLgOpts()}</select><div class="ed-list">${edClubs().map(edClubRow).join('')}</div>`;
 else if(T==='ligas')body=`<div class="ed-list">${Object.keys(LG).map(k=>`<label class="ed-lg"><small>${esc((COUNTRY[LG[k].c]&&COUNTRY[LG[k].c].n)||'')}</small><input class="input" data-elg="${k}" maxlength="32" value="${esc(LG[k].n)}"></label>`).join('')}</div><button class="btn small" id="edLgOk">Salvar ligas</button>`;
 else if(T==='lendas'){const q=fN(ED.q);body=`<input class="input" id="edQ" placeholder="Procurar lenda" value="${esc(ED.q)}"><div class="ed-list">${LEGENDS.map((L,i)=>[L,i]).filter(([L])=>!q||fN(L[0]).includes(q)).slice(0,60).map(([L,i])=>`<label class="ed-lg"><small>${L[1]} ${esc(L[2])} · ${L[3]}</small><input class="input" data-elp="${i}" maxlength="28" value="${esc(L[0])}"></label>`).join('')}</div><button class="btn small" id="edLpOk">Salvar lendas</button>`}
 else body=`<p class="muted" style="margin:0">Salve tudo o que você mudou num arquivo pra guardar ou mandar pra um amigo. Quem carregar o arquivo vê os mesmos nomes e escudos.</p>
  <div class="ed-2"><button class="btn small" id="edExp">⬇️ Salvar arquivo</button><label class="btn ghost small ed-up">⬆️ Carregar arquivo<input type="file" id="edImp" accept=".json,application/json" hidden></label></div>
  <p class="muted" style="margin:0;font-size:13px">Mudanças agora: ${nC} times, ${nL} ligas, ${nP} lendas.</p>
  ${nC+nL+nP?'<button class="btn ghost small" id="edZero" style="justify-self:start;color:#ffb3aa">Voltar tudo ao original</button>':''}`;
 page('account',`<div class="phead"><h2>Editor de times</h2><p>${FICT_IS?'Os clubes do jogo são inventados. ':''}Mude nome, sigla, cores e escudo de qualquer clube. Fica só neste aparelho e vale pra todas as carreiras.</p></div>
  <button class="lnk" id="edBack" style="justify-self:start">← Perfil</button><div class="livemode ed-tabs">${tabs}</div><section class="hsec ed">${body}</section>`);
 document.getElementById('edBack').onclick=()=>renderProfile();
 document.querySelectorAll('[data-edt]').forEach(b=>b.onclick=()=>{ED.tab=b.dataset.edt;ED.open=null;renderEditor()});
 const lg=document.getElementById('edLg');if(lg)lg.onchange=()=>{ED.lg=lg.value;ED.open=null;renderEditor()};
 document.querySelectorAll('[data-edo]').forEach(b=>b.onclick=()=>{ED.open=ED.open===b.dataset.edo?null:b.dataset.edo;renderEditor();const r=document.querySelector('.ed-row.on');if(r)r.scrollIntoView({block:'nearest'})});
 if(T==='times'&&ED.open){const id=ED.open;const c=CLUB[id];const P2=fictPatch();const cur=()=>P2.clubs[id]=P2.clubs[id]||{};
  document.getElementById('edOk').onclick=()=>{const o=cur();const n=document.getElementById('edN').value.trim(),a=document.getElementById('edA').value.trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,4);
   const f=FICT.names[id]||{};o.n=n&&n!==f.n?n.slice(0,28):'';o.a=a&&a!==f.a?a:'';const c1=document.getElementById('edC1').value,c2=document.getElementById('edC2').value;o.c1=c1!==hex6(c.c10)?c1:'';o.c2=c2!==hex6(c.c20)?c2:'';
   if(edSave(edClean(P2))){toast({ic:'✅',title:'Time salvo',txt:CLUB[id].n,ms:1600});ED.open=null;renderEditor()}};
  document.getElementById('edR').onclick=()=>{delete P2.clubs[id];if(edSave(P2)){ED.open=null;renderEditor()}};
  document.getElementById('edF').onchange=async e=>{const f=e.target.files&&e.target.files[0];if(!f)return;try{const u=await edImg(f);cur().img=u;if(edSave(edClean(P2)))renderEditor()}catch(_){toast({ic:'⚠️',title:'Imagem não abriu',txt:'Tente um PNG ou JPG.',ms:2400})}};
  const fx=document.getElementById('edFx');if(fx)fx.onclick=()=>{cur().img='';if(edSave(edClean(P2)))renderEditor()}}
 const lo=document.getElementById('edLgOk');if(lo)lo.onclick=()=>{const P2=fictPatch();document.querySelectorAll('[data-elg]').forEach(i=>{const k=i.dataset.elg,v=i.value.trim().slice(0,32);if(v&&v!==FICT.lg0[k])P2.leagues[k]=v;else delete P2.leagues[k]});if(edSave(P2)){toast({ic:'✅',title:'Ligas salvas',ms:1500});renderEditor()}};
 const q=document.getElementById('edQ');if(q){q.oninput=()=>{ED.q=q.value;clearTimeout(ED.qt);ED.qt=setTimeout(()=>{renderEditor();const q2=document.getElementById('edQ');if(q2){q2.focus();q2.setSelectionRange(q2.value.length,q2.value.length)}},350)}}
 const po=document.getElementById('edLpOk');if(po)po.onclick=()=>{const P2=fictPatch();document.querySelectorAll('[data-elp]').forEach(i=>{const k='l'+i.dataset.elp,v=i.value.trim().slice(0,28);if(v&&v!==FICT.legend0[+i.dataset.elp])P2.players[k]=v;else delete P2.players[k]});if(edSave(P2)){toast({ic:'✅',title:'Lendas salvas',ms:1500});renderEditor()}};
 const ex=document.getElementById('edExp');if(ex)ex.onclick=async()=>{const txt=JSON.stringify({...fictPatch(),app:'fome-de-bola',v:1},null,1);const fn='fome-de-bola-times.json';
  // dentro do Claude o arquivo passa pela confirmação de download; no site, link normal
  let dl=null;try{dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null}catch(_){dl=null}
  if(dl){try{await dl.save({filename:fn,data:txt});toast({ic:'✅',title:'Arquivo salvo',ms:1600})}catch(err){const c=err&&err.code;if(c==='rate_limited')toast({ic:'⏳',title:'Espere um pouco',txt:'Já tem um download aberto.',ms:2200});else if(c!=='declined')toast({ic:'⚠️',title:'Não deu pra salvar aqui',txt:'Abra o jogo pelo site pra salvar o arquivo.',ms:2600})}return}
  const blob=new Blob([txt],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)};
 const im=document.getElementById('edImp');if(im)im.onchange=async e=>{const f=e.target.files&&e.target.files[0];if(!f)return;try{const raw=JSON.parse(await f.text());const P2=edImport(raw);if(edSave(P2)){toast({ic:'✅',title:'Arquivo carregado',txt:`${Object.keys(P2.clubs).length} times, ${Object.keys(P2.leagues).length} ligas, ${Object.keys(P2.players).length} lendas`,ms:2600});renderEditor()}}catch(_){toast({ic:'⚠️',title:'Arquivo inválido',txt:'Não é um arquivo do editor do Fome de Bola.',ms:2600})}};
 const z=document.getElementById('edZero');if(z)z.onclick=async()=>{if(await confirmPop('Voltar tudo ao original?','Todos os nomes, siglas, cores e escudos que você mudou somem deste aparelho.','Voltar ao original')){if(edSave({v:1,clubs:{},leagues:{},players:{}}))renderEditor()}else renderEditor()}}
// só aceita o que o jogo conhece: ids de clubes, ligas e lendas, textos curtos, cores e imagens
function edImport(raw){if(!raw||typeof raw!=='object')throw new Error('x');const P={v:1,clubs:{},leagues:{},players:{}};const str=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
 const col=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v)?v:'';const img=v=>typeof v==='string'&&(/^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(v)&&v.length<400000||/^https:\/\/[^\s"'<>]+$/.test(v))?v:'';
 for(const id in raw.clubs||{}){if(!CLUB[id])continue;const o=raw.clubs[id]||{};const x={n:str(o.n,28),a:str(o.a,4).toUpperCase().replace(/[^A-Z0-9]/g,''),c1:col(o.c1),c2:col(o.c2),img:img(o.img)};for(const k in x)if(!x[k])delete x[k];if(Object.keys(x).length)P.clubs[id]=x}
 for(const k in raw.leagues||{})if(LG[k]){const v=str(raw.leagues[k],32);if(v)P.leagues[k]=v}
 for(const k in raw.players||{})if(/^l\d+$/.test(k)&&LEGENDS[+k.slice(1)]){const v=str(raw.players[k],28);if(v)P.players[k]=v}
 return P}
// entrada no Perfil
{const _rpE=renderProfile;renderProfile=function(...a){const r=_rpE.apply(this,a);try{const w=$app.querySelector('.wrap');const last=w&&w.lastElementChild;if(w&&!document.getElementById('edOpen')){const h=`<button class="newcar" id="edOpen"><span>✏️</span><div><b>Editor de times</b><small>Nomes, siglas, cores e escudos dos clubes</small></div><em>→</em></button>`;if(last)last.insertAdjacentHTML('beforebegin',h);else w.insertAdjacentHTML('beforeend',h);document.getElementById('edOpen').onclick=()=>{ED.open=null;renderEditor()}}}catch(e){}return r}}
{const st=document.createElement('style');st.textContent=`.ed{gap:10px}.ed-tabs{flex-wrap:wrap}.ed-list{display:grid;gap:6px;max-height:none}
.ed-row{border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.02)}.ed-row.on{border-color:var(--gold)}
.ed-h{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;background:none;border:0;color:inherit;text-align:left;cursor:pointer}.ed-h .shield{width:30px;height:35px}
.ed-n{flex:1;min-width:0;display:grid}.ed-n b{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ed-n small{color:var(--muted);font-size:12px}.ed-h em{font-style:normal;color:var(--muted)}
.ed-f{display:grid;gap:10px;padding:4px 10px 12px}.ed-f label{display:grid;gap:4px;font-size:12px;color:var(--muted);font-weight:600}.ed-2{display:flex;gap:10px;align-items:end;flex-wrap:wrap}.ed-2>label{flex:1;min-width:70px}
.ed-f input[type=color]{width:100%;height:44px;border:1px solid var(--line-2);border-radius:10px;background:var(--pitch);padding:3px}.ed-up{cursor:pointer;display:inline-flex;align-items:center}
.ed-lg{display:grid;gap:3px}.ed-lg small{color:var(--muted);font-size:12px}`;document.head.appendChild(st)}
// cartas e carreiras salvas antes da versão fictícia: mostram os nomes novos
{const _rcF=renderCard;renderCard=function(k,opt){try{if(k&&typeof k==='object'){k={...k};
   k.clubs=(k.clubs||[]).map(c=>{const n=CLUB[c.id];return n?{...c,n:n.n,a:n.a,c1:n.c1,c2:n.c2}:c});
   k.titles=(k.titles||[]).map(t=>({...t,n:fictText(t.n)}));k.awards=(k.awards||[]).map(t=>({...t,n:fictText(t.n)}));
   if(k.rawT)k.rawT=k.rawT.map(t=>({...t,n:fictText(t.n)}));if(k.rawA)k.rawA=k.rawA.map(t=>({...t,n:fictText(t.n)}));
   k.history=(k.history||[]).map(h=>({...h,lg:fictText(h.lg)}));k.nick=fictText(k.nick);k.retired=fictText(k.retired)}}catch(e){}return _rcF.call(this,k,opt)}}
{const _lsF=loadSave;loadSave=async function(...a){const r=await _lsF.apply(this,a);try{if(r&&W&&W.stars){let i=0;for(const s of W.stars)if(s.real){if(FICT_REAL.has(hash(fN(s.n))))s.n=fictP('#'+i,s.nat);i++}}
  if(r&&S){for(const t of S.titles||[])t.n=fictText(t.n);for(const t of S.awards||[])t.n=fictText(t.n);for(const h of S.history||[])h.lg=fictText(h.lg)}}catch(e){}return r}}
