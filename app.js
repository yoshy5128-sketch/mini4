import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $=id=>document.getElementById(id);
const TYPES=[
 {id:'S',label:'TYPE S',short:'SPEED',name:'ストリームファルコン',color:0x16a9e1,accent:0xe9f6ff,mass:116,drag:.91,grip:.83,stability:.82,torque:.95},
 {id:'P',label:'TYPE P',short:'POWER',name:'ブレイズバイソン',color:0xe94842,accent:0xffce68,mass:132,drag:1.10,grip:.96,stability:1.06,torque:1.10},
 {id:'B',label:'TYPE B',short:'BALANCE',name:'グランドリンクス',color:0xf0bc48,accent:0x29363d,mass:124,drag:1.02,grip:1.07,stability:1.13,torque:1}
];
// Values are game design parameters, not measurements of real commercial parts.
const GROUPS=[
 {key:'motor',label:'モーター',info:'最高回転数とトルクの兼ね合いが重要。高出力は速い一方で重くなります。',parts:[
  {name:'標準モーター',rpm:1,torque:1,mass:0},{name:'トルク型',rpm:.92,torque:1.27,mass:3},{name:'高回転型',rpm:1.25,torque:.84,mass:3},{name:'バランス改良型',rpm:1.13,torque:1.13,mass:4},{name:'ハイパワー型',rpm:1.34,torque:1.22,mass:9}]},
 {key:'gear',label:'ギヤ',info:'数値の小さいギヤ比は最高速寄り、大きいギヤ比は加速力寄りになります。',parts:[
  {name:'3.5:1 超速',ratio:3.5,mass:1},{name:'3.7:1 高速',ratio:3.7,mass:1},{name:'4.0:1 標準',ratio:4,mass:0},{name:'4.2:1 加速',ratio:4.2,mass:0},{name:'5.0:1 登坂',ratio:5,mass:2}]},
 {key:'tire',label:'タイヤ',info:'小径は加速・安定寄り。大径は速度寄り。柔らかいタイヤはグリップが強めです。',parts:[
  {name:'小径ハード',diam:24,grip:.85,mass:-4},{name:'小径ソフト',diam:24,grip:1.19,mass:1},{name:'中径ノーマル',diam:26,grip:1,mass:0},{name:'大径ハード',diam:30,grip:.88,mass:4},{name:'大径ソフト',diam:30,grip:1.17,mass:7}]},
 {key:'roller',label:'ローラー',info:'摩擦の小さいローラーは旋回時の速度ロスを減らします。大径・安定型はコースアウトを抑制します。',parts:[
  {name:'樹脂ローラー 13mm',friction:1,stability:.90,diam:13,mass:0},{name:'樹脂ローラー 19mm',friction:1.06,stability:1.09,diam:19,mass:3},{name:'アルミローラー 13mm',friction:.81,stability:1.01,diam:13,mass:5},{name:'ベアリング 13mm',friction:.57,stability:1.02,diam:13,mass:7},{name:'ベアリング 19mm',friction:.66,stability:1.25,diam:19,mass:10}]},
 {key:'damper',label:'ダンパー',info:'マスダンパーは重量と引き換えに着地・コーナー安定性を向上させます。',parts:[
  {name:'装着なし',mass:0,stability:0,landing:0},{name:'軽量フロント',mass:5,stability:.06,landing:.12},{name:'軽量リア',mass:5,stability:.08,landing:.1},{name:'前後バランス',mass:12,stability:.16,landing:.21},{name:'ヘビーセット',mass:22,stability:.27,landing:.3}]},
 {key:'brake',label:'ブレーキ',info:'ブレーキは立体コース向け。今回の平面オーバルでは重さとわずかな接触抵抗だけが影響します。',parts:[
  {name:'ブレーキなし',mass:0,drag:0},{name:'薄型フロント',mass:2,drag:.005},{name:'薄型リア',mass:2,drag:.004},{name:'前後セッティング',mass:5,drag:.009},{name:'強力ブレーキ',mass:8,drag:.018}]}
];
const defaults={motor:0,gear:2,tire:2,roller:0,damper:0,brake:0};
const settingsKey='mini4wd_lab_v01_settings';const recordsKey='mini4wd_lab_v01_records';
function getStorage(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
let cfg=getStorage(settingsKey,{type:0,parts:{...defaults}});
if(!Number.isInteger(cfg.type)||cfg.type<0||cfg.type>=TYPES.length)cfg.type=0;
cfg.parts={...defaults,...cfg.parts};for(const group of GROUPS){if(!Number.isInteger(cfg.parts[group.key])||cfg.parts[group.key]<0||cfg.parts[group.key]>=group.parts.length)cfg.parts[group.key]=defaults[group.key]}
let records=getStorage(recordsKey,{});let activeGroup='motor',screen='garage';let race=null,car=null,track=null,visualReady=false;
const choose=k=>GROUPS.find(x=>x.key===k).parts[cfg.parts[k]];
function physics(){const t=TYPES[cfg.type],m=choose('motor'),g=choose('gear'),ti=choose('tire'),r=choose('roller'),d=choose('damper'),b=choose('brake');const mass=t.mass+m.mass+g.mass+ti.mass+r.mass+d.mass+b.mass;
const ratio=g.ratio, wheel=ti.diam/26, maxSpeed=5.9*m.rpm*wheel*(4/ratio)*(1/t.drag)*(1-0.004*b.drag), acceleration=2.3*m.torque*t.torque*(ratio/4)/wheel*(124/mass), grip=ti.grip*t.grip, stability=t.stability*r.stability*(1+d.stability)*(124/mass)**.13;
const cornerLimit=3.7*Math.sqrt(Math.max(.3,grip*stability))* (1+.045*(r.diam-13)/6);
const friction=.16*r.friction +b.drag*3, coastDrag=.010*t.drag;
return {mass, maxSpeed, acceleration, grip,stability,cornerLimit,friction,coastDrag,landing:(.5+d.landing)*stability};}
function score(p){return {speed:Math.round(Math.min(100,p.maxSpeed/10.4*100)),accel:Math.round(Math.min(100,p.acceleration/4.6*100)),corner:Math.round(Math.min(100,p.cornerLimit/6.6*100)),stability:Math.round(Math.min(100,(p.stability*.9+p.landing*.1)/1.7*100))}}
function persist(){localStorage.setItem(settingsKey,JSON.stringify(cfg))}
function renderUI(){ $('machines').innerHTML=TYPES.map((t,i)=>`<button class="pick ${cfg.type===i?'active':''}" data-type="${i}">${t.label}<small>${t.short}</small></button>`).join('');
 $('partTabs').innerHTML=GROUPS.map(g=>`<button class="partTab ${g.key===activeGroup?'active':''}" data-group="${g.key}">${g.label}</button>`).join('');
 const group=GROUPS.find(x=>x.key===activeGroup);$('parts').innerHTML=group.parts.map((p,i)=>`<button class="option ${cfg.parts[group.key]===i?'active':''}" data-part="${i}"><div><strong>${p.name}</strong><br><span>${p.mass>0?'+':''}${p.mass}g / ${group.key==='motor'?`回転×${p.rpm}`:group.key==='gear'?`比率 ${p.ratio}:1`:group.key==='tire'?`${p.diam}mm`:group.key==='roller'?`${p.diam}mm`:group.key==='damper'?`安定+${Math.round(p.stability*100)}%`:'抵抗係数 '+p.drag}</span></div>${cfg.parts[group.key]===i?'<span class="chip">装着中</span>':''}</button>`).join('');$('partInfo').textContent=group.info;
 const p=physics(),s=score(p);$('statRows').innerHTML=[['最高速',s.speed],['加速',s.accel],['コーナー',s.corner],['安定性',s.stability]].map(([name,val])=>`<div class="stat"><span>${name}</span><div class="bar"><div class="fill" style="width:${val}%"></div></div><strong>${val}</strong></div>`).join('');
 $('viewStatus').innerHTML=`<strong>${TYPES[cfg.type].name}</strong><br>総重量 ${p.mass} g<br>理論最高速 ${(p.maxSpeed*3.6).toFixed(1)} km/h<br>全パーツ無料`;}
$('machines').addEventListener('click',e=>{let b=e.target.closest('[data-type]');if(b){cfg.type=Number(b.dataset.type);refreshCar()}});
$('partTabs').addEventListener('click',e=>{let b=e.target.closest('[data-group]');if(b){activeGroup=b.dataset.group;renderUI()}});
$('parts').addEventListener('click',e=>{let b=e.target.closest('[data-part]');if(b){cfg.parts[activeGroup]=Number(b.dataset.part);refreshCar()}});
$('saveSetup').onclick=()=>{persist();$('saveSetup').textContent='✓ 保存しました';setTimeout(()=>$('saveSetup').textContent='このセッティングを保存',1200)};

// Scene / camera / lighting
const renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setClearColor(0x0a1721);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a1721);scene.fog=new THREE.Fog(0x0a1721,22,65);
const camera=new THREE.PerspectiveCamera(38,1,.04,120);camera.position.set(2.8,2.25,3.7);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.25,0);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=1.6;controls.maxDistance=9;controls.maxPolarAngle=Math.PI*.48;
scene.add(new THREE.HemisphereLight(0xaadffc,0x1c2b37,2.1));const sun=new THREE.DirectionalLight(0xffeee0,3.6);sun.position.set(4,9,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;scene.add(sun);
const ambientGlow=new THREE.PointLight(0x30bfff,18,7);ambientGlow.position.set(-3,2,-2);scene.add(ambientGlow);
const garageGroup=new THREE.Group();scene.add(garageGroup);const trackGroup=new THREE.Group();trackGroup.visible=false;scene.add(trackGroup);const carContainer=new THREE.Group();scene.add(carContainer);
const mat=(color,metalness=0,roughness=.55)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const metal=mat(0x7b929c,.8,.3),black=mat(0x141b22,.18,.73),rubber=mat(0x101319,.04,.94),carbon=mat(0x242f38,.18,.7),silver=mat(0xc4d6db,.9,.22),gold=mat(0xc9a15f,.83,.22);
function box(parent,w,h,d,material,x=0,y=0,z=0){const v=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);v.position.set(x,y,z);v.castShadow=true;v.receiveShadow=true;parent.add(v);return v}
function cyl(parent,r1,r2,height,material,x,y,z,rotZ=0){const v=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,height,16),material);v.rotation.z=rotZ;v.position.set(x,y,z);v.castShadow=true;parent.add(v);return v}
function tor(parent,r,tube,material,x,y,z,rotX=Math.PI/2){const v=new THREE.Mesh(new THREE.TorusGeometry(r,tube,8,32),material);v.position.set(x,y,z);v.rotation.x=rotX;v.castShadow=true;parent.add(v);return v}
const garageFloor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),mat(0x182733,.1,.85));garageFloor.rotation.x=-Math.PI/2;garageFloor.receiveShadow=true;garageGroup.add(garageFloor);
const podium=new THREE.Mesh(new THREE.CylinderGeometry(1.43,1.53,.17,72),mat(0x263e4b,.62,.32));podium.position.y=.10;podium.receiveShadow=true;garageGroup.add(podium);
const rim=new THREE.Mesh(new THREE.TorusGeometry(1.42,.026,8,80),new THREE.MeshBasicMaterial({color:0x55d9f2}));rim.rotation.x=Math.PI/2;rim.position.y=.195;garageGroup.add(rim);
const grid=new THREE.GridHelper(16,28,0x345265,0x213847);grid.position.y=.004;garageGroup.add(grid);
function buildCar(){const group=new THREE.Group();const t=TYPES[cfg.type],ti=choose('tire'),r=choose('roller'),d=choose('damper'),b=choose('brake'),m=choose('motor');const body=mat(t.color,.25,.3),accent=mat(t.accent,.32,.34);const scale=0.9;group.scale.setScalar(scale);
 // Dimensions: local 3D units; nose along positive X. Wheels on both sides.
 box(group,1.35,.105,.58,carbon,0,.20,0);box(group,1.52,.06,.67,black,0,.13,0);
 const wr=ti.diam/26*.165;
 for(const x of [-.47,.47])for(const z of [-.38,.38]){
  const wheel=cyl(group,wr,wr,.15,rubber,x,wr+.01,z);wheel.rotation.x=Math.PI/2;
  const side=cyl(group,wr*.64,wr*.64,.154,mat(t.accent,.62,.28),x,wr+.01,z);side.rotation.x=Math.PI/2;
  cyl(group,wr*.21,wr*.21,.16,silver,x,wr+.01,z).rotation.x=Math.PI/2;
  for(let k=0;k<6;k++){let a=k*Math.PI/3;box(group,.045,.014,.012,metal,x+Math.cos(a)*wr*.43,wr+.01+Math.sin(a)*wr*.43,z+(z>0?.084:-.084));}
 }
 // Contrasting stepped front nose and side fairings
 box(group,.65,.135,.42,body,.36,.30,0);box(group,.27,.10,.26,accent,.78,.26,0);
 box(group,.73,.17,.53,body,-.22,.32,0);box(group,.49,.22,.39,body,-.17,.47,0);
 box(group,.32,.055,.37,accent,-.18,.61,0);
 for(const z of [-.285,.285]){box(group,.92,.075,.095,accent,-.07,.31,z);box(group,.45,.06,.10,body,.45,.29,z)}
 // Body style differences
 if(cfg.type===0){box(group,.19,.035,.68,accent,-.66,.49,0);box(group,.48,.035,.10,body,-.54,.35,0);}
 if(cfg.type===1){box(group,.26,.12,.55,body,-.65,.53,0);box(group,.42,.055,.73,accent,-.64,.62,0);}
 if(cfg.type===2){box(group,.5,.055,.65,accent,-.53,.46,0);box(group,.28,.045,.66,body,.55,.40,0);}
 // Metallic motor and battery detail visible on chassis edges
 box(group,.37,.16,.23,metal,-.39,.16,0);for(const z of [-.21,.21])box(group,.42,.11,.10,gold,.1,.20,z);
 // Carbon stays front and rear
 for(const x of [-.76,.76]){
  box(group,.15,.045,1.10,carbon,x,.22,0);
  for(const z of [-.52,.52]){
   cyl(group,.021,.021,.13,metal,x,.29,z);
   const rad=r.diam/13*.078;
   cyl(group,rad,rad,.065,r.friction<.7?gold:silver,x,.335,z);
   cyl(group,rad*.61,rad*.61,.07,black,x,.37,z);
   tor(group,rad*.7,.008,metal,x,.379,z,Math.PI/2);
  }
 }
 // Rear stabilizer tower
 for(const z of [-.52,.52]){box(group,.042,.17,.055,metal,-.79,.38,z);cyl(group,.036,.036,.032,silver,-.79,.46,z)}
 if(d.mass){const n=d.mass>=12?4:2;for(let i=0;i<n;i++){const xx=n===2?(cfg.parts.damper===2?-.56:.52):i<2?.52:-.56;const zz=i%2?-.29:.29;box(group,.09,.1,.11,gold,xx,.20,zz);cyl(group,.021,.021,.06,metal,xx,.28,zz)}}
 if(b.mass){const xx=cfg.parts.brake===2?-.88:.88;box(group,.20,.044,.70,mat(0xe88142),xx,.075,0);if(cfg.parts.brake>=3)box(group,.18,.04,.7,mat(0xe88142),-.88,.075,0)}
 if(m.rpm>1.2)box(group,.18,.03,.27,gold,-.18,.62,0);
 group.position.y=.19;return group;}
