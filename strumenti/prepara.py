"""Prepara i contenuti della settimana per la pubblicazione.
Uso: python3 prepara.py contenuti.json cartella_grafiche
- converte le grafiche in JPG e le copia nel repository (cartella AAAA-MM in base alla data);
- scrive in cartella_grafiche/documenti/<id>.json il documento per la pagina di approvazione
  (stato "da approvare"); il campo "file_anteprime" elenca i file da caricare come anteprima:
  dopo il caricamento sostituirlo con "anteprime" (e "video_anteprima" per i reel) = gli url /_blob/... ottenuti;
- aggiorna musica_usata.json con lo stile di ogni reel."""
import sys, os, json, shutil, subprocess
spec_f, g = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__)); repo = os.path.dirname(here)
spec = json.load(open(spec_f))
P = 'https://lineadarrivo.github.io/media/'; R = 'https://raw.githubusercontent.com/lineadarrivo/media/main/'
os.makedirs(os.path.join(g, 'documenti'), exist_ok=True)
usata_f = os.path.join(here, 'musica_usata.json')
usata = json.load(open(usata_f)) if os.path.exists(usata_f) else []
def jpg(src, dst): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-q:v', '2', dst], check=True)
for c in spec['contenuti']:
    cart = c['data'][:7]; dest = os.path.join(repo, cart); os.makedirs(dest, exist_ok=True)
    doc = {k: c[k] for k in ('data', 'ora', 'tipo', 'titolo', 'didascalia')}
    doc.update(stato='da approvare', nota=c.get('nota', ''))
    if c['tipo'] == 'carosello':
        names = [f"{c['id']}-{i+1}.jpg" for i in range(len(c['slide']))]
        for i, n in enumerate(names): jpg(os.path.join(g, f"{c['id']}-{i+1}.png"), os.path.join(dest, n))
        doc['file_anteprime'] = [os.path.join(dest, n) for n in names]
    elif c['tipo'] == 'post':
        names = [f"{c['id']}.jpg"]; jpg(os.path.join(g, f"{c['id']}.png"), os.path.join(dest, names[0]))
        doc['file_anteprime'] = [os.path.join(dest, names[0])]
    elif c['tipo'] == 'reel':
        names = [f"{c['id']}.mp4"]
        shutil.copy(os.path.join(g, f"{c['id']}.mp4"), os.path.join(dest, names[0]))
        shutil.copy(os.path.join(g, f"{c['id']}-copertina.jpg"), os.path.join(dest, f"{c['id']}-copertina.jpg"))
        doc['copertina'] = P + f"{cart}/{c['id']}-copertina.jpg"; doc['musica'] = c['musica']
        doc['file_anteprime'] = [os.path.join(dest, names[0])]
        usata.append({'data': c['data'], 'id': c['id'], 'stile': c['musica'], 'trasp': c.get('trasp', 0)})
    doc['media'] = [P + f'{cart}/{n}' for n in names]; doc['media_raw'] = [R + f'{cart}/{n}' for n in names]
    json.dump(doc, open(os.path.join(g, 'documenti', c['id'] + '.json'), 'w'), ensure_ascii=False, indent=1)
json.dump(usata, open(usata_f, 'w'), ensure_ascii=False, indent=1)
print('pronti', len(spec['contenuti']), 'documenti in', os.path.join(g, 'documenti'))
