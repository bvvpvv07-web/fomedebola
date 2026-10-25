// ================== TRILHA SONORA: hip hop, rap e trap feitos na hora ==================
// Nada de música gravada: as batidas são tocadas pelo próprio navegador (Web Audio). Bumbo, 808 com distorção e
// deslize, palmas e caixa de ruído, chimbal com rolos de trap, acordes de piano elétrico, sininho e um chiado de vinil
// nas faixas de boom bap. Cada faixa tem introdução, verso, refrão e quebra, e a melodia muda a cada vez.
// No menu toca o som mais calmo (lo-fi e boom bap); dentro da carreira roda a playlist de trap e rap.
// Fica mais baixo durante os lances em 3D. Ligar/desligar: botão 🎵 no menu inicial e no ⚙️ da carreira.
const MUS_T=[
 {id:'lofi',n:'Lo-fi da Peneira',g:'Lo-fi hip hop',gain:1.75,bpm:78,swing:.2,root:53,lp:3200,crackle:.035,
  prog:[[0,4,7,11],[-1,2,6,9],[-3,0,4,7],[-5,-1,2,6]],scale:[0,2,4,7,9],
  kick:['x.......x.x.....','x.......x...x...'],snare:'....x.......x...',snK:'rim',hat:['x.x.x.x.x.x.x.x.','x.x.xxx.x.x.x.xx'],hatV:.07,b:'soft',lead:'flute',dens:.22,keys:'rhodes',arr:'IVHVHBH'},
 {id:'rua9',n:'Rua 9',g:'Boom bap',gain:1.55,bpm:88,swing:.22,root:50,lp:6500,crackle:.03,
  prog:[[0,3,7,10,14],[5,9,15,21],[10,14,17,21,24],[7,11,14,17,20]],scale:[0,2,3,5,7,9,10],
  kick:['x......x..x.....','x......x..x..x..'],snare:'....x.......x...',snK:'snare',hat:['x.x.x.x.x.x.x.x.','x.x.x.x.x.x.x.xx'],hatV:.09,b:'soft',lead:'piano',dens:.2,keys:'rhodes',arr:'IVHVHBH'},
 {id:'varzea',n:'Várzea Trap',g:'Trap',bpm:140,swing:0,root:45,lp:12000,crackle:0,
  prog:[[0,3,7],[-4,0,3],[3,7,10],[-2,2,5]],scale:[0,3,5,7,10],
  kick:['x.........x.....','x.....x...x..x..'],snare:'........x.......',snK:'clap',hat:['x.x.x.x.x.x.xrxr','x.x.x.xtx.x.x.tt'],hatV:.08,b:'808',lead:'bell',dens:.3,keys:'pad',arr:'IVHVHBHH'},
 {id:'camisa10',n:'Camisa 10',g:'Trap',bpm:150,swing:0,root:48,lp:12000,crackle:0,
  prog:[[0,3,7],[-4,0,3],[3,7,10],[-2,2,5]],scale:[0,2,3,7,8],
  kick:['x.......x.x.....','x.....x.x...x...'],snare:'........x.......',snK:'clap',hat:['xxx.x.xxx.x.xrxr','x.x.xtx.x.x.ttx.'],hatV:.08,b:'808',lead:'brass',dens:.26,keys:'pad',arr:'IVHVHBHH'},
 {id:'drill',n:'Drill do Morro',g:'Drill',bpm:142,swing:0,root:52,lp:11000,crackle:0,
  prog:[[0,3,7],[-4,0,3],[-2,2,5],[-5,-1,2,5]],scale:[0,2,3,7,8,10],
  kick:['x.........x.....','x..........x....'],snare:'........x......x',snK:'snare',hat:['x..x..x.x..x..x.','x..x..xtx..x.tx.'],hatV:.085,b:'glide',lead:'bell',dens:.24,keys:'pad',arr:'IVHVHBH'},
 {id:'rap',n:'Rima de Vestiário',g:'Rap',bpm:94,swing:.12,root:47,lp:8000,crackle:.018,
  prog:[[0,3,7,10],[-2,2,5,9],[-4,0,3,7],[-5,-1,2,5]],scale:[0,3,5,7,10],
  kick:['x.....x...x.....','x.....x...x..x..'],snare:'....x.......x...',snK:'clap',hat:['x.x.x.x.x.x.x.x.','x.x.x.x.x.xxx.x.'],hatV:.09,b:'808',lead:'piano',dens:.18,keys:'rhodes',arr:'IVHVHBH'}];
