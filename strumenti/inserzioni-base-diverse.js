// Due inserzioni del gruppo BASE, sempre valide e con grafiche DIVERSE tra loro e dalla PREMIUM di Verona:
//  A "Paura di non finire?"  -> sfondo sabbia, il percorso della gara (8 stazioni) dal VIA al TRAGUARDO
//  B "Non serve essere atleti" -> sfondo arancione, "Cosa pensi" (sbarrato) contro "La verità"
// Uso: node inserzioni-base-diverse.js cartella_uscita
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
.ad{position:relative;overflow:hidden}
.flag{display:inline-grid;vertical-align:middle;margin-right:12px}.flag i{display:block}
.abs{position:absolute}.anton{font-family:Anton;font-weight:400;text-transform:uppercase;line-height:.92}
.logo{position:absolute;font-family:Anton;font-size:32px}
.phone{position:absolute;background:#08090a;border:3px solid #55595f;border-radius:46px;padding:10px;box-shadow:0 40px 80px rgba(0,0,0,.45)}
.phone img{display:block;width:100%;border-radius:36px}
.cta{position:absolute;font-family:Anton;text-align:center;border-radius:18px;z-index:10}
.sub{position:absolute;left:0;right:0;text-align:center;font-weight:800;z-index:10}
.disc{position:absolute;left:0;right:0;text-align:center;font-weight:600;font-size:19px;z-index:10}
.box{position:absolute;border-radius:24px;padding:24px 28px;z-index:3}
.box .k{font-weight:800;font-size:22px;letter-spacing:.16em;text-transform:uppercase}
.box .it{display:flex;align-items:center;gap:16px;font-weight:800;font-size:31px;margin-top:16px;line-height:1.15}
.box .it b{flex:none;width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:26px}`;

// ---------- A: il percorso della gara ----------
const ST = ['SkiErg', 'Sled Push', 'Sled Pull', 'Burpee', 'Rowing', 'Farmers', 'Lunges', 'Wall Ball'];
const PTS = [[40, 40], [580, 40], [580, 175], [40, 175], [40, 310], [580, 310], [580, 445], [300, 445]];
function along(f) { // punto sulla spezzata a una frazione f della lunghezza
  const seg = []; let L = 0; for (let i = 1; i < PTS.length; i++) { const d = Math.hypot(PTS[i][0]-PTS[i-1][0], PTS[i][1]-PTS[i-1][1]); seg.push(d); L += d; }
  let t = f * L; for (let i = 0; i < seg.length; i++) { if (t <= seg[i]) { const r = t / seg[i]; return [PTS[i][0] + (PTS[i+1][0]-PTS[i][0]) * r, PTS[i][1] + (PTS[i+1][1]-PTS[i][1]) * r, PTS[i+1][1] !== PTS[i][1]]; } t -= seg[i]; }
  return PTS[PTS.length - 1];
}
function route() {
  let s = `<svg width="660" height="540" viewBox="0 0 660 540" style="overflow:visible">
<polyline points="${PTS.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#16181B" stroke-width="10" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2 22"/>`;
  for (let k = 1; k <= 8; k++) { const [x, y] = along((k - 0.5) / 9); s += `<circle cx="${x}" cy="${y}" r="9" fill="#16181B"/>`; }
  for (let k = 1; k <= 8; k++) {
    const [x, y, vert] = along(k / 9);
    s += `<rect x="${x-26}" y="${y-26}" width="52" height="52" rx="12" fill="#FF4419"/><text x="${x}" y="${y+12}" text-anchor="middle" font-family="Anton" font-size="34" fill="#fff">${k}</text>`;
    s += vert ? `<text x="${x + (x > 300 ? -40 : 40)}" y="${y+8}" text-anchor="${x > 300 ? 'end' : 'start'}" font-family="Inter" font-weight="800" font-size="23" fill="#16181B">${ST[k-1]}</text>`
              : `<text x="${x}" y="${y+58}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="23" fill="#16181B">${ST[k-1]}</text>`;
  }
  s += `<rect x="-6" y="18" width="92" height="44" rx="22" fill="#16181B"/><text x="40" y="49" text-anchor="middle" font-family="Anton" font-size="26" fill="#fff">VIA</text>`;
  const [fx, fy] = PTS[PTS.length - 1];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += `<rect x="${fx-56+i*14}" y="${fy-28+j*14}" width="14" height="14" fill="${(i+j)%2?'#fff':'#16181B'}"/>`;
  s += `<text x="${fx-70}" y="${fy+10}" text-anchor="end" font-family="Anton" font-size="34" fill="#16181B">TRAGUARDO</text></svg>`;
  return s;
}
const A = (h) => { const o = h === 1920 ? 250 : 0; return `<div class="ad" style="width:1080px;height:${h}px;background:#ECE8E0;color:#16181B">
<div class="abs" style="inset:0;background:radial-gradient(circle at 85% 55%,rgba(255,68,25,.18),rgba(255,68,25,0) 40%)"></div>
<div class="logo" style="left:64px;top:${o+52}px">${flag('#16181B','#ECE8E0',8)}LINEA <span style="color:#FF4419">D'ARRIVO</span></div>
<div class="abs" style="left:66px;top:${o+118}px;font-weight:800;font-size:30px;letter-spacing:.18em;color:#FF4419">IL TUO PRIMO HYROX</div>
<div class="abs anton" style="left:58px;top:${o+162}px;font-size:150px">Paura di<br>non finire?</div>
<div class="abs" style="left:64px;top:${o+455}px;font-weight:800;font-size:34px">Ci arrivi un pezzo alla volta: <span style="color:#FF4419">1 km, una stazione.</span></div>
<div class="abs" style="left:50px;top:${o+560}px">${route()}</div>
<div class="phone" style="left:745px;top:${o+520}px;width:285px;transform:rotate(6deg)"><img src="${img('app-piano-base.png')}"></div>
<div class="cta" style="left:60px;right:60px;top:${o+1140}px;font-size:74px;padding:2px 0;background:#FF4419;color:#fff;box-shadow:0 18px 40px rgba(255,68,25,.35)">Inizia ora – 27 €</div>
<div class="sub" style="top:${o+1272}px;font-size:26px">Una volta sola · nessun abbonamento · download immediato</div>
<div class="disc" style="top:${o+1316}px;color:#5d6066">Guida indipendente, non affiliata a HYROX.</div></div>`; };

