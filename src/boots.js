// ================== CHUTEIRAS: vitrine por raridade, coleção, desgaste, conserto, personalização e patrocínio ==================
// Seis marcas (fictícias), cada uma com uma especialidade, de Comum a Ícone, mais as luvas de goleiro.
// A chuteira que você usa aparece no seu jogador nos lances em 3D.
const BT_TIER=[{n:'Comum',col:'#9aa4ad',p:.006,g:32,tot:2},{n:'Rara',col:'#3fa2ff',p:.05,g:45,tot:4},{n:'Épica',col:'#b46cff',p:.25,g:55,tot:6},{n:'Lendária',col:'#f2c443',p:1.1,g:68,tot:8},{n:'Ícone',col:'#ff4d6d',p:3.6,g:85,tot:11}];
const BT_REQ=[null,null,{ovr:68},{ovr:76,fama:40},{ovr:84,fama:65}];
const BT_BRANDS={
 raio:{n:'Raio',ic:'⚡',f:'Velocidade',a:['VEL','DRI','FIN'],mark:'bolt',m:['Sprint','Flash','Turbo','Supersônica','Trovão Zero'],c:[['#f5f5f5','#ffb800','#222'],['#ffe600','#111','#111'],['#ff3d00','#ffe600','#1a1a1a'],['#00e5ff','#ff2d7a','#101820'],['#ffd400','#111','#ffd400']]},
 maestro:{n:'Maestro',ic:'🎼',f:'Passe e controle',a:['PAS','DRI','MEN'],mark:'wave',m:['Touch','Visão','Regente','Sinfonia','Ópera Prima'],c:[['#2b2b2b','#d9d9d9','#e8e8e8'],['#1e4fd8','#fff','#fff'],['#0b1f3a','#38d6ff','#0b1f3a'],['#f2f2f2','#b8860b','#111'],['#101010','#f2c443','#f2c443']]},
 art:{n:'Artilheira',ic:'🎯',f:'Finalização',a:['FIN','FIS','VEL'],mark:'star',m:['Pro','Canhão','Matadora','Goleadora X','Chuteira de Ouro'],c:[['#c8102e','#fff','#222'],['#111','#ff2a2a','#ff2a2a'],['#ff2a2a','#111','#111'],['#8a0f1e','#f2c443','#111'],['#f2c443','#c8102e','#c8102e']]},
 mur:{n:'Muralha',ic:'🛡️',f:'Defesa e físico',a:['DEF','FIS','MEN'],mark:'shield',m:['Grip','Couraça','Fortaleza','Titânio','Inquebrável'],c:[['#3b4a3f','#c6d1c6','#111'],['#4a5560','#ff7a00','#111'],['#0d3b2e','#7dff9a','#0d3b2e'],['#9aa4ad','#111','#111'],['#e6e6e6','#20c4bd','#111']]},
 ginga:{n:'Ginga',ic:'🪄',f:'Drible',a:['DRI','VEL','PAS'],mark:'swirl',m:['Samba','Malandra','Pedalada','Elástico','Joga Bonito'],c:[['#2bd46a','#ffe600','#14532d'],['#7a2bd4','#2bd46a','#111'],['#ffe600','#2b6bd4','#2b6bd4'],['#ff7aa8','#111','#111'],['#2bd46a','#ffe600','#1f4fd8']]},
 cor:{n:'Coringa',ic:'🃏',f:'Equilibrada',a:['FIN','PAS','DRI','VEL'],mark:'chev',m:['Base','Plus','Tour','Elite','Absoluta'],c:[['#e8e8e8','#111','#555'],['#111','#e8e8e8','#e8e8e8'],['#6b6b6b','#ff6a12','#111'],['#101820','#f2c443','#101820'],['#ffffff','#f2c443','#f2c443']]},
 luva:{n:'Garra',ic:'🧤',f:'Luvas de goleiro',a:['REF','MEN','FIS'],mark:'glove',gk:true,m:['Base','Reflex','Paredão','Voadora','Mãos de Ouro'],c:[['#e8e8e8','#20c4bd','#222'],['#20c4bd','#111','#111'],['#ff6a12','#111','#111'],['#111','#c6f03c','#111'],['#f2c443','#111','#111']]},
};
function btSplit(attrs,tot){const w=attrs.length===4?[.3,.3,.2,.2]:[.5,.3,.2];const o={};let left=tot;attrs.forEach((k,i)=>{const v=i===attrs.length-1?left:Math.max(1,Math.round(tot*w[i]));if(v>0){o[k]=v;left-=v}});for(const k in o)if(o[k]<=0)delete o[k];return o}
// a linha antiga (b1..b8) continua valendo nos saves
Object.assign(BOOTS.find(b=>b.id==='b1')||{},{brand:'cor',tier:0,c:['#e8e8e8','#2b6bd4','#555']});
Object.assign(BOOTS.find(b=>b.id==='b2')||{},{brand:'raio',tier:1,c:['#ffe600','#111','#111']});
Object.assign(BOOTS.find(b=>b.id==='b3')||{},{brand:'maestro',tier:1,c:['#1e4fd8','#fff','#fff']});
Object.assign(BOOTS.find(b=>b.id==='b4')||{},{brand:'art',tier:2,c:['#ff2a2a','#111','#111']});
Object.assign(BOOTS.find(b=>b.id==='b5')||{},{brand:'mur',tier:1,c:['#4a5560','#ff7a00','#111']});
Object.assign(BOOTS.find(b=>b.id==='b6')||{},{brand:'luva',tier:1,c:['#20c4bd','#111','#111']});
Object.assign(BOOTS.find(b=>b.id==='b7')||{},{brand:'cor',tier:2,c:['#101820','#ff6a12','#101820']});
Object.assign(BOOTS.find(b=>b.id==='b8')||{},{brand:'cor',tier:3,c:['#f2c443','#fff','#f2c443']});
for(const[bk,B]of Object.entries(BT_BRANDS))B.m.forEach((mn,t)=>{const T=BT_TIER[t];BOOTS.push({id:`${bk}${t}`,n:`${B.n} ${mn}`,brand:bk,tier:t,p:+(T.p*(1+(((bk.charCodeAt(0)+bk.length*3+t*7)%9)-4)*.05)).toFixed(4),g:T.g,b:btSplit(B.a,T.tot),c:B.c[t],gk:!!B.gk,d:`${B.f}. ${['Pra começar bem.','Material leve e resistente.','Tecnologia de seleção.','Feita sob medida.','Edição limitada e numerada.'][t]}`})});
const BT_FOCUS=[['all','Todas'],['VEL','Velocidade'],['FIN','Finalização'],['PAS','Passe'],['DRI','Drible'],['DEF','Defesa'],['REF','Luvas']];
let BT_F='all';
function btOf(id){return BOOTS.find(b=>b.id===id)}
function btTier(b){return BT_TIER[b.tier??(b.p>=1.5?3:b.p>=.4?2:b.p>=.03?1:0)]}
function btReqWhy(b){const r=BT_REQ[b.tier??0];if(!r)return null;if(S.ovr>=(r.ovr||0))return null;if(r.fama&&S.life.fama>=r.fama)return null;return`Precisa de OVR ${r.ovr}${r.fama?` ou fama ${r.fama}`:''}`}
function ensureBoots(){ensureLife();if(S.sigBoot&&!btOf('sig'))BOOTS.push(S.sigBoot);if(!Array.isArray(S.bootsOwned))S.bootsOwned=[];S.bootsOwned=S.bootsOwned.filter(x=>x&&typeof x==='object'&&btOf(x.id));
 if(S.boot&&!S.bootsOwned.find(x=>x.id===S.boot))S.bootsOwned.push({id:S.boot,left:S.bootLeft||0,rep:0});
 const e=S.boot&&S.bootsOwned.find(x=>x.id===S.boot);if(e)e.left=S.bootLeft;return S.bootsOwned}
