import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'artifacts','browser');
await fs.mkdir(out,{recursive:true});
const server=spawn('python',['-m','http.server','4173','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let browser;
try {
  let ready=false;
  for(let i=0;i<30;i++){try{const r=await fetch('http://127.0.0.1:4173');if(r.ok){ready=true;break}}catch{}await sleep(300)}
  if(!ready)throw new Error('Local static server did not start');
  browser=await chromium.launch({headless:true});
  const failures=[];
  for(const width of [360,390,430,768,1280]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    page.on('pageerror',e=>failures.push(width+' pageerror: '+e.message));
    page.on('console',m=>{if(m.type()==='error')failures.push(width+' console: '+m.text())});
    page.on('requestfailed',r=>failures.push(width+' requestfailed: '+r.url()+' '+r.failure()?.errorText));
    await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle',timeout:30000});
    await page.screenshot({path:path.join(out,'home-'+width+'.png'),fullPage:true});
    const dimensions=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
    if(dimensions.scroll>dimensions.inner)failures.push(width+' horizontal overflow: '+JSON.stringify(dimensions));
    const logo=page.locator('.brand img');
    if(await logo.count()){
      const box=await logo.boundingBox();
      if(!box||box.width<60)failures.push(width+' header logo missing or too small');
    }
    if(width<=760){
      await page.locator('#menuToggle').click();
      if(!(await page.locator('#navLinks').evaluate(el=>el.classList.contains('open'))))failures.push(width+' mobile menu did not open');
      await page.screenshot({path:path.join(out,'menu-'+width+'.png'),fullPage:false});
      await page.locator('#menuToggle').click();
    }
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,'contact-'+width+'.png'),fullPage:false});
    const serviceLabel=page.locator('label[for="s1"]');
    await serviceLabel.evaluate(el=>el.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'}));
    await serviceLabel.click();
    if(!(await page.locator('#s1').isChecked()))failures.push(width+' service option did not become selected');
    await page.locator('#nextStep').click();
    if(!(await page.locator('.wizard-step[data-step="2"]').evaluate(el=>el.classList.contains('active'))))failures.push(width+' wizard did not advance');
    await page.locator('#prevStep').click();
    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,'footer-'+width+'.png'),fullPage:false});
    await page.close();
  }
  await browser.close();browser=null;
  if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else console.log('Playwright responsive smoke tests passed at 360, 390, 430, 768 and 1280 CSS px.');
} finally {
  if(browser)await browser.close();
  server.kill('SIGTERM');
}
