// Inserzione Verona, proposta A rivista: VERONA in vista, cosa c'è dentro, schermate vere dell'app.
// Uso: node inserzione-verona-a2.js cartella_uscita
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const nm = (p) => path.join(__dirname, 'node_modules', p);
const f64 = (p) => 'data:font/woff2;base64,' + fs.readFileSync(nm(p)).toString('base64');
const FONTS = `@font-face{font-family:Anton;src:url(${f64('@fontsource/anton/files/anton-latin-400-normal.woff2')})}
@font-face{font-family:Inter;font-weight:600;src:url(${f64('@fontsource/inter/files/inter-latin-600-normal.woff2')})}
@font-face{font-family:Inter;font-weight:700;src:url(${f64('@fontsource/inter/files/inter-latin-700-normal.woff2')})}`;
const img = (n) => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', 'risorse', n)).toString('base64');
// schermate nuove dell'app: node schermate-app.js ../risorse
const phone = (n, x, y, w, rot, z) => `<div class="ph" style="left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w*844/390)+Math.round(w*0.06)}px;transform:rotate(${rot}deg);z-index:${z}"><img src="${img(n)}"></div>`;
const out = process.argv[2];
const flag = (a, b, px) => `<span class="flag" style="grid-template-columns:repeat(4,${px}px)">${Array.from({length:16},(_,i)=>`<i style="width:${px}px;height:${px}px;background:${((i%4)+Math.floor(i/4))%2?b:a}"></i>`).join('')}</span>`;
const CSS = `*{margin:0;box-sizing:border-box}body{overflow:hidden;font-family:Inter}
.ad{position:relative;overflow:hidden;background:#16181B}
.flag{display:inline-grid;vertical-align:middle;margin-right:12px}.flag i{display:block}
.abs{position:absolute}.anton{font-family:Anton;font-weight:400;text-transform:uppercase;line-height:.9}
.floor{position:absolute;left:-50%;right:-50%;height:900px;transform-origin:50% 0;transform:perspective(700px) rotateX(64deg);background:conic-gradient(#26292e 25%,#16181B 0 50%,#26292e 0 75%,#16181B 0) 0 0/130px 130px;-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 35%);mask-image:linear-gradient(to bottom,transparent 0%,#000 35%)}
.date{background:#FF4419;color:#fff;font-family:Anton;padding:8px 22px;transform:rotate(-2deg);box-shadow:0 10px 30px rgba(255,68,25,.35)}
.list{display:flex;flex-direction:column;gap:16px}
.list div{display:flex;align-items:center;gap:16px;color:#fff;font-weight:700;font-size:30px;line-height:1.15}
.list div:before{content:"✓";flex:0 0 40px;height:40px;border-radius:50%;background:#FF4419;color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center}
.ph{position:absolute;background:#0b0c0e;border:2px solid #4a4d52;border-radius:34px;padding:7px;box-shadow:0 40px 70px rgba(0,0,0,.7),0 0 70px rgba(255,68,25,.35)}.ph img{display:block;width:100%;border-radius:27px}
.stamp{position:absolute;z-index:10;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-10deg);background:#fff;color:#16181B;box-shadow:0 14px 34px rgba(0,0,0,.5)}
.stamp b{font-family:Anton;font-weight:400;line-height:1}.stamp span{font-weight:700;letter-spacing:2px;text-align:center}
.cta{position:absolute;z-index:10;font-family:Anton;text-align:center;background:#FF4419;color:#fff;border-radius:16px}
.disc{position:absolute;z-index:10;left:0;right:0;text-align:center;font-weight:600;font-size:21px;color:#8a8d92}`;
const A = (h) => { const o = h === 1920 ? 250 : 0; return `<div class="ad" style="width:1080px;height:${h}px">
<div class="abs" style="inset:0;background:radial-gradient(circle at 74% ${h===1920?44:50}%,rgba(255,68,25,.42),rgba(255,68,25,0) 52%)"></div>
<div class="floor" style="top:${o+930}px"></div>
<div class="abs" style="left:60px;top:${o+46}px;font-family:Anton;font-size:32px;color:#fff">${flag('#fff','#16181B',8)}LINEA <span style="color:#FF4419">D'ARRIVO</span></div>
<div class="abs anton" style="left:58px;top:${o+100}px;font-size:150px;color:#fff">HYROX <span style="color:#FF4419">VERONA</span></div>
<div class="abs date" style="left:62px;top:${o+252}px;font-size:56px">28-31 GENNAIO 2027</div>
<div class="abs anton" style="left:44px;top:${o+372}px;font-size:330px;color:#FF4419;text-shadow:0 0 80px rgba(255,68,25,.45)">12</div>
<div class="abs anton" style="left:318px;top:${o+410}px;font-size:92px;color:#fff;line-height:.95">Settimane<br>di piano.</div>
<div class="abs" style="left:322px;top:${o+600}px;width:480px;color:#d9dadc;font-weight:600;font-size:28px;line-height:1.35">Il piano giorno per giorno, nell'app.</div>
<div class="abs list" style="left:60px;top:${o+725}px;width:520px">
<div>Piano 12 settimane + Express 6</div><div>Le 8 stazioni con le alternative</div><div>Test iniziale e ritmo gara</div><div>Checklist del giorno gara</div><div>Tutto nell'app, dal telefono</div></div>
${phone("app-ritmo.png", 600, o + 650, 215, -7, 2)}${phone("app-piano.png", 790, o + 620, 245, 5, 3)}
<div class="stamp" style="left:810px;top:${o+390}px;width:220px;height:220px"><span style="font-size:15px">GUIDA + APP</span><b style="font-size:92px">27 €</b><span style="font-size:13px;color:#FF4419">UNA VOLTA<br>SOLA</span></div>
<div class="cta" style="left:60px;right:60px;top:${o+1140}px;font-size:74px;padding:6px 0">Inizia ora – 27 €</div>
<div class="disc" style="top:${o+1268}px;color:#fff;font-weight:700;font-size:27px">Pagamento unico, nessun abbonamento · Download immediato</div>
<div class="disc" style="top:${o+1312}px;font-size:19px">Guida indipendente, non affiliata a HYROX.</div></div>`; };
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const h of [1350, 1920]) {
    const p = await b.newPage({ viewport: { width: 1080, height: h } });
    await p.setContent(`<style>${FONTS}${CSS}</style>${A(h)}`); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, `2026-11-06-inserzione-verona-a2-1080x${h}.png`) }); await p.close();
  }
  await b.close(); console.log('ok');
})();