function btEntry(id){return ensureBoots().find(x=>x.id===id)}
function btColors(id){const b=btOf(id);const e=btEntry(id);return[(e&&e.c1)||b.c[0],(e&&e.c2)||b.c[1],b.c[2]]}
function btEquip(id){const e=btEntry(id);if(!e||e.left<=0)return false;ensureBoots();S.boot=id;S.bootLeft=e.left;return true}
// desenho da chuteira (de lado, bico pra direita)
function bootSVG(id,opt={}){const b=btOf(id)||BOOTS[0];const[c1,c2,c3]=opt.c||btColors(id);const br=BT_BRANDS[b.brand]||BT_BRANDS.cor;const w=opt.w||120;
 if(br.mark==='glove')return`<svg viewBox="0 0 120 80" width="${w}" class="btsvg"><path d="M38 76 L36 44 Q34 30 40 22 L44 10 Q48 4 52 10 L54 26 L56 8 Q60 2 64 8 L65 26 L68 10 Q72 4 76 10 L76 30 L80 18 Q85 12 88 20 L86 46 Q84 60 74 68 L72 76 Z" fill="${c1}" stroke="rgba(0,0,0,.35)" stroke-width="2"/><path d="M38 64 L74 64 L72 76 L38 76 Z" fill="${c2}"/><path d="M44 40 Q60 34 78 40" stroke="${c2}" stroke-width="5" fill="none"/><text x="56" y="73" font-size="8" font-weight="900" fill="${c1}" text-anchor="middle" font-family="sans-serif">${esc(br.n.toUpperCase())}</text></svg>`;
 const mark={bolt:`<path d="M54 26 L44 38 L52 38 L46 50 L62 34 L54 34 L60 26 Z" fill="${c2}"/>`,wave:`<path d="M34 40 Q44 30 54 40 T74 40 T94 38" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/>`,star:`<path d="M58 26 L61 34 L70 34 L63 39 L66 47 L58 42 L50 47 L53 39 L46 34 L55 34 Z" fill="${c2}"/>`,
  shield:`<path d="M40 30 L80 26 L96 34 L94 44 L42 46 Z" fill="${c2}" opacity=".9"/>`,swirl:`<path d="M36 44 Q50 22 66 36 Q78 46 92 32" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="66" cy="36" r="3" fill="${c2}"/>`,chev:`<path d="M38 46 L52 30 L58 30 L46 46 Z M52 46 L66 30 L72 30 L60 46 Z M66 46 L80 30 L86 30 L74 46 Z" fill="${c2}"/>`}[br.mark]||'';
 return`<svg viewBox="0 0 124 66" width="${w}" class="btsvg"><path d="M8 46 L116 46 Q118 53 110 54 L16 54 Q7 54 8 46 Z" fill="${c3}"/><g fill="${c3}" opacity=".95"><path d="M18 54 h7 l-1 7 h-5 z"/><path d="M33 54 h7 l-1 7 h-5 z"/><path d="M70 54 h7 l-1 7 h-5 z"/><path d="M86 54 h7 l-1 7 h-5 z"/><path d="M101 54 h6 l-1 6 h-4 z"/></g>
 <path d="M10 47 L10 26 Q10 15 22 13 L36 12 Q46 18 57 13 L64 11 Q75 20 90 26 Q110 32 116 40 Q118 46 112 47 Z" fill="${c1}" stroke="rgba(0,0,0,.28)" stroke-width="1.5"/>
 <path d="M10 26 Q10 15 22 13 L36 12 Q46 18 57 13 L58 18 Q46 23 36 17 L22 18 Q15 20 14 28 Z" fill="${c2}" opacity=".85"/>${mark}
 <g stroke="${c2==='#fff'||c2==='#ffffff'?'#222':'#fff'}" stroke-width="2.2" stroke-linecap="round" opacity=".9"><path d="M62 15 l4 -4"/><path d="M68 18 l4 -4"/><path d="M74 21 l4 -4"/><path d="M80 24 l4 -4"/></g>
 <path d="M96 30 Q108 34 112 40" stroke="rgba(255,255,255,.45)" stroke-width="3" fill="none" stroke-linecap="round"/><text x="26" y="42" font-size="6.5" font-weight="900" fill="${c2}" font-family="sans-serif" opacity=".9">${esc(br.n.toUpperCase())}</text></svg>`}
