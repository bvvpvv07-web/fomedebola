// ================== LOGIN NO SITE (usuário + senha) ==================
// Conta própria do jogo no Supabase, sem e-mail: usuário e senha. Logado, as carreiras ficam salvas na conta
// e abrem em qualquer aparelho (iPad, celular, computador). Sem login, continua salvando só no aparelho.
// No Claude (artifact) quem cuida da conta é o próprio Claude, então nada disso aparece lá.
const WL={tok:null,busy:false};
try{WL.tok=localStorage.getItem('fdb_tok')}catch(e){}
const WL_ERR={usuario_invalido:'Usuário: de 3 a 20 letras, números, ponto ou _ (sem espaço).',senha_curta:'A senha precisa ter pelo menos 6 caracteres.',usuario_existe:'Esse usuário já existe. Escolha outro ou entre com a senha.',login_errado:'Usuário ou senha errados.',bloqueado:'Muitas tentativas erradas. Espere 15 minutos.',sessao_invalida:'Sua sessão expirou. Entre de novo.',muitas_carreiras:'Sua conta já tem 60 carreiras. Apague alguma antiga.',grande_demais:'Essa carreira ficou grande demais pra nuvem.'};
async function wlRpc(fn,args){const r=await fetch(WEB_CFG.url+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:WEB_CFG.key,Authorization:'Bearer '+WEB_CFG.key,'Content-Type':'application/json'},body:JSON.stringify(args||{})});
 const t=await r.text();let j=null;try{j=t?JSON.parse(t):null}catch(e){}
 if(!r.ok){const code=(j&&j.message)||'erro';const e=new Error(WL_ERR[code]||'Não deu pra falar com o servidor. Confira a internet.');e.code=code;if(code==='sessao_invalida')wlDrop();throw e}return j}
function wlDrop(){WL.tok=null;try{localStorage.removeItem('fdb_tok')}catch(e){}CLOUD.uid=null;CLOUD.me=null}
// as carreiras da conta entram no mesmo caminho que o Claude usa (data/users/<id>)
if(typeof makeWebDb==='function'){const _mk=makeWebDb;makeWebDb=function(){const db=_mk();const col=db.collection.bind(db),doc=db.doc.bind(db);
  db.collection=function(p){if(!/^data\/users\//.test(p))return col(p);return{async get(){const L=await wlRpc('fdb_list',{p_token:WL.tok})||[];return{docs:L.map(x=>({id:x.cid,data:()=>({meta:x.meta})}))}},
   doc(cid){return{async get(){const r=await wlRpc('fdb_load',{p_token:WL.tok,p_cid:cid});return r?{exists:true,data:()=>r}:{exists:false}},async set(b){await wlRpc('fdb_save',{p_token:WL.tok,p_cid:cid,p_meta:b.meta,p_data:b.data})},async delete(){await wlRpc('fdb_delete',{p_token:WL.tok,p_cid:cid})}}}}};
  db.doc=function(p){return doc(p)};return db}}
async function wlStart(){if(typeof WEB_CFG==='undefined')return;CLOUD.db=makeWebDb();if(!WL.tok)return;
 try{const me=await wlRpc('fdb_me',{p_token:WL.tok});CLOUD.uid=me.id;CLOUD.me={name:me.name};wlNameProfile();if(['home','careers','account'].includes(CLOUD.screen))rerenderNav()}catch(e){}}
function wlNameProfile(){try{const q=profiles();const a=q.list.find(x=>x.id===q.active);if(a&&/^Jogador( \d+)?$/.test(a.name)&&CLOUD.me){a.name=CLOUD.me.name.slice(0,16);saveProfiles(q)}}catch(e){}}
// entrou: as carreiras que estavam só no aparelho sobem pra conta
async function wlUploadLocal(){const ix=localIndex();let n=0;for(const cid in ix){const b=localGet(cid);if(!b||!b.meta||!b.data)continue;try{await wlRpc('fdb_save',{p_token:WL.tok,p_cid:cid,p_meta:b.meta,p_data:b.data});n++}catch(e){if(e.code==='muitas_carreiras')break}}return n}
async function wlSubmit(mode,user,pass){if(WL.busy)return;WL.busy=true;const msg=document.getElementById('wlMsg');if(msg){msg.textContent=mode==='signup'?'Criando a conta…':'Entrando…';msg.className='wl-msg'}
 try{const r=await wlRpc(mode==='signup'?'fdb_signup':'fdb_login',{p_user:user,p_pass:pass});WL.tok=r.token;try{localStorage.setItem('fdb_tok',r.token)}catch(e){}
  CLOUD.uid=r.id;CLOUD.me={name:r.name};wlNameProfile();const n=await wlUploadLocal();
  toast({ic:'✅',title:mode==='signup'?`Conta criada: ${r.name}`:`Olá, ${r.name}!`,txt:n?`${n} carreira${n>1?'s':''} deste aparelho ${n>1?'foram':'foi'} pra sua conta.`:'Suas carreiras agora ficam salvas na conta.',ms:3200});WL.busy=false;rerenderNav()}
 catch(e){WL.busy=false;if(msg){msg.textContent=e.message;msg.className='wl-msg bad'}}}
