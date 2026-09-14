(()=>{
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));

  function boot(){
    const root=$('.itt-x');
    if(!root||root.dataset.ittWorldReady)return;
    root.dataset.ittWorldReady='1';

    const hero=$('.itt-x__hero',root);
    const shop=$('.itt-x__commerce',root);
    const atelier=$('.itt-x__atelier',root);
    const lab=$('.itt-x__process',root);
    const oldWorlds=$('.itt-x__worlds',root);
    if(!hero||!shop||!atelier||!lab||!oldWorlds)return;

    const prefersReduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touchMode=()=>matchMedia('(hover:none),(max-width:1180px)').matches;

    const firstMedia=(host)=>{
      const video=$('video',host); if(video){
        const src=video.currentSrc||video.src||$('source',video)?.src;
        const poster=video.poster||'';
        return {type:'video',src,poster};
      }
      const img=$('img',host); if(img) return {type:'image',src:img.currentSrc||img.src||'',poster:''};
      return {type:'none',src:'',poster:''};
    };

    const heroMedia=firstMedia(hero), atelierMedia=firstMedia(atelier);
    const shopMedia={
      type:'image',
      src:'https://cdn.shopify.com/s/files/1/0735/1320/5802/files/ittHouseGatheringHandDrawnV1.png?v=1789354205',
      poster:''
    };
    const flagMedia={
      type:'image',
      src:'https://cdn.shopify.com/s/files/1/0735/1320/5802/files/ittFlaglineFieldHandDrawnV1.png?v=1789354209',
      poster:''
    };
    const labMedia={
      type:'image',
      src:'https://cdn.shopify.com/s/files/1/0735/1320/5802/files/ittLaboratoireMakerHandDrawnV1.png?v=1789354213',
      poster:''
    };

    const shopLink=$('a[href]',shop)?.href||'/collections/all';
    const atelierLink=$('a[href]',atelier)?.href||'/pages/contact';
    const worldLinks=$$('.itt-x__worldgrid a[href]',oldWorlds);
    const flagLink=worldLinks.find(a=>/flag/i.test(a.textContent))?.href||'/collections/flagline';
    const labLink=worldLinks.find(a=>/lab/i.test(a.textContent))?.href||'#';

    const worlds=[
      {n:'01',key:'HOUSE',title:'THE HOUSE.',sub:'MAISON · DÉTROIT — EAST SIDE',media:heroMedia,href:shopLink,cta:'SHOP THE EDIT'},
      {n:'02',key:'SHOP',title:'THE HOUSE EDIT.',sub:'LIMITED EDITIONS · ONE OF ONE',media:shopMedia,href:shopLink,cta:'ENTER SHOP'},
      {n:'03',key:'FLAGLINE',title:'BUILT FOR THE FIELD.',sub:'SPORT · SPEED · CULTURE',media:flagMedia,href:flagLink},
      {n:'04',key:'ITTELIER',title:'MADE FOR YOUR BODY.',sub:'CUT · FIT · CONSTRUCTION',media:atelierMedia,href:atelierLink},
      {n:'05',key:'LAB',title:'THE WORK LEAKS THROUGH.',sub:'PROTOTYPE · MATERIAL · MACHINE',media:labMedia,href:labLink}
    ];

    const mediaHTML=(m,i)=>{
      if(m.type==='video'&&m.src) return `<video class="itt-world__media" muted playsinline loop preload="metadata" ${m.poster?`poster="${m.poster}"`:''}><source src="${m.src}"></video>`;
      if(m.type==='image'&&m.src) return `<img class="itt-world__media" src="${m.src}" alt="" loading="${i<2?'eager':'lazy'}">`;
      return '<div class="itt-world__media itt-world__media--empty"></div>';
    };

    const stage=document.createElement('section');
    stage.className='itt-megaworld';
    stage.setAttribute('aria-label','ITT TOLD’EM worlds');
    stage.innerHTML=`
      <div class="itt-megaworld__sticky">
        <header class="itt-megaworld__hud">
          <a class="itt-megaworld__brand" href="/" aria-label="ITT TOLD’EM home"><b>ITT</b><span>TOLD’EM</span></a>
          <span class="itt-megaworld__origin">MAISON · DÉTROIT</span>
          <nav aria-label="Store controls"><a href="/collections/all">SHOP</a><a href="/search">SEARCH</a><a href="/cart">BAG</a></nav>
        </header>
        <div class="itt-megaworld__track">
          ${worlds.map((w,i)=>`<article class="itt-world itt-world--${i+1}" id="itt-world-0${i+1}" data-i="${i}">
            <div class="itt-world__bg">${mediaHTML(w.media,i)}</div>
            <div class="itt-world__shade"></div>
            <div class="itt-world__grid"></div>
            <div class="itt-world__number">${w.n}</div>
            <div class="itt-world__copy">
              <span>${w.n} / 05 · ${w.key}</span><${i===0?'h1':'h2'}>${w.title}</${i===0?'h1':'h2'}><p>${w.sub}</p>
              <a href="${w.href}" class="itt-world__cta">${w.cta||`ENTER ${w.key}`} <i aria-hidden="true">↗</i></a>
            </div>
            <div class="itt-world__continuum" aria-hidden="true"><i></i><b>${i===0?'BLUEPRINT':i===1?'SEAM':i===2?'FIELD':i===3?'MEASURE':'LASER PATH'}</b></div>
          </article>`).join('')}
        </div>
        <nav class="itt-megaworld__progress" aria-label="Explore the house">
          ${worlds.map((w,i)=>`<button type="button" data-world-jump="${i}" aria-label="Go to ${w.key}"><b>${w.n}</b><span>${w.key}</span></button>`).join('')}
        </nav>
        <div class="itt-megaworld__meter"><i></i></div>
      </div>`;

    shop.before(stage);
    root.classList.add('itt-has-megaworld');
    document.body.classList.add('itt-megaworld-live');

    const style=document.createElement('style');
    style.textContent=`
      body.template-index.itt-megaworld-live #header-group{display:none!important}
      body.template-index.itt-megaworld-live .itt-command-rail,body.template-index.itt-megaworld-live .itt-scripture-chip,body.template-index.itt-megaworld-live .itt-scroll-meter,body.template-index.itt-megaworld-live .itt-house-stamp,body.template-index.itt-megaworld-live .itt-mobile-dock{display:none!important}
      body.template-index.itt-megaworld-live .itt-fall-overlay{opacity:.2;mix-blend-mode:screen;mask-image:linear-gradient(180deg,transparent 0,#000 18%,#000 78%,transparent 100%);-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 18%,#000 78%,transparent 100%)}
      body.template-index.itt-megaworld-live .itt-fall-overlay__item:nth-of-type(even),body.template-index.itt-megaworld-live .itt-fall-overlay__sigil{display:none}
      .itt-megaworld{--mw-p:0;position:relative;height:500vh;background:#050505;color:#f5efe6;isolation:isolate}
      .itt-megaworld__sticky{position:sticky;top:0;height:100svh;overflow:hidden;background:#050505}
      .itt-megaworld__track{display:flex;width:500vw;height:100%;will-change:transform;transform:translate3d(calc(var(--mw-p) * -400vw),0,0)}
      .itt-world{position:relative;flex:0 0 100vw;height:100svh;overflow:hidden;isolation:isolate}
      .itt-world__bg{position:absolute;inset:-3%;z-index:0;overflow:hidden;transform:translate3d(calc((var(--world-local,0) - .5) * -5vw),0,0) scale(1.06);will-change:transform}
      .itt-world__media{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.62) saturate(.76) contrast(1.08)}
      .itt-world--2 .itt-world__media,.itt-world--3 .itt-world__media,.itt-world--5 .itt-world__media{object-position:center 42%}
      .itt-world__media--empty{background:radial-gradient(circle at 30% 35%,#2a2118 0,#080808 38%,#030303 76%)}
      .itt-world__shade{position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(0,0,0,.82) 0,rgba(0,0,0,.38) 44%,rgba(0,0,0,.12) 70%,rgba(0,0,0,.42) 100%),linear-gradient(180deg,rgba(0,0,0,.48) 0,transparent 28%,transparent 65%,rgba(0,0,0,.72) 100%)}
      .itt-world__grid{position:absolute;inset:0;z-index:2;opacity:.1;background-image:linear-gradient(rgba(201,168,97,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,97,.13) 1px,transparent 1px);background-size:80px 80px;mask-image:linear-gradient(90deg,#000,transparent 62%);-webkit-mask-image:linear-gradient(90deg,#000,transparent 62%)}
      .itt-world__number{position:absolute;right:5vw;top:15vh;z-index:4;font:italic 400 clamp(2.8rem,5vw,5rem)/1 Georgia,serif;color:rgba(245,239,230,.12);letter-spacing:-.05em}
      .itt-world__copy{position:absolute;left:6vw;bottom:17vh;z-index:5;width:min(680px,82vw);transform:translate3d(calc((var(--world-local,0) - .5) * 4vw),0,0);will-change:transform}
      .itt-world__copy>span{display:block;margin-bottom:14px;font:700 8px/1 Arial,sans-serif;letter-spacing:.28em;color:#c9a861}
      .itt-world__copy h1,.itt-world__copy h2{margin:0;max-width:10ch;font:italic 400 clamp(3.8rem,7.2vw,7.4rem)/.82 Georgia,serif;letter-spacing:-.06em;text-transform:uppercase;text-shadow:0 18px 55px rgba(0,0,0,.55)}
      .itt-world__copy p{margin:18px 0 0;font:700 8px/1.4 Arial,sans-serif;letter-spacing:.24em;color:rgba(245,239,230,.72)}
      .itt-world__cta{display:inline-flex;align-items:center;gap:18px;margin-top:22px;padding:12px 16px;border:1px solid rgba(245,239,230,.46);font:700 8px/1 Arial,sans-serif;letter-spacing:.2em;color:#fff!important;text-decoration:none!important;background:rgba(5,5,5,.18);backdrop-filter:blur(10px);transition:background .2s,color .2s,border-color .2s}
      .itt-world__cta i{font:normal 400 13px/1 Arial,sans-serif}.itt-world__cta:hover,.itt-world__cta:focus-visible{background:#f5efe6;color:#090909!important;border-color:#f5efe6}
      .itt-world__continuum{position:absolute;z-index:4;left:0;right:0;top:64%;height:20px;pointer-events:none;opacity:.55}
      .itt-world__continuum i{position:absolute;left:6vw;right:6vw;top:10px;height:1px;background:linear-gradient(90deg,#c9a861,rgba(245,239,230,.34),transparent 86%)}
      .itt-world__continuum b{position:absolute;right:6vw;top:0;font:700 6px/1 Arial,sans-serif;letter-spacing:.24em;color:rgba(201,168,97,.72)}
      .itt-world--2 .itt-world__continuum i{height:2px;background:repeating-linear-gradient(90deg,#f2e8d7 0 8px,transparent 8px 15px)}
      .itt-world--3 .itt-world__continuum i{height:3px;background:#f3eadf;box-shadow:0 0 0 1px rgba(0,0,0,.25)}
      .itt-world--4 .itt-world__continuum i{background:repeating-linear-gradient(90deg,#c9a861 0 1px,transparent 1px 18px)}
      .itt-world--5 .itt-world__continuum i{height:2px;background:linear-gradient(90deg,transparent,#c9a861 12%,#fff 50%,#c9a861 88%,transparent);box-shadow:0 0 22px rgba(201,168,97,.85)}
      .itt-megaworld__hud{position:absolute;z-index:20;left:4vw;right:4vw;top:18px;min-height:52px;padding:0 16px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border:1px solid rgba(245,239,230,.18);background:rgba(5,5,5,.38);backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1)}
      .itt-megaworld__hud a{color:#f5efe6!important;text-decoration:none!important;font:700 8px/1 Arial,sans-serif;letter-spacing:.2em}
      .itt-megaworld__brand{display:flex;align-items:center;gap:9px;justify-self:start}.itt-megaworld__brand b{font:italic 400 19px/1 Georgia,serif;letter-spacing:-.05em}.itt-megaworld__brand span{font-size:8px;letter-spacing:.22em}
      .itt-megaworld__origin{font:600 7px/1 Arial,sans-serif;letter-spacing:.24em;color:rgba(245,239,230,.58)}
      .itt-megaworld__hud nav{justify-self:end;display:flex;align-items:center;gap:24px}
      .itt-megaworld__progress{position:absolute;z-index:20;left:6vw;right:6vw;bottom:22px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
      .itt-megaworld__progress button{position:relative;height:44px;border:0;border-top:1px solid rgba(255,255,255,.22);background:transparent;color:rgba(244,236,223,.58);cursor:pointer;padding:9px 0 0;text-align:left}
      .itt-megaworld__progress b{font:italic 400 10px/1 Georgia,serif;color:#c9a861}.itt-megaworld__progress span{margin-left:9px;font:700 6px/1 Arial,sans-serif;letter-spacing:.16em}
      .itt-megaworld__progress button.is-active{color:#fff}.itt-megaworld__progress button.is-active:before{content:'';position:absolute;left:0;width:34%;top:-1px;height:2px;background:#f5efe6}
      .itt-megaworld__meter{display:none}
      .itt-has-megaworld>.itt-x__hero,.itt-has-megaworld>.itt-x__worlds{display:none!important}
      @media(hover:none),(max-width:1180px){
        .itt-megaworld{height:auto;overflow:hidden}.itt-megaworld__sticky{position:relative;height:100svh;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}.itt-megaworld__sticky::-webkit-scrollbar{display:none}.itt-megaworld__track{width:500vw;transform:none!important}.itt-world{scroll-snap-align:start}.itt-megaworld__hud{top:12px}.itt-megaworld__progress{bottom:max(10px,env(safe-area-inset-bottom));left:5vw;right:5vw;gap:7px}.itt-megaworld__progress button{min-width:0;padding-top:7px}.itt-world__copy{left:7vw;bottom:17vh;width:82vw}.itt-world__copy h1,.itt-world__copy h2{font-size:clamp(3.3rem,10vw,6.5rem)}
      }
      @media(max-width:600px){.itt-megaworld__hud{left:12px;right:12px;grid-template-columns:1fr auto;padding:0 12px}.itt-megaworld__origin{display:none}.itt-megaworld__hud nav{gap:14px}.itt-megaworld__hud nav a{font-size:6px}.itt-megaworld__brand span{display:none}.itt-world__copy{bottom:18vh}.itt-world__copy h1,.itt-world__copy h2{font-size:13vw}.itt-world__copy p{font-size:6px}.itt-world__number{top:12vh;font-size:13vw}.itt-megaworld__progress span{display:none}.itt-world__grid{background-size:44px 44px}.itt-world--2 .itt-world__media,.itt-world--3 .itt-world__media,.itt-world--5 .itt-world__media{object-position:62% 42%}}
      @media(prefers-reduced-motion:reduce){.itt-megaworld{height:auto}.itt-megaworld__sticky{position:relative;height:100svh;overflow-x:auto;scroll-snap-type:x mandatory}.itt-megaworld__track{transform:none!important}.itt-world{scroll-snap-align:start}.itt-world__bg,.itt-world__copy{transform:none!important}}
    `;
    document.head.appendChild(style);

    const sticky=$('.itt-megaworld__sticky',stage), track=$('.itt-megaworld__track',stage), panels=$$('.itt-world',stage), buttons=$$('[data-world-jump]',stage), meter=$('.itt-megaworld__meter',stage);
    const vids=$$('video',stage); vids.forEach(v=>v.play().catch(()=>{}));

    let raf=0,current=-1;
    const activate=(idx)=>{
      if(idx===current)return; current=idx;
      buttons.forEach((b,i)=>b.classList.toggle('is-active',i===idx));
      panels.forEach((p,i)=>p.classList.toggle('is-active',i===idx));
      vids.forEach((v,i)=>{ if(panels[i]?.contains(v)){ if(i===idx)v.play().catch(()=>{}); else v.pause(); }});
    };

    const draw=()=>{
      raf=0;
      if(prefersReduced()||touchMode())return;
      const r=stage.getBoundingClientRect();
      const max=Math.max(1,stage.offsetHeight-innerHeight);
      const p=clamp(-r.top/max);
      stage.style.setProperty('--mw-p',p.toFixed(5));
      const idx=Math.min(4,Math.floor(p*5)); activate(idx);
      panels.forEach((panel,i)=>{
        const local=clamp((p*5)-i,0,1);
        panel.style.setProperty('--world-local',local.toFixed(4));
      });
    };
    const requestDraw=()=>{if(!raf)raf=requestAnimationFrame(draw)};
    addEventListener('scroll',requestDraw,{passive:true}); addEventListener('resize',requestDraw,{passive:true}); requestDraw();

    buttons.forEach((b,i)=>b.addEventListener('click',()=>{
      if(touchMode()||prefersReduced()){
        sticky.scrollTo({left:i*innerWidth,behavior:prefersReduced()?'auto':'smooth'});
      }else{
        const top=scrollY+stage.getBoundingClientRect().top;
        const max=stage.offsetHeight-innerHeight;
        scrollTo({top:top+(i/4)*max,behavior:'smooth'});
      }
    }));

    sticky.addEventListener('scroll',()=>{
      if(!(touchMode()||prefersReduced()))return;
      const idx=Math.round(sticky.scrollLeft/Math.max(1,innerWidth));activate(clamp(idx,0,4));
    },{passive:true});

    activate(0);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  document.addEventListener('shopify:section:load',boot);
})();
