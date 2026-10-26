# Injeta a partida em lances (sess.css / sess.html / sess.js) no motor modo-lance.html, entre marcadores.
import os
D=os.path.dirname(os.path.abspath(__file__))
P=os.path.join(D,'modo-lance.html');s=open(P).read()
css=open(os.path.join(D,'sess.css')).read();html=open(os.path.join(D,'sess.html')).read();js=open(os.path.join(D,'sess.js')).read()+'\n'+open(os.path.join(D,'kids.js')).read()
def put(s,a,b,body,anchor):
    if a in s:
        i=s.index(a)+len(a);j=s.index(b);return s[:i]+body+s[j:]
    k=s.index(anchor);return s[:k]+a+body+b+'\n'+s[k:]
s=put(s,'/*SS_CSS*/','/*SS_CSS_END*/','\n'+css,'</style>')
s=put(s,'<!--SS_HTML-->','<!--SS_HTML_END-->','\n'+html,' <div id="menu">')
# depois do modo embutido: usa EMBED, embedPlay e embedSend
s=put(s,'/*SS_JS*/','/*SS_JS_END*/','\n'+js+'\n','// ===================== LOOP =====================')
open(P,'w').write(s)
print('inject ok',len(s))