function refreshCar(){persist();renderUI();if(car){carContainer.remove(car);car.traverse(o=>{if(o.isMesh){o.geometry?.dispose();if(o.material&&!([metal,black,rubber,carbon,silver,gold].includes(o.material)))o.material.dispose()}})}car=buildCar();carContainer.add(car);if(screen==='test'){setScreen('garage')}}
// Smooth closed oval in X/Z plane, with curvature-based corner dynamics.
const curveRadius=3.2,straightHalf=4.2,ovalLength=4*straightHalf+2*Math.PI*curveRadius;
function oval(u,r=curveRadius){let dist=((u%1)+1)%1*ovalLength;const straight=straightHalf*2, arc=Math.PI*curveRadius;
 if(dist<straight)return {x:-straightHalf+dist,z:-r,ang:0,curved:false};dist-=straight;
 if(dist<arc){let a=-Math.PI/2+dist/curveRadius;return {x:straightHalf+Math.cos(a)*r,z:Math.sin(a)*r,ang:a+Math.PI/2,curved:true}}dist-=arc;
 if(dist<straight)return {x:straightHalf-dist,z:r,ang:Math.PI,curved:false};dist-=straight;
 let a=Math.PI/2+dist/curveRadius;return {x:-straightHalf+Math.cos(a)*r,z:Math.sin(a)*r,ang:a+Math.PI/2,curved:true};}
