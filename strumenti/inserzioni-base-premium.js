// Inserzioni del gruppo BASE (sempre valide: niente città, date o giorni mancanti), stile "premium".
// Uso: node inserzioni-base-premium.js cartella_uscita
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const nm = (p) => path.join(__dirname, 'node_modules', p);
const f64 = (p) => 'data:font/woff2;base64,' + fs.readFileSync(nm(p)).toString('base64');
const FONTS = `@font-face{font-family:Anton;src:url(${f64('@fontsource/anton/files/anton-latin-400-normal.woff2')})}` +
  [600, 700, 800].map(w => `@font-face{font-family:Inter;font-weight:${w};src:url(${f64(`@fontsource/inter/files/inter-latin-${w}-normal.woff2`)})}`).join('');
const img = (n) => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', 'risorse', n)).toString('base64');
const out = process.argv[2];
const flag = (a, b, px) => `<span class="flag" style="grid-template-columns:repeat(4,${px}px)">${Array.from({length:16},(_,i)=>`<i style="width:${px}px;height:${px}px;background:${((i%4)+Math.floor(i/4))%2?b:a}"></i>`).join('')}</span>`;
const CSS = `*{margin:0;box-sizing:border-box}body{overflow:hidden;font-family:Inter}
.ad{position:relative;overflow:hidden;background:#0e1012;color:#fff}
.flag{display:inline-grid;vertical-align:middle;margin-right:12px}.flag i{display:block}
.abs{position:absolute}.anton{font-family:Anton;font-weight:400;text-transform:uppercase;line-height:.9}
.beam{position:absolute;width:260px;height:2200px;background:linear-gradient(to bottom,rgba(255,68,25,0),rgba(255,68,25,.22),rgba(255,68,25,0));transform-origin:50% 50%;filter:blur(18px)}
.tape{position:absolute;left:-200px;right:-200px;height:78px;background:conic-gradient(#16181B 25%,#fff 0 50%,#16181B 0 75%,#fff 0) 0 0/39px 39px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
.ghost{font-family:Anton;color:transparent;-webkit-text-stroke:3px rgba(255,68,25,.55);line-height:.8}
.phone{position:absolute;background:#08090a;border:3px solid #55595f;border-radius:52px;padding:11px;box-shadow:0 60px 110px rgba(0,0,0,.8),0 0 140px rgba(255,68,25,.5),inset 0 0 0 2px #1d1f22}
.phone img{display:block;width:100%;border-radius:41px}
.fc{position:absolute;background:rgba(28,31,35,.94);border:1.5px solid rgba(255,255,255,.12);border-radius:22px;padding:18px 22px;box-shadow:0 30px 60px rgba(0,0,0,.6);backdrop-filter:blur(6px)}
.fc .k{color:#FF4419;font-weight:800;font-size:20px;letter-spacing:.16em;text-transform:uppercase}
.fc .v{font-family:Anton;font-size:70px;line-height:1;margin-top:6px;display:flex;align-items:baseline;justify-content:inherit}.fc .v small{font-family:Inter;font-weight:700;font-size:26px;color:#A9A49B;margin-left:6px}
.fc .c{display:flex;align-items:center;gap:12px;font-weight:700;font-size:26px;margin-top:10px}
.fc .c i{flex:none;width:28px;height:28px;border-radius:8px;background:#FF4419;position:relative}.fc .c i:after{content:"";position:absolute;left:8px;top:7px;width:11px;height:6px;border-left:3px solid #16181B;border-bottom:3px solid #16181B;transform:rotate(-45deg)}
.fc .btn{margin-top:12px;background:#FF4419;color:#16181B;border-radius:12px;text-align:center;font-weight:800;font-size:24px;padding:10px 0}
.chip2{position:absolute;font-family:Anton;font-size:46px;line-height:1;background:#FF4419;padding:10px 20px;transform:rotate(-2deg);box-shadow:0 12px 30px rgba(255,68,25,.4);z-index:4}
.chips{display:flex;flex-wrap:wrap;gap:10px}.chips span{border:1.5px solid rgba(255,255,255,.22);border-radius:30px;padding:8px 16px;font-weight:700;font-size:21px;color:#e6e6e6;background:rgba(255,255,255,.04)}
.cta{position:absolute;font-family:Anton;text-align:center;background:linear-gradient(90deg,#FF4419,#ff6a3d);color:#fff;border-radius:18px;box-shadow:0 20px 50px rgba(255,68,25,.4);z-index:10}
.sub{position:absolute;left:0;right:0;text-align:center;font-weight:800;z-index:10}
.disc{position:absolute;left:0;right:0;text-align:center;font-weight:600;font-size:19px;color:#7c7f84;z-index:10}`;
const card = {
  test: (x, y, r) => `<div class="fc" style="left:${x}px;top:${y}px;width:370px;transform:rotate(${r}deg)"><div class="k">Test iniziale</div><div class="v" style="font-size:80px">20<small>minuti</small></div><div class="c" style="color:#d0ccc4;font-size:24px">per partire da dove sei oggi</div></div>`,
  piano: (x, y, r) => `<div class="fc" style="left:${x}px;top:${y}px;width:370px;transform:rotate(${r}deg)"><div class="k">Piano</div><div class="v" style="font-size:80px">12<small>settimane</small></div><div class="c" style="color:#d0ccc4;font-size:24px">oppure Express da 6</div></div>`,
  timer: (x, y, r) => `<div class="fc" style="left:${x}px;top:${y}px;width:275px;transform:rotate(${r}deg);text-align:center"><div class="k">Timer · Lavoro</div><div class="v" style="font-size:84px;justify-content:center">0:42</div><div class="btn">Pausa</div></div>`,
  gara: (x, y, r) => `<div class="fc" style="left:${x}px;top:${y}px;width:415px;transform:rotate(${r}deg)"><div class="k">Giorno gara</div><div class="c"><i></i>Borsa pronta</div><div class="c"><i></i>Colazione 2-3 ore prima</div><div class="c"><i></i>Riscaldamento 10-15'</div></div>`,
  stazioni: (x, y, r) => `<div class="fc" style="left:${x}px;top:${y}px;width:415px;transform:rotate(${r}deg)"><div class="k">Le 8 stazioni</div><div class="c"><i></i>Niente slitta? Alternativa</div><div class="c"><i></i>Regola ufficiale</div><div class="c"><i></i>Errore da evitare</div></div>`,
};
const ADS = [
  { id: 'paura-di-non-finire', label: 'IL TUO PRIMO HYROX', title: 'Paura di<br><span style="color:#FF4419">non finire?</span>', size: 150, chip: 'Ogni giorno sai cosa fare.', phone: 'app-piano-base.png',
    cards: (o) => card.test(50, o + 560, -4) + card.piano(55, o + 800, 3) + card.timer(770, o + 610, 5) + card.gara(640, o + 920, -3) },
  { id: 'non-serve-essere-atleti', label: 'PRIMO HYROX?', title: 'Non serve<br><span style="color:#FF4419">essere atleti.</span>', size: 140, chip: 'Il piano parte da dove sei oggi.', phone: 'app-ritmo.png',
    cards: (o) => card.test(50, o + 560, -4) + card.piano(55, o + 800, 3) + card.timer(770, o + 610, 5) + card.stazioni(640, o + 920, -3) },
];
const AD = (a, h) => { const o = h === 1920 ? 250 : 0; return `<div class="ad" style="width:1080px;height:${h}px">
<div class="abs" style="inset:0;background:radial-gradient(circle at 62% ${h===1920?50:58}%,rgba(255,68,25,.5),rgba(255,68,25,0) 45%),radial-gradient(circle at 0% 0%,rgba(255,68,25,.18),rgba(255,68,25,0) 40%)"></div>
<div class="beam" style="left:420px;top:-500px;transform:rotate(28deg)"></div><div class="beam" style="left:760px;top:-500px;transform:rotate(28deg);opacity:.6"></div>
<div class="abs ghost" style="left:300px;top:${o+470}px;font-size:760px">12</div>
<div class="tape" style="top:${o+935}px;transform:rotate(-9deg)"></div>
<div class="abs" style="left:64px;top:${o+52}px;font-family:Anton;font-size:32px">${flag('#fff','#0e1012',8)}LINEA <span style="color:#FF4419">D'ARRIVO</span></div>
<div class="abs" style="left:66px;top:${o+118}px;font-weight:800;font-size:30px;letter-spacing:.18em;color:#FF4419">${a.label}</div>
<div class="abs anton" style="left:58px;top:${o+165}px;font-size:${a.size}px;line-height:.92;text-shadow:0 10px 40px rgba(0,0,0,.5)">${a.title}</div>
<div class="chip2" style="left:66px;top:${o+452}px">${a.chip}</div>
<div class="phone" style="left:430px;top:${o+480}px;width:330px;transform:perspective(1800px) rotateY(-12deg) rotateZ(6deg)"><img src="${img(a.phone)}"></div>
${a.cards(o)}
<div class="cta" style="left:60px;right:60px;top:${o+1140}px;font-size:74px;padding:2px 0">Inizia ora – 27 €</div>
<div class="sub" style="top:${o+1272}px;font-size:26px">Una volta sola · nessun abbonamento · download immediato</div>
<div class="disc" style="top:${o+1316}px">Guida indipendente, non affiliata a HYROX.</div></div>`; };
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const a of ADS) for (const h of [1350, 1920]) {
    const p = await b.newPage({ viewport: { width: 1080, height: h } });
    await p.setContent(`<style>${FONTS}${CSS}</style>${AD(a, h)}`); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, `2026-11-06-inserzione-base-${a.id}-1080x${h}.png`) }); await p.close();
  }
  await b.close(); console.log('ok');
})();
