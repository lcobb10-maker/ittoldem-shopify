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

    const style=document.createElement('style');
    style.textContent=`
      .itt-command{position:fixed;left:clamp(18px,2vw,30px);top:50%;transform:translateY(-50%);z-index:70;width:58px;border:1px solid rgba(201,168,97,.38);background:rgba(5,5,5,.72);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);box-shadow:0 18px 50px rgba(0,0,0,.4);overflow:hidden;transition:width .35s cubic-bezier(.2,.8,.2,1),background .35s,border-color .35s}
      .itt-command:hover,.itt-command:focus-within{width:214px;background:rgba(5,5,5,.9);border-color:rgba(201,168,97,.72)}
      .itt-command__mark{height:58px;display:flex;align-items:center;gap:14px;padding:0 17px;border-bottom:1px solid rgba(255,255,255,.09);white-space:nowrap}
      .itt-command__eye{width:22px;height:12px;border:1px solid rgba(240,231,215,.7);border-radius:50%/70%;position:relative;flex:0 0 auto}.itt-command__eye:after{content:'';position:absolute;width:4px;height:4px;border-radius:50%;background:#c9a861;left:50%;top:50%;transform:translate(-50%,-50%)}
      .itt-command__brand{font:600 9px/1 Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#f2eadf;opacity:0;transform:translateX(-8px);transition:.25s}.itt-command:hover .itt-command__brand,.itt-command:focus-within .itt-command__brand{opacity:1;transform:none}
      .itt-command__item{position:relative;width:100%;height:56px;border:0;border-bottom:1px solid rgba(255,255,255,.07);background:transparent;color:#f4ecdf;display:flex;align-items:center;gap:16px;padding:0 18px;cursor:pointer;text-align:left;transition:.25s}
      .itt-command__item:last-child{border-bottom:0}.itt-command__item:hover{background:rgba(255,255,255,.06)}
      .itt-command__num{font:italic 400 11px/1 Georgia,serif;color:#c9a861;min-width:22px}.itt-command__label{font:600 9px/1 Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase;white-space:nowrap;opacity:0;transform:translateX(-8px);transition:.25s}.itt-command:hover .itt-command__label,.itt-command:focus-within .itt-command__label{opacity:1;transform:none}
      .itt-command__item.is-active{background:linear-gradient(90deg,rgba(201,168,97,.16),transparent)}.itt-command__item.is-active:before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:2px;background:#c9a861;box-shadow:0 0 12px rgba(201,168,97,.55)}
      .itt-command__item.is-active .itt-command__num{color:#fff}.itt-command__status{height:42px;display:flex;align-items:center;gap:9px;padding:0 18px;border-top:1px solid rgba(255,255,255,.08);font:600 8px/1 Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.46);white-space:nowrap}.itt-command__status i{width:6px;height:6px;border-radius:50%;background:#c9a861;box-shadow:0 0 10px rgba(201,168,97,.8);flex:0 0 auto}
      .itt-command-transition{position:fixed;inset:0;z-index:69;pointer-events:none;background:#050505;clip-path:inset(0 100% 0 0);transition:clip-path .32s cubic-bezier(.7,0,.3,1)}.itt-command-transition.is-on{clip-path:inset(0 0 0 0)}.itt-command-transition.is-off{clip-path:inset(0 0 0 100%)}
      .itt-command-transition span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:italic 400 clamp(3rem,9vw,9rem)/1 Georgia,serif;color:#f2eadf;letter-spacing:-.05em}
      .itt-mobile-command{display:none}
      @media(max-width:900px){.itt-command{display:none}.itt-mobile-command{position:fixed;z-index:70;left:50%;bottom:max(16px,env(safe-area-inset-bottom));transform:translateX(-50%);display:grid;grid-template-columns:repeat(5,1fr);width:min(92vw,560px);height:58px;background:rgba(5,5,5,.88);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(201,168,97,.38);box-shadow:0 14px 40px rgba(0,0,0,.45)}.itt-mobile-command button{position:relative;border:0;border-right:1px solid rgba(255,255,255,.08);background:transparent;color:#f4ecdf;font:italic 400 11px/1 Georgia,serif}.itt-mobile-command button:last-child{border-right:0}.itt-mobile-command button.is-active{background:rgba(201,168,97,.14);color:#fff}.itt-mobile-command button.is-active:before{content:'';position:absolute;left:10px;right:10px;top:0;height:2px;background:#c9a861}}
      @media(prefers-reduced-motion:reduce){.itt-command,.itt-command *, .itt-command-transition{transition:none!important}}
    `;
    document.head.appendChild(style);

    const targets=[
      {label:'LA MAISON',el:hero},
      {label:'SHOP',el:commerce},
      {label:'FLAGLINE',el:worlds},
      {label:"L’ATELIER",el:atelier},
      {label:'LE LABORATOIRE',el:process}
    ].filter(x=>x.el);

    const transition=document.createElement('div');
    transition.className='itt-command-transition';
    transition.innerHTML='<span>I told ’em.</span>';
    document.body.appendChild(transition);

    const rail=document.createElement('nav');
    rail.className='itt-command';
    rail.setAttribute('aria-label','ITT TOLD’EM worlds');
    rail.innerHTML='<div class="itt-command__mark"><span class="itt-command__eye" aria-hidden="true"></span><span class="itt-command__brand">ITT TOLD’EM / DETROIT</span></div>';

    const mobile=document.createElement('nav');
    mobile.className='itt-mobile-command';
    mobile.setAttribute('aria-label','ITT TOLD’EM mobile worlds');

    const desktopButtons=[];
    const mobileButtons=[];

    const travelTo=(target,label)=>{
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(reduced){target.scrollIntoView({behavior:'auto',block:'start'});return;}
      transition.querySelector('span').textContent=label;
      transition.classList.remove('is-off');
      requestAnimationFrame(()=>transition.classList.add('is-on'));
      setTimeout(()=>{
        target.scrollIntoView({behavior:'smooth',block:'start'});
        transition.classList.remove('is-on');
        transition.classList.add('is-off');
        setTimeout(()=>transition.classList.remove('is-off'),380);
      },290);
    };

    targets.forEach((t,i)=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='itt-command__item';
      b.innerHTML=`<span class="itt-command__num">0${i+1}</span><span class="itt-command__label">${t.label}</span>`;
      b.addEventListener('click',()=>travelTo(t.el,t.label));
      rail.appendChild(b);
      desktopButtons.push(b);

      const mb=document.createElement('button');
      mb.type='button';
      mb.textContent=`0${i+1}`;
      mb.setAttribute('aria-label',t.label);
      mb.addEventListener('click',()=>travelTo(t.el,t.label));
      mobile.appendChild(mb);
      mobileButtons.push(mb);
    });
    rail.insertAdjacentHTML('beforeend','<div class="itt-command__status"><i></i><span>HOUSE SYSTEM / ACTIVE</span></div>');
    document.body.appendChild(rail);
    document.body.appendChild(mobile);

    const setActive=(idx)=>{
      desktopButtons.forEach((b,i)=>b.classList.toggle('is-active',i===idx));
      mobileButtons.forEach((b,i)=>b.classList.toggle('is-active',i===idx));
    };
    setActive(0);

    const io=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      const idx=targets.findIndex(t=>t.el===visible.target);
      if(idx>-1)setActive(idx);
    },{threshold:[.25,.5,.7],rootMargin:'-18% 0px -18% 0px'});
    targets.forEach(t=>io.observe(t.el));

    const clamp=n=>Math.max(0,Math.min(1,n));
    const progress=el=>{if(!el)return 0;const r=el.getBoundingClientRect();return clamp((innerHeight-r.top)/(innerHeight+r.height));};
    const heroProgress=()=>{if(!hero)return 0;const r=hero.getBoundingClientRect();return clamp((-r.top)/Math.max(1,r.height*.82));};
    let lastY=-1,lastW=-1;
    const draw=()=>{
      const y=window.scrollY||document.documentElement.scrollTop||0,w=innerWidth;
      if(y!==lastY||w!==lastW){
        lastY=y;lastW=w;
        const cp=progress(commerce),pp=progress(process),ap=progress(atelier),hp=heroProgress();
        trims.forEach(t=>t.style.setProperty('--trimY',`${(y*.22)%100}%`));
        if(heroBg)heroBg.style.translate=`${(hp-.15)*2}vw ${hp*-2.5}vh`;
        letters.forEach((el,i)=>{
          const p=clamp((hp-.10)/.58),s=i%2?1:-1;
          const x=s*p*(10+i*4),yy=p*p*(260+i*32),rot=s*p*(9+i*2);
          el.style.transform=`translate3d(${x}px,${yy}px,0) rotate(${rot}deg) scale(${1-p*.18})`;
          el.style.opacity=String(1-p*.92);
        });
        if(ribbon)ribbon.style.translate=`${(cp-.5)*52}vw 0`;
        if(product)product.style.translate=`${(cp-.5)*14}vw 0`;
        if(films[0])films[0].style.translate=`${(pp-.5)*34}vw ${-(pp-.5)*5}vh`;
        if(films[1])films[1].style.translate=`${(.5-pp)*38}vw ${(pp-.5)*5}vh`;
        if(films[2])films[2].style.translate=`${(.5-pp)*28}vw ${-(pp-.5)*6}vh`;
        if(atelierImage)atelierImage.style.translate=`${(ap-.5)*15}vw 0`;
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  document.addEventListener('shopify:section:load',boot);
})();