function strip(outer,inner,color){const N=256,verts=[],inds=[];for(let i=0;i<=N;i++){const p=oval(i/N,outer),q=oval(i/N,inner);verts.push(p.x,.04,p.z,q.x,.04,q.z);if(i<N){let k=2*i;inds.push(k,k+1,k+2,k+1,k+3,k+2)}}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(inds);geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,mat(color,.08,.85));mesh.receiveShadow=true;trackGroup.add(mesh);return mesh}
function lineBand(r,color,width=.028,height=.08){let points=[];for(let i=0;i<=256;i++){const p=oval(i/256,r);points.push(new THREE.Vector3(p.x,height,p.z))}const c=new THREE.CatmullRomCurve3(points,true);const mesh=new THREE.Mesh(new THREE.TubeGeometry(c,256,width,5,true),new THREE.MeshStandardMaterial({color,metalness:.35,roughness:.45}));trackGroup.add(mesh)}
const trackGround=new THREE.Mesh(new THREE.PlaneGeometry(100,100),mat(0x14272c,.0,1));trackGround.rotation.x=-Math.PI/2;trackGround.position.y=-.02;trackGround.receiveShadow=true;trackGroup.add(trackGround);
strip(4.02,2.40,0x546473);strip(3.90,3.11,0x2b4b5d);strip(3.11,2.46,0x354e60);
lineBand(4.02,0xee4c4e,.07,.13);lineBand(2.40,0xe9edf2,.07,.13);lineBand(3.1,0xe9e5c4,.018,.09);
for(let i=0;i<34;i++){const p=oval(i/34,4.12);const pole=cyl(trackGroup,.025,.025,.35,metal,p.x,.18,p.z);}
for(let i=0;i<5;i++){const p=oval(.05+i*.005,3.1);box(trackGroup,.035,.012,1.65,i%2?black:silver,p.x,.10,p.z)}
const finish=box(trackGroup,.16,.14,1.9,mat(0xe2d2b7,.0,.9),-3.7,.13,-3.2);finish.rotation.y=0;
const trackSign=box(trackGroup,3,.05,.85,mat(0x1a3442),0,.01,0);
// UI and view transformations
function setView(view){if(screen==='test'){camera.position.set(0,14,17);controls.target.set(0,0,0);camera.fov=43;}else{camera.fov=38;controls.target.set(0,.28,0);camera.position.copy(({front:[3.8,1.5,0],side:[0,1.4,3.9],top:[.01,4.5,.01],angle:[2.8,2.3,3.8]})[view||'angle']?new THREE.Vector3(...({front:[3.8,1.5,0],side:[0,1.4,3.9],top:[.01,4.5,.01],angle:[2.8,2.3,3.8]})[view||'angle']):new THREE.Vector3(2.8,2.3,3.8));}camera.updateProjectionMatrix();controls.update();}
function setScreen(mode){screen=mode;const testing=mode==='test';$('garagePane').classList.toggle('hidden',testing);$('testPane').classList.toggle('hidden',!testing);$('garageTab').classList.toggle('active',!testing);$('testTab').classList.toggle('active',testing);garageGroup.visible=!testing;trackGroup.visible=testing;$('cameraBtns').classList.toggle('hidden',testing);$('overLine').textContent=testing?'OVAL TEST CIRCUIT':'CUSTOM MACHINE WORKSHOP';$('overTitle').textContent=testing?'TIME ATTACK':'TUNING GARAGE';$('overHint').textContent=testing?'1周のラップタイムを計測':'ドラッグ：回転　ホイール/ピンチ：拡大縮小';$('viewStatus').classList.toggle('hidden',testing);if(!testing){race=null;carContainer.position.set(0,0,0);carContainer.rotation.set(0,0,0)}else{placeCar(0)}setView('angle');updateBest()}
function placeCar(u){const p=oval(u);carContainer.position.set(p.x,0,p.z);carContainer.rotation.set(0,-p.ang,0)}
function displayRace(){if(!race)return;const r=race;$('speedRead').textContent=(r.v*3.6).toFixed(1);$('lapRead').textContent=r.time.toFixed(2);$('maxRead').textContent=(r.maxV*3.6).toFixed(1);$('stateRead').textContent=r.failed?'アウト':r.done?'完走':r.active?'走行中':'待機中';$('progressBar').style.width=(r.distance/ovalLength*100).toFixed(1)+'%'}
function startRace(){const p=physics();race={active:true,done:false,failed:false,v:0,time:0,distance:0,maxV:0,p,logs:[],risk:0};$('resultTime').textContent='--.-- s';$('delta').textContent='計測中';$('runLog').textContent='スタート！ セッティングの違いを検証しましょう。';placeCar(0);displayRace()}
function stopRace(failed){const r=race;if(!r||r.done)return;r.done=true;r.active=false;r.failed=failed;const key='oval';const before=records[key]?.time;
 if(failed){$('resultTime').textContent='COURSE OUT';$('delta').textContent='コーナーの速度が高すぎます';$('runLog').textContent='コーナーでコースアウト。ローラーの安定性、タイヤのグリップ、最高速のバランスを見直してください。';}
 else {const t=r.time;$('resultTime').textContent=t.toFixed(2)+' s';const better=before==null||t<before;$('delta').textContent=before==null?'初回計測完了':`${t<before?'ベスト更新：':'ベストとの差：'}${Math.abs(t-before).toFixed(2)} 秒${t<before?' 短縮':' 遅い'}`;
 $('runLog').textContent=`完走！最高速 ${(r.maxV*3.6).toFixed(1)} km/h / 総重量 ${r.p.mass}g。${better?'新しいベストです。':'別のパーツも試してみましょう。'}`;
 if(better){records[key]={time:t,max:r.maxV*3.6,type:TYPES[cfg.type].label,parts:{...cfg.parts}};localStorage.setItem(recordsKey,JSON.stringify(records))}}
 updateBest();displayRace();}
