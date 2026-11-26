const FB=[["Loring Park",44.9686,-93.2889],["Elliot Park",44.9737,-93.2590],["Powderhorn Park",44.9487,-93.2582],["North Commons Park",44.9987,-93.2917],["Bryant Square Park",44.9482,-93.2800],["Webber Park",45.0245,-93.3014]];
let C=[],ME={lat:44.9778,lng:-93.265},map,layer;
const hav=(a,b,c,d)=>{const r=x=>x*Math.PI/180,k=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 3958.8*2*Math.asin(Math.sqrt(k))};
function mk(n,la,ln,t){t=t||{};return{n,h:t.operator||"Minneapolis area",t:(t.indoor=="yes"||t.building)?"Indoor":"Outdoor",f:t.fee=="yes"?"Paid":"Free",c:0,hp:t.hoops||"\u2014",l:t.lit=="yes",lat:la,lng:ln,cr:"None",a:t.surface?["Surface: "+t.surface]:["Not listed"],no:"From OpenStreetMap. Verify access and fees before you go.",t0:null}}
function fin(){C.forEach((c,i)=>{c.id=i+1;c.mi=hav(ME.lat,ME.lng,c.lat,c.lng)});chips();render();fit()}
async function load(){let ok=false;
 try{const q='[out:json][timeout:25];nwr["sport"="basketball"](44.89,-93.33,45.05,-93.19);out center tags;';
  const r=await fetch("https://overpass-api.de/api/interpreter",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"data="+encodeURIComponent(q)});
  const j=await r.json(),seen=new Set();
  C=j.elements.map(e=>{const t=e.tags||{},la=e.lat??(e.center&&e.center.lat),ln=e.lon??(e.center&&e.center.lon);
   if(la==null||!(t.leisure=="pitch"||t.leisure=="sports_centre"||t.building))return null;
   const k=la.toFixed(4)+ln.toFixed(4);if(seen.has(k))return null;seen.add(k);
   return mk(t.name||(t.operator?t.operator+" court":"Unnamed court"),la,ln,t)}).filter(Boolean);ok=C.length>=3}catch(e){}
 if(!ok){C=FB.map(p=>{const c=mk(p[0],p[1],p[2]);c.no="Approximate location. Live data could not be loaded.";return c});toast("Could not load live data, showing a short backup list")}
 fin()}
function ago(c){const m=Math.max(1,Math.round((Date.now()-c.t0)/60000));return m<60?m+" min ago":Math.round(m/60)+" hr ago"}
function fit(){if(C.length)map.fitBounds(C.map(c=>[c.lat,c.lng]),{padding:[30,30],maxZoom:14})}
const F=[["Indoor",c=>c.t=="Indoor"],["Outdoor",c=>c.t=="Outdoor"],["Free",c=>c.f=="Free"],["Paid",c=>c.f=="Paid"],["Lit at night",c=>c.l],["Good condition",c=>c.c>=4],["Low crowd",c=>c.cr=="Low"],["Favorites",c=>fav.has(c.id)]];
const on=new Set(),fav=new Set();let sel=null,user=false,view="list";
const $=s=>document.querySelector(s),R={Low:0,None:1,Moderate:2,Busy:3},IC={Low:"●",Moderate:"▲",Busy:"■",None:"○"},CL={Low:"var(--low)",Moderate:"var(--mod)",Busy:"var(--busy)",None:"#6b6b73"},CT=k=>k=="None"?"No reports":k;
const CN=["Not rated","Poor","Fair","Okay","Good","Excellent"];
const tm=c=>`🚶 ${Math.round(c.mi*20)} min · 🚲 ${Math.round(c.mi*6)} min · 🚗 ${Math.round(c.mi*3+3)} min`;
function toast(m){const t=$("#toast");t.textContent=m;t.classList.remove("hide");clearTimeout(toast.i);toast.i=setTimeout(()=>t.classList.add("hide"),2400)}
function res(){const q=$("#q").value.toLowerCase(),s=$("#sort").value;
 let r=C.filter(c=>(c.n+c.h).toLowerCase().includes(q)&&[...on].every(k=>F[k][1](c)));
 r.sort((a,b)=>s=="mi"?a.mi-b.mi:s=="cond"?b.c-a.c:R[a.cr]-R[b.cr]||a.mi-b.mi);return r}
