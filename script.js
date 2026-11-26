const C=[
{n:"Powderhorn Park",h:"Powderhorn",t:"Outdoor",f:"Free",c:4,hp:4,l:true,x:330,y:300,mi:2.4,cr:"Busy",a:["Water fountain","Restrooms","Benches"],no:"Full court, busiest after 5 pm."},
{n:"Loring Park",h:"Downtown",t:"Outdoor",f:"Free",c:3,hp:2,l:true,x:300,y:170,mi:1.1,cr:"Moderate",a:["Restrooms","Parking"],no:"Two hoops, one rim sags."},
{n:"Elliot Park",h:"Downtown East",t:"Outdoor",f:"Free",c:5,hp:2,l:true,x:390,y:210,mi:0.8,cr:"Low",a:["Benches","Lighting"],no:"Recently resurfaced."},
{n:"Currie Park",h:"Cedar-Riverside",t:"Outdoor",f:"Free",c:3,hp:2,l:false,x:380,y:150,mi:1.6,cr:"Moderate",a:["Water fountain"],no:"Popular with pickup groups."},
{n:"Brackett Park",h:"Longfellow",t:"Outdoor",f:"Free",c:4,hp:2,l:false,x:430,y:330,mi:3.2,cr:"Low",a:["Restrooms","Playground"],no:"Quiet most weekdays."},
{n:"Matthews Park",h:"Phillips",t:"Outdoor",f:"Free",c:2,hp:2,l:false,x:345,y:255,mi:1.3,cr:"Low",a:["Benches"],no:"Cracked surface in one corner."},
{n:"Bryant Square",h:"Uptown",t:"Outdoor",f:"Free",c:4,hp:2,l:true,x:240,y:300,mi:2.0,cr:"Moderate",a:["Restrooms","Lighting"],no:"Lit until park close."},
{n:"Webber Park",h:"North",t:"Outdoor",f:"Free",c:3,hp:2,l:false,x:360,y:60,mi:4.5,cr:"Low",a:["Restrooms","Parking"],no:"Near the river trail."},
{n:"Downtown Rec Center",h:"Downtown",t:"Indoor",f:"Paid",c:5,hp:6,l:true,x:270,y:215,mi:0.9,cr:"Busy",a:["Locker rooms","Water fountain","Parking"],no:"Day pass required, sample price $8."},
{n:"Community Gym (Open Gym)",h:"Northeast",t:"Indoor",f:"Free",c:4,hp:4,l:true,x:410,y:90,mi:3.0,cr:"Moderate",a:["Restrooms","Water fountain"],no:"Open gym Tue/Thu evenings only."},
{n:"Southside Sports Hall",h:"Nokomis",t:"Indoor",f:"Paid",c:5,hp:4,l:true,x:300,y:380,mi:4.1,cr:"Low",a:["Locker rooms","Showers","Parking"],no:"Membership or $10 drop-in."},
{n:"Lake Harriet Court",h:"Linden Hills",t:"Outdoor",f:"Free",c:5,hp:2,l:false,x:130,y:300,mi:4.8,cr:"Busy",a:["Restrooms","Parking","Benches"],no:"Weekend afternoons fill up."}
];
C.forEach((c,i)=>{c.id=i+1;c.t0=Date.now()-(7+i*9)*60000});
function ago(c){const m=Math.max(1,Math.round((Date.now()-c.t0)/60000));return m<60?m+" min ago":Math.round(m/60)+" hr ago"}
const F=[["Indoor",c=>c.t=="Indoor"],["Outdoor",c=>c.t=="Outdoor"],["Free",c=>c.f=="Free"],["Paid",c=>c.f=="Paid"],["Lit at night",c=>c.l],["Good condition",c=>c.c>=4],["Low crowd",c=>c.cr=="Low"],["Favorites",c=>fav.has(c.id)]];
const on=new Set(),fav=new Set();let sel=null,user=false,view="list";
const $=s=>document.querySelector(s),R={Low:0,Moderate:1,Busy:2},IC={Low:"●",Moderate:"▲",Busy:"■"},CL={Low:"var(--low)",Moderate:"var(--mod)",Busy:"var(--busy)"};
const CN=["","Poor","Fair","Okay","Good","Excellent"];
const tm=c=>`🚶 ${Math.round(c.mi*20)} min · 🚲 ${Math.round(c.mi*6)} min · 🚗 ${Math.round(c.mi*3+3)} min`;
function toast(m){const t=$("#toast");t.textContent=m;t.classList.remove("hide");clearTimeout(toast.i);toast.i=setTimeout(()=>t.classList.add("hide"),2400)}
function res(){const q=$("#q").value.toLowerCase(),s=$("#sort").value;
 let r=C.filter(c=>(c.n+c.h).toLowerCase().includes(q)&&[...on].every(k=>F[k][1](c)));
 r.sort((a,b)=>s=="mi"?a.mi-b.mi:s=="cond"?b.c-a.c:R[a.cr]-R[b.cr]||a.mi-b.mi);return r}
