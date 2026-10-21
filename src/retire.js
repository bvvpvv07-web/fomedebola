// ================== APOSENTADORIA: a despedida em seis cenas ==================
// 1 O último jogo (estádio à noite, mosaico "OBRIGADO" na arquibancada, flashes, você no meio do campo)
// 2 A trajetória (escudos de cada clube, idades, jogos, gols e títulos)
// 3 Os números (contadores, gráfico do OVR por idade e gols por temporada)
// 4 Sala de troféus (as taças desenhadas do jogo e os prêmios individuais)
// 5 Fora de campo (família, bens, chuteiras, habilidades, polícia, as barras da vida)
// 6 Homenagem e epílogo (estátua ou camisa aposentada, e o que veio depois)
// Depois vem a carta final de sempre (retireShow).
function rcSur(){const p=String(S.name||'').trim().split(/\s+/);return(p.length>1?p[p.length-1]:p[0]||'Craque')}
function rcClubOf(id,card){return CLUB[id]||(card.clubs||[]).find(x=>x.id===id)||{n:id,c1:'#ff7a2b',c2:'#ffffff'}}
function rcTop(card){return(card.clubs||[]).slice().sort((a,b)=>(b.games||0)-(a.games||0))[0]||null}
const RC_FONT={'A':'01110 10001 10001 11111 10001 10001 10001','B':'11110 10001 10001 11110 10001 10001 11110','C':'01110 10001 10000 10000 10000 10001 01110','D':'11110 10001 10001 10001 10001 10001 11110','E':'11111 10000 10000 11110 10000 10000 11111','F':'11111 10000 10000 11110 10000 10000 10000','G':'01110 10001 10000 10111 10001 10001 01111','H':'10001 10001 10001 11111 10001 10001 10001','I':'01110 00100 00100 00100 00100 00100 01110','J':'00111 00010 00010 00010 00010 10010 01100','K':'10001 10010 10100 11000 10100 10010 10001','L':'10000 10000 10000 10000 10000 10000 11111','M':'10001 11011 10101 10101 10001 10001 10001','N':'10001 10001 11001 10101 10011 10001 10001','O':'01110 10001 10001 10001 10001 10001 01110','P':'11110 10001 10001 11110 10000 10000 10000','Q':'01110 10001 10001 10001 10101 10010 01101','R':'11110 10001 10001 11110 10100 10010 10001','S':'01111 10000 10000 01110 00001 00001 11110','T':'11111 00100 00100 00100 00100 00100 00100','U':'10001 10001 10001 10001 10001 10001 01110','V':'10001 10001 10001 10001 10001 01010 00100','W':'10001 10001 10001 10101 10101 10101 01010','X':'10001 10001 01010 00100 01010 10001 10001','Y':'10001 10001 01010 00100 00100 00100 00100','Z':'11111 00001 00010 00100 01000 10000 11111','0':'01110 10001 10011 10101 11001 10001 01110','1':'00100 01100 00100 00100 00100 00100 01110','2':'01110 10001 00001 00010 00100 01000 11111','3':'11110 00001 00001 01110 00001 00001 11110','4':'00010 00110 01010 10010 11111 00010 00010','5':'11111 10000 11110 00001 00001 10001 01110','6':'00110 01000 10000 11110 10001 10001 01110','7':'11111 00001 00010 00100 01000 01000 01000','8':'01110 10001 10001 01110 10001 10001 01110','9':'01110 10001 10001 01111 00001 00010 01100',',':'000 000 000 000 011 001 010','!':'1 1 1 1 1 0 1','.':'00 00 00 00 00 11 11',' ':'000 000 000 000 000 000 000'};
// mosaico: letras em fonte de pixels (5×7), sempre legíveis na arquibancada
function rcGlyph(ch){const g=RC_FONT[ch]||RC_FONT[' '];return g.split(' ')}
function rcNorm(t){return String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/[^A-Z0-9,.! ]/g,'')}
function rcLineW(t){let w=0;for(const ch of t)w+=rcGlyph(ch)[0].length+1;return Math.max(0,w-1)}
function rcMask(sur,cols,rows){try{sur=rcNorm(sur);const one=`OBRIGADO, ${sur}`;let L;
 if(rcLineW(one)<=cols-2&&rows<16)L=[one];else{let s2=sur;while(rcLineW(s2)>cols-2&&s2.length>1)s2=s2.slice(0,-1);L=['OBRIGADO',s2]}
 if(rcLineW(L[0])>cols-2)L=[sur.slice(0,Math.floor((cols-2)/6))];
 const maxW=Math.max(...L.map(rcLineW));const n=L.length;const sx=Math.max(1,Math.floor((cols-2)/maxW));let sy=Math.max(1,Math.floor((rows-2)/(n*7+(n-1))));const s=Math.min(sx,sy);sy=Math.min(sy,s*2);const kx=s;
 const m=new Array(cols*rows).fill(false);const totH=n*7*sy+(n-1)*sy;let y0=Math.floor((rows-totH)/2);
 L.forEach((t,li)=>{const w=rcLineW(t)*kx;let x=Math.floor((cols-w)/2);const yy=y0+li*8*sy;for(const ch of t){const g=rcGlyph(ch);for(let r=0;r<7;r++)for(let c=0;c<g[r].length;c++)if(g[r][c]==='1')for(let a=0;a<sy;a++)for(let b=0;b<kx;b++){const R_=yy+r*sy+a,C_=x+c*kx+b;if(R_>=0&&R_<rows&&C_>=0&&C_<cols)m[R_*cols+C_]=true}x+=(g[0].length+1)*kx}});
 return m}catch(e){return null}}
