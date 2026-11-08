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
const settingsKey='mini4wd_lab_v01_settings';const recordsKey='mini4wd_lab_v02_records'; // Physics changed: keep setups, separate incompatible time records.
function getStorage(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
let cfg=getStorage(settingsKey,{type:0,parts:{...defaults}});
if(!Number.isInteger(cfg.type)||cfg.type<0||cfg.type>=TYPES.length)cfg.type=0;
cfg.parts={...defaults,...cfg.parts};cfg.fine={rollerHeight:0,rollerSpread:0,damperBias:0,brakeHeight:2,...cfg.fine};const FINE_RANGES={rollerHeight:[-2,2],rollerSpread:[-2,2],damperBias:[-2,2],brakeHeight:[0,4]};for(const [k,[lo,hi]] of Object.entries(FINE_RANGES))cfg.fine[k]=Math.max(lo,Math.min(hi,Math.round(Number(cfg.fine[k])||0))); for(const group of GROUPS){if(!Number.isInteger(cfg.parts[group.key])||cfg.parts[group.key]<0||cfg.parts[group.key]>=group.parts.length)cfg.parts[group.key]=defaults[group.key]}
let records=getStorage(recordsKey,{});let activeGroup='motor',screen='garage';let race=null,car=null,track=null,visualReady=false;let wheelGroups=[];
const choose=k=>GROUPS.find(x=>x.key===k).parts[cfg.parts[k]];
const TRACK_SCALE=3;
// v0.2.4: run the *whole vehicle simulation* faster in wall-clock time.
// The car covers the course faster on screen; camera stays in free overview.
// Model-time telemetry and tuning comparisons remain calibrated as before.
const RACE_PLAYBACK_RATE=4.0;
// v0.2: model-scale metres and seconds; tuned for Mini 4WD-like 30–60 km/h.
// The motor/gear/tyre characteristics contribute continuously rather than
// changing animation playback speed. These are fictional calibration values.
function physics(){
 const t=TYPES[cfg.type],m=choose('motor'),g=choose('gear'),ti=choose('tire'),r=choose('roller'),d=choose('damper'),b=choose('brake');
 const mass=t.mass+m.mass+g.mass+ti.mass+r.mass+d.mass+b.mass;const fine=cfg.fine;
 const wheel=ti.diam/26, ratio=g.ratio;
 const maxSpeed=12.3*m.rpm*wheel*(4/ratio)/Math.sqrt(t.drag);
 const acceleration=11.5*m.torque*t.torque*(ratio/4)/wheel*(124/mass);
 const grip=ti.grip*t.grip;
 const stability=t.stability*r.stability*(1+d.stability)*Math.pow(124/mass,.15)*(1+fine.rollerSpread*.036-fine.rollerHeight*.032+(d.mass?(.018*Math.abs(fine.damperBias))*(-1):0));
 // A higher supported lateral load permits faster turns, but weighs more.
 const cornerLimit=9.2*Math.pow(TRACK_SCALE,.25)*Math.sqrt(Math.max(.35,grip*stability))*(1+.025*(r.diam-13)/6); // Spread and roller height alter the effective stability.
 const cornerFriction=.36*r.friction+Math.max(0,b.drag)*2.5+Math.max(0,fine.rollerSpread)*.045;
 const brakePower=9+4*Math.max(0,grip-1)+3*Math.max(0,stability-1)+(b.mass?(4-fine.brakeHeight)*.35:0);
 return {mass,maxSpeed,acceleration,grip,stability,cornerLimit,cornerFriction,brakePower,
  rollingLoss:.14+.09*r.friction+(b.mass?(4-fine.brakeHeight)*.035:0),airDrag:.0045*t.drag,landing:(.5+d.landing)*stability*(1+(d.mass?fine.damperBias*.045:0)),fine:{...fine}};
}
function score(p){return {speed:Math.round(Math.min(100,p.maxSpeed/18.8*100)),accel:Math.round(Math.min(100,p.acceleration/21*100)),corner:Math.round(Math.min(100,p.cornerLimit/15*100)),stability:Math.round(Math.min(100,(p.stability*.9+p.landing*.1)/1.7*100))}}
function persist(){localStorage.setItem(settingsKey,JSON.stringify(cfg))}
function renderUI(){ $('machines').innerHTML=TYPES.map((t,i)=>`<button class="pick ${cfg.type===i?'active':''}" data-type="${i}">${t.label}<small>${t.short}</small></button>`).join('');
 $('partTabs').innerHTML=GROUPS.map(g=>`<button class="partTab ${g.key===activeGroup?'active':''}" data-group="${g.key}">${g.label}</button>`).join('');
 const group=GROUPS.find(x=>x.key===activeGroup);$('parts').innerHTML=group.parts.map((p,i)=>`<button class="option ${cfg.parts[group.key]===i?'active':''}" data-part="${i}"><div><strong>${p.name}</strong><br><span>${p.mass>0?'+':''}${p.mass}g / ${group.key==='motor'?`回転×${p.rpm}`:group.key==='gear'?`比率 ${p.ratio}:1`:group.key==='tire'?`${p.diam}mm`:group.key==='roller'?`${p.diam}mm`:group.key==='damper'?`安定+${Math.round(p.stability*100)}%`:'抵抗係数 '+p.drag}</span></div>${cfg.parts[group.key]===i?'<span class="chip">装着中</span>':''}</button>`).join('');$('partInfo').textContent=group.info;
 const p=physics(),s=score(p);$('statRows').innerHTML=[['最高速',s.speed],['加速',s.accel],['コーナー',s.corner],['安定性',s.stability]].map(([name,val])=>`<div class="stat"><span>${name}</span><div class="bar"><div class="fill" style="width:${val}%"></div></div><strong>${val}</strong></div>`).join('');
 $('viewStatus').innerHTML=`<strong>${TYPES[cfg.type].name}</strong><br>総重量 ${p.mass} g<br>理論最高速 ${(p.maxSpeed*3.6).toFixed(1)} km/h<br>全パーツ無料`;renderFine();}
const FINE_CONTROLS=[
 {key:'rollerHeight',label:'ローラー高さ',unit:'mm',scale:2,desc:'低いほどコーナーの安定性が増す傾向'},
 {key:'rollerSpread',label:'ローラー前後幅',unit:'mm',scale:12,desc:'前後幅を広げると安定性が向上（抵抗も増加）'},
 {key:'damperBias',label:'ダンパー配置',unit:'',scale:1,desc:'−：後寄り / ＋：前寄り（装着時に有効）'},
 {key:'brakeHeight',label:'ブレーキ地上高',unit:'mm',scale:1,desc:'低いほど路面抵抗が増える（装着時に有効）'}
];
function renderFine(){const node=$('fineControls');if(!node)return;
 node.innerHTML=FINE_CONTROLS.map(c=>{const [a,b]=FINE_RANGES[c.key],v=cfg.fine[c.key],shown=c.key==='brakeHeight'?v:c.key==='damperBias'?(v===0?'中央':v<0?'後方 '+Math.abs(v):'前方 '+v):(v*c.scale>0?'+':'')+(v*c.scale)+c.unit;return `<label class="fineRow"><span><strong>${c.label}</strong><small>${c.desc}</small></span><div class="fineAdjust"><button data-fine="${c.key}" data-step="-1" ${v<=a?'disabled':''} aria-label="${c.label}を下げる">−</button><output>${shown}</output><button data-fine="${c.key}" data-step="1" ${v>=b?'disabled':''} aria-label="${c.label}を上げる">＋</button></div></label>`}).join('');}
$('fineControls').addEventListener('click',e=>{const b=e.target.closest('[data-fine]');if(!b)return;const k=b.dataset.fine,step=Number(b.dataset.step),[min,max]=FINE_RANGES[k];cfg.fine[k]=Math.max(min,Math.min(max,cfg.fine[k]+step));refreshCar()});
$('resetFine').onclick=()=>{cfg.fine={rollerHeight:0,rollerSpread:0,damperBias:0,brakeHeight:2};refreshCar()};
$('machines').addEventListener('click',e=>{let b=e.target.closest('[data-type]');if(b){cfg.type=Number(b.dataset.type);refreshCar()}});
$('partTabs').addEventListener('click',e=>{let b=e.target.closest('[data-group]');if(b){activeGroup=b.dataset.group;renderUI()}});
$('parts').addEventListener('click',e=>{let b=e.target.closest('[data-part]');if(b){cfg.parts[activeGroup]=Number(b.dataset.part);refreshCar()}});
$('saveSetup').onclick=()=>{persist();$('saveSetup').textContent='✓ 保存しました';setTimeout(()=>$('saveSetup').textContent='このセッティングを保存',1200)};

// Scene / camera / lighting
const renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setClearColor(0x0a1721);renderer.shadowMap.enabled=false;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a1721);scene.fog=new THREE.Fog(0x0a1721,22,65);
const camera=new THREE.PerspectiveCamera(38,1,.25,350);camera.position.set(2.8,2.25,3.7);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.25,0);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=1.6;controls.maxDistance=110;controls.maxPolarAngle=Math.PI*.48;
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
function buildCar(){wheelGroups=[];const group=new THREE.Group();const t=TYPES[cfg.type],ti=choose('tire'),r=choose('roller'),d=choose('damper'),b=choose('brake'),m=choose('motor');const body=mat(t.color,.25,.3),accent=mat(t.accent,.32,.34);const scale=0.9;group.scale.setScalar(scale);
 // Dimensions: local 3D units; nose along positive X. Wheels on both sides.
 box(group,1.35,.105,.58,carbon,0,.20,0);box(group,1.52,.06,.67,black,0,.13,0);
 const wr=ti.diam/26*.165;
 for(const x of [-.47,.47])for(const z of [-.38,.38]){
  // Rotate the full wheel assembly around its axle (Z), not the entire car.
  const assembly=new THREE.Group();assembly.position.set(x,wr+.01,z);group.add(assembly);
  const wheel=cyl(assembly,wr,wr,.15,rubber,0,0,0);wheel.rotation.x=Math.PI/2;
  const side=cyl(assembly,wr*.64,wr*.64,.154,mat(t.accent,.62,.28),0,0,0);side.rotation.x=Math.PI/2;
  cyl(assembly,wr*.21,wr*.21,.16,silver,0,0,0).rotation.x=Math.PI/2;
  // Visible radial spokes make the rotation easy to read at low speeds.
  for(let k=0;k<6;k++){const a=k*Math.PI/3;const spoke=box(assembly,wr*.53,.019,.022,metal,Math.cos(a)*wr*.39,Math.sin(a)*wr*.39,z>0?.086:-.086);spoke.rotation.z=a;}
  wheelGroups.push(assembly);
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
 for(const baseX of [-.76,.76]){
  const x=baseX+Math.sign(baseX)*cfg.fine.rollerSpread*.055; const h=cfg.fine.rollerHeight*.024;
  box(group,.15,.045,1.10,carbon,x,.22+h,0);
  for(const z of [-.52,.52]){
   cyl(group,.021,.021,.13,metal,x,.29+h,z);
   const rad=r.diam/13*.078;
   cyl(group,rad,rad,.065,r.friction<.7?gold:silver,x,.335+h,z);
   cyl(group,rad*.61,rad*.61,.07,black,x,.37+h,z);
   tor(group,rad*.7,.008,metal,x,.379+h,z,Math.PI/2);
  }
 }
 // Rear stabilizer tower
 for(const z of [-.52,.52]){box(group,.042,.17,.055,metal,-.79,.38,z);cyl(group,.036,.036,.032,silver,-.79,.46,z)}
 if(d.mass){const n=d.mass>=12?4:2;for(let i=0;i<n;i++){const xx=(n===2?(cfg.parts.damper===2?-.56:.52):i<2?.52:-.56)+cfg.fine.damperBias*.10;const zz=i%2?-.29:.29;box(group,.09,.1,.11,gold,xx,.20,zz);cyl(group,.021,.021,.06,metal,xx,.28,zz)}}
 if(b.mass){const xx=cfg.parts.brake===2?-.88:.88;box(group,.20,.044,.70,mat(0xe88142),xx,.053+cfg.fine.brakeHeight*.012,0);if(cfg.parts.brake>=3)box(group,.18,.04,.7,mat(0xe88142),-.88,.053+cfg.fine.brakeHeight*.012,0)}
 if(m.rpm>1.2)box(group,.18,.03,.27,gold,-.18,.62,0);
 return group;}
function refreshCar(){persist();renderUI();if(car){carContainer.remove(car);car.traverse(o=>{if(o.isMesh){o.geometry?.dispose();if(o.material&&!([metal,black,rubber,carbon,silver,gold].includes(o.material)))o.material.dispose()}})}car=buildCar();carContainer.add(car);carContainer.position.y=screen==='test'?TRACK_CAR_Y:GARAGE_CAR_Y;if(screen==='test'){setScreen('garage')}}
// Smooth closed oval in X/Z plane, with curvature-based corner dynamics.
// Ver.0.2.1: 3x the original physical circuit length (not a 3-lap timer).
// The lane width stays unchanged: this makes a genuinely longer course.
const curveRadius=3.2*TRACK_SCALE,straightHalf=4.2*TRACK_SCALE;
const ovalLength=4*straightHalf+2*Math.PI*curveRadius;
const TRACK_HALF_WIDTH=.81;
function oval(u,r=curveRadius){let dist=((u%1)+1)%1*ovalLength;const straight=straightHalf*2, arc=Math.PI*curveRadius;
 if(dist<straight)return {x:-straightHalf+dist,z:-r,ang:0,curved:false};dist-=straight;
 if(dist<arc){let a=-Math.PI/2+dist/curveRadius;return {x:straightHalf+Math.cos(a)*r,z:Math.sin(a)*r,ang:a+Math.PI/2,curved:true}}dist-=arc;
 if(dist<straight)return {x:straightHalf-dist,z:r,ang:Math.PI,curved:false};dist-=straight;
 let a=Math.PI/2+dist/curveRadius;return {x:-straightHalf+Math.cos(a)*r,z:Math.sin(a)*r,ang:a+Math.PI/2,curved:true};}
// Track surface v0.1.3: a SINGLE, unlit, shadow-free geometry.
// No coplanar band meshes, decals or receiving shadows: eliminates surface shimmer.
function solidRoad(outer,inner){
 const N=384,vertices=[],indices=[];
 for(let i=0;i<=N;i++){
  const p=oval(i/N,outer),q=oval(i/N,inner);
  vertices.push(p.x,.045,p.z,q.x,.045,q.z);
  if(i<N){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2)}
 }
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 geometry.setIndex(indices);geometry.computeVertexNormals();
 const material=new THREE.MeshBasicMaterial({color:0x465260,side:THREE.DoubleSide,depthTest:true,depthWrite:true});
 const road=new THREE.Mesh(geometry,material);road.receiveShadow=false;road.castShadow=false;
 road.renderOrder=1;trackGroup.add(road);
}
function rail(radius,color){
 const positions=[];
 for(let i=0;i<=384;i++){const pt=oval(i/384,radius);positions.push(new THREE.Vector3(pt.x,.125,pt.z))}
 const curve=new THREE.CatmullRomCurve3(positions,true);
 const barrier=new THREE.Mesh(new THREE.TubeGeometry(curve,384,.052,6,true),new THREE.MeshBasicMaterial({color}));
 barrier.receiveShadow=false;barrier.castShadow=false;trackGroup.add(barrier);
}
const trackGround=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshBasicMaterial({color:0x14272c}));
trackGround.rotation.x=-Math.PI/2;trackGround.position.y=-.03;
trackGround.receiveShadow=false;trackGround.castShadow=false;trackGroup.add(trackGround);
solidRoad(curveRadius+TRACK_HALF_WIDTH,curveRadius-TRACK_HALF_WIDTH);
rail(curveRadius+TRACK_HALF_WIDTH,0xe76566);rail(curveRadius-TRACK_HALF_WIDTH,0xe5ebf0);
for(let i=0;i<90;i++){const p=oval(i/90,curveRadius+TRACK_HALF_WIDTH+.10);const pole=cyl(trackGroup,.025,.025,.35,metal,p.x,.18,p.z);}
for(let i=0;i<5;i++){const p=oval(.018+i*.0017,curveRadius-.1);box(trackGroup,.035,.012,1.65,i%2?black:silver,p.x,.10,p.z)}
const finish=box(trackGroup,.16,.14,1.9,mat(0xe2d2b7,.0,.9),-straightHalf+.5,.13,-curveRadius);finish.rotation.y=0;
const trackSign=box(trackGroup,3,.05,.85,mat(0x1a3442),0,.01,0);
// Match the scaled tires to the actual running surface and podium top.
const TRACK_CAR_Y=.04-.9*.01;
const GARAGE_CAR_Y=.185-.9*.01;
// UI and view transformations
function fitTrackCamera(){
 // A fixed camera distance cropped the horizontal edges, especially on tall phones.
 // Fit the complete course using the live canvas aspect ratio and projected extents.
 const rect=renderer.domElement.getBoundingClientRect();
 const aspect=Math.max(.25,rect.width/Math.max(1,rect.height));
 camera.fov=48;camera.updateProjectionMatrix();
 const halfW=straightHalf+curveRadius+TRACK_HALF_WIDTH+1.0,halfD=curveRadius+TRACK_HALF_WIDTH+1.0;
 const direction=new THREE.Vector3(0,1.35,.65).normalize();
 const projectedVertical=halfD*direction.y+.35*direction.z;
 const halfTan=Math.tan(THREE.MathUtils.degToRad(camera.fov*.5));
 const requiredDistance=Math.max((halfW)/(halfTan*aspect),projectedVertical/halfTan)*1.20;
 controls.target.set(0,0,0);
 camera.position.copy(direction.multiplyScalar(requiredDistance));
 controls.minDistance=3;
 controls.maxDistance=Math.max(110,requiredDistance*2.5);
 camera.updateProjectionMatrix();
}
function setView(view){if(screen==='test'){fitTrackCamera();}
else{camera.fov=38;controls.target.set(-.55,.28,0);camera.position.copy(({front:[3.8,1.5,0],side:[0,1.4,3.9],top:[.01,4.5,.01],angle:[2.8,2.3,3.8]})[view||'angle']?new THREE.Vector3(...({front:[3.8,1.5,0],side:[0,1.4,3.9],top:[.01,4.5,.01],angle:[2.8,2.3,3.8]})[view||'angle']):new THREE.Vector3(2.8,2.3,3.8));camera.position.x-=.55;}camera.updateProjectionMatrix();controls.update();}
function setScreen(mode){screen=mode;const testing=mode==='test';$('garagePane').classList.toggle('hidden',testing);$('testPane').classList.toggle('hidden',!testing);$('garageTab').classList.toggle('active',!testing);$('testTab').classList.toggle('active',testing);garageGroup.visible=!testing;trackGroup.visible=testing;$('cameraBtns').classList.toggle('hidden',testing);$('overLine').textContent=testing?'OVAL TEST CIRCUIT':'CUSTOM MACHINE WORKSHOP';$('overTitle').textContent=testing?'TIME ATTACK':'TUNING GARAGE';$('overHint').textContent=testing?'従来の3倍の距離・1周のラップタイムを計測':'ドラッグ：回転　ホイール/ピンチ：拡大縮小';$('viewStatus').classList.toggle('hidden',testing);$('sceneStats').classList.toggle('hidden',testing);if(!testing){race=null;carContainer.position.set(0,GARAGE_CAR_Y,0);carContainer.rotation.set(0,0,0)}else{placeCar(0)}setView('angle');updateBest()}
function placeCar(u){const p=oval(u);carContainer.position.set(p.x,TRACK_CAR_Y,p.z);carContainer.rotation.set(0,-p.ang,0)}
function displayRace(){if(!race)return;const r=race;$('speedRead').textContent=(r.v*3.6).toFixed(1);$('lapRead').textContent=r.time.toFixed(2);$('maxRead').textContent=(r.maxV*3.6).toFixed(1);$('stateRead').textContent=r.failed?'アウト':r.done?'完走':r.active?'走行中':'待機中';$('progressBar').style.width=(r.distance/ovalLength*100).toFixed(1)+'%'}
function startRace(){
 const p=physics();race={active:true,done:false,failed:false,v:0,time:0,distance:0,maxV:0,p,risk:0,
   peakLateral:0,cornerLoss:0,fastestStraight:0,curveTime:0,cornerWarnings:0};
 $('resultTime').textContent='--.-- s';$('delta').textContent='計測中';
 $('runLog').textContent='スタート！ 走行テンポは従来どおり4倍。パーツと微調整の効果を比較できます。';
 placeCar(0);displayRace();
}
function stopRace(failed){
 const r=race;if(!r||r.done)return;r.done=true;r.active=false;r.failed=failed;
 const key='oval_3x_v03';const before=records[key]?.time;
 const report=`微調整［ローラー高 ${r.p.fine.rollerHeight*2}mm / 前後幅 ${r.p.fine.rollerSpread*12}mm / ダンパー ${r.p.fine.damperBias} / ブレーキ高 ${r.p.fine.brakeHeight}mm］。最高速度 ${(r.maxV*3.6).toFixed(1)} km/h / コーナー走行 ${r.curveTime.toFixed(2)} 秒 / コーナー減速量 ${r.cornerLoss.toFixed(1)} km/h / 総重量 ${r.p.mass}g。`;
 if(failed){
  $('resultTime').textContent='COURSE OUT';$('delta').textContent='コーナー速度がローラー・グリップの許容範囲を超過';
  $('runLog').textContent=`コースアウト：${(r.distance/ovalLength*100).toFixed(0)}%地点。${report} ローラーやタイヤ、ダンパーを見直すか、最高速を抑えてください。`;
 }else{
  const t=r.time;$('resultTime').textContent=t.toFixed(2)+' s';const better=before==null||t<before;
  $('delta').textContent=before==null?'初回計測完了':`${t<before?'ベスト更新：':'ベストとの差：'}${Math.abs(t-before).toFixed(2)} 秒${t<before?' 短縮':' 遅い'}`;
  $('runLog').textContent=`完走！ ${report}${better?' 新しいベストです。':' 改造してもう一度比べてみましょう。'}`;
  if(better){records[key]={time:t,max:r.maxV*3.6,type:TYPES[cfg.type].label,parts:{...cfg.parts},fine:{...cfg.fine}};localStorage.setItem(recordsKey,JSON.stringify(records))}
 }
 updateBest();displayRace();
}
// Simulate the distance remaining until the *next* corner. A turn needs a
// finite braking distance: strong motors without enough stability can go out.
function raceStep(dt){
 if(!race?.active)return;
 const r=race,p=r.p,sector=((r.distance%ovalLength)+ovalLength)%ovalLength;
 const straight=2*straightHalf,arc=Math.PI*curveRadius;
 const onCurve=sector>=straight&&sector<straight+arc||sector>=2*straight+arc;
 const toCorner=sector<straight?straight-sector:sector<straight+arc?0:sector<2*straight+arc?2*straight+arc-sector:0;
 const limit=p.cornerLimit;
 // Grip and rollers make corner speed costly even below the derailment limit.
 // No hard speed clamp: physical deceleration produces a real trade-off.
 let forwardAccel=p.acceleration*Math.max(0,1-r.v/Math.max(1,p.maxSpeed));
 forwardAccel-=p.rollingLoss+p.airDrag*r.v*r.v;
 if(onCurve){forwardAccel-=p.cornerFriction*(r.v/Math.max(1,limit));r.curveTime+=dt;}
 // Brake just enough before entering corners; max braking is finite.
 if(!onCurve&&toCorner<8.0){
  const target=Math.max(.1,limit*.94);
  const stoppingDistance=Math.max(0,(r.v*r.v-target*target)/(2*p.brakePower));
  if(stoppingDistance+0.23>=toCorner&&r.v>target){
    const prior=forwardAccel;
    forwardAccel=-p.brakePower;
    r.cornerLoss+=Math.max(0,prior-forwardAccel)*dt*3.6;
  }
 }
 if(onCurve&&r.v>limit*.94){
  // The rollers scrub the side walls instead of imposing instant slowdown.
  const prior=forwardAccel;
  forwardAccel-=Math.min(5.0,(r.v-limit*.94)*3+p.cornerFriction);
  r.cornerLoss+=Math.max(0,prior-forwardAccel)*dt*3.6;
 }
 r.v=Math.max(0,Math.min(p.maxSpeed,r.v+forwardAccel*dt));
 const advance=r.v*dt;
 r.distance+=advance;r.time+=dt;r.maxV=Math.max(r.maxV,r.v);
 // Ratio is tied to lateral acceleration (v²/R) vs. supported load.
 if(onCurve){
  const overload=r.v/Math.max(.1,limit);
  r.peakLateral=Math.max(r.peakLateral,overload);
  if(overload>1.045)r.risk+=dt*(overload-1.045)*5;
  else r.risk=Math.max(0,r.risk-dt*.65);
 }else r.risk=Math.max(0,r.risk-dt*1.5);
 if(r.risk>.18){placeCar(Math.min(.9999,r.distance/ovalLength));stopRace(true);return}
 if(r.distance>=ovalLength){r.distance=ovalLength;placeCar(1);stopRace(false);return}
 placeCar(r.distance/ovalLength);
}
function updateBest(){const b=records.oval_3x_v03;$('bestRecord').textContent=b?`${b.time.toFixed(2)} 秒 / ${b.type} / ${b.max.toFixed(1)} km/h\n${GROUPS.map(g=>`${g.label}：${g.parts[b.parts[g.key]??0]?.name??'未設定'}`).join(' ｜ ')}\n微調整：${JSON.stringify(b.fine||{})}`:'まだ記録がありません'}
$('startRun').onclick=startRace;$('resetBest').onclick=()=>{records={};localStorage.removeItem(recordsKey);updateBest()};$('garageTab').onclick=()=>setScreen('garage');$('testTab').onclick=()=>setScreen('test');$('backGarage').onclick=()=>setScreen('garage');$('goTest').onclick=()=>setScreen('test');$('resetView').onclick=()=>setView('angle');document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
let last=performance.now(),accum=0,wheelAngle=0;const fixed=1/120;
function animate(now){requestAnimationFrame(animate);const elapsed=Math.min((now-last)/1000,.075);last=now;if(screen==='test'&&race?.active){accum+=elapsed*RACE_PLAYBACK_RATE;while(accum>=fixed){raceStep(fixed);accum-=fixed}displayRace()}
 const speed=screen==='test'&&race?race.v:0;const tireRadius=(choose('tire').diam/26*.165)*.9;wheelAngle-=speed*elapsed*(race?.active?RACE_PLAYBACK_RATE:0)/Math.max(.02,tireRadius);for(const w of wheelGroups)w.rotation.z=wheelAngle;
 if(screen==='garage'&&car){carContainer.position.set(0,GARAGE_CAR_Y,0);carContainer.rotation.y=0}
 controls.update();renderer.render(scene,camera)}
function resize(){const canvas=$('scene');const rect=canvas.getBoundingClientRect();if(rect.width&&rect.height){renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();if(screen==='test')fitTrackCamera()}}
new ResizeObserver(resize).observe($('scene'));window.addEventListener('resize',resize);renderUI();refreshCar();setScreen('garage');resize();requestAnimationFrame(animate);
