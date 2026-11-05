// Inserzione Verona (versione "wow"): due proposte, A = scura con cronometro, B = arancione con traguardo.
// Uso: node inserzione-verona-wow.js cartella_uscita
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const nm = (p) => path.join(__dirname, 'node_modules', p);
const f64 = (p) => 'data:font/woff2;base64,' + fs.readFileSync(nm(p)).toString('base64');
const FONTS = `@font-face{font-family:Anton;src:url(${f64('@fontsource/anton/files/anton-latin-400-normal.woff2')})}
@font-face{font-family:Inter;font-weight:600;src:url(${f64('@fontsource/inter/files/inter-latin-600-normal.woff2')})}
@font-face{font-family:Inter;font-weight:700;src:url(${f64('@fontsource/inter/files/inter-latin-700-normal.woff2')})}`;
const out = process.argv[2];
const flag = (a, b, px) => `<span class="flag" style="grid-template-columns:repeat(4,${px}px)">${Array.from({length:16},(_,i)=>`<i style="width:${px}px;height:${px}px;background:${((i%4)+Math.floor(i/4))%2?b:a}"></i>`).join('')}</span>`;
const DISC = 'Guida indipendente, non affiliata a HYROX.';
const CSS = `*{margin:0;box-sizing:border-box}body{overflow:hidden;font-family:Inter}
.ad{position:relative;overflow:hidden}
.flag{display:inline-grid;vertical-align:middle;margin-right:12px}.flag i{display:block}
.logo{position:absolute;font-family:Anton;font-size:34px;z-index:5}
.abs{position:absolute}
.anton{font-family:Anton;font-weight:400;text-transform:uppercase;line-height:.9}
.floor{position:absolute;left:-50%;right:-50%;height:900px;transform-origin:50% 0;background:conic-gradient(var(--c1) 25%,var(--c2) 0 50%,var(--c1) 0 75%,var(--c2) 0) 0 0/130px 130px;-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 35%);mask-image:linear-gradient(to bottom,transparent 0%,#000 35%)}
.mock{position:absolute;width:760px;height:820px;transform-origin:0 0}
.book{position:absolute;left:0;top:110px;width:430px;height:580px;background:#ECE8E0;border-radius:10px 22px 22px 10px;box-shadow:0 40px 80px rgba(0,0,0,.6);transform:perspective(1400px) rotateY(18deg) rotateZ(-8deg);padding:48px 40px;color:#16181B;border-left:14px solid #d9d3c7}
.book .k{font-weight:700;font-size:20px;letter-spacing:4px;color:#FF4419;margin-top:26px}
.book .t{font-family:Anton;font-size:60px;line-height:.98;margin-top:12px}.book .t b{color:#FF4419;font-weight:400}
.book .s{font-weight:600;font-size:23px;margin-top:20px;line-height:1.35}
.book .bar{position:absolute;left:40px;right:40px;bottom:46px;height:10px;background:#FF4419}
.phone{position:absolute;left:340px;top:0;width:400px;height:810px;background:#0b0c0e;border-radius:60px;padding:16px;border:3px solid #4a4d52;transform:perspective(1600px) rotateY(-20deg) rotateX(4deg) rotateZ(5deg)}
.scr{width:100%;height:100%;background:#16181B;border-radius:46px;padding:60px 28px 28px;position:relative;overflow:hidden}
.scr:before{content:"";position:absolute;top:16px;left:50%;width:110px;height:28px;margin-left:-55px;background:#0b0c0e;border-radius:20px}
.scr .ap{font-family:Anton;font-size:24px;color:#fff}.scr .ap b{color:#FF4419;font-weight:400}
.scr .k{color:#FF4419;font-weight:700;font-size:17px;letter-spacing:3px;margin-top:28px}
.scr .t{font-family:Anton;font-size:46px;line-height:1.02;margin-top:8px;text-transform:uppercase;color:#fff}
.scr .bar2{height:10px;border-radius:5px;background:#2c2f34;margin-top:18px;overflow:hidden}.scr .bar2 i{display:block;height:100%;width:8%;background:#FF4419}
.scr .r{margin-top:22px;display:flex;flex-direction:column;gap:14px}
.scr .r div{background:#222428;border-radius:16px;padding:16px 16px 16px 58px;font-size:19px;font-weight:600;position:relative;line-height:1.3;color:#fff}
.scr .r div:before{content:"";position:absolute;left:16px;top:50%;margin-top:-14px;width:28px;height:28px;border-radius:50%;border:3px solid #FF4419}
.scr .r div.ok:before{background:#FF4419}
.scr .btn{position:absolute;left:28px;right:28px;bottom:30px;background:#FF4419;border-radius:18px;text-align:center;font-family:Anton;font-size:30px;padding:14px 0;color:#fff}
.stamp{position:absolute;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-10deg);z-index:6}
.stamp b{font-family:Anton;font-weight:400;line-height:1}.stamp span{font-weight:700;letter-spacing:2px;text-align:center}
.cta{position:absolute;font-family:Anton;text-align:center;z-index:6}
.disc{position:absolute;left:0;right:0;text-align:center;font-weight:600;font-size:21px;z-index:6}`;
const mock = (x, y, s, glow) => `<div class="mock" style="left:${x}px;top:${y}px;transform:scale(${s})">
<div class="book">${flag('#16181B','#ECE8E0',14)}<div class="k">GUIDA PDF + APP</div><div class="t">PRIMO<br><b>TRAGUARDO</b></div><div class="s">Il piano per il tuo primo HYROX®</div><div class="bar"></div></div>
<div class="phone" style="box-shadow:0 50px 90px rgba(0,0,0,.65)${glow ? ',0 0 120px rgba(255,68,25,.55)' : ''}"><div class="scr"><div class="ap">LINEA <b>D'ARRIVO</b></div>
<div class="k">SETTIMANA 1 DI 12</div><div class="t">Oggi: test<br>iniziale</div><div class="bar2"><i></i></div>
<div class="r"><div class="ok">Riscaldamento 10 minuti</div><div>Corsa: il tuo punto di partenza</div><div>Stazioni con le alternative</div></div><div class="btn">INIZIA</div></div></div></div>`;

