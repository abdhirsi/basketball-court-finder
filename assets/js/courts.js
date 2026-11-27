let API=false,C=[],ME={lat:44.9778,lng:-93.265},map,layer;
const hav=(a,b,c,d)=>{const r=x=>x*Math.PI/180,k=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 3958.8*2*Math.asin(Math.sqrt(k))};
function mk(n,la,ln,t){t=t||{};return{n,h:t.operator||"Minneapolis / St. Paul",t:(t.indoor=="yes"||t.building)?"Indoor":"Outdoor",f:t.fee=="yes"?"Paid":"Free",c:0,hp:t.hoops||"\u2014",l:t.lit=="yes",lat:la,lng:ln,cr:"None",a:t.surface?["Surface: "+t.surface]:["Not listed"],no:"From OpenStreetMap. Verify access and fees before you go.",t0:null}}
const dm=c=>c.lat==null?99:hav(ME.lat,ME.lng,c.lat,c.lng);
function fin(){C.forEach((c,i)=>{c.id=i+1;c.mi=dm(c)});chips();render();fit()}
const PARKS=[["Powderhorn Park","3400 15th Ave S, Minneapolis, MN 55407","South"],["Peavey Field Park","730 E 22nd St, Minneapolis, MN 55404","Central"],["Elliot Park","1000 E 14th St, Minneapolis, MN 55404","Downtown"],["Currie Park","500 15th Ave. S, Minneapolis, MN 55454","Cedar-Riverside"],["Van Cleve Park","901 15th Ave SE, Minneapolis, MN 55414","Southeast"],["Bethune Park","1304 N 10th Ave, Minneapolis, MN 55411","North"],["East Phillips Park","2399 17th Ave S, Minneapolis, MN 55404","South"],["Beltrami Park","1111 Summer St NE, Minneapolis, MN 55413","Northeast"],["Bryant Square Park","3101 Bryant Ave S, Minneapolis, MN 55408","Uptown"],["Dickman Park","614 NE 2nd St, Minneapolis, MN 55413","Northeast"],["Audubon Park basketball court","1320 29th Ave NE, Minneapolis, MN 55418","Northeast"],["Matthews Park basketball courts","Matthews Park, Minneapolis, MN 55406","Seward"]];
function pk(p){const c=mk(p[0],null,null);c.h=p[2];c.addr=p[1];c.no="Address from the project group's court list. Confirm access and condition before you go.";return c}
function load(){C=PARKS.map(pk);fin();geocode()}
async function geocode(){let cache={};try{cache=JSON.parse(localStorage.getItem("geo1")||"{}")}catch(e){}
 C.forEach(c=>{if(cache[c.addr]){c.lat=cache[c.addr][0];c.lng=cache[c.addr][1];c.mi=dm(c)}});render();fit();
 for(const c of C){if(c.lat!=null)continue;
  try{const r=await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q="+encodeURIComponent(c.addr));const j=await r.json();
   if(j[0]){c.lat=+j[0].lat;c.lng=+j[0].lon;c.mi=dm(c);cache[c.addr]=[c.lat,c.lng];try{localStorage.setItem("geo1",JSON.stringify(cache))}catch(e){}render()}}catch(e){}
  await new Promise(r=>setTimeout(r,1100))}
 fit()}
