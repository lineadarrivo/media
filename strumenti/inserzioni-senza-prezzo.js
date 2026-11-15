// Inserzioni "nuova campagna senza prezzo" (13/11/2026): 5 angoli, senza prezzo, date, gare o città.
// Formati: 1080x1080 e 1080x1920. Nel verticale tutto il contenuto sta tra 275 e 1240 px (zone libere Meta: 14% in alto, 35% in basso per i Reel, margini laterali per le icone). Caroselli 1080x1080 per gli angoli 3 e 4.
// Uso: node inserzioni-senza-prezzo.js cartella_uscita
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const nm = (p) => path.join(__dirname, 'node_modules', p);
const f64 = (p) => 'data:font/woff2;base64,' + fs.readFileSync(nm(p)).toString('base64');
const FONTS = `@font-face{font-family:Anton;src:url(${f64('@fontsource/anton/files/anton-latin-400-normal.woff2')})}` +
  [600, 700, 800].map(w => `@font-face{font-family:Inter;font-weight:${w};src:url(${f64(`@fontsource/inter/files/inter-latin-${w}-normal.woff2`)})}`).join('');
const img = (n) => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', 'risorse', n)).toString('base64');
const IMG = { piano: img('app-piano-base.png'), ritmo: img('app-ritmo.png'), timer: img('app-timer.png') };
const out = process.argv[2];
const P = 'inserzioni-2026-11-13-'; // non usato nei nomi: i nomi seguono gli id
const A = '#FF4419';
const flag = (a, b, px) => `<span class="flag" style="grid-template-columns:repeat(4,${px}px)">${Array.from({length:16},(_,i)=>`<i style="width:${px}px;height:${px}px;background:${((i%4)+Math.floor(i/4))%2?b:a}"></i>`).join('')}</span>`;
const CSS = `*{margin:0;box-sizing:border-box}body{overflow:hidden;font-family:Inter}
.ad{position:relative;overflow:hidden;background:#0e1012;color:#fff}
.flag{display:inline-grid;vertical-align:middle;margin-right:12px}.flag i{display:block}
.abs{position:absolute}
h1{position:absolute;font-family:Anton;font-weight:400;text-transform:uppercase;line-height:.98;text-shadow:0 10px 40px rgba(0,0,0,.5)}h1 em{font-style:normal;color:${A}}
.kick{position:absolute;font-weight:800;letter-spacing:.16em;color:${A};text-transform:uppercase}
.sub{position:absolute;font-weight:600;line-height:1.3;color:#ECE8E0}
.tape{position:absolute;left:-200px;right:-200px;height:64px;background:conic-gradient(#16181B 25%,#fff 0 50%,#16181B 0 75%,#fff 0) 0 0/32px 32px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
.phone{position:absolute;background:#08090a;border:3px solid #55595f;border-radius:46px;padding:10px;box-shadow:0 50px 100px rgba(0,0,0,.8),0 0 120px rgba(255,68,25,.45),inset 0 0 0 2px #1d1f22}
.phone img{display:block;width:100%;border-radius:36px}
.fc{position:absolute;background:rgba(28,31,35,.95);border:1.5px solid rgba(255,255,255,.12);border-radius:22px;padding:18px 22px;box-shadow:0 30px 60px rgba(0,0,0,.6)}
.fc .k{color:${A};font-weight:800;font-size:19px;letter-spacing:.16em;text-transform:uppercase}
.fc .v{font-family:Anton;font-size:64px;line-height:1;margin-top:6px}.fc .v small{font-family:Inter;font-weight:700;font-size:24px;color:#A9A49B;margin-left:6px}
.fc .c{display:flex;align-items:center;gap:12px;font-weight:700;font-size:25px;margin-top:10px;line-height:1.2}
.ck{flex:none;width:30px;height:30px;border-radius:8px;background:${A};position:relative;display:inline-block}.ck:after{content:"";position:absolute;left:8px;top:8px;width:12px;height:6px;border-left:3px solid #16181B;border-bottom:3px solid #16181B;transform:rotate(-45deg)}
.ck.no{background:transparent;border:3px solid #55595f}.ck.no:after{display:none}
.x{flex:none;width:34px;height:34px;border-radius:50%;background:#2a2d31;position:relative;display:inline-block}.x:before,.x:after{content:"";position:absolute;left:8px;top:15px;width:18px;height:4px;background:#ff6b6b;border-radius:2px;transform:rotate(45deg)}.x:after{transform:rotate(-45deg)}
.cta{position:absolute;font-family:Anton;text-align:center;background:linear-gradient(90deg,${A},#ff6a3d);color:#fff;border-radius:18px;box-shadow:0 20px 50px rgba(255,68,25,.4);z-index:10;text-transform:uppercase;letter-spacing:.02em}
.disc{position:absolute;font-weight:600;color:#7c7f84;z-index:10}
.wk{position:absolute;display:grid;gap:12px}.wk div{border-radius:16px;border:2px solid #30353B;background:#1F2226;font-family:Anton;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.wk div small{font-family:Inter;font-weight:800;color:#A9A49B;letter-spacing:.08em}.wk div.on{border-color:${A};background:#2a1c17}.wk div.on small{color:${A}}
.step{position:absolute;display:flex;align-items:center;gap:16px;background:rgba(28,31,35,.95);border:1.5px solid rgba(255,255,255,.12);border-radius:20px;padding:16px 22px;font-weight:800;box-shadow:0 20px 40px rgba(0,0,0,.5)}
.step b{font-family:Anton;font-weight:400;color:${A}}
.bib{position:absolute;background:#ECE8E0;color:#16181B;border-radius:18px;box-shadow:0 40px 80px rgba(0,0,0,.7);text-align:center;overflow:hidden}
.bib .top{background:${A};color:#fff;font-family:Anton;letter-spacing:.06em}
.bib .n{font-family:Anton;line-height:1}
.bib .h{position:absolute;width:22px;height:22px;border-radius:50%;background:#0e1012}
.num{font-family:Anton;color:transparent;-webkit-text-stroke:3px rgba(255,68,25,.8);line-height:.8;position:absolute}`;
const BG = (h, cx = 70, cy = 60) => `<div class="abs" style="inset:0;background:radial-gradient(circle at ${cx}% ${cy}%,rgba(255,68,25,.42),rgba(255,68,25,0) 46%),radial-gradient(circle at 0% 0%,rgba(255,68,25,.14),rgba(255,68,25,0) 40%)"></div>`;
const LOGO = (x, y, fs = 30) => `<div class="abs" style="left:${x}px;top:${y}px;font-family:Anton;font-size:${fs}px">${flag('#fff', '#0e1012', Math.round(fs / 4))}LINEA <span style="color:${A}">D'ARRIVO</span></div>`;
const DISC = 'Guida indipendente, non affiliata a HYROX.';
const phone = (src, x, y, w, rot = 6) => `<div class="phone" style="left:${x}px;top:${y}px;width:${w}px;transform:perspective(1800px) rotateY(-10deg) rotateZ(${rot}deg)"><img src="${src}"></div>`;
const card = (x, y, w, rot, inner) => `<div class="fc" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg)">${inner}</div>`;
const checks = (k, rows) => `<div class="k">${k}</div>${rows.map(([t, ok = 1]) => `<div class="c"><span class="ck ${ok ? '' : 'no'}"></span>${t}</div>`).join('')}`;
const weeks = (x, y, cols, size, n, on, fs = 40) => `<div class="wk" style="left:${x}px;top:${y}px;grid-template-columns:repeat(${cols},${size}px)">${Array.from({length:n},(_,i)=>`<div class="${i<on?'on':''}" style="height:${size}px;font-size:${fs}px"><small style="font-size:${Math.round(fs*.36)}px">SETT</small>${i+1}</div>`).join('')}</div>`;
const bib = (x, y, w, rot) => `<div class="bib" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg)"><div class="top" style="font-size:${w*.085}px;padding:${w*.04}px 0">LA MIA PRIMA GARA</div>
<div class="n" style="font-size:${w*.42}px;padding:${w*.05}px 0 ${w*.02}px">001</div><div style="font-weight:800;font-size:${w*.055}px;letter-spacing:.14em;padding-bottom:${w*.07}px">PRIMO TRAGUARDO</div>
<span class="h" style="left:14px;top:14px"></span><span class="h" style="right:14px;top:14px"></span><span class="h" style="left:14px;bottom:14px"></span><span class="h" style="right:14px;bottom:14px"></span></div>`;