// A: scura, "cronometro" con il 12 gigante e il pavimento a scacchi del traguardo
const A = (h) => { const v = h === 1920, o = v ? 250 : 0; return `<div class="ad" style="width:1080px;height:${h}px;background:#16181B">
<div class="abs" style="inset:0;background:radial-gradient(circle at 70% ${v?55:62}%,rgba(255,68,25,.45),rgba(255,68,25,0) 55%)"></div>
<div class="floor" style="--c1:#26292e;--c2:#16181B;top:${v?1150:900}px;transform:perspective(700px) rotateX(64deg)"></div>
<div class="logo" style="left:70px;top:${o+50}px;color:#fff">${flag('#fff','#16181B',8)}LINEA <b style="color:#FF4419;font-weight:400">D'ARRIVO</b></div>
<div class="abs" style="left:70px;top:${o+122}px;color:#FF4419;font-weight:700;font-size:34px;letter-spacing:6px">HYROX VERONA · 28-31 GENNAIO</div>
<div class="abs anton" style="left:52px;top:${o+170}px;font-size:520px;color:#FF4419;text-shadow:0 0 80px rgba(255,68,25,.45)">12</div>
<div class="abs anton" style="left:560px;top:${o+250}px;font-size:118px;color:#fff;line-height:.95">Settimane<br>al via.</div>
<div class="abs" style="left:565px;top:${o+500}px;width:450px;color:#d9dadc;font-weight:600;font-size:32px;line-height:1.35">Il piano giorno per giorno per il tuo primo HYROX.</div>
${mock(200, o + 640, 0.62, true)}
<div class="stamp" style="left:790px;top:${o+800}px;width:230px;height:230px;background:#fff;color:#16181B"><span style="font-size:17px">GUIDA + APP</span><b style="font-size:92px">27 €</b><span style="font-size:14px;color:#FF4419">DOWNLOAD<br>IMMEDIATO</span></div>
<div class="cta" style="left:70px;right:70px;top:${o+1150}px;background:#FF4419;color:#fff;font-size:78px;padding:10px 0;border-radius:16px">Inizia ora – 27 €</div>
<div class="disc" style="top:${o+1298}px;color:#8a8d92">${DISC}</div></div>`; };

