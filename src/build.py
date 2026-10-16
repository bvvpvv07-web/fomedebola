css=open('base.css').read()+open('extra.css').read()+open('extra2.css').read()+open('extra3.css').read()+open('extra4.css').read()
import json,os
am=json.load(open('assets/map.json')) if os.path.exists('assets/map.json') else {'B':{},'T':{}}
import base64
pubset=set(json.load(open('assets/published.json'))) if os.path.exists('assets/published.json') else None
if pubset is not None:
  for s in ('B','T'):
    for k,v in am[s].items():
      if v not in pubset: am[s][k]='data:image/webp;base64,'+base64.b64encode(open('assets/'+v,'rb').read()).decode()
js='const ASSET_B='+json.dumps(am['B'])+';const ASSET_T='+json.dumps(am['T'])+';\n'+open('data.js').read()+'\n'+open('logic.js').read()+'\n'+open('youth.js').read()+'\n'+open('ui.js').read()+'\n'+open('fx.js').read()+'\n'+open('minigames.js').read()+'\n'+open('nss.js').read()+'\n'+open('nss2.js').read()+'\n'+open('fast.js').read()+'\n'+open('gallery.js').read()+'\n'+open('agent.js').read()+'\n'+open('youth_ui.js').read()+'\n'+open('flow.js').read()+'\n'+open('moments.js').read()+'\n'+open('dyn.js').read()+'\n'+open('onescreen.js').read()+'\n'+open('cards.js').read()+'\n'+open('swipe.js').read()+'\n'+open('nssmoment.js').read()+'\n'+open('youthflow.js').read()+'\n'+open('journey.js').read()+'\n'+open('torcida.js').read()+'\n'+open('v5.js').read()+'\n'+open('prison.js').read()+'\n'+open('cloud.js').read()+'\n'+open('home.js').read()
head='''<meta charset="utf-8">
<title>Fome de Bola</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&family=Saira+Condensed:wght@600;700;800;900&display=swap" rel="stylesheet">
'''
open('/home/claude/fome-de-bola.html','w').write(head+'<style>'+css+'</style>\n<div id="app"></div>\n<div id="overlay" hidden></div>\n<script>\n'+js+'\n</script>\n')