function render(){const r=res();$("#count").textContent=`${r.length} of ${C.length} courts`;
 $("#list").innerHTML=r.length?r.map((c,i)=>`<article class="card ${sel==c.id?"sel":""}" tabindex="0" data-id="${c.id}" id="c${c.id}" aria-label="${c.n}">
 <div class="num">${i+1}</div><div style="flex:1"><h3>${c.n}</h3><div class="sub">${c.h} · ${c.mi} mi · 🚗 ${Math.round(c.mi*3+3)} min</div>
 <div class="tags"><span class="tag">${c.t}</span><span class="tag">${c.f}</span><span class="tag">Condition: ${CN[c.c]}</span><span class="crowd ${c.cr}">${IC[c.cr]} ${c.cr}</span></div></div>
 <button class="star" data-fav="${c.id}" aria-pressed="${fav.has(c.id)}" aria-label="Favorite ${c.n}">${fav.has(c.id)?"★":"☆"}</button></article>`).join(""):
 `<div class="empty">No courts match these filters.<br><button class="btn" id="clr" style="margin-top:10px">Clear filters</button></div>`;
 $("#pins").innerHTML=r.map((c,i)=>`<g class="pin ${sel==c.id?"sel":""}" tabindex="0" data-id="${c.id}" role="button" aria-label="${i+1}. ${c.n}, ${c.cr} crowd"><circle cx="${c.x}" cy="${c.y}" r="${sel==c.id?20:16}" fill="${CL[c.cr]}"/><text x="${c.x}" y="${c.y+5}">${i+1}</text></g>`).join("");
 const c=C[sel-1];$("#tip").innerHTML=c&&r.includes(c)?`<b>${c.n}</b> · ${c.t}, ${c.f}<br><span class="crowd ${c.cr}">${IC[c.cr]} ${c.cr}</span> · ${tm(c)} <button class="btn" data-open="${c.id}" style="min-height:36px;padding:2px 10px;margin-left:6px">Details</button>`:"Select a pin to preview a court."}
function pick(id,scroll){sel=id;render();if(scroll){const e=$("#c"+id);if(e)e.scrollIntoView({block:"center",behavior:"smooth"})}}
function open(id){const c=C[id-1];sel=id;render();const d=$("#dlg");
 d.innerHTML=`<div class="dlg"><h2>${c.n}</h2><div class="sub">${c.h}, Minneapolis area (sample)</div>
 <div class="grid"><div class="box"><b>Type</b>${c.t}</div><div class="box"><b>Access</b>${c.f}</div><div class="box"><b>Condition</b>${CN[c.c]} (${c.c}/5)</div><div class="box"><b>Hoops</b>${c.hp}${c.l?" · lit at night":""}</div></div>
 <div><b>Crowd level now: <span class="crowd ${c.cr}">${IC[c.cr]} ${c.cr}</span></b><div class="meter ${c.cr}" aria-hidden="true"><span></span><span></span><span></span></div><div class="sub">Last report ${ago(c)} (sample)</div></div>
 <p><b>Travel from you:</b><br>${tm(c)}</p><p><b>Amenities:</b> ${c.a.join(", ")}</p><p>${c.no}</p>
 <div id="rep"><b>Report crowd level</b>${user?`<div class="row">${["Low","Moderate","Busy"].map(k=>`<button class="btn" data-rep="${k}">${IC[k]} ${k}</button>`).join("")}</div>`:`<p class="sub">Sign in to submit a crowd update.</p>`}</div>
 <div class="row"><button class="btn" data-fav="${c.id}" aria-pressed="${fav.has(c.id)}">${fav.has(c.id)?"★ Saved":"☆ Save"}</button><a class="btn" style="text-decoration:none;text-align:center;color:inherit" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.n+' '+c.h+' Minneapolis')}">Directions</a><button class="btn" data-prob="${c.id}">Report problem</button><button class="btn" data-share="${c.id}">Share</button><button class="btn pri" data-close>Close</button></div></div>`;
 d.showModal();d.dataset.id=id}