// ---------- B: cosa pensi / la verità ----------
const B = (h) => { const o = h === 1920 ? 250 : 0; return `<div class="ad" style="width:1080px;height:${h}px;background:#FF4419;color:#16181B">
<div class="abs" style="inset:0;background:radial-gradient(rgba(0,0,0,.09) 2px,transparent 2.5px) 0 0/18px 18px"></div>
<div class="logo" style="left:64px;top:${o+52}px">${flag('#16181B','#FF4419',8)}LINEA <span style="color:#fff">D'ARRIVO</span></div>
<div class="abs" style="left:66px;top:${o+118}px;font-weight:800;font-size:30px;letter-spacing:.18em;color:#fff">PRIMO HYROX?</div>
<div class="abs anton" style="left:58px;top:${o+162}px;font-size:160px">Non serve<br><span style="color:#fff">essere atleti.</span></div>
<div class="box" style="left:60px;top:${o+490}px;width:600px;background:#16181B;color:#8a8d92;transform:rotate(-2deg)"><div class="k" style="color:#fff">Cosa pensi</div>
<div class="it" style="text-decoration:line-through;text-decoration-color:#FF4419;text-decoration-thickness:4px"><b style="background:#2a2d31;color:#FF4419">✕</b>Devo essere già in forma</div>
<div class="it" style="text-decoration:line-through;text-decoration-color:#FF4419;text-decoration-thickness:4px"><b style="background:#2a2d31;color:#FF4419">✕</b>Mi serve una palestra HYROX</div>
<div class="it" style="text-decoration:line-through;text-decoration-color:#FF4419;text-decoration-thickness:4px"><b style="background:#2a2d31;color:#FF4419">✕</b>Non so da dove partire</div></div>
<div class="box" style="left:60px;top:${o+800}px;width:640px;background:#fff;box-shadow:0 24px 50px rgba(0,0,0,.25);transform:rotate(1.5deg)"><div class="k" style="color:#FF4419">La verità</div>
<div class="it"><b style="background:#FF4419;color:#fff">✓</b>Parti da un test di 20 minuti</div>
<div class="it"><b style="background:#FF4419;color:#fff">✓</b>Alternative per ogni stazione</div>
<div class="it"><b style="background:#FF4419;color:#fff">✓</b>Ogni giorno sai cosa fare</div></div>
<div class="phone" style="left:735px;top:${o+520}px;width:290px;transform:rotate(7deg);box-shadow:0 40px 80px rgba(0,0,0,.4)"><img src="${img('app-ritmo.png')}"></div>
<div class="cta" style="left:60px;right:60px;top:${o+1140}px;font-size:74px;padding:2px 0;background:#16181B;color:#fff;box-shadow:0 18px 40px rgba(0,0,0,.3)">Inizia ora – 27 €</div>
<div class="sub" style="top:${o+1272}px;font-size:26px">Una volta sola · nessun abbonamento · download immediato</div>
<div class="disc" style="top:${o+1316}px;color:#16181B">Guida indipendente, non affiliata a HYROX.</div></div>`; };

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const [n, f] of [['paura-di-non-finire', A], ['non-serve-essere-atleti', B]]) for (const h of [1350, 1920]) {
    const p = await b.newPage({ viewport: { width: 1080, height: h } });
    await p.setContent(`<style>${FONTS}${CSS}</style>${f(h)}`); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, `2026-11-06-inserzione-base-${n}-v2-1080x${h}.png`) }); await p.close();
  }
  await b.close(); console.log('ok');
})();
