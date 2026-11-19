// ================== NÚCLEO NSS (o jogo inteiro gira em volta do seu jogador) ==================
// Cinco habilidades que você treina (Velocidade, Força, Técnica, Visão, Bola parada): treinar sobe, ficar sem treinar desce.
// O OVR sai delas. Energia gasta no treino e no jogo e volta com descanso, treinador, imóveis e energético.
// Nível de estrela, relacionamentos (treinador, equipe, fãs, namorada, patrocinador), felicidade e estilo de vida.
// Dinheiro toda semana: salário, bônus por gol e por assistência, patrocinador e o que o agente arranca a mais.
// A tela principal vira Status/Estats com Liga · Habilidade · Vida · Jogar.
const NSK=[['vel','Velocidade','⚡'],['for','Força','💪'],['tec','Técnica','🎯'],['vis','Visão','👁️'],['bp','Bola parada','🧱']];
const NSK_D={vel:'Arrancada, corrida e recuperação. Pesa muito em ponta, lateral e atacante.',for:'Corpo, dividida, cabeceio e chute forte. Pesa em zagueiro, volante e centroavante.',tec:'Domínio, drible e finalização.',vis:'Passe, leitura de jogo e posicionamento. No gol, também é reflexo.',bp:'Faltas, pênaltis e escanteios. Ajuda um pouco na finalização.'};
const NS_REL=[['coach','Treinador','🪑'],['team','Equipe','👕'],['fans','Fãs','🧣'],['gf','Namorada','🌹'],['spon','Patrocinador','🤝']];
function nsAttrsOf(s,raw){const v=s.vel,f=s.for,t=s.tec,i=s.vis,b=s.bp;const r=raw?(x=>x):(x=>clamp(Math.round(x),1,99));
 return{VEL:r(v),FIS:r(f),DRI:r(t),PAS:r(i*.65+t*.35),FIN:r(t*.55+f*.25+b*.2),DEF:r(f*.45+i*.35+v*.2),MEN:r(i*.75+t*.25),REF:r(v*.45+i*.55)}}
function nsLv(extra){const n=S.n,o={};for(const[k]of NSK)o[k]=n.sk[k].l+((extra&&extra[k])||0);return o}
function nsOn(){return!!(S&&S.n&&S.n.on)}
const nsK=v=>money((v||0)/1000);// valores em mil € (salário, bônus) para o texto
function nsEnsure(){
 if(!S)return null;if(S.n&&S.n.v>=1)return S.n;
 let C;try{C=CA()}catch(e){C={...S.attrs}}
 const sk={vel:C.VEL,for:C.FIS,tec:(C.DRI*2+C.FIN)/3,vis:(C.PAS+C.MEN)/2,bp:(C.FIN+C.PAS)/2};
 if(S.pos==='GOL'){sk.vel=(C.REF+C.VEL)/2;sk.vis=(C.REF*2+C.MEN)/3}
 for(const k in sk)sk[k]=clamp(Math.round(sk[k]),10,99);
 for(let it=0;it<6;it++){const g=S.ovr-fit(nsAttrsOf(sk),S.pos);if(!g)break;for(const k in sk)sk[k]=clamp(sk[k]+Math.sign(g)*Math.max(1,Math.abs(g)),10,99)}
 const fama=(S.life&&S.life.fama)||5;
 const n={v:1,on:true,sk:{},cap:{},last:{},week:0,en:100,star:{l:clamp(1+Math.round(fama/7),1,15),p:0},
  rel:{coach:Math.round(S.coach??55),team:55,fans:clamp(Math.round(20+fama*.6),10,95),gf:S.gf?Math.round(S.gf.v||60):0,spon:0},
  happy:Math.round((S.life&&S.life.cab)||60),ls:0,dr:{a:2,b:0,c:0,d:0,e:0},ach:{},items:[],veh:[],horses:[],wk:null,eff:3,foc:0,
  ss:{ap:0,g:0,a:0,ht:0,ps:0,ch:0,motm:0},cs:{ap:0,g:0,a:0,ht:0,ps:0,ch:0,motm:0},is:{ap:0,g:0,a:0,ht:0,ps:0,ch:0,motm:0},hist:{},ct:null,spon:null,auto:'off',pos:S.pos,ovr:null,y0:S.year};
 const gap=Math.max(4,(S.pot||S.ovr)-S.ovr);
 for(const[k]of NSK){n.sk[k]={l:sk[k],p:RI(0,50)};n.cap[k]=clamp(sk[k]+gap+RI(0,5),25,99);n.last[k]=0}
 // carreira antiga: os números que já existem entram nas estatísticas
 try{for(const h of S.history||[]){n.cs.ap+=h.games||0;n.cs.g+=h.goals||0;n.cs.a+=h.assists||0}n.is.ap=S.caps||0;n.is.g=S.natGoals||0}catch(e){}
 // imóveis antigos continuam seus
 S.n=n;
 try{const map={carro:['veh','esportivo'],iate:['veh','iate'],relogio:['items','relogio'],grife:['items','grife'],game:['items','console']};for(const id of S.owned||[]){const m=map[id];if(m&&!n[m[0]].includes(m[1]))n[m[0]].push(m[1])}nsLsCalc()}catch(e){}
 if(S.boot){S.boot=null;S.bootLeft=0}
 if(!S.liveMode||S.liveMode==='decisivos')S.liveMode='all';
 if(!S.matchMode||S.matchMode==='sess')S.matchMode='old';
 nsSync();return n;
}
// distribui uma mudança de OVR que veio de outro lugar (evento, prêmio…) nas habilidades que mais pesam na posição
function nsFitR(lv){const A=nsAttrsOf(lv,true);const w=POS[S.pos].w;let s=0;for(const k in w)s+=w[k]*(A[k]||0);return s}
function nsDistribute(d){const n=S.n;const target=n.ovr+d;const sg=Math.sign(d);
 for(let g=0;g<60;g++){const cur=fit(nsAttrsOf(nsLv()),S.pos);if(sg>0?cur>=target:cur<=target)break;
  let best=null,bv=-1;const base=nsFitR(nsLv());
  for(const[k]of NSK){const l=n.sk[k].l;if((sg>0&&l>=99)||(sg<0&&l<=10))continue;const lv=nsLv();lv[k]+=sg;const gain=Math.abs(nsFitR(lv)-base)+Math.random()*.001;if(gain>bv){bv=gain;best=k}}
  if(!best)break;n.sk[best].l+=sg}
}
function nsSync(){const n=S&&S.n;if(!n)return;
 if(n.ovr!=null&&S.ovr!==n.ovr&&n.pos===S.pos){const d=clamp(S.ovr-n.ovr,-3,3);if(d)nsDistribute(d)}
 n.pos=S.pos;S.attrs=nsAttrsOf(nsLv());S.ovr=clamp(fit(S.attrs,S.pos),30,99);n.ovr=S.ovr;
 if(S.ovr>(S.peak||0)){S.peak=S.ovr;S.peakAge=S.age}if((S.pot||0)<S.ovr)S.pot=S.ovr;
 S.coach=n.rel.coach;if(S.gf){S.gf.v=n.rel.gf}else n.rel.gf=0;
 if(S.life){S.life.cab=clamp(Math.round(n.happy),0,100)}
 nsCt();
}
// ---------- treino ----------
function nsTrainCost(){const n=S.n;return clamp(Math.round(11-(n.rel.coach-50)/25),7,14)}
function nsAgeF(){const a=S.age;return a<=18?1.35:a<=21?1.2:a<=24?1:a<=27?.8:a<=30?.55:a<=33?.35:.2}
function nsGain(k,mul=1){const n=S.n;const s=n.sk[k];
 const capF=clamp((n.cap[k]-s.l)/10+.15,.1,1.3),lvlF=clamp(1.25-(s.l-50)/100,.6,1.4),coachF=.85+n.rel.coach/333;
 return clamp(Math.round(10*nsAgeF()*capF*lvlF*coachF*mul*R(.85,1.15)),1,60)}
function nsAddP(k,g,chips){const n=S.n;const s=n.sk[k];s.p+=g;let up=0;while(s.p>=100&&s.l<99){s.p-=100;s.l++;up++}if(s.l>=99)s.p=Math.min(s.p,99);
 if(up){const before=S.ovr;nsSync();const nm=NSK.find(x=>x[0]===k)[1];if(chips)chips.push([`${nm} ${s.l}`,'up']);try{toast({ic:'📈',title:`${nm} subiu para ${s.l}!`,txt:S.ovr>before?`OVR ${before} → ${S.ovr}`:'Continue treinando.',ms:2200,group:'nsup'})}catch(e){}try{nsAchCheck()}catch(e){}}
 return up}
function nsTrain(k,opt={}){const n=nsEnsure();const cost=opt.cost??nsTrainCost();
 if(n.en<cost+(opt.min||0))return{ok:false,txt:`Energia baixa (${Math.round(n.en)}%). Descanse, jogue ou tome um energético.`};
 n.en=clamp(n.en-cost,0,100);const g=nsGain(k,opt.mul||1);const up=nsAddP(k,g);n.last[k]=n.week;n.trainW=(n.trainW||0)+1;n.trainT=(n.trainT||0)+1;
 if(n.rel.coach<100&&ch(.35))n.rel.coach=clamp(n.rel.coach+1,0,100);
 return{ok:true,g,up,cost}}
// ---------- nível de estrela ----------
const nsStarNeed=l=>100;
function nsStarAdd(x){const n=S.n;if(!n||!x)return 0;const st=n.star;const k=1/(1+(st.l-1)*.3);st.p+=x*k;let up=0;
 while(st.p>=nsStarNeed(st.l)){st.p-=nsStarNeed(st.l);st.l++;up++;S.life.fama=clamp(S.life.fama+3,0,100)}
 if(st.p<0)st.p=0;if(up){try{toast({ic:'⭐',title:`Nível de estrela ${st.l}!`,txt:'Mais fãs, patrocínio melhor e clubes de olho.',ms:2600})}catch(e){}}return up}
// ---------- contrato: salário, bônus por gol e por assistência ----------
function nsCt(){const n=S.n;if(!n)return null;const w=S.wage||0;
 if(!n.ct||n.ct.wage!==w){const rg=n.ct&&n.ct.rg||.22,ra=n.ct&&n.ct.ra||.13;n.ct={wage:w,rg,ra,gb:Math.max(w>0?1:0,Math.round(w*rg)),ab:Math.max(w>0?1:0,Math.round(w*ra))}}
 return n.ct}