function btBon(b){return Object.entries(b.b).map(([k,v])=>`<span class="chip up">+${v} ${ATTR_NAME[k]}</span>`).join('')}
function btBadge(b){const T=btTier(b);return`<span class="bt-tier" style="--t:${T.col}">${T.n}</span>`}

// ---------- desgaste, patrocínio e kit da temporada ----------
{const _lt=lifeTick;lifeTick=function(me){const prev=S.boot;const r=_lt(me);try{ensureBoots();const e=prev&&S.bootsOwned.find(x=>x.id===prev);if(e){e.left=prev===S.boot?S.bootLeft:0;if(!S.boot&&prev){const nx=S.bootsOwned.filter(x=>x.left>0).sort((a,b)=>(btOf(b.id).tier||0)-(btOf(a.id).tier||0))[0];if(nx){btEquip(nx.id);(S.st.lifeNews=S.st.lifeNews||[]).push(`Você calçou a ${btOf(nx.id).n}.`)}}}
 const sp=S.spons;if(sp&&me&&me.play){const cur=S.boot&&btOf(S.boot);if(cur&&cur.brand===sp.brand){S.din+=sp.pay;if(S.sigBoot&&S.boot==='sig')S.din+=sp.pay*.5}else{sp.strikes=(sp.strikes||0)+1;if(sp.strikes>=3){(S.st.lifeNews=S.st.lifeNews||[]).push(`A ${BT_BRANDS[sp.brand].n} rompeu o patrocínio: você jogou com outra marca. Multa de ${money(.02)}.`);S.din=Math.max(0,S.din-.02);S.spons=null;blog&&blog('👟','Perdeu o patrocínio')}else if(sp.strikes===1)(S.st.lifeNews=S.st.lifeNews||[]).push(`A ${BT_BRANDS[sp.brand].n} reclamou: você jogou sem a chuteira da marca.`)}}
 }catch(e){console.error(e)}return r}}
{const _lse=lifeSeasonEnd;lifeSeasonEnd=function(...a){const r=_lse.apply(this,a);try{ensureBoots();const sp=S.spons;if(sp){if(S.year+1>sp.until){(S.st.lifeNews=S.st.lifeNews||[]).push(`Acabou seu contrato com a ${BT_BRANDS[sp.brand].n}.`);S.spons=null}else{const kit=btKit(sp.brand);if(kit)btGive(kit.id)}}S.sponsOff=null}catch(e){console.error(e)}return r}}
function btKit(brand){const list=BOOTS.filter(b=>b.brand===brand&&b.id!=='sig'&&!btReqWhy(b)&&b.id.startsWith(brand));return list.sort((a,b)=>b.tier-a.tier)[0]||null}
function btGive(id){const b=btOf(id);const e=btEntry(id);if(e){e.left=b.g;e.rep=0}else S.bootsOwned.push({id,left:b.g,rep:0});if(!S.boot||S.bootLeft<=0)btEquip(id)}
function btOffers(){if(S.spons)return[];if(S.life.fama<22&&S.ovr<72)return[];if(S.sponsOff&&S.sponsOff.y===S.year)return S.sponsOff.list;
 const brands=shuffle(Object.keys(BT_BRANDS).filter(k=>S.pos==='GOL'?k==='luva'||k==='mur':k!=='luva')).slice(0,S.life.fama>55?3:2);
 const list=brands.map(br=>{const pay=+(.001+Math.pow(S.life.fama/100,1.6)*.05+Math.max(0,S.ovr-70)*.0009).toFixed(4)*R(.85,1.15);return{brand:br,pay:+pay.toFixed(4),years:RI(1,3)}});S.sponsOff={y:S.year,list};return list}