function rcShade(h,k){try{h=String(h).replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);const f=v=>Math.round(clamp(k<0?v*(1+k):v+(255-v)*k,0,255)).toString(16).padStart(2,'0');return'#'+f(n>>16&255)+f(n>>8&255)+f(n&255)}catch(e){return h}}
function rcFace(x,y,w,c1,c2){try{return faceSVG(S.face||{preset:0},c1,c2).replace('<svg class="facesvg" ','<svg ').replace('<svg ',`<svg x="${x}" y="${y}" width="${w}" height="${w}" `)}catch(e){return''}}
// cena 1: o estádio
let RC_ASP=1;
function rcStadiumSVG(c1,c2){const asp=RC_ASP,wide=asp>=1;const W=wide?1000:620,H=Math.round(clamp(W/asp,520,1150));
 const cols=wide?92:58,sx=(W-20)/cols,dw=sx*.84,sy=sx*(wide?1.2:1.3),top=46,stB=Math.round(H*(wide?.56:.47)),rows=Math.max(9,Math.floor((stB-12-top)/sy)),x0=10+(W-20-cols*sx)/2;
 const sur=rcSur().toUpperCase();const m=rcMask(sur,cols,rows);const nz=rcShade(c1,-.28);const tc=(typeof l3dDist==='function'&&l3dDist(c1,c2)<130)?(l3dDist(c1,'#ffffff')>200?'#ffffff':'#f2c443'):c2;
 let dots='';for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const on=m&&m[r*cols+c];const col=on?tc:((r*7+c*3)%23===0?nz:c1);dots+=`<rect x="${(x0+c*sx).toFixed(1)}" y="${(top+8+r*sy).toFixed(1)}" width="${dw.toFixed(1)}" height="${(sy*.8).toFixed(1)}" rx="2" fill="${col}"/>`}
 let flashes='';for(let i=0;i<50;i++)flashes+=`<circle class="rc-fl" cx="${R(10,W-10).toFixed(0)}" cy="${R(top+6,stB-14).toFixed(0)}" r="${R(2,4.5).toFixed(1)}" style="animation-delay:${R(0,4).toFixed(2)}s;animation-duration:${R(1.6,3.8).toFixed(2)}s"/>`;
 let paper='';for(let i=0;i<60;i++)paper+=`<rect class="rc-pp" x="${R(0,W).toFixed(0)}" y="-20" width="${R(4,9).toFixed(0)}" height="${R(8,14).toFixed(0)}" fill="${pick([c1,c2,'#f2c443','#ffffff'])}" style="animation-delay:${R(0,6).toFixed(2)}s;animation-duration:${R(4,8).toFixed(2)}s"/>`;
 const n=S.shirt||S.num||9;const pT=stB+28,feet=Math.round(pT+(H-pT)*(wide?.66:.6)),k=wide?1:1.35,cy=Math.round(pT+(H-pT)*.42);
 const band=Array.from({length:6},()=>`OBRIGADO · ${esc(sur)} · ${n}`).join(' · ');
 return`<svg class="rc-stsvg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
 <defs><linearGradient id="rcSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03060d"/><stop offset="1" stop-color="#10213a"/></linearGradient>
 <linearGradient id="rcPitch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22743a"/><stop offset="1" stop-color="#0d3a1c"/></linearGradient>
 <radialGradient id="rcSpot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
 <radialGradient id="rcLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#fff4c8" stop-opacity=".8"/><stop offset="1" stop-color="#fff4c8" stop-opacity="0"/></radialGradient></defs>
 <rect width="${W}" height="${H}" fill="url(#rcSky)"/><circle cx="70" cy="26" r="62" fill="url(#rcLamp)"/><circle cx="${W-70}" cy="26" r="62" fill="url(#rcLamp)"/>
 <rect x="0" y="${top}" width="${W}" height="${stB-top}" fill="#0b0f17"/>
 <g class="rc-dots">${dots}</g>${flashes}
 <rect x="0" y="${stB-10}" width="${W}" height="12" fill="#05080c"/>
 <rect x="0" y="${stB}" width="${W}" height="28" fill="${c1}"/><text x="${W/2}" y="${stB+20}" text-anchor="middle" font-family="Saira Condensed,Impact,sans-serif" font-weight="900" font-style="italic" font-size="19" fill="${c2}" letter-spacing="3">${band}</text>
 <rect x="0" y="${pT}" width="${W}" height="${H-pT}" fill="url(#rcPitch)"/>
 ${[0,1,2,3,4,5].map(i=>`<path d="M${(-W*.3+i*W*.32).toFixed(0)} ${H} L${(W*.06+i*W*.18).toFixed(0)} ${pT} L${(W*.15+i*W*.18).toFixed(0)} ${pT} L${(-W*.14+i*W*.32).toFixed(0)} ${H} Z" fill="#ffffff" opacity=".035"/>`).join('')}
 <ellipse cx="${W/2}" cy="${cy}" rx="${W*.26}" ry="${(H-pT)*.16}" fill="none" stroke="#e8f2e6" stroke-opacity=".5" stroke-width="3"/><line x1="0" y1="${cy}" x2="${W}" y2="${cy}" stroke="#e8f2e6" stroke-opacity=".5" stroke-width="3"/>
 <ellipse cx="${W/2}" cy="${feet-20}" rx="${170*k}" ry="${40*k}" fill="url(#rcSpot)"/>
 <g transform="translate(${W/2} ${feet}) scale(${k}) translate(-500 -556)"><g class="rc-hero">
  <ellipse cx="500" cy="556" rx="46" ry="9" fill="#000" opacity=".35"/>
  <path d="M478 512 L472 556 L486 556 L494 520 Z" fill="#1a1a1a"/><path d="M522 512 L528 556 L514 556 L506 520 Z" fill="#1a1a1a"/>
  <path d="M474 494 L526 494 L524 518 L476 518 Z" fill="#141414"/>
  <path d="M466 440 Q500 430 534 440 L530 496 L470 496 Z" fill="${c1}"/>
  <text x="500" y="478" text-anchor="middle" font-family="Saira Condensed,Impact,sans-serif" font-weight="900" font-size="30" fill="${c2}">${n}</text>
  <g class="rc-arm"><path d="M532 444 L560 404 L568 410 L542 452 Z" fill="${c1}"/><circle cx="566" cy="402" r="8" fill="#c48a5e"/></g>
  <path d="M468 444 L452 486 L460 490 L476 452 Z" fill="${c1}"/>
  ${rcFace(462,368,76,c1,c2)}
 </g></g>${paper}</svg>`}
