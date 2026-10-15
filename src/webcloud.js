// ================== VERSÃO WEB: ranking no Supabase ==================
function webDevice(){let d=null;try{d=localStorage.getItem('fdb_dev')}catch(e){}if(!d){d='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);try{localStorage.setItem('fdb_dev',d)}catch(e){}}return d}
function webSecret(){let s=null;try{s=localStorage.getItem('fdb_sec')}catch(e){}if(!s){const a=new Uint8Array(24);crypto.getRandomValues(a);s=[...a].map(x=>x.toString(16).padStart(2,'0')).join('');try{localStorage.setItem('fdb_sec',s)}catch(e){}}return s}
function webLink(code){return location.origin+location.pathname+'#share.'+code}
async function sbFetch(path,opts={}){const r=await fetch(WEB_CFG.url+'/rest/v1/'+path,{...opts,headers:{apikey:WEB_CFG.key,Authorization:'Bearer '+WEB_CFG.key,'Content-Type':'application/json',...(opts.headers||{})}});if(!r.ok)throw new Error('sb '+r.status);const t=await r.text();return t?JSON.parse(t):null}
function makeWebDb(){return{
 collection(p){const q={limit(n){q.n=n;return q},async get(){if(p!=='shared')return{docs:[]};const rows=await sbFetch(`ranking?select=device,cid,item&order=pts.desc&limit=${q.n||300}`)||[];const g={};for(const r of rows)(g[r.device]=g[r.device]||[]).push(r.item);return{docs:Object.entries(g).map(([id,items])=>({id,data:()=>({items})}))}}};return q},
 doc(p){const m=p.match(/^shared\/([^/]+)\/c\/([^/]+)$/);return{async get(){if(!m)return{exists:false};const rows=await sbFetch(`ranking?select=card&id=eq.${encodeURIComponent(m[1]+'.'+m[2])}`)||[];return rows[0]?{exists:true,data:()=>rows[0].card}:{exists:false}},async set(){},async delete(){},onSnapshot(){}}}
}}
async function webShare(k){
 try{const dev=webDevice();if(!k.cid)k.cid=(S&&S.cid)||newId();
  const item={cid:k.cid,name:k.name,flag:k.flag,pos:k.pos,tier:k.tier,pts:k.pts,nick:k.nick,peak:k.peak,t:k.nTitles,b:k.bolas,by:(typeof activeProfile==='function'?activeProfile().name:''),at:Date.now()};
  await sbFetch('rpc/share_career',{method:'POST',body:JSON.stringify({p_device:dev,p_cid:k.cid,p_item:item,p_card:{...k,owner:dev,at:Date.now()},p_secret:webSecret()})});
  return dev+'.'+k.cid}catch(e){console.error(e);return null}
}
// PWA
if('serviceWorker' in navigator&&location.protocol==='https:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