// ---------- páginas (dentro do menu Loja) ----------
function btCard(b,own){const why=btReqWhy(b);const T=btTier(b);return`<button class="bt-card ${own?'own':''}" data-bt="${b.id}" style="--t:${T.col}">${bootSVG(b.id,{w:118})}<div class="bt-cm"><div class="bt-ct">${btBadge(b)}<b>${esc(b.n)}</b></div><div class="chipsrow">${btBon(b)}</div><small>${own?(own.left>0?`🔋 ${own.left}/${b.g} jogos`:'🪫 gasta'):why?`🔒 ${why}`:`${money(b.p)} · ${b.g} jogos`}</small></div></button>`}
function bootsPage(){return{t:'Chuteiras',col:'shop',html:()=>{ensureBoots();const cur=S.boot&&btOf(S.boot);const ce=cur&&btEntry(cur.id);const gk=S.pos==='GOL';
 const top=cur?`<div class="bt-hero" style="--t:${btTier(cur).col}"><div class="bt-hs">${bootSVG(cur.id,{w:220})}</div><div class="bt-hm"><div class="bt-ct">${btBadge(cur)}<span class="muted2">${BT_BRANDS[cur.brand]?BT_BRANDS[cur.brand].ic+' '+BT_BRANDS[cur.brand].n:''}</span></div><b class="bt-hn">${esc(cur.n)}</b><div class="chipsrow">${btBon(cur)}</div>
  <div class="bt-dur"><i style="width:${Math.round(S.bootLeft/cur.g*100)}%;background:${S.bootLeft/cur.g<.25?'#ff5a4a':'#2bd46a'}"></i></div><small class="muted2">${S.bootLeft}/${cur.g} jogos de vida · OVR em campo ${bootPerf()>=0?'+':''}${bootPerf().toFixed(1)}</small></div></div>`
  :`<div class="bt-hero empty"><div class="bt-hs">${bootSVG('b1',{w:200,c:['#cfd6dc','#9aa4ad','#9aa4ad']})}</div><div class="bt-hm"><b class="bt-hn">Chuteira de treino</b><small class="muted2">Sem chuteira boa. Compre uma na vitrine: elas sobem seus atributos em campo e nos lances.</small></div></div>`;
 const owned=S.bootsOwned.map(e=>[btOf(e.id),e]).filter(x=>x[0]);
 const filt=BOOTS.filter(b=>b.id!=='sig'&&(gk?true:!b.gk)&&(BT_F==='all'||(BT_F==='REF'?b.gk:(!b.gk&&Object.keys(b.b)[0]===BT_F)))).sort((a,b)=>(a.tier??0)-(b.tier??0)||a.p-b.p);
 const sp=S.spons;const offs=btOffers();
 const spons=sp?`<div class="bl-box"><b>🤝 Patrocínio: ${BT_BRANDS[sp.brand].ic} ${BT_BRANDS[sp.brand].n}</b><small>${money(sp.pay)} por jogo usando a marca · até ${seasonLbl(sp.until)}${sp.strikes?` · ⚠️ ${sp.strikes}/3 avisos`:''}</small><small>Todo começo de temporada a marca te manda o melhor modelo que você pode usar.</small>
  ${!S.sigBoot&&S.life.fama>=70&&S.ovr>=82?`<button class="btn small" id="btSig">✍️ Lançar a sua chuteira assinatura</button>`:S.sigBoot?`<small>✍️ Sua assinatura: <b>${esc(S.sigBoot.n)}</b> rende 50% a mais por jogo.</small>`:'<small class="muted2">Com fama 70 e OVR 82, a marca lança uma chuteira com o seu nome.</small>'}</div>`
  :offs.length?`<div class="bl-box"><b>🤝 Propostas de patrocínio</b><small>Você precisa jogar com a chuteira da marca. Três jogos com outra e o contrato cai.</small>${offs.map((o,i)=>`<button class="bl-row2" data-off="${i}"><span>${BT_BRANDS[o.brand].ic}</span><div><b>${BT_BRANDS[o.brand].n}</b><small>${money(o.pay)} por jogo · ${o.years} temporada${o.years>1?'s':''} · chuteira grátis todo ano</small></div><em>Assinar</em></button>`).join('')}</div>`
  :`<div class="bl-box"><b>🤝 Patrocínio</b><small class="muted2">As marcas procuram quem aparece: com fama 22 ou OVR 72, chegam propostas.</small></div>`;
 return`${top}${spons}
  <h4 class="bl-sec">Minha coleção · ${owned.length}</h4>${owned.length?`<div class="bt-list">${owned.map(([b,e])=>btCard(b,e)).join('')}</div>`:'<p class="bl-empty">Nenhuma chuteira ainda.</p>'}
  <h4 class="bl-sec">Vitrine</h4><div class="bt-filt">${BT_FOCUS.filter(f=>gk||f[0]!=='REF').map(([k,n])=>`<button class="${BT_F===k?'on':''}" data-btf="${k}">${n}</button>`).join('')}</div>
  <div class="bt-list">${filt.map(b=>btCard(b,null)).join('')}</div>`},
 bind:root=>{root.querySelectorAll('[data-btf]').forEach(x=>x.onclick=()=>{BT_F=x.dataset.btf;blRefresh(true)});
  root.querySelectorAll('[data-bt]').forEach(x=>x.onclick=()=>btDetail(x.dataset.bt));
  root.querySelectorAll('[data-off]').forEach(x=>x.onclick=async()=>{const o=btOffers()[+x.dataset.off];const r=await blResult({ic:BT_BRANDS[o.brand].ic,title:`Patrocínio ${BT_BRANDS[o.brand].n}`,txt:`${money(o.pay)} por jogo, por ${o.years} temporada${o.years>1?'s':''}. Você ganha o melhor modelo da marca que puder usar, todo ano. Jogar com outra marca gera aviso; três avisos e o contrato cai com multa.`,btn:'Assinar contrato',alt:'Agora não'});
   if(r!=='ok')return;S.spons={brand:o.brand,pay:o.pay,until:S.year+o.years-1,strikes:0};S.sponsOff=null;const kit=btKit(o.brand);if(kit){btGive(kit.id);btEquip(kit.id)}blog('🤝',`Patrocínio com a ${BT_BRANDS[o.brand].n}`);
   await blResult({ic:'🤝',title:'Contrato assinado!',txt:kit?`A ${BT_BRANDS[o.brand].n} já mandou uma ${kit.n}. Ela está no seu pé.`:'Bem-vindo ao time da marca.',chips:applyFx({fama:2,cab:4})});blRefresh()});
  const sg=root.querySelector('#btSig');if(sg)sg.onclick=async()=>{const br=S.spons.brand;const B=BT_BRANDS[br];const last=S.name.trim().split(/\s+/).pop();const top=Object.entries(POS[S.pos].w||{}).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).filter(k=>ATTRS.includes(k)).slice(0,3);
   S.sigBoot={id:'sig',n:`${B.n} ${last} ${S.shirt}`,brand:br,tier:4,p:0,g:95,b:btSplit(top.length===3?top:B.a,12),c:[(club()||{}).c1||'#111',(club()||{}).c2||'#f2c443','#111'],gk:!!B.gk,d:'Sua chuteira assinatura. Edição com seu nome e número.',sig:true};
   if(!btOf('sig'))BOOTS.push(S.sigBoot);btGive('sig');btEquip('sig');blog('✍️','Lançou a chuteira assinatura');await blResult({ic:'✍️',title:S.sigBoot.n,txt:'Sua chuteira assinatura chegou às lojas do mundo todo.',chips:applyFx({fama:5,cab:6})});blRefresh()}}}}