async function doAuth(a){user=true;$("#auth").textContent="Hi, Player \u2713";$("#dlg").close();toast("Signed in (demo account)")}
function authDlg(){const d=$("#dlg");d.innerHTML='<div class="dlg"><h2>Sign in</h2><p class="sub">Demo only. Do not enter a real password.</p><label>Username<br><input id="au" autocomplete="username" style="width:100%;padding:10px;min-height:44px"></label><br><br><label>Password (8+ characters)<br><input id="ap" type="password" autocomplete="current-password" style="width:100%;padding:10px;min-height:44px"></label><div class="row"><button class="btn pri" data-auth="login">Sign in</button><button class="btn" data-auth="register">Create account</button><button class="btn" data-close>Cancel</button></div><p class="sub" id="aerr" role="alert"></p></div>';d.showModal()}
function ago(c){const m=Math.max(1,Math.round((Date.now()-c.t0)/60000));return m<60?m+" min ago":Math.round(m/60)+" hr ago"}
function fit(){if(C.some(c=>c.lat!=null))map.fitBounds(C.filter(c=>c.lat!=null).map(c=>[c.lat,c.lng]),{padding:[30,30],maxZoom:14})}
const F=[...new Set(PARKS.map(p=>p[2]))].map(n=>[n,c=>c.h==n,1]).concat([["Low crowd",c=>c.cr=="Low"],["Favorites",c=>fav.has(c.id)]]);
const on=new Set(),fav=new Set();let sel=null,user=false,view="list";
addEventListener("error",e=>{try{toast("Error: "+e.message)}catch(_){}});
const $=s=>document.querySelector(s),R={Low:0,None:1,Moderate:2,Busy:3},IC={Low:"●",Moderate:"▲",Busy:"■",None:"○"},CL={Low:"var(--low)",Moderate:"var(--mod)",Busy:"var(--busy)",None:"#6b6b73"},CT=k=>k=="None"?"No reports":k;
const CN=["Not rated","Poor","Fair","Okay","Good","Excellent"];
const tm=c=>c.lat==null?"Distance not available (address only)":`${c.mi.toFixed(1)} mi straight-line distance (approx.)`;
function toast(m){const t=$("#toast");t.textContent=m;t.classList.remove("hide");clearTimeout(toast.i);toast.i=setTimeout(()=>t.classList.add("hide"),2400)}
function res(){const q=$("#q").value.toLowerCase(),s=$("#sort").value;
 const nb=[...on].filter(k=>F[k][2]),ot=[...on].filter(k=>!F[k][2]);let r=C.filter(c=>(c.n+" "+c.h+" "+(c.addr||"")).toLowerCase().includes(q)&&ot.every(k=>F[k][1](c))&&(!nb.length||nb.some(k=>F[k][1](c))));
 r.sort((a,b)=>s=="mi"?a.mi-b.mi:s=="cond"?b.c-a.c:R[a.cr]-R[b.cr]||a.mi-b.mi);return r}
function render(){const r=res();$("#count").textContent=`${r.length} of ${C.length} courts`;
 $("#list").innerHTML=r.length?r.map((c,i)=>`<article class="card ${sel==c.id?"sel":""}" tabindex="0" data-id="${c.id}" id="c${c.id}" aria-label="${c.n}">
 <div class="num">${i+1}</div><div style="flex:1"><h3>${c.n}</h3><div class="sub">${c.h} · ${c.lat==null?"Address only":c.mi.toFixed(1)+" mi (approx.)"}</div>
 <div class="tags"><span class="tag">${c.t}</span><span class="tag">${c.f}</span><span class="tag">Condition: ${CN[c.c]}</span>${c.v?'<span class="tag">⚠ Verify</span>':""}<span class="crowd ${c.cr}">${IC[c.cr]} ${CT(c.cr)}</span></div></div>
 <button class="star" data-fav="${c.id}" aria-pressed="${fav.has(c.id)}" aria-label="Favorite ${c.n}">${fav.has(c.id)?"★":"☆"}</button></article>`).join(""):
 `<div class="empty">No courts match these filters.<br><button class="btn" id="clr" style="margin-top:10px">Clear filters</button></div>`;
 if(layer){layer.clearLayers();r.forEach((c,i)=>{if(c.lat==null)return;const m=L.marker([c.lat,c.lng],{title:c.n,icon:L.divIcon({className:"",iconSize:[30,30],html:`<div class="mk ${sel==c.id?"sel":""}" style="background:${CL[c.cr]}">${i+1}</div>`})});m.on("click",()=>pick(c.id,true));layer.addLayer(m)})}
 const c=C[sel-1];$("#tip").innerHTML=c&&r.includes(c)?`<b>${c.n}</b> · ${c.t}, ${c.f}<br><span class="crowd ${c.cr}">${IC[c.cr]} ${CT(c.cr)}</span> · ${tm(c)} <button class="btn" data-open="${c.id}" style="min-height:36px;padding:2px 10px;margin-left:6px">Details</button>`:"Select a pin to preview a court."}
