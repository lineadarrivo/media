"""Aggiunge la voce fuori campo a un reel creato con reel.py (stessi tempi delle schermate).
Uso: python3 voce.py cartella_reel reel.mp4 DURATE voce-1.wav voce-2.wav ...
- ogni frase parte quando compare la sua schermata (la prima subito dopo la dissolvenza dell'intro, 1,30 s);
- la musica (cartella_reel/musica.wav, con l'attacco a 1,25 s) scende di 12 dB mentre la voce parla e torna piena alla fine."""
import sys, os, subprocess, wave, numpy as np
d, mp4, durate, voci = sys.argv[1], sys.argv[2], [float(v) for v in sys.argv[3].split(',')], sys.argv[4:]
sr = 44100; start = 1.03
def leggi(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 's16le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float32) / 32768
mus = leggi(os.path.join(d, 'musica.wav')); N = len(mus)
# inizio di ogni schermata: s1 = durate[0]; poi coppie (a, b)
inizi = [start]; t = start + durate[0]
for k in range(1, len(voci)): inizi.append(t); t += durate[2*k-1] + durate[2*k]
vt = np.zeros((N, 2), np.float32); attivo = np.zeros(N, bool); tempi = []
for k, f in enumerate(voci):
    v = leggi(f); v = v / max(1e-6, np.abs(v).max()) * 0.95
    t0 = 1.30 if k == 0 else inizi[k] + 0.15
    i = int(t0 * sr); n = min(len(v), N - i); vt[i:i+n] += v[:n]; attivo[i:i+n] = True; tempi.append((round(t0, 2), round(t0 + len(v)/sr, 2)))
# guadagno della musica: -12 dB con la voce (rampe morbide da 150 ms)
g = np.where(attivo, 10**(-12/20), 1.0).astype(np.float32)
k = int(0.15 * sr); g = np.convolve(np.pad(g, (k, k), mode='edge'), np.ones(k)/k, mode='same')[k:-k][:N]
mix = mus * g[:, None] + vt
mix = mix / max(1.0, np.abs(mix).max() / 0.97)
out = os.path.join(d, 'audio_voce.wav')
with wave.open(out, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((mix * 32767).astype(np.int16).tobytes())
tmp = mp4.replace('.mp4', '-tmp.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-i', out, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', tmp], check=True)
os.replace(tmp, mp4)
print('voce aggiunta:', mp4, 'frasi:', tempi)