async function btDetail(id){const b=btOf(id);const e=btEntry(id);const why=btReqWhy(b);const T=btTier(b);const B=BT_BRANDS[b.brand]||BT_BRANDS.cor;
 const repCost=b.sig?.002:Math.max(.002,b.p*.25);const canRep=e&&e.left<b.g*.8&&(b.sig||(e.rep||0)<2);
 const opts=e?[e.left>0&&S.boot!==id?['equip','👟 Calçar']:null,canRep?['rep',`🧵 Consertar · ${money(repCost)}`]:null,['cor','🎨 Personalizar cores · '+money(.002)],e.left<=0&&!canRep?['sell','🗑️ Aposentar (vira troféu)']:null].filter(Boolean)
  :[!why&&S.din>=b.p?['buy',`🛒 Comprar · ${money(b.p)}`]:null].filter(Boolean);
 const txt=`${B.ic} ${B.n} · ${B.f}. ${b.d||''} ${e?`Vida: ${e.left}/${b.g} jogos. Consertos: ${e.rep||0}${b.sig?'':'/2'}.`:`Dura ${b.g} jogos.`}`;
 const r=await blResult({svg:bootSVG(id,{w:230}),title:b.n,txt,chips:[[T.n,'gold'],...Object.entries(b.b).map(([k,v])=>[`+${v} ${ATTR_NAME[k]}`,'up']),...(why&&!e?[[why,'down']]:[]),...(!e&&!why&&S.din<b.p?[[`Falta ${money(b.p-S.din)}`,'down']]:[])],opts,btn:opts.length?null:'Fechar'});
 if(r==='buy'){if(S.din<b.p||why)return;S.din-=b.p;btGive(id);btEquip(id);blog('👟',`Comprou ${b.n}`);try{SFX.tone({f:700,dur:.1,gain:.08})}catch(_){}await blResult({svg:bootSVG(id,{w:200}),title:'Chuteira nova!',txt:`${b.n} no pé. Ela sobe seus atributos em campo e nos lances.`,chips:[...Object.entries(b.b).map(([k,v])=>[`+${v} ${ATTR_NAME[k]}`,'up']),...applyFx({cab:2})]})}
 else if(r==='equip'){btEquip(id)}
 else if(r==='rep'){if(S.din<repCost)return;S.din-=repCost;e.rep=(e.rep||0)+1;e.left=Math.min(b.g,Math.max(e.left,0)+Math.round(b.g*.6));if(S.boot===id)S.bootLeft=e.left;if(!S.boot)btEquip(id);await blResult({ic:'🧵',title:'Consertada',txt:`O sapateiro trocou as travas e costurou o cabedal. Agora são ${e.left} jogos.`})}
 else if(r==='cor'){await btPaint(id)}
 else if(r==='sell'){S.bootsOwned=S.bootsOwned.filter(x=>x.id!==id);S.bootWall=(S.bootWall||[]).concat(b.n).slice(-40);await blResult({ic:'🏆',title:'Pendurada na parede',txt:`A ${b.n} foi pro quadro de chuteiras da sua casa.`})}
 blRefresh()}
