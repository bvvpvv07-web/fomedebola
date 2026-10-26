# Versão fictícia no build: troca nomes de competições e prêmios, tira os nomes reais de lendas e estrelas
# (o jogo gera nomes inventados no lugar, em fict.js) e manda só "impressões" (hash) dos nomes reais,
# pra o gerador nunca sortear um nome igual a um clube ou jogador de verdade.
import re, unicodedata, json

TEXT = [
 ('Mundial de Clubes da FIFA', 'Mundial de Clubes'), ('Data FIFA', 'Data internacional'),
 ('Supercopa da UEFA', 'Supercopa Europeia'), ('AFC Champions League Elite', 'Copa da Ásia de Clubes'),
 ('Champions League', 'Copa Europeia'), ("'Champions,", "'Copa Europeia,"), ('Europa League', 'Taça Europeia'),
 ('Conference League', 'Copa da Conferência'), ('Concachampions', 'Copa Norte-Americana'),
 ('Copa Libertadores', 'Copa Continental'), ('Libertadores', 'Copa Continental'),
 ('Recopa Sul-Americana', 'Recopa Continental'), ('Copa Sul-Americana', 'Taça Sul'), ('Sul-Americana', 'Taça Sul'),
 ('MLS NEXT Cup', 'Copa Sub-20 Americana'), ('MLS NEXT', 'Base Americana'), ('MLS Cup', 'Final da Liga Americana'),
 ('Supporters’ Shield', 'Escudo da Temporada'), ('MLS', 'Liga Americana'),
 ('Bola de Ouro', 'Bola Dourada'), ('Chuteira de Ouro', 'Chuteira Dourada'), ('Luva de Ouro', 'Luva Dourada'),
 ('Golden Boy', 'Revelação do Ano'), ('Copa do Mundo', 'Copa Mundial'), ('Olimpíadas', 'Jogos Mundiais'),
 ('Copa América', 'Copa das Américas'), ('Eurocopa', 'Copa das Nações'), ('Copa Africana de Nações', 'Copa da África'),
 ('Copa Ouro', 'Copa do Norte'), ('Brasileirão', 'Brasileiro'), ('Copa do Brasil', 'Taça Brasil'),
 ('Paulistão', 'Campeonato Paulista'), ('FA Cup', 'Copa da Inglaterra'), ('Carabao Cup', 'Copa da Liga Inglesa'),
 ('Copa del Rey', 'Copa da Espanha'), ('Coppa Italia', 'Copa da Itália'), ('DFB-Pokal', 'Copa da Alemanha'),
 ('Coupe de France', 'Copa da França'), ('Taça de Portugal', 'Copa de Portugal'), ('KNVB Beker', 'Copa da Holanda'),
 ('US Open Cup', 'Copa dos EUA'), ("King's Cup", 'Copa da Arábia'), ('Community Shield', 'Supercopa Inglesa'),
 ('DFL-Supercup', 'Supercopa Alemã'), ('Johan Cruijff Schaal', 'Supercopa Holandesa'),
 ('Supertaça Cândido de Oliveira', 'Supertaça Portuguesa'), ('Supercopa de España', 'Supercopa Espanhola'),
 ('Supercoppa Italiana', 'Supercopa Italiana'), ('Trophée des Champions', 'Supercopa Francesa'),
 ('Final em Wembley', 'Final em Londres'), ('Premier League', 'Liga Inglesa'), ('Championship', 'Segunda Inglesa'),
 ('LaLiga Hypermotion', 'Segunda Espanhola'), ('La Liga', 'Liga Espanhola'), ("n:'Serie A'", "n:'Liga Italiana'"),
 ("n:'Serie B'", "n:'Segunda Italiana'"), ('Playoff da Serie B', 'Playoff da Segunda Italiana'),
 ('2. Bundesliga', 'Segunda Alemã'), ('Bundesliga', 'Liga Alemã'), ('Ligue 1', 'Liga Francesa'), ('Ligue 2', 'Segunda Francesa'),
 ('Liga Portugal 2', 'Segunda Portuguesa'), ('Liga Portugal', 'Liga Portuguesa'), ('Eerste Divisie', 'Segunda Holandesa'),
 ('Eredivisie', 'Liga Holandesa'), ('Liga Profesional', 'Liga Argentina'), ('Primera Nacional', 'Segunda Argentina'),
 ('Saudi Pro League', 'Liga Saudita'), ('Saudi First Division', 'Segunda Saudita'),
 ('UEFA Youth League', 'Liga Europeia Sub-19'), ('datas FIFA', 'datas internacionais'), ('Copinha', 'Copa Júnior'),
 ('Coupe Gambardella', 'Copa Juvenil Francesa'), ('FA Youth Cup', 'Copa Juvenil Inglesa'),
 ('lances no estilo New Star Soccer', 'lances jogáveis em 3D'), ('New Star Soccer', 'fliperama'), ('EA FC 27', 'jogos de futebol'),
]
# nomes que não podem sobrar no HTML final (o teste do build falha se aparecer algum)
FORBID = ['FIFA', 'UEFA', 'Champions League', 'Libertadores', 'Brasileirão', 'Premier League', 'Bundesliga', 'La Liga', 'LaLiga',
          'Eredivisie', 'Ligue 1', 'MLS', 'Golden Boy', 'Bola de Ouro', 'Copa do Mundo', 'Copa América', 'Wembley', 'Carabao',
          'Cruijff', 'Concachampions', 'New Star Soccer', 'EA FC']