const NS_AGENT={tubarao:.12,normal:.07,pai:.03};
function nsAgentPct(){return NS_AGENT[S.agent]??.06}
// ---------- semana: dinheiro, energia, decadência, relacionamentos ----------
function nsMatchItems(){const st=S.st;if(!st)return 40;if(!st.nsN){st.nsN=Math.max(30,st.cal.filter(it=>it.k!=='ev'&&it.k!=='debut').length)}return st.nsN}
function nsWeek(info={}){const n=nsEnsure();if(!n)return null;const st=S.st;n.week++;st.nsWk=(st.nsWk||0)+1;
 const f=52/nsMatchItems();const net=.5;const ag=nsAgentPct();const ct=nsCt();
 const sal=(S.wage||0)*f*net,gb=(info.g||0)*ct.gb*net,ab=(info.a||0)*ct.ab*net,sp=n.spon?n.spon.w*f*net:0;
 const rows={sal:[sal,sal*ag],g:[gb,gb*ag],a:[ab,ab*ag],sp:[sp,sp*ag],gN:info.g||0,aN:info.a||0};
 let tot=0;for(const k of['sal','g','a','sp'])tot+=rows[k][0]+rows[k][1];
 let rent=0;try{rent=rentWeek()*f}catch(e){}
 tot+=rent*1000;S.din+=tot/1000;st.paid=(st.paid||0)+sal/1000;
 // energia: 6 dias de descanso + treinador + imóveis
 const base=51,coach=Math.round(n.rel.coach/100*30),props=nsPropEn();const en0=n.en;n.en=clamp(n.en+base+coach+props,0,100);
 // habilidades sem treino caem
 const drops=[];const P=POS[S.pos];const old=S.age>P.peak+1?(S.age-P.peak-1):0;
 for(const[k,nm]of NSK){const s=n.sk[k];const idle=n.week-(n.last[k]||0);let d=0;
  if(idle>=2)d+=(2+old)*(idle>=6?1.5:1);if(old)d+=old*.5;
  if(d>0){s.p-=Math.round(d);while(s.p<0&&s.l>10){s.l--;s.p+=100;drops.push(nm)}if(s.p<0)s.p=0}}
 // relacionamentos esfriam aos poucos
 const R0={...n.rel};n.rel.coach=clamp(n.rel.coach-1.2+(n.trainW>=2?1:0),0,100);n.rel.team=clamp(n.rel.team-.9,0,100);n.rel.fans=clamp(n.rel.fans-(n.star.l>=10?.6:1.1),0,100);
 if(S.gf)n.rel.gf=clamp(n.rel.gf-(S.rel==='casado'?1:1.6),0,100);
 if(n.spon){n.rel.spon=clamp(n.rel.spon-1,0,100);if(n.rel.spon<12){(st.lifeNews=st.lifeNews||[]).push(`A ${n.spon.n} encerrou o patrocínio. Faltou aparecer.`);n.spon=null;n.rel.spon=0}}
 // estilo de vida e felicidade
 nsLsCalc();const tgt=32+(S.gf?n.rel.gf*.16:4)+n.ls*.22+n.rel.team*.1+n.rel.fans*.06+(S.din<0?-15:0)+(n.en<25?-6:0)+(info.res==='V'?6:info.res==='D'?-5:0);
 n.happy=clamp(n.happy+(tgt-n.happy)*.25,0,100);
 n.trainW=0;
 // treino automático (opcional)
 let autoN=0;if(n.auto&&n.auto!=='off'){const keep=65;let guard=0;while(n.en-nsTrainCost()>=keep&&guard++<6){const k=n.auto==='eq'?nsWeakest():n.auto;const r=nsTrain(k,{mul:.85});if(!r.ok)break;autoN++}}
 nsSync();
 n.wk={rows,tot,rent:rent*1000,en0,base,coach,props,en:n.en,drops,autoN,wk:st.nsWk,y:S.year,res:info.res||null,did:!!info.played};
 return n.wk}
function nsWeakest(){const n=S.n;const w=POS[S.pos].w;let best=null,bv=-1e9;for(const[k]of NSK){const lv=nsLv();lv[k]++;const g=fit(nsAttrsOf(lv),S.pos)-fit(nsAttrsOf(nsLv()),S.pos)+(n.cap[k]-n.sk[k].l)/40-(n.week-(n.last[k]||0)>=2?-.5:0);if(g>bv){bv=g;best=k}}return best||'tec'}
function nsPropEn(){let s=0;try{for(const id of S.props||[]){const p=NS_PROPS.find(x=>x.id===id);if(p)s+=p.en||0}}catch(e){}return Math.min(30,s)}
function nsLsCalc(){const n=S.n;let s=0;try{for(const id of n.items)s+=(NS_ITEMS.find(x=>x.id===id)||{}).ls||0;for(const id of n.veh)s+=(NS_VEH.find(x=>x.id===id)||{}).ls||0;for(const id of S.props||[])s+=(NS_PROPS.find(x=>x.id===id)||{}).ls||0}catch(e){}n.ls=clamp(Math.round(s),0,100);return n.ls}
// o XP/árvore antiga sai de cena: quem manda agora é treino + nível de estrela
{if(typeof rpgGain==='function'){const _rg=rpgGain;rpgGain=function(...a){if(nsOn())return;return _rg.apply(this,a)}}}
// ---------- desempenho em campo: energia, equipe, felicidade e chuteira ----------
function nsBootStats(){try{const n=S.n;if(!n||!n.boot||n.bootLeft<=0)return null;return NS_BOOTS.find(b=>b.id===n.boot)||null}catch(e){return null}}
function nsEffLv(){const b=nsBootStats();const lv=nsLv(b?{vel:b.vel,for:b.for,tec:b.tec}:null);const n=S.n;const e=n.en;const k=e>=50?1:e>=25?.97-(50-e)*.002:.92-(25-e)*.004;for(const x in lv)lv[x]=lv[x]*k;return lv}
function nsPerfMod(){const n=S.n;let m=fit(nsAttrsOf(nsEffLv()),S.pos)-S.ovr;m+=(n.rel.team-50)/30+(n.happy-55)/45;return m}
{const _bp=typeof bootPerf==='function'?bootPerf:()=>0;bootPerf=function(){return nsOn()?nsPerfMod()/.8:_bp()}}
{const _ea=typeof effAttrs==='function'?effAttrs:()=>CA();effAttrs=function(){return nsOn()?nsAttrsOf(nsEffLv()):_ea()}}
// treinador gosta de você: mais chance de ser titular
{const _part=participation;participation=function(kind,o){const p=_part(kind,o);try{if(nsOn()&&kind==='club'&&!(S.youth&&!(o&&(o.youthS||o.debut)))){const c=S.n.rel.coach;
  if(!p.play&&p.why==='banco'&&c>=65&&ch((c-60)/90))return{play:true,start:ch(.5),min:RI(30,90),role:p.role};
  if(p.play&&p.start&&c<25&&ch((30-c)/80))return{play:true,start:false,min:RI(10,30),role:p.role};
  if(p.play&&!p.start&&c>=80&&ch(.25))return{...p,start:true,min:90}}}catch(e){}return p}}
// ---------- fim de temporada: OVR não cresce sozinho, idade pesa nas habilidades ----------
{const _es=endSeason;endSeason=function(...a){if(!nsOn())return _es.apply(this,a);const n=S.n;nsSync();const pre=S.ovr,pk=S.peak,pka=S.peakAge;
  const r=_es.apply(this,a);
  try{const P=POS[S.pos];const old=S.age-P.peak;if(old>=3){for(const[k]of NSK){const loss=Math.round(clamp((old-2)*R(.4,.9),0,3));n.sk[k].l=clamp(n.sk[k].l-loss,10,99)}}
   const y=r&&r.row?r.row.year:S.year-1;n.hist[y]={motm:n.ss.motm,ht:n.ss.ht,ps:n.ss.ps,ch:n.ss.ch};
   const tt=(r&&r.titles||[]).length,aw=(r&&r.awards||[]).length;nsStarAdd(tt*35+aw*50);
   n.ovr=pre;S.ovr=pre;S.peak=pk;S.peakAge=pka;nsSync();if(r&&r.row){r.row.delta=S.ovr-r.row.ovr}}catch(e){console.error(e)}
  return r}}
{const _lse=typeof lifeSeasonEnd==='function'?lifeSeasonEnd:null;lifeSeasonEnd=function(){if(!nsOn())return _lse&&_lse();ensureLife();S.perks={}}}
{const _pw=typeof payWeek==='function'?payWeek:null;payWeek=function(nr){if(nsOn())return;return _pw&&_pw(nr)}}
{const _bs=buildSeason;buildSeason=function(...a){const r=_bs.apply(this,a);try{if(S.n){S.n.ss={ap:0,g:0,a:0,ht:0,ps:0,ch:0,motm:0};S.st.nsWk=0}}catch(e){}return r}}
// cada jogo é uma semana: paga, recupera energia e anota a rodada (placar de todo mundo e posições)
{const _pi=processItem;processItem=async function(it,io){if(!nsOn())return _pi(it,io);nsEnsure();const st=S.st;let snap=null;
  if(it.k==='lg'){snap={};const T=sortTable(st.table);T.forEach((x,i)=>snap[x.id]={gp:x.gp,gc:x.gc,pos:i+1})}
  NSSM.items=[];const r=await _pi(it,io);
  try{if(snap&&st.rounds[it.r]){const list=st.rounds[it.r].map(([h,a])=>{const H=st.table[h],b=snap[h];return H&&b?[h,a,H.gp-b.gp,H.gc-b.gc]:null}).filter(Boolean);const T=sortTable(st.table);const pos={};T.forEach((x,i)=>pos[x.id]=i+1);st.nsRound={r:it.r,list,pos,prev:Object.fromEntries(Object.entries(snap).map(([k,v])=>[k,v.pos]))}}}catch(e){}
  const isWeek=r&&(r.k==='match'||r.k==='multi'||r.k==='bye');
  if(isWeek){let g=0,a=0,played=false,res=null;for(const m of NSSM.items){if(m.me&&m.me.play){g+=m.me.g||0;a+=m.me.a||0;played=true}}
   const L=r.k==='multi'?r.list:[r];const mm=L.find(x=>x&&x.k==='match');if(mm)res=mm.wdl;
   nsWeek({g,a,played,res})}
  return r}}
// contrato novo: dá pra negociar salário e bônus como no NSS
{const _ao=acceptOffer;acceptOffer=function(o){const w0=S.wage;const r=_ao.apply(this,arguments);try{if(nsOn()&&o&&!o.loan&&S.wage>0){nsSync();setTimeout(()=>nsNegotiate(o),60)}}catch(e){}return r}}