const MUS_LIST={menu:['lofi','rua9'],game:['varzea','camisa10','rap','drill','rua9']};
const MUS={ac:null,on:true,vol:.6,cur:null,pl:'menu',idx:{menu:0,game:0},timer:null,next:0,step:0,bar:0,duck:1,seed:1,mel:null,bus:null,out:null};
try{const v=localStorage.getItem('fdb_music');if(v!=null)MUS.on=v!=='0';const vv=localStorage.getItem('fdb_mvol');if(vv!=null)MUS.vol=Math.min(1,Math.max(0,+vv))}catch(e){}
function musRnd(){MUS.seed=(MUS.seed*1103515245+12345)&0x7fffffff;return MUS.seed/0x7fffffff}
function musHz(m){return 440*Math.pow(2,(m-69)/12)}
function musInit(){if(MUS.ac)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
 try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
 const ac=MUS.ac=new AC();
 const comp=ac.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.attack.value=.004;comp.release.value=.18;
 MUS.out=ac.createGain();MUS.out.gain.value=0;comp.connect(MUS.out);MUS.out.connect(ac.destination);
 MUS.lp=ac.createBiquadFilter();MUS.lp.type='lowpass';MUS.lp.frequency.value=12000;MUS.lp.Q.value=.4;MUS.lp.connect(comp);MUS.bus=MUS.lp;
 // ruído pronto (caixa, palmas, chimbal) e chiado de vinil
 const nb=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;MUS.noise=nb;
 const cb=ac.createBuffer(1,ac.sampleRate*4,ac.sampleRate);const c=cb.getChannelData(0);for(let i=0;i<c.length;i++){c[i]=(Math.random()*2-1)*.04;if(Math.random()<.0009)c[i]=(Math.random()<.5?-1:1)*(.4+Math.random()*.6)}
 MUS.crk=ac.createBufferSource();MUS.crk.buffer=cb;MUS.crk.loop=true;MUS.crkG=ac.createGain();MUS.crkG.gain.value=0;const cf=ac.createBiquadFilter();cf.type='bandpass';cf.frequency.value=2500;cf.Q.value=.6;MUS.crk.connect(cf);cf.connect(MUS.crkG);MUS.crkG.connect(comp);MUS.crk.start();
 // eco do sininho/flauta
 MUS.dl=ac.createDelay(1);MUS.dl.delayTime.value=.32;MUS.dlG=ac.createGain();MUS.dlG.gain.value=.28;MUS.dl.connect(MUS.dlG);MUS.dlG.connect(MUS.dl);MUS.dlG.connect(MUS.bus);
 // distorção do 808
 MUS.sat=ac.createWaveShaper();const cv=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/512-1;cv[i]=Math.tanh(x*3.8)*.92}MUS.sat.curve=cv;const sg=ac.createGain();sg.gain.value=.7;MUS.sat.connect(sg);sg.connect(comp);
 return true}