function render(){const r=res();$("#count").textContent=`${r.length} of ${C.length} courts`;
 $("#list").innerHTML=r.length?r.map((c,i)=>`<article class="card ${sel==c.id?"sel":""}" tabindex="0" data-id="${c.id}" id="c${c.id}" aria-label="${c.n}">
 <div class="num">${i+1}</div><div style="flex:1"><h3>${c.n}</h3><div class="sub">${c.h} · ${c.mi.toFixed(1)} mi · 🚗 ${Math.round(c.mi*3+3)} min</div>
 <div class="tags"><span class="tag">${c.t}</span><span class="tag">${c.f}</span><span class="tag">Condition: ${CN[c.c]}</span><span class="crowd ${c.cr}">${IC[c.cr]} ${CT(c.cr)}</span></div></div>
 <button class="star" data-fav="${c.id}" aria-pressed="${fav.has(c.id)}" aria-label="Favorite ${c.n}">${fav.has(c.id)?"★":"☆"}</button></article>`).join(""):
 `<div class="empty">No courts match these filters.<br><button class="btn" id="clr" style="margin-top:10px">Clear filters</button></div>`;
 if(layer){layer.clearLayers();r.forEach((c,i)=>{const m=L.marker([c.lat,c.lng],{title:c.n,icon:L.divIcon({className:"",iconSize:[30,30],html:`<div class="mk ${sel==c.id?"sel":""}" style="background:${CL[c.cr]}">${i+1}</div>`})});m.on("click",()=>pick(c.id,true));layer.addLayer(m)})}
 const c=C[sel-1];$("#tip").innerHTML=c&&r.includes(c)?`<b>${c.n}</b> · ${c.t}, ${c.f}<br><span class="crowd ${c.cr}">${IC[c.cr]} ${CT(c.cr)}</span> · ${tm(c)} <button class="btn" data-open="${c.id}" style="min-height:36px;padding:2px 10px;margin-left:6px">Details</button>`:"Select a pin to preview a court."}
function pick(id,scroll){sel=id;render();if(map&&C[id-1])map.panTo([C[id-1].lat,C[id-1].lng]);if(scroll){const e=$("#c"+id);if(e)e.scrollIntoView({block:"center",behavior:"smooth"})}}
function open(id){const c=C[id-1];sel=id;render();const d=$("#dlg");
 d.innerHTML=`<div class="dlg"><h2>${c.n}</h2><div class="sub">${c.h}, Minneapolis area (sample)</div>
 <div class="grid"><div class="box"><b>Type</b>${c.t}</div><div class="box"><b>Access</b>${c.f}</div><div class="box"><b>Condition</b>${CN[c.c]} (${c.c}/5)</div><div class="box"><b>Hoops</b>${c.hp}${c.l?" · lit at night":""}</div></div>
 <div><b>Crowd level now: <span class="crowd ${c.cr}">${IC[c.cr]} ${CT(c.cr)}</span></b><div class="meter ${c.cr}" aria-hidden="true"><span></span><span></span><span></span></div><div class="sub">${c.t0?"Last report "+ago(c):"No one has reported yet. Be the first!"}</div></div>
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
function setView(v){view=v;setTimeout(()=>map&&map.invalidateSize(),50);$("#tl").setAttribute("aria-selected",v=="list");$("#tm").setAttribute("aria-selected",v=="map");
 $("#list").classList.toggle("hide",v=="map"&&innerWidth<860);$("#mapwrap").classList.toggle("hide",v=="list"&&innerWidth<860)}
$("#tl").onclick=()=>setView("list");$("#tm").onclick=()=>setView("map");
function lay(){if(innerWidth>=860){$("#list").classList.remove("hide");$("#mapwrap").classList.remove("hide")}else setView(view)}
addEventListener("resize",lay);
map=L.map("map");L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap contributors"}).addTo(map);
layer=L.layerGroup().addTo(map);map.setView([ME.lat,ME.lng],12);
$("#loc").onclick=()=>{if(!navigator.geolocation)return toast("Location not supported");navigator.geolocation.getCurrentPosition(p=>{ME={lat:p.coords.latitude,lng:p.coords.longitude};C.forEach(c=>c.mi=hav(ME.lat,ME.lng,c.lat,c.lng));L.circleMarker([ME.lat,ME.lng],{radius:8,color:"#fff",fillColor:"#1a73e8",fillOpacity:1,weight:3}).addTo(map);$("#sort").value="mi";render();toast("Distances now use your location")},()=>toast("Could not get your location"))};
lay();toast("Loading real courts from OpenStreetMap...");load();
