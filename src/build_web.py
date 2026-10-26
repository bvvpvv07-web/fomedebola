import json as _j
_eh=open('/home/claude/modo-lance/modo-lance.html').read()
open('lance_html.js','w').write('// gerado pelo build a partir de modo-lance.html (motor 3D do Modo Lance)\nconst L3D_HTML='+_j.dumps(_eh).replace('</','<\\/')+';\n')
import json,os,shutil
OUT='/home/claude/web'
FILES='data.js logic.js youth.js fict.js ui.js fx.js minigames.js nss.js nss2.js fast.js gallery.js agent.js youth_ui.js flow.js moments.js dyn.js onescreen.js cards.js swipe.js nssmoment.js decide.js lance_html.js lance3d.js youthflow.js journey.js infancia.js torcida.js v5.js prison.js rpg.js camp.js webcloud.js cloud.js home.js editor.js ui2.js vidaplus.js mg2.js boots.js skilltree.js bitmenu.js newspaper.js feed.js retire.js music.js'.split()
css=''.join(open(f).read() for f in ['base.css','extra.css','extra2.css','extra3.css','extra4.css','theme.css'])
am=json.load(open('assets/map.json')) if os.path.exists('assets/map.json') else {'B':{},'T':{}}
cfg={'url':'https://dwrvpzmfhprazbkmmhqh.supabase.co','key':'sb_publishable_NlDnuy7PDBwiGnygbSkNFA_E5m6TkAG'}
js='const WEB_CFG='+json.dumps(cfg)+';\nconst ASSET_B='+json.dumps(am['B'])+';const ASSET_T='+json.dumps(am['T'])+';\n'+'\n'.join(open(f).read() for f in FILES)
import os as _os,re as _re,fict_build as _fb
# oficial por padrão; FDB_FICT=1 gera a versão com clubes, ligas e lendas inventados
REAL=_os.environ.get('FDB_FICT')!='1'
if REAL:js='const FICT_ON=false;\n'+js
else:js=_fb.apply(_re.sub(r'const ASSET_B=\{.*?\};const ASSET_T=\{.*?\};','const ASSET_B={};const ASSET_T={};',js,count=1))
head='''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Fome de Bola · simulador de carreira no futebol</title>
<meta name="description" content="Fome de Bola: simulador de carreira no futebol. Da peneira à Bola de Ouro, com lances no estilo New Star Soccer, vida fora de campo e ranking.">
<meta name="theme-color" content="#0b1f15">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Fome de Bola">
<meta property="og:title" content="Fome de Bola"><meta property="og:description" content="Simulador de carreira no futebol: da peneira à Bola de Ouro."><meta property="og:image" content="og.png"><meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&family=Saira+Condensed:wght@600;700;800;900&family=Playfair+Display:wght@700;800;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,600&family=UnifrakturCook:wght@700&display=swap" rel="stylesheet">
'''
if os.path.exists(OUT):shutil.rmtree(OUT)
os.makedirs(OUT)
if REAL:
  for d in ('escudos','tacas'):shutil.copytree('assets/'+d,OUT+'/'+d)
head=head if REAL else _fb.text(head)
open(OUT+'/index.html','w').write(head+'<style>'+css+'</style></head><body>\n<div id="app"></div>\n<div id="overlay" hidden></div>\n<script>\n'+js+'\n</script></body></html>\n')
for f in os.listdir('web_static'):shutil.copy('web_static/'+f,OUT+'/'+f)
print('ok',sum(os.path.getsize(os.path.join(r,f)) for r,_,fs in os.walk(OUT) for f in fs)//1024,'KB')

_left=_fb.check(open(OUT+'/index.html').read())
if _left and not REAL:print('ATENÇÃO nomes reais no HTML:',_left)