// ---------- instrumentos ----------
function mEnv(g,t,a,peak,dec,end=.0001){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(end,t+a+dec)}
function mKick(t,v=1,soft){const ac=MUS.ac,o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(soft?120:160,t);o.frequency.exponentialRampToValueAtTime(soft?48:42,t+.11);mEnv(g,t,.003,.95*v,soft?.28:.36);o.connect(g);g.connect(MUS.bus);o.start(t);o.stop(t+.45)}
function mNoise(t,dur,type,f,q,v,dec){const ac=MUS.ac,s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();s.buffer=MUS.noise;fl.type=type;fl.frequency.value=f;fl.Q.value=q;mEnv(g,t,.002,v,dec);s.connect(fl);fl.connect(g);g.connect(MUS.bus);s.start(t,Math.random()*.5);s.stop(t+dur)}
function mSnare(t,v=1){mNoise(t,.28,'bandpass',2100,.7,.85*v,.19);mNoise(t,.2,'highpass',5000,.5,.25*v,.1);const ac=MUS.ac,o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(210,t);o.frequency.exponentialRampToValueAtTime(140,t+.06);mEnv(g,t,.002,.25*v,.08);o.connect(g);g.connect(MUS.bus);o.start(t);o.stop(t+.12)}
function mClap(t,v=1){for(let i=0;i<3;i++)mNoise(t+i*.011,.05,'bandpass',1350,1,.55*v,.03);mNoise(t+.033,.32,'bandpass',1400,.8,.75*v,.18);mNoise(t+.033,.2,'highpass',4500,.5,.22*v,.09)}
function mRim(t,v=1){mNoise(t,.06,'highpass',2600,.7,.55*v,.04);const ac=MUS.ac,o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=820;mEnv(g,t,.001,.08*v,.025);o.connect(g);g.connect(MUS.bus);o.start(t);o.stop(t+.05)}
function mHat(t,v,open){mNoise(t,open?.4:.09,'highpass',open?6000:6800,.5,v*2.6,open?.26:.055)}
function m808(t,midi,dur,from,v=1,soft){const ac=MUS.ac,o=ac.createOscillator(),g=ac.createGain();o.type='sine';const f=musHz(midi);
 if(from!=null){o.frequency.setValueAtTime(musHz(from),t);o.frequency.exponentialRampToValueAtTime(f,t+.09)}else o.frequency.setValueAtTime(f,t);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime((soft?.42:.6)*v,t+.008);g.gain.setValueAtTime((soft?.37:.54)*v,t+Math.max(.02,dur*.6));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 o.connect(g);g.connect(soft?MUS.bus:MUS.sat);o.start(t);o.stop(t+dur+.05)}
function mKeys(t,notes,dur,kind,v=1){const ac=MUS.ac;const out=ac.createGain();const fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=kind==='pad'?2400:3400;fl.Q.value=.5;out.connect(fl);fl.connect(MUS.bus);
 const a=kind==='pad'?.16:.01,peak=(kind==='pad'?.11:.15)*v;out.gain.setValueAtTime(.0001,t);out.gain.exponentialRampToValueAtTime(peak,t+a);out.gain.setValueAtTime(peak*(kind==='pad'?1:.55),t+Math.min(dur*.5,.6));out.gain.exponentialRampToValueAtTime(.0001,t+dur);
 for(const n of notes){for(const [ty,det,lv] of(kind==='pad'?[['sawtooth',-7,.35],['sawtooth',7,.35],['triangle',0,.6]]:[['triangle',0,.7],['sine',1200,.18],['sine',-4,.5]])){const o=ac.createOscillator(),g=ac.createGain();o.type=ty;o.frequency.value=musHz(n);o.detune.value=det;g.gain.value=lv;o.connect(g);g.connect(out);o.start(t);o.stop(t+dur+.05)}}}
function mLead(t,midi,dur,kind,v=1){const ac=MUS.ac,o=ac.createOscillator(),g=ac.createGain();const f=musHz(midi);
 if(kind==='bell'){o.type='sine';o.frequency.value=f*2;const o2=ac.createOscillator(),g2=ac.createGain();o2.type='sine';o2.frequency.value=f*4.01;g2.gain.value=.3;o2.connect(g2);g2.connect(g);o2.start(t);o2.stop(t+dur+.4);mEnv(g,t,.003,.22*v,dur+.35)}
 else if(kind==='brass'){o.type='sawtooth';o.frequency.value=f;const fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(600,t);fl.frequency.exponentialRampToValueAtTime(2600,t+.06);fl.frequency.exponentialRampToValueAtTime(1100,t+dur);o.connect(fl);fl.connect(g);mEnv(g,t,.02,.16*v,dur)}
 else if(kind==='flute'){o.type='sine';o.frequency.value=f*2;const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=5;lg.gain.value=f*.012;lfo.connect(lg);lg.connect(o.frequency);lfo.start(t);lfo.stop(t+dur+.2);mEnv(g,t,.05,.17*v,dur+.15)}
 else{o.type='triangle';o.frequency.value=f*2;mEnv(g,t,.004,.2*v,dur+.25)}
 if(kind!=='brass')o.connect(g);g.connect(MUS.bus);g.connect(MUS.dl);o.start(t);o.stop(t+dur+.6)}
