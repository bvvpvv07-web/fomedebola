// ============ NSS · lances pelo OVR, atributos no 3D, fluxo da partida, clipe de gol com replay, 200 lances, aumento, Fofocagram e BETTIGER no jogo ============
// ---------- quantos lances: depende do OVR (sem teto fixo de 3) ----------
function nsLanceCap(final){const o=(S&&S.ovr)||55;return clamp(Math.round(2+(o-48)/7),2,8)+(final?1:0)}
function nsOvrK(){const o=(S&&S.ovr)||55;return clamp(.7+(o-50)/45,.7,1.6)}
// ---------- atributos vão pro lance 3D (força, velocidade, drible, passe) ----------
{const _cfgS=l3dCfg;l3dCfg=function(o){const c=_cfgS(o);try{if(nsOn()&&S.n){const lv=nsEffLv();c.stats={ovr:S.ovr,vel:Math.round(lv.vel),'for':Math.round(lv['for']),tec:Math.round(lv.tec),vis:Math.round(lv.vis),bp:Math.round(lv.bp)};
  // OVR pesa na precisão: quem é bom erra menos
  c.noiseK=clamp((c.noiseK||1)*(1.32-(S.ovr-40)/110),.35,1.6)}}catch(e){}return c}}
// ---------- 200 lances diferentes ----------
const NS_LB=[['contra','Contra-ataque'],['contra3','Contra-ataque 3 contra 2'],['area','Bola na área'],['mano','Mano a mano'],['rebote','Rebote'],['longe','Chute de longe'],['voleio','Voleio'],['cabeca','Cabeçada'],['escCab','Escanteio na cabeça'],['pivo','Pivô'],['tabela','Tabela'],['enfiada','Enfiada'],['virada','Virada de jogo'],['lanca','Lançamento'],['cruz','Cruzamento'],['saida','Saída de bola'],['driblar','Drible'],['driblarP','Drible na ponta'],['falta','Falta'],['faltaLonge','Falta de longe'],['faltaLat','Falta lateral'],['escanteio','Escanteio'],['escCurto','Escanteio curto'],['penalti','Pênalti'],['lateral','Lateral']];
const NS_LV=[[{},'pelo meio'],[{mx:-1},'pelo outro lado'],[{dz:-3},'mais perto do gol'],[{dz:4},'de mais longe'],[{add:1},'com marcação dobrada'],[{rem:1},'com espaço'],[{gkOut:1},'com o goleiro adiantado'],[{mx:-1,add:1},'do outro lado e apertado']];
const NS_LSET={falta:1,faltaLonge:1,faltaLat:1,penalti:1,escanteio:1,escCurto:1,lateral:1};
const NS_LVSET=[[{},'clássica'],[{mx:-1},'pelo outro lado'],[{gkOut:1},'goleiro adiantado'],[{gkK:-.3},'goleiro baixinho'],[{gkK:.25},'goleiro paredão'],[{mx:-1,gkK:-.2},'outro lado, goleiro inseguro'],[{dz:2},'um pouco mais longe'],[{dz:-2},'um pouco mais perto']];
const NS_LANCES=[];NS_LB.forEach(([sc,nm],i)=>{(NS_LSET[sc]?NS_LVSET:NS_LV).forEach(([v,vn],j)=>NS_LANCES.push({id:i*8+j+1,sc,v,n:`${nm} ${vn}`}))});
{const _cfgV=l3dCfg;l3dCfg=function(o){const c=_cfgV(o);try{if(nsOn()&&c&&c.scen&&!/^gk|desarme|corte/.test(c.scen)&&!(o&&o.env==='prison')){const L=NS_LANCES.filter(x=>x.sc===c.scen);if(L.length){const n=S.n;n.lseen=n.lseen||[];const fresh=L.filter(x=>!n.lseen.includes(x.id));const v=pick(fresh.length&&ch(.7)?fresh:L);
   c.var={...v.v};if(v.v.gkK)c.gkK=(c.gkK||0)+v.v.gkK;if(!n.lseen.includes(v.id)){n.lseen.push(v.id);c.newL=true}c.head=`Lance ${v.id}/200 · ${v.n}`;c.lid=v.id}}}catch(e){}return c}}
// ---------- fluxo da partida (pressão minuto a minuto, igual aos apps de placar) ----------
function nsFlowAdd(L,r){if(!L||r.m==null||(r.side!=='u'&&r.side!=='t'))return;L.fp=L.fp||{u:0,t:0};const t=String(r.t||'');
 let w=.18;if(/⚽|GOL/.test(t)||/ngl/.test(r.k||''))w=1.2;else if(/invade|Contra-ataque|chut|arrisc|cabece|chance|finaliz|perig|Falta|Escanteio|trave|travess|Defes|defend|salva|área/i.test(t))w=.6;
 L.fp[r.side]+=w;if(/ngl/.test(r.k||'')||/⚽ GOL|⚽ Gol/.test(t)){(L.fg=L.fg||[]).push({m:r.m,u:r.side==='u'})}if(/🟨|🟥/.test(t))(L.fc=L.fc||[]).push({m:r.m,u:r.side==='u',r:/🟥/.test(t)})}
function nsFlowTick(L){L.fp=L.fp||{u:0,t:0};L.fm=L.fm||[];L.pc=L.pc||{u:0,t:0};L.pc[L.poss?'u':'t']++;const pos=L.poss?.12:-.12;let v=(L.fp.u-L.fp.t)*.7+pos+(Math.random()-.5)*.12;L.fm[L.min]=clamp(v,-1.25,1.25);L.fp.u*=.35;L.fp.t*=.35;
 const el=document.getElementById('nlFlow');if(el&&(L.min%2===0||L.min>=89||L.min===45))el.innerHTML=nsFlowSVG(L)}
