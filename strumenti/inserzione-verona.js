// Uso: node inserzione-verona.js cartella_uscita
// Inserzione fusione "Verona conto alla rovescia + offerta" (27 €), 1080x1350 e 1080x1920
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const nm = (p) => path.join('/home/claude/media/strumenti/node_modules', p);
const f64 = (p) => 'data:font/woff2;base64,' + fs.readFileSync(nm(p)).toString('base64');
const FONTS = `@font-face{font-family:Anton;src:url(${f64('@fontsource/anton/files/anton-latin-400-normal.woff2')})}
@font-face{font-family:Inter;font-weight:600;src:url(${f64('@fontsource/inter/files/inter-latin-600-normal.woff2')})}
@font-face{font-family:Inter;font-weight:700;src:url(${f64('@fontsource/inter/files/inter-latin-700-normal.woff2')})}`;
const tel = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', 'risorse', 'telefoni-app.png')).toString('base64');
const out = process.argv[2];
const flag = (a, b, px) => `<span class="flag" style="grid-template-columns:repeat(4,${px}px)">${Array.from({length:16},(_,i)=>`<i style="width:${px}px;height:${px}px;background:${((i%4)+Math.floor(i/4))%2?b:a}"></i>`).join('')}</span>`;
const CSS = `*{margin:0;box-sizing:border-box}body{overflow:hidden;font-family:Inter}
.ad{position:relative;background:#FF4419;color:#16181B;overflow:hidden}
.ad:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(-55deg,rgba(0,0,0,.05) 0 2px,transparent 2px 9px);opacity:.6}
.stripes{position:absolute;display:flex;flex-direction:column;gap:14px}.stripes i{display:block;height:22px;background:#16181B;transform:skewX(-35deg)}
.flag{display:inline-grid;vertical-align:middle;margin-right:12px}.flag i{display:block}
.logo{position:absolute;font-family:Anton;font-size:34px;color:#16181B}.logo b{color:#fff;font-weight:400}
h1{position:absolute;font-family:Anton;font-weight:400;text-transform:uppercase;line-height:.98}h1 span{color:#fff}
.sub{position:absolute;font-weight:700;color:#fff;line-height:1.3}
.board{position:absolute;background:#16181B;border-radius:24px;padding:26px 24px;box-shadow:0 24px 50px rgba(0,0,0,.35)}
.board .t{font-family:Anton;color:#FF4419;text-align:center;letter-spacing:1px}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px}
.grid div{background:#222428;border:2px solid #34373c;border-radius:12px;text-align:center;padding:10px 0 8px;color:#FF4419}
.grid div small{display:block;font-weight:700;font-size:15px;letter-spacing:2px;color:#9a9da2}
.grid div b{font-family:Anton;font-weight:400;font-size:54px;line-height:1.05}
.grid div.via{background:#fff;border-color:#fff;color:#16181B;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
.grid div.via b{font-size:26px;line-height:1}
.phones{position:absolute;background:#ECE8E0;border-radius:24px;overflow:hidden;box-shadow:0 24px 50px rgba(0,0,0,.35)}
.phones img{display:block;width:100%}
.stamp{position:absolute;border-radius:50%;background:#16181B;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-8deg);box-shadow:0 14px 30px rgba(0,0,0,.35)}
.stamp b{font-family:Anton;font-weight:400;line-height:1}.stamp span{font-weight:700;letter-spacing:2px;text-align:center}
.ben{position:absolute;font-weight:700;color:#16181B;text-align:center}
.bar{position:absolute;background:#16181B;color:#fff;font-family:Anton;text-align:center;transform:skewX(-8deg)}
.bar span{display:inline-block;transform:skewX(8deg)}
.disc{position:absolute;font-weight:600;color:#16181B;text-align:center}`;
const cells = (fs) => Array.from({length:11},(_,i)=>`<div><small>SETT.</small><b>${i+1}</b></div>`).join('') + `<div class="via">${flag('#16181B','#fff',8)}<b>VERONA</b></div>`;
function ad(f) {
  if (f === '1080x1350') return `<div class="ad" style="width:1080px;height:1350px">
<div class="logo" style="left:70px;top:48px">${flag('#16181B','#FF4419',8)}LINEA <b>D'ARRIVO</b></div>
<h1 style="left:70px;top:115px;font-size:146px">HYROX Verona:<br><span>28-31 gennaio.</span></h1>
<div class="sub" style="left:70px;top:440px;width:940px;font-size:40px">Il piano di 12 settimane ti porta al via.<br>Allenamenti pronti, settimana per settimana.</div>
<div class="board" style="left:60px;top:590px;width:470px"><div class="t" style="font-size:32px">CONTO ALLA ROVESCIA</div><div class="grid">${cells()}</div></div>
<div class="phones" style="left:560px;top:590px;width:460px"><img src="${tel}"></div>
<div class="stamp" style="left:840px;top:860px;width:210px;height:210px"><span style="font-size:15px">GUIDA + APP</span><b style="font-size:84px">27 €</b><span style="font-size:13px">DOWNLOAD<br>IMMEDIATO</span></div>
<div class="ben" style="left:40px;right:40px;top:1098px;font-size:30px">12 settimane · Piano Express · Test e ritmo gara · Dal telefono</div>
<div class="bar" style="left:90px;right:90px;top:1160px;font-size:76px;padding:12px 0"><span>Inizia ora – 27 €</span></div>
<div class="disc" style="left:0;right:0;bottom:30px;font-size:21px">Guida indipendente, non affiliata a HYROX.</div></div>`;
  // 1080x1920: zone libere in alto (270 px) e in basso (430 px)
  return `<div class="ad" style="width:1080px;height:1920px">
<div class="logo" style="left:70px;top:285px">${flag('#16181B','#FF4419',8)}LINEA <b>D'ARRIVO</b></div>
<h1 style="left:70px;top:350px;font-size:140px">HYROX Verona:<br><span>28-31 gennaio.</span></h1>
<div class="sub" style="left:70px;top:665px;width:940px;font-size:40px">Il piano di 12 settimane ti porta al via.<br>Allenamenti pronti, settimana per settimana.</div>
<div class="board" style="left:60px;top:810px;width:470px"><div class="t" style="font-size:32px">CONTO ALLA ROVESCIA</div><div class="grid">${cells()}</div></div>
<div class="phones" style="left:560px;top:810px;width:460px"><img src="${tel}"></div>
<div class="stamp" style="left:840px;top:1110px;width:200px;height:200px"><span style="font-size:15px">GUIDA + APP</span><b style="font-size:80px">27 €</b><span style="font-size:13px">DOWNLOAD<br>IMMEDIATO</span></div>
<div class="bar" style="left:90px;right:90px;top:1335px;font-size:72px;padding:10px 0"><span>Inizia ora – 27 €</span></div>
<div class="disc" style="left:0;right:0;top:1480px;font-size:21px">Guida indipendente, non affiliata a HYROX.</div></div>`;
}
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const [f, w, h] of [['1080x1350',1080,1350],['1080x1920',1080,1920]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(`<style>${FONTS}${CSS}</style>${ad(f)}`); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, `2026-11-06-inserzione-verona-12-settimane-${f}.png`) }); await p.close();
  }
  await b.close(); console.log('ok');
})();
