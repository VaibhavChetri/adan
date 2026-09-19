import { chromium } from 'playwright';
const b = await chromium.launch({ headless:false, channel:'chrome' });
const p = await b.newPage({ viewport:{width:1440,height:900} });
const url='https://web.archive.org/web/2024/https://adancorporate.com/en-uk/home/index.html';
try{
  const r=await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  console.log('status',r&&r.status(),'| title:',await p.title());
  await p.waitForTimeout(6000);
  // Strip the Wayback toolbar so it can't be mistaken for site chrome.
  await p.evaluate(()=>{const w=document.getElementById('wm-ipp-base')||document.getElementById('wm-ipp'); if(w) w.remove();});
  const logos = await p.evaluate(()=>[...document.images]
    .filter(i=>/logo/i.test(i.src)||/logo/i.test(i.className)||/logo/i.test(i.alt||''))
    .map(i=>{const r=i.getBoundingClientRect();return {
      src:i.src.split('/').pop(), cssW:Math.round(r.width), cssH:Math.round(r.height),
      natW:i.naturalWidth, natH:i.naturalHeight, top:Math.round(r.top)};}));
  console.log(JSON.stringify(logos,null,1));
}catch(e){ console.log('FAILED:', e.message.split('\n')[0]); }
await b.close();