// cena 3: gráfico do OVR por idade com os pontos na cor do clube
function rcChart(card){const h=card.history||[];if(h.length<2)return'';const W=640,H=260,pl=40,pr=16,pt=20,pb=34;const ages=h.map(x=>x.age),ovr=h.map(x=>x.ovr);
 const a0=Math.min(...ages),a1=Math.max(...ages);const lo=Math.max(30,Math.floor((Math.min(...ovr)-4)/10)*10),hi=Math.min(99,Math.ceil((Math.max(...ovr)+3)/10)*10);
 const X=a=>pl+(a-a0)/Math.max(1,a1-a0)*(W-pl-pr),Y=v=>pt+(1-(v-lo)/Math.max(1,hi-lo))*(H-pt-pb);
 const pts=h.map(x=>[X(x.age),Y(x.ovr)]);const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
 const area=d+` L${pts[pts.length-1][0].toFixed(1)} ${H-pb} L${pts[0][0].toFixed(1)} ${H-pb} Z`;let pk=0;h.forEach((x,i)=>{if(x.ovr>h[pk].ovr)pk=i});
 const grid=[];for(let v=lo;v<=hi;v+=10)grid.push(`<line x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="rgba(238,242,228,.1)"/><text x="${pl-8}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="#a3b7a6" font-family="IBM Plex Mono,monospace">${v}</text>`);
 const ticks=[];const step=Math.max(1,Math.ceil((a1-a0)/8));for(let a=a0;a<=a1;a+=step)ticks.push(`<text x="${X(a)}" y="${H-12}" text-anchor="middle" font-size="11" fill="#a3b7a6" font-family="IBM Plex Mono,monospace">${a}</text>`);
 const dots=h.map((x,i)=>{const c=rcClubOf(x.club,card);return`<circle class="rc-dot" style="animation-delay:${(.3+i/h.length*1.6).toFixed(2)}s" cx="${pts[i][0].toFixed(1)}" cy="${pts[i][1].toFixed(1)}" r="${i===pk?7:4.5}" fill="${c.c1||'#ff7a2b'}" stroke="${i===pk?'#f2c443':'#0b2117'}" stroke-width="${i===pk?3:2}"/>`}).join('');
 return`<svg class="rc-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Geral por idade"><defs><linearGradient id="rcA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2c443" stop-opacity=".32"/><stop offset="1" stop-color="#f2c443" stop-opacity="0"/></linearGradient></defs>
 ${grid.join('')}${ticks.join('')}<path class="rc-area" d="${area}" fill="url(#rcA)"/><path class="rc-line" d="${d}" fill="none" stroke="#f2c443" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" pathLength="1"/>${dots}
 <g class="rc-pk" style="animation-delay:1.9s"><rect x="${Math.min(W-150,Math.max(pl,pts[pk][0]-70))}" y="${Math.max(2,pts[pk][1]-40)}" width="140" height="26" rx="13" fill="#f2c443"/><text x="${Math.min(W-150,Math.max(pl,pts[pk][0]-70))+70}" y="${Math.max(2,pts[pk][1]-40)+17}" text-anchor="middle" font-size="13" font-weight="800" fill="#241a00" font-family="Barlow,sans-serif">Auge: ${h[pk].ovr} aos ${h[pk].age}</text></g></svg>`}
function rcBars(card){const h=card.history||[];if(!h.length)return'';const gk=card.pos==='GOL';const v=h.map(x=>gk?(x.cs||0):(x.g||0));const mx=Math.max(1,...v);
 return`<div class="rc-bars" aria-label="${gk?'Jogos sem sofrer gol':'Gols'} por temporada">${h.map((x,i)=>{const c=rcClubOf(x.club,card);return`<div class="rc-bar" title="${x.age} anos: ${v[i]}"><i style="height:${Math.max(3,v[i]/mx*100)}%;background:${c.c1||'#ff7a2b'};animation-delay:${(.2+i*.05).toFixed(2)}s"></i><small>${x.age}</small></div>`}).join('')}</div>`}
