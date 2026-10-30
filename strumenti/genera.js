// Genera le grafiche di Linea d'Arrivo da un file di contenuti (JSON).
// Uso: node genera.js contenuti.json cartella_uscita
// Per ogni contenuto crea: carosello -> <id>-1.png ... ; post -> <id>.png ; reel -> <id>/s1a.png, s1b.png ... + <id>/intro/f000.png ...
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
const esc = (s) => String(s ?? '');
const flag = (a, b, px) => `<span class="flag" style="grid-template-columns:repeat(4,${px}px);width:${px*4}px;height:${px*4}px">${Array.from({length:16},(_,i)=>`<i style="width:${px}px;height:${px}px;background:${((i%4)+Math.floor(i/4))%2?b:a}"></i>`).join('')}</span>`;
const DISC = 'Guida indipendente, non affiliata a HYROX.';

// ---------- stile scuro 4:5 (carosello, post scuri) ----------
const CSS_DARK = `*{margin:0;box-sizing:border-box} body{width:1080px;height:1350px;font-family:Inter;overflow:hidden}
.flag{display:inline-grid;vertical-align:middle;margin-right:14px}.flag i{display:block}
.dark{background:#16181B;color:#fff;width:1080px;height:1350px;position:relative;padding:90px 84px;background-image:radial-gradient(circle at 78% 62%,rgba(255,68,25,.22),rgba(255,68,25,0) 46%)}
.top{display:flex;align-items:center;justify-content:space-between;border-top:3px solid #3a3d42;padding-top:26px}
.top:before{content:"";position:absolute;left:84px;top:90px;width:150px;height:3px;background:#FF4419}
.logo{font-family:Anton;font-size:34px}.logo b{color:#FF4419;font-weight:400}
.count{color:#8a8d92;font-size:26px;font-weight:600}
.label{margin-top:110px;color:#FF4419;font-weight:700;font-size:28px;letter-spacing:5px;text-transform:uppercase}
h1{font-family:Anton;font-weight:400;text-transform:uppercase;line-height:1.02;font-size:132px;margin-top:22px}
h1 em{font-style:normal;color:#FF4419}
.body{margin-top:44px;font-size:40px;line-height:1.4;color:#d9dadc;max-width:860px}
.big{font-family:Anton;color:#FF4419;font-size:300px;line-height:1;margin-top:30px}
.foot{position:absolute;left:84px;right:84px;bottom:84px}.foot .line{height:4px;background:#FF4419;margin-bottom:24px}
.foot .row{display:flex;justify-content:space-between;align-items:center;font-size:28px}.foot .claim{color:#FF4419;font-weight:700}.foot .handle{color:#9a9da2;font-weight:600}
.disc{position:absolute;left:84px;bottom:40px;font-size:20px;color:#6f7277}
.card{margin-top:50px;background:#222428;border:2px solid #34373c;border-radius:22px;padding:40px 44px;max-width:820px}
.card .k{color:#FF4419;font-weight:700;font-size:24px;letter-spacing:4px}.card .t{font-family:Anton;font-size:64px;margin-top:10px;text-transform:uppercase}
.card .l{font-size:30px;color:#cfd0d2;margin-top:10px;line-height:1.5}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:46px;max-width:880px}
.grid div{background:#222428;border-radius:14px;padding:20px 24px;font-size:28px;font-weight:600}.grid div span{color:#FF4419;font-family:Anton;margin-right:14px}
.list{margin-top:44px;display:flex;flex-direction:column;gap:20px}.list div{font-size:40px;font-weight:700;display:flex;align-items:center;gap:22px}
.list div:before{content:"";width:18px;height:18px;background:#FF4419;border-radius:50%;flex:0 0 auto}`;
function blocchi(s, cls) { // blocchi opzionali comuni
  let h = '';
  if (s.grande) h += `<div class="big">${esc(s.grande)}</div>`;
  if (s.testo) h += `<div class="body">${esc(s.testo)}</div>`;
  if (s.card) h += `<div class="card"><div class="k">${esc(s.card.etichetta)}</div><div class="t">${esc(s.card.titolo)}</div><div class="l">${esc(s.card.righe)}</div></div>`;
  if (s.lista) h += `<div class="list">${s.lista.map(x=>`<div>${esc(x)}</div>`).join('')}</div>`;
  if (s.griglia) h += `<div class="grid">${s.griglia.map((x,i)=>`<div><span>${i+1}</span>${esc(x)}</div>`).join('')}</div>`;
  return h;
}
const darkSlide = (s, n, tot) => `<div class="dark"><div class="top"><span class="logo">${flag('#fff','#16181B',9)}LINEA <b>D'ARRIVO</b></span><span class="count">${tot>1?`${n}/${tot}`:''}</span></div>
<div class="label">${esc(s.etichetta)}</div><h1>${esc(s.titolo)}</h1>${blocchi(s)}
<div class="foot"><div class="line"></div><div class="row"><span class="claim">${esc(s.chiusura || 'Arriva al traguardo.')}</span><span class="handle">@lineadarrivo</span></div></div><div class="disc">${DISC}</div></div>`;