// ================== TELAS ==================
const NSP={stack:[]};let NS_TAB='status',NS_VIEW=0;
function nsHost(){let h=document.getElementById('nsp');if(!h){h=document.createElement('div');h.id='nsp';h.hidden=true;document.body.appendChild(h)}return h}
function nsOpen(p){NSP.stack=[p];nsDraw()}
function nsPush(p){NSP.stack.push(p);nsDraw()}
function nsBack(){NSP.stack.pop();if(!NSP.stack.length)return nsClose();nsDraw()}
function nsClose(){const h=nsHost();h.hidden=true;h.innerHTML='';NSP.stack=[];document.body.classList.remove('nsp-open');try{saveNow('season')}catch(e){}try{renderHub()}catch(e){console.error(e)}}
function nsRefresh(){if(NSP.stack.length)nsDraw(true)}
function nsBarHTML(v,cls=''){return`<span class="nsmb ${cls}"><i style="width:${clamp(v,0,100)}%"></i></span>`}
function nsTopHTML(){const n=S.n;return`<div class="nst-mini"><span title="Nível de estrela">⭐ ${n.star.l}</span><span title="Energia">❤️ ${Math.round(n.en)}%</span><span class="mono">${money(S.din)}</span></div>`}
function nsDraw(keep){const h=nsHost();const p=NSP.stack[NSP.stack.length-1];if(!p)return;const prev=document.getElementById('nspB');const sc=keep&&prev?prev.scrollTop:0;
 h.hidden=false;document.body.classList.add('nsp-open');
 const nav=(p.nav||[]);
 h.innerHTML=`<div class="nspg ${p.cls||''}"><div class="nsp-h"><button class="nsp-back" id="nspX">‹ ${NSP.stack.length>1?'Voltar':'Início'}</button><b>${esc(p.t)}</b>${nsTopHTML()}</div>
 <div class="nsp-b" id="nspB">${p.html()}</div>
 <nav class="nsp-nav">${[{ic:'⬅️',t:NSP.stack.length>1?'Voltar':'Início',id:'__back'},...nav].map((b,i)=>`<button class="nsnb ${b.on?'on':''}" data-nn="${i}" ${b.dis?'disabled':''}><span>${b.ic}</span><small>${esc(b.t)}</small></button>`).join('')}</nav></div>`;
 document.getElementById('nspX').onclick=()=>NSP.stack.length>1?nsBack():nsClose();
 h.querySelectorAll('[data-nn]').forEach(b=>b.onclick=()=>{const i=+b.dataset.nn;if(i===0)return NSP.stack.length>1?nsBack():nsClose();const it=nav[i-1];if(it&&it.fn)it.fn()});
 const B=document.getElementById('nspB');B.scrollTop=sc;try{if(p.bind)p.bind(B)}catch(e){console.error(e)}}
// popup simples (resultado de ação)
function nsPop(o){return new Promise(res=>{const h=document.createElement('div');h.className='nspop-host';document.body.appendChild(h);const opts=o.opts||[];
 h.innerHTML=`<div class="nspop"><div class="nspop-h">${o.ic?`<span>${o.ic}</span>`:''}<b>${esc(o.title||'')}</b></div>${o.html||''}${o.txt?`<p>${esc(o.txt)}</p>`:''}${(o.chips||[]).length?`<div class="chipsrow">${o.chips.map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div>`:''}
 <div class="nspop-btns">${opts.map(([k,t,cls])=>`<button class="btn ${cls||''}" data-o="${k}">${esc(t)}</button>`).join('')}${o.ok!==false?`<button class="btn ${opts.length?'ghost':''}" data-o="ok">${esc(o.ok||'Ok')}</button>`:''}</div></div>`;
 h.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{h.remove();res(b.dataset.o)});if(o.bind)o.bind(h)})}

// ---------- tela principal ----------
function nsHubWanted(){try{if(S&&S.club&&S.st&&!S.n)nsEnsure();return!!(S&&S.club&&S.st&&nsOn()&&!(typeof inPrison==='function'&&inPrison())&&!S.done)}catch(e){return false}}
function nsStatusRole(){const st=S.st;if(st.injLeft>0)return['🚑',`Lesionado · ${st.injLeft} jogo${st.injLeft>1?'s':''}`,'bad'];if(st.suspLeft>0)return['🟥',`Suspenso · ${st.suspLeft}`,'bad'];
 let role='';try{role=S.youth?'Base':roleFor(S.ovr,club().s,S.age)}catch(e){}const c=S.n.rel.coach;
 return role==='Titular'?['🟢','Titular','good']:role==='Rotação'?['🟡',c>=65?'Rotação (técnico gosta)':'Rotação','']:role==='Base'?['🌱','Base','']:['🟠',c>=65?'Reserva (técnico gosta)':'Reserva','warn']}
function nsFormTxt(){const e=S.n.en;return e>=75?['💪','Em forma','good']:e>=50?['🙂','Bem','']:e>=28?['😮‍💨','Cansado','warn']:['🥵','Exausto','bad']}
function nsSeasonNo(){return S.year-(S.n.y0||S.year)+1}
function nsTicker(){const nm=typeof nextMatchInfo==='function'?nextMatchInfo():null;const me=club();
 if(S.st.done)return'Temporada encerrada · hora do balanço';if(!nm)return'Sem jogo marcado';const o=nm.opp&&CLUB[nm.opp];
 return`Próximo jogo · ${nm.home===false&&o?esc(o.a||mkAbbr(o.n))+' × '+esc(me.a||mkAbbr(me.n)):esc(me.a||mkAbbr(me.n))+(o?' × '+esc(o.a||mkAbbr(o.n)):'')} · ${esc(nm.comp)}${nm.label?' · '+esc(nm.label):''}`}
function nsStatsRows(){const n=S.n;const st=S.st;let nn=0,ns=0;for(const v of Object.values(st.stats||{})){if(v&&v.nn){nn+=v.nn;ns+=v.ns}}
 const L=[['Jogos','ap'],['Gols','g'],['Assist.','a'],['Hat-tricks','ht'],['Passes certos','ps'],['Chances','ch'],['Estrela do jogo','motm']];
 const cur=n.ss,car=n.cs,int=n.is;
 return`<table class="nstab"><thead><tr><th></th><th>Temporada</th><th>Carreira</th><th>Seleção</th></tr></thead><tbody>${L.map(([t,k])=>`<tr><th>${t}</th><td>${cur[k]||0}</td><td>${car[k]||0}</td><td>${int[k]||0}</td></tr>`).join('')}
 <tr><th>Nota média</th><td>${nn?fmt2(ns/nn):'—'}</td><td>—</td><td>—</td></tr><tr><th>Títulos</th><td>${(st.titles||[]).length}</td><td>${(S.titles||[]).length}</td><td>—</td></tr></tbody></table>`}
function nsClubsRows(){const n=S.n;const rows=(S.history||[]).map(h=>({y:h.year,c:h.club,j:h.games,g:h.goals,a:h.assists,m:(n.hist[h.year]||{}).motm}));
 rows.push({y:S.year,c:S.club,j:n.ss.ap,g:n.ss.g,a:n.ss.a,m:n.ss.motm,cur:true});
 return`<table class="nstab clubs"><thead><tr><th>Ano</th><th>Equipe</th><th>J</th><th>G</th><th>A</th><th>⭐</th></tr></thead><tbody>${rows.slice(-12).reverse().map(r=>{const c=CLUB[r.c];return`<tr class="${r.cur?'cur':''}"><td>${seasonLbl(r.y)}</td><td class="cl">${c?shieldHTML(c,'sm')+' '+esc(c.a||mkAbbr(c.n)):'—'}</td><td>${r.j||0}</td><td>${r.g||0}</td><td>${r.a||0}</td><td>${r.m??'—'}</td></tr>`}).join('')}</tbody></table>`}
function nsNextCard(){const nm=typeof nextMatchInfo==='function'?nextMatchInfo():null;const me=club();if(!nm||S.st.done)return'';const o=nm.opp&&CLUB[nm.opp];const away=nm.home===false&&o;const H=away?o:me,A=away?me:o;
 const last=(S.st.log||[]).filter(x=>x.k==='match').slice(-1)[0];
 return`<div class="nsnext"><small>Próximo jogo · ${esc(nm.comp)}${nm.label?' · '+esc(nm.label):''}</small><div class="mt"><span class="tm">${shieldHTML(H,'sm')}<b>${esc(H.n)}</b></span><em>×</em><span class="tm">${A?shieldHTML(A,'sm')+`<b>${esc(A.n)}</b>`:'<b>a definir</b>'}</span></div>${last?`<span class="last">Último jogo: ${esc(last.home.n)} ${last.hg} – ${last.ag} ${esc(last.away.n)}</span>`:''}</div>`}
