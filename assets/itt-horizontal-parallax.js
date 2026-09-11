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

    const shopMedia=firstMedia(shop), heroMedia=firstMedia(hero), atelierMedia=firstMedia(atelier), labMedia=firstMedia(lab);
    const flagMedia=(()=>{
      const card=$('.itt-x__worldgrid a',oldWorlds);
      if(!card)return firstMedia(oldWorlds);
      const bg=getComputedStyle(card).backgroundImage;
      const m=bg&&bg.match(/url\(["']?(.*?)["']?\)/);
      return m?{type:'image',src:m[1],poster:''}:firstMedia(oldWorlds);
    })();

    const shopLink=$('a[href]',shop)?.href||'/collections/all';
    const atelierLink=$('a[href]',atelier)?.href||'/pages/contact';
    const worldLinks=$$('.itt-x__worldgrid a[href]',oldWorlds);
    const flagLink=worldLinks.find(a=>/flag/i.test(a.textContent))?.href||'/collections/flagline';
    const labLink=worldLinks.find(a=>/lab/i.test(a.textContent))?.href||'#';

    const worlds=[
      {n:'01',key:'HOUSE',title:'THE HOUSE',sub:'MAISON · DÉTROIT — EAST SIDE',media:heroMedia,href:'#top'},
      {n:'02',key:'SHOP',title:'ONE PIECE. FULL ATTENTION.',sub:'REAL GARMENTS · LIVE COMMERCE',media:shopMedia,href:shopLink},
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
        <div class="itt-megaworld__hud">
          <a class="itt-megaworld__brand" href="/">ITT TOLD’EM</a>
          <nav><a href="/collections/all">SHOP</a><a href="#itt-world-01">HOUSE</a><a href="/cart">BAG</a></nav>
        </div>
        <div class="itt-megaworld__track">
          ${worlds.map((w,i)=>`<article class="itt-world itt-world--${i+1}" id="itt-world-0${i+1}" data-i="${i}">
            <div class="itt-world__bg">${mediaHTML(w.media,i)}</div>
            <div class="itt-world__shade"></div>
            <div class="itt-world__grid"></div>
            <div class="itt-world__number">${w.n}</div>
            <div class="itt-world__copy">
              <span>${w.key}</span><h2>${w.title}</h2><p>${w.sub}</p>
              <a href="${w.href}" class="itt-world__cta">ENTER ${w.key} →</a>
            </div>
            <div class="itt-world__continuum" aria-hidden="true"><i></i><b>${i===0?'BLUEPRINT':i===1?'SEAM':i===2?'FIELD':i===3?'MEASURE':'LASER PATH'}</b></div>
          </article>`).join('')}
        </div>
        <div class="itt-megaworld__progress" aria-label="World progress">
          ${worlds.map((w,i)=>`<button type="button" data-world-jump="${i}" aria-label="Go to ${w.key}"><b>${w.n}</b><span>${w.key}</span></button>`).join('')}
        </div>
        <div class="itt-megaworld__meter"><i></i></div>
      </div>`;

    shop.before(stage);
    root.classList.add('itt-has-megaworld');

    const style=document.createElement('style');
    style.textContent=`
      .itt-megaworld{--mw-p:0;position:relative;height:620vh;background:#050505;color:#f5efe6;isolation:isolate}
      .itt-megaworld__sticky{position:sticky;top:0;height:100svh;overflow:hidden;background:#050505}
      .itt-megaworld__track{display:flex;width:500vw;height:100%;will-change:transform;transform:translate3d(calc(var(--mw-p) * -400vw),0,0)}
      .itt-world{position:relative;flex:0 0 100vw;height:100svh;overflow:hidden;isolation:isolate}
      .itt-world__bg{position:absolute;inset:-4%;z-index:0;overflow:hidden;transform:translate3d(calc((var(--world-local,0) - .5) * -8vw),0,0) scale(1.08);will-change:transform}
      .itt-world__media{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.56) saturate(.78) contrast(1.1)}
      .itt-world__media--empty{background:radial-gradient(circle at 30% 35%,#2a2118 0,#080808 38%,#030303 76%)}
      .itt-world__shade{position:absolute;inset:0;z-index:1;background:radial-gradient(circle at 55% 42%,transparent 0 20%,rgba(0,0,0,.16) 48%,rgba(0,0,0,.76) 100%),linear-gradient(90deg,rgba(0,0,0,.75),rgba(0,0,0,.08) 54%,rgba(0,0,0,.5))}
      .itt-world__grid{position:absolute;inset:0;z-index:2;opacity:.2;background-image:linear-gradient(rgba(201,168,97,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,97,.16) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(90deg,#000,transparent 72%);-webkit-mask-image:linear-gradient(90deg,#000,transparent 72%)}
      .itt-world__number{position:absolute;right:4vw;top:9vh;z-index:4;font:italic 400 clamp(4rem,9vw,10rem)/.8 Georgia,serif;color:rgba(245,239,230,.13);letter-spacing:-.08em}
      .itt-world__copy{position:absolute;left:6vw;bottom:15vh;z-index:5;width:min(780px,80vw);transform:translate3d(calc((var(--world-local,0) - .5) * 7vw),0,0);will-change:transform}
      .itt-world__copy>span{display:block;margin-bottom:18px;font:700 9px/1 Arial,sans-serif;letter-spacing:.32em;color:#c9a861}
      .itt-world__copy h2{margin:0;max-width:11ch;font:italic 400 clamp(4rem,8.5vw,9rem)/.8 Georgia,serif;letter-spacing:-.065em;text-transform:uppercase;text-shadow:0 18px 55px rgba(0,0,0,.55)}
      .itt-world__copy p{margin:24px 0 0;font:700 9px/1.4 Arial,sans-serif;letter-spacing:.27em;color:rgba(245,239,230,.72)}
      .itt-world__cta{display:inline-flex;margin-top:28px;padding:12px 0;border-bottom:1px solid rgba(245,239,230,.7);font:700 9px/1 Arial,sans-serif;letter-spacing:.22em;color:#fff!important;text-decoration:none!important}
      .itt-world__continuum{position:absolute;z-index:4;left:-3vw;right:-3vw;top:62%;height:30px;transform:rotate(-2deg);pointer-events:none}
      .itt-world__continuum i{position:absolute;left:0;right:0;top:14px;height:1px;background:linear-gradient(90deg,transparent,#c9a861 8%,#f3eadf 48%,#c9a861 92%,transparent);box-shadow:0 0 20px rgba(201,168,97,.35)}
      .itt-world__continuum b{position:absolute;left:8vw;top:0;padding:0 10px;background:#080808;font:700 7px/1 Arial,sans-serif;letter-spacing:.25em;color:#c9a861}
      .itt-world--2 .itt-world__continuum i{height:2px;background:repeating-linear-gradient(90deg,#f2e8d7 0 8px,transparent 8px 15px)}
      .itt-world--3 .itt-world__continuum i{height:3px;background:#f3eadf;box-shadow:0 0 0 1px rgba(0,0,0,.25)}
      .itt-world--4 .itt-world__continuum i{background:repeating-linear-gradient(90deg,#c9a861 0 1px,transparent 1px 18px)}
      .itt-world--5 .itt-world__continuum i{height:2px;background:linear-gradient(90deg,transparent,#c9a861 12%,#fff 50%,#c9a861 88%,transparent);box-shadow:0 0 22px rgba(201,168,97,.85)}
      .itt-megaworld__hud{position:absolute;z-index:20;left:4vw;right:4vw;top:24px;display:flex;justify-content:space-between;align-items:center;pointer-events:none}
      .itt-megaworld__hud a{pointer-events:auto;color:#f5efe6!important;text-decoration:none!important;font:700 9px/1 Arial,sans-serif;letter-spacing:.22em}
      .itt-megaworld__hud nav{display:flex;gap:28px}.itt-megaworld__brand{font:italic 400 18px/1 Georgia,serif!important;letter-spacing:.04em!important}
      .itt-megaworld__progress{position:absolute;z-index:20;left:50%;bottom:28px;transform:translateX(-50%);display:flex;gap:2px;background:rgba(3,3,3,.64);border:1px solid rgba(201,168,97,.32);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
      .itt-megaworld__progress button{position:relative;min-width:94px;height:52px;border:0;border-right:1px solid rgba(255,255,255,.08);background:transparent;color:#f4ecdf;cursor:pointer;padding:8px 12px;text-align:left}
      .itt-megaworld__progress button:last-child{border-right:0}.itt-megaworld__progress b{display:block;font:italic 400 11px/1 Georgia,serif;color:#c9a861}.itt-megaworld__progress span{display:block;margin-top:6px;font:700 7px/1 Arial,sans-serif;letter-spacing:.16em}
      .itt-megaworld__progress button.is-active{background:rgba(201,168,97,.14)}.itt-megaworld__progress button.is-active:before{content:'';position:absolute;left:8px;right:8px;top:0;height:2px;background:#c9a861}
      .itt-megaworld__meter{position:absolute;z-index:20;left:4vw;right:4vw;bottom:12px;height:1px;background:rgba(255,255,255,.12)}.itt-megaworld__meter i{display:block;height:100%;width:100%;background:#c9a861;transform-origin:left;transform:scaleX(var(--mw-p));box-shadow:0 0 16px rgba(201,168,97,.7)}
      .itt-has-megaworld>.itt-x__commerce,.itt-has-megaworld>.itt-x__process,.itt-has-megaworld>.itt-x__atelier,.itt-has-megaworld>.itt-x__worlds{display:none!important}
      @media(hover:none),(max-width:1180px){
        .itt-megaworld{height:auto;overflow:hidden}.itt-megaworld__sticky{position:relative;height:100svh;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}.itt-megaworld__sticky::-webkit-scrollbar{display:none}.itt-megaworld__track{width:500vw;transform:none!important}.itt-world{scroll-snap-align:start}.itt-megaworld__hud{top:18px}.itt-megaworld__progress{bottom:max(18px,env(safe-area-inset-bottom));width:92vw}.itt-megaworld__progress button{min-width:0;flex:1;padding:7px}.itt-megaworld__progress span{font-size:6px}.itt-megaworld__meter{display:none}.itt-world__copy{left:7vw;bottom:19vh;width:82vw}.itt-world__copy h2{font-size:clamp(3.3rem,10vw,7rem)}
      }
      @media(max-width:600px){.itt-megaworld__hud nav{gap:15px}.itt-megaworld__hud nav a{font-size:7px}.itt-megaworld__brand{font-size:14px!important}.itt-world__copy{bottom:21vh}.itt-world__copy h2{font-size:13vw}.itt-world__copy p{font-size:7px}.itt-world__number{top:12vh;font-size:18vw}.itt-megaworld__progress{height:56px}.itt-world__grid{background-size:44px 44px}}
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