import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const OUT=process.env.OUT ?? '../audit/screenshots/p1'; mkdirSync(OUT,{recursive:true});
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
await ctx.addInitScript(()=>{try{localStorage.setItem('adan.consent.v1','rejected')}catch{}});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:8433/',{waitUntil:'networkidle'});
// Reveal animations are IntersectionObserver-driven; scroll the whole page once
// so nothing is captured mid-transition.
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
await p.waitForTimeout(400);
const h=await p.evaluate(()=>document.body.scrollHeight);
console.log('page height', h);
let i=0;
for(let y=820; y<h-400; y+=880){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(350);
  await p.screenshot({path:`${OUT}/slice-${String(++i).padStart(2,'0')}.png`}); }
console.log('slices',i);
await b.close();