const BT_PAL=['#111111','#ffffff','#ff2a2a','#ff6a12','#ffe600','#2bd46a','#20c4bd','#1e4fd8','#7a2bd4','#ff7aa8','#f2c443','#6b6b6b'];
function btPaint(id){return new Promise(res=>{const e=btEntry(id);let c=btColors(id);const host=blPop2();
 const draw=()=>{host.innerHTML=`<div class="bl-pop"><div class="bl-poph">🎨 Personalizar</div><div class="bl-popb"><div class="bt-paint">${bootSVG(id,{w:240,c})}</div><small class="muted2">Cor principal</small><div class="bt-pal">${BT_PAL.map(x=>`<button style="background:${x}" class="${c[0]===x?'on':''}" data-p1="${x}"></button>`).join('')}</div><small class="muted2">Detalhes</small><div class="bt-pal">${BT_PAL.map(x=>`<button style="background:${x}" class="${c[1]===x?'on':''}" data-p2="${x}"></button>`).join('')}</div>
  <button class="btn wide" id="ptOk" ${S.din<.002?'disabled':''}>Salvar · ${money(.002)}</button><button class="lnk" id="ptX">Cancelar</button></div></div>`;
  host.querySelectorAll('[data-p1]').forEach(x=>x.onclick=()=>{c=[x.dataset.p1,c[1],c[2]];draw()});host.querySelectorAll('[data-p2]').forEach(x=>x.onclick=()=>{c=[c[0],x.dataset.p2,c[2]];draw()});
  host.querySelector('#ptOk').onclick=()=>{S.din-=.002;e.c1=c[0];e.c2=c[1];host.remove();res(true)};host.querySelector('#ptX').onclick=()=>{host.remove();res(false)}};draw()})}