function raceStep(dt){if(!race?.active)return;const r=race,p=r.p;let pos=oval(r.distance/ovalLength);const onCurve=pos.curved;const sector=((r.distance%ovalLength)+ovalLength)%ovalLength;
 const straightLength=2*straightHalf, arcLength=Math.PI*curveRadius;
 const distanceToCorner=sector<straightLength?straightLength-sector:sector<straightLength+arcLength?0:sector<straightLength*2+arcLength?straightLength*2+arcLength-sector:0;
 const approaching=!onCurve&&distanceToCorner<2.6;
 const baseLim=onCurve||approaching?p.cornerLimit*1.10:999;
 const motorAccel=p.acceleration*(Math.max(0.1,1-r.v/(p.maxSpeed*1.15)));
 let a=motorAccel*(1-(r.v/p.maxSpeed)**1.9)-p.coastDrag*r.v*r.v;
 if((onCurve||approaching) && r.v>baseLim*.88)a-=Math.max(0,r.v-baseLim*.88)*5.4+p.friction*.5;
 r.v=Math.max(0,Math.min(p.maxSpeed*1.02,r.v+a*dt));r.distance+=r.v*dt;r.time+=dt;r.maxV=Math.max(r.maxV,r.v);
 // Deterministic safety margin, with a brief grace period for slight over-speed.
 if(onCurve){const margin=r.v/(p.cornerLimit*1.30);if(margin>1)r.risk+=dt*(margin-1)*2.4;else r.risk=Math.max(0,r.risk-dt*.9)}else r.risk=Math.max(0,r.risk-dt*2);
 if(r.risk>.30){stopRace(true);return}
 if(r.distance>=ovalLength){r.distance=ovalLength;placeCar(1);stopRace(false);return}placeCar(r.distance/ovalLength);
}
function updateBest(){const b=records.oval;$('bestRecord').textContent=b?`${b.time.toFixed(2)} 秒 / ${b.type} / ${b.max.toFixed(1)} km/h\n${GROUPS.map(g=>`${g.label}：${g.parts[b.parts[g.key]??0]?.name??'未設定'}`).join(' ｜ ')}`:'まだ記録がありません'}
$('startRun').onclick=startRace;$('resetBest').onclick=()=>{records={};localStorage.removeItem(recordsKey);updateBest()};$('garageTab').onclick=()=>setScreen('garage');$('testTab').onclick=()=>setScreen('test');$('backGarage').onclick=()=>setScreen('garage');$('goTest').onclick=()=>setScreen('test');$('resetView').onclick=()=>setView('angle');document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
let last=performance.now(),accum=0;const fixed=1/120;
function animate(now){requestAnimationFrame(animate);const elapsed=Math.min((now-last)/1000,.075);last=now;if(screen==='test'&&race?.active){accum+=elapsed;while(accum>=fixed){raceStep(fixed);accum-=fixed}displayRace()}
 if(screen==='garage'&&car){carContainer.position.set(0,0,0);carContainer.rotation.y=0}
 controls.update();renderer.render(scene,camera)}
function resize(){const canvas=$('scene');const rect=canvas.getBoundingClientRect();if(rect.width&&rect.height){renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix()}}
new ResizeObserver(resize).observe($('scene'));window.addEventListener('resize',resize);renderUI();refreshCar();setScreen('garage');resize();requestAnimationFrame(animate);
