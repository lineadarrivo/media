// Genera le grafiche per le inserzioni Meta di Linea d'Arrivo in 3 formati (1080x1080, 1080x1920, 1920x1080).
// Uso: node inserzioni.js inserzioni.json cartella_uscita
// Formato: {"inserzioni":[{"id","titolo_grafica","beneficio","schermo":{"etichetta","titolo","righe":[]},"prezzo"}]}
// Regole MCA: testo grande, beneficio in evidenza, prodotto tangibile (guida + app su telefono), niente volti.
// Nel formato 1080x1920 restano libere le zone in alto (270 px) e in basso (430 px) per storie e reel.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [, , specFile, outDir] = process.argv;
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
const nm = (p) => path.join(__dirname, 'node_modules', p);
const f64 = (p) => 'data:font/woff2;base64,' + fs.readFileSync(nm(p)).toString('base64');
const FONTS = `@font-face{font-family:Anton;src:url(${f64('@fontsource/anton/files/anton-latin-400-normal.woff2')})}
@font-face{font-family:Inter;font-weight:400;src:url(${f64('@fontsource/inter/files/inter-latin-400-normal.woff2')})}
@font-face{font-family:Inter;font-weight:600;src:url(${f64('@fontsource/inter/files/inter-latin-600-normal.woff2')})}
@font-face{font-family:Inter;font-weight:700;src:url(${f64('@fontsource/inter/files/inter-latin-700-normal.woff2')})}`;
const flag = (a, b, px) => `<span class="flag" style="grid-template-columns:repeat(4,${px}px);width:${px*4}px">${Array.from({length:16},(_,i)=>`<i style="width:${px}px;height:${px}px;background:${((i%4)+Math.floor(i/4))%2?b:a}"></i>`).join('')}</span>`;
const DISC = 'Guida indipendente, non affiliata a HYROX.';
const FORMATI = { '1080x1080': [1080, 1080], '1080x1920': [1080, 1920], '1920x1080': [1920, 1080] };
const CSS = `*{margin:0;box-sizing:border-box}body{overflow:hidden;font-family:Inter}
.ad{position:relative;background:#16181B;color:#fff;overflow:hidden;background-image:radial-gradient(circle at 78% 72%,rgba(255,68,25,.28),rgba(255,68,25,0) 48%)}
.flag{display:inline-grid;vertical-align:middle;margin-right:14px}.flag i{display:block}
.logo{position:absolute;font-family:Anton;font-size:40px}.logo b{color:#FF4419;font-weight:400}
h1{position:absolute;font-family:Anton;font-weight:400;text-transform:uppercase;line-height:1.0}h1 em{font-style:normal;color:#FF4419}
.ben{position:absolute;font-weight:600;line-height:1.3;color:#ECE8E0}
.chip{position:absolute;display:flex;flex-direction:column;gap:10px}
.chip .p{background:#FF4419;color:#fff;font-family:Anton;padding:14px 30px;border-radius:14px;align-self:flex-start}
.chip .d{font-weight:700;color:#fff;letter-spacing:2px;text-transform:uppercase}
.disc{position:absolute;color:#7c7f84}
/* mockup: guida PDF + telefono con l'app */
.mock{position:absolute;width:750px;height:820px;transform-origin:0 0}
.book{position:absolute;left:0;top:90px;width:430px;height:580px;background:#ECE8E0;border-radius:10px 22px 22px 10px;box-shadow:0 30px 60px rgba(0,0,0,.55);transform:rotate(-7deg);padding:48px 40px;color:#16181B;border-left:14px solid #d9d3c7}
.book .k{font-weight:700;font-size:20px;letter-spacing:4px;color:#FF4419;margin-top:26px}
.book .t{font-family:Anton;font-size:58px;line-height:.98;margin-top:12px}.book .t b{color:#FF4419;font-weight:400}
.book .s{font-weight:600;font-size:23px;margin-top:20px;line-height:1.35}
.book .bar{position:absolute;left:40px;right:40px;bottom:46px;height:10px;background:#FF4419}
.phone{position:absolute;left:360px;top:0;width:390px;height:800px;background:#0b0c0e;border-radius:58px;padding:16px;box-shadow:0 40px 80px rgba(0,0,0,.6);border:3px solid #3a3d42}
.scr{width:100%;height:100%;background:#16181B;border-radius:44px;padding:58px 28px 28px;position:relative;overflow:hidden}
.scr:before{content:"";position:absolute;top:16px;left:50%;width:110px;height:28px;margin-left:-55px;background:#0b0c0e;border-radius:20px}
.scr .ap{font-family:Anton;font-size:24px}.scr .ap b{color:#FF4419;font-weight:400}
.scr .k{color:#FF4419;font-weight:700;font-size:17px;letter-spacing:3px;margin-top:30px}
.scr .t{font-family:Anton;font-size:44px;line-height:1.02;margin-top:8px;text-transform:uppercase}
.scr .r{margin-top:22px;display:flex;flex-direction:column;gap:14px}
.scr .r div{background:#222428;border-radius:16px;padding:16px 16px 16px 58px;font-size:19px;font-weight:600;position:relative;line-height:1.3}
.scr .r div:before{content:"";position:absolute;left:16px;top:50%;margin-top:-14px;width:28px;height:28px;border-radius:50%;border:3px solid #FF4419;box-sizing:border-box}
.scr .r div.ok:before{background:#FF4419}
.scr .bt{position:absolute;left:28px;right:28px;bottom:30px;background:#FF4419;border-radius:18px;text-align:center;font-family:Anton;font-size:30px;padding:14px 0}`;
const mock = (a, x, y, s) => `<div class="mock" style="left:${x}px;top:${y}px;transform:scale(${s})">
<div class="book">${flag('#16181B', '#ECE8E0', 14)}<div class="k">GUIDA PDF + APP</div><div class="t">PRIMO<br><b>TRAGUARDO</b></div><div class="s">Il piano per il tuo primo HYROX®</div><div class="bar"></div></div>
<div class="phone"><div class="scr"><div class="ap">LINEA <b>D'ARRIVO</b></div><div class="k">${a.schermo.etichetta}</div><div class="t">${a.schermo.titolo}</div>
<div class="r">${a.schermo.righe.map((r, i) => `<div class="${i < a.schermo.fatte ? 'ok' : ''}">${r}</div>`).join('')}</div><div class="bt">${a.schermo.bottone || 'INIZIA'}</div></div></div></div>`;
const chip = (a, x, y, fp, fd, extra = '') => `<div class="chip" style="left:${x}px;top:${y}px;${extra}"><div class="p" style="font-size:${fp}px">Guida + app · ${a.prezzo}</div><div class="d" style="font-size:${fd}px">Download immediato</div></div>`;
function html(a, f) {
  const logo = (x, y, fs) => `<div class="logo" style="left:${x}px;top:${y}px;font-size:${fs}px">${flag('#fff', '#16181B', Math.round(fs / 4))}LINEA <b>D'ARRIVO</b></div>`;
  if (f === '1080x1080') return `<div class="ad" style="width:1080px;height:1080px">${logo(70, 60, 38)}
<h1 style="left:70px;top:140px;width:960px;font-size:${a.fs_quadrato || 118}px">${a.titolo_grafica}</h1>
<div class="ben" style="left:70px;top:${a.y_ben_quadrato || 560}px;width:440px;font-size:36px">${a.beneficio}</div>
${chip(a, 70, 850, 44, 22)}${mock(a, 560, 450, 0.66)}<div class="disc" style="left:70px;bottom:28px;font-size:19px">${DISC}</div></div>`;
  if (f === '1080x1920') return `<div class="ad" style="width:1080px;height:1920px">${logo(80, 285, 40)}
<h1 style="left:80px;top:370px;width:920px;font-size:${a.fs_verticale || 132}px">${a.titolo_grafica}</h1>
<div class="ben" style="left:80px;top:${a.y_ben_verticale || 790}px;width:920px;font-size:44px">${a.beneficio}</div>
${chip(a, 80, 1060, 46, 24)}${mock(a, 520, 945, 0.6)}<div class="disc" style="left:80px;top:1250px;font-size:22px;width:420px">${DISC}</div></div>`;
  return `<div class="ad" style="width:1920px;height:1080px">${logo(90, 80, 42)}
<h1 style="left:90px;top:190px;width:1020px;font-size:${a.fs_orizzontale || 140}px">${a.titolo_grafica}</h1>
<div class="ben" style="left:90px;top:${a.y_ben_orizzontale || 640}px;width:900px;font-size:42px">${a.beneficio}</div>
${chip(a, 90, 870, 50, 24)}${mock(a, 1150, 130, 0.98)}<div class="disc" style="left:90px;bottom:30px;font-size:20px">${DISC}</div></div>`;
}
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  for (const a of spec.inserzioni) for (const [f, [w, h]] of Object.entries(FORMATI)) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(`<style>${FONTS}${CSS}</style>${html(a, f)}`); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(outDir, `${a.id}-${f}.png`) }); await p.close();
  }
  await b.close(); console.log('inserzioni pronte in', outDir);
})();
