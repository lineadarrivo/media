// Schermate aggiornate dell'app Primo Traguardo (stessa grafica di templates/page.app.liquid del tema Shopify),
// con la gara impostata su HYROX Verona (28 gennaio 2027), piano 12 settimane, 4 giorni.
// Uso: node schermate-app.js cartella_uscita  -> app-piano.png, app-ritmo.png, app-timer.png (390x844 @3x)
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const nm = (p) => path.join(__dirname, 'node_modules', p);
const f64 = (p) => 'data:font/woff2;base64,' + fs.readFileSync(nm(p)).toString('base64');
const FONTS = `@font-face{font-family:Anton;src:url(${f64('@fontsource/anton/files/anton-latin-400-normal.woff2')})}` +
  [500, 600, 700, 800].map(w => `@font-face{font-family:Inter;font-weight:${w};src:url(${f64(`@fontsource/inter/files/inter-latin-${w}-normal.woff2`)})}`).join('');
const out = process.argv[2];
const CSS = `:root{--bg:#16181B;--card:#1F2226;--card2:#262A2F;--line:#30353B;--fg:#fff;--mut:#A9A49B;--acc:#FF4419}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--fg);font-family:Inter,sans-serif;font-size:16px;line-height:1.45;width:390px;height:844px;overflow:hidden}
.sb{height:47px;display:flex;align-items:center;justify-content:space-between;padding:0 30px 0 34px;font-weight:700;font-size:16px}
.sb .r{display:flex;gap:6px;align-items:center}.sb .r i{display:block;width:4px;height:4px;border-radius:2px;background:#fff}.sb .r b{display:block;width:24px;height:12px;border-radius:3px;border:1.5px solid #fff;position:relative}.sb .r b:after{content:"";position:absolute;inset:1.5px;right:5px;background:#fff;border-radius:1px}
.wrap{padding:0 16px}
header{background:rgba(22,24,27,.94);border-bottom:1px solid var(--line)}
header .wrap{display:flex;align-items:center;gap:10px;height:56px}header svg{width:30px;height:30px;flex:none}
header .t{font-family:Anton;font-size:20px;letter-spacing:.02em;text-transform:uppercase}
header .cd{margin-left:auto;font-size:13px;font-weight:700;color:var(--mut);text-align:right;line-height:1.25}header .cd b{color:var(--acc);font-size:16px}
h1,h2{font-family:Anton;font-weight:400;text-transform:uppercase;letter-spacing:.01em;line-height:1.05;margin:22px 0 10px}h1{font-size:34px}h2{font-size:24px}
.k{color:var(--acc);font-weight:800;font-size:12px;letter-spacing:.14em;text-transform:uppercase}
p{margin:6px 0 12px}.mut{color:var(--mut)}.note{font-size:13px;color:var(--mut)}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;margin:12px 0}
.row{display:flex;gap:10px;align-items:center}
.btn{display:flex;align-items:center;justify-content:center;border:0;border-radius:12px;padding:14px 18px;font-weight:800;background:var(--acc);color:#16181B;width:100%;font-size:16px}
.btn.sec{background:var(--card2);color:var(--fg);border:1px solid var(--line)}
.seg{display:flex;background:var(--card2);border-radius:12px;padding:4px;gap:4px}.seg span{flex:1;text-align:center;padding:10px 6px;border-radius:9px;font-weight:700;color:var(--mut);font-size:14px}.seg span.on{background:var(--acc);color:#16181B}
nav{position:absolute;left:0;right:0;bottom:0;background:#121417;border-top:1px solid var(--line);padding-bottom:22px}
nav .wrap{display:flex;padding:0 4px}nav span{flex:1;padding:9px 0 10px;color:var(--mut);font-size:11px;font-weight:700;display:flex;flex-direction:column;align-items:center;gap:3px}
nav svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}nav span.on{color:var(--acc)}
.prog{height:10px;background:var(--card2);border-radius:6px;overflow:hidden;margin:8px 0}.prog i{display:block;height:100%;background:var(--acc);border-radius:6px}
.sess{display:flex;gap:12px;align-items:flex-start;padding:14px 0;border-top:1px solid var(--line)}.sess.first{border-top:0}
.chk{flex:none;width:30px;height:30px;border-radius:9px;border:2px solid var(--line);display:flex;align-items:center;justify-content:center;margin-top:2px}
.chk.on{background:var(--acc);border-color:var(--acc)}.chk.on::after{content:"";width:12px;height:7px;border-left:3px solid #16181B;border-bottom:3px solid #16181B;transform:rotate(-45deg) translate(1px,-2px)}
.sess .h{font-weight:800}.sess .d{color:var(--mut);font-size:15px}.sess.done .h{text-decoration:line-through;text-decoration-color:var(--acc)}
.wk{display:flex;gap:6px;overflow:hidden;padding:4px 0 10px}
.wk span{flex:none;min-width:46px;height:52px;border-radius:12px;border:1px solid var(--line);background:var(--card);font-weight:800;position:relative;font-size:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1}
.wk span small{display:block;font-size:9px;color:var(--mut);font-weight:700;letter-spacing:.05em}
.wk span.on{border-color:var(--acc);background:var(--card2)}.wk span.cur::before{content:"";position:absolute;top:5px;right:5px;width:6px;height:6px;border-radius:3px;background:var(--acc)}
.tag{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:4px 8px;border-radius:6px}.tag.a{background:var(--acc);color:#16181B}
.stat{flex:1;background:var(--card2);border-radius:12px;padding:12px}.stat .v{font-family:Anton;font-size:28px;line-height:1.1}.stat .l{font-size:12px;color:var(--mut);font-weight:700}
table{width:100%;border-collapse:collapse;font-size:15px}td{padding:9px 4px;border-top:1px solid var(--line)}td:last-child{text-align:right;font-weight:800}tr.st td:first-child{color:var(--acc);font-weight:700}
.timer{font-family:Anton;font-size:96px;line-height:1;text-align:center;margin:10px 0}
.phase{text-align:center;font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-size:14px;color:var(--mut)}.phase.w{color:var(--acc)}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.step{display:flex;align-items:center;background:var(--card2);border-radius:10px;overflow:hidden}.step b{width:40px;height:44px;font-size:22px;font-weight:800;color:var(--acc);display:flex;align-items:center;justify-content:center}.step span{flex:1;text-align:center;font-weight:800}
.res{border-left:4px solid var(--acc)}`;
const SB = `<div class="sb"><span>9:41</span><span class="r"><i></i><i></i><i></i><b></b></span></div>`;
const LOGO = `<svg viewBox="0 0 74 74"><rect width="74" height="74" rx="10" fill="#16181B"/><g fill="#fff"><rect x="10" y="10" width="9" height="9"/><rect x="28" y="10" width="9" height="9"/><rect x="46" y="10" width="9" height="9"/><rect x="19" y="19" width="9" height="9"/><rect x="37" y="19" width="9" height="9"/><rect x="55" y="19" width="9" height="9"/></g><rect x="10" y="36" width="54" height="6" fill="#FF4419"/><path d="M16 64 L30 50 L40 58 L58 44" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const HDR = `<header><div class="wrap">${LOGO}<div class="t">Primo Traguardo</div><div class="cd"><b>83</b> giorni<br>alla gara</div></div></header>`;
const NAV = (on) => `<nav><div class="wrap">${[
  ['plan', 'Piano', '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M8 14l2.5 2.5L16 12"/>'],
  ['test', 'Test', '<path d="M9 3h6M10 3v5L5 19a1.5 1.5 0 0 0 1.3 2h11.4A1.5 1.5 0 0 0 19 19l-5-11V3"/>'],
  ['pace', 'Ritmo', '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M10 2h4"/>'],
  ['timer', 'Timer', '<path d="M6 4l12 8-12 8z"/>'],
  ['st', 'Stazioni', '<path d="M6.5 6.5l11 11M3 10l3-3 3 3-3 3zM15 18l3-3 3 3-3 3zM2 7l5-5M17 22l5-5"/>'],
  ['race', 'Gara', '<path d="M4 22V4M4 4h14l-3 4 3 4H4"/>']].map(([k, l, s]) => `<span class="${k === on ? 'on' : ''}"><svg viewBox="0 0 24 24">${s}</svg>${l}</span>`).join('')}</div></nav>`;
const SESS = [['Corsa lunga', '25 min a ritmo facile (devi riuscire a parlare)'], ['Tecnica stazioni', 'Giro leggero di tutte le 8 stazioni a volume ridotto, pause complete, solo tecnica'], ['Ripetute', '4 × 400 m a ritmo gara +10 sec, recupero 90 sec'], ['Forza generale + core', 'Squat, affondi, stacco, trazioni, plank: 2-3 serie × 10-12']];
const piano = `${SB}${HDR}<div class="wrap">
<div class="k" style="margin-top:22px">Piano 12 settimane · 4 giorni</div><h1>Settimana 1 di 12</h1>
<p class="mut">Mancano <b style="color:#fff">83 giorni</b> alla gara.</p>
<div class="row"><div style="flex:1"><div class="prog"><i style="width:4%"></i></div></div><div class="note" style="font-weight:800">2/49</div></div>
<div class="wk">${Array.from({length:7},(_,i)=>`<span class="${i===0?'on cur':''}"><small>SETT</small>${i+1}</span>`).join('')}</div>
<div class="card"><div class="row" style="justify-content:space-between"><div><div class="k">Settimana 1</div><h2 style="margin:6px 0 2px">Base</h2></div><span class="tag a">Questa settimana</span></div>
${SESS.map(([h,d],j)=>`<div class="sess${j===0?' first':''}${j<2?' done':''}"><span class="chk${j<2?' on':''}"></span><div><div class="h">Allenamento ${j+1} · ${h}</div><div class="d">${d}</div></div></div>`).join('')}</div></div>${NAV('plan')}`;
// ritmo: obiettivo 1h50 (corsa 59%, stazioni 38%, Roxzone 3%, come nell'app)
const T = 110 * 60, run = T * .59 / 8, stT = T * .38, rx = T * .03;
const ms = (t) => { t = Math.round(t); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
const hms = (t) => { t = Math.round(t); const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); };
const ST = [['SkiErg', '1000 m', 1.2], ['Sled Push', '50 m', .9], ['Sled Pull', '50 m', 1.0], ['Burpee Broad Jump', '80 m', .8]];
let cum = 0, rows = '';
for (let i = 0; i < 4; i++) { cum += run + rx / 16; rows += `<tr><td>Km ${i+1}</td><td class="note">${ms(run)}</td><td>${hms(cum)}</td></tr>`; const st = stT * ST[i][2] / 8; cum += st + rx / 16; rows += `<tr class="st"><td>${ST[i][0]} <span class="note">${ST[i][1]}</span></td><td class="note">~${ms(st)}</td><td>${hms(cum)}</td></tr>`; }
const ritmo = `${SB}${HDR}<div class="wrap"><div class="k" style="margin-top:22px">Strategia di gara</div><h1>Il tuo ritmo gara</h1>
<div class="card"><div class="note" style="margin-bottom:6px">Tempo obiettivo</div><div class="grid3"><div class="step"><b>−</b><span>1</span><b>+</b></div><div class="step" style="grid-column:span 2"><b>−</b><span>50</span><b>+</b></div></div></div>
<div class="row" style="gap:8px"><div class="stat"><div class="l">Ritmo corsa</div><div class="v">${ms(run)}</div><div class="l">al km</div></div><div class="stat"><div class="l">Media stazione</div><div class="v">${ms(stT/8)}</div><div class="l">per stazione</div></div><div class="stat"><div class="l">Roxzone</div><div class="v">${ms(rx)}</div><div class="l">in totale</div></div></div>
<div class="card"><div class="k">Tabella km per km</div><table style="margin-top:8px">${rows}</table></div></div>${NAV('pace')}`;
const timer = `${SB}${HDR}<div class="wrap"><div class="k" style="margin-top:22px">Allenamento</div><h1>Timer</h1>
<div class="seg"><span class="on">Intervalli</span><span>Cronometro</span></div>
<div class="card"><div class="grid3"><div><div class="note">Lavoro</div><div class="step"><b>−</b><span>1:00</span><b>+</b></div></div><div><div class="note">Recupero</div><div class="step"><b>−</b><span>1:30</span><b>+</b></div></div><div><div class="note">Giri</div><div class="step"><b>−</b><span>4</span><b>+</b></div></div></div></div>
<div class="card" style="text-align:center"><div class="phase w">Lavoro</div><div class="timer">0:42</div><div class="note">Giro 2 di 4</div>
<div class="row" style="margin-top:14px"><span class="btn">Pausa</span><span class="btn sec" style="width:40%">Azzera</span></div></div></div>${NAV('timer')}`;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const [n, h] of [['piano', piano], ['ritmo', ritmo], ['timer', timer]]) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
    await p.setContent(`<style>${FONTS}${CSS}</style><div style="position:relative;width:390px;height:844px">${h}</div>`); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, `app-${n}.png`) }); await p.close();
  }
  await b.close(); console.log('ok');
})();
