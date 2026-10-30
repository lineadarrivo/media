"""Genera una base musicale originale (libera da diritti) con l'attacco esattamente a DROP secondi.
Uso: python3 musica.py STILE DURATA_SECONDI DROP_SECONDI file_uscita.wav
STILE: carica (128 bpm elettronica) | energia (140 bpm rock-elettronico) | grinta (100 bpm trap) | epica (90 bpm tamburi e archi) | ritmo (115 bpm funk)
Variabili facoltative: TRASP (semitoni, per variare la tonalità), SEED (numero, per variare i suoni)"""
import os, sys, subprocess
stile, T, drop, out = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
here = os.path.dirname(os.path.abspath(__file__))
env = dict(os.environ, T=T, DROP=drop, OUT=out, STYLE=stile)
script = 'musica_carica.py' if stile == 'carica' else 'musica_stili.py'
subprocess.run([sys.executable, os.path.join(here, script)], env=env, check=True)