function nsFlowSVG(L){const W=600,H=86,M=H/2,fm=(L&&L.fm)||[];const homeU=!L||L.homeU!==false;const sgn=homeU?1:-1;
 const X=m=>m<=45?((m-.5)/45)*(W/2-3):W/2+3+((m-45.5)/45)*(W/2-3);const val=m=>{const a=fm[m-1]||0,b=fm[m]||0,c=fm[m+1]||0;return sgn*(a+2*b+c)/4};
 const last=Math.min(90,(L&&L.min)||0);const seg=(m0,m1)=>{if(last<m0)return['',''];let up=`M${X(m0).toFixed(1)},${M}`,dn=up;const e=Math.min(last,m1);for(let m=m0;m<=e;m++){const v=val(m);const y=M-v*M*.92;const x=X(m).toFixed(1);up+=` L${x},${Math.min(M,y).toFixed(1)}`;dn+=` L${x},${Math.max(M,y).toFixed(1)}`}up+=` L${X(e).toFixed(1)},${M} Z`;dn+=` L${X(e).toFixed(1)},${M} Z`;return[up,dn]};
 const[u1,d1]=seg(1,45),[u2,d2]=seg(46,90);
 const gl=((L&&L.fg)||[]).map(g=>{const top=(g.u===homeU);return`<g transform="translate(${X(Math.max(1,g.m)).toFixed(0)},${top?9:H-9})"><circle r="8" fill="#fff" stroke="#21a95a" stroke-width="2.5"/><text y="4" font-size="10" text-anchor="middle">⚽</text></g>`}).join('');
 const cd=((L&&L.fc)||[]).map(g=>{const top=(g.u===homeU);return`<rect x="${(X(g.m)-3).toFixed(0)}" y="${top?2:H-13}" width="7" height="10" rx="1.5" fill="${g.r?'#e0412f':'#f2c94c'}"/>`}).join('');
 const cr=sd=>`<i class="cr" style="background:${sd&&sd[0]||'#888'};color:${(()=>{try{return pickInk(sd[0])}catch(e){return'#fff'}})()}">${esc(String((sd&&sd[2])||'').slice(0,3))}</i>`;
 const hC=L&&L.cU?(homeU?[...L.cU,L.us]:[...L.cT,L.th]):null,aC=L&&L.cU?(homeU?[...L.cT,L.th]:[...L.cU,L.us]):null;
 return`<div class="fl-wrap"><div class="fl-cr">${hC?cr([hC[0],hC[1],(hC[2]||'').replace(/^(.{3}).*/,'$1')]):''}${aC?cr([aC[0],aC[1],(aC[2]||'').replace(/^(.{3}).*/,'$1')]):''}</div><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-label="Fluxo da partida">
 <rect x="0" y="12" width="${W/2-3}" height="${M-12}" fill="#c9ebd0"/><rect x="${W/2+3}" y="12" width="${W/2-3}" height="${M-12}" fill="#c9ebd0"/><rect x="0" y="${M}" width="${W/2-3}" height="${M-12}" fill="#d2d8fb"/><rect x="${W/2+3}" y="${M}" width="${W/2-3}" height="${M-12}" fill="#d2d8fb"/>
 <path d="${u1}" fill="#43b05c"/><path d="${u2}" fill="#43b05c"/><path d="${d1}" fill="#3b4ef5"/><path d="${d2}" fill="#3b4ef5"/>${gl}${cd}</svg></div>`}
