import { chromium } from 'playwright';
const b = await chromium.launch({ headless:false, channel:'chrome' });
const p = await b.newPage({ viewport:{width:1440,height:900} });
try{
  const r=await p.goto('https://adancorporate.com/en-uk/home/index.html',{waitUntil:'domcontentloaded',timeout:40000});
  console.log('status', r&&r.status(), '| title:', await p.title());
}catch(e){ console.log('FAILED:', e.message.split('\n')[0]); }
await b.close();