// ---------- sequenciador ----------
function musTrack(id){return MUS_T.find(x=>x.id===id)||MUS_T[0]}
function musMelody(T){const L=[];let deg=Math.floor(musRnd()*T.scale.length);for(let i=0;i<32;i++){if(musRnd()<T.dens&&!(i%2&&musRnd()<.5)){deg=Math.max(0,Math.min(T.scale.length*2-1,deg+Math.round((musRnd()-.5)*3)));L.push({i,deg,len:musRnd()<.3?3:1})}else L.push(null)}return L}
function musStep(t){const T=MUS.cur,i=MUS.step%16,bar=MUS.bar,sec=T.arr[Math.floor(bar/4)%T.arr.length]||'V',v=bar%2;const ch=T.prog[bar%T.prog.length];const st=60/T.bpm/4;
 const drums=true,kick=sec!=='B',dv=sec==='I'?.5:1;
 // acordes
 if(i===0)mKeys(t,ch.map(n=>T.root+12+n),st*16*(T.keys==='pad'?1.02:.9),T.keys,sec==='B'?1.2:1);
 if(i===8&&T.keys==='rhodes'&&sec!=='I')mKeys(t,ch.slice(1).map(n=>T.root+12+n),st*6,'rhodes',.6);
 // bateria
 const kp=T.kick[v];if(kick&&kp[i]==='x'&&!(sec==='I'&&i>0&&T.bpm>110)){mKick(t,dv,T.b==='soft');
  // baixo: 808 que segura até o próximo bumbo (com deslize no drill)
  let n=1;while(n<16&&kp[(i+n)%16]!=='x')n++;const root=T.root-12+ch[0];
  if(sec==='I')n=16;if(T.b==='soft')m808(t,root,Math.min(n,8)*st,null,.9*dv,true);else m808(t,root,n*st*.95,T.b==='glide'&&musRnd()<.45?root+(musRnd()<.5?7:12):null,dv)}
 if(drums&&T.snare[i]==='x'){(T.snK==='clap'?mClap:T.snK==='rim'?mRim:mSnare)(t,dv);if(T.snK==='clap'&&T.bpm<120)mSnare(t,.5)}
 const hp=T.hat[v][i];if(hp!=='.'){const hv=T.hatV*(sec==='I'?.7:1)*(i%4===0?1:.75);
  if(hp==='x')mHat(t,hv);else if(hp==='r'){mHat(t,hv*.8);mHat(t+st/2,hv*.7)}else if(hp==='t'){for(let k=0;k<3;k++)mHat(t+k*st/3,hv*(.6+.15*k))}else if(hp==='o')mHat(t,hv*1.2,true)}
 if(drums&&i===14&&bar%4===3)mHat(t,T.hatV*1.3,true);
 // melodia no refrão (e um pouco no verso), repete a cada 2 compassos
 if((sec==='H'||sec==='I'||(sec==='V'&&T.dens>.2&&bar%4>=2))&&MUS.mel){const m=MUS.mel[(bar%2)*16+i];if(m){const deg=m.deg,oct=Math.floor(deg/T.scale.length),note=T.root+12+T.scale[deg%T.scale.length]+oct*12;mLead(t,note,st*m.len*1.4,T.lead,sec==='H'?1:sec==='I'?.7:.6)}}}