// cena 6: estátua ou camisa aposentada
function rcStatueSVG(c){const f=rcFace(70,8,80,'#888','#ccc');return`<svg class="rc-statue" viewBox="0 0 220 330" aria-hidden="true"><defs><linearGradient id="rcBz" x1="0" x2="1"><stop offset="0" stop-color="#5e3f1a"/><stop offset=".42" stop-color="#d29d55"/><stop offset=".6" stop-color="#b07a3a"/><stop offset="1" stop-color="#4f3415"/></linearGradient>
 <filter id="rcBzF" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".27 .53 .1 0 .3  .19 .37 .07 0 .17  .09 .18 .03 0 .05  0 0 0 1 0"/></filter></defs>
 <rect x="36" y="262" width="148" height="62" rx="4" fill="#7d838a"/><rect x="26" y="252" width="168" height="14" rx="3" fill="#a3a8ae"/><rect x="58" y="280" width="104" height="30" rx="3" fill="#c9a24a"/>
 <text x="110" y="301" text-anchor="middle" font-family="Saira Condensed,Impact,sans-serif" font-weight="900" font-size="19" fill="#3a2a0e">${esc(rcSur().toUpperCase())} ${S.shirt||S.num||''}</text>
 <g fill="url(#rcBz)"><path d="M98 84 L122 84 L120 96 L100 96 Z"/><path d="M74 100 Q110 88 146 100 L142 170 Q110 178 78 170 Z"/>
  <path d="M144 104 L182 54 L192 62 L156 118 Z"/><circle cx="188" cy="52" r="10"/>
  <path d="M76 104 L56 158 L66 163 L88 116 Z"/><circle cx="60" cy="162" r="8"/>
  <path d="M80 168 L140 168 L138 194 L82 194 Z"/>
  <path d="M84 192 L78 248 L98 248 L106 200 Z"/><path d="M136 192 L142 248 L122 248 L114 200 Z"/>
  <path d="M74 244 L100 244 L100 254 L70 254 Z"/><path d="M120 244 L146 244 L150 254 L120 254 Z"/>
  <circle cx="44" cy="238" r="14" opacity=".95"/></g>
 <g filter="url(#rcBzF)">${f}</g></svg>`}
function rcShirtSVG(c1,c2,num,name){return`<svg class="rc-shirt" viewBox="0 0 260 280" aria-hidden="true"><rect x="6" y="6" width="248" height="268" rx="10" fill="#3a2a1a"/><rect x="18" y="18" width="224" height="244" rx="4" fill="#f3efe6"/>
 <path d="M80 50 L110 40 Q130 56 150 40 L180 50 L222 82 L204 116 L184 104 L184 232 L76 232 L76 104 L56 116 L38 82 Z" fill="${c1}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>
 <text x="130" y="112" text-anchor="middle" font-family="Saira Condensed,Impact,sans-serif" font-weight="800" font-size="20" fill="${c2}" letter-spacing="2">${esc(String(name).toUpperCase())}</text>
 <text x="130" y="198" text-anchor="middle" font-family="Saira Condensed,Impact,sans-serif" font-weight="900" font-size="82" fill="${c2}">${num}</text></svg>`}
