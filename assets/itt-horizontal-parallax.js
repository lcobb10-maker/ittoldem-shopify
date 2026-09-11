(()=>{
  const boot=()=>{
    const root=document.querySelector('.itt-x');
    if(!root||root.dataset.commandConsoleReady)return;
    root.dataset.commandConsoleReady='1';

    const hero=root.querySelector('.itt-x__hero');
    const commerce=root.querySelector('.itt-x__commerce');
    const process=root.querySelector('.itt-x__process');
    const atelier=root.querySelector('.itt-x__atelier');
    const worlds=root.querySelector('.itt-x__worlds');
    const ribbon=root.querySelector('.itt-x__ribbon');
    const product=root.querySelector('.itt-x__product');
    const films=[root.querySelector('.itt-x__film--eye'),root.querySelector('.itt-x__film--cut'),root.querySelector('.itt-x__film--press')];
    const atelierImage=root.querySelector('.itt-x__atelierImage');
    const heroBg=root.querySelector('.itt-x__heroimg');
    const letters=[...root.querySelectorAll('.itt-x__letter')];
    const trims=[...root.querySelectorAll('.itt-x__trim')];
    const worldCards=worlds?[...worlds.querySelectorAll('.itt-x__worldgrid a')]:[];

    const style=document.createElement('style');
    style.textContent=`
      .itt-command{position:fixed;left:clamp(18px,2vw,30px);top:50%;transform:translateY(-50%);z-index:70;width:58px;border:1px solid rgba(201,168,97,.38);background:rgba(5,5,5,.72);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);box-shadow:0 18px 50px rgba(0,0,0,.4);overflow:hidden;transition:width .35s cubic-bezier(.2,.8,.2,1),background .35s,border-color .35s}
      .itt-command:hover,.itt-command:focus-within{width:214px;background:rgba(5,5,5,.9);border-color:rgba(201,168,97,.72)}
      .itt-command__mark{height:58px;display:flex;align-items:center;gap:14px;padding:0 17px;border-bottom:1px solid rgba(255,255,255,.09);white-space:nowrap}.itt-command__eye{width:22px;height:12px;border:1px solid rgba(240,231,215,.7);border-radius:50%/70%;position:relative;flex:0 0 auto}.itt-command__eye:after{content:'';position:absolute;width:4px;height:4px;border-radius:50%;background:#c9a861;left:50%;top:50%;transform:translate(-50%,-50%)}
      .itt-command__brand{font:600 9px/1 Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#f2eadf;opacity:0;transform:translateX(-8px);transition:.25s}.itt-command:hover .itt-command__brand,.itt-command:focus-within .itt-command__brand{opacity:1;transform:none}
      .itt-command__item{position:relative;width:100%;height:56px;border:0;border-bottom:1px solid rgba(255,255,255,.07);background:transparent;color:#f4ecdf;display:flex;align-items:center;gap:16px;padding:0 18px;cursor:pointer;text-align:left;transition:.25s}.itt-command__item:last-child{border-bottom:0}.itt-command__item:hover{background:rgba(255,255,255,.06)}.itt-command__num{font:italic 400 11px/1 Georgia,serif;color:#c9a861;min-width:22px}.itt-command__label{font:600 9px/1 Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase;white-space:nowrap;opacity:0;transform:translateX(-8px);transition:.25s}.itt-command:hover .itt-command__label,.itt-command:focus-within .itt-command__label{opacity:1;transform:none}.itt-command__item.is-active{background:linear-gradient(90deg,rgba(201,168,97,.16),transparent)}.itt-command__item.is-active:before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:2px;background:#c9a861;box-shadow:0 0 12px rgba(201,168,97,.55)}.itt-command__status{height:42px;display:flex;align-items:center;gap:9px;padding:0 18px;border-top:1px solid rgba(255,255,255,.08);font:600 8px/1 Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.46);white-space:nowrap}.itt-command__status i{width:6px;height:6px;border-radius:50%;background:#c9a861;box-shadow:0 0 10px rgba(201,168,97,.8);flex:0 0 auto}
      .itt-command-transition{position:fixed;inset:0;z-index:69;pointer-events:none;background:#050505;clip-path:inset(0 100% 0 0);transition:clip-path .32s cubic-bezier(.7,0,.3,1)}.itt-command-transition.is-on{clip-path:inset(0 0 0 0)}.itt-command-transition.is-off{clip-path:inset(0 0 0 100%)}.itt-command-transition span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:italic 400 clamp(3rem,9vw,9rem)/1 Georgia,serif;color:#f2eadf;letter-spacing:-.05em}
      .itt-mobile-command{display:none}

      .itt-fx-halftone,.itt-fx-lines,.itt-fx-flash{position:absolute;inset:0;pointer-events:none;z-index:6}.itt-fx-halftone{background-image:radial-gradient(circle,rgba(245,236,220,.46) 0 1px,transparent 1.35px);background-size:7px 7px;mix-blend-mode:screen;opacity:.14;mask-image:radial-gradient(circle at var(--mx,50%) var(--my,50%),#000 0 16%,transparent 48%);-webkit-mask-image:radial-gradient(circle at var(--mx,50%) var(--my,50%),#000 0 16%,transparent 48%);transform:translate3d(0,var(--halfY,0),0) scale(var(--halfScale,1)) rotate(var(--halfRot,0deg));transform-origin:center;will-change:transform,opacity}.itt-fx-lines{background:repeating-linear-gradient(180deg,rgba(255,255,255,.04) 0 1px,transparent 1px 5px);mix-blend-mode:soft-light;opacity:.12;transform:translateY(var(--scanY,0));will-change:transform}.itt-fx-flash{inset:0 auto 0 0;width:2px;background:linear-gradient(180deg,transparent,#c9a861,transparent);box-shadow:0 0 26px rgba(201,168,97,.75);opacity:.55;transform:translateX(var(--flashX,0));will-change:transform}
      .itt-x__hero{--fxFade:1}.itt-x__hero:after{content:'';position:absolute;inset:auto 0 0;height:32%;z-index:7;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(0,0,0,.1) 30%,#050505 100%);opacity:var(--fxFade)}
      .itt-scroll-index{position:fixed;right:18px;top:50%;transform:translateY(-50%);z-index:68;display:grid;gap:7px;pointer-events:none}.itt-scroll-index i{display:block;width:2px;height:26px;background:rgba(255,255,255,.12);overflow:hidden}.itt-scroll-index i:before{content:'';display:block;width:100%;height:100%;background:#c9a861;transform-origin:bottom;transform:scaleY(var(--s,0));transition:transform .15s linear}
      .itt-x__worldgrid a{transform-origin:center center!important;transition:transform .28s cubic-bezier(.2,.8,.2,1),filter .28s,opacity .28s!important}.itt-x__worldgrid a::before{transition:transform .3s ease,opacity .3s ease}.itt-x__worldgrid a.is-magic{filter:brightness(1.08) contrast(1.04)!important}.itt-x__worldgrid a.is-magic::before{transform:translateY(-8px) scale(1.08);opacity:.25}
      .itt-x__processSticky:after{content:'MAKE / CUT / PRESS / REPEAT';position:absolute;left:50%;bottom:5vh;transform:translateX(-50%);font:600 clamp(9px,1vw,13px)/1 Arial,sans-serif;letter-spacing:.42em;color:rgba(255,255,255,.45);white-space:nowrap;mix-blend-mode:screen}

      @media(max-width:900px){.itt-command{display:none}.itt-mobile-command{position:fixed;z-index:70;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);display:grid;grid-template-columns:repeat(5,1fr);width:min(94vw,680px);height:62px;background:rgba(5,5,5,.9);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(201,168,97,.38);box-shadow:0 14px 40px rgba(0,0,0,.45)}.itt-mobile-command button{position:relative;border:0;border-right:1px solid rgba(255,255,255,.08);background:transparent;color:#f4ecdf;font:600 8px/1 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase}.itt-mobile-command button small{display:block;margin-top:5px;font:italic 400 10px/1 Georgia,serif;color:#c9a861}.itt-mobile-command button.is-active{background:rgba(201,168,97,.14);color:#fff}.itt-mobile-command button.is-active:before{content:'';position:absolute;left:10px;right:10px;top:0;height:2px;background:#c9a861}.itt-scroll-index{display:none}.itt-fx-halftone{background-size:8px 8px;opacity:.11}}
      @media(prefers-reduced-motion:reduce){.itt-command,.itt-command *, .itt-command-transition,.itt-fx-halftone,.itt-fx-lines,.itt-fx-flash{transition:none!important;animation:none!important}.itt-fx-flash,.itt-fx-lines{display:none}}
    `;
    document.head.appendChild(style);

    const addFx=(host)=>{
      if(!host||host.querySelector(':scope > .itt-fx-halftone'))return;
      const half=document.createElement('div');half.className='itt-fx-halftone';
      const lines=document.createElement('div');lines.className='itt-fx-lines';
      const flash=document.createElement('div');flash.className='itt-fx-flash';
      host.append(half,lines,flash);
    };
    addFx(hero);addFx(process);addFx(worlds);

    const targets=[
      {label:'LA MAISON',short:'HOUSE',el:hero},
      {label:'SHOP',short:'SHOP',el:commerce},
      {label:'FLAGLINE',short:'FLAG',el:worlds},
      {label:"L’ATELIER",short:'ATELIER',el:atelier},
      {label:'LE LABORATOIRE',short:'LAB',el:process}
    ].filter(x=>x.el);

    const transition=document.createElement('div');transition.className='itt-command-transition';transition.innerHTML='<span>I told ’em.</span>';document.body.appendChild(transition);
    const rail=document.createElement('nav');rail.className='itt-command';rail.setAttribute('aria-label','ITT TOLD’EM worlds');rail.innerHTML='<div class="itt-command__mark"><span class="itt-command__eye" aria-hidden="true"></span><span class="itt-command__brand">ITT TOLD’EM / DETROIT</span></div>';
    const mobile=document.createElement('nav');mobile.className='itt-mobile-command';mobile.setAttribute('aria-label','ITT TOLD’EM mobile worlds');
    const desktopButtons=[],mobileButtons=[];

    const travelTo=(target,label)=>{
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(reduced){target.scrollIntoView({behavior:'auto',block:'start'});return;}
      transition.querySelector('span').textContent=label;transition.classList.remove('is-off');requestAnimationFrame(()=>transition.classList.add('is-on'));
      setTimeout(()=>{target.scrollIntoView({behavior:'smooth',block:'start'});transition.classList.remove('is-on');transition.classList.add('is-off');setTimeout(()=>transition.classList.remove('is-off'),380)},260);
    };

    targets.forEach((t,i)=>{
      const b=document.createElement('button');b.type='button';b.className='itt-command__item';b.innerHTML=`<span class="itt-command__num">0${i+1}</span><span class="itt-command__label">${t.label}</span>`;b.addEventListener('click',()=>travelTo(t.el,t.label));rail.appendChild(b);desktopButtons.push(b);
      const mb=document.createElement('button');mb.type='button';mb.innerHTML=`${t.short}<small>0${i+1}</small>`;mb.setAttribute('aria-label',t.label);mb.addEventListener('click',()=>travelTo(t.el,t.label));mobile.appendChild(mb);mobileButtons.push(mb);
    });
    rail.insertAdjacentHTML('beforeend','<div class="itt-command__status"><i></i><span>HOUSE SYSTEM / ACTIVE</span></div>');document.body.append(rail,mobile);

    const scrollIndex=document.createElement('div');scrollIndex.className='itt-scroll-index';scrollIndex.innerHTML='<i></i><i></i><i></i><i></i><i></i>';document.body.appendChild(scrollIndex);const indexBars=[...scrollIndex.children];
    const setActive=(idx)=>{desktopButtons.forEach((b,i)=>b.classList.toggle('is-active',i===idx));mobileButtons.forEach((b,i)=>b.classList.toggle('is-active',i===idx));indexBars.forEach((b,i)=>b.style.setProperty('--s',i<=idx?1:0));};setActive(0);
    const io=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const idx=targets.findIndex(t=>t.el===visible.target);if(idx>-1)setActive(idx);},{threshold:[.2,.45,.7],rootMargin:'-16% 0px -16% 0px'});targets.forEach(t=>io.observe(t.el));

    const pointer=(e)=>{const x=(e.clientX/innerWidth)*100,y=(e.clientY/innerHeight)*100;root.style.setProperty('--mx',x+'%');root.style.setProperty('--my',y+'%');[hero,process,worlds].forEach(el=>{if(el){el.style.setProperty('--mx',x+'%');el.style.setProperty('--my',y+'%')}})};window.addEventListener('pointermove',pointer,{passive:true});

    const clamp=n=>Math.max(0,Math.min(1,n));
    const progress=el=>{if(!el)return 0;const r=el.getBoundingClientRect();return clamp((innerHeight-r.top)/(innerHeight+r.height));};
    const heroProgress=()=>{if(!hero)return 0;const r=hero.getBoundingClientRect();return clamp((-r.top)/Math.max(1,r.height*.82));};
    let lastY=window.scrollY,lastT=performance.now(),velocity=0;
    const draw=(now)=>{
      const y=window.scrollY||document.documentElement.scrollTop||0,dt=Math.max(16,now-lastT),dy=y-lastY;velocity+=(dy/dt-velocity)*.12;lastY=y;lastT=now;
      const cp=progress(commerce),pp=progress(process),ap=progress(atelier),wp=progress(worlds),hp=heroProgress();
      trims.forEach(t=>t.style.setProperty('--trimY',`${(y*.22)%100}%`));
      if(heroBg){heroBg.style.translate=`${(hp-.15)*2.6}vw ${hp*-4}vh`;heroBg.style.scale=String(1.02+hp*.055)};
      letters.forEach((el,i)=>{const p=clamp((hp-.08)/.58),s=i%2?1:-1;const x=s*p*(12+i*5),yy=p*p*(300+i*38),rot=s*p*(10+i*2.5);el.style.transform=`translate3d(${x}px,${yy}px,0) rotate(${rot}deg) scale(${1-p*.16})`;el.style.opacity=String(1-p*.88)});
      [hero,process,worlds].forEach((el,idx)=>{if(!el)return;const local=idx===0?hp:idx===1?pp:wp;el.style.setProperty('--halfY',`${(local-.5)*70}px`);el.style.setProperty('--halfScale',String(1+local*.18));el.style.setProperty('--halfRot',`${(local-.5)*4}deg`);el.style.setProperty('--scanY',`${((y*.28)+(idx*40))%120}px`);el.style.setProperty('--flashX',`${(local*115)-10}vw`)});
      if(hero)hero.style.setProperty('--fxFade',String(1-hp*.8));
      if(ribbon)ribbon.style.translate=`${(cp-.5)*58}vw ${Math.sin(cp*Math.PI)*-18}px`;
      if(product){product.style.translate=`${(cp-.5)*16}vw 0`;product.style.rotate=`${(cp-.5)*-1.5}deg`}
      if(films[0])films[0].style.translate=`${(pp-.5)*40}vw ${-(pp-.5)*7}vh`;if(films[1])films[1].style.translate=`${(.5-pp)*44}vw ${(pp-.5)*7}vh`;if(films[2])films[2].style.translate=`${(.5-pp)*32}vw ${-(pp-.5)*8}vh`;
      if(atelierImage){atelierImage.style.translate=`${(ap-.5)*18}vw 0`;atelierImage.style.rotate=`${(ap-.5)*2}deg`}
      worldCards.forEach((card,i)=>{const r=card.getBoundingClientRect(),cx=r.left+r.width/2,screen=innerWidth/2,d=(cx-screen)/innerWidth;card.style.transform=`translateZ(${Math.max(0,70-Math.abs(d)*180)}px) rotateY(${d*-14}deg) rotateX(${velocity*18}deg) scale(${1-Math.min(.13,Math.abs(d)*.18)})`;card.classList.toggle('is-magic',Math.abs(d)<.16)});
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  document.addEventListener('shopify:section:load',boot);
})();