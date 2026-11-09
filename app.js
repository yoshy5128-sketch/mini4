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
  {name:'標準モーター',rpm:1,torque:1,mass:0,heat:0.85,durability:1.12},{name:'トルク型',rpm:.92,torque:1.27,mass:3,heat:1.05,durability:1.02},{name:'高回転型',rpm:1.25,torque:.84,mass:3,heat:1.3,durability:0.87},{name:'バランス改良型',rpm:1.13,torque:1.13,mass:4,heat:1.1,durability:1.05},{name:'ハイパワー型',rpm:1.34,torque:1.22,mass:9,heat:1.65,durability:0.66}]},
 {key:'battery',label:'電池',info:'高出力は初速に強い一方、電圧低下と容量に弱い。容量型は長距離に有利。',parts:[
  {name:'高出力型',mass:4,voltage:1.16,capacity:.72,sag:1.38,desc:'瞬発力重視'},{name:'バランス型',mass:0,voltage:1,capacity:1,sag:1,desc:'基準性能'},{name:'大容量型',mass:9,voltage:.95,capacity:1.58,sag:.70,desc:'持久力重視'}]},
 {key:'gear',label:'ギヤ',info:'数値の小さいギヤ比は最高速寄り、大きいギヤ比は加速力寄りになります。',parts:[
  {name:'3.5:1 超速',ratio:3.5,mass:1},{name:'3.7:1 高速',ratio:3.7,mass:1},{name:'4.0:1 標準',ratio:4,mass:0},{name:'4.2:1 加速',ratio:4.2,mass:0},{name:'5.0:1 登坂',ratio:5,mass:2}]},
 {key:'tire',label:'タイヤ',info:'小径は加速・安定寄り。大径は速度寄り。柔らかいタイヤはグリップが強めです。',parts:[
  {name:'小径ハード',diam:24,grip:.85,mass:-4},{name:'小径ソフト',diam:24,grip:1.19,mass:1},{name:'中径ノーマル',diam:26,grip:1,mass:0},{name:'大径ハード',diam:30,grip:.88,mass:4},{name:'大径ソフト',diam:30,grip:1.17,mass:7}]},
 {key:'roller',label:'ローラー',info:'摩擦の小さいローラーは旋回時の速度ロスを減らします。大径・安定型はコースアウトを抑制します。',parts:[
  {name:'樹脂ローラー 13mm',friction:1,stability:.90,diam:13,mass:0},{name:'樹脂ローラー 19mm',friction:1.06,stability:1.09,diam:19,mass:3},{name:'アルミローラー 13mm',friction:.81,stability:1.01,diam:13,mass:5},{name:'ベアリング 13mm',friction:.57,stability:1.02,diam:13,mass:7},{name:'ベアリング 19mm',friction:.66,stability:1.25,diam:19,mass:10}]},
 {key:'damper',label:'ダンパー',info:'マスダンパーは重量と引き換えに着地・コーナー安定性を向上させます。',parts:[
  {name:'装着なし',mass:0,stability:0,landing:0},{name:'軽量フロント',mass:5,stability:.06,landing:.12},{name:'軽量リア',mass:5,stability:.08,landing:.1},{name:'前後バランス',mass:12,stability:.16,landing:.21},{name:'ヘビーセット',mass:22,stability:.27,landing:.3}]},
 {key:'stay',label:'ステー',info:'特別パーツ（テスト中は無料）。カーボン素材は軽量で剛性が高い一方、取り付け方により衝撃を逃がしにくくなります。',parts:[
  {name:'標準FRPステー',mass:0,rigidity:1,landing:1,tag:'標準'},
  {name:'軽量カーボンステー',mass:-5,rigidity:1.10,landing:.99,tag:'特別'},
  {name:'強化カーボンステー',mass:-3,rigidity:1.20,landing:.94,tag:'特別'},
  {name:'超軽量カーボンステー',mass:-8,rigidity:.94,landing:.90,tag:'特別'}]},
 {key:'bodykit',label:'軽量ボディ',info:'特別パーツ（テスト中は無料）。肉抜きは加速に有利ですが、剛性や着地安定性が下がるためコースごとに選択してください。',parts:[
  {name:'ノーマルボディ',mass:0,drag:1,rigidity:1,landing:1,cut:0,tag:'標準'},
  {name:'軽量ボディキット',mass:-7,drag:.98,rigidity:.97,landing:.98,cut:1,tag:'特別'},
  {name:'ボディ肉抜き加工',mass:-11,drag:1.04,rigidity:.87,landing:.88,cut:2,tag:'特別'},
  {name:'超軽量レースボディ',mass:-15,drag:.95,rigidity:.82,landing:.83,cut:3,tag:'特別'}]},
 {key:'brake',label:'ブレーキ',info:'ブレーキは立体コース向け。今回の平面オーバルでは重さとわずかな接触抵抗だけが影響します。',parts:[
  {name:'ブレーキなし',mass:0,drag:0},{name:'薄型フロント',mass:2,drag:.005},{name:'薄型リア',mass:2,drag:.004},{name:'前後セッティング',mass:5,drag:.009},{name:'強力ブレーキ',mass:8,drag:.018}]}
];
const defaults={motor:0,battery:1,gear:2,tire:2,roller:0,damper:0,brake:0,stay:0,bodykit:0};
const settingsKey='mini4wd_lab_v01_settings';const recordsKey='mini4wd_lab_v02_records'; // Physics changed: keep setups, separate incompatible time records.
function getStorage(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
let cfg=getStorage(settingsKey,{type:0,parts:{...defaults}});
if(!Number.isInteger(cfg.type)||cfg.type<0||cfg.type>=TYPES.length)cfg.type=0;
cfg.parts={...defaults,...cfg.parts};cfg.fine={rollerHeight:0,rollerSpread:0,damperBias:0,brakeHeight:2,motorTune:0,...cfg.fine};const FINE_RANGES={rollerHeight:[-2,2],rollerSpread:[-2,2],damperBias:[-2,2],brakeHeight:[0,4],motorTune:[-2,2]};for(const [k,[lo,hi]] of Object.entries(FINE_RANGES))cfg.fine[k]=Math.max(lo,Math.min(hi,Math.round(Number(cfg.fine[k])||0))); for(const group of GROUPS){if(!Number.isInteger(cfg.parts[group.key])||cfg.parts[group.key]<0||cfg.parts[group.key]>=group.parts.length)cfg.parts[group.key]=defaults[group.key]}
let records=getStorage(recordsKey,{});let activeGroup='motor',screen='garage';let courseMode='oval';let race=null,car=null,track=null,visualReady=false;let wheelGroups=[];
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
 const batteryPart=choose('battery'),stay=choose('stay'),bodykit=choose('bodykit');const mass=t.mass+m.mass+g.mass+ti.mass+r.mass+d.mass+b.mass+batteryPart.mass+stay.mass+bodykit.mass;const fine=cfg.fine;
 const wheel=ti.diam/26, ratio=g.ratio;
 const tune=1+fine.motorTune*.032;
 const maxSpeed=12.3*m.rpm*tune*batteryPart.voltage*wheel*(4/ratio)/Math.sqrt(t.drag*bodykit.drag);
 const acceleration=11.5*m.torque*t.torque*tune*batteryPart.voltage*(ratio/4)/wheel*(124/mass);
 const grip=ti.grip*t.grip;
 const stability=t.stability*r.stability*stay.rigidity*bodykit.rigidity*(1+d.stability)*Math.pow(124/mass,.15)*(1+fine.rollerSpread*.036-fine.rollerHeight*.032+(d.mass?(.018*Math.abs(fine.damperBias))*(-1):0));
 // A higher supported lateral load permits faster turns, but weighs more.
 const cornerLimit=9.2*Math.pow(TRACK_SCALE,.25)*Math.sqrt(Math.max(.35,grip*stability))*(1+.025*(r.diam-13)/6); // Spread and roller height alter the effective stability.
 const cornerFriction=.36*r.friction+Math.max(0,b.drag)*2.5+Math.max(0,fine.rollerSpread)*.045;
 const brakePower=9+4*Math.max(0,grip-1)+3*Math.max(0,stability-1)+(b.mass?(4-fine.brakeHeight)*.35:0);
 return {mass,maxSpeed,acceleration,grip,stability,cornerLimit,cornerFriction,brakePower,
  rollingLoss:.14+.09*r.friction+(b.mass?(4-fine.brakeHeight)*.035:0),airDrag:.0045*t.drag,landing:(.5+d.landing)*stability*stay.landing*bodykit.landing*(1+(d.mass?fine.damperBias*.045:0)),fine:{...fine}};
}
function score(p){return {speed:Math.round(Math.min(100,p.maxSpeed/18.8*100)),accel:Math.round(Math.min(100,p.acceleration/21*100)),corner:Math.round(Math.min(100,p.cornerLimit/15*100)),stability:Math.round(Math.min(100,(p.stability*.9+p.landing*.1)/1.7*100))}}
function miniLineSVG(series,{min=0,max=100,width=320,height=150,xlabels=true}={}){
 const left=31,right=9,top=12,bottom=xlabels?23:9,W=width-left-right,H=height-top-bottom;
 const maxLength=Math.max(2,...series.map(a=>a.points.length));
 const xs=i=>left+i*W/(maxLength-1),ys=v=>top+H*(1-(Math.max(min,Math.min(max,v))-min)/(max-min));
 const grid=[0,.25,.5,.75,1].map(t=>`<line x1="${left}" y1="${top+t*H}" x2="${width-right}" y2="${top+t*H}" stroke="#385064" stroke-width=".7"/><text x="${left-4}" y="${top+t*H+3}" text-anchor="end" font-size="9" fill="#9cb9cd">${(max-t*(max-min)).toFixed(0)}</text>`).join('');
 const plots=series.map(a=>`<polyline fill="none" stroke="${a.color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" points="${a.points.map((v,i)=>`${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join(' ')}"/>`).join('');
 return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="性能変化グラフ" preserveAspectRatio="none">${grid}${plots}${xlabels?`<text x="${width/2}" y="${height-3}" font-size="9" text-anchor="middle" fill="#b6cbd8">経過 / 周回 →</text>`:''}</svg>`;
}
function estimatedDurability(){
 const m=choose('motor'),bat=choose('battery'),ti=choose('tire');
 const output=1+cfg.fine.motorTune*.06;
 // This is a comparative endurance score; it deliberately follows the same
 // heat/capacity/wear directions as the race consumption model.
 const cell=bat.capacity/Math.max(.55,bat.sag);
 const motor=m.durability/(Math.max(.55,m.heat)*Math.pow(Math.max(.7,output),1.3));
 const tire=ti.grip>1.05?.90:1.05;const structure=choose('stay').rigidity*choose('bodykit').rigidity;
 return Math.max(1,Math.min(100,Math.round(66*Math.pow(cell,.40)*Math.pow(motor,.48)*tire*Math.pow(structure,.35))));
}
function renderTuningCharts(){
 const target=$('tuningCharts');if(!target)return;
 const m=choose('motor');
 const consumption=(a,b)=>Array.from({length:13},(_,i)=>Math.max(0,100-i*7.1*a/b));
 if(activeGroup==='battery'){
  const batteries=[{name:'高出力',c:'#f2a768',v:GROUPS.find(g=>g.key==='battery').parts[0]},{name:'バランス',c:'#58d6fa',v:GROUPS.find(g=>g.key==='battery').parts[1]},{name:'大容量',c:'#74dfab',v:GROUPS.find(g=>g.key==='battery').parts[2]}];
  const curves=batteries.map(v=>({color:v.c,points:consumption(v.v.sag*m.heat,v.v.capacity)}));
  target.innerHTML=`<div class="chartTitle">電池3タイプ・残量予測</div>${miniLineSVG(curves,{height:105})}<div class="chartLegend">${batteries.map(v=>`<span style="color:${v.c}">● ${v.name}</span>`).join('')}</div><div class="chartNote">装着：${choose('battery').name} / 同じ負荷で比較した相対予測</div>`;
 }else if(activeGroup==='motor'){
  const heatCurve=Array.from({length:13},(_,i)=>Math.min(125,25+80*(1-Math.exp(-i*.19*m.heat*(1+cfg.fine.motorTune*.13)))));
  const lifeCurve=Array.from({length:13},(_,i)=>Math.max(0,100-i*4.1*m.heat/Math.max(.5,m.durability)*(1+cfg.fine.motorTune*.13)));
  target.innerHTML=`<div class="chartTitle">選択モーター・温度予測</div>${miniLineSVG([{color:'#f5a46a',points:heatCurve}],{min:0,max:125,height:100})}<div class="chartTitle">モーター寿命予測</div>${miniLineSVG([{color:'#b8a4ed',points:lifeCurve}],{height:100})}<div class="chartNote">${m.name} / 発熱×${m.heat.toFixed(2)}・耐久×${m.durability.toFixed(2)}（比較用モデル）</div>`;
 }else{
  target.innerHTML='';
 }
 target.classList.toggle('hidden',!target.innerHTML);
}

function snapshotLap(r,lapTime){
 r.telemetry.push({lap:r.laps,time:lapTime,battery:r.battery,tire:r.tire,temp:r.motorTemp,health:r.motorHealth});
 if(r.telemetry.length>150)r.telemetry.shift();
 renderLapAnalysis(r);
}
function renderLapAnalysis(r=race){
 const target=$('lapAnalysis');if(!target)return;
 if(!r?.telemetry?.length){target.innerHTML='<div class="chartNote">周回を完了すると、タイム・電池・タイヤ・モーターの推移が表示されます。</div>';return;}
 const rows=r.telemetry;
 const timingMax=Math.max(5,...rows.map(v=>v.time))*1.12;
 target.innerHTML=`<div class="chartTitle">周回タイム（秒）</div>${miniLineSVG([{color:'#5bd8ff',points:rows.map(v=>v.time)}],{max:timingMax})}<div class="chartTitle">消耗推移（%）</div>${miniLineSVG([{color:'#72e0a7',points:rows.map(v=>v.battery)},{color:'#e7cf6e',points:rows.map(v=>v.tire)},{color:'#b8a4ed',points:rows.map(v=>v.health)}])}<div class="chartLegend"><span style="color:#72e0a7">● 電池</span><span style="color:#e7cf6e">● タイヤ</span><span style="color:#b8a4ed">● モーター寿命</span></div><div class="chartTitle">モーター温度（℃）</div>${miniLineSVG([{color:'#f3a468',points:rows.map(v=>v.temp)}],{min:0,max:Math.max(100,...rows.map(v=>v.temp))*1.1})}<div class="chartNote">${rows.length}周記録 / 直近 ${rows.at(-1).time.toFixed(2)}秒 / 電池 ${rows.at(-1).battery.toFixed(1)}% / モーター ${rows.at(-1).temp.toFixed(1)}℃</div>`;
}
function persist(){localStorage.setItem(settingsKey,JSON.stringify(cfg))}
function renderUI(){ $('machines').innerHTML=TYPES.map((t,i)=>`<button class="pick ${cfg.type===i?'active':''}" data-type="${i}">${t.label}<small>${t.short}</small></button>`).join('');
 $('partTabs').innerHTML=GROUPS.map(g=>`<button class="partTab ${g.key===activeGroup?'active':''}" data-group="${g.key}">${g.label}</button>`).join('');
 const group=GROUPS.find(x=>x.key===activeGroup);$('parts').innerHTML=group.parts.map((p,i)=>`<button class="option ${cfg.parts[group.key]===i?'active':''}" data-part="${i}"><div><strong>${p.name}</strong><br><span>${p.mass>0?'+':''}${p.mass}g / ${group.key==='motor'?`回転×${p.rpm} / 熱×${p.heat}`:group.key==='battery'?`出力×${p.voltage} / 容量×${p.capacity}`:group.key==='gear'?`比率 ${p.ratio}:1`:group.key==='tire'?`${p.diam}mm`:group.key==='roller'?`${p.diam}mm`:group.key==='damper'?`安定+${Math.round(p.stability*100)}%`:group.key==='stay'?`剛性×${p.rigidity.toFixed(2)}`:group.key==='bodykit'?`剛性×${p.rigidity.toFixed(2)} / 空気抵抗×${p.drag.toFixed(2)}`:'抵抗係数 '+p.drag}</span></div>${cfg.parts[group.key]===i?'<span class="chip">装着中</span>':p.tag==='特別'?'<span class="chip">特別・無料</span>':''}</button>`).join('');$('partInfo').textContent=group.info;
 const p=physics(),s=score(p);renderTuningCharts();$('statRows').innerHTML=[['最高速',s.speed],['加速',s.accel],['コーナー',s.corner],['安定性',s.stability],['耐久',estimatedDurability()]].map(([name,val])=>`<div class="stat"><span>${name}</span><div class="bar"><div class="fill" style="width:${val}%"></div></div><strong>${val}</strong></div>`).join('');
 $('viewStatus').innerHTML=`<strong>${TYPES[cfg.type].name}</strong><br>総重量 ${p.mass} g<br>理論最高速 ${(p.maxSpeed*3.6).toFixed(1)} km/h<br>全パーツ無料`;renderFine();}
const FINE_CONTROLS=[
 {key:'rollerHeight',label:'ローラー高さ',unit:'mm',scale:2,desc:'低いほどコーナーの安定性が増す傾向'},
 {key:'rollerSpread',label:'ローラー前後幅',unit:'mm',scale:12,desc:'前後幅を広げると安定性が向上（抵抗も増加）'},
 {key:'damperBias',label:'ダンパー配置',unit:'',scale:1,desc:'−：後寄り / ＋：前寄り（装着時に有効）'},
 {key:'motorTune',label:'モーター出力調整',unit:'段階',scale:1,desc:'−：冷却・長寿命 / ＋：最高出力・高発熱'},
 {key:'brakeHeight',label:'ブレーキ地上高',unit:'mm',scale:1,desc:'低いほど路面抵抗が増える（装着時に有効）'}
];
function renderFine(){const node=$('fineControls');if(!node)return;
 node.innerHTML=FINE_CONTROLS.map(c=>{const [a,b]=FINE_RANGES[c.key],v=cfg.fine[c.key],shown=c.key==='brakeHeight'?v:c.key==='damperBias'?(v===0?'中央':v<0?'後方 '+Math.abs(v):'前方 '+v):(v*c.scale>0?'+':'')+(v*c.scale)+c.unit;return `<label class="fineRow"><span><strong>${c.label}</strong><small>${c.desc}</small></span><div class="fineAdjust"><button data-fine="${c.key}" data-step="-1" ${v<=a?'disabled':''} aria-label="${c.label}を下げる">−</button><output>${shown}</output><button data-fine="${c.key}" data-step="1" ${v>=b?'disabled':''} aria-label="${c.label}を上げる">＋</button></div></label>`}).join('');}
$('fineControls').addEventListener('click',e=>{const b=e.target.closest('[data-fine]');if(!b)return;const k=b.dataset.fine,step=Number(b.dataset.step),[min,max]=FINE_RANGES[k];cfg.fine[k]=Math.max(min,Math.min(max,cfg.fine[k]+step));refreshCar()});
$('resetFine').onclick=()=>{cfg.fine={rollerHeight:0,rollerSpread:0,damperBias:0,brakeHeight:2,motorTune:0};refreshCar()};
// Reset every tuning parameter in one operation, without changing TYPE S/P/B.
$('normalSet').onclick=()=>{
 cfg.parts={...defaults};
 cfg.fine={rollerHeight:0,rollerSpread:0,damperBias:0,brakeHeight:2,motorTune:0};
 activeGroup='motor';
 refreshCar(); // Persists the full setting, updates stats and rebuilds the 3D machine.
 const button=$('normalSet');
 button.textContent='✓ NormalSET';
 window.setTimeout(()=>{button.textContent='NormalSET'},950);
};

$('machines').addEventListener('click',e=>{let b=e.target.closest('[data-type]');if(b){cfg.type=Number(b.dataset.type);refreshCar()}});
$('partTabs').addEventListener('click',e=>{let b=e.target.closest('[data-group]');if(b){activeGroup=b.dataset.group;renderUI()}});
$('parts').addEventListener('click',e=>{let b=e.target.closest('[data-part]');if(b){cfg.parts[activeGroup]=Number(b.dataset.part);refreshCar()}});
$('saveSetup').onclick=()=>{persist();$('saveSetup').textContent='✓ 保存しました';setTimeout(()=>$('saveSetup').textContent='このセッティングを保存',1200)};

// Scene / camera / lighting
const renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setClearColor(0x0a1721);renderer.shadowMap.enabled=false;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a1721);
const GARAGE_FOG=new THREE.Fog(0x0a1721,22,65);
scene.fog=GARAGE_FOG;
const camera=new THREE.PerspectiveCamera(38,1,.25,350);camera.position.set(2.8,2.25,3.7);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.25,0);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=1.6;controls.maxDistance=110;controls.maxPolarAngle=Math.PI*.48;
scene.add(new THREE.HemisphereLight(0xaadffc,0x1c2b37,2.1));const sun=new THREE.DirectionalLight(0xffeee0,3.6);sun.position.set(4,9,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;scene.add(sun);
const ambientGlow=new THREE.PointLight(0x30bfff,18,7);ambientGlow.position.set(-3,2,-2);scene.add(ambientGlow);
const garageGroup=new THREE.Group();scene.add(garageGroup);const trackGroup=new THREE.Group();trackGroup.visible=false;scene.add(trackGroup);const carContainer=new THREE.Group();scene.add(carContainer);
// Ver.0.4.4: Four inward-facing championship arena walls.
// Separate arena-only 3D group; no impact on track geometry or physics.
const arenaBackdrop = new THREE.Group();scene.add(arenaBackdrop);arenaBackdrop.visible=false;
new THREE.TextureLoader().load('./arena_background.jpg',tex=>{
 tex.colorSpace=THREE.SRGBColorSpace;
 tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 const arenaSize=280,half=arenaSize/2;
 const panelHeight=arenaSize*(tex.image.height/tex.image.width);
 const material=new THREE.MeshBasicMaterial({map:tex,side:THREE.FrontSide,fog:false,depthWrite:false,depthTest:true});
 const panelGeometry=new THREE.PlaneGeometry(arenaSize,panelHeight);
 const specs=[
  {label:'北',x:0,z:-half,rotation:0},
  {label:'南',x:0,z:half,rotation:Math.PI},
  {label:'東',x:half,z:0,rotation:-Math.PI/2},
  {label:'西',x:-half,z:0,rotation:Math.PI/2}
 ];
 for(const side of specs){
  const wall=new THREE.Mesh(panelGeometry,material);
  wall.name='大会背景 '+side.label;
  // Align the panorama panel's bottom edge to the actual venue floor.
  // The old fixed Y=55 left the lower portion floating below the ground.
  wall.position.set(side.x,panelHeight/2-0.03,side.z);
  wall.rotation.y=side.rotation;
  wall.renderOrder=-1;
  wall.frustumCulled=false;
  arenaBackdrop.add(wall);
 }
},undefined,error=>{console.warn('大会背景画像を読み込めませんでした',error)});
function syncArenaBackdrop(){arenaBackdrop.visible=screen==='test' && $('arenaBackground').checked;}
function syncSceneEnvironment(){
 // Remove distance-to-black fog during races. Match the horizon to the floor
 // even when the user zooms far out beyond the 3D ground plane.
 if(screen==='test'){
  scene.fog=null;
  scene.background.setHex(GROUND_COLORS[groundColorChoice]);
 }else{
  scene.fog=GARAGE_FOG;
  scene.background.setHex(0x0a1721);
 }
}
const mat=(color,metalness=0,roughness=.55)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const metal=mat(0x7b929c,.8,.3),black=mat(0x141b22,.18,.73),rubber=mat(0x101319,.04,.94),carbon=mat(0x242f38,.18,.7),silver=mat(0xc4d6db,.9,.22),gold=mat(0xc9a15f,.83,.22);
function box(parent,w,h,d,material,x=0,y=0,z=0){const v=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);v.position.set(x,y,z);v.castShadow=true;v.receiveShadow=true;parent.add(v);return v}
function cyl(parent,r1,r2,height,material,x,y,z,rotZ=0){const v=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,height,16),material);v.rotation.z=rotZ;v.position.set(x,y,z);v.castShadow=true;parent.add(v);return v}
function tor(parent,r,tube,material,x,y,z,rotX=Math.PI/2){const v=new THREE.Mesh(new THREE.TorusGeometry(r,tube,8,32),material);v.position.set(x,y,z);v.rotation.x=rotX;v.castShadow=true;parent.add(v);return v}
const garageFloor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),mat(0x182733,.1,.85));garageFloor.rotation.x=-Math.PI/2;garageFloor.receiveShadow=true;garageGroup.add(garageFloor);
const podium=new THREE.Mesh(new THREE.CylinderGeometry(1.43,1.53,.17,72),mat(0x263e4b,.62,.32));podium.position.y=.10;podium.receiveShadow=true;garageGroup.add(podium);
const rim=new THREE.Mesh(new THREE.TorusGeometry(1.42,.026,8,80),new THREE.MeshBasicMaterial({color:0x55d9f2}));rim.rotation.x=Math.PI/2;rim.position.y=.195;garageGroup.add(rim);
const grid=new THREE.GridHelper(16,28,0x345265,0x213847);grid.position.y=.004;garageGroup.add(grid);
function buildCar(){wheelGroups=[];const group=new THREE.Group();const t=TYPES[cfg.type],ti=choose('tire'),r=choose('roller'),d=choose('damper'),b=choose('brake'),m=choose('motor');const body=mat(t.color,.25,.3),accent=mat(t.accent,.32,.34),stayPart=choose('stay'),kit=choose('bodykit');const scale=0.9;group.scale.setScalar(scale);
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
 box(group,.73,.17*(1-kit.cut*.12),.53,body,-.22,.32,0);box(group,.49,.22*(1-kit.cut*.14),.39,body,-.17,.47,0);
 box(group,.32,.055,.37,accent,-.18,.61,0);
 for(const z of [-.285,.285]){box(group,.92,.075,.095,accent,-.07,.31,z);box(group,.45,.06,.10,body,.45,.29,z)}
 // Body style differences
 if(cfg.type===0){box(group,.19,.035,.68,accent,-.66,.49,0);box(group,.48,.035,.10,body,-.54,.35,0);}
 if(cfg.type===1){box(group,.26,.12,.55,body,-.65,.53,0);box(group,.42,.055,.73,accent,-.64,.62,0);}
 if(cfg.type===2){box(group,.5,.055,.65,accent,-.53,.46,0);box(group,.28,.045,.66,body,.55,.40,0);}
 // Lightweight body variations are visible in the garage, not only as numbers.
 if(kit.cut>=1){
   for(const z of [-.23,.23])box(group,.28,.014,.055,black,-.18,.625-kit.cut*.014,z);
 }
 if(kit.cut>=2){
   for(const x of [-.38,.28])for(const z of [-.25,.25])box(group,.12,.013,.06,black,x,.397-kit.cut*.016,z);
 }
 if(kit.cut===3){box(group,.44,.026,.33,accent,.33,.39,0)}
 // Metallic motor and battery detail visible on chassis edges
 box(group,.37,.16,.23,metal,-.39,.16,0);for(const z of [-.21,.21])box(group,.42,.11,.10,gold,.1,.20,z);
 // Front and rear roller units share a single centerline (local Z = 0).
 // Both plates are built from the same component, and all bolts/rollers are
 // attached to the plate's center rather than to independent world offsets.
 for(const side of [-1,1]){
  const x=side*(.78+cfg.fine.rollerSpread*.055);
  const h=cfg.fine.rollerHeight*.024;
  const mount=new THREE.Group();
  mount.position.set(x,0,0);group.add(mount);
  // Reinforce the rear stay with a short central brace; no off-axis parts.
  if(side<0) box(mount,.31,.035,.16,carbon,.13,.205+h,0);
  box(mount,.15,stayPart.mass<0?.028:.045,1.10,stayPart.mass<0?mat(0x192b31,.28,.56):carbon,0,.22+h,0);
  for(const z of [-.52,.52]){
   cyl(mount,.021,.021,.13,metal,0,.29+h,z);
   const rad=r.diam/13*.078;
   cyl(mount,rad,rad,.065,r.friction<.7?gold:silver,0,.335+h,z);
   cyl(mount,rad*.61,rad*.61,.07,black,0,.37+h,z);
   tor(mount,rad*.7,.008,metal,0,.379+h,z,Math.PI/2);
   if(side<0){
    box(mount,.042,.17,.055,metal,0,.38+h,z);
    cyl(mount,.036,.036,.032,silver,0,.46+h,z);
   }
  }
 }
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
// User-selectable course base color (separate from the road surface and background walls).
const GROUND_COLORS={gray:0x626b72,green:0x2d6643,khaki:0x68664a,black:0x14272c};
const groundColorStorageKey='mini4wd_lab_ground_color';
function readGroundColor(){try{const value=localStorage.getItem(groundColorStorageKey);return Object.hasOwn(GROUND_COLORS,value)?value:'green'}catch{return 'green'}}
let groundColorChoice=readGroundColor();
const trackGround=new THREE.Mesh(new THREE.PlaneGeometry(320,320),new THREE.MeshBasicMaterial({color:GROUND_COLORS[groundColorChoice],side:THREE.DoubleSide}));
trackGround.rotation.x=-Math.PI/2;trackGround.position.y=-.03;
// The floor extends beyond all four venue walls to prevent an exposed void
// when zooming or orbiting. Keep a single plane to avoid Z-fighting.
trackGround.receiveShadow=false;trackGround.castShadow=false;trackGroup.add(trackGround);
solidRoad(curveRadius+TRACK_HALF_WIDTH,curveRadius-TRACK_HALF_WIDTH);
rail(curveRadius+TRACK_HALF_WIDTH,0xe76566);rail(curveRadius-TRACK_HALF_WIDTH,0xe5ebf0);
for(let i=0;i<90;i++){const p=oval(i/90,curveRadius+TRACK_HALF_WIDTH+.10);const pole=cyl(trackGroup,.025,.025,.35,metal,p.x,.18,p.z);}
for(let i=0;i<5;i++){const p=oval(.018+i*.0017,curveRadius-.1);box(trackGroup,.035,.012,1.65,i%2?black:silver,p.x,.10,p.z)}
const finish=box(trackGroup,.16,.14,1.9,mat(0xe2d2b7,.0,.9),-straightHalf+.5,.13,-curveRadius);finish.rotation.y=0;
const trackSign=box(trackGroup,3,.05,.85,mat(0x1a3442),0,.01,0);

// v0.4.0 - The original stable, unlit oval is untouched. A separate surface
// adds slopes and a jump, without any coplanar overlays (no Z fighting).
const flatTrackMeshes=[...trackGroup.children];
const technicalGroup=new THREE.Group();trackGroup.add(technicalGroup);
const smooth=x=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*(3-2*x)};
function elevation(u){
 const v=((u%1)+1)%1;
 const bridge=1.25*(smooth((v-.11)/.095)-smooth((v-.30)/.095));
 const jump=.82*(smooth((v-.58)/.065)-smooth((v-.66)/.04));
 return bridge+jump;
}
function roadSlope(u){return (elevation(u+.0003)-elevation(u-.0003))/(.0006*ovalLength)}
function addTechnicalSurface(){
 const N=600,verts=[],indices=[];
 for(let i=0;i<=N;i++){
  const u=i/N,inner=oval(u,curveRadius-TRACK_HALF_WIDTH),outer=oval(u,curveRadius+TRACK_HALF_WIDTH),y=.045+elevation(u);
  verts.push(outer.x,y,outer.z,inner.x,y,inner.z);
  if(i<N){const j=i*2;indices.push(j,j+1,j+2,j+1,j+3,j+2)}
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();
 const road=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0x455563,side:THREE.DoubleSide,depthWrite:true}));
 road.receiveShadow=false;road.castShadow=false;technicalGroup.add(road);
 for(const [offset,color] of [[TRACK_HALF_WIDTH,0xe76566],[-TRACK_HALF_WIDTH,0xe5ebf0]]){
  const pts=[];
  for(let i=0;i<=N;i++){const u=i/N,q=oval(u,curveRadius+offset);pts.push(new THREE.Vector3(q.x,.125+elevation(u),q.z))}
  const geo=new THREE.BufferGeometry().setFromPoints(pts);
  const rail=new THREE.Line(geo,new THREE.LineBasicMaterial({color}));technicalGroup.add(rail);
 }
 for(let i=0;i<64;i++){
  const u=i/64,q=oval(u,curveRadius+TRACK_HALF_WIDTH+.11),h=elevation(u);
  const post=cyl(technicalGroup,.025,.025,.34,metal,q.x,h+.18,q.z);post.castShadow=false;
 }
 // Supports are intentionally below the elevated surface, not overlapping it.
 for(const u of [.15,.19,.24,.28,.34,.61,.645]){
  const q=oval(u);
  const h=elevation(u);
  if(h>.15)box(technicalGroup,.20,h,.20,carbon,q.x,h/2,q.z);
 }
}
addTechnicalSurface();
function showCourse(){
 // The selectable venue ground is shared by both track types.
 // Only flat oval road/rails/props are hidden on the technical course.
 flatTrackMeshes.forEach(o=>o.visible=(o===trackGround)||courseMode==='oval');
 trackGround.visible=true;
 technicalGroup.visible=courseMode==='technical';
 const heading=document.getElementById('courseHeading');
 if(heading)heading.textContent=courseMode==='oval'?'TEST TRACK / 3倍ロングオーバル':'TEST TRACK / 立体テクニカル';
 const description=document.getElementById('courseDescription');
 if(description)description.textContent=courseMode==='oval'?'約110.7mの平面コース。加速とコーナー性能を比較します。':'約110.7m。登坂・下り坂・ジャンプを含む。ブレーキとダンパーの効果を検証します。';
 const selected=document.getElementById('courseSelect');if(selected)selected.value=courseMode;
}

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
 controls.target.set(0,courseMode==='technical'?.5:0,0);
 camera.position.copy(direction.multiplyScalar(requiredDistance)).add(new THREE.Vector3(0,courseMode==='technical'?.5:0,0));
 controls.minDistance=3;
 controls.maxDistance=Math.max(110,requiredDistance*2.5);
 camera.updateProjectionMatrix();
}
function setView(view){if(screen==='test'){fitTrackCamera();}
else{camera.fov=38;controls.target.set(-.55,.28,0);camera.position.copy(({front:[3.8,1.5,0],side:[0,1.4,3.9],top:[.01,4.5,.01],angle:[2.8,2.3,3.8]})[view||'angle']?new THREE.Vector3(...({front:[3.8,1.5,0],side:[0,1.4,3.9],top:[.01,4.5,.01],angle:[2.8,2.3,3.8]})[view||'angle']):new THREE.Vector3(2.8,2.3,3.8));camera.position.x-=.55;}camera.updateProjectionMatrix();controls.update();}
function setScreen(mode){screen=mode;showCourse();syncArenaBackdrop();syncSceneEnvironment();const testing=mode==='test';$('garagePane').classList.toggle('hidden',testing);$('testPane').classList.toggle('hidden',!testing);$('garageTab').classList.toggle('active',!testing);$('testTab').classList.toggle('active',testing);garageGroup.visible=!testing;trackGroup.visible=testing;$('overLine').textContent=testing?'OVAL TEST CIRCUIT':'CUSTOM MACHINE WORKSHOP';$('overTitle').textContent=testing?'TIME ATTACK':'TUNING GARAGE';$('overHint').textContent=testing?'従来の3倍の距離・1周のラップタイムを計測':'ドラッグ：回転　ホイール/ピンチ：拡大縮小';$('viewStatus').classList.toggle('hidden',testing);$('sceneStats').classList.toggle('hidden',testing);if(!testing){race=null;carContainer.position.set(0,GARAGE_CAR_Y,0);carContainer.rotation.set(0,0,0)}else{placeCar(0);carContainer.rotation.x=0;carContainer.rotation.z=0}setView('angle');updateBest()}
function placeCar(u){const p=oval(u);carContainer.position.set(p.x,TRACK_CAR_Y+(courseMode==='technical'?elevation(u):0),p.z);carContainer.rotation.set(0,-p.ang,courseMode==='technical'?Math.atan(roadSlope(u)):0)}
// v0.3.8: keep the fast forward/outward exit, then show the actual
// random tumble while the car is still near the rail and inside the scene.
// The previous 1.05s exit phase moved the vehicle far out of view before
// any rotation occurred, so all four variants appeared identical.
let lastCrashVariant=-1;
const CRASH_VARIANTS=[
 {id:'slide',label:'滑走'},
 {id:'roll',label:'横転'},
 {id:'flip',label:'前転'},
 {id:'spin',label:'激しい回転'}
];
function startCrashAnimation(){
 const r=race;if(!r)return;
 const pos=carContainer.position.clone();
 const p0=oval(Math.min(.9999,r.distance/ovalLength));
 const p1=oval((r.distance+.08)/ovalLength);
 const forward=new THREE.Vector3(p1.x-p0.x,0,p1.z-p0.z).normalize();
 // Retain the exiting direction established in v0.3.6.
 const outward=new THREE.Vector3(forward.z,0,-forward.x);
 const speed=Math.max(8,r.v);
 // Choose all four types without ever repeating the immediately previous one.
 const choices=CRASH_VARIANTS.map((_,i)=>i).filter(i=>i!==lastCrashVariant);
 const variantIndex=choices[Math.floor(Math.random()*choices.length)];
 lastCrashVariant=variantIndex;
 const variant=CRASH_VARIANTS[variantIndex];
 const direction=Math.random()<.5?-1:1;
 // Start falling as soon as the whole vehicle has passed the outer rail,
 // rather than waiting until it is many metres away / outside the camera.
 const exitDuration=THREE.MathUtils.clamp(1.10/(speed*.32),.21,.40);
 const fallDuration=variant.id==='slide'?.80:1.18;
 const spinAngle=variant.id==='roll'?direction*(Math.PI*(1.5+Math.random())):
                 variant.id==='flip'?direction*(Math.PI*(1.5+Math.random())):
                 variant.id==='spin'?direction*(Math.PI*(3.2+Math.random()*1.8)):0;
 r.crash={active:true,t:0,exitDuration,fallDuration,
   start:pos,forward,outward,speed,orientation:carContainer.quaternion.clone(),
   variant:variant.id,label:variant.label,direction,spinAngle};
}
function updateCrashAnimation(dt){
 const c=race?.crash;if(!c?.active)return;
 c.t=Math.min(c.exitDuration+c.fallDuration,c.t+dt);
 const t=Math.min(c.t,c.exitDuration);
 // Stage 1: keep the already-approved fast, forward-moving course exit.
 const forwardDistance=c.speed*1.18*t;
 const outwardDistance=c.speed*(.32*t+.16*t*t);
 carContainer.position.copy(c.start)
   .addScaledVector(c.forward,forwardDistance)
   .addScaledVector(c.outward,outwardDistance);
 carContainer.position.y=TRACK_CAR_Y;
 carContainer.quaternion.copy(c.orientation);
 if(c.t>c.exitDuration){
  const e=c.t-c.exitDuration;
  const u=Math.min(1,e/c.fallDuration);
  // Stage 2: continue moving with the SAME velocity at the instant of exit.
  // Air/ground resistance slows the machine progressively, NEVER freezes it
  // at a fixed location while the tumble animation is playing.
  const drag=1.10; // 1/sec; initial velocity is continuous across the phase boundary
  const move=(1-Math.exp(-drag*e))/drag;
  const forwardVelocity=c.speed*1.18;
  const outwardVelocity=c.speed*(.32+.32*c.exitDuration);
  carContainer.position.addScaledVector(c.forward,forwardVelocity*move);
  carContainer.position.addScaledVector(c.outward,outwardVelocity*move);
  if(c.variant==='slide'){
   carContainer.quaternion.premultiply(
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),c.direction*.20*u));
  }else{
   // Rotation and translation happen simultaneously throughout the tumble.
   const axis=c.variant==='roll'?c.forward:
    c.variant==='flip'?c.outward:
    new THREE.Vector3(c.forward.x*.60+c.outward.x*.25,.42*c.direction,
                      c.forward.z*.60+c.outward.z*.25).normalize();
   const spin=c.spinAngle*u;
   carContainer.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(axis,spin));
   const bounce=Math.abs(Math.sin(Math.PI*u*(c.variant==='spin'?3:2)))*(1-u);
   carContainer.position.y=TRACK_CAR_Y+bounce*(c.variant==='spin'?.36:c.variant==='flip'?.24:.17);
  }
 }
 if(c.t>=c.exitDuration+c.fallDuration)c.active=false;
}
// Ver.0.4.9: optional long-run wear. Values are game-balance prototypes,
// not laboratory measurements. Never mutate the setup's reference physics.
function raceRecordKey(r=race){
 const base=courseMode==='technical'?'technical_v053':'oval_3x_v053';
 return r?.wearEnabled?base+'_wear050':base;
}
function deriveRunningPhysics(r){
 const p=r.p;
 if(!r.wearEnabled)return p;
 const battery=r.battery/100, tire=r.tire/100, health=r.motorHealth/100;
 const batteryPart=choose('battery');
 const voltageFactor=Math.max(.38,1-(1-battery)*(.36*batteryPart.sag));
 const heatFactor=r.motorTemp>65?Math.max(.60,1-(r.motorTemp-65)*(.0068/motorDurability())):1;
 const healthFactor=.55+.45*health;
 const tractionFactor=.74+.26*Math.max(0,tire);
 const stabilityFactor=.82+.18*Math.max(0,tire);
 return {...p,
  maxSpeed:p.maxSpeed*voltageFactor*heatFactor*healthFactor,
  acceleration:p.acceleration*(.55+.45*battery)*heatFactor*healthFactor,
  grip:p.grip*tractionFactor,
  stability:p.stability*stabilityFactor,
  cornerLimit:p.cornerLimit*Math.sqrt(tractionFactor*stabilityFactor),
  landing:p.landing*(.82+.18*tire)
 };
}
function motorDurability(){return choose('motor').durability*Math.max(.65,1-cfg.fine.motorTune*.10)}
function accumulateWear(r,dt,advance){
 if(!r.wearEnabled)return;
 // Physical model-time, not accelerated wall-clock time.
 const motor=choose('motor'),cell=choose('battery');
 const power=Math.min(1.7,r.v/Math.max(1,r.p.maxSpeed))*motor.rpm*(1+cfg.fine.motorTune*.06);
 r.battery=Math.max(0,r.battery-dt*(.12+.105*power*power)*cell.sag/cell.capacity);
 const tire=choose('tire');
 const tireWear=tire.grip>1.1?1.42:tire.grip<.9?.76:1;
 r.tire=Math.max(0,r.tire-advance*(.0032+Math.max(0,power-1)*.002)*tireWear);
 const ambient=25;
 const heatMultiplier=motor.heat*(1+cfg.fine.motorTune*.13);
 r.motorTemp=Math.max(ambient,r.motorTemp+dt*((.5+1.05*power*power)*heatMultiplier-.022*(r.motorTemp-ambient)));
 const stress=Math.max(0,r.motorTemp-57)/45;
 r.motorHealth=Math.max(0,r.motorHealth-dt*(.0025+.028*stress*stress)*heatMultiplier/motorDurability());
}
function updateCondition(){
 const r=race,condition=$('conditionPanel');
 if(!condition)return;
 const enabled=r?.wearEnabled??$('wearEnabled').checked;
 condition.classList.toggle('wearInactive',!enabled);
 const battery=r?.battery??100,tire=r?.tire??100,temp=r?.motorTemp??25;
 $('batteryValue').textContent=battery.toFixed(1)+'%';
 $('tireValue').textContent=tire.toFixed(1)+'%';
 $('motorValue').textContent=temp.toFixed(1)+'℃';
 $('motorHealthValue').textContent=(r?.motorHealth??100).toFixed(1)+'%';
 $('motorHealthBar').style.width=(r?.motorHealth??100)+'%';
 $('batteryBar').style.width=battery+'%';
 $('tireBar').style.width=tire+'%';
 $('heatBar').style.width=Math.max(0,Math.min(100,(temp-20)/.8))+'%';
 $('conditionDistance').textContent=`累計走行 ${((r?.laps??0)*ovalLength+(r?.distance??0)).toFixed(1)} m`;
 $('conditionNote').textContent=!enabled?'消耗OFF：比較用の一定性能で走行します':r?.active?'消耗・発熱を計算中（再スタートで新品に戻ります）':'走行開始時は新品状態です';
}
function displayRace(){if(!race)return;const r=race;$('speedRead').textContent=(r.v*3.6).toFixed(1);$('lapRead').textContent=r.time.toFixed(2);$('maxRead').textContent=(r.maxV*3.6).toFixed(1);$('stateRead').textContent=r.crash?.active?r.crash.label+'中':r.failed?'アウト':r.batteryEmpty?'電池切れ':r.done?'完走':r.air?'ジャンプ中':r.active?'走行中':'待機中';$('progressBar').style.width=(Math.min(100,r.distance/ovalLength*100)).toFixed(1)+'%';$('lapCount').textContent=String(r.done&&!r.loop&&!r.failed?r.laps:r.laps+1);$('lapLast').textContent=r.lastLap==null?'--.--':r.lastLap.toFixed(2);$('lapBest').textContent=r.bestLap==null?'--.--':r.bestLap.toFixed(2);updateCondition()}
function startRace(){
 const p=physics();race={active:true,done:false,failed:false,v:0,time:0,distance:0,maxV:0,p,risk:0,crash:null,wearEnabled:$('wearEnabled').checked,battery:100,tire:100,motorTemp:25,motorHealth:100,telemetry:[],loop:$('loopRun').checked,laps:0,lapStart:0,lastLap:null,bestLap:null,
   peakLateral:0,cornerLoss:0,fastestStraight:0,curveTime:0,cornerWarnings:0,air:null,jumps:0,landings:0,landingShock:0,landingPitch:0,bounces:0,lastLanding:'未計測',bounce:null};
 $('resultTime').textContent='--.-- s';$('delta').textContent=race.loop?'連続走行中：停止ボタンで終了できます':'計測中';$('stopRun').disabled=!race.loop;
 $('runLog').textContent=courseMode==='technical'?'スタート！ 立体コースの坂道・ジャンプ・着地を確認します。':'スタート！ 走行テンポは従来どおり4倍。パーツと微調整の効果を比較できます。';
 placeCar(0);accum=0;renderLapAnalysis(race);displayRace();
}
function stopRace(failed){
 const r=race;if(!r||r.done)return;r.done=true;r.active=false;r.failed=failed;$('stopRun').disabled=true;
 const key=raceRecordKey(r);const before=records[key]?.time;
 const report=`${courseMode==='technical'?`ジャンプ ${r.jumps}回 / 着地 ${r.landings}回 / 着地判定 ${r.lastLanding} / 着地衝撃 ${r.landingShock.toFixed(1)} / 最大姿勢角 ${r.landingPitch.toFixed(1)}° / バウンド ${r.bounces}回。`:''}微調整［ローラー高 ${r.p.fine.rollerHeight*2}mm / 前後幅 ${r.p.fine.rollerSpread*12}mm / ダンパー ${r.p.fine.damperBias} / ブレーキ高 ${r.p.fine.brakeHeight}mm］。最高速度 ${(r.maxV*3.6).toFixed(1)} km/h / コーナー走行 ${r.curveTime.toFixed(2)} 秒 / コーナー減速量 ${r.cornerLoss.toFixed(1)} km/h / 総重量 ${r.p.mass}g / 電池 ${r.battery.toFixed(1)}% / タイヤ ${r.tire.toFixed(1)}% / モーター ${r.motorTemp.toFixed(1)}℃。`;
 if(failed){
  startCrashAnimation();
  $('resultTime').textContent='COURSE OUT';$('delta').textContent='コースアウト：'+r.crash.label;
  $('runLog').textContent=`コースアウト：${r.laps+1}周目 ${(r.distance/ovalLength*100).toFixed(0)}%地点。${report} 飛び出し後の演出：${r.crash.label}。ローラーやタイヤ、ダンパーを見直すか、最高速を抑えてください。`;
 }else{
  const t=r.time;$('resultTime').textContent=t.toFixed(2)+' s';const better=before==null||t<before;
  $('delta').textContent=before==null?'初回計測完了':`${t<before?'ベスト更新：':'ベストとの差：'}${Math.abs(t-before).toFixed(2)} 秒${t<before?' 短縮':' 遅い'}`;
  $('runLog').textContent=`完走！ ${report}${better?' 新しいベストです。':' 改造してもう一度比べてみましょう。'}`;
  if(better){records[key]={time:t,max:r.maxV*3.6,type:TYPES[cfg.type].label,parts:{...cfg.parts},fine:{...cfg.fine}};localStorage.setItem(recordsKey,JSON.stringify(records))}
 }
 if(r.telemetry?.length)renderLapAnalysis(r);
 updateBest();displayRace();
}
// Simulate the distance remaining until the *next* corner. A turn needs a
// finite braking distance: strong motors without enough stability can go out.
function raceStep(dt){
 if(!race?.active)return;
 const r=race,p=deriveRunningPhysics(r),sector=((r.distance%ovalLength)+ovalLength)%ovalLength;
 const straight=2*straightHalf,arc=Math.PI*curveRadius;
 const onCurve=sector>=straight&&sector<straight+arc||sector>=2*straight+arc;
 const toCorner=sector<straight?straight-sector:sector<straight+arc?0:sector<2*straight+arc?2*straight+arc-sector:0;
 const limit=p.cornerLimit;
 const technical=courseMode==='technical';
 const u=r.distance/ovalLength;
 const slope=technical?roadSlope(u):0;
 // Grip and rollers make corner speed costly even below the derailment limit.
 // No hard speed clamp: physical deceleration produces a real trade-off.
 let forwardAccel=p.acceleration*Math.max(0,1-r.v/Math.max(1,p.maxSpeed));
 forwardAccel-=p.rollingLoss+p.airDrag*r.v*r.v;
 if(technical){
  // Motor torque matters on inclines; low brake clearance scrubs raised road.
  forwardAccel-=9.81*slope*.70;
  const brake=choose('brake');
  if(brake.mass&&Math.abs(slope)>.09)forwardAccel-=(4-cfg.fine.brakeHeight)*brake.drag*55;
 }
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
 accumulateWear(r,dt,advance);
 if(r.wearEnabled&&r.battery<=0){r.active=false;r.done=true;r.batteryEmpty=true;$('stopRun').disabled=true;$('stateRead').textContent='電池切れ';$('resultTime').textContent='BATTERY EMPTY';$('delta').textContent=`${r.laps}周完走後、電池残量が0%になりました`;$('runLog').textContent=`連続走行終了。累計走行 ${((r.laps*ovalLength)+r.distance).toFixed(1)}m。タイヤ残量 ${r.tire.toFixed(1)}%、モーター温度 ${r.motorTemp.toFixed(1)}℃。`;displayRace();return;}
 if(technical){
  // Longitudinal balance combines front/rear dampers and fine position.
  // Positive pitch = nose up; excessive nose-up/down on landing is penalized.
  const damper=choose('damper'), tire=choose('tire');
  const bias=(damper.mass ? cfg.fine.damperBias*.16 : 0)
      +(cfg.parts.damper===1? .14 : cfg.parts.damper===2?-.14:0)
      +(TYPES[cfg.type].id==='P'?.04:TYPES[cfg.type].id==='S'?-.035:0);
  const damping=Math.min(.82,.14+damper.landing*.9+damper.mass*.009);
  const jumpAt=.655*ovalLength;
  if(!r.air&&!r.jumps&&r.distance>=jumpAt){
   r.jumps++;
   const launchSpeed=r.v;
   const launchPitch=.035-bias*.48+(launchSpeed-10)*.005;
   r.air={time:0,launchHeight:elevation(.655),verticalSpeed:Math.max(2.0,launchSpeed*.21),
     pitch:launchPitch,pitchRate:(.12-bias*1.1)*(1-damping),
     damping,bias,launchSpeed};
   r.bounce=null;
  }
  if(r.air){
   const a=r.air;a.time+=dt;
   // Airborne nose movement has inertia and is damped by the installed weights.
   a.pitchRate+=(-a.bias*.38-a.pitch*.30-a.pitchRate*a.damping*.75)*dt;
   a.pitch+=a.pitchRate*dt;
   const flightY=a.launchHeight+a.verticalSpeed*a.time-4.905*a.time*a.time;
   const roadY=elevation(r.distance/ovalLength);
   if(a.time>.07&&flightY<=roadY){
    const impact=Math.max(0,9.81*a.time-a.verticalSpeed);
    const pitchDeg=Math.abs(a.pitch)*180/Math.PI;
    const tireSupport=(tire.grip-1)*1.2;
    const shockTolerance=2.9+p.landing*2.7+damper.landing*3.3+tireSupport;
    const pitchTolerance=.38+damper.landing*.32+Math.max(0,p.stability-1)*.16;
    const impactRatio=impact/Math.max(1,shockTolerance);
    const pitchRatio=Math.abs(a.pitch)/pitchTolerance;
    r.landingShock=impact;r.landingPitch=pitchDeg;r.landings++;
    const bad=impactRatio>1.13||pitchRatio>1.22||(impactRatio*.67+pitchRatio*.52)>1.26;
    r.air=null;
    if(bad){
      r.lastLanding=impactRatio>1.13?'着地衝撃過大':pitchRatio>1.22?'前後姿勢不良':'着地不安定';
      placeCar(Math.min(.9999,r.distance/ovalLength));
      // Preserve the incorrect attitude at impact before crash animation takes over.
      stopRace(true);return;
    }
    const bounceStrength=Math.max(0,impactRatio-.40)*(1-damping)*.22;
    r.bounces=bounceStrength>.055?1:0;
    r.bounce=bounceStrength>.035?{time:0,duration:.24,amplitude:bounceStrength,pitch:a.pitch}:null;
    r.lastLanding=r.bounces?'軽くバウンド':'安定着地';
    r.v*=THREE.MathUtils.clamp(1-impactRatio*.065-bounceStrength*.08,.77,1);
   }
  }
  if(r.bounce){r.bounce.time+=dt;if(r.bounce.time>=r.bounce.duration)r.bounce=null;}
 }

 // Ratio is tied to lateral acceleration (v²/R) vs. supported load.
 if(onCurve){
  const overload=r.v/Math.max(.1,limit);
  r.peakLateral=Math.max(r.peakLateral,overload);
  if(overload>1.045)r.risk+=dt*(overload-1.045)*5;
  else r.risk=Math.max(0,r.risk-dt*.65);
 }else r.risk=Math.max(0,r.risk-dt*1.5);
 if(r.risk>.18){placeCar(Math.min(.9999,r.distance/ovalLength));stopRace(true);return}
 if(r.distance>=ovalLength){
  const lapTime=r.time-r.lapStart;
  r.laps++;r.lastLap=lapTime;r.bestLap=Math.min(r.bestLap??Infinity,lapTime);snapshotLap(r,lapTime);
  const recordKey=raceRecordKey(r);
  if(r.loop && (!records[recordKey] || lapTime<records[recordKey].time)){
   records[recordKey]={time:lapTime,max:r.maxV*3.6,type:TYPES[cfg.type].label,parts:{...cfg.parts},fine:{...cfg.fine}};
   localStorage.setItem(recordsKey,JSON.stringify(records));updateBest();
  }
  if(r.loop){
   // Maintain speed, battery, heat and tyre condition into next lap.
   r.distance-=ovalLength;r.lapStart=r.time;r.jumps=0;
   $('resultTime').textContent=lapTime.toFixed(2)+' s';
   $('delta').textContent=`${r.laps}周完了 / 最速 ${r.bestLap.toFixed(2)} 秒 / 続行中`;
   $('runLog').textContent=`${r.laps}周完了。直近 ${lapTime.toFixed(2)} 秒 / ベスト ${r.bestLap.toFixed(2)} 秒。${r.wearEnabled?`電池 ${r.battery.toFixed(1)}% / タイヤ ${r.tire.toFixed(1)}% / モーター寿命 ${r.motorHealth.toFixed(1)}%`:'消耗OFF'}。`;
   placeCar(r.distance/ovalLength);return;
  }
  r.distance=ovalLength;placeCar(1);stopRace(false);return;
 }
 placeCar(r.distance/ovalLength);
 if(r.air){const a=r.air;carContainer.position.y=TRACK_CAR_Y+a.launchHeight+a.verticalSpeed*a.time-4.905*a.time*a.time;carContainer.rotation.z=a.pitch;}
 else if(r.bounce){const b=r.bounce,q=b.time/b.duration;carContainer.position.y+=b.amplitude*Math.sin(Math.PI*q);carContainer.rotation.z=b.pitch*(1-q);}
}

function updateBest(){const b=records[raceRecordKey()];$('bestRecord').textContent=b?`${b.time.toFixed(2)} 秒 / ${b.type} / ${b.max.toFixed(1)} km/h\n${GROUPS.map(g=>`${g.label}：${g.parts[b.parts[g.key]??0]?.name??'未設定'}`).join(' ｜ ')}\n微調整：${JSON.stringify(b.fine||{})}`:'まだ記録がありません'}
// A standalone settings layer: additional course preferences can be added here later.
const courseSettingsOverlay=$('courseSettingsOverlay');
const courseSettingsBtn=$('courseSettingsBtn');
const courseSettingsDialog=courseSettingsOverlay.querySelector('.courseSettingsDialog');
let courseSettingsPreviousFocus=null;
function openCourseSettings(){
 courseSettingsPreviousFocus=document.activeElement;
 courseSettingsOverlay.classList.remove('hidden');
 courseSettingsDialog.focus({preventScroll:true});
}
function closeCourseSettings(){
 courseSettingsOverlay.classList.add('hidden');
 if(courseSettingsPreviousFocus?.focus)courseSettingsPreviousFocus.focus({preventScroll:true});
}
function applyGroundColor(value,save=true){
 if(!Object.hasOwn(GROUND_COLORS,value))return;
 groundColorChoice=value;
 trackGround.material.color.setHex(GROUND_COLORS[value]);
 syncSceneEnvironment();
 for(const input of document.querySelectorAll('input[name="groundColor"]'))input.checked=input.value===value;
 if(save){try{localStorage.setItem(groundColorStorageKey,value)}catch{}}
}
courseSettingsBtn.addEventListener('click',openCourseSettings);
$('courseSettingsClose').addEventListener('click',closeCourseSettings);
$('courseSettingsDone').addEventListener('click',closeCourseSettings);
courseSettingsOverlay.addEventListener('click',e=>{if(e.target===courseSettingsOverlay)closeCourseSettings()});
courseSettingsOverlay.addEventListener('change',e=>{if(e.target?.name==='groundColor')applyGroundColor(e.target.value)});
document.addEventListener('keydown',e=>{
 if(courseSettingsOverlay.classList.contains('hidden'))return;
 if(e.key==='Escape'){e.preventDefault();closeCourseSettings();}
 if(e.key==='Tab'){
  const focusables=[...courseSettingsOverlay.querySelectorAll('button,input:not([disabled])')];
  const first=focusables[0],last=focusables.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
});
applyGroundColor(groundColorChoice,false);
$('arenaBackground').addEventListener('change',syncArenaBackdrop);
$('wearEnabled').addEventListener('change',()=>{if(!race?.active){race=null;updateBest();updateCondition();}});
$('loopRun').addEventListener('change',()=>{if(race?.active){race.loop=$('loopRun').checked;$('stopRun').disabled=!race.loop;}});
$('stopRun').addEventListener('click',()=>{if(!race?.active)return;const r=race;r.active=false;r.done=true;$('stopRun').disabled=true;$('stateRead').textContent='走行停止';$('delta').textContent=`任意停止：${r.laps}周完了 / 総走行 ${r.time.toFixed(2)}秒`;$('runLog').textContent=`連続試走を停止しました。完走 ${r.laps}周。${r.bestLap==null?'完走記録なし':`最速ラップ ${r.bestLap.toFixed(2)} 秒`}。電池 ${r.battery.toFixed(1)}% / タイヤ ${r.tire.toFixed(1)}% / モーター ${r.motorTemp.toFixed(1)}℃`;updateCondition();});
$('courseSelect').addEventListener('change',e=>{courseMode=e.target.value==='technical'?'technical':'oval';race=null;accum=0;showCourse();placeCar(0);updateBest();$('stopRun').disabled=true;$('lapCount').textContent='1';$('lapLast').textContent='--.--';$('lapBest').textContent='--.--';$('stateRead').textContent='待機中';$('resultTime').textContent='--.-- s';$('runLog').textContent='コースを切り替えました。試走スタートを押してください。';$('progressBar').style.width='0%';updateCondition();});$('startRun').onclick=startRace;$('resetBest').onclick=()=>{records={};localStorage.removeItem(recordsKey);updateBest()};$('garageTab').onclick=()=>setScreen('garage');$('testTab').onclick=()=>setScreen('test');$('backGarage').onclick=()=>setScreen('garage');$('goTest').onclick=()=>setScreen('test');$('resetView').onclick=()=>setView('angle');
let last=performance.now(),accum=0,wheelAngle=0;const fixed=1/120;let lastConditionTime=0;
function animate(now){requestAnimationFrame(animate);const elapsed=Math.min((now-last)/1000,.075);last=now;if(screen==='test'&&race?.active){accum+=elapsed*RACE_PLAYBACK_RATE;while(accum>=fixed){raceStep(fixed);accum-=fixed}displayRace()}
 if(screen==='test'&&race?.crash?.active){updateCrashAnimation(elapsed);displayRace()}
 if(now-lastConditionTime>150){lastConditionTime=now;if(screen==='test')updateCondition();}
 const speed=screen==='test'&&race?(race.crash?.active?race.v*0.45:race.v):0;const tireRadius=(choose('tire').diam/26*.165)*.9;wheelAngle-=speed*elapsed*(race?.active?RACE_PLAYBACK_RATE:race?.crash?.active?1:0)/Math.max(.02,tireRadius);for(const w of wheelGroups)w.rotation.z=wheelAngle;
 if(screen==='garage'&&car){carContainer.position.set(0,GARAGE_CAR_Y,0);carContainer.rotation.y=0}
 controls.update();
 // Prevent OrbitControls panning/zooming the test camera below the track floor.
 // Moving both target and camera preserves its orbit direction (no abrupt flips).
 if(screen==='test'){
  const minTargetY=0.0,minCameraY=0.55;
  if(controls.target.y<minTargetY){
   camera.position.y+=minTargetY-controls.target.y;
   controls.target.y=minTargetY;
  }
  if(camera.position.y<minCameraY){
   camera.position.y=minCameraY;
  }
 }
 renderer.render(scene,camera)}
function resize(){const canvas=$('scene');const rect=canvas.getBoundingClientRect();if(rect.width&&rect.height){renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();if(screen==='test')fitTrackCamera()}}
new ResizeObserver(resize).observe($('scene'));window.addEventListener('resize',resize);renderUI();refreshCar();setScreen('garage');updateCondition();resize();requestAnimationFrame(animate);