function nsHubHTML(){const n=S.n;const c=club();const st=S.st;const [ri,rt,rc]=nsStatusRole();const [fi,ft,fc]=nsFormTxt();const bt=nsBootStats();const drinks=Object.values(n.dr).reduce((s,x)=>s+x,0);
 const skAvg=Math.round(NSK.reduce((s,[k])=>s+n.sk[k].l,0)/5);const achP=typeof nsAchPct==='function'?nsAchPct():0;
 const trainHint=n.en>=45&&!n.trainW&&!st.done;
 const body=NS_TAB==='status'?`<div class="ns3">
   <button class="ns3b" id="nsHabB"><small>Habilidades</small><b>OVR ${S.ovr}</b>${nsBarHTML(skAvg)}<em>média ${skAvg}</em></button>
   <button class="ns3b" id="nsHapB"><small>Felicidade</small><b>${n.happy>=70?'😄':n.happy>=45?'🙂':n.happy>=25?'😐':'😞'} ${Math.round(n.happy)}%</b>${nsBarHTML(n.happy,'hap')}</button>
   <button class="ns3b" id="nsLsB"><small>Estilo de vida</small><b>💎 ${n.ls}%</b>${nsBarHTML(n.ls,'ls')}</button></div>
  <div class="nsg">
   <div class="nsc ${rc}"><span>${ri}</span>${esc(rt)}</div><div class="nsc ${fc}"><span>${fi}</span>${esc(ft)}</div>
   <button class="nsc b" id="nsShopB"><span>🛒</span>Lojas</button><button class="nsc b" id="nsCtB"><span>📝</span>${S.wage?`${nsK(S.wage)}/sem · até ${S.year+Math.max(0,S.contract)}`:'Contrato'}</button>
   <button class="nsc b" id="nsDrShopB"><span>🥤</span>Energéticos</button><button class="nsc b ${drinks?'':'off'}" id="nsDrB"><span>🧃</span>${drinks?`${drinks} na mochila · tomar`:'Nenhum'}</button>
   <button class="nsc b" id="nsBootShopB"><span>👟</span>Chuteiras</button><button class="nsc b ${bt?'':'off'}" id="nsBootB"><span>${bt?bt.ic||'👟':'—'}</span>${bt?`${esc(bt.n)} · ${n.bootLeft} jogos`:'Nenhuma'}</button>
   <button class="nsc b" id="nsNewsB"><span>📰</span>Notícias</button><button class="nsc b" id="nsAchB"><span>🏅</span>Realizações ${String(achP).replace('.',',')}%</button>
  </div>${nsNextCard()}${trainHint?`<button class="nshint" id="nsHintB">💡 Energia em ${Math.round(n.en)}%: treine antes do jogo pra subir as habilidades.</button>`:''}`
 :`<div class="nsst"><div class="row" style="justify-content:space-between;align-items:center"><b>${NS_VIEW?'Clubes':'Estatísticas'}</b><button class="btn ghost small" id="nsViewB">🔁 Mudar visão</button></div>${NS_VIEW?nsClubsRows():nsStatsRows()}</div>`;
 return`<div class="nsh">
 <div class="nsh-top"><button class="nsico" id="nsExit" aria-label="Sair">✕</button><div class="nsname">${shieldHTML(c,'sm')}<div><b>${esc(S.name)}</b><span>#${S.shirt||S.num} · ${esc(POS[S.pos].n)} · ${esc(c.n)}</span></div></div><button class="nsico" id="nsCfg" aria-label="Opções">⚙️</button><button class="nsico" id="nsHelp" aria-label="Ajuda">?</button></div>
 <div class="nsh-bars"><button class="nsbig star" id="nsStarB"><span class="ic">⭐<i>${n.star.l}</i></span><span class="tx">Nível de estrela</span><span class="fl" style="width:${Math.round(n.star.p)}%"></span></button>
  <button class="nsbig en ${n.en<30?'low':''}" id="nsEnB"><span class="ic">❤️</span><span class="tx">Energia ${Math.round(n.en)}%</span><span class="fl" style="width:${Math.round(n.en)}%"></span></button></div>
 <div class="nsh-sub"><span>Idade ${S.age}</span><div class="nstabs"><button data-nt="status" class="${NS_TAB==='status'?'on':''}">Status</button><button data-nt="estats" class="${NS_TAB==='estats'?'on':''}">Estats</button></div><span class="mono gold">${money(S.din)}</span></div>
 <div class="nsh-body" id="nsBody">${body}</div>
 <div class="nsh-tick"><span>Ano ${nsSeasonNo()}</span><div class="mq"><span>${nsTicker()}</span></div><span>Sem ${(st.nsWk||0)+1}</span></div>
 <nav class="nsh-nav"><button id="nsLiga"><span>🏆</span><small>Liga</small></button><button id="nsHab"><span>⚽</span><small>Habilidade</small></button><button id="nsVida"><span>🙂</span><small>Vida</small></button><button id="nsJogar" class="go"><span>➜⚽</span><small>${st.done?'Balanço':'Jogar'}</small></button></nav>
 <div id="nsModal"></div></div>`}
function nsRenderHub(){nsEnsure();nsSync();
 // o que o hub antigo montou (evento da semana, balanço do ano) vem por cima da tela nova, com os botões funcionando
 let evNode=null;try{if(PAUSE){evNode=$app.querySelector('section.ev');if(evNode)evNode.remove()}}catch(e){}
 document.querySelectorAll('body > .bl-optmenu').forEach(x=>x.remove());document.body.classList.remove('blhub','onescreen','noscroll');document.body.classList.add('nshub');
 $app.innerHTML=nsHubHTML();
 if(evNode){const m=document.getElementById('nsModal');m.className='nsmodal';const w=document.createElement('div');w.className='nsmodal-in';w.appendChild(evNode);m.appendChild(w)}
 else if(S.st.done){const m=document.getElementById('nsModal');m.className='nsmodal';m.innerHTML=`<div class="nsmodal-in"><section class="card nsdone"><div class="eyebrow">Temporada ${seasonLbl(S.year)} encerrada</div><h3>Hora do balanço 🏁</h3><p class="muted">Tabela final, prêmios, evolução e as propostas pro ano que vem.</p><button class="btn wide" id="nsEndB">Ver o balanço</button></section></div>`}
 const on=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
 on('nsExit',()=>askHome());on('nsCfg',nsCfgSheet);on('nsHelp',()=>{try{S.tips=S.tips||{};delete S.tips.tourNS;coachTour('tourNS',TOUR_HUB)}catch(e){}});
 if(!(S.tips&&S.tips.tourNS)&&!evNode){S.tips=S.tips||{};S.tips.tourHub=true;setTimeout(()=>{try{if($ov.hidden&&!NSP.stack.length&&document.body.classList.contains('nshub'))coachTour('tourNS',TOUR_HUB)}catch(e){}},600)}
 $app.querySelectorAll('[data-nt]').forEach(b=>b.onclick=()=>{NS_TAB=b.dataset.nt;renderHub()});on('nsViewB',()=>{NS_VIEW=NS_VIEW?0:1;renderHub()});
 on('nsHab',()=>nsOpen(nsHabPage()));on('nsHabB',()=>nsOpen(nsHabPage()));on('nsHintB',()=>nsOpen(nsHabPage()));
 on('nsVida',()=>nsOpen(nsVidaPage()));on('nsHapB',()=>nsOpen(nsVidaPage()));on('nsLiga',()=>nsOpen(nsLigaPage()));
 on('nsLsB',()=>nsOpen(nsShopPage('ls')));on('nsShopB',()=>nsOpen(nsShopPage()));on('nsDrShopB',()=>nsOpen(nsShopPage('dr')));on('nsBootShopB',()=>nsOpen(nsShopPage('bt')));on('nsBootB',()=>nsOpen(nsShopPage('bt')));
 on('nsDrB',()=>nsDrinkPick());on('nsEnB',()=>nsDrinkPick());on('nsCtB',()=>nsContractSheet());on('nsNewsB',()=>nsNews());on('nsAchB',()=>nsOpen(nsAchPage()));on('nsStarB',()=>nsStarSheet());
 on('nsEndB',nsEndSeason);on('nsJogar',()=>{if(S.st.done){nsEndSeason();return}if(PAUSE){const m=document.querySelector('.nsmodal');if(m)m.animate([{transform:'scale(1)'},{transform:'scale(1.03)'},{transform:'scale(1)'}],{duration:260});return}nsPlay()});
}
{const _rhN=renderHub;renderHub=function(...a){const r=_rhN.apply(this,a);try{if(nsHubWanted())nsRenderHub();else document.body.classList.remove('nshub')}catch(e){console.error(e)}return r}}
{const _shN=shell;shell=function(...a){document.body.classList.remove('nshub');return _shN.apply(this,a)}}
// carreira nova ou carregada: liga o modo NSS
{const _lsN=typeof loadSave==='function'?loadSave:null;if(_lsN)loadSave=function(...a){const r=_lsN.apply(this,a);const fin=x=>{try{if(S&&S.club)nsEnsure()}catch(e){}return x};return r&&r.then?r.then(fin):fin(r)}}
{const _ncN=newCareer;newCareer=function(...a){const r=_ncN.apply(this,a);try{nsEnsure()}catch(e){}return r}}

// ---------- jogar (uma semana) ----------
async function nsEndSeason(){if(BUSY)return;BUSY=true;let ls=null;try{ls=endSeason();saveNow('post')}catch(e){console.error(e)}BUSY=false;if(!ls)return;try{await runSeasonEndShow(ls)}catch(e){console.error(e)}renderReport(ls)}
async function nsPlay(){if(BUSY)return;const n=nsEnsure();
 if(n.en<20){const k=await nsPop({ic:'🥵',title:'Você está sem energia',txt:`Energia em ${Math.round(n.en)}%. Jogando assim o rendimento cai e o risco de lesão sobe.`,opts:[['dr','🥤 Tomar energético'],['go','Jogar assim mesmo','ghost']],ok:'Voltar'});if(k==='dr'){await nsDrinkPick();return}if(k!=='go')return}
 S.st.lifeNews=[];LIFE_MSG=null;WEEK_TAB=null;NSSM.post=[];NSSM.inPost=true;
 // o advance do jogo já resolve os eventos da semana em pop-up e segue direto pro jogo
 try{await advance('one')}catch(e){console.error(e);BUSY=false}
 try{await nsPostMatch()}catch(e){console.error(e)}
 try{if(typeof showPendingMoments==='function')await showPendingMoments()}catch(e){}
 NSSM.inPost=false;renderHub();try{saveNow('season')}catch(e){}}

// ---------- habilidades ----------
function nsHabPage(){return{t:'Habilidades',cls:'hab',html:()=>{const n=S.n;const cost=nsTrainCost();const bt=nsBootStats();
  return`<div class="nshab-top"><div><b>OVR ${S.ovr}</b><span>${esc(POS[S.pos].n)} · potencial ${'★'.repeat(typeof prospectStars==='function'?prospectStars(S.pot):3)}</span></div><div class="nsen">❤️ ${Math.round(n.en)}% ${nsBarHTML(n.en)}</div></div>
  <p class="muted nshelp">Toque em <b>›</b> pra treinar (−${cost}% de energia). Sem treinar por 2 semanas a habilidade começa a cair.</p>
  ${NSK.map(([k,nm,ic])=>{const s=n.sk[k];const idle=n.week-(n.last[k]||0);const w=POS[S.pos].w;const imp=nsImp(k);const b=bt&&bt[k]?` <em class="bt">+${bt[k]} chuteira</em>`:'';
   return`<div class="nshr"><button class="nshr-m" data-hi="${k}"><span class="ic">${ic}</span><div class="nm"><b>${nm} ${s.l}</b>${b}<small>${imp>=3?'Muito importante':imp===2?'Importante':'Ajuda'} na sua posição${idle>=2&&n.week>1?' · <span class="bad">caindo</span>':''}</small></div>${nsBarHTML(s.p,'sk')}</button><button class="nshr-go" data-tr="${k}" ${n.en<cost?'disabled':''} aria-label="Treinar ${nm}">›</button></div>`}).join('')}
  <div class="nsauto"><span class="eyebrow">Treino automático</span><div class="row">${[['off','Desligado'],['eq','Equilibrado'],...NSK.map(([k,nm])=>[k,nm])].map(([k,t])=>`<button class="lmbtn ${(n.auto||'off')===k?'on':''}" data-au="${k}">${t}</button>`).join('')}</div><small class="muted">Treina sozinho no fim da semana se sobrar energia (guarda pelo menos 65% pro jogo).</small></div>`},
 bind:B=>{B.querySelectorAll('[data-tr]').forEach(b=>b.onclick=()=>{const k=b.dataset.tr;const r=nsTrain(k);if(!r.ok){toast({ic:'❤️',title:'Sem energia',txt:r.txt,ms:2400});return}
   const row=b.closest('.nshr');nsRefresh();const nr=document.querySelector(`[data-tr="${k}"]`);const el=nr&&nr.closest('.nshr');if(el){el.classList.add('pulse');const f=document.createElement('span');f.className='nsfloat';f.textContent=`+${r.g}%`;el.appendChild(f);setTimeout(()=>f.remove(),900)}try{SFX.tick&&SFX.tick()}catch(e){}});
  B.querySelectorAll('[data-hi]').forEach(b=>b.onclick=()=>{const k=b.dataset.hi;const s=S.n.sk[k];const nm=NSK.find(x=>x[0]===k)[1];nsPop({ic:NSK.find(x=>x[0]===k)[2],title:`${nm} ${s.l}`,txt:NSK_D[k]+` Progresso: ${Math.round(s.p)}% até o próximo nível.${s.l>=S.n.cap[k]?' Você está no seu limite natural: cada nível agora custa bem mais treino.':''}`})});
  B.querySelectorAll('[data-au]').forEach(b=>b.onclick=()=>{S.n.auto=b.dataset.au;nsRefresh()})},
 nav:[{ic:'🎮',t:'Prática',fn:nsPractice},{ic:'🥤',t:'Bebida',fn:()=>nsDrinkPick()},{ic:'📊',t:'Ranking',fn:nsRanking}]}}
