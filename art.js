(() => {
'use strict';
const container=document.getElementById('ar-works');
const make=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;};
function status(text){container.replaceChildren(make('p',text,'ar-status'));}
async function init(){
 try{
 const r=await fetch('art-data.json',{cache:'no-store'});if(!r.ok)throw Error('Unable to load art-data.json');const data=await r.json();if(!data||!Array.isArray(data.artworks))throw Error('artworks must be an array');
 const title=document.getElementById('ar-title');if(typeof data.heroTitle==='string'&&data.heroTitle.trim()){title.textContent=data.heroTitle;title.classList.remove('ar-sr-only');}
 const subtitle=document.getElementById('ar-hero-subtitle');if(typeof data.heroSubtitle==='string'&&data.heroSubtitle.trim()){subtitle.textContent=data.heroSubtitle;subtitle.hidden=false;}
 if(!data.artworks.length){status('Artwork will be added here.');return;}
 const fragment=document.createDocumentFragment();
 for(const [i,work] of data.artworks.entries()){
 if(!work||typeof work.title!=='string'||!work.title.trim()||typeof work.image!=='string'||!work.image.trim())throw Error('Each artwork needs a title and image path. Check entry '+(i+1));
 const url=new URL(work.image,location.href);if(!['http:','https:'].includes(url.protocol))throw Error('Unsupported image URL');
 const card=make('article',undefined,'ar-work'),figure=make('figure');const img=make('img');img.alt=work.alt||work.title;img.loading='lazy';img.decoding='async';img.addEventListener('error',()=>{figure.replaceChildren(make('p','Image unavailable. Check the filename and path for “'+work.title+'”.','ar-image-error'));});img.src=url.href;figure.append(img);
 const info=make('div',undefined,'ar-work-info'),heading=make('h3',work.title);heading.id='ar-work-title-'+(i+1);card.setAttribute('aria-labelledby',heading.id);info.append(heading);const dl=make('dl');
 for(const [label,value] of [['Medium',work.medium],['Year',work.year],['Pieces made',work.piecesMade]]){if(value===undefined||value===null||value==='')continue;const row=make('div');row.append(make('dt',label),make('dd',String(value)));dl.append(row);}info.append(dl);card.append(figure,info);fragment.append(card);
 }
 container.replaceChildren(fragment);
 }catch(error){console.error(error);status('The artwork collection could not load. Check art-data.json and preview through your local web server.');}
}
init();
})();