// cor da chuteira vai pro seu jogador no 3D
if(typeof l3dCfg==='function'){const _lc=l3dCfg;l3dCfg=function(o){const cfg=_lc(o);try{if(S.boot&&S.bootLeft>0&&cfg.hero){const[c1]=btColors(S.boot);cfg.hero.boot=c1}}catch(e){}return cfg}}
{const st=document.createElement('style');st.textContent=`
.btsvg{display:block;filter:drop-shadow(0 4px 3px rgba(0,0,0,.4))}
.bt-hero{display:grid;gap:8px;padding:14px;border-radius:var(--r-lg);background:radial-gradient(90% 70% at 50% 18%,color-mix(in srgb,var(--t) 30%,transparent),transparent 70%),var(--panel);border:2px solid var(--t);color:var(--chalk)}
.bt-hero.empty{--t:var(--line-2)}.bt-hs{display:grid;place-items:center;padding:6px 0 2px}.bt-hm{display:grid;gap:6px}.bt-hn{font:900 italic 26px/1 var(--f-display);text-transform:uppercase}
.bt-tier{display:inline-block;padding:2px 9px;border-radius:999px;background:var(--t);color:var(--ink);font:800 11.5px var(--f-body)}
.bt-ct{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.muted2{color:var(--muted);font-size:13px}
.bt-dur{height:7px;border-radius:4px;background:rgba(238,242,228,.1);overflow:hidden}.bt-dur i{display:block;height:100%}
.bt-list{display:grid;gap:8px}.bt-card{display:flex;gap:12px;align-items:center;text-align:left;padding:8px 12px 8px 8px;border-radius:var(--r-md);border:1px solid var(--line);border-left:5px solid var(--t);background:var(--panel);color:var(--chalk);font:inherit}
.bt-card:hover{border-color:var(--line-2);border-left-color:var(--t)}.bt-card .btsvg{flex:0 0 auto;width:96px}.bt-cm{display:grid;gap:5px;min-width:0}.bt-cm b{font-size:15px}.bt-cm small{color:var(--muted);font-size:12.5px}.bt-card.own{background:var(--panel-2)}
.bt-filt{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}.bt-filt::-webkit-scrollbar{display:none}.bt-filt button{flex:0 0 auto;padding:7px 13px;border-radius:999px;border:1px solid var(--line-2);background:var(--panel);color:var(--chalk);font:700 13px var(--f-body)}.bt-filt button.on{background:var(--c-loja);border-color:var(--c-loja);color:var(--ink)}
.bt-paint{display:grid;place-items:center;padding:8px;border-radius:16px;background:var(--pitch)}.bt-pal{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;width:100%}.bt-pal button{aspect-ratio:1;border-radius:50%;border:2px solid var(--line-2)}.bt-pal button.on{outline:3px solid var(--accent);outline-offset:2px}
.bt-list{grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))}
`;document.head.appendChild(st)}