document.addEventListener("click",e=>{const t=e.target,g=s=>t.closest(s);
 if(g("[data-fav]")){e.stopPropagation();const id=+g("[data-fav]").dataset.fav;fav.has(id)?fav.delete(id):fav.add(id);render();if($("#dlg").open)open(id);return}
 if(g("[data-rep]")){const c=C[$("#dlg").dataset.id-1];c.cr=g("[data-rep]").dataset.rep;c.t0=Date.now();toast("Thanks! Crowd updated to "+c.cr);open(c.id);return}
 if(g("[data-share]")){toast("Link copied (demo)");return}
 if(g("[data-prob]")){if(!$("#prb")){const d=document.createElement("div");d.id="prb";d.className="box";d.innerHTML='<b>What’s wrong?</b><div class="row">'+["Broken rim","Damaged surface","Locked or closed","Poor lighting"].map(k=>'<button class="btn" data-issue="'+k+'">'+k+'</button>').join("")+'</div>';g("[data-prob]").closest(".row").before(d)}return}
 if(g("[data-issue]")){toast("Thanks! Reported: "+g("[data-issue]").dataset.issue);$("#prb").remove();return}
 if(g("[data-close]")){$("#dlg").close();return}
 if(g("[data-open]")){open(+g("[data-open]").dataset.open);return}
 if(g(".card")){const id=+g(".card").dataset.id;if(sel==id||view=="list")open(id);else pick(id,false);return}
 if(g(".pin")){const id=+g(".pin").dataset.id;pick(id,true);return}
 if(g("#clr")){on.clear();$("#q").value="";chips();render()}
 if(t==$("#dlg"))$("#dlg").close()});
document.addEventListener("keydown",e=>{if(e.key=="Enter"||e.key==" "){const x=e.target.closest(".card,.pin");if(x&&e.target==x){e.preventDefault();x.click()}}});
function chips(){$("#chips").innerHTML=F.map((f,i)=>`<button class="chip" aria-pressed="${on.has(i)}" data-chip="${i}">${f[0]}</button>`).join("")+(on.size?`<button class="chip" id="clr">Clear all</button>`:"")}
$("#chips").addEventListener("click",e=>{const b=e.target.closest("[data-chip]");if(!b)return;const i=+b.dataset.chip;on.has(i)?on.delete(i):on.add(i);chips();render()});
$("#q").oninput=render;$("#sort").onchange=render;
$("#about").onclick=()=>{const d=$("#dlg");d.innerHTML='<div class="dlg"><h2>What changed and why</h2><p class="sub">Fixes from usability testing</p><p><b>Filters hard to find:</b> chips are always visible under the search bar, with a Clear all option.</p><p><b>Map and list disconnected:</b> numbered pins match numbered cards, and selecting one highlights the other.</p><p><b>Hard to read:</b> larger text, high contrast, dark mode, and crowd levels shown with symbol plus word, not color alone.</p><p><b>New in this version:</b> last-report time, directions link, and report-a-problem.</p><div class="row"><button class="btn pri" data-close>Close</button></div></div>';d.showModal()};
$("#auth").onclick=()=>{user=!user;$("#auth").textContent=user?"Hi, Player ✓":"Sign in";toast(user?"Signed in (demo account)":"Signed out")};
$("#theme").onclick=()=>{const d=document.documentElement,dark=getComputedStyle(d).getPropertyValue("--bg").trim()=="#17171a";d.dataset.theme=dark?"light":"dark"};
function setView(v){view=v;$("#tl").setAttribute("aria-selected",v=="list");$("#tm").setAttribute("aria-selected",v=="map");
 $("#list").classList.toggle("hide",v=="map"&&innerWidth<860);$("#mapwrap").classList.toggle("hide",v=="list"&&innerWidth<860)}
$("#tl").onclick=()=>setView("list");$("#tm").onclick=()=>setView("map");
function lay(){if(innerWidth>=860){$("#list").classList.remove("hide");$("#mapwrap").classList.remove("hide")}else setView(view)}
addEventListener("resize",lay);chips();render();lay();