// ---------- 5 angoli: contenuto per formato quadrato (q) e verticale (v, o = 270 di zona libera in alto) ----------
const ADS = [
  { id: '2026-11-13-inserzione-piano-sempre-con-te',
    q: () => `${BG(1080, 75, 62)}${LOGO(60, 50)}<div class="kick" style="left:62px;top:112px;font-size:26px">La tua prima gara HYROX®</div>
<h1 style="left:56px;top:150px;width:980px;font-size:118px">Il tuo piano,<br><em>sempre con te.</em></h1>
<div class="sub" style="left:62px;top:420px;width:470px;font-size:34px">Apri il telefono: l'allenamento di oggi è già pronto.</div>
${phone(IMG.piano, 600, 400, 300, 6)}
${card(60, 600, 420, -3, checks('Oggi', [['Allenamento pronto'], ['Lo fai e lo spunti'], ['Domani il prossimo', 0]]))}
<div class="cta" style="left:60px;top:880px;width:440px;font-size:50px;padding:6px 0">Scopri il piano →</div>
<div class="disc" style="left:62px;top:1030px;font-size:19px">${DISC}</div>`,
    v: (o) => `${BG(1920, 72, 52)}${LOGO(64, o + 30, 34)}<div class="kick" style="left:66px;top:${o+100}px;font-size:30px">La tua prima gara HYROX®</div>
<h1 style="left:60px;top:${o+145}px;width:960px;font-size:138px">Il tuo piano,<br><em>sempre con te.</em></h1>
<div class="sub" style="left:66px;top:${o+445}px;width:900px;font-size:42px">Apri il telefono: l'allenamento di oggi è già pronto.</div>
${phone(IMG.piano, 610, o + 560, 240, 6)}
${card(60, o + 640, 470, -3, checks('Oggi', [['Allenamento pronto'], ['Lo fai e lo spunti'], ['Domani il prossimo', 0]]))}
${card(90, o + 900, 330, 3, `<div class="k">Timer · Lavoro</div><div class="v">0:42</div>`)}
<div class="cta" style="left:60px;right:60px;top:${o+1060}px;font-size:64px;padding:4px 0">Scopri il piano →</div>
<div class="disc" style="left:0;right:0;text-align:center;top:${o+1170}px;font-size:22px">${DISC}</div>` },

  { id: '2026-11-13-inserzione-passo-dopo-passo',
    q: () => `${BG(1080, 80, 80)}<div class="tape" style="top:1010px;transform:rotate(-3deg)"></div>${LOGO(60, 50)}<div class="kick" style="left:62px;top:112px;font-size:26px">Prima volta? Niente paura</div>
<h1 style="left:56px;top:150px;width:980px;font-size:110px">Fino al traguardo,<br><em>passo dopo passo.</em></h1>
<div class="sub" style="left:62px;top:400px;width:960px;font-size:34px">Un piano semplice, pensato per chi non l'ha mai fatto.</div>
<div class="step" style="left:60px;top:500px;font-size:32px"><span class="ck"></span><b style="font-size:40px">1</b>Test iniziale</div>
<div class="step" style="left:180px;top:600px;font-size:32px"><span class="ck"></span><b style="font-size:40px">2</b>L'allenamento di ogni giorno</div>
<div class="step" style="left:300px;top:700px;font-size:32px"><span class="ck"></span><b style="font-size:40px">3</b>Le 8 stazioni, con le alternative</div>
<div class="step" style="left:420px;top:800px;font-size:32px;border-color:${A}"><span class="ck no" style="border-color:${A}"></span><b style="font-size:40px">4</b>Il giorno gara</div>
<div class="cta" style="left:60px;top:850px;width:330px;font-size:46px;padding:6px 0;transform:translateY(0)">Inizia oggi →</div>
<div class="disc" style="left:62px;top:955px;font-size:19px">${DISC}</div>`,
    v: (o) => `${BG(1920, 75, 55)}<div class="tape" style="top:${o+1090}px;transform:rotate(-6deg)"></div>${LOGO(64, o + 30, 34)}<div class="kick" style="left:66px;top:${o+100}px;font-size:30px">Prima volta? Niente paura</div>
<h1 style="left:60px;top:${o+145}px;width:960px;font-size:126px">Fino al traguardo,<br><em>passo dopo passo.</em></h1>
<div class="sub" style="left:66px;top:${o+420}px;width:900px;font-size:42px">Un piano semplice, pensato per chi non l'ha mai fatto.</div>
<div class="step" style="left:60px;top:${o+580}px;font-size:36px"><span class="ck"></span><b style="font-size:46px">1</b>Test iniziale</div>
<div class="step" style="left:120px;top:${o+700}px;font-size:36px"><span class="ck"></span><b style="font-size:46px">2</b>L'allenamento di ogni giorno</div>
<div class="step" style="left:180px;top:${o+820}px;font-size:36px"><span class="ck"></span><b style="font-size:46px">3</b>Le 8 stazioni, con le alternative</div>
<div class="step" style="left:240px;top:${o+940}px;font-size:36px;border-color:${A}"><span class="ck no" style="border-color:${A}"></span><b style="font-size:46px">4</b>Il giorno gara</div>
<div class="cta" style="left:60px;right:60px;top:${o+1180}px;font-size:64px;padding:4px 0">Inizia oggi →</div>
<div class="disc" style="left:0;right:0;text-align:center;top:${o+1290}px;font-size:22px">${DISC}</div>`.replace(`top:${o+1180}px`, `top:${o+1050}px`).replace(`top:${o+1290}px`, `top:${o+1160}px`).replace(`top:${o+1090}px`, `top:${o+1250}px`) },

  { id: '2026-11-13-inserzione-ogni-settimana',
    q: () => `${BG(1080, 78, 60)}${LOGO(60, 50)}<div class="kick" style="left:62px;top:112px;font-size:26px">Non sai cosa fare prima della gara?</div>
<h1 style="left:56px;top:150px;width:980px;font-size:118px">Ogni settimana,<br><em>già decisa.</em></h1>
<div class="sub" style="left:62px;top:420px;width:460px;font-size:32px">Apri l'app: gli allenamenti della settimana sono già pronti.</div>
${weeks(62, 590, 4, 82, 12, 3, 34)}
${phone(IMG.piano, 620, 420, 290, 6)}
<div class="cta" style="left:60px;top:930px;width:460px;font-size:46px;padding:4px 0">Scopri il piano →</div>
<div class="disc" style="left:62px;top:1035px;font-size:19px">${DISC}</div>`,
    v: (o) => `${BG(1920, 72, 52)}${LOGO(64, o + 30, 34)}<div class="kick" style="left:66px;top:${o+100}px;font-size:30px">Non sai cosa fare prima della gara?</div>
<h1 style="left:60px;top:${o+145}px;width:960px;font-size:138px">Ogni settimana,<br><em>già decisa.</em></h1>
<div class="sub" style="left:66px;top:${o+445}px;width:900px;font-size:42px">Apri l'app: gli allenamenti della settimana sono già pronti.</div>
${weeks(66, o + 590, 3, 104, 12, 3, 44)}
${phone(IMG.piano, 610, o + 560, 240, 6)}
<div class="cta" style="left:60px;right:60px;top:${o+1060}px;font-size:64px;padding:4px 0">Scopri il piano →</div>
<div class="disc" style="left:0;right:0;text-align:center;top:${o+1170}px;font-size:22px">${DISC}</div>` },

  { id: '2026-11-13-inserzione-errori-principiante',
    q: () => `${BG(1080, 80, 70)}${LOGO(60, 50)}<div class="kick" style="left:62px;top:112px;font-size:26px">Primo HYROX®</div>
<h1 style="left:56px;top:150px;width:980px;font-size:112px">3 errori da<br><em>principiante.</em></h1>
<div class="sub" style="left:62px;top:400px;width:960px;font-size:34px">E come evitarli, con un piano fatto per la prima gara.</div>
${[['Partire troppo forte', 'Ritmo gara sul tuo tempo obiettivo'], ['Non conoscere le stazioni', 'Le 8 stazioni spiegate, con le alternative'], ['Allenarti solo a correre', 'Corsa e stazioni nello stesso allenamento']].map(([e, s], i) =>
  `<div class="fc" style="left:60px;top:${500 + i*125}px;width:960px;padding:16px 24px"><div class="c" style="margin:0;font-size:32px"><span class="x"></span>${e}</div><div class="c" style="font-size:25px;color:#d0ccc4;margin-top:6px"><span class="ck"></span>${s}</div></div>`).join('')}
<div class="cta" style="left:60px;top:900px;width:440px;font-size:48px;padding:6px 0">Evitali così →</div>
<div class="disc" style="left:62px;top:1035px;font-size:19px">${DISC}</div>`,
    v: (o) => `${BG(1920, 75, 55)}${LOGO(64, o + 30, 34)}<div class="kick" style="left:66px;top:${o+100}px;font-size:30px">Primo HYROX®</div>
<h1 style="left:60px;top:${o+145}px;width:960px;font-size:140px">3 errori da<br><em>principiante.</em></h1>
<div class="sub" style="left:66px;top:${o+445}px;width:900px;font-size:42px">E come evitarli, con un piano fatto per la prima gara.</div>
${[['Partire troppo forte', 'Ritmo gara sul tuo tempo obiettivo'], ['Non conoscere le stazioni', 'Le 8 stazioni spiegate, con le alternative'], ['Allenarti solo a correre', 'Corsa e stazioni nello stesso allenamento']].map(([e, s], i) =>
  `<div class="fc" style="left:60px;top:${o + 590 + i*150}px;width:960px;padding:18px 26px"><div class="c" style="margin:0;font-size:38px"><span class="x"></span>${e}</div><div class="c" style="font-size:29px;color:#d0ccc4;margin-top:8px"><span class="ck"></span>${s}</div></div>`).join('')}
<div class="cta" style="left:60px;right:60px;top:${o+1060}px;font-size:64px;padding:4px 0">Evitali così →</div>
<div class="disc" style="left:0;right:0;text-align:center;top:${o+1170}px;font-size:22px">${DISC}</div>` },

  { id: '2026-11-13-inserzione-hai-il-pettorale',
    q: () => `${BG(1080, 72, 66)}${LOGO(60, 50)}<div class="kick" style="left:62px;top:112px;font-size:26px">Iscritto alla tua prima gara?</div>
<h1 style="left:56px;top:150px;width:980px;font-size:118px">Hai già il pettorale?<br><em>Parti oggi.</em></h1>
<div class="sub" style="left:62px;top:420px;width:460px;font-size:34px">Il tempo passa. Il tuo piano è già pronto nel telefono.</div>
${bib(80, 560, 330, -6)}
${phone(IMG.piano, 610, 410, 290, 7)}
<div class="cta" style="left:60px;top:930px;width:440px;font-size:48px;padding:4px 0">Inizia oggi →</div>
<div class="disc" style="left:62px;top:1035px;font-size:19px">${DISC}</div>`,
    v: (o) => `${BG(1920, 72, 52)}${LOGO(64, o + 30, 34)}<div class="kick" style="left:66px;top:${o+100}px;font-size:30px">Iscritto alla tua prima gara?</div>
<h1 style="left:60px;top:${o+145}px;width:980px;font-size:106px">Hai già il pettorale?<br><em>Parti oggi.</em></h1>
<div class="sub" style="left:66px;top:${o+445}px;width:900px;font-size:42px">Il tempo passa. Il tuo piano è già pronto nel telefono.</div>
${bib(70, o + 600, 420, -6)}
${phone(IMG.piano, 620, o + 560, 240, 7)}
<div class="cta" style="left:60px;right:60px;top:${o+1060}px;font-size:64px;padding:4px 0">Inizia oggi →</div>
<div class="disc" style="left:0;right:0;text-align:center;top:${o+1170}px;font-size:22px">${DISC}</div>` },
];