// ---------- stile chiaro 4:5 (post tipo inserzione) ----------
const CSS_LIGHT = `*{margin:0;box-sizing:border-box} body{width:1080px;height:1350px;font-family:Inter;overflow:hidden}
.flag{display:inline-grid;vertical-align:middle;margin-right:14px}.flag i{display:block}
.light{background:#ECE8E0;color:#16181B;width:1080px;height:1350px;position:relative;padding:90px 84px}
.logo{font-family:Anton;font-size:34px}.logo b{color:#FF4419;font-weight:400}
h1{font-family:Anton;font-weight:400;text-transform:uppercase;line-height:1.02;font-size:150px;margin-top:40px}h1 em{font-style:normal;color:#FF4419}
.body{margin-top:44px;font-size:40px;line-height:1.4;color:#2b2d31;max-width:600px}
.bar{position:absolute;left:84px;right:84px;bottom:150px;background:#FF4419;color:#fff;font-family:Anton;font-size:72px;text-align:center;padding:26px 0}
.disc{position:absolute;left:84px;bottom:40px;font-size:20px;color:#55585d}
.stamp{position:absolute;right:84px;top:380px;width:300px;height:300px;border-radius:50%;background:#FF4419;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-8deg)}
.stamp b{font-family:Anton;font-weight:400;font-size:120px;line-height:1}.stamp span{font-weight:700;font-size:24px;letter-spacing:3px}`;
const lightPost = (c) => `<div class="light"><div class="logo">${flag('#16181B','#ECE8E0',9)}LINEA <b>D'ARRIVO</b></div><h1>${esc(c.titolo_grafica)}</h1>
${c.testo?`<div class="body">${esc(c.testo)}</div>`:''}${c.bollo?`<div class="stamp"><span>${esc(c.bollo.sopra)}</span><b>${esc(c.bollo.grande)}</b><span>${esc(c.bollo.sotto)}</span></div>`:''}
${c.barra?`<div class="bar">${esc(c.barra)}</div>`:''}<div class="disc">${DISC}</div></div>`;