function musTick(){const ac=MUS.ac;if(!ac||!MUS.cur||MUS.switching||!MUS.on||ac.state!=='running')return;if(MUS.next<ac.currentTime-.2)MUS.next=ac.currentTime+.05;const T=MUS.cur;
 while(MUS.next<ac.currentTime+.16){try{musStep(MUS.next)}catch(e){}const st=60/T.bpm/4;MUS.next+=MUS.step%2===0?st*(1+T.swing):st*(1-T.swing);MUS.step++;
  if(MUS.step%16===0){MUS.bar++;if(MUS.bar%8===0)MUS.mel=musMelody(T);if(MUS.bar>=T.arr.length*4*2){musNext(true);return}}}}
function musPlay(id){if(!musInit())return;const ac=MUS.ac;const T=musTrack(id);MUS.cur=T;MUS.switching=false;MUS.dl.delayTime.setValueAtTime(60/T.bpm*.75,ac.currentTime);MUS.seed=(Date.now()&0xffff)+1;MUS.mel=musMelody(T);MUS.step=0;MUS.bar=0;MUS.next=ac.currentTime+.12;
 MUS.lp.frequency.setTargetAtTime(T.lp,ac.currentTime,.2);MUS.crkG.gain.setTargetAtTime(T.crackle,ac.currentTime,.3);musGain(.8);
 if(!MUS.timer)MUS.timer=setInterval(musTick,25);musLabel()}
function musGain(tc=.3){if(!MUS.ac)return;const target=MUS.on?MUS.vol*.62*MUS.duck*((MUS.cur&&MUS.cur.gain)||1):0;MUS.out.gain.setTargetAtTime(Math.max(.0001,target),MUS.ac.currentTime,tc)}
function musNext(auto){const L=MUS_LIST[MUS.pl];MUS.idx[MUS.pl]=(MUS.idx[MUS.pl]+1)%L.length;const id=L[MUS.idx[MUS.pl]];
 if(!MUS.ac||!MUS.cur){return}MUS.switching=true;MUS.out.gain.setTargetAtTime(.0001,MUS.ac.currentTime,.15);const go=()=>{musPlay(id);if(!auto)try{toast({ic:'🎵',title:MUS.cur.n,txt:MUS.cur.g,ms:1800,group:'mus'})}catch(e){}};setTimeout(go,auto?250:420)}
function musStart(){if(!MUS.on)return;if(!musInit())return;const ac=MUS.ac;if(ac.state==='suspended')ac.resume().catch(()=>{});if(!MUS.cur)musPlay(MUS_LIST[MUS.pl][MUS.idx[MUS.pl]]);else musGain()}
function musSet(on){MUS.on=!!on;try{localStorage.setItem('fdb_music',on?'1':'0')}catch(e){}if(on){musStart();if(MUS.ac&&MUS.ac.state==='suspended')MUS.ac.resume().catch(()=>{})}musGain(.15);musLabel();
 // desligada: para de tocar de vez (não gasta bateria)
 if(!on&&MUS.ac)setTimeout(()=>{if(!MUS.on&&MUS.ac.state==='running')MUS.ac.suspend().catch(()=>{})},500)}
function musLabel(){document.querySelectorAll('[data-mus-now]').forEach(e=>e.textContent=MUS.cur?`${MUS.cur.n} · ${MUS.cur.g}`:'—');document.querySelectorAll('[data-mus-on]').forEach(b=>b.classList.toggle('on',(b.dataset.musOn==='1')===MUS.on));document.querySelectorAll('.mus-btn').forEach(b=>{b.classList.toggle('off',!MUS.on);b.setAttribute('aria-label',MUS.on?'Desligar música':'Ligar música')})}
// liga no primeiro toque (o navegador exige um gesto)
['pointerdown','keydown','touchend'].forEach(ev=>addEventListener(ev,()=>{if(MUS.on&&(!MUS.ac||MUS.ac.state!=='running'||!MUS.cur))musStart()},{capture:true,passive:true}));
// menu ou carreira? lance em 3D abaixa o volume; aba escondida pausa
setInterval(()=>{try{const inGame=!!(typeof S!=='undefined'&&S&&S.st&&!(typeof CLOUD!=='undefined'&&CLOUD.screen==='home'));const pl=inGame?'game':'menu';
 if(pl!==MUS.pl){MUS.pl=pl;if(MUS.cur&&MUS.on){MUS.idx[pl]=(MUS.idx[pl]+MUS_LIST[pl].length-1)%MUS_LIST[pl].length;musNext(false)}}
 const duck=document.body.classList.contains('l3d-on')?.38:document.body.classList.contains('rc-open')?.8:1;if(duck!==MUS.duck){MUS.duck=duck;musGain(.4)}
 if(MUS.ac){if(document.hidden&&MUS.ac.state==='running')MUS.ac.suspend().catch(()=>{});else if(!document.hidden&&MUS.on&&MUS.ac.state==='suspended')MUS.ac.resume().catch(()=>{})}}catch(e){}},700);
