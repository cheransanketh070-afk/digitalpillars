(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches, finePointer=matchMedia('(pointer: fine)').matches;
  const scenes=$$('.scene-ui'), dots=$$('.scene-nav button'), topScene=$('#topScene');
  let index=0,busy=false,touchY=null,reviewIndex=0,wheelLock=0;
  function setScene(next,force=false){
    if(!scenes.length)return; next=(next+scenes.length)%scenes.length;
    if((!force&&next===index)||busy)return; busy=true;
    const previous=scenes[index],target=scenes[next];
    previous?.classList.remove('is-active'); previous?.classList.add('is-exit'); target?.classList.add('is-active');
    index=next; dots.forEach((d,i)=>d.classList.toggle('is-active',i===index));
    if(topScene)topScene.textContent=String(index+1).padStart(2,'0'); window.DPWorld?.setScene?.(index);
    setTimeout(()=>{previous?.classList.remove('is-exit');busy=false},reduceMotion?30:760);
  }
  const step=d=>{if(document.querySelector('.brief-modal.is-open,.ai-modal.is-open'))return;setScene(index+d)};
  $$('[data-goto]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();const n=Number(el.dataset.goto);if(Number.isFinite(n))setScene(n,true)}));
  addEventListener('wheel',e=>{if(document.querySelector('.brief-modal.is-open,.ai-modal.is-open')||Math.abs(e.deltaY)<18)return;const now=performance.now();if(now<wheelLock)return;wheelLock=now+(reduceMotion?120:620);step(e.deltaY>0?1:-1)},{passive:true});
  addEventListener('keydown',e=>{
    const modal=document.querySelector('.brief-modal.is-open,.ai-modal.is-open');
    if(modal){if(e.key==='Escape')$$('.brief-modal,.ai-modal').forEach(m=>m.classList.remove('is-open'));return}
    if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();step(1)}else if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();step(-1)}else if(e.key==='Home'){e.preventDefault();setScene(0,true)}else if(e.key==='End'){e.preventDefault();setScene(scenes.length-1,true)}
  });
  addEventListener('pointerdown',e=>{if(e.pointerType==='touch')touchY=e.clientY},{passive:true});
  addEventListener('pointerup',e=>{if(touchY==null)return;const d=e.clientY-touchY;if(Math.abs(d)>45)step(d<0?1:-1);touchY=null},{passive:true});
  $$('[data-link]').forEach(el=>el.addEventListener('click',()=>{if(el.dataset.link)location.assign(el.dataset.link)}));
  if(finePointer&&!reduceMotion){
    $$('.scene-ui [data-tilt],.scene-ui .service-card,.scene-ui .dash-panel,.scene-ui .orbit-card,.scene-ui .glass-card').forEach(el=>{
      el.addEventListener('pointermove',e=>{const s=el.closest('.scene-ui');if(s&&!s.classList.contains('is-active'))return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5,m=el.hasAttribute('data-tilt')?4.5:6;el.style.setProperty('--tilt-x',`${(-y*m).toFixed(2)}deg`);el.style.setProperty('--tilt-y',`${(x*m).toFixed(2)}deg`);el.style.setProperty('--tilt-z','7px');el.classList.add('is-pointer-active')});
      el.addEventListener('pointerleave',()=>{el.style.removeProperty('--tilt-x');el.style.removeProperty('--tilt-y');el.style.removeProperty('--tilt-z');el.classList.remove('is-pointer-active')});
    });
    $$('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/r.width*10,y=(e.clientY-r.top-r.height/2)/r.height*10;el.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`});el.addEventListener('pointerleave',()=>{el.style.transform=''})});
  }
  const reviews=$$('.review-card'),count=$('#reviewCount');
  function showReview(n){if(!reviews.length)return;reviewIndex=(n+reviews.length)%reviews.length;reviews.forEach((r,i)=>r.classList.toggle('is-active',i===reviewIndex));if(count)count.textContent=`${String(reviewIndex+1).padStart(2,'0')} / ${String(reviews.length).padStart(2,'0')}`}
  $('[data-review="prev"]')?.addEventListener('click',()=>showReview(reviewIndex-1)); $('[data-review="next"]')?.addEventListener('click',()=>showReview(reviewIndex+1));
  const answers={services:'Performance / paid social, social presence, digital experiences, brand strategy, creator partnerships and growth consulting — connected as one operating system.',start:'Choose a service card, open its dedicated layer, then use the project brief. We scope the pressure point first and build in focused sprints.',time:'First replies are typically within one working day. Delivery time depends on the layer and scope; builds are structured into clear stages.',team:'Yes. Digital Pillars can plug into an existing marketing, design or development team as a specialist layer, lead, or delivery partner.'};
  $$('[data-answer]').forEach(q=>q.addEventListener('click',()=>{const box=q.closest('.ai-window,.ai-panel')?.querySelector('.answer-box');if(box)box.textContent=answers[q.dataset.answer]||'Select another question.'}));
  const brief=$('#briefModal'),ai=$('#aiModal'); $$('[data-brief]').forEach(b=>b.addEventListener('click',()=>brief?.classList.add('is-open'))); $$('[data-close]').forEach(b=>b.addEventListener('click',()=>brief?.classList.remove('is-open'))); $('[data-open-ai]')?.addEventListener('click',()=>ai?.classList.add('is-open')); $$('[data-close-ai]').forEach(b=>b.addEventListener('click',()=>ai?.classList.remove('is-open')));
  $('#briefForm')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget),subject=encodeURIComponent(`Digital Pillars enquiry — ${f.get('company')||f.get('name')}`),body=encodeURIComponent(`Name: ${f.get('name')}\nEmail: ${f.get('email')}\nCompany: ${f.get('company')}\n\nProject:\n${f.get('message')}`);location.href=`mailto:hello@digitalpillars.studio?subject=${subject}&body=${body}`});
  const loader=$('#loader'),loadPct=$('#loadPct'); if(loader&&loadPct){const start=performance.now(),finish=()=>{loadPct.textContent='100';loader.classList.add('loader-done')},wait=()=>setTimeout(finish,Math.max(120,420-(performance.now()-start)));if(document.readyState==='complete')wait();else addEventListener('load',wait,{once:true})}
  window.DigitalPillars=Object.freeze({go:setScene,next:()=>step(1),previous:()=>step(-1)}); setScene(0,true);
})();