async function wlLogout(){const t=WL.tok;wlDrop();try{if(t)await wlRpc('fdb_logout',{p_token:t})}catch(e){}toast({ic:'👋',title:'Você saiu da conta',txt:'As carreiras continuam na conta. Neste aparelho fica só o que já estava salvo nele.',ms:3000});rerenderNav()}
function wlBoxHTML(){if(online())return`<div class="wl-in"><span class="wl-av">${esc((CLOUD.me.name||'?')[0].toUpperCase())}</span><div><b>${esc(CLOUD.me.name)}</b><div class="muted" style="font-size:13.5px">Conectado. Suas carreiras ficam salvas na conta e abrem em qualquer aparelho.</div></div></div><button class="btn ghost small" id="wlOut" style="justify-self:start">Sair da conta</button>`;
 return`<form class="wl-form" id="wlForm" autocomplete="on"><div class="muted" style="font-size:13.5px">Entre pra salvar suas carreiras na nuvem e jogar no iPad, no celular ou no computador. Sem e-mail: só usuário e senha.</div>
 <input class="input" id="wlUser" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20" placeholder="Usuário" required>
 <input class="input" id="wlPass" name="password" type="password" autocomplete="current-password" maxlength="72" placeholder="Senha (mín. 6)" required>
 <div class="wl-msg" id="wlMsg"></div><div class="row"><button class="btn" type="submit" id="wlIn">Entrar</button><button class="btn ghost" type="button" id="wlNew">Criar conta</button></div></form>`}
function wlBind(){const f=document.getElementById('wlForm');if(f){const go=m=>{const u=document.getElementById('wlUser').value,p=document.getElementById('wlPass').value;if(m==='signup')document.getElementById('wlPass').setAttribute('autocomplete','new-password');wlSubmit(m,u,p)};
  f.onsubmit=e=>{e.preventDefault();go('login')};document.getElementById('wlNew').onclick=()=>go('signup')}
 const o=document.getElementById('wlOut');if(o)o.onclick=wlLogout}
// Perfil: a caixa "Conta e nuvem" vira o login
{const _rpW=renderProfile;renderProfile=function(...a){const r=_rpW.apply(this,a);try{if(CLOUD.web){const box=$app.querySelector('.account');if(box){box.className='account wl';box.innerHTML=wlBoxHTML();wlBind();const sec=box.closest('.hsec'),ph=$app.querySelector('.phead');if(sec&&ph)ph.after(sec)}}}catch(e){}return r}}
// Início: um atalho pra entrar, enquanto não estiver logado
{const _riW=renderIntro;renderIntro=async function(...a){const r=await _riW.apply(this,a);try{if(CLOUD.web&&!online()&&CLOUD.screen==='home'&&!document.getElementById('wlHome')){const w=$app.querySelector('.wrap');if(w){w.insertAdjacentHTML('beforeend',`<button class="newcar" id="wlHome"><span>🔐</span><div><b>Entrar ou criar conta</b><small>Salve as carreiras na nuvem e jogue em qualquer aparelho</small></div><em>→</em></button>`);document.getElementById('wlHome').onclick=()=>{CLOUD.screen='account';renderProfile();setTimeout(()=>{const u=document.getElementById('wlUser');if(u)u.focus()},60)}}}}catch(e){}return r}}
{const st=document.createElement('style');st.textContent=`.account.wl{display:grid;gap:10px}.wl-form{display:grid;gap:8px}.wl-form .row{display:flex;gap:8px;flex-wrap:wrap}.wl-form .btn{flex:1}
.wl-msg{min-height:1.2em;font-size:13.5px;color:var(--muted)}.wl-msg.bad{color:#ff8a7a}.wl-in{display:flex;gap:12px;align-items:center}.wl-av{flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--gold);color:#111;font:900 20px var(--f-display)}`;document.head.appendChild(st)}
wlStart();
