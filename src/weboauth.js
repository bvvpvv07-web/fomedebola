// ================== ENTRAR COM GOOGLE OU FACEBOOK (versão site) ==================
// Usa o login do Supabase (Google/Facebook). Os saves dessas contas ficam na tabela fdb_saves_auth, protegida por
// RLS: cada conta só lê e grava as próprias carreiras. Usuário e senha continuam funcionando como antes.
// Pra funcionar, o servidor precisa ter o Google e o Facebook ligados (Supabase › Authentication › Providers)
// e rodado o SQL de supabase/oauth_saves.sql. Enquanto não estiver ligado, o botão avisa isso.
const OA={s:null,uid:null,prov:null};
try{OA.s=JSON.parse(localStorage.getItem('fdb_oa')||'null')}catch(e){}
function oaKeep(s){OA.s=s;try{s?localStorage.setItem('fdb_oa',JSON.stringify(s)):localStorage.removeItem('fdb_oa')}catch(e){}}
async function oaProviders(){if(OA.prov)return OA.prov;try{const r=await fetch(WEB_CFG.url+'/auth/v1/settings',{headers:{apikey:WEB_CFG.key}});const j=await r.json();OA.prov=j.external||{}}catch(e){OA.prov={}}return OA.prov}
const OA_NAME={google:'Google',facebook:'Facebook'};
async function oaGo(p){const m=document.getElementById('wlMsg');const pv=await oaProviders();
 if(!pv[p]){if(m){m.textContent=`O login com ${OA_NAME[p]} ainda não foi ligado no servidor do jogo. Por enquanto, use usuário e senha.`;m.className='wl-msg bad'}return}
 if(m){m.textContent=`Abrindo o ${OA_NAME[p]}…`;m.className='wl-msg'}
 location.href=WEB_CFG.url+'/auth/v1/authorize?provider='+p+'&redirect_to='+encodeURIComponent(location.origin+location.pathname)}
// voltando do Google/Facebook: os tokens chegam depois do #
function oaCatch(){const h=location.hash||'';if(!/access_token=|error_description=/.test(h))return false;const q=new URLSearchParams(h.slice(1));history.replaceState(null,'',location.pathname+location.search);
 if(q.get('error_description')){setTimeout(()=>toast({ic:'⚠️',title:'Não deu pra entrar',txt:q.get('error_description').replace(/\+/g,' ').slice(0,140),ms:4000}),600);return false}
 oaKeep({at:q.get('access_token'),rt:q.get('refresh_token'),exp:Date.now()+(+q.get('expires_in')||3600)*1000});try{wlDrop()}catch(e){}return true}
async function oaToken(){if(!OA.s)throw Object.assign(new Error('sessao_invalida'),{code:'sessao_invalida'});if(OA.s.exp-Date.now()>90000)return OA.s.at;
 const r=await fetch(WEB_CFG.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:WEB_CFG.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:OA.s.rt})});
 if(!r.ok){oaDrop();throw Object.assign(new Error('sessao_invalida'),{code:'sessao_invalida'})}const j=await r.json();oaKeep({at:j.access_token,rt:j.refresh_token,exp:Date.now()+(j.expires_in||3600)*1000});return OA.s.at}
async function oaRest(path,opt={}){const at=await oaToken();const r=await fetch(WEB_CFG.url+'/rest/v1/'+path,{...opt,headers:{apikey:WEB_CFG.key,Authorization:'Bearer '+at,'Content-Type':'application/json',...(opt.headers||{})}});
 const t=await r.text();let j=null;try{j=t?JSON.parse(t):null}catch(e){}
 if(!r.ok){const msg=(j&&(j.message||j.hint))||('http_'+r.status);const e=new Error(msg);e.code=/muitas_carreiras/.test(msg)?'muitas_carreiras':/check constraint|too large/i.test(msg)?'grande_demais':r.status===401?'sessao_invalida':msg;throw e}return j}