function nsImp(k){const w=POS[S.pos].w;const lv=nsLv();const b=fit(nsAttrsOf(lv),S.pos);lv[k]+=10;const d=fit(nsAttrsOf(lv),S.pos)-b;return d>=4?3:d>=2?2:1}
// prática: minigame de treino que rende mais que o treino simples
async function nsPractice(){const n=S.n;const cost=nsTrainCost()+6;if(n.en<cost){toast({ic:'❤️',title:'Sem energia',txt:`A prática gasta ${cost}% de energia.`,ms:2200});return}
 const map={vel:'sprint',for:'header',tec:S.pos==='GOL'?'reflex':'dribble',vis:S.pos==='GOL'?'reflex':'pass',bp:'fk'};
 const k=await nsPop({ic:'🎮',title:'Prática',txt:`Escolha o treino. Gasta ${cost}% de energia e rende até o triplo do treino normal, se você mandar bem.`,opts:NSK.map(([k,nm,ic])=>[k,`${ic} ${nm}`]),ok:'Cancelar'});
 if(!map[k])return;n.en=clamp(n.en-cost,0,100);let hits=1;
 try{if(typeof weeklyTraining==='function'){const h=nsHost();h.hidden=true;const r=await weeklyTraining(map[k]);hits=r.hits||0;h.hidden=false}}catch(e){console.error(e)}
 const g=nsGain(k,.8+hits*.75);nsAddP(k,g);n.last[k]=n.week;n.trainW=(n.trainW||0)+1;nsSync();
 await nsPop({ic:hits>=3?'🔥':hits>=2?'👍':'😅',title:hits>=3?'Treino perfeito!':hits>=2?'Bom treino':'Treino fraco',txt:`${NSK.find(x=>x[0]===k)[1]}: +${g}% de progresso.`});nsRefresh()}
function nsRanking(){const me={n:S.name,r:S.ovr,me:true,club:S.club};let L=[];try{L=(W.stars||[]).filter(s=>s.pos===S.pos||(POS[s.pos]&&POS[S.pos]&&POS[s.pos].sg>.1===POS[S.pos].sg>.1)).map(s=>({n:s.n,r:Math.round(s.r),club:s.club}))}catch(e){}
 L.push(me);L.sort((a,b)=>b.r-a.r);const i=L.indexOf(me);const show=L.slice(Math.max(0,i-5),i+6);
 nsPop({ic:'📊',title:`Ranking · ${POS[S.pos].n}`,html:`<div class="nsrank">${show.map(x=>`<div class="${x.me?'me':''}"><span>${L.indexOf(x)+1}º</span><b>${esc(x.me?S.name+' (você)':x.n)}</b><em>${x.r}</em></div>`).join('')}</div>`})}

// ---------- vida: relacionamentos ----------
function nsRelInfo(k){const n=S.n;
 if(k==='coach')return{d:'Gosta de você = mais chances de ser titular e mais energia recuperada na semana.',act:'Ficar depois do treino',sub:`−15% energia`};
 if(k==='team')return{d:'Elenco do seu lado = mais bolas pra você e rendimento melhor.',act:'Churrasco com o elenco',sub:`−${nsK(nsRelCost('team'))}`};
 if(k==='fans')return{d:'Fãs = valor do patrocínio, fama e moral nos jogos grandes.',act:'Sessão de autógrafos',sub:'−10% energia'};
 if(k==='gf')return S.gf?{d:`${S.gf.n}${S.rel==='casado'?' (casados)':''}. Namorada feliz = você feliz.`,act:n.rel.gf>=85&&S.rel!=='casado'?'Pedir em casamento':'Jantar romântico',sub:n.rel.gf>=85&&S.rel!=='casado'?`−${nsK(nsRelCost('ring'))}`:`−${nsK(nsRelCost('gf'))}`}:{d:'Solteiro. Uma namorada deixa você mais feliz (e gasta dinheiro).',act:'Procurar namorada',sub:`−${nsK(nsRelCost('date'))}`};
 if(k==='spon')return n.spon?{d:`${n.spon.n} paga ${nsK(n.spon.w)} por semana. Se a relação esfriar, eles saem.`,act:'Gravar comercial',sub:'−20% energia'}:{d:'Sem patrocinador. Nível de estrela e fãs atraem marcas.',act:'Procurar patrocinador',sub:'grátis'}}
function nsRelCost(k){const w=Math.max(1,S.wage||1);return k==='team'?Math.max(2,Math.round(w*.35)):k==='gf'?Math.max(1,Math.round(w*.2)):k==='ring'?Math.max(10,Math.round(w*3)):k==='date'?Math.max(1,Math.round(w*.12)):0}
const NS_BRANDS=['Raio Sports','Vento Norte','Brava Energy','Tropa Mobile','Kaiju Bank','Estrela Pay','Golaço Bet-free','Pampa Foods','Nuvem Telecom','Ferro Motors','Arena Wear','Pulse Audio','Lumen Óculos','Rota Air'];
async function nsRelAct(k){const n=S.n;const cost=nsRelCost(k);let txt='',chips=[],ic='✅';
 const pay=v=>{if(S.din*1000<v){toast({ic:'💸',title:'Sem dinheiro',txt:`Precisa de ${nsK(v)}.`,ms:2000});return false}S.din-=v/1000;return true};
 const en=v=>{if(n.en<v){toast({ic:'❤️',title:'Sem energia',txt:`Precisa de ${v}% de energia.`,ms:2000});return false}n.en-=v;return true};
 const up=(r,v)=>{const b=n.rel[r];n.rel[r]=clamp(b+v,0,100);chips.push([`${NS_REL.find(x=>x[0]===r)[1]} ${v>=0?'+':''}${Math.round(n.rel[r]-b)}`,v>=0?'up':'down'])};
 if(k==='coach'){if(!en(15))return;up('coach',Math.round(R(6,10)*(n.rel.coach>80?.6:1)));const kk=nsWeakest();const g=nsGain(kk,.5);nsAddP(kk,g);n.last[kk]=n.week;txt=`O técnico viu você ficando até mais tarde. Ainda deu +${g}% em ${NSK.find(x=>x[0]===kk)[1]}.`}
 else if(k==='team'){if(!pay(cost))return;up('team',RI(8,13));txt='Carne, pagode e resenha. O elenco agora te passa mais a bola.'}
 else if(k==='fans'){if(!en(10))return;up('fans',RI(6,11));nsStarAdd(4);txt='Fila dobrando o quarteirão. Os fãs adoraram.'}
 else if(k==='gf'){
  if(!S.gf){if(!pay(nsRelCost('date')))return;const p=clamp(.25+n.star.l*.025+n.ls/250+n.happy/400,.2,.85);if(ch(p)){S.gf={n:pick(GF_NAMES),v:55};S.rel=S.rel==='solteiro'?'namorando':S.rel;n.rel.gf=55;ic='🌹';txt=`Você conheceu ${S.gf.n}. Estão namorando!`;chips.push(['Namorando','up'])}else{ic='🙃';txt='Não rolou dessa vez. Mais estrela e estilo de vida ajudam.'}}
  else if(n.rel.gf>=85&&S.rel!=='casado'){if(!pay(nsRelCost('ring')))return;if(ch(.85)){S.rel='casado';up('gf',10);ic='💍';txt=`${S.gf.n} disse SIM! Casamento marcado.`;try{nsAchHit('casar')}catch(e){}}else{up('gf',-15);ic='💔';txt=`${S.gf.n} pediu mais tempo. Ficou um clima estranho.`}}
  else{if(!pay(nsRelCost('gf')))return;up('gf',RI(9,14));ic='🍷';txt=`Noite perfeita com ${S.gf.n}.`}}
 else if(k==='spon'){
  if(!n.spon){const p=clamp(.15+n.star.l*.05+n.rel.fans/220,.1,.9);if(ch(p)){const w=Math.max(1,Math.min(Math.max(2,Math.round((S.wage||1)*1.2)),Math.round((n.star.l**1.35)*(.5+n.rel.fans/100)*R(.8,1.2))));n.spon={n:pick(NS_BRANDS),w};n.rel.spon=60;ic='🤝';txt=`A ${n.spon.n} fechou contigo: ${nsK(w)} por semana.`;chips.push([`+${nsK(w)}/sem`,'gold']);try{nsAchHit('spon')}catch(e){}}else{ic='📵';txt='Nenhuma marca topou ainda. Suba o nível de estrela e ganhe os fãs.'}}
  else{if(!en(20))return;up('spon',RI(10,16));const bon=n.spon.w*4;S.din+=bon/1000;chips.push([`+${nsK(bon)}`,'gold']);txt='Comercial gravado. A marca pagou um extra.'}}
 nsSync();await nsPop({ic,title:NS_REL.find(x=>x[0]===k)[1],txt,chips});nsRefresh()}
