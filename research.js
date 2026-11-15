/* Remove the accidental duplicate projects inside the banner caption.
   This must run before the animation collects the project sections. */
const researchBannerNote = document.querySelector(".rs-hero-note");

if (researchBannerNote) {
  researchBannerNote.textContent = "SMALL PARTICLES. VAST QUESTIONS.";
}
(() => {
'use strict';
const fallback=JSON.parse(document.getElementById('rs-fallback').textContent);
const articles = [
  ...document.querySelectorAll(".rs-projects > .rs-project")
];
let data=fallback;
function apply(d){
 if(!d.projects || d.projects.length!==5) return;
 data=d;
 const b=d.banner;
 if(b){document.querySelector('.rs-hero h1').textContent=b.title;document.querySelector('.rs-tagline').textContent=b.tagline;
 if(b.image){const u=new URL(b.image,location.href);if(['http:','https:','file:'].includes(u.protocol))document.querySelector('.rs-hero').style.backgroundImage=`linear-gradient(90deg,#111714e6,#11171480 48%,#1117140d),linear-gradient(0deg,#111714,transparent 45%),url(${JSON.stringify(u.href)})`;}
 document.querySelector('.rs-hero').style.backgroundPosition=b.position||'center';}
 d.projects.forEach((p,i)=>{const a=articles[i];a.querySelector('h2').textContent=p.title;a.querySelector('.rs-description').textContent=p.description;a.querySelector('.rs-institution').textContent=p.institution||'';a.querySelector('.rs-date').textContent=p.date||'';a.querySelector('.rs-eyebrow').textContent=`0${i+1} / ${p.label}`;const links=a.querySelector('.rs-links');links.replaceChildren();if(p.url){try{const u=new URL(p.url);if(['https:','http:'].includes(u.protocol)){const link=document.createElement('a');link.href=u.href;link.target='_blank';link.rel='noopener noreferrer';link.className='rs-publication';link.textContent=(p.linkLabel||'View publication')+' ↗';links.append(link);}}catch{}}});
}
fetch('research-data.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(apply).catch(()=>{});
document.getElementById('rs-year').textContent=new Date().getFullYear();
const canvas=document.getElementById('rs-canvas'),ctx=canvas.getContext('2d');
if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let W=500,H=500,dirty=true,visible=true,position=0,frame=0;
const dots=[...document.querySelectorAll('.rs-dots a')];
const rand=n=>{const x=Math.sin(n*127.1+31.7)*43758.5453;return x-Math.floor(x)};
const N=460;
const particles=Array.from({length:N},(_,i)=>({u:rand(i+1),v:rand(i+1000),z:rand(i+3000)}));
function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*d);canvas.height=Math.round(H*d);ctx.setTransform(d,0,0,d,0,0);dirty=true;}
new ResizeObserver(resize).observe(canvas);
new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)dirty=true;},{rootMargin:'100px'}).observe(canvas);
addEventListener('scroll',()=>dirty=true,{passive:true});addEventListener('resize',()=>dirty=true,{passive:true});reduced.addEventListener('change',()=>dirty=true);
const lerp=(a,b,t)=>a+(b-a)*t;
function target(){const mobile=innerWidth<=650;const anchor=mobile?innerHeight*.72:innerHeight*.54;const centers=articles.map(a=>{const r=a.getBoundingClientRect();return r.top+r.height*.5});if(anchor<=centers[0])return 0;for(let i=0;i<4;i++)if(anchor<=centers[i+1])return i+(anchor-centers[i])/(centers[i+1]-centers[i]);return 4;}
function point(s,p,t,i){const a=p.u*Math.PI*2,r=Math.sqrt(p.v);switch(s){
case 0:{const cluster=i%13;const cx=(rand(cluster+50)-.5)*1.05,cy=(rand(cluster+85)-.5)*.78;const k=i%3;return[cx+Math.cos(t*.35+cluster+k*2.094)*.045,cy+Math.sin(t*.35+cluster+k*2.094)*.045];}
case 1:{const rr=.355+p.v*.15;return[Math.cos(a+t*.13)*rr,Math.sin(a+t*.13)*rr*.94];}
case 2:{const x=(p.u-.5)*1.5;const branch=i%3-1;const y=Math.sin(x*4+branch)*.12+branch*.19;const squeeze=.72+.13*Math.sin(t*.3);return[x*squeeze,y+(p.v-.5)*.075];}
case 3:{const rr=.06+r*.61;const aa=a*.13+(i%3)*Math.PI*2/3+rr*7+t*.1;return[Math.cos(aa)*rr,Math.sin(aa)*rr*.53];}
default:{const rr=r*.36;return[Math.cos(a+t*.035)*rr,Math.sin(a+t*.035)*rr];}
}}
function line(points,color,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function scene(s,alpha,t,cx,cy,R){if(alpha<.001)return;ctx.save();ctx.globalAlpha=alpha;ctx.translate(cx,cy);
if(s===0){ctx.strokeStyle='#cad9a955';ctx.lineWidth=1;const w=R*1.3,h=R*.94,off=R*.13;ctx.strokeRect(-w/2,-h/2,w,h);ctx.strokeRect(-w/2+off,-h/2-off,w,h);for(const [x,y] of [[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]])line([[x,y],[x+off,y-off]],'#cad9a955');for(let j=0;j<4;j++){const y=(-.35+j*.23)*R;line([[-.82*R,y],[-.71*R,y]],'#cad9a955');}ctx.fillStyle='#a8b1a7';ctx.font='9px sans-serif';ctx.fillText('',-w/2,h/2+32);}
if(s===1){const r=R*.35;const g=ctx.createRadialGradient(-r*.4,-r*.4,0,0,0,r);g.addColorStop(0,'#b99d76');g.addColorStop(.4,'#80624e');g.addColorStop(1,'#18211d');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e6c3a46a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*1.06,0,Math.PI*2);ctx.stroke();ctx.save();ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.clip();for(let j=-3;j<4;j++)line([[-r,(j*.17)*r],[r,(j*.17+.13)*r]],'#e8c69918',9);ctx.restore();}
if(s===2){for(let j=-1;j<=1;j++){ctx.beginPath();for(let k=0;k<=80;k++){const x=(k/80-.5)*1.25*R,y=(Math.sin(x/R*4+j)*.12+j*.19)*R;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#cad9a914';ctx.lineWidth=16;ctx.stroke();ctx.strokeStyle='#cad9a950';ctx.lineWidth=1;ctx.stroke();}}
if(s===3){ctx.save();ctx.scale(1,.75);const halo=ctx.createRadialGradient(0,0,R*.1,0,0,R*.82);halo.addColorStop(0,'#afbbdf0a');halo.addColorStop(.55,'#9baad22e');halo.addColorStop(1,'#8f9cc500');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,R*.82,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#b0bdd525';ctx.setLineDash([3,7]);ctx.beginPath();ctx.arc(0,0,R*.7,0,Math.PI*2);ctx.stroke();ctx.restore();const g=ctx.createRadialGradient(0,0,0,0,0,R*.16);g.addColorStop(0,'#f2e6bbcc');g.addColorStop(1,'#cad9a900');ctx.fillStyle=g;ctx.fillRect(-R*.16,-R*.16,R*.32,R*.32);}
if(s===4){const r=R*.36;const glow=ctx.createRadialGradient(0,0,r*.5,0,0,r*1.65);glow.addColorStop(0,'#edb66355');glow.addColorStop(1,'#ec9e4900');ctx.fillStyle=glow;ctx.fillRect(-r*1.7,-r*1.7,r*3.4,r*3.4);const g=ctx.createRadialGradient(-r*.3,-r*.3,0,0,0,r);g.addColorStop(0,'#f4cf7c');g.addColorStop(.7,'#d88b43');g.addColorStop(1,'#99552d');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();for(let j=0;j<9;j++){const a=j*.69+t*.025,x=Math.cos(a)*r*.77,y=Math.sin(a)*r*.77;ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI/2);ctx.beginPath();ctx.ellipse(0,-r*.16,r*.09,r*(.23+.04*Math.sin(t+j)),0,0,Math.PI*2);ctx.strokeStyle='#ffe4a28c';ctx.lineWidth=1.2;ctx.stroke();ctx.restore();}}
ctx.restore();}
function render(ms){requestAnimationFrame(render);if(!visible||document.hidden)return;if(!dirty&&reduced.matches)return;if(!reduced.matches&&ms-frame<32)return;frame=ms;
position=target();const index=Math.round(position),lo=Math.floor(position),hi=Math.min(4,lo+1);let f=position-lo;f=f*f*(3-2*f);if(reduced.matches){position=index;f=0;}
const a=reduced.matches?index:lo,b=reduced.matches?index:hi,t=reduced.matches?0:ms/1000;
ctx.clearRect(0,0,W,H);const cx=W/2,cy=H*.5,R=Math.min(W*.69,H*.76);
ctx.fillStyle='#cad9a9';for(let i=0;i<55;i++){ctx.globalAlpha=.06+rand(i+500)*.13;ctx.fillRect(rand(i+600)*W,rand(i+700)*H,1,1);}ctx.globalAlpha=1;
scene(a,1-f,t,cx,cy,R);if(a!==b)scene(b,f,t,cx,cy,R);
particles.forEach((p,i)=>{const p0=point(a,p,t,i),p1=point(b,p,t,i);const x=cx+lerp(p0[0],p1[0],f)*R,y=cy+lerp(p0[1],p1[1],f)*R;ctx.beginPath();ctx.arc(x,y, a===0&&b===0?2.4: .6+p.z*1.3,0,Math.PI*2);ctx.fillStyle=index===4?'#ffe0a1':index===1?'#e5c9a6':'#cad9a9';ctx.globalAlpha=.25+p.z*.65;ctx.fill();});ctx.globalAlpha=1;
document.getElementById('rs-scene-number').textContent=`0${index+1} / 05`;document.getElementById('rs-scene-label').textContent=data.projects[index].label;dots.forEach((d,i)=>{d.classList.toggle('is-active',i===index);if(i===index)d.setAttribute('aria-current','step');else d.removeAttribute('aria-current');});document.querySelector('.rs-progress span').style.width=((position+1)/5*100)+'%';dirty=false;
}
resize();requestAnimationFrame(render);
})();