// B: arancione, striscione del traguardo, VERONA gigante e telefono in 3D
const B = (h) => { const v = h === 1920, o = v ? 250 : 0; return `<div class="ad" style="width:1080px;height:${h}px;background:#FF4419">
<div class="abs" style="inset:0;background:radial-gradient(rgba(0,0,0,.10) 2px,transparent 2.5px) 0 0/16px 16px;-webkit-mask-image:linear-gradient(to bottom,transparent 40%,#000);mask-image:linear-gradient(to bottom,transparent 40%,#000)"></div>
<div class="abs" style="left:-40px;right:-40px;top:${o+0}px;height:96px;transform:rotate(-3deg);background:conic-gradient(#16181B 25%,#fff 0 50%,#16181B 0 75%,#fff 0) 0 0/48px 48px;box-shadow:0 12px 30px rgba(0,0,0,.25)"></div>
<div class="logo" style="left:70px;top:${o+130}px;color:#16181B">${flag('#16181B','#FF4419',8)}LINEA <b style="color:#fff;font-weight:400">D'ARRIVO</b></div>
<div class="abs" style="left:72px;top:${o+200}px;color:#16181B;font-weight:700;font-size:38px;letter-spacing:4px">IL TUO PRIMO HYROX È A</div>
<div class="abs anton" style="left:60px;top:${o+245}px;font-size:300px;color:#16181B;letter-spacing:2px">VERONA</div>
<div class="abs anton" style="left:70px;top:${o+535}px;font-size:70px;line-height:1;background:#fff;color:#16181B;padding:12px 26px;transform:rotate(-3deg);box-shadow:0 10px 24px rgba(0,0,0,.25)">28-31 GENNAIO 2027</div>
<div class="abs anton" style="left:76px;top:${o+680}px;font-size:72px;line-height:.98;color:#fff">12 settimane.<br><span style="color:#16181B">Un piano.</span></div>
<div class="abs" style="left:76px;top:${o+850}px;width:420px;color:#16181B;font-weight:700;font-size:30px;line-height:1.35">Allenamenti pronti nell'app, anche in una palestra normale.</div>
${mock(510, o + 660, 0.6, false)}
<div class="stamp" style="left:830px;top:${o+545}px;width:200px;height:200px;background:#16181B;color:#fff"><span style="font-size:16px">GUIDA + APP</span><b style="font-size:90px">27 €</b><span style="font-size:13px;color:#FF4419">DOWNLOAD<br>IMMEDIATO</span></div>
<div class="cta" style="left:70px;right:70px;top:${o+1150}px;background:#16181B;color:#fff;font-size:78px;padding:10px 0;transform:skewX(-8deg)">Inizia ora – 27 €</div>
<div class="disc" style="top:${o+1298}px;color:#16181B">${DISC}</div></div>`; };

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const [n, f] of [['a', A], ['b', B]]) for (const h of [1350, 1920]) {
    const p = await b.newPage({ viewport: { width: 1080, height: h } });
    await p.setContent(`<style>${FONTS}${CSS}</style>${f(h)}`); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, `2026-11-06-inserzione-verona-${n}-1080x${h}.png`) }); await p.close();
  }
  await b.close(); console.log('ok');
})();
