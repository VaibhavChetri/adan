import { chromium } from 'playwright';
const BASE='http://127.0.0.1:8433';
const OUT='/Users/rekhachetri/Desktop/RADLABS/Projects/Adan_Coorporate_Site/audit/screenshots/home';
import { mkdirSync } from 'node:fs'; mkdirSync(OUT,{recursive:true});
const b=await chromium.launch();
for (const [w,h] of [[375,812],[1440,900]]) {
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  await ctx.addInitScript(()=>{try{localStorage.setItem('adan.consent.v1','rejected')}catch{}});
  const p=await ctx.newPage();
  await p.goto(BASE+'/',{waitUntil:'networkidle'});
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  });
  await p.waitForTimeout(400);
  await p.screenshot({path:`${OUT}/home-${w}.png`,fullPage:true});
  const r=await p.evaluate(()=>({
    overflow: document.documentElement.scrollWidth > window.innerWidth ? document.documentElement.scrollWidth : 0,
    h1: [...document.querySelectorAll('h1')].map(e=>e.textContent.trim()),
    tk: document.body.innerText.includes('TKTK'),
    emptyHref: [...document.querySelectorAll('a[href=""],a:not([href])')].length,
    tiny: [...document.querySelectorAll('body *')].filter(e=>e.childElementCount===0&&e.textContent.trim()&&parseFloat(getComputedStyle(e).fontSize)<14).length,
    smallTargets: [...document.querySelectorAll('a,button')].map(e=>{const r=e.getBoundingClientRect();return {t:e.textContent.trim().slice(0,28),w:Math.round(r.width),h:Math.round(r.height)}}).filter(x=>x.h>0&&(x.h<44||x.w<44)),
    sections: [...document.querySelectorAll('main > section')].map(s=>s.querySelector('h1,h2')?.textContent.trim()??'(hero)'),
  }));
  console.log('\n=== '+w+' ===', JSON.stringify(r,null,1));
  await ctx.close();
}
await b.close();