function rcScenes(card){const c=rcClubOf(S.club,card);const top=rcTop(card);const tc=top?rcClubOf(top.id,card):c;const c1=c.c1||'#ff7a2b',c2=c.c2||'#ffffff';const gk=card.pos==='GOL';const first=String(S.name||'').split(' ')[0];
 const B=typeof ensureBL==='function'?ensureBL():{kids:[],pets:[],cars:[],study:{}};const tier=TIERS[card.tier]?TIERS[card.tier][1]:'';
 // idades por clube
 const span={};for(const h of card.history||[]){const s=span[h.club]||(span[h.club]={a:h.age,b:h.age});s.a=Math.min(s.a,h.age);s.b=Math.max(s.b,h.age)}
 const clubs=(card.clubs||[]).slice().sort((a,b)=>(span[a.id]?span[a.id].a:0)-(span[b.id]?span[b.id].a:0));
 const titles=card.titles||[];const awards=card.awards||[];const kinds={};for(const t of card.rawT||[])kinds[t.n]=kinds[t.n]||t;
 const skills=(()=>{try{return Object.keys(rpgS().has||{}).length}catch(e){return 0}})();const props=(S.props||[]).length,cars=(B.cars||[]).length,boots=(S.bootsOwned||[]).length+((S.bootWall||[]).length);
 const pv=typeof propValue==='function'?(()=>{try{return propValue()}catch(e){return 0}})():0;
 const statue=S.statues&&S.statues.length?S.statues[0]:null,idol=S.idols&&S.idols.length?S.idols[0]:null;const hon=statue||idol||(top&&top.id);const hc=hon?rcClubOf(hon,card):tc;
 const L=S.life||{};const bars=[['😊','Felicidade',L.cab,'#f2c443'],['❤️','Saúde',L.sau,'#ff7aa8'],['💪','Forma',L.corpo,'#8be08a'],['🧠','Inteligência',L.int,'#7cc4ff'],['✨','Aparência',L.apa,'#c9a0ff'],['⭐','Fama',L.fama,'#ff7a2b']].filter(b=>b[2]!=null);
 return[
 {k:'stad',sound:'roar',html:()=>`${rcStadiumSVG(c1,c2)}<div class="rc-cap"><div class="rc-eb">${esc(c.n||'')} · ${S.age} anos · última partida</div><h2>O último jogo</h2><p>O estádio inteiro de pé. A arquibancada virou um mosaico com o seu nome. ${esc(first)} dá a volta olímpica sozinho, devagar, pra guardar cada grito.</p></div>`},
 {k:'traj',html:()=>`<div class="rc-in"><div class="rc-eb">${card.history.length} temporadas · ${clubs.length} clube${clubs.length>1?'s':''}</div><h2>A trajetória</h2>
  <div class="rc-tl">${clubs.map((x,i)=>{const cc=rcClubOf(x.id,card);const sp=span[x.id];return`<div class="rc-club" style="--c1:${cc.c1||'#444'};--c2:${cc.c2||'#fff'};animation-delay:${(.15+i*.18).toFixed(2)}s"><div class="rc-sh">${shieldHTML({...cc,id:x.id},'lg')}</div><div class="rc-cm"><b>${esc(cc.n||x.n)}</b><small>${sp?(sp.a===sp.b?`${sp.a} anos`:`${sp.a} aos ${sp.b} anos`):''} · ${x.seasons} temp.</small>
   <div class="rc-cs"><span><b class="mono">${x.games||0}</b> jogos</span><span><b class="mono">${gk?(x.cs||0):(x.goals||0)}</b> ${gk?'sem sofrer':'gols'}</span><span><b class="mono">${x.titles||0}</b> títulos</span></div>
   ${x.statue?'<em class="tag gold">🗿 Estátua</em>':x.idol?'<em class="tag gold">⭐ Ídolo</em>':x.heart?'<em class="tag">❤️ Clube do coração</em>':''}</div></div>`}).join('')}</div></div>`},
 {k:'nums',html:()=>`<div class="rc-in"><div class="rc-eb">${esc(card.nick||'')}</div><h2>Os números</h2>
  <div class="rc-grid2"><div class="rc-cnt">${[[card.tot.games,'jogos'],[gk?card.tot.cs:card.tot.goals,gk?'sem sofrer gol':'gols'],[card.tot.assists||0,'assistências'],[card.nTitles,'títulos'],[card.bolas||0,'Bolas de Ouro'],[card.caps||0,'jogos pela seleção']].map(([n,l],i)=>`<div style="animation-delay:${(.1+i*.08).toFixed(2)}s"><b class="mono" data-n="${n||0}">0</b><small>${l}</small></div>`).join('')}</div>
  <div class="rc-ch"><div class="rc-cht">Geral por idade</div>${rcChart(card)}<div class="rc-cht">${gk?'Jogos sem sofrer gol':'Gols'} por temporada</div>${rcBars(card)}</div></div></div>`},
 {k:'tro',html:()=>`<div class="rc-in"><div class="rc-eb">${card.nTitles} título${card.nTitles===1?'':'s'}${awards.length?` · ${awards.reduce((s,a)=>s+a.y.length,0)} prêmios`:''}</div><h2>Sala de troféus</h2>
  ${titles.length?`<div class="rc-shelf">${titles.slice(0,16).map((t,i)=>{const r=kinds[t.n]||{};const cc=r.club?rcClubOf(r.club,card):c;return`<div class="rc-tro" style="animation-delay:${(.1+i*.08).toFixed(2)}s"><div class="rc-tri">${(()=>{try{return TROPHY(r.t||'liga',{n:t.n,c1:cc.c1,c2:cc.c2})}catch(e){return'🏆'}})()}</div><b>${esc(t.n)}</b>${t.y.length>1?`<span class="rc-x">${t.y.length}×</span>`:''}<small>${t.y.slice(0,4).join(' · ')}${t.y.length>4?'…':''}</small></div>`}).join('')}</div>`:`<div class="rc-empty"><span>🪵</span><p>A prateleira ficou vazia. Mas ninguém suou a camisa como ele.</p></div>`}
  ${awards.length?`<div class="rc-sub">Prêmios individuais</div><div class="rc-aw">${awards.slice(0,10).map((a,i)=>`<div style="animation-delay:${(.4+i*.06).toFixed(2)}s"><span class="rc-awi">${(()=>{try{return TROPHY(a.t,{n:a.n})}catch(e){return'🏅'}})()}</span><b>${esc(a.n)}</b><small>${a.y.length}×</small></div>`).join('')}</div>`:''}</div>`},
 {k:'life',html:()=>`<div class="rc-in"><div class="rc-eb">Patrimônio de ${money(S.din+pv)}</div><h2>Fora de campo</h2>
  <div class="rc-grid2"><div class="rc-tiles">${[
   ['💍',S.rel==='casado'&&S.gf?`Casado com ${S.gf.n}`:S.rel==='divorciado'?'Divorciado':S.gf?`Namorando ${S.gf.n}`:'Solteiro','Amor'],
   ['👶',B.kids.length?B.kids.map(k=>k.n).slice(0,3).join(', '):S.filhos?`${S.filhos} filho${S.filhos>1?'s':''}`:'Sem filhos','Família'],
   ['🐾',B.pets.length?B.pets.map(p=>p.nome||p.n).slice(0,3).join(', '):'Nenhum','Pets'],
   ['🏠',props?`${props} imóve${props>1?'is':'l'}`:'Nenhum','Imóveis'],['🚗',cars?`${cars} carro${cars>1?'s':''}`:'Nenhum','Garagem'],['👟',boots?`${boots} par${boots>1?'es':''}`:'Só as do clube','Chuteiras'],
   ['🌳',`${skills} de 240`,'Habilidades'],['🎓',B.study&&B.study.deg?'Formado':'Sem diploma','Estudos'],
   ...(S.ficha?[['🚔',`${S.ficha} passage${S.ficha>1?'ns':'m'}`,'Polícia']]:[]),...(S.prisonCups?[['🏆',`${S.prisonCups} Copa${S.prisonCups>1?'s':''} do Pavilhão`,'Presídio']]:[]),...(S.music&&S.music.songs?[['🎤',`${S.music.songs} músicas`,'Música']]:[])
  ].map(([ic,v,l],i)=>`<div class="rc-tile" style="animation-delay:${(.08+i*.06).toFixed(2)}s"><span>${ic}</span><small>${l}</small><b>${esc(v)}</b></div>`).join('')}</div>
  <div class="rc-lb">${bars.map(([ic,n,v,col],i)=>`<div class="rc-lbr"><span>${ic} ${n}</span><i><s style="width:${clamp(Math.round(v),0,100)}%;background:${col};animation-delay:${(.3+i*.1).toFixed(2)}s"></s></i><b class="mono">${Math.round(v)}</b></div>`).join('')}</div></div>
  ${rcMoments(B).length?`<div class="rc-sub">Momentos fora de campo</div><div class="rc-life">${rcMoments(B).map((e,i)=>`<div style="animation-delay:${(.5+i*.07).toFixed(2)}s"><span>${e.ic}</span><b>${esc(e.t)}</b><small class="mono">${e.a!=null?e.a+' anos':''}</small></div>`).join('')}</div>`:''}</div>`},
 {k:'hon',sound:'roar',html:()=>`<div class="rc-in rc-honw"><div class="rc-hon">${statue?rcStatueSVG(hc):rcShirtSVG(hc.c1||c1,hc.c2||c2,S.shirt||S.num||9,rcSur())}<div class="rc-hsh">${shieldHTML({...hc,id:hon},'lg')}</div></div>
  <div class="rc-ep"><div class="rc-eb">${statue?'Para sempre na porta do estádio':idol?'Camisa aposentada':'Homenagem'}</div><h2>${statue?`Estátua no ${esc(hc.n)}`:idol?`A ${S.shirt||S.num} é só sua no ${esc(hc.n)}`:`A ${S.shirt||S.num} vai pro quadro da sala`}</h2>
  <p class="rc-tier">${esc(tier)}</p><div class="rc-sun"><b>E depois?</b><p>${esc(retireEpilogue(card))}</p></div></div></div>`},
 ]}
