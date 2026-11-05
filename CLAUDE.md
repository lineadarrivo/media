# Linea d'Arrivo — archivio grafiche e regole dei contenuti

Questo repository contiene le grafiche e i reel pubblicati su Instagram (@lineadarrivo) e gli strumenti per crearli.
Le cartelle `AAAA-MM/` sono servite pubblicamente da GitHub Pages (`https://lineadarrivo.github.io/media/...`):
Instagram scarica i file da lì. Non cancellare file già pubblicati.

Guida completa del brand (tono, colori, struttura dei reel): https://claude.ai/artifact/6aZUMTyiQ162ULVb8zj6NK
Pagina di approvazione (database "contenuti"): https://claude.ai/artifact/9RzNXLE6vYsGP9kwTHFrN6

## Regole decise da Umberto (non cambiarle senza chiederglielo)

### Lingua
- Rispondi a Umberto SEMPRE e SOLO in italiano, in ogni messaggio (anche riepiloghi e messaggi finali).

### Inserzioni
- Le grafiche per le inserzioni Meta si fanno SOLO quando Umberto lo chiede esplicitamente. Mai nei giri automatici.

### Brand
- Colori: arancio #FF4419 (accento, una cosa alla volta), quasi nero #16181B, sabbia #ECE8E0, bianco.
- Caratteri: Anton maiuscolo per i titoli, Inter per il testo.
- Tono: motivazionale e pratico. Prima la paura o il dubbio, poi un fatto e una soluzione concreta. Si dà del tu.
- In fondo a ogni grafica: "Guida indipendente, non affiliata a HYROX."
- Prezzo sempre vero: 19 € fino al 5 novembre 2026, poi 27 €. Mai sconti o scadenze inventate.
- Numeri solo con fonte (59% della gara è corsa: Frontiers in Physiology, 2025).
- Stile scuro per reel, caroselli e post del profilo; stile chiaro (sabbia) solo per post tipo inserzione.

### Reel (correzioni fatte da Umberto, valgono per tutti)
1. Intro: scacchiera arancione a tutto schermo con il riquadro del logo "LINEA D'ARRIVO" che si sgretola e svanisce (1,33 s).
2. La linea arancione in alto si RIEMPIE da sinistra a destra per tutta la durata del reel (non deve restare ferma).
3. La fascia a scacchi grigia sta SEMPRE sotto i testi (in basso, a 1580 px su 1920): non deve mai coprire parole.
4. Ogni schermata: prima il titolo, poi il dettaglio (due tempi). 5-7 schermate, 30-35 secondi in tutto.
5. Musica: originale e libera da diritti (strumenti/musica.py). OGNI reel ha una musica DIVERSA dagli altri della
   stessa settimana e da quelli della settimana prima: controlla `strumenti/musica_usata.json`, scegli uno stile
   diverso tra carica, energia, grinta, epica, ritmo e, se devi ripeterne uno, cambia tonalità (TRASP) e SEED.
6. L'attacco della musica cade ESATTAMENTE quando finisce la dissolvenza dell'intro e compare la prima schermata
   (1,25 s nei reel creati con reel.py). Verificalo sul file finale: non deve sembrare in ritardo.
7. Ultima schermata: "La checklist del giorno gara" con il campo commento "CHECKLIST" e "Scrivi CHECKLIST nei commenti".

## Come si creano i contenuti
```
cd strumenti && npm install            # solo la prima volta (font Anton e Inter)
node genera.js contenuti.json out      # grafiche e schermate dei reel
python3 reel.py out/<id-reel> <stile> out/<id-reel>.mp4 [TRASP] [SEED]
python3 prepara.py contenuti.json out  # JPG nel repository + documenti per la pagina di approvazione
# reel con voce: DURATE="s1b,s2a,s2b,..." python3 reel.py ... poi python3 voce.py out/<id-reel> out/<id-reel>.mp4 <DURATE> voce-1.wav ...
node inserzioni.js inserzioni.json out # grafiche per le inserzioni Meta in 1080x1080, 1080x1920, 1920x1080
```
Formato di `contenuti.json`: vedi gli esempi in `strumenti/esempio-contenuti.json`.