function nsVidaPage(){return{t:'Vida',cls:'vida',html:()=>{const n=S.n;
  return`<div class="nsv-top"><div class="nsv-b"><small>Felicidade</small>${nsBarHTML(n.happy,'hap')}<b>${Math.round(n.happy)}%</b></div><div class="nsv-b"><small>Energia</small>${nsBarHTML(n.en)}<b>${Math.round(n.en)}%</b></div></div>
  ${NS_REL.map(([k,nm,ic])=>{const I=nsRelInfo(k);const v=n.rel[k];const off=(k==='gf'&&!S.gf)||(k==='spon'&&!n.spon);
   return`<div class="nsrel ${off?'off':''}"><button class="nsrel-m" data-ri="${k}"><b>${nm}${k==='gf'&&S.gf?' · '+esc(S.gf.n):k==='spon'&&n.spon?' · '+esc(n.spon.n):''}</b>${nsBarHTML(off?0:v,'rel')}<small>${esc(I.act)} · ${esc(I.sub)}</small></button><button class="nsrel-go" data-ra="${k}" aria-label="${esc(I.act)}">${ic}</button></div>`}).join('')}
  <div class="nsv-more"><button class="nsc b" id="nsMoreB"><span>🌍</span><div><b>Mais da vida</b><small>médico, academia, balada, estudos, música, hobbies, o lado errado…</small></div></button><button class="nsc b" id="nsNews2"><span>📰</span><div><b>Notícias</b><small>feed das redes e jornal</small></div></button></div>`},
 bind:B=>{B.querySelectorAll('[data-ra]').forEach(b=>b.onclick=()=>nsRelAct(b.dataset.ra));B.querySelectorAll('[data-ri]').forEach(b=>b.onclick=()=>{const I=nsRelInfo(b.dataset.ri);nsPop({ic:NS_REL.find(x=>x[0]===b.dataset.ri)[2],title:NS_REL.find(x=>x[0]===b.dataset.ri)[1],txt:I.d})});
  const m=B.querySelector('#nsMoreB');if(m)m.onclick=()=>{try{nsHost().hidden=true;blOpen(vidaPage())}catch(e){console.error(e);nsHost().hidden=false}};const nw=B.querySelector('#nsNews2');if(nw)nw.onclick=nsNews},
 nav:[{ic:'💎',t:'Estilo de vida',fn:()=>nsPush(nsShopPage('ls'))},{ic:'🎰',t:'Cassino',fn:()=>nsPush(nsCasinoPage())},{ic:'🏆',t:'Prêmios',fn:()=>nsPush(nsTrophyPage())}]}}
// quando as páginas da vida (BitLife) fecham, a tela NSS volta
{const _blc=typeof blClose==='function'?blClose:null;if(_blc)blClose=function(...a){const h=document.getElementById('nsp');const back=h&&NSP.stack.length;const r=_blc.apply(this,a);if(back){h.hidden=false;nsDraw(true)}return r}}

// ---------- liga ----------
let NS_LT='tabela';
function nsLigaPage(){return{t:'Liga',cls:'liga',html:()=>{const st=S.st;let body='';
  if(NS_LT==='rodada')body=nsRoundHTML();else{const keep=TAB;TAB=NS_LT;try{body=tabContent()}catch(e){body='<p class="muted">Sem dados ainda.</p>'}TAB=keep}
  return`<div class="nstabs wide">${[['tabela','Tabela'],['rodada','Rodada'],['jogos','Partidas'],['copas','Copas'],['stats','Números']].map(([k,t])=>`<button class="${NS_LT===k?'on':''}" data-lt="${k}">${t}</button>`).join('')}</div><div class="nslg">${body}</div>`},
 bind:B=>{B.querySelectorAll('[data-lt]').forEach(b=>b.onclick=()=>{NS_LT=b.dataset.lt;nsRefresh()})},
 nav:[{ic:'🏅',t:'Realizações',fn:()=>nsPush(nsAchPage())},{ic:'🏆',t:'Prêmios',fn:()=>nsPush(nsTrophyPage())}]}}
function nsRoundHTML(){const st=S.st;const R0=st.nsRound;if(!R0)return'<p class="muted">A rodada aparece aqui depois do primeiro jogo da liga.</p>';const me=S.club;
 return`<div class="nsround"><div class="nsr-h"><span></span><span>Casa</span><b>Rodada ${R0.r+1}</b><span>Visitante</span><span></span></div>${R0.list.map(([h,a,hg,ag])=>{const H=CLUB[h],A=CLUB[a];const mine=h===me||a===me;
  return`<div class="nsr ${mine?'me':''}"><span class="p">${R0.pos[h]||''}º</span><span class="t">${esc(H.a||mkAbbr(H.n))}</span><b>${hg} – ${ag}</b><span class="t">${esc(A.a||mkAbbr(A.n))}</span><span class="p">${R0.pos[a]||''}º</span></div>`}).join('')}</div>`}

// ---------- energético ----------
async function nsDrinkPick(){const n=S.n;const have=NS_DRINKS.filter(d=>n.dr[d.id]>0);
 if(!have.length){const k=await nsPop({ic:'🥤',title:'Sem energético',txt:'Compre na loja de energéticos. Dá pra tomar antes do jogo, no intervalo ou antes do treino.',opts:[['shop','🛒 Ir pra loja']],ok:'Fechar'});if(k==='shop'){if(NSP.stack.length)nsPush(nsShopPage('dr'));else nsOpen(nsShopPage('dr'))}return null}
 const k=await nsPop({ic:'🥤',title:`Tomar energético · energia ${Math.round(n.en)}%`,opts:have.map(d=>[d.id,`${d.ic} ${d.n} (${n.dr[d.id]})`]),ok:'Cancelar'});
 const d=NS_DRINKS.find(x=>x.id===k);if(!d)return null;const chips=nsDrink(d);await nsPop({ic:d.ic,title:d.n,txt:`Energia agora em ${Math.round(n.en)}%.`,chips});nsRefresh();if(!NSP.stack.length)renderHub();return d}
function nsDrink(d){const n=S.n;n.dr[d.id]--;const chips=[];const e0=n.en;n.en=clamp(n.en+d.en,0,100);chips.push([`Energia +${Math.round(n.en-e0)}%`,'up']);
 if(d.sk){const ks=d.sk>=3?NSK.map(x=>x[0]):[nsWeakest()];for(const k of ks){const g=Math.round(d.skp*R(.8,1.2));nsAddP(k,g);chips.push([`${NSK.find(x=>x[0]===k)[1]} +${g}%`,'gold'])}}
 if(d.rel){for(const[k]of NS_REL){if(k==='gf'&&!S.gf)continue;if(k==='spon'&&!n.spon)continue;n.rel[k]=clamp(n.rel[k]+d.rel,0,100)}chips.push([`Relações +${d.rel}`,'up'])}
 n.drunk=(n.drunk||0)+1;try{nsAchCheck()}catch(e){}nsSync();return chips}

// ---------- contrato e agente ----------
async function nsContractSheet(){const n=S.n;const ct=nsCt();const c=club();
 const k=await nsPop({ic:'📝',title:`Contrato · ${c.n}`,html:`<table class="nstab small"><tbody><tr><th>Salário</th><td>${nsK(ct.wage)} por semana</td></tr><tr><th>Bônus por gol</th><td>${nsK(ct.gb)}</td></tr><tr><th>Bônus por assistência</th><td>${nsK(ct.ab)}</td></tr><tr><th>Até</th><td>${S.year+Math.max(0,S.contract)}${S.loan?' (emprestado)':''}</td></tr><tr><th>Agente</th><td>+${Math.round(nsAgentPct()*100)}% em tudo</td></tr><tr><th>Patrocínio</th><td>${n.spon?`${esc(n.spon.n)} · ${nsK(n.spon.w)}/sem`:'nenhum'}</td></tr></tbody></table>`,
  opts:[['raise','💰 Pedir aumento'],['bonus','⚽ Pedir mais bônus'],['agent','💼 Falar com o agente'],['taker','🎯 Pedir as bolas paradas','ghost']],ok:'Fechar'});
 if(k==='raise'){const r=askRaise();nsSync();await nsPop({ic:r.ok?'💰':'🙅',title:r.ok?'Aumento!':'Não rolou',txt:r.txt,chips:r.chips})}
 else if(k==='bonus'){const p=clamp(.3+(n.star.l-5)*.03+(n.rel.coach-50)/150+(S.ovr-c.s)/25,.08,.85);if(ch(p)){n.ct.rg=Math.round(n.ct.rg*1.25*100)/100;n.ct.ra=Math.round(n.ct.ra*1.25*100)/100;n.ct.wage=-1;nsCt();await nsPop({ic:'⚽',title:'Bônus maior',txt:`Agora: ${nsK(n.ct.gb)} por gol e ${nsK(n.ct.ab)} por assistência.`})}else{n.rel.coach=clamp(n.rel.coach-4,0,100);S.board=clamp((S.board||50)-6,0,100);await nsPop({ic:'🙅',title:'A diretoria negou',txt:'E ficou meio de cara.',chips:[['Treinador −4','down']]})}}
 else if(k==='agent'){try{openAgent(()=>renderHub())}catch(e){console.error(e)}}
 else if(k==='taker'){const kind=S.taker&&S.taker.pen?'fk':'pen';const r=askTaker(kind);await nsPop({ic:'🎯',title:kind==='pen'?'Pênaltis':'Faltas',txt:r.txt,chips:r.chips})}
 renderHub()}
// negociação do contrato novo (salário, bônus por gol, bônus por assistência)
function nsNegotiate(o){const n=S.n;if(!n||!S.wage)return;const c=club();let pat=100;const terms={wage:S.wage,gb:nsCt().gb,ab:nsCt().ab};let asks=0;
 const host=document.createElement('div');host.className='nspop-host neg';document.body.appendChild(host);
 const draw=(msg,cls)=>{host.innerHTML=`<div class="nspop"><div class="nspop-h"><span>📝</span><b>Negociar contrato · ${esc(c.n)}</b></div>
  <p class="muted" style="margin:0 0 8px">Peça mais em cada linha. Se a paciência do clube acabar, fica o que estiver na mesa.</p>
  <div class="nsneg">${[['wage','Salário por semana'],['gb','Bônus por gol'],['ab','Bônus por assistência']].map(([k,t])=>`<div class="nsneg-r"><span>${t}</span><b>${nsK(terms[k])}</b><button class="btn small" data-ask="${k}" ${pat<=0?'disabled':''}>Pedir +</button></div>`).join('')}</div>
  <div class="nsneg-pat"><small>Paciência do clube</small>${nsBarHTML(pat,pat<35?'low':'')}</div><div class="nsneg-msg ${cls||''}">${esc(msg||'')}</div>
  <div class="nspop-btns"><button class="btn" id="negOk">✍️ Assinar</button></div></div>`;
  host.querySelectorAll('[data-ask]').forEach(b=>b.onclick=()=>{const k=b.dataset.ask;asks++;const p=clamp(.62+(n.star.l-4)*.03+(S.ovr-c.s)/18+nsAgentPct()*1.5-asks*.07,.12,.92);
   if(ch(p)){const inc=k==='wage'?R(1.06,1.12):R(1.15,1.3);terms[k]=Math.round(terms[k]*inc+ (k==='wage'?0:1));pat-=RI(12,22);draw(`Aceitaram: ${nsK(terms[k])}.`,'good')}
   else{pat-=RI(30,45);draw(pat<=0?'O clube encerrou a conversa. Assine o que está na mesa.':'Recusaram. Cuidado com a paciência.','bad')}});
  host.querySelector('#negOk').onclick=()=>{S.wage=terms.wage;n.ct={wage:S.wage,rg:terms.gb/Math.max(1,S.wage),ra:terms.ab/Math.max(1,S.wage),gb:terms.gb,ab:terms.ab};host.remove();try{nsAchHit('contrato')}catch(e){}try{saveNow('season')}catch(e){}}};
 draw()}

