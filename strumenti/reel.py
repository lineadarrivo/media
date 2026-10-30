"""Monta un reel di Linea d'Arrivo dalle schermate create da genera.js.
Uso: python3 reel.py cartella_reel STILE_MUSICA file_uscita.mp4 [TRASP] [SEED]
Regole fisse (correzioni di Umberto):
- intro con scacchiera e logo (1,33 s), poi dissolvenza nella prima schermata;
- l'ATTACCO della musica cade esattamente quando compare la prima schermata (1,25 s);
- linea arancione in alto che si riempie dall'inizio alla fine del reel;
- ogni schermata: prima il titolo (1,3 s), poi il dettaglio (3,7 s); prima schermata 3,5 s; ultima 5 s di dettaglio;
- ogni reel ha una musica DIVERSA dagli altri della stessa settimana e da quelli della settimana prima."""
import sys, os, glob, subprocess
d, stile, out = sys.argv[1], sys.argv[2], sys.argv[3]
trasp = sys.argv[4] if len(sys.argv) > 4 else '0'; seed = sys.argv[5] if len(sys.argv) > 5 else '0'
here = os.path.dirname(os.path.abspath(__file__))
n = len(glob.glob(os.path.join(d, 's*a.png')))
segs = []
for i in range(1, n + 1):
    if i == 1: segs.append((f's{i}b', 3.5))  # prima schermata intera
    else:
        segs.append((f's{i}a', 1.3)); segs.append((f's{i}b', 5.0 if i == n else 3.7))
x = 0.25; I = 1.33; start = I - 0.3  # la dissolvenza intro->scena inizia a 1,03 e la scena è piena a 1,33
total_sc = sum(t for _, t in segs); T = start + total_sc
drop = 1.25  # primo fotogramma in cui la scena si vede chiaramente: qui parte l'attacco
wav = os.path.join(d, 'musica.wav')
subprocess.run([sys.executable, os.path.join(here, 'musica.py'), stile, f'{T+0.8:.2f}', f'{drop}', wav], check=True, env=dict(os.environ, TRASP=trasp, SEED=seed))
inputs = ['-framerate', '30', '-i', os.path.join(d, 'intro', 'f%03d.png')]
for name, t in segs: inputs += ['-loop', '1', '-t', f'{t+x:.2f}', '-i', os.path.join(d, name + '.png')]
fc = ['[0:v]fps=30,format=yuv420p,setsar=1[i0]'] + [f'[{k}:v]fps=30,format=yuv420p,setsar=1[s{k}]' for k in range(1, len(segs) + 1)]
prev = '[s1]'; off = 0
for i in range(2, len(segs) + 1):
    off += segs[i - 2][1]; fc.append(f'{prev}[s{i}]xfade=transition=fade:duration={x}:offset={off:.2f}[c{i}]'); prev = f'[c{i}]'
fc.append(f'[i0]{prev}xfade=transition=fade:duration=0.3:offset={start:.2f}[main]')
fc.append(f"color=c=0x3A3D42:s=900x3:r=30[gr];color=c=0xFF4419:s=900x3:r=30[or];[gr][or]overlay=x='-900+900*(t-{start:.2f})/{total_sc:.2f}':y=0:eval=frame:shortest=1[bar];[main][bar]overlay=x=90:y=150:shortest=1:enable='gte(t,{start:.2f})'[v]")
cmd = ['ffmpeg', '-v', 'error', '-y'] + inputs + ['-i', wav, '-filter_complex', ';'.join(fc), '-map', '[v]', '-map', f'{len(segs)+1}:a',
       '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-t', f'{T:.2f}', '-movflags', '+faststart', out]
subprocess.run(cmd, check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(d, 's1b.png'), '-q:v', '2', out.replace('.mp4', '-copertina.jpg')], check=True)
print('reel pronto:', out, f'{T:.1f} s, attacco musica a {drop} s')