// ---------- tela da partida no estilo dos apps de placar ----------
function nsSofaStrip(t){return String(t||'').replace(/<small>[\s\S]*?<\/small>/g,'').replace(/<[^>]+>/g,'').trim()}
function nsSofaWho(t){const s=nsSofaStrip(t);const R=[/GOL! (.+?) marca/i,/Golaço de falta de (.+?)!/i,/GOL de (.+?)(?:!| no | de cabeça|\.|$)/i,/Gol de (.+?)(?:\.|!|$)/i,/⚽ (.+?) (?:converte|tira|escolhe)/i,/e gol de (.+?)[!.]/i];for(const r of R){const m=s.match(r);if(m)return m[1].replace(/\s*\(.*$/,'').trim()+(/pên/.test(s)?' (pên.)':'')}return'Gol'}
function nsSofaPush(L,r){if(!L||r.m==null)return;L.ev=L.ev||[];L.goals=L.goals||[];L.st=L.st||{u:{sh:0,on:0,big:0,cor:0,fal:0,yc:0,rc:0,sv:0,xg:0,tk:0},t:{sh:0,on:0,big:0,cor:0,fal:0,yc:0,rc:0,sv:0,xg:0,tk:0}};
 const t=nsSofaStrip(r.t),k=r.k||'',sd=r.side==='t'?'t':'u',ot=sd==='u'?'t':'u';const S0=L.st[sd],O0=L.st[ot];let key=false;
 if(/\bngl\b/.test(k)){const who=nsSofaWho(r.t);const sc=L.scFn?L.scFn():[0,0];L.goals.push({side:sd,who,m:r.m});L.ev.push({m:r.m,side:sd,kind:'goal',who,sc,gi:L.goals.length-1,me:/\bnme\b/.test(k)});S0.sh++;S0.on++;S0.xg+=.35;key=true}
 else if(/🟨|🟥/.test(t)){const red=/🟥/.test(t);if(red)S0.rc++;else S0.yc++;L.ev.push({m:r.m,side:sd,kind:red?'red':'yel',who:t.replace(/^[^\wÀ-ú]+/,'').slice(0,40)});key=true}
 else if(/\bnin\b/.test(k)||/ENTROU EM CAMPO/.test(t)){L.ev.push({m:r.m,side:'u',kind:'in',who:L.ME||'Você'});key=true}
 else if(/substituído|sai de campo|Pedir pra sair/.test(t)){L.ev.push({m:r.m,side:'u',kind:'out',who:L.ME||'Você'});key=true}
 if(!/\bngl\b/.test(k)){if(/chut|arrisc|cabece|finaliz|trave|travess|pra fora|por cima|raspando/i.test(t)){S0.sh++;S0.xg+=.07;if(/defes|segura|salva|Defes/i.test(t)){S0.on++;O0.sv++}}
  if(/invade a área|cara a cara|sozinho|Contra-ataque/i.test(t)){S0.big+=/invade|cara a cara|sozinho/i.test(t)?1:0;S0.xg+=.12}
  if(/Escanteio para/i.test(t))S0.cor++;if(/Falta em/i.test(t))O0.fal++;if(/Desarme|rouba|desarma|corta/i.test(t))S0.tk++}
 const lv=document.getElementById('nlLive');if(lv)lv.innerHTML=nsSofaLive(L);
 if(key){const ev=document.getElementById('nlEvents');if(ev){ev.innerHTML=nsSofaEvents(L);ev.querySelectorAll('[data-rp]').forEach(b=>b.onclick=()=>nsSofaReplay(L,+b.dataset.rp))}const scr=document.getElementById('nlScr');if(scr)scr.innerHTML=nsSofaScorers(L)}
 if(L.tab==='est'&&L.min%3===0){const e=document.getElementById('nlStats');if(e)e.innerHTML=nsSofaStats(L)}}
function nsSofaLive(L){const R=((L&&L.rows)||[]).filter(r=>r.m!=null).slice(-3).reverse();if(!R.length)return'<p class="ss-mut">O jogo vai começar.</p>';return R.map(r=>`<div class="lv ${r.side==='u'?'u':r.side==='t'?'t':''} ${/\bnme\b/.test(r.k||'')?'me':''}"><b>${r.m}'</b><span>${r.t}</span></div>`).join('')}
function nsSofaScorers(L){const G=(L&&L.goals)||[];const homeU=L&&L.homeU!==false;const fmt=side=>{const by={};for(const g of G)if(g.side===side){(by[g.who]=by[g.who]||[]).push(g.m+"'")}return Object.entries(by).map(([w,ms])=>`${esc(w)} ${ms.join(', ')}`).join('<br>')};
 const h=fmt(homeU?'u':'t'),a=fmt(homeU?'t':'u');if(!h&&!a)return'';return`<span class="h">${h}</span><i>⚽</i><span class="a">${a}</span>`}
function nsSofaEvents(L){const E=((L&&L.ev)||[]).slice().sort((a,b)=>b.m-a.m);const homeU=L&&L.homeU!==false;
 const head=L&&L.ended?`<div class="ev-ft"><span>FT ${(L.scFn?L.scFn():[0,0]).join(' - ')}</span></div>`:'';
 if(!E.length)return head+'<p class="ss-mut">Gols, cartões e substituições aparecem aqui.</p>';
 return head+E.map(e=>{const left=(e.side==='u')===homeU;const ic=e.kind==='goal'?'⚽':e.kind==='yel'?'<i class="cd y"></i>':e.kind==='red'?'<i class="cd r"></i>':e.kind==='in'?'<span class="sb in">⇄</span>':'<span class="sb out">⇄</span>';
  const body=e.kind==='goal'?`<button class="rp" data-rp="${e.gi}" aria-label="Ver o replay do gol">▶ ${e.sc[0]} - ${e.sc[1]}</button><span class="nm"><b>${esc(e.who)}</b>${e.me?' <em>você</em>':''}</span>`:e.kind==='in'?`<span class="nm"><b>${esc(e.who)}</b> <em class="g">Entrou</em></span>`:e.kind==='out'?`<span class="nm"><b>${esc(e.who)}</b> <em class="r">Saiu</em></span>`:`<span class="nm">${esc(e.who)}</span>`;
  return`<div class="ev ${left?'l':'r'}"><b class="mn">${e.m}'</b><span class="ic">${ic}</span>${body}</div>`}).join('')}
function nsSofaReplay(L,i){const g=L&&L.goals&&L.goals[i];if(!g)return;nsGoalClip({side:g.side==='u'?'us':'them',who:g.who,min:g.m})}
function nsSofaStats(L){const st=(L&&L.st)||{u:{},t:{}};const homeU=L&&L.homeU!==false;const H=homeU?st.u:st.t,A=homeU?st.t:st.u;const pc=(L&&L.pc)||{u:1,t:1};const ph=Math.round(100*(homeU?pc.u:pc.t)/Math.max(1,pc.u+pc.t));const mn=Math.max(1,(L&&L.min)||1);
 const pas=p=>Math.round(p/100*mn*5.6);const row=(lb,a,b,fmt)=>{const f=fmt||(v=>v);const tot=(+a)+(+b)||1;const wa=Math.round(a/tot*100),wb=Math.round(b/tot*100);const la=+a>+b,lb2=+b>+a;
  return`<div class="sr"><div class="v"><b class="${la?'lead h':''}">${f(a)}</b><span>${lb}</span><b class="${lb2?'lead a':''}">${f(b)}</b></div><div class="br"><i class="h ${la?'on':''}"><u style="width:${wa}%"></u></i><i class="a ${lb2?'on':''}"><u style="width:${wb}%"></u></i></div></div>`};
 return`<div class="sp"><span class="h">${ph}%</span><b>Posse de bola</b><span class="a">${100-ph}%</span></div><div class="spb"><i style="width:${ph}%"></i></div>
 ${row('Gols esperados (xG)',(H.xg||0).toFixed(2),(A.xg||0).toFixed(2))}${row('Grandes chances',H.big||0,A.big||0)}${row('Total de chutes',H.sh||0,A.sh||0)}${row('Chutes no gol',H.on||0,A.on||0)}${row('Defesas do goleiro',H.sv||0,A.sv||0)}${row('Escanteios',H.cor||0,A.cor||0)}${row('Faltas',H.fal||0,A.fal||0)}${row('Passes',pas(ph),pas(100-ph))}${row('Desarmes',H.tk||0,A.tk||0)}${row('Cartões amarelos',H.yc||0,A.yc||0)}`}
function nsSofaRt(v){return v>=8?'#3aa0e8':v>=7?'#21a95a':v>=6.5?'#c9a900':v>=6?'#e08a1f':'#e0412f'}
function nsSofaLine(L){const x=NSSM.cur;if(!L||!x)return'';const R=(L.RU||[]).filter(p=>p&&p.n);L.rt=L.rt||{};const sl=[['GOL'],['LD','ZAG','ZAG','LE'],['VOL','MC','MEI'],['PD','ATA','PE']];const used=new Set();const posOf={LD:['LD','ZAG'],LE:['LE','ZAG'],ZAG:['ZAG','VOL'],VOL:['VOL','MC'],MC:['MC','MEI','VOL'],MEI:['MEI','MC','SA'],PD:['PD','MD','SA','PE'],PE:['PE','ME','SA','PD'],ATA:['ATA','SA'],GOL:['GOL']};
 const meSlot=(()=>{const p=S.pos;for(let i=0;i<sl.length;i++){const j=sl[i].indexOf(p==='SA'?'ATA':p==='ME'?'PE':p==='MD'?'PD':p);if(j>=0)return[i,j]}return[3,1]})();
 const gl={};for(const g of(L.goals||[]))if(g.side==='u')gl[g.who]=(gl[g.who]||0)+1;
 const rt=nm=>{if(L.rt[nm]==null)L.rt[nm]=Math.round((6.4+Math.random()*.8)*10)/10;return clamp(L.rt[nm]+(gl[nsShort(nm)]||0)*.9,3,10)};
 const myR=()=>clamp(6.4+(x.x.g||0)*.85+(x.x.a||0)*.5+(x.x.dn||0)+Math.min(.5,(x.x.ps||0)*.05)+Math.min(.4,(x.x.dr||0)*.1)+(x.x.tk||0)*.15,3,10);
 const rows=sl.map((ln,i)=>ln.map((pos,j)=>{if(meSlot[0]===i&&meSlot[1]===j)return{n:S.name,me:true,num:S.num,r:myR()};const p=R.find(q=>!used.has(q.n)&&(posOf[pos]||[pos]).includes(q.pos))||R.find(q=>!used.has(q.n)&&q.pos!=='GOL'||pos==='GOL');if(!p)return{n:'—',r:6.5};used.add(p.n);return{n:p.n,num:p.num||RI(2,30),r:rt(p.n)}}));
 const c=L.cU||['#c8102e','#fff'];const avg=(()=>{const a=rows.flat().map(p=>p.r);return a.reduce((s,v)=>s+v,0)/a.length})();
 return`<div class="ln-hd"><b>${esc(L.us||'')}</b><span class="rt" style="background:${nsSofaRt(avg)}">${avg.toFixed(2)}</span><em>4-3-3</em></div><div class="ln-pitch">${rows.map(r=>`<div class="ln-row">${r.map(p=>`<div class="pl ${p.me?'me':''}"><i class="av" style="background:${c[0]};color:${(()=>{try{return pickInk(c[0])}catch(e){return'#fff'}})()}">${esc(String(p.n).split(/\s+/).map(w=>w[0]).slice(0,2).join(''))}</i><span class="rt" style="background:${nsSofaRt(p.r)}">${p.r.toFixed(1)}</span><small>${p.num?p.num+' ':''}${esc(p.me?'VOCÊ':nsShort(p.n))}</small></div>`).join('')}</div>`).join('')}</div>`}
function nsSofaPitch(r){const u=r.side!=='t';const y0=20+Math.random()*50,x0=u?55+Math.random()*20:45-Math.random()*20,x1=u?84+Math.random()*6:16-Math.random()*6,y1=36+Math.random()*18;
 return`<svg class="gp" viewBox="0 0 100 70" aria-hidden="true"><rect x="1" y="1" width="98" height="68" rx="3" fill="#cfead2" stroke="#fff" stroke-width=".8"/><line x1="50" y1="1" x2="50" y2="69" stroke="#fff" stroke-width=".8"/><circle cx="50" cy="35" r="8" fill="none" stroke="#fff" stroke-width=".8"/><rect x="1" y="18" width="16" height="34" fill="none" stroke="#fff" stroke-width=".8"/><rect x="83" y="18" width="16" height="34" fill="none" stroke="#fff" stroke-width=".8"/>
 <line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="#222" stroke-width=".9"/><circle cx="${x0.toFixed(1)}" cy="${y0.toFixed(1)}" r="1.6" fill="#fff" stroke="#222" stroke-width=".6"/><text x="${x1.toFixed(1)}" y="${(y1+2.5).toFixed(1)}" font-size="6" text-anchor="middle">⚽</text></svg>`}
// nomes dos times no gráfico
{const _ls=IO_UI.live.start;IO_UI.live.start=async function(m){const r=await _ls.apply(this,arguments);try{const x=NSSM.cur;const L=x&&x.live;if(L&&m){L.us=(m.o&&m.o.us&&m.o.us.n)||club().n;L.th=(m.o&&m.o.them&&m.o.them.n)||'';const el=document.getElementById('nlFlow');if(el)el.innerHTML=nsFlowSVG(L)}}catch(e){}return r}}
// ---------- todo gol vira lance 3D com replay (do seu time e do adversário) ----------
function nsGoalClip(o){if(typeof lanceMode!=='function'||lanceMode()!=='jogar'||L3D.failed||SESS.on||(S.n&&S.n.clipOff))return Promise.resolve();
 return new Promise(async res=>{let done=false;const fin=()=>{if(done)return;done=true;try{L3D.frame.classList.remove('on');document.body.classList.remove('l3d-on')}catch(e){}res()};
  try{await l3dBoot();L3D._loaded=true}catch(e){return fin()}
  let base={};try{base=l3dCfg({kind:'finish',comp:''})}catch(e){}
  const cfg={us:base.us,them:base.them,gkUs:base.gkUs,crowd:base.crowd,env:base.env,side:o.side,who:o.who,min:o.min};
  L3D._clip=fin;L3D.frame.classList.add('on');document.body.classList.add('l3d-on');try{L3D.frame.contentWindow.postMessage({type:'ml-clip',cfg},'*')}catch(e){fin()}
  setTimeout(fin,26000)})}
addEventListener('message',e=>{const d=e.data||{};if(!L3D.frame||e.source!==L3D.frame.contentWindow)return;if(d.type==='ml-clip-done'&&L3D._clip){const f=L3D._clip;L3D._clip=null;f()}});
// ---------- chuteiras: liberam por estrela OU por OVR ----------
const NS_BOOT_OVR={nb3:56,nb4:58,nb5:64,nb6:68,nb7:73,nb8:80,nb9:86};
nsBootLock=function(b){const r=NS_BOOT_REQ[b.id];if(!r)return'';const n=S.n;const okStar=!r.l||n.star.l>=r.l;const okOvr=NS_BOOT_OVR[b.id]&&S.ovr>=NS_BOOT_OVR[b.id];
 if(!(okStar||okOvr))return`⭐ ${r.l} ou OVR ${NS_BOOT_OVR[b.id]}`;if(b.id==='nb9'&&(n.bootSold||{})[S.year])return'Esgotada este ano';return''};
// ---------- pedir aumento: uma vez por temporada, com chance clara ----------
askRaise=function(){const n=S.n;const c=club();
 if(S.loan)return{ok:false,txt:'Emprestado não pede aumento.'};if(!S.club||!S.wage||S.youth)return{ok:false,txt:'Você ainda não tem contrato profissional. Primeiro suba pro time principal.'};
 if(n&&n.raiseY===S.year)return{ok:false,txt:'Você já pediu aumento nesta temporada. A diretoria só volta a conversar na próxima (ou na renovação).'};
 if(n&&(n.ss&&n.ss.ap||0)<3)return{ok:false,txt:'Jogue pelo menos 3 partidas nesta temporada antes de pedir aumento.'};
 const ss=n&&n.ss||{};const nota=(typeof S.st==='object'&&S.st.stats&&(()=>{let ns=0,nn=0;for(const k in S.st.stats){ns+=S.st.stats[k].ns||0;nn+=S.st.stats[k].nn||0}return nn?ns/nn:6.6})())||6.6;
 const p=clamp(.3+(nota-6.7)*.45+(S.ovr-c.s)/14+((S.board??55)-55)/120+(ss.g||0)*.02+((n&&n.rel.coach)||50-50)/250,.08,.85);
 if(n)n.raiseY=S.year;
 if(ch(p)){const inc=R(1.1,1.3);const old=S.wage;S.wage=Math.round(S.wage*inc);try{nsCt()}catch(e){}return{ok:true,txt:`Aumento aprovado! O salário foi de ${money(old/1000)} pra ${money(S.wage/1000)} por semana.`,chips:[[`+${Math.round((inc-1)*100)}% salário`,'up']]}}
 S.board=clamp((S.board??55)-6,0,100);if(S.life)S.life.cab=clamp(S.life.cab-2,0,100);return{ok:false,txt:`A diretoria negou (chance era de ${Math.round(p*100)}%). Jogue bem e tente de novo na próxima temporada.`,chips:[['−6 Diretoria','down']]}};
// ---------- Fofocagram depois do jogo: o Nardo posta, a torcida comenta, você responde ----------
function nsPostFofo(p){const me=p.me||{};const opp=(p.them&&p.them.n)||'adversário';const nm=S.name;const win=p.res==='V',loss=p.res==='D';
 if(!me.play)return{ic:'🪑',t:`${nm} esquentou o banco de novo contra o ${opp}. Será que o técnico perdeu a paciência? 🤔`,c:['coitado','treina mais','solta o menino!']};
 if(me.g>=3)return{ic:'🎩',t:`HAT-TRICK! ${nm} fez ${me.g} contra o ${opp} e levou a bola pra casa. Cadê a seleção? 🔥`,c:['MONSTRO','convoca!!!','pai tá on']};
 if(me.g>=2)return{ic:'🔥',t:`Doblete de ${nm} contra o ${opp}! Nardo apurou: já tem clube grande ligando 📞`,c:['craque demais','fica no time pfvr','👏👏👏']};
 if(me.g===1)return{ic:'⚽',t:`${nm} deixou o dele contra o ${opp}${win?' e garantiu a vitória':''}. Comemoração com dedicatória misteriosa 👀`,c:['pra quem foi?','golaço','ídolo']};
 if(me.nota>=7.6)return{ic:'⭐',t:`Noite de gala de ${nm}: nota ${fmt1(me.nota)} contra o ${opp}. Os olheiros anotaram tudo 📝`,c:['jogou muito','melhor em campo','respeita']};
 if(me.nota<5.6)return{ic:'📉',t:`${nm} sumiu em campo contra o ${opp}${loss?' na derrota':''}. A torcida já pede banco 😬`,c:['vergonha','fase ruim','acredito na volta']};
 return{ic:'🗞️',t:`${nm} cumpriu o papel contra o ${opp}. Nardo quer saber: cadê o brilho? ✨`,c:['normal','dá pra mais','tá evoluindo']}}
{const _pmFo=nsPostMatch;nsPostMatch=async function(){const posts=(NSSM.post||[]).slice();const r=await _pmFo.apply(this,arguments);
 try{const p=posts.filter(x=>x&&x.me).slice(-1)[0];if(p&&nsOn()&&!(S.youth&&!p.me.play)){const F=nsPostFofo(p);const ig=nsIg();const fol=nsIgFol();const likes=Math.round(fol*R(.03,.09)*(p.me.g?1.6:1));
  const k=await nsPostScreen(`<div class="nsp-step">Fofocagram</div><div class="nsfo-post"><div class="hd"><i class="av">${(()=>{try{return faceSVG(NS_NARDO,'#ff2bd6','#111')}catch(e){return'🗞️'}})()}</i><b>@nardomeses</b><small>agora</small></div><div class="md">${(()=>{try{return npPlayerPhoto({})}catch(e){return''}})()}<span class="st">${F.ic}</span></div><div class="ft"><b>❤️ ${nsIgK(likes)} curtidas</b><p>${esc(F.t)}</p>${F.c.map(c=>`<div class="cm"><b>${esc(pick(FD_FANS))}</b> ${esc(c)}</div>`).join('')}</div></div>
   <div class="nsfo-rep"><small>Responder nos comentários</small><button class="btn" data-pc="hum">🙏 Agradecer, com humildade</button><button class="btn ghost" data-pc="pro">😎 Provocar o adversário</button><button class="btn ghost" data-pc="ign">Ignorar</button></div>`);
  const n=S.n;let txt='',chips=[];if(k==='hum'){n.rel.fans=clamp((n.rel.fans||50)+2,0,100);n.rel.coach=clamp(n.rel.coach+1,0,100);ig.bonus=(ig.bonus||0)+Math.round(fol*.01);txt='A torcida curtiu a humildade.';chips=[['Torcida +2','up'],['Técnico +1','up']]}
  else if(k==='pro'){const good=p.res!=='D';n.rel.fans=clamp((n.rel.fans||50)+(good?3:-4),0,100);if(S.life)S.life.fama=clamp(S.life.fama+1,0,100);n.rel.team=clamp(n.rel.team-1,0,100);ig.bonus=(ig.bonus||0)+Math.round(fol*.03);txt=good?'Viralizou! A torcida amou a provocação.':'Provocar depois de perder pegou mal…';chips=[[`Torcida ${good?'+3':'−4'}`,good?'up':'down'],['Fama +1','up']]}
  if(txt)toast({ic:'📱',title:txt,txt:chips.map(c=>c[0]).join(' · '),ms:2200});nsPostClose()}}catch(e){console.error(e)}
 try{await nsBetSettle()}catch(e){console.error(e)}return r}}
// ---------- BETTIGER presente: odds no pré-jogo, aposta na rodada, resultado depois ----------
function nsOdds(a,b,home){const d=((a&&a.s)||70)-((b&&b.s)||70)+(home?3:0);let ph=clamp(.42+d/45,.1,.82),pd=.26,pa=Math.max(.06,1-ph-pd);const o=p=>Math.max(1.05,Math.round(.9/p*100)/100);return[o(ph),o(pd),o(pa)]}
function nsRoundNow(){const st=S.st;const it=st&&st.cal&&st.cal[st.idx];return it&&it.k==='lg'?it.r:null}
async function nsBetPanel(o){const n=S.n;const r=nsRoundNow();const st=S.st;const L=[];
 if(r!=null&&st.rounds&&st.rounds[r])for(const[h,a]of st.rounds[r]){if(h===S.club||a===S.club)continue;if(CLUB[h]&&CLUB[a])L.push([h,a])}
 if(!L.length&&!(o&&o.us))return;const fx=L.length?pick(L):null;const stake=Math.max(.001,Math.round(S.din*.05*1000)/1000);
 const opts=[];if(fx){const[h,a]=fx;const od=nsOdds(CLUB[h],CLUB[a],true);opts.push(['h',`${CLUB[h].n} vence · ${od[0].toFixed(2)}`],['d',`Empate · ${od[1].toFixed(2)}`],['a',`${CLUB[a].n} vence · ${od[2].toFixed(2)}`]);n._betFx={h,a,od,r}}
 if(S.pos!=='GOL'&&S.age>=18)opts.push(['me','🚫 Você marcar no seu jogo · 3.00 (proibido pra atleta)']);
 const k=await nsPop({ic:'🐯',title:'BETTIGER · aposta da rodada',txt:`Aposta de ${money(stake)} (5% do seu dinheiro). ${fx?`Jogo: ${CLUB[fx[0]].n} × ${CLUB[fx[1]].n}.`:''}`,opts,ok:'Não apostar'});
 if(!k||!opts.find(x=>x[0]===k))return;if(S.din<stake){toast({ic:'💸',title:'Sem dinheiro pra apostar',ms:1600});return}
 S.din-=stake;n.bet={k,stake,fx:k==='me'?null:n._betFx,y:S.year};S.casino=S.casino||{};S.casino.visits=(S.casino.visits||0)+1;toast({ic:'🐯',title:'Aposta feita',txt:'O resultado sai depois do jogo.',ms:1600})}
async function nsBetSettle(){const n=S.n;const B=n&&n.bet;if(!B)return;n.bet=null;let win=false,odd=1,txt='';
 if(B.k==='me'){const last=((S.st&&S.st.log)||[]).filter(x=>x.k==='match'&&x.me).slice(-1)[0];win=!!(last&&last.me.play&&last.me.g>0);odd=3;
  if(ch(.14)){if(S.st)S.st.suspLeft=(S.st.suspLeft||0)+6;if(S.life)S.life.fama=clamp(S.life.fama-10,0,100);S.board=clamp((S.board??55)-25,0,100);await nsPop({ic:'⚖️',title:'Pego apostando no próprio jogo',txt:'A federação cruzou os dados do BETTIGER. Suspenso por 6 jogos, multa e manchete em todo lugar.'});return}}
 else{const R0=S.st&&S.st.nsRound;const f=B.fx;const row=R0&&f&&R0.r===f.r?R0.list.find(x=>x[0]===f.h&&x[1]===f.a):null;if(!row){S.din+=B.stake;toast({ic:'🐯',title:'Aposta devolvida',txt:'O jogo não aconteceu.',ms:1600});return}
  const res=row[2]>row[3]?'h':row[2]<row[3]?'a':'d';win=res===B.k;odd=f.od[{h:0,d:1,a:2}[B.k]];txt=`${CLUB[f.h].a||CLUB[f.h].n} ${row[2]}×${row[3]} ${CLUB[f.a].a||CLUB[f.a].n}. `}
 if(win){const v=B.stake*odd;S.din+=v;await nsPop({ic:'🐯',title:'BETTIGER: GREEN! 🟢',txt:`${txt}Você ganhou ${money(v)}.`})}else await nsPop({ic:'🐯',title:'BETTIGER: red 🔴',txt:`${txt}Perdeu ${money(B.stake)}.`})}
// odds e aposta direto no pré-jogo
{const _hy=nsgoHype;nsgoHype=async function(o,M){const p=_hy.apply(this,arguments);try{setTimeout(()=>{const h=document.querySelector('.nsgo-host .nsgo-card');if(!h||!o||!o.us||!o.them)return;const od=nsOdds(o.us,o.them,o.home!==false&&!o.neutral);
  const b=document.createElement('div');b.className='nsgo-bet';b.innerHTML=`<span>🐯 BETTIGER</span><em>${esc(o.us.n||'')} ${od[0].toFixed(2)} · Empate ${od[1].toFixed(2)} · ${esc(o.them.n||'')} ${od[2].toFixed(2)}</em><button class="btn small" id="betGo">Apostar na rodada</button>`;
  const go=h.querySelector('.nsgo-go');if(go)h.insertBefore(b,go);const bg=b.querySelector('#betGo');if(bg)bg.onclick=async()=>{bg.disabled=true;await nsBetPanel(o);if(S.n.bet)bg.textContent='✓ Aposta feita'}},60)}catch(e){}return p}}
// BETTIGER e Fofocagram nas manchetes da home
{const _hdB=nsgoHeads;nsgoHeads=function(){const H=_hdB();try{const nm=nextMatchInfo();if(nm&&nm.opp&&CLUB[nm.opp]&&S.age>=18){const od=nsOdds(club(),CLUB[nm.opp],nm.home);H.splice(1,0,{ic:'🐯',l:'BETTIGER',b:`${club().a||club().n} ${od[0].toFixed(2)} · ${CLUB[nm.opp].a||CLUB[nm.opp].n} ${od[2].toFixed(2)}`,e:'odds',hot:1,go:'bet'})}
 const g=nsGossip()[0];if(g)H.splice(2,0,{ic:'📱',l:'Fofocagram',b:String(g.title).replace(/^🚨\s*/,'').slice(0,60),e:'',go:'fofo'})}catch(e){}return H.slice(0,8)}}
{const _goB=nsgoGo;nsgoGo=function(k){if(k==='bet'){try{if(typeof nsCasinoPage==='function')return nsOpen(nsCasinoPage())}catch(e){}}if(k==='fofo')return nsNews();return _goB(k)}}
// promo do BETTIGER de vez em quando ao abrir a home
{const _rnB=nsRenderHub;nsRenderHub=function(){const r=_rnB.apply(this,arguments);try{const n=S.n;if(n&&S.age>=18&&!BUSY&&n.week&&n.betPromo!==n.week&&n.week%4===2&&document.getElementById('overlay').hidden){n.betPromo=n.week;setTimeout(()=>toast({ic:'🐯',title:'BETTIGER: bônus de 50% hoje',txt:'Toque em Vida → Mais da vida → BETTIGER. Aposte com moderação.',ms:3200}),900)}}catch(e){}return r}}
{const st=document.createElement('style');st.textContent=`
.nsl-flow{background:#0b2116;border:1px solid #2a5a40;border-radius:12px;padding:6px 8px 4px;margin:6px 0}
.nsl-flow .hd{display:flex;justify-content:space-between;align-items:center;font:800 12px var(--f-body);margin-bottom:3px}.nsl-flow .hd span{display:flex;gap:6px;align-items:center;color:#9fbfac;font-weight:700;min-width:0;overflow:hidden;white-space:nowrap}
.nsl-flow .hd i{width:9px;height:9px;border-radius:2px;display:inline-block}.nsl-flow .hd i.u{background:#3ddc84}.nsl-flow .hd i.t{background:#4c6ef5;margin-left:6px}
.nsl-flow svg{display:block;width:100%;height:64px;border-radius:6px}
.nsfo-post{border-radius:16px;overflow:hidden;background:#0b2116;border:1px solid #ff2bd655;text-align:left}.nsfo-post .hd{display:flex;gap:8px;align-items:center;padding:8px 10px}.nsfo-post .hd .av{width:34px;height:34px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:#ff2bd6}.nsfo-post .hd .av>*{width:100%;height:100%}.nsfo-post .hd small{margin-left:auto;color:#9fbfac}
.nsfo-post .md{position:relative;aspect-ratio:16/9;overflow:hidden;background:linear-gradient(135deg,#3a1240,#12301f);display:grid;place-items:center}.nsfo-post .md>*:not(.st){max-height:100%}.nsfo-post .md .st{position:absolute;right:10px;top:8px;font-size:44px}
.nsfo-post .ft{padding:8px 12px 10px;display:grid;gap:4px}.nsfo-post .ft p{margin:0;font:700 16px/1.35 var(--f-body)}.nsfo-post .cm{font:600 14px var(--f-body);color:#cfe0d5}.nsfo-post .cm b{color:#fff;margin-right:4px}
.nsfo-rep{display:grid;gap:8px;margin-top:10px}.nsfo-rep small{font:800 13px var(--f-body);color:#ffd84a;text-transform:uppercase;letter-spacing:.06em}
.nsgo-bet{display:grid;gap:6px;justify-items:center;margin-top:10px;padding:10px;border-radius:14px;background:linear-gradient(90deg,#3a2a00,#1a1405);border:1px solid #f2c443}.nsgo-bet span{font:900 14px var(--f-body);color:#f2c443;letter-spacing:.08em}.nsgo-bet em{font:800 14px var(--f-mono);font-style:normal}
`;document.head.appendChild(st)}
{const st=document.createElement('style');st.textContent=`
.nslive.sofa{background:#edf1f6;color:#222226;gap:0;padding:0 0 calc(6px + env(safe-area-inset-bottom,0px));font-family:var(--f-body)}
.sofa .ss-hd{background:linear-gradient(120deg,color-mix(in srgb,var(--hc) 38%,#17181c) 0%,#17181c 45%,#17181c 55%,color-mix(in srgb,var(--ac) 30%,#17181c) 100%);color:#fff;padding:calc(8px + env(safe-area-inset-top,0px)) 12px 0}
.sofa .ss-top{display:flex;align-items:center;gap:8px}.sofa .ss-top .nspc{flex:1;min-width:0;font:700 13px var(--f-body);color:#c7c9d1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sofa .spd{display:flex;gap:4px}.sofa .spd button{border:1px solid #ffffff33;background:#ffffff14;color:#fff;border-radius:999px;padding:4px 10px;font:800 12px var(--f-body)}.sofa .spd button.on{background:#fff;color:#17181c}
.sofa .ss-sc{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;margin:8px 0 2px}
.sofa .ss-sc .tm{display:grid;justify-items:center;gap:6px;min-width:0}.sofa .ss-sc .tm .shield{transform:scale(1.35);margin:6px 0}.sofa .ss-sc .tm b{font:800 15px var(--f-body);max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sofa .ssflag{font-size:40px;line-height:1}
.sofa .ss-sc .mid{display:grid;justify-items:center;gap:2px}.sofa .ss-sc .sc{display:flex;align-items:center;gap:10px}.sofa .ss-sc .sc b{font:900 42px/1 var(--f-body)}.sofa .ss-sc .sc i{font:700 30px var(--f-body);color:#8a8d96;font-style:normal}
.sofa .ss-sc .st{font:700 15px var(--f-body);color:#d9dbe2}.sofa .ss-sc .st.live{color:#ff5c5c}
.sofa .ss-scr{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;font:600 12.5px/1.35 var(--f-body);color:#b9bcc6;min-height:4px}.sofa .ss-scr .h{text-align:right}.sofa .ss-scr i{font-style:normal}
.sofa .nsl-agg{color:#c7c9d1;margin-top:2px}.sofa .nsl-time{height:3px;background:#ffffff22;margin:8px -12px 0;border-radius:0}.sofa .nsl-time i{background:#ff5c5c}
.sofa .ss-tabs{display:flex;gap:4px;overflow-x:auto;margin:0 -12px;padding:0 6px;scrollbar-width:none}.sofa .ss-tabs::-webkit-scrollbar{display:none}
.sofa .ss-tabs button{flex:none;background:none;border:0;color:#a9acb6;font:700 15px var(--f-body);padding:11px 12px 10px;border-bottom:3px solid transparent}.sofa .ss-tabs button.on{color:#fff;border-bottom-color:#fff}
.sofa .ss-body{flex:1;min-height:0;overflow-y:auto;padding:10px 10px 6px;display:block}
.sofa .ss-pane{display:none;gap:10px}.sofa .ss-body[data-tab="det"] [data-pane="det"],.sofa .ss-body[data-tab="com"] [data-pane="com"],.sofa .ss-body[data-tab="est"] [data-pane="est"],.sofa .ss-body[data-tab="esc"] [data-pane="esc"]{display:grid}
.sofa .ss-card{background:#fff;border-radius:16px;padding:12px 14px;box-shadow:0 1px 2px rgba(20,30,60,.06);color:#222226}
.sofa .ss-card h4{margin:0 0 8px;text-align:center;font:800 17px var(--f-body);color:#222226;display:flex;justify-content:center;align-items:center;gap:6px}.sofa .ss-card h4 .dot{width:8px;height:8px;border-radius:50%;background:#ff5c5c;animation:nsgoLive 1.4s infinite}
.sofa .ss-comp{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:12px 16px}.sofa .ss-comp b{font:600 14.5px var(--f-body)}.sofa .ss-comp em{font-style:normal;color:#374df5;font-size:20px}
.sofa .ss-mut{margin:0;color:#8a8f98;font:600 14px var(--f-body);text-align:center}
.sofa .nsl-flow{background:none;border:0;padding:0;margin:0}.sofa .fl-wrap{display:grid;grid-template-columns:30px 1fr;gap:6px;align-items:center}.sofa .fl-cr{display:grid;gap:18px;justify-items:center}
.sofa .fl-cr .cr{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font:900 8px var(--f-body);font-style:normal;box-shadow:0 0 0 1.5px #fff,0 0 0 2.5px #dfe3ea}
.sofa .nsl-flow svg{display:block;width:100%;height:96px;border-radius:0}
.sofa .ss-livec .lv{display:grid;grid-template-columns:40px 1fr;gap:6px;align-items:start;padding:7px 0;border-top:1px solid #eef0f4;font:600 14.5px/1.35 var(--f-body)}.sofa .ss-livec .lv:first-child{border-top:0}.sofa .ss-livec .lv>b{font:800 13px var(--f-body);color:#8a8f98}.sofa .ss-livec .lv.me span{color:#b07a00}.sofa .ss-livec .lv span b{font-weight:800}
.sofa .ev-ft{display:flex;align-items:center;gap:10px;margin:0 0 6px;color:#222226;font:800 14px var(--f-body)}.sofa .ev-ft::before,.sofa .ev-ft::after{content:'';flex:1;height:1px;background:#dfe3ea}
.sofa .ev{display:flex;align-items:center;gap:10px;padding:9px 2px;font:600 15px var(--f-body)}.sofa .ev.r{flex-direction:row-reverse;text-align:right}
.sofa .ev .mn{font:800 14px var(--f-body);min-width:30px}.sofa .ev .ic{font-size:18px;display:grid;place-items:center;min-width:22px}
.sofa .ev .rp{border:2px solid #374df5;background:#fff;color:#222226;border-radius:999px;padding:3px 12px;font:900 18px var(--f-body);white-space:nowrap}.sofa .ev .rp::first-letter{color:#374df5}
.sofa .ev .nm b{font-weight:700}.sofa .ev .nm em{font-style:normal;color:#8a8f98;font-weight:600}.sofa .ev .nm em.g{color:#21a95a}.sofa .ev .nm em.r{color:#e0412f}
.sofa .cd{display:inline-block;width:11px;height:15px;border-radius:2px}.sofa .cd.y{background:#f2c94c}.sofa .cd.r{background:#e0412f}.sofa .sb{font-weight:900}.sofa .sb.in{color:#21a95a}.sofa .sb.out{color:#e0412f}
.sofa .nsl-feed{flex:none;overflow:visible;display:grid;gap:8px;justify-content:stretch;background:none!important}
.sofa .nfr{display:grid;grid-template-columns:38px 1fr;gap:6px;align-items:start;background:none;color:#222226;padding:0;border-radius:0;font:600 15px/1.4 var(--f-body);box-shadow:none!important;filter:none!important}
.sofa .nfr>b{font:700 13px var(--f-body);color:#8a8f98;padding-top:12px;opacity:1}
.sofa .nfr>span{text-align:left;background:#fff;border-radius:14px;padding:11px 14px;box-shadow:0 1px 2px rgba(20,30,60,.06);display:block}
.sofa .nfr.nme>span{box-shadow:inset 4px 0 0 #f2b705,0 1px 2px rgba(20,30,60,.06)}.sofa .nfr.nbad>span{color:#5a5e66}.sofa .nfr.ngl>span{font-size:15.5px}.sofa .nfr .gtl{display:block;font:900 20px var(--f-body);margin-bottom:2px}
.sofa .nfr.nht>span{background:#e3e7ee;color:#4a4f58;text-align:center;font-weight:800}.sofa .nfr.ndim{opacity:.5}
.sofa .nfr .gp{display:block;width:100%;max-width:230px;margin:8px auto 2px}.sofa .ss-scr{max-height:58px;overflow:hidden}
.sofa .nsl-feed.off{background:none}
.sofa .nsl-off{background:#fff;color:#4a4f58;border:1.5px dashed #c5cad3;margin:0 auto 10px;display:table}
.sofa .sp{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;margin-bottom:6px}.sofa .sp b{text-align:center;font:700 15px var(--f-body)}.sofa .sp span{font:800 14px var(--f-body);color:#fff;border-radius:999px;padding:3px 10px}.sofa .sp .h{background:#21a95a}.sofa .sp .a{background:#374df5}
.sofa .spb{height:12px;border-radius:999px;background:#374df5;overflow:hidden;margin-bottom:12px}.sofa .spb i{display:block;height:100%;background:#21a95a}
.sofa .sr{padding:9px 0}.sofa .sr .v{display:grid;grid-template-columns:70px 1fr 70px;align-items:center}.sofa .sr .v b{font:700 16px var(--f-body)}.sofa .sr .v b:last-child{text-align:right}.sofa .sr .v span{text-align:center;font:600 15px var(--f-body)}
.sofa .sr .br{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:6px}.sofa .sr .br i{height:7px;border-radius:999px;background:#eef0f4;display:flex;overflow:hidden}.sofa .sr .br i.h{justify-content:flex-end}.sofa .sr .br u{display:block;height:100%;text-decoration:none;border-radius:999px}
.sofa .sr .br i.h u{background:#b9e3c3}.sofa .sr .br i.a u{background:#c5ccf9}.sofa .sr .br i.h.on u{background:#21a95a}.sofa .sr .br i.a.on u{background:#374df5}
.sofa .ln-hd{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;margin-bottom:8px}.sofa .ln-hd b{font:800 17px var(--f-body)}.sofa .ln-hd em{font-style:normal;font:800 14px var(--f-body);color:#8a8f98}
.sofa .rt{display:inline-block;color:#fff;font:800 13px var(--f-body);padding:1px 6px;border-radius:4px}
.sofa .ln-pitch{background:#4e8c64;border-radius:12px;padding:14px 6px;display:grid;gap:16px;background-image:linear-gradient(#ffffff22 2px,transparent 2px);background-size:100% 50%;background-position:0 50%}
.sofa .ln-row{display:flex;justify-content:space-around}.sofa .pl{display:grid;justify-items:center;gap:2px;min-width:0;width:25%}.sofa .pl .av{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font:900 14px var(--f-body);font-style:normal;box-shadow:0 0 0 2px #fff}
.sofa .pl .rt{margin-top:-8px;position:relative}.sofa .pl small{font:700 12px var(--f-body);color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.sofa .pl.me .av{box-shadow:0 0 0 3px #f2b705}.sofa .pl.me small{color:#ffe27a}
.sofa .nsl-msg{position:absolute;left:50%;top:42%;transform:translateX(-50%);pointer-events:none;z-index:5;white-space:nowrap;max-width:92%;overflow:hidden;text-overflow:ellipsis}
.sofa .nsl-msg:empty{display:none}
.sofa #nlEnd{padding:0 10px}.sofa #nlEnd:empty{display:none}
.sofa .nsl-ht,.sofa .nsl-fin{background:#fff;color:#222226;border:0;box-shadow:0 2px 10px rgba(20,30,60,.12)}.sofa .nsl-ht span,.sofa .nsl-fin span{color:#4a4f58}
.sofa .nsl-ctl{margin:6px 10px 0}.sofa .nsl-eff,.sofa .nsl-foc{background:#fff;border:0;box-shadow:0 1px 2px rgba(20,30,60,.06)}.sofa .nsl-eff small,.sofa .nsl-foc small{color:#6a6f78}
.sofa .nsl-eff button,.sofa .nsl-foc button{background:#f3f5f9;border:1px solid #dfe3ea;color:#222226}.sofa .nsl-foc button.on{background:#374df5;border-color:#374df5}
.sofa .nsl-en{margin:6px 12px 0;color:#4a4f58}.nslive.sofa{position:relative}
.sofa .nsl-msg{background:#17181cee;color:#ffd84a;border-radius:999px;padding:8px 16px;font:800 15px var(--f-body);min-height:0;top:auto;bottom:150px;opacity:0}.sofa .nsl-msg.pop{animation:sofaMsg 2.8s ease forwards}@keyframes sofaMsg{0%{opacity:0;transform:translate(-50%,10px)}10%,78%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
.sofa .nsl-en b{color:#222226}.sofa .nsl-feed{display:flex!important;flex-direction:column-reverse;gap:8px}
`;document.head.appendChild(st)}