// ---------- estrela, notícias, opções ----------
function nsStarSheet(){const n=S.n;nsPop({ic:'⭐',title:`Nível de estrela ${n.star.l}`,html:`<div class="nsstar">${nsBarHTML(n.star.p,'star')}<small>${Math.round(n.star.p)}% até o nível ${n.star.l+1}</small></div>`,txt:'Sobe com notas altas, gols, assistências, estrela do jogo, títulos e prêmios. Quanto maior, melhores os patrocínios, mais fãs e mais clubes interessados.'})}
function nsNews(){try{const h=nsHost();const was=!h.hidden;if(typeof fdHTML==='function'){openPanelHTML('Notícias',`<div class="fdhub nsfeed">${fdHTML()}</div>`,()=>{try{const b=document.querySelector('.nsfeed');if(b&&typeof fdBind==='function')fdBind(b)}catch(e){}})}else if(typeof npHTML==='function')openPanelHTML('Jornal',npHTML())}catch(e){console.error(e)}}
function nsCfgSheet(){const v=S.matchMode||'old',lm=S.lanceMode||'jogar',lc=S.lances||'todos';
 nsPop({ic:'⚙️',title:'Opções do jogo',html:`<div class="nscfg">
  <div class="livemode"><span class="eyebrow">Partida</span><button class="lmbtn ${v==='old'?'on':''}" data-cf="mm:old">📋 Lances + 3D</button><button class="lmbtn ${v==='sess'?'on':''}" data-cf="mm:sess">🏟️ Tudo no 3D</button></div>
  <div class="livemode"><span class="eyebrow">Seus lances</span><button class="lmbtn ${lc!=='off'&&lm==='jogar'?'on':''}" data-cf="lm:jogar">🎮 Jogar</button><button class="lmbtn ${lc!=='off'&&lm==='decidir'?'on':''}" data-cf="lm:decidir">🧠 Decidir</button><button class="lmbtn ${lc==='off'?'on':''}" data-cf="lm:off">Automático</button></div>
  <div class="livemode"><span class="eyebrow">Ver os jogos</span><button class="lmbtn ${(S.liveMode||'all')==='all'?'on':''}" data-cf="lv:all">Todos</button><button class="lmbtn ${S.liveMode==='decisivos'?'on':''}" data-cf="lv:decisivos">Só os grandes</button></div>
  <div class="nscfg-sim"><button class="btn ghost small" data-cf="go:decision">⏩ Simular até a próxima decisão</button><button class="btn ghost small" data-cf="go:skip">⏭ Simular o resto da temporada</button><button class="btn ghost small" data-cf="go:fast">⏭⏭ Simular até a aposentadoria</button></div></div>`,
  bind:h=>h.querySelectorAll('[data-cf]').forEach(b=>b.onclick=()=>{const[k,val]=b.dataset.cf.split(':');
   if(k==='mm')S.matchMode=val;else if(k==='lm'){if(val==='off')S.lances='off';else{S.lances='todos';S.lanceMode=val}}else if(k==='lv')S.liveMode=val;
   else if(k==='go'){h.remove();if(val==='fast'){try{fastForward()}catch(e){}}else advance(val==='skip'?'auto':'decision');return}
   b.parentElement.querySelectorAll('.lmbtn').forEach(x=>x.classList.toggle('on',x===b));try{saveNow('opts')}catch(e){}})})}
// tour da tela nova
if(typeof TOUR_HUB!=='undefined'){TOUR_HUB.length=0;TOUR_HUB.push(
 {sel:'.nsh-bars',t:'Estrela e energia',d:'<b>Nível de estrela</b> sobe com boas atuações e títulos. A <b>energia</b> cai no treino e no jogo e volta durante a semana.'},
 {sel:'.ns3',t:'Seu jogador',d:'Toque em <b>Habilidades</b> pra treinar, <b>Felicidade</b> pros relacionamentos e <b>Estilo de vida</b> pra loja.'},
 {sel:'.nsg',t:'Status',d:'Titular ou reserva, forma, lojas, contrato, energéticos e chuteiras com poderes especiais.'},
 {sel:'#nsHab',t:'Treine toda semana',d:'Cada treino gasta energia e sobe a habilidade. <b>Sem treinar, ela cai.</b>'},
 {sel:'#nsJogar',t:'Jogar',d:'Você controla só o seu jogador. Escolha <b>esforço</b> e <b>foco</b> durante o jogo e jogue os seus lances.'});}