function rcMoments(B){const skip=/^(Curou|Pegou|Machucou|Sentiu|Gastou|Perdeu \d|Ganhou \d)/;const seen=new Set();const out=[];for(const e of(B.log||[])){if(!e||!e.t||['🤒','💊','🤧','🩹','😷','🩺','🏥','💉'].includes(e.ic)||skip.test(e.t)||seen.has(e.t))continue;seen.add(e.t);out.push(e);if(out.length>=10)break}return out.reverse()}
function rcCount(root){root.querySelectorAll('[data-n]').forEach(el=>{const n=+el.dataset.n||0;const t0=performance.now(),D=1300;const step=t=>{if(!el.isConnected)return;const k=Math.min(1,(t-t0)/D);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)})}
function rcPlay(card){return new Promise(res=>{let sc;try{sc=rcScenes(card)}catch(e){console.error(e);return res()}
 const h=document.createElement('div');h.id='rcine';h.className='rcine';document.body.appendChild(h);document.body.classList.add('rc-open');let i=0;
 const done=()=>{h.remove();document.body.classList.remove('rc-open');res()};
 const show=()=>{RC_ASP=innerWidth/Math.max(1,innerHeight-130);const s=sc[i];let body='';try{body=s.html()}catch(e){console.error(e);body='<div class="rc-in"><h2>…</h2></div>'}
  h.innerHTML=`<div class="rc-top"><div class="rc-prog">${sc.map((_,k)=>`<i class="${k<i?'on':k===i?'cur':''}"></i>`).join('')}</div><button class="rc-skip" id="rcSkip">Pular ›</button></div>
  <section class="rc-s sc-${s.k}">${body}</section>
  <div class="rc-nav">${i?'<button class="rc-back" id="rcBack" aria-label="Cena anterior">‹ Voltar</button>':''}<button class="rc-next" id="rcNext">${i===sc.length-1?'Ver a carta final':'Próximo'} ›</button></div>`;
  try{if(s.sound&&typeof SFX!=='undefined'&&SFX[s.sound])SFX[s.sound]()}catch(e){}
  rcCount(h);
  document.getElementById('rcNext').onclick=()=>{i++;if(i>=sc.length)done();else show()};
  const bk=document.getElementById('rcBack');if(bk)bk.onclick=()=>{i=Math.max(0,i-1);show()};
  document.getElementById('rcSkip').onclick=done};
 show()})}
