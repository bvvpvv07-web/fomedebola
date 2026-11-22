// ============ TEMA "ESMERALDA": visual de app de placar (minimalista, cheio de detalhe), fundo preto esverdeado ============
{const st=document.createElement('style');st.id='nsEmerald';st.textContent=`
:root{--pitch:#05110c;--pitch-2:#05110c;--panel:#0c1d16;--panel-2:#11271e;--panel-3:#173327;--line:rgba(210,255,232,.07);--line-2:rgba(210,255,232,.12);
 --chalk:#ecf5f0;--muted:#8da79a;--dim:#5f786c;--accent:#1fc98b;--accent-2:#45dca5;--accent-ink:#03140c;--blue:#5b7cff;--gold:#f2c443;--good:#35d07f;--bad:#ff5c5c;
 --f-display:"Barlow","Segoe UI",Roboto,system-ui,sans-serif;--r-lg:16px;--r-md:12px}
html body,html body.nshub,html body #nsp{background:radial-gradient(120% 60% at 50% -10%,#134a33 0,#0a2419 42%,#061510 100%)!important;background-color:#061510!important;color:var(--chalk)}
/* botões: chapados, cantos suaves, sem caixa alta */
html body .btn{background:var(--accent);color:var(--accent-ink);border:0;border-radius:12px;box-shadow:none!important;font-family:var(--f-body);font-style:normal;text-transform:none;letter-spacing:0;font-weight:800}
html body .btn.ghost{background:transparent;color:var(--chalk);border:1px solid var(--line-2)}
html body .btn:not(.ghost):not([disabled]):active{filter:brightness(.92);transform:translateY(1px)}
html body .btn[disabled]{opacity:.4}
/* cabeçalho do jogador: escudo/cor do clube só como brilho no canto */
html body .nshero{background:linear-gradient(120deg,color-mix(in srgb,var(--c1) 34%,#0b1d15) 0%,#0b1d15 58%)!important;box-shadow:inset 0 0 0 1px var(--line-2)!important;border-radius:18px}
html body .nshero-bg{background:radial-gradient(70% 90% at 92% 0%,color-mix(in srgb,var(--c1) 30%,transparent),transparent 65%)!important}
/* abas do início: sublinhado, como app de placar */
html body .nsx-tabs .nstabs.n5{background:transparent!important;border:0!important;border-bottom:1px solid var(--line-2)!important;border-radius:0!important;padding:0!important;gap:0!important}
html body .nsx-tabs .nstabs.n5 button{background:none!important;color:var(--muted)!important;border-radius:0!important;box-shadow:none!important;min-height:44px!important;font:700 15px var(--f-body)!important;border-bottom:3px solid transparent!important}
html body .nsx-tabs .nstabs.n5 button.on{color:#fff!important;border-bottom-color:var(--accent)!important}
html body .nstabs{background:#081711;border:1px solid var(--line);border-radius:12px}
html body .nstabs button.on{background:var(--panel-3);color:#fff;box-shadow:inset 0 -2px 0 var(--accent)}
/* cartões e blocos */
html body .nsx-st,html body .nsx-act,html body .ns3b,html body .nsc,html body .nshr-m,html body .nsx-tile,html body .nsx-pl,html body .nsx-actc,html body .nsrow,html body .nsnext,html body .nsx-more,html body .nsses,html body .nshab-top,html body .nsrel,html body .nsrel-m,html body .nsbt,html body .card,html body .nsx-place-hd{background:var(--panel)!important;border:1px solid var(--line)!important;box-shadow:none!important;border-radius:16px}
html body .nsx-act.tr{background:linear-gradient(135deg,#0f3a2a,#0c1d16)!important;border-color:#1fc98b55!important}
html body .nsx-act.dr{background:linear-gradient(135deg,#132a4a,#0c1d16)!important;border-color:#5b7cff55!important}
html body .nshr-go{background:var(--panel-3)!important;border:1px solid #1fc98b66!important;box-shadow:none!important;border-radius:14px}
html body .nshr-go.done{opacity:.45}
html body .nsmb,html body .nsbar{background:#03100a!important}
html body .nsmb i{background:var(--accent)!important}
html body .nsx-pl{--pc:#12271e}
html body .nsx-place-hd{background:linear-gradient(120deg,color-mix(in srgb,var(--pc) 40%,#0c1d16),#0c1d16 70%)!important}
/* barra de baixo: chapada, o Jogar em destaque */
html body .nsh-nav{background:#08150f;border:1px solid var(--line);border-radius:18px;padding:6px;gap:4px!important}
html body .nsh-nav button{background:transparent!important;border:0!important;box-shadow:none!important;border-radius:12px!important;color:var(--muted)!important;padding:8px 4px!important}
html body .nsh-nav button b,html body .nsh-nav button small,html body .nsh-nav button span{color:inherit}
html body .nsh-nav #nsJogar,html body .nsh-nav button.go{background:var(--accent)!important;color:var(--accent-ink)!important}
/* páginas: cabeçalho limpo */
html body .nsp-h{background:transparent!important;border-bottom:1px solid var(--line);border-radius:0!important;padding:6px 2px 10px!important}
html body .nsp-h b,html body .nsp-h h2{font-family:var(--f-body)!important;font-style:normal!important;text-transform:none!important;font-weight:800!important}
html body .nsp-back{background:var(--panel-2)!important;border:1px solid var(--line-2)!important;border-radius:999px!important;color:var(--chalk)!important}
html body .nsp-nav{background:#08150f;border-top:1px solid var(--line);padding-top:6px}
html body .nsnb{background:transparent!important;border:0!important;color:var(--muted)!important}
/* pop-ups e telas de pós-jogo */
html body .nspop,html body .nspost,html body .nsgo-card,html body .nsx-rg{background:#0b1b14!important;border:1px solid var(--line-2)!important;border-radius:20px!important;box-shadow:0 20px 60px rgba(0,0,0,.6)!important}
html body .nspop-host,html body .nsgo-host,html body .nsx-rg-host{background:rgba(2,9,6,.82)!important}
html body .nspop-h b,html body .nsp-t,html body .nsgo-card h2,html body .pkh,html body .dp-t{font-family:var(--f-body)!important;font-style:normal!important;text-transform:none!important;letter-spacing:0!important}
html body .nsp-step,html body .nsgo-ey{color:var(--accent)!important;letter-spacing:.06em}
html body .nsgo-metas,html body .nsgo-mres,html body .nsgo-list>div,html body .nsgo-nst>div,html body .nsgo-cl .row,html body .nsgo-natc,html body .nsfo-post{background:#0f241b!important;border-color:var(--line-2)!important}
html body .nsgo-go{background:var(--accent)!important;color:var(--accent-ink)!important;animation:none}
html body .nsgo-go.hot{background:linear-gradient(180deg,#ffd84a,#f2a91f)!important;color:#241300!important}
html body .toast{background:#0f241b!important;border:1px solid var(--line-2)!important}
/* manchetes e Fofocagram na home */
html body .nsgo-promo{background:linear-gradient(110deg,#0f2e22,#0c1d16 70%)!important;border:1px solid var(--line-2)!important}
html body .nsgo-promo small{color:var(--accent)!important}
/* ===== partida: mesma cara do app de placar, mas escura esmeralda ===== */
.nslive.sofa{background:#05110c!important;color:#ecf5f0!important}
.sofa .ss-hd{background:linear-gradient(120deg,color-mix(in srgb,var(--hc) 30%,#0a1a13) 0%,#0a1a13 45%,#0a1a13 55%,color-mix(in srgb,var(--ac) 26%,#0a1a13) 100%)!important;border-bottom:1px solid var(--line)}
.sofa .ss-card,.sofa .nfr>span,.sofa .nsl-eff,.sofa .nsl-foc,.sofa .nsl-ht,.sofa .nsl-fin{background:#0c1d16!important;color:#ecf5f0!important;box-shadow:none!important;border:1px solid var(--line)!important}
.sofa .ss-card h4,.sofa .ev-ft,.sofa .ss-comp b,.sofa .sr .v span,.sofa .sp b,.sofa .ln-hd b{color:#ecf5f0!important}
.sofa .ss-mut,.sofa .nfr>b,.sofa .ev .nm em,.sofa .ln-hd em{color:#8da79a!important}
.sofa .ss-livec .lv{border-top-color:var(--line)!important}.sofa .ss-livec .lv.me span{color:#f2c443!important}
.sofa .ev .rp{background:#0c1d16!important;color:#ecf5f0!important;border-color:#5b7cff!important}.sofa .ev .rp::first-letter{color:#5b7cff}
.sofa .ev-ft::before,.sofa .ev-ft::after{background:var(--line-2)!important}
.sofa .nfr.nme>span{box-shadow:inset 4px 0 0 #f2c443!important}.sofa .nfr.nht>span{background:#11271e!important;color:#8da79a!important}
.sofa .sr .br i{background:#11271e!important}.sofa .sr .br i.h u{background:#1d6b44!important}.sofa .sr .br i.a u{background:#2b3a8a!important}.sofa .sr .br i.h.on u{background:#21a95a!important}.sofa .sr .br i.a.on u{background:#5b7cff!important}
.sofa .spb{background:#5b7cff!important}.sofa .sp .a{background:#5b7cff!important}
.sofa .nsl-off{background:#0c1d16!important;color:#8da79a!important;border-color:var(--line-2)!important}
.sofa .ss-comp em{color:#5b7cff!important}
.sofa .nsl-eff button,.sofa .nsl-foc button{background:#11271e!important;border-color:var(--line-2)!important;color:#ecf5f0!important}.sofa .nsl-foc button.on{background:#1fc98b!important;border-color:#1fc98b!important}
.sofa .nsl-en,.sofa .nsl-en b{color:#8da79a!important}
.sofa .ln-pitch{background-color:#0f3a28!important}
.sofa .fl-cr .cr{box-shadow:0 0 0 1.5px #0c1d16,0 0 0 2.5px var(--line-2)!important}
`;document.head.appendChild(st)}
// gráfico do fluxo com as cores do tema escuro
{const _fs=nsFlowSVG;nsFlowSVG=function(L){return _fs(L).replace(/fill="#c9ebd0"/g,'fill="#0f3a28"').replace(/fill="#d2d8fb"/g,'fill="#141f4a"').replace(/fill="#3b4ef5"/g,'fill="#5b7cff"').replace(/stroke="#21a95a" stroke-width="2.5"/g,'stroke="#21a95a" stroke-width="2.5"').replace(/<circle r="8" fill="#fff"/g,'<circle r="8" fill="#0c1d16"')}}
{const _gp=nsSofaPitch;nsSofaPitch=function(r){return _gp(r).replace('fill="#cfead2" stroke="#fff"','fill="#0f3a28" stroke="#ffffff55"').replace(/stroke="#fff" stroke-width=".8"/g,'stroke="#ffffff55" stroke-width=".8"').replace('stroke="#222" stroke-width=".9"','stroke="#ecf5f0" stroke-width=".9"')}}