// ---------- visual ----------
{const st=document.createElement('style');st.textContent=`
body.nshub{overflow:hidden}body.nshub #app{padding:0}
.nsh{height:100dvh;max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:8px;padding:calc(8px + env(safe-area-inset-top,0px)) 12px calc(8px + env(safe-area-inset-bottom,0px));position:relative}
.nsh-top{display:flex;gap:8px;align-items:center}.nsico{flex:none;width:40px;height:40px;border-radius:12px;border:1px solid var(--line-2);background:var(--panel);color:var(--chalk);font:800 17px var(--f-body)}
.nsname{flex:1;min-width:0;display:flex;gap:10px;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:5px 10px}.nsname b{display:block;font:800 18px var(--f-display);letter-spacing:.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nsname span{display:block;font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nsname>div{min-width:0}
.nsh-bars{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.nsbig{position:relative;overflow:hidden;height:44px;border-radius:12px;border:1px solid var(--line-2);background:#0a1a12;color:#fff;display:flex;align-items:center;gap:8px;padding:0 10px;font:800 15px var(--f-body)}
.nsbig .fl{position:absolute;left:0;top:0;bottom:0;z-index:0;transition:width .5s}.nsbig.star .fl{background:linear-gradient(90deg,#b8860b,#f2c443)}.nsbig.en .fl{background:linear-gradient(90deg,#2f9e44,#7be36b)}.nsbig.en.low .fl{background:linear-gradient(90deg,#b0261c,#ff6a5c)}
.nsbig .ic,.nsbig .tx{position:relative;z-index:1;text-shadow:0 1px 2px #000a}.nsbig .ic{font-size:20px;position:relative}.nsbig .ic i{position:absolute;inset:0;display:grid;place-items:center;font:900 11px var(--f-body);font-style:normal;color:#3b2a00;text-shadow:none;top:2px}
.nsh-sub{display:flex;align-items:center;justify-content:space-between;gap:8px;font:700 14px var(--f-body);color:var(--muted)}.nsh-sub .gold{color:var(--gold);font-weight:800}
.nstabs{display:flex;background:#0a1a12;border:1px solid var(--line-2);border-radius:999px;padding:3px}.nstabs button{border:0;background:none;color:var(--muted);font:800 13.5px var(--f-body);padding:6px 14px;border-radius:999px}.nstabs button.on{background:var(--accent);color:var(--accent-ink)}
.nstabs.wide{display:grid;grid-template-columns:repeat(5,1fr);border-radius:12px;margin-bottom:10px}.nstabs.wide button{padding:8px 2px;border-radius:9px;font-size:12.5px}
.nsh-body{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:8px}
.ns3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.ns3b{display:grid;gap:4px;justify-items:start;text-align:left;padding:10px;border-radius:14px;border:1px solid var(--line-2);background:linear-gradient(180deg,var(--panel-2),var(--panel));color:var(--chalk)}.ns3b small{font:700 12px var(--f-body);color:var(--muted);text-transform:uppercase;letter-spacing:.4px}.ns3b b{font:800 19px var(--f-display)}.ns3b em{font-style:normal;font-size:11.5px;color:var(--dim)}
.nsmb{display:block;width:100%;height:9px;border-radius:99px;background:#07130d;overflow:hidden;border:1px solid var(--line)}.nsmb i{display:block;height:100%;background:linear-gradient(90deg,#2f9e44,#8be08a);border-radius:99px;transition:width .4s}.nsmb.hap i{background:linear-gradient(90deg,#d4a017,#f2c443)}.nsmb.ls i{background:linear-gradient(90deg,#3a7bd5,#7cc4ff)}.nsmb.sk i{background:linear-gradient(90deg,#ff7a2b,#ffb26b)}.nsmb.rel i{background:linear-gradient(90deg,#2f9e44,#a6e39a)}.nsmb.star i{background:linear-gradient(90deg,#b8860b,#f2c443)}.nsmb.low i{background:linear-gradient(90deg,#b0261c,#ff6a5c)}
.nsg{display:grid;grid-template-columns:1fr 1fr;gap:6px}.nsc{display:flex;align-items:center;gap:8px;min-height:44px;padding:6px 10px;border-radius:12px;border:1px solid var(--line);background:var(--panel);color:var(--chalk);font:700 14px var(--f-body);text-align:left;line-height:1.2}.nsc span{font-size:18px;flex:none}.nsc.b{border-color:var(--line-2);background:var(--panel-2)}.nsc.good{background:#173f25;border-color:#2f7a45}.nsc.warn{background:#3d3214;border-color:#7a6326}.nsc.bad{background:#441b17;border-color:#8a3329}.nsc.off{color:var(--muted)}.nsc small{display:block;font:600 11.5px var(--f-body);color:var(--muted)}
.nshint{border:1px dashed var(--accent);background:#2a1a0c;color:#ffd0ad;border-radius:12px;padding:8px 10px;font:700 13.5px var(--f-body);text-align:left}
.nsh-tick{display:flex;align-items:center;gap:8px;font:700 12.5px var(--f-body);color:var(--muted);background:#08150e;border:1px solid var(--line);border-radius:10px;padding:6px 10px}.nsh-tick .mq{flex:1;overflow:hidden;white-space:nowrap;color:var(--chalk)}.nsh-tick .mq span{display:inline-block;padding-left:100%;animation:nsmq 16s linear infinite}@keyframes nsmq{to{transform:translateX(-100%)}}
.nsh-nav{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.nsh-nav button{display:grid;justify-items:center;gap:2px;padding:8px 4px;border-radius:14px;border:1px solid var(--line-2);background:linear-gradient(180deg,var(--panel-2),var(--panel));color:var(--chalk)}.nsh-nav span{font-size:24px;line-height:1}.nsh-nav small{font:800 12.5px var(--f-body)}.nsh-nav .go{background:linear-gradient(180deg,#ff8f45,#e85f10);border-color:#ffb27a;color:#1d0c02}
.nsmodal{position:absolute;inset:0;z-index:5;background:rgba(5,14,9,.82);display:grid;place-items:center;padding:16px}.nsmodal-in{width:100%;max-width:560px;max-height:100%;overflow:auto}.nsmodal-in>section{margin:0}
.nsdone{display:grid;gap:8px;text-align:center}.nsdone h3{font:900 28px var(--f-display);margin:0}.nsst{display:grid;gap:8px}.nstab{width:100%;border-collapse:collapse;font:700 14px var(--f-body)}.nstab th,.nstab td{font-family:var(--f-body);letter-spacing:0;padding:7px 6px;border-bottom:1px solid var(--line);text-align:center}.nstab thead th{font-size:12px;color:var(--muted);text-transform:uppercase}.nstab tbody th{text-align:left;color:var(--muted);font-weight:700}.nstab tr.cur td{color:var(--gold)}.nstab td.cl{text-align:left;white-space:nowrap}.nstab.small td{text-align:left}
#nsp{position:fixed;inset:0;z-index:17;background:var(--pitch)}#nsp[hidden]{display:none}body.nsp-open{overflow:hidden}
.nspg{height:100dvh;max-width:720px;margin:0 auto;display:flex;flex-direction:column;padding:calc(8px + env(safe-area-inset-top,0px)) 12px calc(8px + env(safe-area-inset-bottom,0px));gap:8px}
.nsp-h{display:flex;align-items:center;gap:10px}.nsp-h b{flex:1;font:800 22px var(--f-display);letter-spacing:.3px}.nsp-back{border:1px solid var(--line-2);background:var(--panel);color:var(--chalk);border-radius:10px;padding:7px 10px;font:800 14px var(--f-body)}
.nst-mini{display:flex;gap:8px;font:800 12.5px var(--f-body);color:var(--muted)}.nst-mini .mono{color:var(--gold)}
.nsp-b{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:8px}
.nsp-nav{display:flex;gap:8px}.nsnb{flex:1;display:grid;justify-items:center;gap:2px;padding:7px 4px;border-radius:12px;border:1px solid var(--line-2);background:var(--panel-2);color:var(--chalk)}.nsnb span{font-size:20px;line-height:1}.nsnb small{font:800 11.5px var(--f-body)}.nsnb.on{background:var(--accent);color:var(--accent-ink)}
.nshab-top{display:flex;justify-content:space-between;align-items:center;gap:10px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px 12px}.nshab-top b{font:800 22px var(--f-display);display:block}.nshab-top span{font-size:13px;color:var(--muted)}.nsen{display:grid;gap:4px;min-width:120px;font:800 14px var(--f-body)}
.nshelp{margin:0;font-size:13px}
.nshr{display:flex;gap:8px;position:relative}.nshr-m{flex:1;display:grid;grid-template-columns:auto 1fr;grid-template-areas:"ic nm" "bar bar";gap:6px 10px;align-items:center;text-align:left;padding:9px 12px;border-radius:14px;border:1px solid var(--line-2);background:linear-gradient(180deg,var(--panel-2),var(--panel));color:var(--chalk)}.nshr-m .ic{grid-area:ic;font-size:24px}.nshr-m .nm{grid-area:nm}.nshr-m .nsmb{grid-area:bar;height:10px}.nshr-m b{font:800 20px var(--f-display);letter-spacing:.3px}.nshr-m small{display:block;font-size:12px;color:var(--muted)}.nshr-m .bad{color:var(--bad)}.nshr-m em.bt{font-style:normal;font-size:12px;color:var(--blue);margin-left:6px}
.nshr-go{flex:none;width:58px;border-radius:14px;border:1px solid #6fd06c;background:linear-gradient(180deg,#3fae4c,#21813a);color:#fff;font:900 34px var(--f-body);line-height:1}.nshr-go:disabled{opacity:.35;filter:grayscale(1)}
.nshr.pulse .nshr-m{animation:nspulse .45s}@keyframes nspulse{50%{box-shadow:0 0 0 3px var(--good)}}.nsfloat{position:absolute;right:70px;top:6px;font:900 18px var(--f-body);color:var(--good);animation:nsfl .9s forwards;pointer-events:none}@keyframes nsfl{to{transform:translateY(-22px);opacity:0}}
.nsauto{display:grid;gap:6px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px 10px}.nsauto .row{display:flex;flex-wrap:wrap;gap:6px}
.nsv-top{display:grid;grid-template-columns:1fr 1fr;gap:8px}.nsv-b{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px 10px;font:800 13px var(--f-body)}.nsv-b small{color:var(--muted)}
.nsrel{display:flex;gap:8px}.nsrel-m{flex:1;display:grid;gap:5px;text-align:left;padding:9px 12px;border-radius:14px;border:1px solid var(--line-2);background:linear-gradient(180deg,var(--panel-2),var(--panel));color:var(--chalk)}.nsrel-m b{font:800 19px var(--f-display)}.nsrel-m small{font-size:12px;color:var(--muted)}.nsrel.off .nsrel-m{opacity:.7}
.nsrel-go{flex:none;width:62px;border-radius:14px;border:1px solid var(--line-2);background:#0e2418;font-size:28px}
.nsv-more{display:grid;grid-template-columns:1fr 1fr;gap:8px}.nsv-more .nsc{flex-direction:row;align-items:flex-start}
.nslg{display:grid;gap:6px}.nslg .card{margin:0}
.nsround{display:grid;gap:4px}.nsr-h,.nsr{display:grid;grid-template-columns:40px 1fr 70px 1fr 40px;gap:6px;align-items:center;text-align:center;font:700 14px var(--f-body)}.nsr-h{color:var(--muted);font-size:12px;text-transform:uppercase}.nsr{background:var(--panel);border-radius:8px;padding:6px 0}.nsr .p{color:var(--muted);font-size:12.5px}.nsr b{font:800 17px var(--f-display)}.nsr.me{background:#1d5a2c;outline:1px solid #4caf50}
.nspop-host{position:fixed;inset:0;z-index:30;display:grid;place-items:center;padding:16px;background:rgba(4,12,8,.72);animation:blfade .15s}.nspop{width:100%;max-width:440px;max-height:calc(100dvh - 32px);overflow:auto;background:var(--panel);border:1px solid var(--line-2);border-radius:18px;padding:16px;display:grid;gap:10px;text-align:center}
.nspop-h{display:flex;gap:8px;align-items:center;justify-content:center}.nspop-h span{font-size:26px}.nspop-h b{font:800 21px var(--f-display);letter-spacing:.3px}.nspop p{margin:0;color:var(--chalk);line-height:1.4}.nspop .chipsrow{justify-content:center}
.nspop-btns{display:grid;gap:8px}.nspop-btns .btn{width:100%}
.nsneg{display:grid;gap:6px}.nsneg-r{display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;text-align:left;background:#0d2118;border-radius:10px;padding:8px 10px}.nsneg-r b{font:800 16px var(--f-body);color:var(--gold)}.nsneg-pat{display:grid;gap:4px;text-align:left}.nsneg-pat small{color:var(--muted)}.nsneg-msg{min-height:1.3em;font-weight:700}.nsneg-msg.good{color:var(--good)}.nsneg-msg.bad{color:var(--bad)}
.nsstar{display:grid;gap:4px}.nsrank{display:grid;gap:4px;text-align:left}.nsrank div{display:grid;grid-template-columns:40px 1fr auto;gap:8px;padding:6px 10px;border-radius:8px;background:#0d2118}.nsrank div.me{background:#1d5a2c}.nsrank em{font-style:normal;font-weight:800}
.nscfg{display:grid;gap:10px;text-align:left}.nscfg .livemode{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.nscfg .eyebrow{width:100%}.nscfg-sim{display:grid;gap:6px}
.nsnext{display:grid;gap:6px;justify-items:center;text-align:center;background:linear-gradient(180deg,#123a26,#0d2a1c);border:1px solid var(--line-2);border-radius:14px;padding:10px}.nsnext small{font:800 12px var(--f-body);color:var(--muted);text-transform:uppercase;letter-spacing:.3px}.nsnext .mt{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;width:100%}.nsnext .tm{display:flex;gap:8px;align-items:center;justify-content:center;min-width:0}.nsnext .tm b{font:800 18px var(--f-display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nsnext em{font-style:normal;color:var(--muted);font-weight:800}.nsnext .last{font-size:12.5px;color:var(--dim)}
@media (min-height:900px) and (min-width:600px){.nsh{gap:12px;padding-top:calc(16px + env(safe-area-inset-top,0px));padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))}.nsbig{height:58px;font-size:18px}.nsbig .ic{font-size:26px}.nsh-sub{font-size:16px}.nstabs button{font-size:15px;padding:8px 20px}
 .ns3b{padding:14px;gap:6px}.ns3b b{font-size:26px}.ns3b small{font-size:13px}.nsmb{height:11px}.nsg{gap:10px}.nsc{min-height:62px;font-size:16.5px;padding:8px 14px;border-radius:14px}.nsc span{font-size:24px}
 .nsnext{padding:14px}.nsnext .tm b{font-size:22px}.nsh-tick{font-size:14px;padding:9px 12px}.nsh-nav{gap:10px}.nsh-nav button{padding:12px 6px;border-radius:16px}.nsh-nav span{font-size:32px}.nsh-nav small{font-size:15px}
 .nshr-m{padding:12px 14px}.nshr-m b{font-size:24px}.nshr-go{width:72px;font-size:40px}.nsrel-m{padding:12px 14px}.nsrel-m b{font-size:22px}.nsrel-go{width:72px;font-size:32px}.nsp-h b{font-size:26px}.nsnb{padding:10px 4px}.nsnb span{font-size:24px}.nsnb small{font-size:13px}}
@media (max-width:420px){.nsh-nav span{font-size:21px}.ns3b b{font-size:16px}.nsc{font-size:13px;min-height:40px}.nsbig{font-size:13.5px}.nstabs button{padding:6px 10px}}
@media (max-height:700px){.nsg{gap:5px}.nsc{min-height:38px;padding:4px 8px}.ns3b{padding:7px}}
`;document.head.appendChild(st)}