// ---------- caroselli 1080x1080 (angoli 3 e 4) ----------
const swipe = (i, n) => `<div class="abs" style="right:60px;top:56px;font-weight:800;font-size:24px;color:#A9A49B">${i}/${n}${i < n ? ' &nbsp;→' : ''}</div>`;
const slide = (i, n, body, cx = 75, cy = 65) => `${BG(1080, cx, cy)}${LOGO(60, 50)}${swipe(i, n)}${body}<div class="disc" style="left:62px;top:1035px;font-size:19px">${DISC}</div>`;
const ERR = (y) => `<div class="abs" style="left:62px;top:${y}px;display:flex;align-items:center;gap:12px;font-weight:800;font-size:26px;letter-spacing:.16em;color:#ff6b6b"><span class="x"></span>ERRORE</div>`;
const CAR = [
  { id: '2026-11-13-inserzione-ogni-settimana', slides: [
    (i, n) => slide(i, n, `<h1 style="left:56px;top:170px;width:980px;font-size:128px">Non sai cosa fare<br>prima della gara?</h1>
<div class="sub" style="left:62px;top:470px;width:900px;font-size:40px">Ogni settimana ti chiedi: corro? Faccio le stazioni? Quanto?</div>${weeks(62, 640, 6, 140, 6, 0, 52)}
<div class="sub" style="left:62px;top:860px;font-size:34px;color:${A};font-weight:800">Scorri: qui è già tutto deciso →</div>`),
    (i, n) => slide(i, n, `<div class="num" style="left:40px;top:115px;font-size:250px">01</div><h1 style="left:56px;top:430px;width:520px;font-size:92px">Apri l'app.<br><em>Oggi sai già cosa fare.</em></h1>
<div class="sub" style="left:62px;top:800px;width:480px;font-size:32px">L'allenamento del giorno è pronto: lo fai e lo spunti.</div>${phone(IMG.piano, 630, 140, 330, 5)}`),
    (i, n) => slide(i, n, `<div class="num" style="left:40px;top:115px;font-size:250px">02</div><h1 style="left:56px;top:430px;width:960px;font-size:100px">12 settimane.<br><em>Oppure Express da 6.</em></h1>
<div class="sub" style="left:62px;top:670px;width:960px;font-size:34px">Scegli il piano che si adatta al tempo che hai prima della gara.</div>${weeks(62, 790, 12, 70, 12, 6, 30)}`),
    (i, n) => slide(i, n, `<div class="num" style="left:40px;top:115px;font-size:250px">03</div><h1 style="left:56px;top:430px;width:960px;font-size:100px">Le 8 stazioni,<br><em>anche senza attrezzi.</em></h1>
<div class="sub" style="left:62px;top:670px;width:960px;font-size:34px">Per ogni stazione trovi l'alternativa da fare in una palestra normale.</div>
${card(62, 790, 440, -2, checks('Esempio', [['Niente slitta? C\'è l\'alternativa']]))}${card(560, 800, 440, 2, checks('Timer', [['Lavoro e recupero già impostati']]))}`),
    (i, n) => slide(i, n, `<h1 style="left:56px;top:150px;width:560px;font-size:104px">Il tuo piano,<br><em>già deciso.</em></h1>
<div class="sub" style="left:62px;top:400px;width:500px;font-size:34px">Guida PDF + app per la tua prima gara HYROX®. La scarichi e parti subito.</div>
${phone(IMG.piano, 640, 150, 320, 5)}<div class="cta" style="left:60px;top:700px;width:500px;font-size:54px;padding:6px 0">Scopri il piano →</div>`) ] },
  { id: '2026-11-13-inserzione-errori-principiante', slides: [
    (i, n) => slide(i, n, `<h1 style="left:56px;top:170px;width:980px;font-size:140px">3 errori da<br><em>principiante.</em></h1>
<div class="sub" style="left:62px;top:500px;width:900px;font-size:42px">Alla prima gara HYROX® è facile farli. Tu puoi evitarli.</div>
<div class="sub" style="left:62px;top:860px;font-size:34px;color:${A};font-weight:800">Scorri →</div>`),
    (i, n) => slide(i, n, `<div class="num" style="left:40px;top:115px;font-size:250px">01</div>${ERR(380)}<h1 style="left:56px;top:430px;width:560px;font-size:100px">Partire<br>troppo forte</h1>
<div class="sub" style="left:62px;top:650px;width:520px;font-size:32px">Il primo km vola, poi le gambe si spengono alle stazioni.</div>
${card(62, 800, 500, -2, `<div class="k">Come evitarlo</div><div class="c">Corri al ritmo gara calcolato sul tuo tempo obiettivo</div>`)}${phone(IMG.ritmo, 660, 300, 290, 5)}`),
    (i, n) => slide(i, n, `<div class="num" style="left:40px;top:115px;font-size:250px">02</div>${ERR(380)}<h1 style="left:56px;top:430px;width:980px;font-size:100px">Non conoscere<br>le stazioni</h1>
<div class="sub" style="left:62px;top:650px;width:960px;font-size:34px">Arrivare alla slitta senza averla mai provata fa paura.</div>
${card(62, 770, 960, -1, `<div class="k">Come evitarlo</div><div class="c" style="font-size:30px">Le 8 stazioni spiegate una per una, con le alternative per la palestra normale</div>`)}`),
    (i, n) => slide(i, n, `<div class="num" style="left:40px;top:115px;font-size:250px">03</div>${ERR(380)}<h1 style="left:56px;top:430px;width:980px;font-size:100px">Allenarti solo<br>a correre</h1>
<div class="sub" style="left:62px;top:650px;width:960px;font-size:34px">In gara corri dopo ogni stazione, con le gambe già stanche.</div>
${card(62, 770, 960, -1, `<div class="k">Come evitarlo</div><div class="c" style="font-size:30px">Allenamenti con corsa e stazioni insieme, già pronti nell'app</div>`)}`),
    (i, n) => slide(i, n, `<h1 style="left:56px;top:150px;width:560px;font-size:96px">Evitali<br><em>dal primo<br>giorno.</em></h1>
<div class="sub" style="left:62px;top:470px;width:500px;font-size:34px">Guida PDF + app con il piano per la tua prima gara HYROX®.</div>
${phone(IMG.piano, 640, 150, 320, 5)}<div class="cta" style="left:60px;top:720px;width:500px;font-size:54px;padding:6px 0">Scopri il piano →</div>`) ] },
];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const shot = async (w, h, body, file) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(`<style>${FONTS}${CSS}</style><div class="ad" style="width:${w}px;height:${h}px">${body}</div>`); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, file) }); await p.close();
  };
  const only = process.argv[3];
  for (const a of ADS) { if (only && !a.id.includes(only)) continue;
    await shot(1080, 1080, a.q(), `${a.id}-1080x1080.png`); await shot(1080, 1920, `<div class="abs" style="inset:0;transform:scale(.825);transform-origin:540px 157px">${a.v(270)}</div>`, `${a.id}-1080x1920.png`); }
  for (const c of CAR) { if (only && !c.id.includes(only)) continue;
    for (let i = 0; i < c.slides.length; i++) await shot(1080, 1080, c.slides[i](i + 1, c.slides.length), `${c.id}-carosello-${i + 1}-1080x1080.png`); }
  await b.close(); console.log('ok', out);
})();
