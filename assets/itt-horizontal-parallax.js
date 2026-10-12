(()=>{
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));

  /* ================= Sound: everything is synthesized live, no audio files ================= */
  const Sound=(()=>{
    let ctx=null,master=null,on=false,crackleT=0,room=null;
    const noise=(sec,brown)=>{
      const b=ctx.createBuffer(1,Math.max(1,Math.floor(ctx.sampleRate*sec)),ctx.sampleRate),d=b.getChannelData(0);let last=0;
      for(let i=0;i<d.length;i++){const w=Math.random()*2-1;if(brown){last=(last+.02*w)/1.02;d[i]=last*3.5}else d[i]=w}
      return b;
    };
    const init=()=>{
      if(ctx)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      try{ctx=new AC();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination)}catch(e){ctx=null}
    };
    // The match: a dry scratch, then the whoosh of the flare.
    const strike=()=>{
      if(!ctx)return;ctx.resume();const t=ctx.currentTime;
      const s=ctx.createBufferSource();s.buffer=noise(.4);
      const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=2.5;bp.frequency.setValueAtTime(900,t);bp.frequency.exponentialRampToValueAtTime(3800,t+.18);
      const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.55,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.32);
      s.connect(bp).connect(g).connect(ctx.destination);s.start(t);s.stop(t+.4);
      const f=ctx.createBufferSource();f.buffer=noise(1.4);
      const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(300,t+.12);lp.frequency.exponentialRampToValueAtTime(1600,t+.35);lp.frequency.exponentialRampToValueAtTime(500,t+1.3);
      const fg=ctx.createGain();fg.gain.setValueAtTime(0,t+.12);fg.gain.linearRampToValueAtTime(.4,t+.3);fg.gain.exponentialRampToValueAtTime(.001,t+1.35);
      f.connect(lp).connect(fg).connect(ctx.destination);f.start(t+.12);f.stop(t+1.4);
    };
    // A card turning over: a soft paper flick.
    const flick=()=>{
      if(!ctx||!on)return;const t=ctx.currentTime;
      const s=ctx.createBufferSource();s.buffer=noise(.12);
      const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=1.2;bp.frequency.setValueAtTime(2400,t);bp.frequency.exponentialRampToValueAtTime(900,t+.1);
      const g=ctx.createGain();g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.11);
      s.connect(bp).connect(g).connect(master);s.start(t);s.stop(t+.12);
    };
    const crackle=()=>{
      if(!on||!ctx)return;const t=ctx.currentTime,len=.004+Math.random()*.02;
      const n=ctx.createBufferSource();n.buffer=noise(len);
      const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=1200+Math.random()*2500;
      const g=ctx.createGain();g.gain.setValueAtTime(.03+Math.random()*.12,t);g.gain.exponentialRampToValueAtTime(.0005,t+len+.03);
      n.connect(hp).connect(g).connect(master);n.start(t);n.stop(t+len+.05);
      crackleT=setTimeout(crackle,60+Math.random()*(Math.random()<.2?900:260));
    };
    // Room tone: a low, warm hush under everything.
    const startRoom=()=>{
      if(room||!ctx)return;room=ctx.createBufferSource();room.buffer=noise(4,true);room.loop=true;
      const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=380;const g=ctx.createGain();g.gain.value=.22;
      room.connect(lp).connect(g).connect(master);room.start();
    };
    const set=v=>{
      if(!ctx)return;on=v;const t=ctx.currentTime;
      master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(v?.5:0,t+(v?2.5:.6));
      clearTimeout(crackleT);if(v){ctx.resume();setTimeout(startRoom,350);crackle()}
    };
    document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden){ctx.suspend();clearTimeout(crackleT)}else if(on){ctx.resume();crackle()}});
    return {init,strike,flick,set,get on(){return on},get ok(){return !!ctx}};
  })();

  // A small sound switch that stays on screen.
  let updateSoundToggle=()=>{};
  const soundToggle=()=>{
    if(document.querySelector('.itt-sound')||!(window.AudioContext||window.webkitAudioContext))return;
    const b=document.createElement('button');b.type='button';b.className='itt-sound';
    b.innerHTML='<i aria-hidden="true"><b></b><b></b><b></b></i><span></span>';
    updateSoundToggle=()=>{b.classList.toggle('is-on',Sound.on);b.setAttribute('aria-pressed',Sound.on?'true':'false');b.lastChild.textContent=Sound.on?'SOUND · ON':'SOUND · OFF';b.setAttribute('aria-label',Sound.on?'Sound on. Tap to mute.':'Sound off. Tap to turn on.')};
    b.addEventListener('click',()=>{Sound.init();Sound.set(!Sound.on);updateSoundToggle()});
    document.body.appendChild(b);updateSoundToggle();
  };

  /* ================= Strike the match: the visitor lights the house ================= */
  const entered=(()=>{
    let resolve;const p=new Promise(r=>resolve=r);
    const body=document.body;
    const isHome=body&&body.classList.contains('template-index');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const editor=document.documentElement.classList.contains('shopify-design-mode');
    let seen=false;try{seen=sessionStorage.getItem('itt-lit')==='1'}catch(e){}
    if(!isHome){resolve(false);return p}
    const css=document.createElement('style');
    css.textContent=`
      .itt-strike{position:fixed;inset:0;z-index:2147483000;background-color:#030201;color:#f5efe6;display:grid;place-items:center;transition:background-color 1s ease .3s}
      .itt-strike__bloom{position:absolute;left:var(--gx,50%);top:var(--gy,45%);width:90px;height:90px;margin:-45px 0 0 -45px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(255,238,196,.95) 0,rgba(255,176,88,.6) 34%,rgba(255,120,40,0) 70%);transform:scale(0);opacity:0;will-change:transform,opacity;transition:transform .35s ease-out,opacity .2s ease-out}
      .itt-strike.is-struck .itt-strike__bloom{transform:scale(1.4);opacity:1}
      .itt-strike.is-opening{background-color:rgba(3,2,1,0);pointer-events:none}
      .itt-strike.is-opening .itt-strike__bloom{transform:scale(42);opacity:0;transition:transform 1.3s cubic-bezier(.2,.7,.2,1),opacity .9s ease .45s}
      .itt-strike.is-opening .itt-strike__center,.itt-strike.is-opening .itt-strike__top,.itt-strike.is-opening .itt-strike__foot,.itt-strike.is-opening .itt-strike__glow{opacity:0;transition:opacity .45s ease}
      .itt-strike__glow{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 1.2s ease;background:radial-gradient(circle at var(--gx,50%) var(--gy,45%),rgba(255,160,70,.3),transparent 45%)}
      .itt-strike.is-struck .itt-strike__glow{opacity:1}
      .itt-strike__top,.itt-strike__foot{position:absolute;left:0;right:0;text-align:center;font:600 9px/1 Arial,sans-serif;letter-spacing:.32em;color:rgba(245,239,230,.45)}
      .itt-strike__top{top:30px}.itt-strike__foot{bottom:30px}
      .itt-strike__center{position:relative;display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center;padding:0 24px}
      .itt-strike__match{position:relative;width:70px;height:180px;border:0;background:none;cursor:pointer;padding:0;outline:none}
      .itt-strike__stick{position:absolute;left:50%;bottom:0;width:6px;height:132px;margin-left:-3px;border-radius:2px;background:linear-gradient(90deg,#9c7142,#e6c79a 45%,#9c7142)}
      .itt-strike__head{position:absolute;left:50%;bottom:124px;width:16px;height:24px;margin-left:-8px;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 40% 35%,#a2392a,#5b1710 70%);transition:filter .3s,background .25s}
      .itt-strike__match:hover .itt-strike__head,.itt-strike__match:focus-visible .itt-strike__head{filter:drop-shadow(0 0 10px rgba(255,140,60,.7))}
      .itt-strike__match:hover .itt-strike__stick{transform:rotate(-2deg)}
      .itt-strike.is-struck .itt-strike__head{background:radial-gradient(circle at 40% 35%,#ffcf7a,#ff7a2a 60%,#3a0e08)}
      .itt-strike__flame{position:absolute;left:50%;bottom:134px;width:34px;height:64px;margin-left:-17px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:radial-gradient(ellipse at 50% 75%,#fff7d6 0,#ffd37a 22%,#ff9a3c 48%,rgba(255,90,20,.35) 68%,transparent 75%);transform-origin:50% 90%;transform:scale(0);opacity:0;filter:blur(.6px)}
      .itt-strike.is-struck .itt-strike__flame{animation:ittFlame .5s cubic-bezier(.2,1.6,.4,1) forwards,ittFlick .12s .5s infinite alternate}
      @keyframes ittFlame{0%{transform:scale(0);opacity:0}40%{transform:scale(1.9,1.6);opacity:1}100%{transform:scale(1);opacity:1}}
      @keyframes ittFlick{from{transform:scale(1,1) skewX(-3deg)}to{transform:scale(.93,1.07) skewX(3deg)}}
      .itt-spark{position:absolute;left:50%;bottom:146px;width:3px;height:3px;margin-left:-1.5px;border-radius:50%;background:#ffd88a;box-shadow:0 0 6px 2px rgba(255,160,60,.85);animation:ittSpark var(--d,.7s) cubic-bezier(.1,.7,.3,1) forwards}
      @keyframes ittSpark{to{transform:translate(var(--dx),var(--dy));opacity:0}}
      .itt-strike__line{margin:0;min-height:1.3em;font:italic 400 clamp(1.3rem,3vw,2rem)/1.2 Georgia,serif;color:#d9b779;transition:opacity .4s}
      .itt-strike__go{border:1px solid rgba(245,239,230,.5);background:transparent;color:#f5efe6;padding:15px 24px;font:700 9px/1 Arial,sans-serif;letter-spacing:.32em;cursor:pointer;transition:background .2s,color .2s,opacity .3s}
      .itt-strike__go:hover,.itt-strike__go:focus-visible{background:#f5efe6;color:#050505;outline:none}
      .itt-strike__quiet{border:0;background:none;color:rgba(245,239,230,.5);font:italic 400 14px/1 Georgia,serif;cursor:pointer;text-decoration:underline;text-underline-offset:4px;transition:opacity .3s}
      .itt-strike.is-struck .itt-strike__go,.itt-strike.is-struck .itt-strike__quiet{opacity:0;pointer-events:none}
      .itt-sound{position:fixed;right:16px;top:84px;z-index:80;display:flex;align-items:center;justify-content:center;width:36px;height:36px;padding:0;border-radius:50%;border:1px solid rgba(201,168,97,.45);background:rgba(5,5,5,.6);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#f5efe6;cursor:pointer}
      .itt-sound span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
      .itt-sound:not(.is-on){opacity:.6}
      .itt-sparks{position:fixed;inset:0;width:100vw;height:100vh;z-index:60;pointer-events:none}
      .itt-sound i{display:inline-flex;gap:2px;align-items:flex-end;height:10px}.itt-sound i b{display:block;width:2px;height:3px;background:#c9a861}
      .itt-sound.is-on i b{animation:ittBar .9s ease-in-out infinite alternate}.itt-sound.is-on i b:nth-child(2){animation-delay:.2s}.itt-sound.is-on i b:nth-child(3){animation-delay:.4s}
      @keyframes ittBar{to{height:10px}}
      @media(max-width:600px){.itt-sound{top:72px;right:12px}}
    `;
    document.head.appendChild(css);
    if(reduce||editor||seen){resolve(false);setTimeout(soundToggle,0);return p}

    const ov=document.createElement('div');
    ov.className='itt-strike';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Enter the house');
    ov.innerHTML=`<div class="itt-strike__glow"></div><div class="itt-strike__bloom"></div>
      <div class="itt-strike__top">MAISON · DÉTROIT — EAST SIDE</div>
      <div class="itt-strike__center">
        <button class="itt-strike__match" type="button" aria-label="Strike the match and enter with sound"><i class="itt-strike__stick"></i><i class="itt-strike__head"></i><i class="itt-strike__flame"></i></button>
        <p class="itt-strike__line">${(h=>h>=22||h<5?'still up? so are we.':'the house is dark.')(new Date().getHours())}</p>
        <button class="itt-strike__go" type="button">STRIKE THE MATCH</button>
        <button class="itt-strike__quiet" type="button">enter in silence</button>
      </div>
      <div class="itt-strike__foot">ITT TOLD’EM · BEST WITH SOUND</div>`;
    body.appendChild(ov);
    const html=document.documentElement,prevOverflow=html.style.overflow;html.style.overflow='hidden';
    const match=ov.querySelector('.itt-strike__match'),flame=ov.querySelector('.itt-strike__flame'),line=ov.querySelector('.itt-strike__line'),go=ov.querySelector('.itt-strike__go');
    setTimeout(()=>{try{go.focus({preventScroll:true})}catch(e){}},50);

    let struck=false;
    const strike=withSound=>{
      if(struck)return;struck=true;
      ov.classList.add('is-struck');
      if(withSound){Sound.init();Sound.strike();Sound.set(true)}
      line.style.opacity=0;setTimeout(()=>{line.textContent='i told ’em.';line.style.opacity=1},380);
      for(let i=0;i<18;i++){
        const s=document.createElement('i');s.className='itt-spark';
        const a=Math.random()*Math.PI*2,d=40+Math.random()*120;
        s.style.setProperty('--dx',(Math.cos(a)*d).toFixed(1)+'px');s.style.setProperty('--dy',(Math.sin(a)*d-40).toFixed(1)+'px');s.style.setProperty('--d',(.5+Math.random()*.6).toFixed(2)+'s');
        match.appendChild(s);
      }
      const fr=flame.getBoundingClientRect(),x=fr.left+fr.width/2,y=fr.top+fr.height*.6;
      ov.style.setProperty('--gx',x+'px');ov.style.setProperty('--gy',y+'px');
      try{sessionStorage.setItem('itt-lit','1')}catch(e){}
      setTimeout(()=>{
        // The flame's light blooms out and swallows the dark.
        ov.classList.add('is-opening');html.style.overflow=prevOverflow;
        resolve(true);soundToggle();updateSoundToggle();
        setTimeout(()=>{ov.remove();if(window.ScrollTrigger)ScrollTrigger.refresh()},1500);
      },450);
    };
    match.addEventListener('click',()=>strike(true));
    go.addEventListener('click',()=>strike(true));
    ov.querySelector('.itt-strike__quiet').addEventListener('click',()=>strike(false));
    ov.addEventListener('keydown',e=>{if(e.key==='Escape')strike(false)});
    return p;
  })();


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
    const G=window.gsap, ST=window.ScrollTrigger, useGsap=!!(G&&ST);

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
    const shopMedia={type:'image',src:'https://cdn.shopify.com/s/files/1/0735/1320/5802/files/ittHouseGatheringHandDrawnV1.png?v=1789354205',poster:''};
    const flagMedia={type:'image',src:'https://cdn.shopify.com/s/files/1/0735/1320/5802/files/ittFlaglineFieldHandDrawnV1.png?v=1789354209',poster:''};
    const labMedia={type:'image',src:'https://cdn.shopify.com/s/files/1/0735/1320/5802/files/ittLaboratoireMakerHandDrawnV1.png?v=1789354213',poster:''};

    const shopLink=$('a[href]',shop)?.href||'/collections/all';
    const atelierLink=$('a[href]',atelier)?.href||'/pages/contact';
    const worldLinks=$$('.itt-x__worldgrid a[href]',oldWorlds);
    const flagLink=worldLinks.find(a=>/flag/i.test(a.textContent))?.href||'/collections/flagline';
    const labLink=worldLinks.find(a=>/lab/i.test(a.textContent))?.href||'#';

    // Hero headline words — the letters physically rearrange between these.
    const HERO_WORDS=["I TOLD ’EM.","ONE OF ONE.","DÉTROIT.","WE HAIR.","ITT."];

    const worlds=[
      {n:'01',key:'HOUSE',title:HERO_WORDS[0],sub:'MAISON · DÉTROIT — EAST SIDE',media:heroMedia,href:shopLink,cta:'SHOP THE EDIT'},
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
          ${worlds.map((w,i)=>`<article class="itt-world itt-world--${i+1}" id="itt-world-0${i+1}" data-i="${i}"><div class="itt-world__inner">
            <div class="itt-world__bg">${mediaHTML(w.media,i)}</div>
            <div class="itt-world__shade"></div>
            <div class="itt-world__grid"></div>
            <div class="itt-world__candle" aria-hidden="true"></div>
            <div class="itt-world__number">${w.n}</div>
            <div class="itt-world__copy">
              <span>${w.n} / 05 · ${w.key}</span><${i===0?'h1':'h2'}>${w.title}</${i===0?'h1':'h2'}>${i===0?'<em class="itt-whisper" aria-hidden="true"></em>':''}<p>${w.sub}</p>
              <a href="${w.href}" class="itt-world__cta">${w.cta||`ENTER ${w.key}`} <i aria-hidden="true">↗</i></a>
            </div>
            <div class="itt-world__continuum" aria-hidden="true"><i></i><b>${i===0?'BLUEPRINT':i===1?'SEAM':i===2?'FIELD':i===3?'MEASURE':'LASER PATH'}</b></div>
          </div></article>`).join('')}
        </div>
        <canvas class="itt-embers" aria-hidden="true"></canvas>
        <div class="itt-grain" aria-hidden="true"></div>
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
      .itt-megaworld--gsap .itt-world__bg{inset:-6%}
      .itt-world__inner{position:absolute;inset:0;overflow:hidden;will-change:transform}
      .itt-3d .itt-x__film{animation:none!important}
      .itt-world__media{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.62) saturate(.76) contrast(1.08)}
      .itt-world--2 .itt-world__media,.itt-world--3 .itt-world__media,.itt-world--5 .itt-world__media{object-position:center 42%}
      .itt-world__media--empty{background:radial-gradient(circle at 30% 35%,#2a2118 0,#080808 38%,#030303 76%)}
      .itt-world__shade{position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(0,0,0,.82) 0,rgba(0,0,0,.38) 44%,rgba(0,0,0,.12) 70%,rgba(0,0,0,.42) 100%),linear-gradient(180deg,rgba(0,0,0,.48) 0,transparent 28%,transparent 65%,rgba(0,0,0,.72) 100%)}
      .itt-world__grid{position:absolute;inset:0;z-index:2;opacity:.1;background-image:linear-gradient(rgba(201,168,97,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,97,.13) 1px,transparent 1px);background-size:80px 80px;mask-image:linear-gradient(90deg,#000,transparent 62%);-webkit-mask-image:linear-gradient(90deg,#000,transparent 62%)}
      .itt-world__number{position:absolute;right:5vw;top:15vh;z-index:4;font:italic 400 clamp(2.8rem,5vw,5rem)/1 Georgia,serif;color:rgba(245,239,230,.12);letter-spacing:-.05em}
      .itt-world__copy{position:absolute;left:6vw;bottom:17vh;z-index:5;width:min(680px,82vw);transform:translate3d(calc((var(--world-local,0) - .5) * 4vw),0,0);will-change:transform}
      .itt-world__copy>span{display:block;margin-bottom:14px;font:700 8px/1 Arial,sans-serif;letter-spacing:.28em;color:#c9a861}
      .itt-world__copy h1,.itt-world__copy h2{margin:0;max-width:10ch;font:italic 400 clamp(3.8rem,7.2vw,7.4rem)/.82 Georgia,serif;letter-spacing:-.06em;text-transform:uppercase;text-shadow:0 18px 55px rgba(0,0,0,.55)}
      .itt-world__copy h1.itt-hl{position:relative;max-width:none;height:.9em;white-space:nowrap;font-size:clamp(3.2rem,8.6vw,8.4rem)}
      .itt-hl__ch{position:absolute;left:0;top:0;display:inline-block;white-space:pre;will-change:transform,opacity}
      .itt-hl__m{position:absolute;left:0;top:0;visibility:hidden;white-space:pre}
      .itt-hl__sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
      .itt-world__candle{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(circle var(--lr,40vmax) at var(--lx,55%) var(--ly,45%),rgba(4,3,2,0) 0,rgba(4,3,2,.14) 34%,rgba(4,3,2,.58) 68%,rgba(3,2,1,.88) 100%)}
      .itt-world__candle:after{content:'';position:absolute;inset:0;background:radial-gradient(circle calc(var(--lr,40vmax) * .62) at var(--lx,55%) var(--ly,45%),rgba(255,172,88,var(--lg,.16)),transparent 72%);mix-blend-mode:screen}
      .itt-embers{position:absolute;inset:0;width:100%;height:100%;z-index:12;pointer-events:none;mix-blend-mode:screen}
      .itt-grain{position:absolute;inset:-50%;z-index:13;pointer-events:none;opacity:.075;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");animation:ittGrain .8s steps(4) infinite}
      @keyframes ittGrain{0%{transform:translate(0,0)}25%{transform:translate(-5%,3%)}50%{transform:translate(4%,-4%)}75%{transform:translate(-3%,-6%)}100%{transform:translate(0,0)}}
      .itt-whisper{display:block;margin:18px 0 0;min-height:1.3em;font:italic 400 clamp(1.05rem,1.7vw,1.55rem)/1.25 Georgia,serif;letter-spacing:.01em;text-transform:none;color:#d9b779;text-shadow:0 0 26px rgba(255,166,76,.38)}
      .itt-w{display:inline-block;white-space:nowrap}.itt-l{display:inline-block;will-change:transform,opacity,filter}
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
        .itt-world__copy h1.itt-hl{font-size:clamp(2.6rem,10.5vw,6rem)}
      }
      @media(max-width:600px){.itt-megaworld__hud{left:12px;right:12px;grid-template-columns:1fr auto;padding:0 12px}.itt-megaworld__origin{display:none}.itt-megaworld__hud nav{gap:14px}.itt-megaworld__hud nav a{font-size:6px}.itt-megaworld__brand span{display:none}.itt-world__copy{bottom:18vh}.itt-world__copy h1,.itt-world__copy h2{font-size:13vw}.itt-world__copy h1.itt-hl{font-size:11vw}.itt-world__copy p{font-size:6px}.itt-world__number{top:12vh;font-size:13vw}.itt-megaworld__progress span{display:none}.itt-world__grid{background-size:44px 44px}.itt-world--2 .itt-world__media,.itt-world--3 .itt-world__media,.itt-world--5 .itt-world__media{object-position:62% 42%}}
      @media(max-width:600px){.itt-grain{opacity:.06}.itt-whisper{font-size:4.6vw}}
      .itt-flip{cursor:pointer;perspective:1100px;outline:none}
      .itt-flip:focus-visible{box-shadow:0 0 0 2px #c9a861}
      .itt-flip .itt-x__editindex{top:.6rem;left:.6rem}
      .itt-flip__inner{position:relative;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.2,.8,.2,1)}
      .itt-flip.is-flipped .itt-flip__inner{transform:rotateY(180deg)}
      .itt-flip__face{backface-visibility:hidden;-webkit-backface-visibility:hidden}
      .itt-flip__back{position:absolute;inset:0;transform:rotateY(180deg);display:flex;flex-direction:column;gap:.55rem;overflow:auto;padding:1.1rem;background:#0b0907;color:#f5efe6;border:1px solid rgba(201,168,97,.45);box-shadow:inset 0 0 70px rgba(255,160,70,.09);cursor:default}
      .itt-flip__k{font:700 8px/1 Arial,sans-serif;letter-spacing:.28em;color:#c9a861}
      .itt-flip__back h4{margin:0;padding-right:1.6rem;font:italic 400 clamp(1.25rem,1.9vw,1.75rem)/1.02 Georgia,serif;letter-spacing:-.02em;text-transform:none}
      .itt-flip__price{font:600 11px/1 Arial,sans-serif;letter-spacing:.16em}
      .itt-flip__desc{margin:0;font:400 12px/1.5 Arial,sans-serif;color:rgba(245,239,230,.72)}
      .itt-flip__opts{display:flex;flex-wrap:wrap;gap:6px}
      .itt-flip__opts button{border:1px solid rgba(245,239,230,.3);background:transparent;color:#f5efe6;padding:8px 10px;font:600 9px/1 Arial,sans-serif;letter-spacing:.12em;cursor:pointer}
      .itt-flip__opts button[aria-pressed=true]{background:#f5efe6;color:#0b0907}
      .itt-flip__opts button:disabled{opacity:.35;text-decoration:line-through;cursor:not-allowed}
      .itt-flip__add{margin-top:auto;border:0;background:#c9a861;color:#0b0907;padding:14px;font:700 9px/1 Arial,sans-serif;letter-spacing:.26em;cursor:pointer}
      .itt-flip__add:disabled{opacity:.5;cursor:not-allowed}
      .itt-flip__view{color:#f5efe6!important;font:700 8px/1 Arial,sans-serif;letter-spacing:.22em;text-decoration:none!important;padding:6px 0}
      .itt-flip__turn{position:absolute;top:.7rem;right:.7rem;border:0;background:none;color:#c9a861;font:400 20px/1 Georgia,serif;cursor:pointer;padding:4px}
      @media(prefers-reduced-motion:reduce){.itt-grain{animation:none}.itt-embers{display:none}.itt-megaworld{height:auto}.itt-megaworld__sticky{position:relative;height:100svh;overflow-x:auto;scroll-snap-type:x mandatory}.itt-megaworld__track{transform:none!important}.itt-world{scroll-snap-align:start}.itt-world__bg,.itt-world__copy{transform:none!important}}
    `;
    document.head.appendChild(style);

    const sticky=$('.itt-megaworld__sticky',stage), track=$('.itt-megaworld__track',stage), panels=$$('.itt-world',stage), buttons=$$('[data-world-jump]',stage);
    const vids=$$('video',stage); vids.forEach(v=>v.play().catch(()=>{}));

    let current=-1;
    const activate=(idx)=>{
      if(idx===current)return; current=idx;
      buttons.forEach((b,i)=>b.classList.toggle('is-active',i===idx));
      panels.forEach((p,i)=>p.classList.toggle('is-active',i===idx));
      vids.forEach(v=>{const pi=panels.findIndex(p=>p.contains(v)); if(pi===idx)v.play().catch(()=>{}); else v.pause();});
    };

    if(useGsap){
      /* ---------- GSAP: pinned horizontal scrub + depth parallax ---------- */
      G.registerPlugin(ST);
      stage.classList.add('itt-megaworld--gsap');
      const mm=G.matchMedia();

      // Split a heading into letters (words kept together so lines still wrap).
      const splitLetters=h=>{
        if(h.dataset.split)return $$('.itt-l',h);
        const text=h.textContent.trim();h.dataset.split='1';h.textContent='';
        const sr=document.createElement('span');sr.className='itt-hl__sr';sr.textContent=text;h.appendChild(sr);
        text.split(' ').forEach((word,wi)=>{
          if(wi)h.appendChild(document.createTextNode(' '));
          const w=document.createElement('span');w.className='itt-w';w.setAttribute('aria-hidden','true');
          [...word].forEach(c=>{const l=document.createElement('span');l.className='itt-l';l.textContent=c;w.appendChild(l)});
          h.appendChild(w);
        });
        return $$('.itt-l',h);
      };
      const LIT='0 0 30px rgba(255,170,80,.95)',COOL='0 18px 55px rgba(0,0,0,.55)';
      const MEDIA_ON='brightness(.62) saturate(.76) contrast(1.08) blur(0px)',MEDIA_OFF='brightness(.22) saturate(0) contrast(1.35) blur(10px)';
      // Panels 2-5: the photo develops out of the dark, the title ignites letter by letter, then cools.
      const revealPanel=(panel,trig)=>{
        const media=$('.itt-world__media',panel),h=$('h2',panel),copy=$('.itt-world__copy',panel);
        const letters=h?splitLetters(h):[];
        const rest=[...copy.children].filter(el=>el!==h);
        const tl=G.timeline({scrollTrigger:{...trig,toggleActions:'play none none reverse'}});
        if(media)tl.fromTo(media,{filter:MEDIA_OFF},{filter:MEDIA_ON,duration:2.2,ease:'power2.out'},0);
        if(letters.length){
          tl.from(letters,{yPercent:70,opacity:0,filter:'blur(10px)',rotation:()=>G.utils.random(-9,9),duration:1.2,ease:'expo.out',stagger:.035},.15);
          tl.fromTo(letters,{color:'#ffcf7a',textShadow:LIT},{color:'#f5efe6',textShadow:COOL,duration:1.8,ease:'power2.out',stagger:.035},.15);
        }
        tl.from(rest,{y:30,opacity:0,duration:.9,ease:'expo.out',stagger:.12},.45);
        return tl;
      };

      // Each world swings like a heavy door: it turns in from the right, faces you, then turns away.
      const turnPanel=(panel,trig,k=1)=>{
        const inner=$('.itt-world__inner',panel);
        G.timeline({scrollTrigger:trig})
          .fromTo(inner,{rotationY:-34*k,rotationX:4*k,scale:.8,transformPerspective:1500,transformOrigin:'50% 50%'},{rotationY:0,rotationX:0,scale:1,ease:'power1.out',duration:1})
          .to(inner,{rotationY:34*k,rotationX:-4*k,scale:.8,ease:'power1.in',duration:1});
      };

      // Desktop: vertical scroll drives the horizontal track.
      mm.add('(hover:hover) and (min-width:1181px) and (prefers-reduced-motion:no-preference)',()=>{
        const tl=G.to(track,{xPercent:-80,ease:'none',scrollTrigger:{
          trigger:stage,start:'top top',end:'bottom bottom',scrub:.8,invalidateOnRefresh:true,
          onUpdate:s=>activate(Math.min(4,Math.floor(s.progress*5)))
        }});
        panels.forEach((panel,i)=>{
          const bg=$('.itt-world__bg',panel),copy=$('.itt-world__copy',panel),num=$('.itt-world__number',panel),line=$('.itt-world__continuum i',panel);
          const span=()=>({trigger:panel,containerAnimation:tl,start:'left right',end:'right left',scrub:true});
          G.fromTo(bg,{x:'-4vw',scale:1.12},{x:'4vw',scale:1.12,ease:'none',scrollTrigger:span()});
          G.fromTo(copy,{x:'12vw'},{x:'-12vw',ease:'none',scrollTrigger:span()});
          G.fromTo(num,{x:'14vw',y:'-6vh'},{x:'-14vw',y:'6vh',ease:'none',scrollTrigger:span()});
          if(line)G.fromTo(line,{scaleX:0,transformOrigin:'left center'},{scaleX:1,ease:'none',scrollTrigger:{trigger:panel,containerAnimation:tl,start:'left 85%',end:'left 15%',scrub:true}});
          if(i>0)revealPanel(panel,{trigger:panel,containerAnimation:tl,start:'left 60%'});
          turnPanel(panel,span());
        });
        buttons.forEach((b,i)=>b.onclick=()=>{
          const s=tl.scrollTrigger; scrollTo({top:s.start+(s.end-s.start)*(i/4),behavior:'smooth'});
        });
        return ()=>buttons.forEach(b=>b.onclick=null);
      });

      // Phones / tablets: keep native swipe, add parallax + reveals on the horizontal scroller.
      mm.add('(hover:none) and (prefers-reduced-motion:no-preference), (max-width:1180px) and (prefers-reduced-motion:no-preference)',()=>{
        panels.forEach((panel,i)=>{
          const bg=$('.itt-world__bg',panel),copy=$('.itt-world__copy',panel),num=$('.itt-world__number',panel);
          const span=()=>({trigger:panel,scroller:sticky,horizontal:true,start:'left right',end:'right left',scrub:true});
          G.fromTo(bg,{x:'-5vw',scale:1.14},{x:'5vw',scale:1.14,ease:'none',scrollTrigger:span()});
          G.fromTo(num,{x:'18vw'},{x:'-18vw',ease:'none',scrollTrigger:span()});
          if(i>0)revealPanel(panel,{trigger:panel,scroller:sticky,horizontal:true,start:'left 65%'});
          turnPanel(panel,span(),.7);
        });
      });

      addEventListener('load',()=>ST.refresh(),{once:true});
    }else{
      /* ---------- Fallback if GSAP fails to load: original scroll math ---------- */
      let raf=0;
      const draw=()=>{
        raf=0;
        if(prefersReduced()||touchMode())return;
        const r=stage.getBoundingClientRect();
        const max=Math.max(1,stage.offsetHeight-innerHeight);
        const p=clamp(-r.top/max);
        stage.style.setProperty('--mw-p',p.toFixed(5));
        activate(Math.min(4,Math.floor(p*5)));
        panels.forEach((panel,i)=>panel.style.setProperty('--world-local',clamp((p*5)-i,0,1).toFixed(4)));
      };
      const requestDraw=()=>{if(!raf)raf=requestAnimationFrame(draw)};
      addEventListener('scroll',requestDraw,{passive:true}); addEventListener('resize',requestDraw,{passive:true}); requestDraw();
    }

    // Progress buttons (touch / reduced motion / fallback desktop).
    buttons.forEach((b,i)=>b.addEventListener('click',()=>{
      if(touchMode()||prefersReduced()){
        sticky.scrollTo({left:i*innerWidth,behavior:prefersReduced()?'auto':'smooth'});
      }else if(!useGsap){
        const top=scrollY+stage.getBoundingClientRect().top;
        scrollTo({top:top+(i/4)*(stage.offsetHeight-innerHeight),behavior:'smooth'});
      }
    }));

    sticky.addEventListener('scroll',()=>{
      if(!(touchMode()||prefersReduced()))return;
      activate(clamp(Math.round(sticky.scrollLeft/Math.max(1,innerWidth)),0,4));
    },{passive:true});

    activate(0);

    /* ---------- Hero: letters ignite like wicks, travel glowing, and melt like wax ---------- */
    const heroTitle=$('.itt-world--1 .itt-world__copy h1',stage);
    const whisper=$('.itt-world--1 .itt-whisper',stage);
    // Each word gets a handwritten answer underneath it.
    const WHISPERS=["they didn’t believe it.","made once. never again.","east side, every stitch.","the crown is the craft.","write the vision. make it plain."];
    const EMBER='#ffcf7a',BONE='#f5efe6',GLOW='0 0 30px rgba(255,170,80,.95)',SHADE='0 18px 55px rgba(0,0,0,.55)';
    const startHero=()=>{
      if(!heroTitle||!useGsap||prefersReduced()){if(whisper)whisper.textContent=WHISPERS[0];return}
      heroTitle.classList.add('itt-hl');
      heroTitle.textContent='';
      const sr=document.createElement('span');sr.className='itt-hl__sr';heroTitle.appendChild(sr);
      const m=document.createElement('span');m.className='itt-hl__m';m.setAttribute('aria-hidden','true');heroTitle.appendChild(m);
      let live=[],wi=0;
      const layout=w=>{
        m.innerHTML='';const cs=[...w];
        cs.forEach(c=>{const s=document.createElement('span');s.textContent=c;m.appendChild(s)});
        const b=m.getBoundingClientRect().left;
        return [...m.children].map((s,i)=>({ch:cs[i],x:s.getBoundingClientRect().left-b})).filter(t=>t.ch!==' ');
      };
      // The whisper is "handwritten": it unveils left to right like a pen stroke.
      const write=text=>{
        if(!whisper)return;
        G.to(whisper,{opacity:0,y:-8,filter:'blur(4px)',duration:.6,ease:'power2.in',onComplete:()=>{
          whisper.textContent=text;
          G.fromTo(whisper,{opacity:1,y:0,filter:'blur(0px)',clipPath:'inset(-20% 100% -20% 0%)'},{clipPath:'inset(-20% 0% -20% 0%)',duration:2.4,ease:'power1.inOut'});
        }});
      };
      const set=(w,first)=>{
        sr.textContent=w;
        const T=layout(w),pool=[...live],next=[];
        T.forEach((t,j)=>{
          const k=pool.findIndex(p=>p.ch===t.ch);let L;
          if(k>-1){
            // A letter both words share: it lifts, glows, and walks to its new place.
            L=pool.splice(k,1)[0];
            G.killTweensOf(L.el);
            G.timeline({delay:j*.05})
              .to(L.el,{y:'-0.16em',color:EMBER,textShadow:GLOW,duration:.55,ease:'power2.out'})
              .to(L.el,{x:t.x,duration:1.7,ease:'expo.inOut'},'<.1')
              .to(L.el,{y:0,color:BONE,textShadow:SHADE,duration:1.5,ease:'power2.inOut'},'-=.9');
          }else{
            // A new letter catches like a wick: ember-gold and blurred, then cools to bone.
            const el=document.createElement('span');el.className='itt-hl__ch';el.setAttribute('aria-hidden','true');el.textContent=t.ch;heroTitle.appendChild(el);
            G.timeline({delay:(first?.9:1.1)+j*.09})
              .fromTo(el,{x:t.x,y:'.35em',opacity:0,scale:.86,filter:'blur(14px)',color:EMBER,textShadow:GLOW},
                         {y:0,opacity:1,scale:1,filter:'blur(0px)',duration:1.4,ease:'expo.out'})
              .to(el,{color:BONE,textShadow:SHADE,duration:2.4,ease:'power2.out'},'-=.8');
            L={el,ch:t.ch};
          }
          L.x=t.x;next.push(L);
        });
        // Letters the next word doesn't need flare once, then melt and drip away like wax.
        pool.forEach((p,j)=>{
          G.killTweensOf(p.el);
          G.timeline({delay:j*.07})
            .set(p.el,{transformOrigin:'50% 0%'})
            .to(p.el,{color:EMBER,textShadow:GLOW,duration:.35,ease:'power1.out'})
            .to(p.el,{scaleY:2.2,scaleX:.72,y:'.95em',opacity:0,filter:'blur(5px)',duration:1.6,ease:'power3.in',onComplete:()=>p.el.remove()},'<.15');
        });
        live=next;
      };
      set(HERO_WORDS[0],true);
      G.delayedCall(2.2,()=>write(WHISPERS[0]));
      setInterval(()=>{
        if(current!==0||document.hidden)return;
        wi=(wi+1)%HERO_WORDS.length;
        set(HERO_WORDS[wi]);
        G.delayedCall(1.4,()=>write(WHISPERS[wi]));
      },6200);
      let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{
        const T=layout(HERO_WORDS[wi]);live.forEach((L,j)=>{if(T[j]){L.x=T[j].x;G.set(L.el,{x:L.x})}});
      },150)});
    };

    /* ---------- Atmosphere: you carry the candle; embers rise; the room breathes ---------- */
    const startAtmosphere=()=>{
      if(!useGsap||prefersReduced())return;
      const openMedia=$('.itt-world--1 .itt-world__media',stage);
      if(openMedia){
        // The opening photo develops out of the dark, then breathes slowly.
        G.set(openMedia,{filter:'brightness(.22) saturate(0) contrast(1.35) blur(10px)'});
        entered.then(()=>G.to(openMedia,{filter:'brightness(.62) saturate(.76) contrast(1.08) blur(0px)',duration:3.2,ease:'power2.out'}));
        G.to(openMedia,{scale:1.06,duration:7,ease:'sine.inOut',yoyo:true,repeat:-1});
      }
      // Candlelight follows the cursor or finger; when left alone it wanders on its own.
      let tx=innerWidth*.56,ty=innerHeight*.45,cx=tx,cy=ty,lastMove=-1e9;
      const moved=(x,y)=>{tx=x;ty=y;lastMove=performance.now()};
      addEventListener('pointermove',e=>moved(e.clientX,e.clientY),{passive:true});
      addEventListener('touchmove',e=>{const t=e.touches[0];if(t)moved(t.clientX,t.clientY)},{passive:true});
      const light={bloom:.12};
      entered.then(()=>G.to(light,{bloom:1,duration:3.4,ease:'power2.out',delay:.1}));
      const baseR=()=>Math.max(innerWidth,innerHeight)*(innerWidth<700?.62:.42);
      // Embers drifting up through the dark; scrolling fans them.
      const cv=$('.itt-embers',stage),ctx=cv&&cv.getContext('2d');
      let W=0,H=0;const dpr=Math.min(devicePixelRatio||1,1.5);
      const size=()=>{if(!ctx)return;W=sticky.clientWidth;H=sticky.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
      size();addEventListener('resize',size);
      const mk=fresh=>({x:Math.random()*W,y:fresh?H+10:Math.random()*H,r:.6+Math.random()*1.8,v:.25+Math.random()*.7,ph:Math.random()*6.283,life:fresh?0:Math.random()*200,max:300+Math.random()*500});
      const parts=Array.from({length:innerWidth<700?26:48},()=>mk(false));
      let boost=0;const fan=n=>{boost=Math.min(6,boost+n)};
      addEventListener('wheel',e=>fan(Math.abs(e.deltaY)*.01),{passive:true});
      addEventListener('scroll',()=>fan(.4),{passive:true});
      sticky.addEventListener('scroll',()=>fan(.6),{passive:true});
      entered.then(()=>G.ticker.add(time=>{
        const r=stage.getBoundingClientRect();
        if(r.bottom<0||r.top>innerHeight)return;
        if(performance.now()-lastMove>2600){tx=innerWidth*(.55+Math.sin(time*.35)*.22);ty=innerHeight*(.45+Math.cos(time*.27)*.14)}
        cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;
        {
          const flicker=1+Math.sin(time*11)*.012+Math.sin(time*23.7)*.008+(Math.random()-.5)*.02;
          const lx=cx.toFixed(1)+'px',ly=cy.toFixed(1)+'px',lr=(baseR()*flicker*light.bloom).toFixed(1)+'px',lg=(.14+Math.random()*.05).toFixed(3);
          // Only repaint the light on the panel in view and its neighbours.
          const c=Math.max(0,current);
          for(let k=c-1;k<=c+1;k++){const el=panels[k];if(!el)continue;const st=el.style;st.setProperty('--lx',lx);st.setProperty('--ly',ly);st.setProperty('--lr',lr);st.setProperty('--lg',lg)}
        }
        if(!ctx)return;
        boost*=.94;
        ctx.clearRect(0,0,W,H);
        for(const p of parts){
          p.life++;p.y-=p.v*(1+boost);p.x+=Math.sin(time*1.3+p.ph)*.35+(cx-p.x)*.0005;
          if(p.y<-10||p.life>p.max)Object.assign(p,mk(true));
          const a=Math.min(1,p.life/40)*Math.max(0,1-p.life/p.max),R=p.r*4;
          const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,R);
          g.addColorStop(0,`rgba(255,214,140,${(.9*a).toFixed(3)})`);g.addColorStop(.4,`rgba(255,150,60,${(.35*a).toFixed(3)})`);g.addColorStop(1,'rgba(255,120,40,0)');
          ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,R,0,6.283);ctx.fill();
        }
      }));
    };

    startAtmosphere();
    if(useGsap)entered.then(()=>setTimeout(()=>start3D(root),700));
    Promise.all([document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve(),entered]).then(startHero);
  }

  /* ================= 3D all the way down: things turn in from depth, face you, then spin out ================= */
  function start3D(root){
    const G=window.gsap;
    if(!G||root.dataset.itt3d)return;
    root.dataset.itt3d='1';
    root.classList.add('itt-3d');
    const P=1200;

    // Break a heading into letters, keeping line breaks and spaces.
    const splitDeep=el=>{
      if(el.dataset.split3d)return $$('.itt-3l',el);
      el.dataset.split3d='1';
      el.setAttribute('aria-label',el.textContent.split(String.fromCharCode(10)).join(' ').trim());
      [...el.childNodes].forEach(node=>{
        if(node.nodeType!==3)return;
        const frag=document.createDocumentFragment();
        node.textContent.split(String.fromCharCode(10)).join(' ').split(' ').forEach((part,k)=>{
          if(k)frag.appendChild(document.createTextNode(' '));
          if(!part)return;
          const w=document.createElement('span');w.style.cssText='display:inline-block;white-space:nowrap';w.setAttribute('aria-hidden','true');
          [...part].forEach(c=>{const l=document.createElement('span');l.className='itt-3l';l.style.display='inline-block';l.textContent=c;w.appendChild(l)});
          frag.appendChild(w);
        });
        node.replaceWith(frag);
      });
      return $$('.itt-3l',el);
    };

    // Headline letters flip up out of the floor on the way in, and spin away on the way out.
    const flipHeading=(h,exitTrig)=>{
      if(!h)return;
      const L=splitDeep(h);
      G.set(L,{transformPerspective:700,transformOrigin:'50% 100% -0.3em'});
      const IN={rotationX:-100,opacity:0,y:'.2em'},HOME={rotationX:0,opacity:1,y:0,ease:'power3.out',stagger:{each:.04,from:'start'}};
      const OUT={rotationY:()=>G.utils.random(-140,140),rotationX:()=>G.utils.random(-60,60),z:()=>G.utils.random(100,420),opacity:0,ease:'power2.in',stagger:{each:.025,from:'random'}};
      if(exitTrig){
        G.fromTo(L,IN,{...HOME,scrollTrigger:{trigger:h,start:'top 92%',end:'top 45%',scrub:1}});
        G.to(L,{...OUT,scrollTrigger:exitTrig});
      }else{
        // One timeline from entering the screen to leaving it: flip in, hold, spin out.
        G.timeline({scrollTrigger:{trigger:h,start:'top 92%',end:'top -30%',scrub:1}})
          .fromTo(L,IN,{...HOME,duration:30,stagger:{amount:17,from:'start'}})
          .to(L,{...OUT,duration:30,stagger:{amount:18,from:'random'}},'+=27');
      }
    };

    // Turn a product link into a two-sided card. Front: the photo. Back: the details and the bag.
    const money=cents=>{
      let cur='USD';try{cur=(window.Shopify&&Shopify.currency&&Shopify.currency.active)||'USD'}catch(e){}
      try{return new Intl.NumberFormat(undefined,{style:'currency',currency:cur}).format(cents/100)}catch(e){return '$'+(cents/100).toFixed(2)}
    };
    const addUrl=()=>{try{if(typeof Theme!=='undefined'&&Theme.routes&&Theme.routes.cart_add_url)return Theme.routes.cart_add_url}catch(e){}return '/cart/add.js'};
    const buildFlipCard=link=>{
      if(link.classList.contains('itt-flip'))return link;
      const href=link.getAttribute('href')||'#';
      const card=document.createElement('div');
      card.className=link.className+' itt-flip';card.setAttribute('role','listitem');card.tabIndex=0;card.setAttribute('aria-expanded','false');
      const inner=document.createElement('div');inner.className='itt-flip__inner';
      const front=document.createElement('div');front.className='itt-flip__face itt-flip__front';
      while(link.firstChild)front.appendChild(link.firstChild);
      const title=($('h3',front)||{}).textContent||'',price=($('.itt-x__price',front)||{}).textContent||'';
      const hint=$('.itt-x__shopcta',front);if(hint)hint.textContent='TAP TO TURN OVER ↻';
      card.setAttribute('aria-label',(title+', '+price+'. Press Enter to turn the card over.').trim());
      const back=document.createElement('div');back.className='itt-flip__face itt-flip__back';
      back.innerHTML='<span class="itt-flip__k">THE PIECE</span><h4></h4><b class="itt-flip__price"></b><p class="itt-flip__desc">Pulling the details…</p><div class="itt-flip__opts" role="group" aria-label="Choose an option"></div><button type="button" class="itt-flip__add" disabled>ONE MOMENT…</button><a class="itt-flip__view">VIEW THE PIECE →</a><button type="button" class="itt-flip__turn" aria-label="Turn the card back over">↺</button>';
      $('h4',back).textContent=title.trim();
      const priceEl=$('.itt-flip__price',back);priceEl.textContent=price.trim();
      const desc=$('.itt-flip__desc',back),opts=$('.itt-flip__opts',back),add=$('.itt-flip__add',back),view=$('.itt-flip__view',back);
      view.href=href;
      inner.append(front,back);card.appendChild(inner);link.replaceWith(card);

      let loaded=false,variantId=null;
      const load=()=>{
        if(loaded)return;loaded=true;
        fetch(href.split('?')[0]+'.js',{headers:{Accept:'application/json'}}).then(r=>{if(!r.ok)throw 0;return r.json()}).then(p=>{
          const raw=new DOMParser().parseFromString(p.description||'','text/html').body.textContent||'';
          const txt=raw.split(String.fromCharCode(10)).join(' ').split(' ').filter(Boolean).join(' ');
          desc.textContent=txt.length>130?txt.slice(0,127).trim()+'…':txt;
          const vs=p.variants||[];
          if(vs.length>1){
            add.textContent='CHOOSE AN OPTION';
            vs.forEach(v=>{
              const b=document.createElement('button');b.type='button';b.textContent=v.title;b.disabled=!v.available;b.setAttribute('aria-pressed','false');
              b.addEventListener('click',e=>{
                e.stopPropagation();$$('button',opts).forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');
                variantId=v.id;priceEl.textContent=money(v.price);add.disabled=false;add.textContent='ADD TO BAG';Sound.flick();
              });
              opts.appendChild(b);
            });
            if(!vs.some(v=>v.available))add.textContent='SOLD OUT';
          }else if(vs[0]){
            if(vs[0].available){variantId=vs[0].id;add.disabled=false;add.textContent='ADD TO BAG'}else add.textContent='SOLD OUT';
          }
        }).catch(()=>{desc.textContent='';add.textContent='SEE THE PIECE FOR DETAILS'});
      };
      add.addEventListener('click',e=>{
        e.stopPropagation();if(!variantId)return;
        add.disabled=true;add.textContent='ADDING…';
        fetch(addUrl(),{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({items:[{id:variantId,quantity:1}]})})
          .then(r=>{if(!r.ok)throw 0;return r.json()})
          .then(()=>{
            add.textContent='IN YOUR BAG ✓';view.textContent='OPEN THE BAG →';view.href='/cart';Sound.flick();
            setTimeout(()=>{add.disabled=false;add.textContent='ADD ANOTHER'},2400);
          })
          .catch(()=>{add.disabled=false;add.textContent='TRY AGAIN'});
      });
      const flip=to=>{
        const f=typeof to==='boolean'?to:!card.classList.contains('is-flipped');
        card.classList.toggle('is-flipped',f);card.setAttribute('aria-expanded',f?'true':'false');
        if(f)load();Sound.flick();
      };
      card.addEventListener('pointerenter',load,{once:true});
      card.addEventListener('click',e=>{
        if(e.target.closest('.itt-flip__turn')){e.stopPropagation();flip(false);return}
        if(card.classList.contains('is-flipped'))return;
        flip(true);
      });
      card.addEventListener('keydown',e=>{
        if(e.target!==card)return;
        if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}
        if(e.key==='Escape')flip(false);
      });
      return card;
    };

    const mm=G.matchMedia();
    mm.add('(prefers-reduced-motion:no-preference)',()=>{
      const small=innerWidth<700;

      /* --- 02 · The edit: cards rise from the deep, face the buyer and stay, then spin out once they're nearly gone.
             Tap a card and it turns over: details, sizes and add-to-bag live on the back. --- */
      const shop=$('.itt-x__commerce',root);
      if(shop){
        flipHeading($('.itt-x__shophead h2',shop));
        const rail=$('.itt-x__editrail',shop);
        const cards=$$('.itt-x__editcard',shop).map(buildFlipCard);
        cards.forEach((card,i)=>{
          const dir=i%2?1:-1;
          G.timeline({scrollTrigger:{trigger:rail||card,start:'top bottom',end:'bottom top',scrub:1}})
            .fromTo(card,{rotationX:62,rotationY:dir*-18,z:-520,y:120,opacity:0,transformPerspective:P,transformOrigin:'50% 100%'},
                         {rotationX:0,rotationY:0,z:0,y:0,opacity:1,ease:'power3.out',duration:1},i*.12)
            .to(card,{rotationY:dir*4,duration:2.4,ease:'none'})
            .to(card,{rotationY:dir*(small?100:160),rotationZ:dir*12,x:dir*(small?18:30)+'vw',z:300,opacity:0,ease:'power2.in',duration:1});
        });
        // Desktop hover: the photo tilts toward the cursor like a held print.
        if(matchMedia('(hover:hover)').matches){
          cards.forEach(card=>{
            const media=$('.itt-x__editmedia',card);if(!media)return;
            G.set(media,{transformPerspective:900});
            const rx=G.quickTo(media,'rotationX',{duration:.6,ease:'power3'}),ry=G.quickTo(media,'rotationY',{duration:.6,ease:'power3'});
            card.addEventListener('pointermove',e=>{if(card.classList.contains('is-flipped'))return;const r=card.getBoundingClientRect();ry(((e.clientX-r.left)/r.width-.5)*22);rx(-((e.clientY-r.top)/r.height-.5)*16)});
            card.addEventListener('pointerleave',()=>{rx(0);ry(0)});
          });
        }
      }

      /* --- 03 · The work: the films swing in from the dark like hung canvases, then tumble out --- */
      const proc=$('.itt-x__process',root);
      if(proc){
        flipHeading($('.itt-x__processTitle',proc),{trigger:proc,start:'bottom 85%',end:'bottom 15%',scrub:1});
        const ghost=$('.itt-x__ghost',proc);
        if(ghost)G.fromTo(ghost,{rotationY:-90,transformPerspective:1600},{rotationY:450,ease:'none',scrollTrigger:{trigger:proc,start:'top bottom',end:'bottom top',scrub:1.5}});
        $$('.itt-x__film',proc).forEach((film,i)=>{
          const dir=[1,-1,1][i]||1;
          G.timeline({scrollTrigger:{trigger:proc,start:'top 90%',end:'bottom top',scrub:1.2}})
            .fromTo(film,{rotationY:dir*70,rotationX:22,z:-800,opacity:0,transformPerspective:P},
                         {rotationY:dir*10,rotationX:0,z:0,opacity:1,ease:'power3.out',duration:1})
            .to(film,{rotationY:-dir*12,rotationZ:dir*-3,ease:'none',duration:1.2})
            .to(film,{rotationY:-dir*130,rotationX:-30,rotationZ:dir*18,z:600,opacity:0,ease:'power2.in',duration:1});
        });
        const line=$('.itt-x__line',proc);
        if(line)G.fromTo(line,{scaleX:0,rotationZ:-24},{scaleX:1,rotationZ:-8,ease:'none',scrollTrigger:{trigger:proc,start:'top 70%',end:'center center',scrub:1}});
      }

      /* --- 04 · L'Atelier: the photograph turns toward you like a page, then folds away --- */
      const at=$('.itt-x__atelier',root);
      if(at){
        flipHeading($('.itt-x__atelierCopy h2',at));
        const img=$('.itt-x__atelierImage',at);
        if(img)G.timeline({scrollTrigger:{trigger:at,start:'top bottom',end:'bottom top',scrub:1}})
          .fromTo(img,{rotationY:-58,rotationX:10,z:-500,opacity:.2,transformPerspective:P,transformOrigin:'100% 50%'},{rotationY:0,rotationX:0,z:0,opacity:1,ease:'power3.out',duration:1})
          .to(img,{rotationY:4,duration:.6,ease:'none'})
          .to(img,{rotationY:72,rotationX:-12,z:-300,opacity:0,ease:'power2.in',duration:1});
        const rest=$$('.itt-x__atelierCopy > :not(h2)',at);
        G.from(rest,{rotationX:-70,y:40,opacity:0,transformPerspective:800,transformOrigin:'50% 0%',stagger:.12,ease:'power3.out',
          scrollTrigger:{trigger:at,start:'top 70%',end:'top 25%',scrub:1}});
      }

      /* --- The house closes: the footer folds up from the floor --- */
      const foot=document.querySelector('.page-wrapper > footer');
      if(foot)G.fromTo(foot,{rotationX:-62,opacity:.2,transformPerspective:1400,transformOrigin:'50% 0%'},{rotationX:0,opacity:1,ease:'power2.out',
        scrollTrigger:{trigger:foot,start:'top bottom',end:'top 55%',scrub:1}});
    });

    /* --- Alive: sparks fly off your finger or cursor anywhere on the page --- */
    (()=>{
      if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.querySelector('.itt-sparks'))return;
      const cv=document.createElement('canvas');cv.className='itt-sparks';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
      const ctx=cv.getContext('2d');if(!ctx)return;
      let W=0,H=0;const dpr=Math.min(devicePixelRatio||1,1.5);
      const size=()=>{W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
      size();addEventListener('resize',size);
      const sparks=[],MAX=innerWidth<700?90:160;let lx=-1,ly=-1,clean=true;
      const burst=(x,y,count,speed)=>{
        for(let i=0;i<count&&sparks.length<MAX;i++){
          const a=Math.random()*6.283,v=(.4+Math.random())*speed;
          sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.4,life:0,max:38+Math.random()*52,r:.7+Math.random()*1.8});
        }
      };
      const trail=(x,y)=>{const d=lx<0?0:Math.hypot(x-lx,y-ly);lx=x;ly=y;if(d>5)burst(x,y,Math.min(4,1+(d/28|0)),1.2)};
      addEventListener('pointerdown',e=>{burst(e.clientX,e.clientY,16,3.4);lx=e.clientX;ly=e.clientY},{passive:true});
      addEventListener('pointermove',e=>trail(e.clientX,e.clientY),{passive:true});
      addEventListener('touchmove',e=>{const t=e.touches[0];if(t)trail(t.clientX,t.clientY)},{passive:true});
      addEventListener('touchend',()=>{lx=-1},{passive:true});
      G.ticker.add(()=>{
        if(!sparks.length){if(!clean){ctx.clearRect(0,0,W,H);clean=true}return}
        clean=false;ctx.clearRect(0,0,W,H);
        for(let i=sparks.length-1;i>=0;i--){
          const p=sparks[i];p.life++;p.vy+=.035;p.vx*=.975;p.vy*=.975;p.x+=p.vx;p.y+=p.vy;
          const a=1-p.life/p.max;if(a<=0){sparks.splice(i,1);continue}
          const R=p.r*3.6,g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,R);
          g.addColorStop(0,`rgba(255,228,165,${a.toFixed(3)})`);g.addColorStop(.45,`rgba(255,150,60,${(a*.5).toFixed(3)})`);g.addColorStop(1,'rgba(255,120,40,0)');
          ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,R,0,6.283);ctx.fill();
        }
      });
    })();

    /* --- Alive: the page bends with your scroll speed, and the falling letters rush when you move fast --- */
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&window.ScrollTrigger){
      const bend=[...$$('.itt-x__shophead',root),...$$('.itt-x__editrail',root),...$$('.itt-x__atelierCopy',root),...$$('.itt-x__processTitle',root)];
      const skew=bend.map(el=>G.quickTo(el,'skewY',{duration:.6,ease:'power3'}));
      let vel=0,falling=[],lastRate=1,tick=0;
      ScrollTrigger.create({onUpdate:st=>{vel=st.getVelocity()}});
      const findFalling=()=>{try{falling=document.getAnimations().filter(a=>a.animationName==='ittOverlayFall'||a.animationName==='houseRain')}catch(e){falling=[]}};
      setTimeout(findFalling,1200);
      G.ticker.add(()=>{
        vel*=.9;
        const v=G.utils.clamp(-6,6,vel/-320);
        skew.forEach(f=>f(v));
        if(++tick%3)return;
        const rate=1+Math.min(4,Math.abs(vel)/700);
        if(Math.abs(rate-lastRate)>.05){lastRate=rate;falling.forEach(a=>{try{a.playbackRate=rate}catch(e){}})}
      });
    }

    /* --- Alive: product photos float gently, like they're hanging in the room --- */
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      $$('.itt-x__editmedia img',root).forEach((img,i)=>{
        G.to(img,{y:-9,rotation:(i%2?1:-1)*.9,duration:2.6+i*.37,ease:'sine.inOut',yoyo:true,repeat:-1,delay:i*.3});
      });
    }

    addEventListener('load',()=>window.ScrollTrigger&&ScrollTrigger.refresh(),{once:true});
  }

  // Load GSAP + ScrollTrigger (homepage only, since this file only loads there).
  // If the CDN fails or is slow, boot anyway with the non-GSAP fallback.
  const GSAP_CDN='https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/';
  const loadScript=src=>new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=res;s.onerror=rej;document.head.appendChild(s)});
  const loadGsap=()=>window.gsap&&window.ScrollTrigger?Promise.resolve():
    Promise.race([
      loadScript(GSAP_CDN+'gsap.min.js').then(()=>loadScript(GSAP_CDN+'ScrollTrigger.min.js')),
      new Promise(r=>setTimeout(r,2500))
    ]).catch(()=>{});
  let booted=false;
  const start=()=>{if(booted)return;booted=true;boot()};
  const ready=()=>loadGsap().then(start,start);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  document.addEventListener('shopify:section:load',()=>loadGsap().then(boot,boot));
})();