if(typeof retireCutscene==='function')retireCutscene=function(card){return rcPlay(card)};
{const st=document.createElement('style');st.textContent=`
.rcine{position:fixed;inset:0;z-index:60;display:grid;grid-template-rows:auto minmax(0,1fr) auto;background:radial-gradient(120% 80% at 50% 0%,#17402a,#081a10 70%);color:var(--chalk);overflow:hidden}
body.rc-open{overflow:hidden}
.rc-top{position:relative;z-index:3;display:flex;align-items:center;gap:12px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 8px}
.rc-prog{flex:1;display:grid;grid-auto-flow:column;gap:5px}.rc-prog i{height:4px;border-radius:3px;background:rgba(238,242,228,.18)}.rc-prog i.on{background:var(--gold)}.rc-prog i.cur{background:linear-gradient(90deg,var(--gold) 50%,rgba(238,242,228,.18) 50%);background-size:200% 100%;animation:rcprog 3s linear forwards}
@keyframes rcprog{from{background-position:100% 0}to{background-position:0 0}}
.rc-skip{height:34px;padding:0 14px;border-radius:999px;border:1px solid var(--line-2);background:rgba(5,16,10,.5);color:var(--chalk);font:700 14px var(--f-body)}
.rc-s{position:relative;min-height:0;overflow-y:auto;overflow-x:hidden;animation:rcin .5s cubic-bezier(.2,1,.3,1) both}
@keyframes rcin{from{opacity:0;transform:translateY(16px)}}
.rc-in{display:grid;gap:12px;align-content:start;max-width:1180px;margin:0 auto;padding:6px 18px 20px}
.rc-eb{font:700 13px var(--f-body);color:var(--gold)}
.rc-s h2{margin:0;font:900 italic clamp(32px,9vw,64px)/.95 var(--f-display);text-transform:uppercase;letter-spacing:.005em}
.rc-nav{position:relative;z-index:3;display:flex;gap:10px;padding:10px 16px calc(14px + env(safe-area-inset-bottom,0px));background:linear-gradient(180deg,transparent,rgba(3,10,6,.85) 40%)}
.rc-next{flex:1;min-height:54px;border:0;border-radius:var(--r-md);background:var(--accent);color:var(--accent-ink);font:900 italic 20px var(--f-display);text-transform:uppercase;box-shadow:0 4px 0 #b44a0c}
.rc-back{min-height:54px;padding:0 18px;border-radius:var(--r-md);border:1px solid var(--line-2);background:rgba(5,16,10,.5);color:var(--chalk);font:700 15px var(--f-body)}
/* 1 estádio */
.rc-stsvg{position:absolute;inset:0;width:100%;height:100%;animation:rczoom 9s ease-out both}
@keyframes rczoom{from{transform:scale(1.07) translateY(-1.5%)}to{transform:scale(1)}}
.rc-fl{fill:#fff;opacity:0;animation:rcfl 2.6s infinite}@keyframes rcfl{0%,86%,100%{opacity:0}90%{opacity:1}}
.rc-pp{animation:rcpp 6s linear infinite}@keyframes rcpp{to{transform:translateY(640px) rotate(540deg)}}
.rc-arm{transform-origin:536px 448px;animation:rcwave 1.1s ease-in-out infinite alternate}@keyframes rcwave{from{transform:rotate(-12deg)}to{transform:rotate(14deg)}}
.rc-dots{animation:rcdots 2.4s ease-in-out infinite alternate}@keyframes rcdots{to{transform:translateY(-2px)}}
.rc-stsvg .rc-hero{animation:rchero 1.2s .4s cubic-bezier(.2,1,.3,1) both}@keyframes rchero{from{transform:translateY(40px);opacity:0}}
.rc-cap{position:absolute;left:0;right:0;bottom:0;display:grid;gap:8px;padding:60px 20px 10px;background:linear-gradient(180deg,transparent,rgba(3,10,6,.9) 45%)}
.rc-cap p{margin:0;max-width:640px;font-size:16px;line-height:1.45;color:#dfe6d6}
/* 2 trajetória */
.rc-tl{display:grid;gap:10px}
.rc-club{display:flex;gap:14px;align-items:center;padding:12px 14px;border-radius:var(--r-lg);background:linear-gradient(90deg,color-mix(in srgb,var(--c1) 38%,var(--panel)),var(--panel) 60%);border:1px solid var(--line);border-left:6px solid var(--c1);animation:rcpop .5s cubic-bezier(.2,1,.3,1) both}
@keyframes rcpop{from{opacity:0;transform:translateY(14px) scale(.97)}}
.rc-sh .shield{width:58px!important;height:66px!important}.rc-cm{display:grid;gap:3px;min-width:0}.rc-cm>b{font:800 italic 22px/1 var(--f-display);text-transform:uppercase}.rc-cm>small{color:var(--muted);font-size:13px}
.rc-cs{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:13px;color:#dfe6d6}.rc-cs b{font-size:16px;color:var(--chalk)}.rc-cm .tag{justify-self:start}
/* 3 números */
.rc-grid2{display:grid;gap:14px}
.rc-cnt{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.rc-cnt>div{display:grid;justify-items:center;padding:12px 4px;border-radius:var(--r-md);background:var(--panel);border:1px solid var(--line);animation:rcpop .5s both}
.rc-cnt b{font-size:clamp(24px,7vw,40px);color:var(--gold);line-height:1.1}.rc-cnt small{font-size:12px;color:var(--muted);text-align:center}
.rc-ch{display:grid;gap:8px;padding:12px;border-radius:var(--r-lg);background:var(--panel);border:1px solid var(--line)}.rc-cht{font:700 13px var(--f-body);color:var(--muted)}
.rc-chart{width:100%;height:auto;display:block}.rc-line{stroke-dasharray:1;stroke-dashoffset:1;animation:rcdraw 1.8s .2s ease-out forwards}@keyframes rcdraw{to{stroke-dashoffset:0}}
.rc-area{opacity:0;animation:rcfade .8s 1.4s forwards}@keyframes rcfade{to{opacity:1}}.rc-dot,.rc-pk{opacity:0;animation:rcfade .3s forwards}
.rc-bars{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:3px;align-items:end;height:96px}.rc-bar{display:grid;grid-template-rows:1fr auto;height:100%;min-width:0}.rc-bar i{align-self:end;display:block;border-radius:3px 3px 0 0;transform-origin:bottom;animation:rcgrow .6s cubic-bezier(.2,1,.3,1) both}.rc-bar small{font:600 9.5px var(--f-mono);color:var(--dim);text-align:center;overflow:hidden}
@keyframes rcgrow{from{transform:scaleY(0)}}
/* 4 troféus */
.rc-shelf{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;padding:14px;border-radius:var(--r-lg);background:linear-gradient(180deg,#3b2a18,#24180c);border:1px solid #6b4a22;box-shadow:inset 0 -10px 0 #4a3218}
.rc-tro{position:relative;display:grid;justify-items:center;gap:4px;text-align:center;animation:rcpop .5s both}.rc-tri{width:96px;height:110px;display:grid;place-items:center;font-size:56px}.rc-tri svg,.rc-tri img{width:100%;height:100%;object-fit:contain}
.rc-tro b{font-size:13.5px;line-height:1.2}.rc-tro small{font:600 11px var(--f-mono);color:#d8c7a8}.rc-x{position:absolute;top:0;right:8px;min-width:30px;padding:2px 6px;border-radius:10px;background:var(--gold);color:#241a00;font:800 13px var(--f-mono)}
.rc-sub{font:700 13px var(--f-body);color:var(--muted);margin-top:4px}.rc-aw{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.rc-aw>div{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--r-md);background:var(--panel);border:1px solid var(--line);animation:rcpop .5s both}
.rc-awi{width:38px;height:44px;flex:0 0 auto;display:grid;place-items:center;font-size:26px}.rc-awi svg,.rc-awi img{width:100%;height:100%}.rc-aw b{font-size:13px;flex:1;line-height:1.2}.rc-aw small{font:700 12px var(--f-mono);color:var(--gold)}
.rc-empty{display:grid;justify-items:center;gap:8px;padding:30px;border-radius:var(--r-lg);background:var(--panel);text-align:center}.rc-empty span{font-size:52px}.rc-empty p{margin:0;color:var(--muted)}
/* 5 vida */
.rc-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.rc-tile{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:10px;align-items:center;padding:10px 12px;border-radius:var(--r-md);background:var(--panel);border:1px solid var(--line);animation:rcpop .5s both}
.rc-tile span{grid-row:1/3;font-size:28px}.rc-tile small{font-size:11.5px;color:var(--muted)}.rc-tile b{font-size:14px;line-height:1.25;overflow-wrap:anywhere}
.rc-lb{display:grid;gap:10px;padding:14px;border-radius:var(--r-lg);background:var(--panel);border:1px solid var(--line);align-content:start}.rc-lbr{display:grid;grid-template-columns:130px 1fr 36px;gap:10px;align-items:center;font-size:13.5px;font-weight:700;color:var(--muted)}
.rc-life{display:grid;gap:6px;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))}.rc-life>div{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--r-md);background:rgba(5,16,10,.45);border:1px solid var(--line);animation:rcpop .45s both}.rc-life span{font-size:22px}.rc-life b{flex:1;font-size:14px;font-weight:600}.rc-life small{color:var(--muted);font-size:12px}
.rc-lbr i{height:10px;border-radius:6px;background:rgba(238,242,228,.1);overflow:hidden}.rc-lbr s{display:block;height:100%;border-radius:6px;transform-origin:left;animation:rcgrowx .9s cubic-bezier(.2,1,.3,1) both}.rc-lbr b{text-align:right;color:var(--chalk)}
@keyframes rcgrowx{from{transform:scaleX(0)}}
/* 6 homenagem */
.rc-honw{align-items:center}.rc-hon{position:relative;display:grid;place-items:center;padding:10px;animation:rcpop .7s both}.rc-statue,.rc-shirt{width:min(70vw,300px);height:auto;filter:drop-shadow(0 18px 30px rgba(0,0,0,.5))}
.rc-hsh{position:absolute;right:calc(50% - min(35vw,150px) - 10px);bottom:4px}.rc-hsh .shield{width:56px!important;height:64px!important}
.rc-ep{display:grid;gap:10px}.rc-tier{margin:0;font:800 16px var(--f-body);color:var(--gold)}
.rc-sun{display:grid;gap:6px;padding:16px;border-radius:var(--r-lg);background:linear-gradient(120deg,rgba(255,122,43,.35),rgba(242,196,67,.15) 50%,rgba(20,52,36,.8));border:1px solid rgba(242,196,67,.4)}.rc-sun b{font:900 italic 20px var(--f-display);text-transform:uppercase}.rc-sun p{margin:0;font-size:16px;line-height:1.5}
@media (min-width:700px){
 .rc-top{padding:14px 28px 10px}.rc-in{padding:10px 28px 24px;gap:18px}.rc-nav{padding:12px 28px 20px;justify-content:flex-end}.rc-next{flex:0 1 380px}
 .rc-cap{padding:90px 40px 16px}.rc-cap p{font-size:19px;max-width:760px}
 .rc-tl{grid-template-columns:repeat(auto-fill,minmax(330px,1fr))}.rc-club{padding:16px}.rc-sh .shield{width:72px!important;height:82px!important}.rc-cm>b{font-size:26px}.rc-cs{font-size:14px}.rc-cs b{font-size:19px}
 .rc-cnt{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.rc-cnt>div{padding:18px 6px}.rc-cnt b{font-size:48px}.rc-cnt small{font-size:14px}
 .rc-ch{padding:18px;gap:12px}.rc-cht{font-size:15px}.rc-bars{height:150px}.rc-bar small{font-size:11px}
 .rc-tiles{grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.rc-tile{padding:14px}.rc-tile span{font-size:34px}.rc-tile b{font-size:16px}.rc-tile small{font-size:12.5px}
 .rc-lb{padding:20px;gap:16px}.rc-lbr{grid-template-columns:170px 1fr 44px;font-size:16px}.rc-lbr i{height:14px}
 .rc-statue,.rc-shirt{width:min(62vw,440px)}.rc-hsh .shield{width:76px!important;height:86px!important}.rc-hsh{right:calc(50% - min(31vw,220px) - 6px)}
 .rc-sun p{font-size:18px}.rc-tier{font-size:18px}
}
/* telas deitadas (iPad na horizontal, computador): duas colunas */
@media (min-width:700px) and (min-aspect-ratio:1/1){
 .rc-grid2{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);align-items:start}
 .rc-cnt{grid-template-columns:repeat(2,minmax(0,1fr))}.rc-cnt b{font-size:44px}
 .rc-tiles{grid-template-columns:repeat(2,minmax(0,1fr))}
 .rc-honw{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);min-height:100%}.rc-statue,.rc-shirt{width:min(36vw,400px)}.rc-hsh{right:calc(50% - min(18vw,200px) - 6px)}
}
@media (min-width:1100px) and (min-aspect-ratio:1/1){.rc-cnt{grid-template-columns:repeat(3,minmax(0,1fr))}.rc-tiles{grid-template-columns:repeat(3,minmax(0,1fr))}.rc-shelf{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}}
`;document.head.appendChild(st)}