function pick(id,scroll){sel=id;render();if(map&&C[id-1]&&C[id-1].lat!=null)map.panTo([C[id-1].lat,C[id-1].lng]);if(scroll){const e=$("#c"+id);if(e)e.scrollIntoView({block:"center",behavior:"smooth"})}}
function open(id){const c=C[id-1];sel=id;render();const d=$("#dlg");
 d.innerHTML=`<div class="dlg"><h2>${c.n}</h2><div class="sub">${c.h}, Minneapolis area (sample)</div>
 <div class="grid"><div class="box"><b>Type</b>${c.t}</div><div class="box"><b>Access</b>${c.f}</div><div class="box"><b>Condition</b>${CN[c.c]} (${c.c}/5)</div><div class="box"><b>Hoops</b>${c.hp}${c.l?" · lit at night":""}</div></div>
 <div><b>Crowd level now: <span class="crowd ${c.cr}">${IC[c.cr]} ${CT(c.cr)}</span></b><div class="meter ${c.cr}" aria-hidden="true"><span></span><span></span><span></span></div><div class="sub">${c.t0?"Last report "+ago(c):"No one has reported yet. Be the first!"}</div></div>
 <p><b>Approximate distance:</b><br>${tm(c)}</p><p><b>Amenities:</b> ${c.a.join(", ")}</p><p>${c.no}</p>
 <div id="rep"><b>Report crowd level</b>${user?`<div class="row">${["Low","Moderate","Busy"].map(k=>`<button class="btn" data-rep="${k}">${IC[k]} ${k}</button>`).join("")}</div>`:`<p class="sub">Sign in to submit a crowd update.</p>`}</div>
 <div class="row"><button class="btn" data-fav="${c.id}" aria-pressed="${fav.has(c.id)}">${fav.has(c.id)?"★ Saved":"☆ Save"}</button><a class="btn" style="text-decoration:none;text-align:center;color:inherit" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.addr||(c.lat!=null?c.lat+','+c.lng:c.n+' '+c.h))}">Directions</a><button class="btn" data-prob="${c.id}">Report problem</button><button class="btn" data-share="${c.id}">Share</button><button class="btn pri" data-close>Close</button></div></div>`;
 d.showModal();d.dataset.id=id}
document.addEventListener("click",e=>{const t=e.target,g=s=>t.closest(s);
 if(g("[data-fav]")){e.stopPropagation();const id=+g("[data-fav]").dataset.fav;fav.has(id)?fav.delete(id):fav.add(id);render();if($("#dlg").open)open(id);return}
 if(g("[data-rep]")){const c=C[$("#dlg").dataset.id-1],lv=g("[data-rep]").dataset.rep;(async()=>{if(API){const r=await post("api/report.php",{court_id:c.db,level:lv});if(r.error)return toast(r.error)}c.cr=lv;c.t0=Date.now();toast("Thanks! Crowd updated to "+lv);open(c.id);render()})();return}
 if(g("[data-auth]")){doAuth(g("[data-auth]").dataset.auth);return}
 if(g("[data-share]")){toast("Link copied (demo)");return}
 if(g("[data-prob]")){if(!$("#prb")){const d=document.createElement("div");d.id="prb";d.className="box";d.innerHTML='<b>What’s wrong?</b><div class="row">'+["Broken rim","Damaged surface","Locked or closed","Poor lighting"].map(k=>'<button class="btn" data-issue="'+k+'">'+k+'</button>').join("")+'</div>';g("[data-prob]").closest(".row").before(d)}return}
 if(g("[data-issue]")){const k=g("[data-issue]").dataset.issue,c=C[$("#dlg").dataset.id-1];(async()=>{if(API){const r=await post("api/report.php",{court_id:c.db,issue:k});if(r.error)return toast(r.error)}toast("Thanks! Reported: "+k);const p=$("#prb");if(p)p.remove()})();return}
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
$("#auth").onclick=async()=>{if(user){if(API)await post("api/auth.php",{action:"logout"});user=false;$("#auth").textContent="Demo sign in";toast("Signed out")}else authDlg()};

function setView(v){view=v;setTimeout(()=>map&&map.invalidateSize(),50);$("#tl").setAttribute("aria-selected",v=="list");$("#tm").setAttribute("aria-selected",v=="map");
 $("#list").classList.toggle("hide",v=="map"&&innerWidth<860);$("#mapwrap").classList.toggle("hide",v=="list"&&innerWidth<860)}
$("#tl").onclick=()=>setView("list");$("#tm").onclick=()=>setView("map");
function lay(){if(innerWidth>=860){$("#list").classList.remove("hide");$("#mapwrap").classList.remove("hide")}else setView(view)}
addEventListener("resize",lay);
map=L.map("map");L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap contributors"}).addTo(map);
layer=L.layerGroup().addTo(map);map.setView([ME.lat,ME.lng],11);
$("#loc").onclick=()=>{if(!navigator.geolocation)return toast("Location not supported");navigator.geolocation.getCurrentPosition(p=>{ME={lat:p.coords.latitude,lng:p.coords.longitude};C.forEach(c=>c.mi=dm(c));L.circleMarker([ME.lat,ME.lng],{radius:8,color:"#fff",fillColor:"#1a73e8",fillOpacity:1,weight:3}).addTo(map);$("#sort").value="mi";render();toast("Distances now use your location")},()=>toast("Could not get your location"))};
lay();load();