// ---------- reel 9:16 ----------
// REGOLE (correzioni di Umberto): intro con scacchiera e logo che si sgretola; linea arancione in alto che si riempie (la disegna reel.py, qui la linea è solo grigia);
// fascia a scacchi grigia a top 1580px, SEMPRE sotto i testi; testi che compaiono in due tempi (a = titolo, b = dettaglio).
const CSS_REEL = `*{margin:0;box-sizing:border-box} body{width:1080px;height:1920px;overflow:hidden;font-family:Inter}
.s{width:1080px;height:1920px;background:#16181B;color:#fff;position:relative;padding:150px 90px;background-image:radial-gradient(circle at 75% 70%,rgba(255,68,25,.24),rgba(255,68,25,0) 45%)}
.flag{display:inline-grid;vertical-align:middle;margin-right:16px}.flag i{display:block}
.top{border-top:3px solid #3a3d42;padding-top:28px;position:relative}
.logo{font-family:Anton;font-size:40px}.logo b{color:#FF4419;font-weight:400}
.label{margin-top:200px;color:#FF4419;font-weight:700;font-size:34px;letter-spacing:6px;text-transform:uppercase}
h1{font-family:Anton;font-weight:400;font-size:150px;line-height:1.02;margin-top:26px;text-transform:uppercase}h1 em{font-style:normal;color:#FF4419}
.sub{margin-top:60px;font-size:50px;line-height:1.4;color:#dcdddf}
.card{margin-top:70px;background:#222428;border:2px solid #34373c;border-radius:26px;padding:50px 54px}
.card .k{color:#FF4419;font-weight:700;font-size:30px;letter-spacing:5px}.card .t{font-family:Anton;font-size:86px;margin-top:14px;text-transform:uppercase;line-height:1.05}
.card .l{font-size:38px;color:#cfd0d2;margin-top:18px;line-height:1.6;white-space:pre-line}
.list{margin-top:60px;display:flex;flex-direction:column;gap:26px}.list div{font-size:56px;font-weight:700;display:flex;align-items:center;gap:28px}
.list div:before{content:"";width:22px;height:22px;background:#FF4419;border-radius:50%;flex:0 0 auto}
.field{margin-top:80px;background:#ECE8E0;color:#16181B;border-radius:60px;padding:34px 46px;font-size:46px;font-weight:700;display:flex;justify-content:space-between;align-items:center}
.field span{width:70px;height:70px;border-radius:50%;background:#FF4419}
.cta{margin-top:40px;font-size:42px;font-weight:700}.price{margin-top:24px;font-size:38px;color:#FF4419;font-weight:700}
.big{font-family:Anton;color:#FF4419;font-size:360px;line-height:1;margin-top:20px}
.disc{position:absolute;left:90px;bottom:120px;font-size:26px;color:#6f7277}
.band{position:absolute;left:0;right:0;top:1580px;height:80px;background:conic-gradient(#25282c 25%,transparent 0 50%,#25282c 0 75%,transparent 0) 0 0/80px 80px}
.hide{visibility:hidden}`;
function rivela(r) {
  if (!r) return '';
  let h = '';
  if (r.testo) h += `<div class="sub">${esc(r.testo)}</div>`;
  if (r.card) h += `<div class="card"><div class="k">${esc(r.card.etichetta)}</div><div class="t">${esc(r.card.titolo)}</div><div class="l">${esc(r.card.righe)}</div></div>`;
  if (r.lista) h += `<div class="list">${r.lista.map(x=>`<div>${esc(x)}</div>`).join('')}</div>`;
  if (r.campo) h += `<div class="field">${esc(r.campo)}<span></span></div>`;
  if (r.invito) h += `<div class="cta">${esc(r.invito)}</div>`;
  if (r.prezzo) h += `<div class="price">${esc(r.prezzo)}</div>`;
  return h;
}
const reelScene = (sc, state) => `<div class="s">${''}<div class="top"><span class="logo">${flag('#fff','#16181B',10)}LINEA <b>D'ARRIVO</b></span></div>
<div class="label">${esc(sc.etichetta)}</div>${sc.grande?`<div class="big">${esc(sc.grande)}</div>`:''}<h1>${esc(sc.titolo)}</h1>
<div class="${state==='a'?'hide':''}">${rivela(sc.rivela)}</div><div class="band"></div><div class="disc">${DISC}</div></div>`;
const CSS_INTRO = `*{margin:0;box-sizing:border-box} body{width:1080px;height:1920px;overflow:hidden;background:#16181B;position:relative}
#g{position:absolute;inset:0;display:grid;grid-template-columns:repeat(18,60px);grid-auto-rows:60px}#g i{display:block}
.card{position:absolute;left:290px;top:760px;width:500px;height:360px;background:#16181B;border:4px solid #FF4419;border-radius:28px;display:flex;flex-direction:column;justify-content:center;padding:0 90px}
.fl{display:grid;grid-template-columns:repeat(4,25px);width:100px;margin:0 0 26px 100px}.fl i{width:25px;height:25px}
.t{font-family:Anton;font-size:96px;line-height:1.02;color:#fff}.t b{color:#FF4419;font-weight:400}`;

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const shot = async (w, h, css, html, file) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(`<style>${FONTS}${css}</style>${html}`); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: file }); await p.close();
  };
  for (const c of spec.contenuti) {
    if (c.tipo === 'carosello') {
      for (let i = 0; i < c.slide.length; i++) await shot(1080, 1350, CSS_DARK, darkSlide(c.slide[i], i + 1, c.slide.length), path.join(outDir, `${c.id}-${i + 1}.png`));
    } else if (c.tipo === 'post') {
      if (c.stile === 'chiaro') await shot(1080, 1350, CSS_LIGHT, lightPost(c), path.join(outDir, `${c.id}.png`));
      else await shot(1080, 1350, CSS_DARK, darkSlide(c.slide ? c.slide[0] : c, 1, 1), path.join(outDir, `${c.id}.png`));
    } else if (c.tipo === 'reel') {
      const d = path.join(outDir, c.id); fs.mkdirSync(path.join(d, 'intro'), { recursive: true });
      for (let i = 0; i < c.scene.length; i++) for (const st of ['a', 'b']) await shot(1080, 1920, CSS_REEL, reelScene(c.scene[i], st), path.join(d, `s${i + 1}${st}.png`));
      // intro: scacchiera arancione + logo che si sgretola (40 fotogrammi = 1,33 s)
      const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
      const fl = Array.from({length:16},(_,i)=>`<i style="background:${((i%4)+Math.floor(i/4))%2?'#16181B':'#fff'}"></i>`).join('');
      await p.setContent(`<style>${FONTS}${CSS_INTRO}</style><div id="g"></div><div class="card" id="c"><div class="fl">${fl}</div><div class="t">LINEA<br><b>D'ARRIVO</b></div></div>`);
      await p.evaluate(() => document.fonts.ready);
      await p.evaluate(() => { const g = document.getElementById('g'); let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
        for (let r = 0; r < 32; r++) for (let q = 0; q < 18; q++) { const i = document.createElement('i'); i.style.background = (r + q) % 2 ? '#16181B' : '#FF4419'; i.dataset.k = rnd() * 0.6 + (Math.abs(r - 16) / 16) * 0.4; g.appendChild(i); } });
      for (let n = 0; n < 40; n++) {
        const t = n / 39;
        await p.evaluate((t) => { const dd = Math.max(0, (t - 0.25) / 0.6);
          document.querySelectorAll('#g i').forEach(i => { i.style.opacity = (+i.dataset.k < dd) ? 0 : 1; });
          const lo = t < 0.55 ? 1 : Math.max(0, 1 - (t - 0.55) / 0.35); const c = document.getElementById('c'); c.style.opacity = lo; c.style.transform = `scale(${1 + (1 - lo) * 0.06})`; }, t);
        await p.screenshot({ path: path.join(d, 'intro', `f${String(n).padStart(3, '0')}.png`) });
      }
      await p.close();
    }
  }
  await b.close();
  console.log('grafiche pronte in', outDir);
})();