// botão no menu inicial
function musBtnHTML(){return`<button class="mus-btn ${MUS.on?'':'off'}" aria-label="${MUS.on?'Desligar música':'Ligar música'}"><span>🎵</span></button>`}
new MutationObserver(()=>{const top=document.querySelector('.htop-in');if(top&&!top.querySelector('.mus-btn')){const pc=top.querySelector('.profchip');const w=document.createElement('div');w.innerHTML=musBtnHTML();const b=w.firstChild;if(pc)pc.before(b);else top.appendChild(b);b.onclick=e=>{e.stopPropagation();musSet(!MUS.on);if(MUS.on)try{toast({ic:'🎵',title:MUS.cur?MUS.cur.n:'Música ligada',txt:MUS.cur?MUS.cur.g:'',ms:1600,group:'mus'})}catch(_){}}}}).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
// no ⚙️ da carreira: liga/desliga, próxima faixa e volume
{const _rh=renderHub;renderHub=function(...a){const r=_rh.apply(this,a);try{const dm=document.getElementById('dockM');if(dm&&!dm.querySelector('.mus-row')){dm.insertAdjacentHTML('afterbegin',`<div class="livemode mus-row"><span class="eyebrow">Música</span><button class="lmbtn" data-mus-on="1">🎵 Ligada</button><button class="lmbtn" data-mus-on="0">Desligada</button><button class="lmbtn" id="musNx" aria-label="Próxima faixa">⏭️</button></div><div class="mus-now"><span data-mus-now></span><input type="range" min="0" max="100" value="${Math.round(MUS.vol*100)}" id="musVol" aria-label="Volume da música"></div>`);
  dm.querySelectorAll('[data-mus-on]').forEach(b=>b.onclick=e=>{e.stopPropagation();musSet(b.dataset.musOn==='1')});const nx=dm.querySelector('#musNx');if(nx)nx.onclick=e=>{e.stopPropagation();if(!MUS.on)musSet(true);else if(!MUS.cur)musStart();else musNext(false)};
  const vr=dm.querySelector('#musVol');if(vr){vr.oninput=()=>{MUS.vol=vr.value/100;try{localStorage.setItem('fdb_mvol',String(MUS.vol))}catch(e){}musGain(.08)};vr.onclick=e=>e.stopPropagation()}musLabel()}}catch(e){console.error(e)}return r}}
{const st=document.createElement('style');st.textContent=`
.mus-btn{width:40px;height:40px;border-radius:12px;border:1px solid var(--line-2);background:var(--panel);display:grid;place-items:center;font-size:18px;margin-left:auto;margin-right:8px;position:relative}
.mus-btn.off span{opacity:.45;filter:grayscale(1)}.mus-btn.off::after{content:'';position:absolute;width:26px;height:2px;background:var(--bad);transform:rotate(-40deg);border-radius:2px}
.htop-in .profchip{margin-left:0}
.mus-row .lmbtn#musNx{flex:0 0 auto}
.mus-now{display:grid;grid-template-columns:minmax(0,1fr) 120px;gap:10px;align-items:center;padding:2px 4px 8px;font-size:12.5px;color:var(--muted)}.mus-now span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mus-now input{width:100%;height:32px;accent-color:var(--accent)}
`;document.head.appendChild(st)}
