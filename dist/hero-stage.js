(() => {
  'use strict';
  const stage=document.querySelector('.product-stage');
  if(!stage)return;
  const cards=Array.from(stage.querySelectorAll('[data-hero-product]'));
  const selectors=Array.from(stage.querySelectorAll('[data-hero-choice]'));
  const order=['helms','helmskb','zhihui'];
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
  const clamp=n=>Math.max(0,Math.min(1,n));
  let selected='helms',hovered=null,queued=false,rearrangeTimer;

  const wave=stage.querySelector('.hero-meeting-wave');
  for(let i=0;i<31;i++){
    const bar=document.createElement('i');
    const envelope=.2+.8*Math.sin((i+1)/32*Math.PI);
    bar.style.setProperty('--wave-height',`${5+Math.abs(Math.sin(i*1.31)*Math.cos(i*.37))*25*envelope}px`);
    wave.append(bar);
  }

  function pulseWave(){
    if(motion.matches)return;
    Array.from(wave.children).forEach((bar,i)=>bar.animate([{transform:'scaleY(.65)'},{transform:'scaleY(1.13)',offset:.45},{transform:'scaleY(1)'}],{duration:520+i*7,easing:'cubic-bezier(.22,1,.36,1)'}));
  }

  function render(){
    queued=false;
    const width=stage.clientWidth;
    const styles=getComputedStyle(stage);
    const cardWidth=parseFloat(styles.getPropertyValue('--card-width'))||258;
    const rect=stage.getBoundingClientRect();
    const viewHeight=window.innerHeight;
    const progress=motion.matches?1:clamp((viewHeight*.88-rect.top)/(viewHeight*.54));
    const fullSpread=Math.min(width*.29,242,Math.max(0,width/2-cardWidth/2-13));
    const spread=fullSpread*(.68+.32*progress);
    const active=hovered||selected;
    cards.forEach(card=>{
      const product=card.dataset.heroProduct;
      const relative=(order.indexOf(product)-order.indexOf(selected)+3)%3;
      const slot=relative===0?0:relative===1?-1:1;
      const focused=product===active;
      card.dataset.active=String(focused);
      card.style.setProperty('--slot-x',`${slot*spread}px`);
      card.style.setProperty('--slot-y',`${focused?-4:slot===0?5:14+(1-progress)*6}px`);
      card.style.setProperty('--face-y',`${focused?0:slot*-8}deg`);
      card.style.setProperty('--face-z',`${focused?0:slot*(5+(1-progress)*3)}deg`);
      card.style.setProperty('--face-scale',focused?'1':'.92');
      card.style.setProperty('--layer',focused?'5':slot===0?'3':'2');
    });
    selectors.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.heroChoice===active)));
  }

  function requestRender(){if(!queued){queued=true;requestAnimationFrame(render);}}
  function choose(product){
    if(!order.includes(product))return;
    const changed=selected!==product;
    hovered=null;selected=product;
    cards.forEach(card=>{card.style.setProperty('--mouse-x','0deg');card.style.setProperty('--mouse-y','0deg');});
    clearTimeout(rearrangeTimer);
    if(!motion.matches&&changed){stage.classList.add('is-rearranging');rearrangeTimer=setTimeout(()=>stage.classList.remove('is-rearranging'),780);}
    render();
    if(product==='zhihui'&&changed)pulseWave();
  }

  selectors.forEach((button,index)=>{
    button.addEventListener('click',()=>choose(button.dataset.heroChoice));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?selectors.length-1:(index+(event.key==='ArrowRight'?1:-1)+selectors.length)%selectors.length;
      choose(selectors[next].dataset.heroChoice);selectors[next].focus();
    });
  });
  cards.forEach(card=>{
    card.addEventListener('pointerenter',()=>{
      if(!finePointer.matches)return;
      hovered=card.dataset.heroProduct;render();
      if(hovered==='zhihui')pulseWave();
    });
    card.addEventListener('pointerleave',()=>{
      if(hovered===card.dataset.heroProduct)hovered=null;
      card.style.setProperty('--mouse-x','0deg');card.style.setProperty('--mouse-y','0deg');render();
    });
    card.addEventListener('pointermove',event=>{
      if(!finePointer.matches||motion.matches)return;
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--mouse-x',`${((event.clientX-rect.left)/rect.width-.5)*3.4}deg`);
      card.style.setProperty('--mouse-y',`${(.5-(event.clientY-rect.top)/rect.height)*3}deg`);
    });
    card.addEventListener('focusin',event=>{if(event.target.matches(':focus-visible'))choose(card.dataset.heroProduct);});
  });
  stage.addEventListener('pointerleave',()=>{hovered=null;render();});
  window.addEventListener('scroll',requestRender,{passive:true});
  window.addEventListener('resize',requestRender);
  new ResizeObserver(requestRender).observe(stage);
  motion.addEventListener('change',()=>{clearTimeout(rearrangeTimer);stage.classList.remove('is-rearranging');requestRender();});
  render();
})();