def norm(s):
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn').lower()
    return re.sub(r'[^a-z0-9]', '', s)

def fnv(s):
    h = 2166136261
    for c in s:
        h = ((h ^ ord(c)) * 16777619) & 0xffffffff
    return h

def apply(js):
    """recebe o JS juntado do jogo e devolve a versão fictícia"""
    real = set()
    # clubes (continuam como código interno, mas o nome mostrado é inventado)
    i = js.index('const CLUB_SRC={'); j = js.index('const ABBR=', i)
    for m in re.finditer(r'`([^`]*)`', js[i:j]):
        for row in m.group(1).split(';'):
            n = row.split('|')[0].strip()
            if n: real.add(norm(n))
    # lendas: o nome sai do código e vira "#n"
    i = js.index('const LEGEND_SRC=`') + len('const LEGEND_SRC=`'); j = js.index('`', i)
    rows = js[i:j].split('\n'); out = []
    for k, r in enumerate(rows):
        f = r.split('|')
        for t in [f[0]] + f[0].replace('-', ' ').split(' '):
            if len(norm(t)) >= 3: real.add(norm(t))
        f[0] = '#%d' % k; out.append('|'.join(f))
    js = js[:i] + '\n'.join(out) + js[j:]
    # estrelas atuais: idem
    i = js.index('const STAR_SRC=`') + len('const STAR_SRC=`'); j = js.index('`', i)
    rows = js[i:j].split(';'); out = []
    for k, r in enumerate(rows):
        f = r.split('|')
        if len(f) > 1:
            nm = f[0].strip()
            for t in [nm] + nm.replace('-', ' ').split(' '):
                if len(norm(t)) >= 3: real.add(norm(t))
            f[0] = ('\n' if r.startswith('\n') else '') + '#%d' % k
        out.append('|'.join(f))
    js = js[:i] + ';'.join(out) + js[j:]
    # as estrelas ganham nome inventado na hora de montar o mundo e o álbum
    js = js.replace("r.split('|');return{n,club,pos", "r.split('|');return{n:fictP(n,nat),club,pos")
    js = text(js)
    import base64
    txt = [[base64.b64encode(x.encode()).decode(), y] for x, y in TEXT if not x.startswith(("n:'", "'"))]
    return 'const FICT_ON=true;\nconst FICT_REAL_H=' + json.dumps(sorted(fnv(x) for x in real)) + ';\nconst FICT_TXT=' + json.dumps(txt, ensure_ascii=False) + ';\n' + js

def text(s):
    # só troca palavra inteira: "isMLS" (nome de variável) fica, "MLS" no texto vira "Liga Americana"
    for a, b in sorted(TEXT, key=lambda x: -len(x[0])):
        s = re.sub(r'(?<![A-Za-z0-9_$])' + re.escape(a) + r'(?![A-Za-z0-9_$])', lambda m: b, s)
    return s

def check(html):
    left = [w for w in FORBID if re.search(r'(?<![A-Za-z])' + re.escape(w) + r'(?![A-Za-z])', html)]
    return left
