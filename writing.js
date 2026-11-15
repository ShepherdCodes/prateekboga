(() => {
'use strict';
const kind=document.body.dataset.page;
const list=document.getElementById('wr-post-list');
const article=document.getElementById('wr-article');
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function status(container,message){container.replaceChildren(el('p',message,'wr-status'));}
function safeURL(value){try{const u=new URL(value,location.href);if(['http:','https:'].includes(u.protocol))return u.href;}catch{}return null;}
function formatDate(value){const d=new Date(value+'T12:00:00Z');return Number.isNaN(d.valueOf())?value:new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(d);}
// A deliberately small Markdown subset. Raw HTML is always treated as text.
function inline(parent,text){
 const pattern=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*|\[[^\]]+\]\([^\s)]+\))/g;
 let last=0;
 for(const m of text.matchAll(pattern)){
  parent.append(document.createTextNode(text.slice(last,m.index)));const token=m[0];
  if(token.startsWith('`'))parent.append(el('code',token.slice(1,-1)));
  else if(token.startsWith('**'))parent.append(el('strong',token.slice(2,-2)));
  else if(token.startsWith('*'))parent.append(el('em',token.slice(1,-1)));
  else{const parts=token.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);const url=safeURL(parts[2]);if(url){const a=el('a',parts[1]);a.href=url;parent.append(a);}else parent.append(document.createTextNode(parts[1]));}
  last=m.index+token.length;
 }
 parent.append(document.createTextNode(text.slice(last)));
}
function renderMarkdown(text){
 const fragment=document.createDocumentFragment(),lines=text.replace(/\r\n?/g,'\n').split('\n');let i=0;
 while(i<lines.length){let line=lines[i];if(!line.trim()){i++;continue;}
 if(/^```/.test(line)){const code=[];i++;while(i<lines.length&&!/^```/.test(lines[i]))code.push(lines[i++]);if(i<lines.length)i++;const pre=el('pre');pre.append(el('code',code.join('\n')));fragment.append(pre);continue;}
 const heading=line.match(/^(#{1,6})\s+(.+)$/);if(heading){const h=el('h'+Math.min(3,heading[1].length+1));inline(h,heading[2]);fragment.append(h);i++;continue;}
 if(/^\s*---+\s*$/.test(line)){fragment.append(el('hr'));i++;continue;}
 const image=line.match(/^!\[([^\]]*)\]\(([^\s)]+)\)\s*$/);if(image){const url=safeURL(image[2]);if(url){const img=el('img');img.src=url;img.alt=image[1];img.loading='lazy';fragment.append(img);}i++;continue;}
 if(/^>\s?/.test(line)){const q=el('blockquote');const items=[];while(i<lines.length&&/^>\s?/.test(lines[i]))items.push(lines[i++].replace(/^>\s?/,''));inline(q,items.join(' '));fragment.append(q);continue;}
 const listMatch=line.match(/^\s*(?:([-*])|(\d+)\.)\s+(.+)$/);if(listMatch){const ordered=!!listMatch[2],ul=el(ordered?'ol':'ul');if(ordered&&Number(listMatch[2])!==1)ul.start=Number(listMatch[2]);while(i<lines.length){const m=lines[i].match(/^\s*(?:([-*])|(\d+)\.)\s+(.+)$/);if(!m||!!m[2]!==ordered)break;const li=el('li');inline(li,m[3]);ul.append(li);i++;}fragment.append(ul);continue;}
 const para=[line];i++;
 while(i<lines.length&&lines[i].trim()&&!/^(#{1,6}\s|```|>\s?|\s*[-*]\s|\s*\d+\.\s|!\[|\s*---+\s*$)/.test(lines[i]))para.push(lines[i++]);
 const p=el('p');inline(p,para.join(' '));fragment.append(p);
 }
 return fragment;
}
function renderText(text){const f=document.createDocumentFragment();text.trim().split(/\n\s*\n/).forEach(block=>{const p=el('p',block);p.style.whiteSpace='pre-wrap';f.append(p);});return f;}
function row(post){const a=el('a',undefined,'wr-post-row');a.href='blog.html?post='+encodeURIComponent(post.slug);const time=el('time',formatDate(post.date),'wr-post-date');time.dateTime=post.date;const body=el('div');body.append(el('h3',post.title,'wr-post-title'));if(post.excerpt)body.append(el('p',post.excerpt,'wr-post-excerpt'));const arrow=el('span','↗','wr-post-arrow');arrow.setAttribute('aria-hidden','true');a.append(time,body,arrow);return a;}
async function run(){
 try{
  const response=await fetch('blogs/posts.json',{cache:'no-store'});if(!response.ok)throw Error('Index unavailable');const raw=await response.json();if(!Array.isArray(raw))throw Error('Invalid blog index');
  const seen=new Set();const posts=raw.filter(p=>{if(!p||typeof p.slug!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||seen.has(p.slug)||typeof p.title!=='string'||typeof p.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||typeof p.file!=='string'||!/^blogs\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.(?:md|txt)$/.test(p.file))return false;seen.add(p.slug);return true;}).sort((a,b)=>b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug));
  if(raw.length!==posts.length)console.warn('Some blog entries have invalid fields or duplicate slugs; see the writing guide.');
  if(kind==='reader'){
   const slug=new URLSearchParams(location.search).get('post');const post=posts.find(p=>p.slug===slug);if(!post){document.title='Post not found | Prateek Boga';status(article,'This post could not be found. Use “All blog posts” to choose an available article.');return;}
   const response=await fetch(post.file,{cache:'no-store'});if(!response.ok)throw Error('Article file unavailable');const text=await response.text();document.title=post.title+' | Prateek Boga';
   const desc=document.querySelector('meta[name="description"]');if(desc)desc.content=post.excerpt||post.title;
   const h=el('h1',post.title);const meta=el('div',undefined,'wr-reader-meta'),time=el('time',formatDate(post.date));time.dateTime=post.date;meta.append(document.createTextNode('Prateek Boga · '),time);const prose=el('div',undefined,'wr-prose');prose.append(post.file.endsWith('.txt')?renderText(text):renderMarkdown(text));article.replaceChildren(h,meta,prose);return;
  }
  if(!posts.length){status(list,'No blog posts published yet.');return;}
  if(kind==='writing'){list.replaceChildren(...posts.slice(0,3).map(row));return;}
  const perPage=6,total=Math.ceil(posts.length/perPage);const rawPage=Number(new URLSearchParams(location.search).get('page'));const current=Math.min(total,Math.max(1,Number.isInteger(rawPage)?rawPage:1));list.replaceChildren(...posts.slice((current-1)*perPage,current*perPage).map(row));
  const pagination=document.getElementById('wr-pagination');if(total<=1)return;
  function pageLink(number,label){const a=el('a',label);a.href='blogs.html?page='+number;if(number===current)a.setAttribute('aria-current','page');return a;}
  const nav=[];if(current>1)nav.push(pageLink(current-1,'← Previous'));const nums=new Set([1,total,current-1,current,current+1]);let previous=0;[...nums].filter(n=>n>=1&&n<=total).sort((a,b)=>a-b).forEach(n=>{if(previous&&n>previous+1)nav.push(el('span','…'));nav.push(pageLink(n,String(n)));previous=n;});if(current<total)nav.push(pageLink(current+1,'Next →'));pagination.replaceChildren(...nav);
 }catch(error){console.error(error);status(article||list,'Unable to load '+(kind==='reader'?'this article':'blog posts')+'. Please try again later. When previewing locally, use your localhost server rather than opening the HTML file directly.');}
}
run();
})();