function oaDrop(){oaKeep(null);OA.uid=null;if(String(CLOUD.uid||'').startsWith('oa:')){CLOUD.uid=null;CLOUD.me=null}}
// as carreiras da conta Google/Facebook entram no mesmo caminho do jogo (data/users/<id>)
{const _mkO=makeWebDb;makeWebDb=function(){const db=_mkO();const col0=db.collection.bind(db);
 db.collection=function(p){if(!(/^data\/users\//.test(p)&&OA.s&&String(CLOUD.uid||'').startsWith('oa:')))return col0(p);
  return{async get(){const L=await oaRest('fdb_saves_auth?select=cid,meta')||[];return{docs:L.map(x=>({id:x.cid,data:()=>({meta:x.meta})}))}},
   doc(cid){const q='fdb_saves_auth?cid=eq.'+encodeURIComponent(cid);return{async get(){const L=await oaRest(q+'&select=meta,data')||[];return L[0]?{exists:true,data:()=>L[0]}:{exists:false}},
    async set(b){await oaRest('fdb_saves_auth?on_conflict=uid,cid',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({uid:OA.uid,cid,meta:b.meta,data:b.data,updated_at:new Date().toISOString()})})},
    async delete(){await oaRest(q,{method:'DELETE'})}}}}};return db}}
async function oaStart(){if(typeof WEB_CFG==='undefined')return;const fresh=oaCatch();if(!OA.s)return;
 try{const at=await oaToken();const r=await fetch(WEB_CFG.url+'/auth/v1/user',{headers:{apikey:WEB_CFG.key,Authorization:'Bearer '+at}});if(!r.ok)throw new Error('user');const u=await r.json();
  const md=u.user_metadata||{};OA.uid=u.id;CLOUD.db=makeWebDb();CLOUD.uid='oa:'+u.id;CLOUD.me={name:(md.full_name||md.name||(u.email||'Jogador').split('@')[0]).slice(0,40),avatarUrl:/^https:\/\//.test(md.avatar_url||'')?md.avatar_url:null,prov:(u.app_metadata||{}).provider};
  try{wlNameProfile()}catch(e){}
  if(fresh){let n=0;const ix=localIndex();for(const cid in ix){const b=localGet(cid);if(!b||!b.meta||!b.data)continue;try{await cloudPut(cid,{meta:b.meta,data:await fdbUngz(b.data)});n++}catch(e){if(e.code==='muitas_carreiras')break}}
   toast({ic:'✅',title:`Olá, ${CLOUD.me.name}!`,txt:n?`${n} carreira${n>1?'s':''} deste aparelho ${n>1?'foram':'foi'} pra sua conta.`:'Suas carreiras agora ficam salvas na conta.',ms:3200})}
  if(['home','careers','account'].includes(CLOUD.screen))rerenderNav()}
 catch(e){console.error('oauth',e);if(fresh)toast({ic:'⚠️',title:'Não deu pra entrar',txt:'Tente de novo em instantes.',ms:3000})}}
// caixa da conta: botões do Google e do Facebook em cima do usuário e senha
{const _bx=wlBoxHTML;wlBoxHTML=function(){if(online()){let h=_bx();if(CLOUD.me&&CLOUD.me.prov){h=h.replace('Conectado.',`Conectado com ${OA_NAME[CLOUD.me.prov]||CLOUD.me.prov}.`);if(CLOUD.me.avatarUrl)h=h.replace(/<span class="wl-av">[^<]*<\/span>/,`<img class="wl-av" src="${esc(CLOUD.me.avatarUrl)}" alt="">`)}return h}
 return`<div class="oa-btns"><button class="oa-b g" type="button" data-oa="google"><svg viewBox="0 0 48 48" width="20" height="20"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 38.2 44 33 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>Entrar com Google</button>
  <button class="oa-b f" type="button" data-oa="facebook"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="#fff" d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z"/></svg>Entrar com Facebook</button></div>
  <div class="oa-or"><span>ou com usuário e senha</span></div>`+_bx()}}
{const _bd=wlBind;wlBind=function(){_bd();document.querySelectorAll('[data-oa]').forEach(b=>b.onclick=()=>oaGo(b.dataset.oa));const o=document.getElementById('wlOut');if(o&&OA.s)o.onclick=oaLogout}}
async function oaLogout(){try{const at=OA.s&&OA.s.at;if(at)await fetch(WEB_CFG.url+'/auth/v1/logout',{method:'POST',headers:{apikey:WEB_CFG.key,Authorization:'Bearer '+at}})}catch(e){}oaDrop();
 toast({ic:'👋',title:'Você saiu da conta',txt:'As carreiras continuam na conta. Neste aparelho fica só o que já estava salvo nele.',ms:3000});rerenderNav()}
{const st=document.createElement('style');st.textContent=`.oa-btns{display:grid;gap:8px}.oa-b{display:flex;align-items:center;justify-content:center;gap:10px;min-height:46px;border-radius:12px;border:1px solid #0000;font:700 15px var(--f-body,inherit);cursor:pointer}
.oa-b.g{background:#fff;color:#1f1f1f;border-color:#dadce0}.oa-b.f{background:#1877F2;color:#fff}.oa-or{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:12.5px;margin:4px 0}.oa-or:before,.oa-or:after{content:'';flex:1;height:1px;background:currentColor;opacity:.3}
img.wl-av{object-fit:cover;padding:0}`;document.head.appendChild(st)}
oaStart();
