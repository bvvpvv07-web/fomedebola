# Injeta a partida completa (match.css / match.html / match.js) no motor modo-lance.html, entre marcadores.
import re,os
D=os.path.dirname(os.path.abspath(__file__))
P=os.path.join(D,'modo-lance.html');s=open(P).read()
css=open(os.path.join(D,'match.css')).read();html=open(os.path.join(D,'match.html')).read();js=open(os.path.join(D,'match.js')).read()
def put(s,a,b,body,anchor):
    if a in s:
        i=s.index(a)+len(a);j=s.index(b);return s[:i]+body+s[j:]
    k=s.index(anchor);return s[:k]+a+body+b+'\n'+s[k:]
s=put(s,'/*MT_CSS*/','/*MT_CSS_END*/','\n'+css,'</style>')
s=put(s,'<!--MT_HTML-->','<!--MT_HTML_END-->','\n'+html,' <div id="menu">')
s=put(s,'/*MT_JS*/','/*MT_JS_END*/','\n'+js+'\n','// ===================== MODO EMBUTIDO')
open(P,'w').write(s)
print('inject ok',len(s))
