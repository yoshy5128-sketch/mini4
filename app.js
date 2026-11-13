import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildTougeCar } from './touge-cars.js?v=085';

const $=id=>document.getElementById(id);
const TYPES=[
 {id:'A',label:'TYPE-A',short:'TOUGE RED',name:'峠SIM TYPE-A',color:0xff5252,mass:122,drag:.98,grip:.96,stability:.96,torque:1.00},
 {id:'B',label:'TYPE-B',short:'TOUGE GREEN',name:'峠SIM TYPE-B',color:0x00cc00,mass:119,drag:.96,grip:.94,stability:.93,torque:1.02},
 {id:'C',label:'TYPE-C',short:'TOUGE GOLD',name:'峠SIM TYPE-C',color:0xcccc00,mass:130,drag:1.05,grip:1.05,stability:1.07,torque:1.05},
 {id:'D',label:'TYPE-D',short:'TOUGE WHITE',name:'峠SIM TYPE-D',color:0xffffff,mass:126,drag:1.00,grip:1.03,stability:1.05,torque:.99},
 {id:'E',label:'TYPE-E',short:'TOUGE WAGON',name:'峠SIM TYPE-E',color:0xeeeeee,mass:134,drag:1.08,grip:1.08,stability:1.12,torque:1.08},
 {id:'F',label:'TYPE-F',short:'TOUGE YELLOW',name:'峠SIM TYPE-F',color:0xf7d52b,mass:117,drag:.94,grip:.92,stability:.90,torque:.97}
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
 {key:'roller',label:'ローラー',info:'透明ガイド壁へ常時接触します。低摩擦は旋回ロスを減らし、大径は壁との隙間を詰めて衝撃とコースアウトを抑えます。',parts:[
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
let records=getStorage(recordsKey,{});let activeGroup='motor',screen='garage';let courseMode='junior';let race=null,car=null,track=null,visualReady=false;let wheelGroups=[];
const choose=k=>GROUPS.find(x=>x.key===k).parts[cfg.parts[k]];
const SOUND_PREF_KEY='mini4wd_lab_sound_v1';
let soundEnabled=true,audioContext=null,audioMaster=null,motorGain=null,motorOsc=null,motorHarmonic=null;
try{soundEnabled=localStorage.getItem(SOUND_PREF_KEY)!=='off'}catch{}
function syncSoundButton(){
 const button=$('soundBtn');if(!button)return;
 button.textContent=soundEnabled?'🔊':'🔇';button.setAttribute('aria-pressed',String(soundEnabled));button.title=`走行音 ${soundEnabled?'ON':'OFF'}`;
}
function initAudio(){
 if(!soundEnabled)return false;
 const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return false;
 if(!audioContext){
  audioContext=new AudioCtor();audioMaster=audioContext.createGain();audioMaster.gain.value=.72;audioMaster.connect(audioContext.destination);
  motorGain=audioContext.createGain();motorGain.gain.value=0;
  const motorFilter=audioContext.createBiquadFilter();motorFilter.type='lowpass';motorFilter.frequency.value=1500;motorFilter.Q.value=.8;
  motorOsc=audioContext.createOscillator();motorOsc.type='sawtooth';motorOsc.frequency.value=85;
  motorHarmonic=audioContext.createOscillator();motorHarmonic.type='square';motorHarmonic.frequency.value=170;
  const harmonicGain=audioContext.createGain();harmonicGain.gain.value=.13;
  motorOsc.connect(motorGain);motorHarmonic.connect(harmonicGain);harmonicGain.connect(motorGain);motorGain.connect(motorFilter);motorFilter.connect(audioMaster);
  motorOsc.start();motorHarmonic.start();
 }
 if(audioContext.state==='suspended')void audioContext.resume().catch(()=>{});
 return true;
}
function playTone(frequency,duration=.12,type='sine',volume=.16,endFrequency=frequency){
 if(!initAudio())return;
 const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();
 osc.type=type;osc.frequency.setValueAtTime(frequency,now);osc.frequency.exponentialRampToValueAtTime(Math.max(20,endFrequency),now+duration);
 gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
 osc.connect(gain);gain.connect(audioMaster);osc.start(now);osc.stop(now+duration+.025);
}
function updateMotorSound(){
 if(!audioContext||!motorGain)return;
 const now=audioContext.currentTime;
 const audible=soundEnabled&&screen==='test'&&race?.active&&!race?.done&&!playbackPaused&&document.visibilityState==='visible';
 const speedRatio=audible?THREE.MathUtils.clamp(race.v/Math.max(1,race.p.maxSpeed),0,1):0;
 const motor=choose('motor'),rate=SLOW_RATES?.[slowIndex]??4;
 const frequency=72+speedRatio*310*motor.rpm*Math.sqrt(rate/4);
 motorOsc.frequency.setTargetAtTime(frequency,now,.035);motorHarmonic.frequency.setTargetAtTime(frequency*2.03,now,.035);
 motorGain.gain.setTargetAtTime(audible?(.018+speedRatio*.065):0,now,audible?.045:.018);
}
const TRACK_SCALE=3;
const TRACK_LANE_COUNT=4;
const TRACK_LANE_WIDTH=1.8;
const TRACK_HALF_WIDTH=TRACK_LANE_COUNT*TRACK_LANE_WIDTH/2;
// Course paths run counter-clockwise, so positive normal offsets are inside.
const LANE_OFFSETS=Array.from({length:TRACK_LANE_COUNT},(_,i)=>TRACK_HALF_WIDTH-TRACK_LANE_WIDTH*(i+.5));
const LANE_PREF_KEY='mini4wd_lab_start_lane_v1';
let playerLane=1;try{playerLane=THREE.MathUtils.clamp(Number(localStorage.getItem(LANE_PREF_KEY))||1,1,TRACK_LANE_COUNT)}catch{}
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
 // Invisible lane walls guide the machine through its rollers. Roller reach
 // controls wall clearance; height, fore/aft spread and stay rigidity control
 // how much lateral load can be carried before the machine climbs the wall.
 const rollerRadius=r.diam/13*.071;
 const rollerReach=.49+rollerRadius;
 // Physical guide calculation uses a 115 mm lane and the model's 86 mm
 // roller-centre span. This yields 8 mm clearance for 13 mm rollers and
 // 5 mm for 19 mm rollers, independently of the enlarged display scale.
 const guideClearanceMm=(115-(86+r.diam))/2;
 const clearanceQuality=THREE.MathUtils.clamp(1-Math.abs(guideClearanceMm-5)*.045,.72,1.04);
 const heightSupport=1-fine.rollerHeight*.055;
 const spreadSupport=1+fine.rollerSpread*.055;
 const guideCapacity=12.6*Math.max(.42,grip*stability)*clearanceQuality*heightSupport*spreadSupport;
 const cornerLimit=Math.sqrt(Math.max(1,guideCapacity*3.2*TRACK_SCALE));
 const cornerFriction=.17+.31*r.friction+Math.max(0,b.drag)*2.5+Math.max(0,fine.rollerSpread)*.045;
 const brakePower=9+4*Math.max(0,grip-1)+3*Math.max(0,stability-1)+(b.mass?(4-fine.brakeHeight)*.35:0);
 return {mass,maxSpeed,acceleration,grip,stability,cornerLimit,cornerFriction,brakePower,guideCapacity,guideClearanceMm,rollerReach,
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
 const bodyLink=$('bodyCustomLink');if(bodyLink)bodyLink.href=`./body-custom.html?type=${cfg.type}`;
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
// Three independent named presets. The current working setup is persisted separately.
const SET_SLOTS_KEY='mini4wd_lab_tuning_slots_v1';
const setSlots=getStorage(SET_SLOTS_KEY,[null,null,null]);
while(setSlots.length<3)setSlots.push(null);
const slotNode=$('setSlots');
function renderSetSlots(message=''){
 slotNode.innerHTML=setSlots.slice(0,3).map((preset,i)=>{
  const title=preset?`${TYPES[preset.type]?.label||'TYPE'} / ${GROUPS.length}種`:'未保存';
  return `<div class="setSlot"><div class="setSlotHead"><strong>SET${i+1}</strong><span>${title}</span></div><div class="setSlotButtons"><button type="button" data-set-action="save" data-set-index="${i}">保存</button><button type="button" data-set-action="load" data-set-index="${i}" ${preset?'':'disabled'}>読込</button></div></div>`;
 }).join('');
 $('slotMessage').textContent=message||'保存：現在のセッティングを登録 ／ 読込：保存内容に切替';
}
slotNode.addEventListener('click',event=>{
 const button=event.target.closest('button[data-set-action]');if(!button)return;
 const i=Number(button.dataset.setIndex);if(!Number.isInteger(i)||i<0||i>2)return;
 if(button.dataset.setAction==='save'){
  if(setSlots[i]&&!window.confirm(`SET${i+1}を現在のセッティングで上書きしますか？`))return;
  setSlots[i]={type:cfg.type,parts:{...cfg.parts},fine:{...cfg.fine}};
  try{localStorage.setItem(SET_SLOTS_KEY,JSON.stringify(setSlots))}catch(err){renderSetSlots('保存できませんでした。ブラウザの保存領域をご確認ください。');return;}
  renderSetSlots(`SET${i+1}に保存しました`);
 }else{
  const preset=setSlots[i];if(!preset)return;
  cfg.type=Number.isInteger(preset.type)&&preset.type>=0&&preset.type<TYPES.length?preset.type:0;
  cfg.parts={...defaults,...preset.parts};
  for(const group of GROUPS){let idx=cfg.parts[group.key];if(!Number.isInteger(idx)||idx<0||idx>=group.parts.length)cfg.parts[group.key]=defaults[group.key]}
  cfg.fine={rollerHeight:0,rollerSpread:0,damperBias:0,brakeHeight:2,motorTune:0,...preset.fine};
  for(const [key,[lo,hi]] of Object.entries(FINE_RANGES))cfg.fine[key]=Math.max(lo,Math.min(hi,Math.round(Number(cfg.fine[key])||0)));
  refreshCar();
  renderSetSlots(`SET${i+1}を読み込みました`);
 }
});
renderSetSlots();

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

function sph(parent,r,material,x,y,z,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1){
 const v=new THREE.Mesh(new THREE.SphereGeometry(r,22,18),material);v.position.set(x,y,z);v.rotation.set(rx,ry,rz);v.scale.set(sx,sy,sz);v.castShadow=true;v.receiveShadow=true;parent.add(v);return v
}
function capsule(parent,r,length,material,x,y,z,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1){
 const v=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.01,length),6,16),material);v.position.set(x,y,z);v.rotation.set(rx,ry,rz);v.scale.set(sx,sy,sz);v.castShadow=true;v.receiveShadow=true;parent.add(v);return v
}
function extrudeShell(parent,points,thickness,material,x,y,z,bevel=.038){
 const shape=new THREE.Shape();
 points.forEach((p,i)=>{if(i===0)shape.moveTo(p[0],p[1]);else shape.lineTo(p[0],p[1])});
 shape.closePath();
 const geo=new THREE.ExtrudeGeometry(shape,{depth:thickness,steps:1,bevelEnabled:true,bevelSegments:5,curveSegments:20,bevelSize:bevel,bevelThickness:Math.min(bevel,.028)});
 geo.center();
 const mesh=new THREE.Mesh(geo,material);mesh.rotation.x=Math.PI/2;mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh
}
const garageFloor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),mat(0x182733,.1,.85));garageFloor.rotation.x=-Math.PI/2;garageFloor.receiveShadow=true;garageGroup.add(garageFloor);
const podium=new THREE.Mesh(new THREE.CylinderGeometry(1.43,1.53,.17,72),mat(0x263e4b,.62,.32));podium.position.y=.10;podium.receiveShadow=true;garageGroup.add(podium);
const rim=new THREE.Mesh(new THREE.TorusGeometry(1.42,.026,8,80),new THREE.MeshBasicMaterial({color:0x55d9f2}));rim.rotation.x=Math.PI/2;rim.position.y=.195;garageGroup.add(rim);
const grid=new THREE.GridHelper(16,28,0x345265,0x213847);grid.position.y=.004;garageGroup.add(grid);

// Sculpted racing shell for TYPE S. All geometry is original and parametrically built
// from a single 3/4-view reference, without using the source photograph as a texture.
function buildSpeedShell(group,kit){
 const white=mat(0xf0f2f3,.17,.26), ivory=mat(0xd6e2e9,.17,.33);
 const blue=mat(0x283fbb,.22,.31), cobalt=mat(0x132b7f,.28,.3);
 const scarlet=mat(0xee424b,.12,.31), dark=mat(0x101922,.38,.17),glass=mat(0x152333,.54,.08),
 bright=mat(0xf7bb47,.35,.25),gree=mat(0x15a64c,.28,.36),joint=mat(0x7f9cbd,.58,.3);
 function interp(a,b,t){return a+(b-a)*t;}
 function cat(a,b,c,d,t){return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t)}
 function value(profiles,x,j){
  if(x<=profiles[0][0])return profiles[0][j];
  if(x>=profiles[profiles.length-1][0])return profiles[profiles.length-1][j];
  for(let i=0;i<profiles.length-1;i++){
   const a=profiles[i],b=profiles[i+1];if(x>=a[0]&&x<=b[0]){
    const t=(x-a[0])/(b[0]-a[0]);
    return cat(profiles[Math.max(0,i-1)][j],a[j],b[j],profiles[Math.min(profiles.length-1,i+2)][j],t);
   }
  }
  return profiles[0][j];
 }
 // Each section: [x, half-width, deck-bottom, shoulder, center-highpoint].
 // Cross sections are lofted and smoothed along the length, making a genuine
 // continuous body instead of a pile of boxes or stretched spheres.
 function loft(profiles,material,zOffset=0,yOffset=0,steps=52){
  const vertices=[],indices=[],ring=12,min=profiles[0][0],max=profiles[profiles.length-1][0];
  const rings=[];
  for(let i=0;i<=steps;i++){
   const x=interp(min,max,i/steps),w=Math.max(.008,value(profiles,x,1)),low=value(profiles,x,2)+yOffset,sh=value(profiles,x,3)+yOffset,high=value(profiles,x,4)+yOffset;
   rings.push([[0,high],[w*.34,high-.012],[w*.76,sh+.008],[w,sh-.036],[w*.96,low+.06],[w*.62,low],[0,low],[-w*.62,low],[-w*.96,low+.06],[-w,sh-.036],[-w*.76,sh+.008],[-w*.34,high-.012]]);
   for(const [z,y] of rings[i])vertices.push(x,y,z+zOffset);
  }
  for(let i=0;i<steps;i++)for(let j=0;j<ring;j++){
   const a=i*ring+j,b=i*ring+(j+1)%ring,c=(i+1)*ring+j,d=(i+1)*ring+(j+1)%ring;
   indices.push(a,b,c,b,d,c);
  }
  for(let j=1;j<ring-1;j++){indices.push(0,j+1,j);const k=steps*ring;indices.push(k,k+j,k+j+1)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();
  const mesh=new THREE.Mesh(g,material);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
 }
 function patch(points,material,side=THREE.DoubleSide){
  const verts=[];for(const p of points)verts.push(...p);
  const ix=[];for(let i=1;i<points.length-1;i++)ix.push(0,i,i+1);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(ix);g.computeVertexNormals();
  const mesh=new THREE.Mesh(g,material);mesh.material.side=side;mesh.renderOrder=3;group.add(mesh);return mesh;
 }
 function seam(points,material,radius=.006){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(10,points.length*6),radius,6,false),material);
  mesh.castShadow=true;group.add(mesh);return mesh;
 }
 function wedge(points,material,thickness=.028){
  const sh=new THREE.Shape();sh.moveTo(points[0][0],points[0][1]);for(const v of points.slice(1))sh.lineTo(v[0],v[1]);sh.closePath();
  const g=new THREE.ExtrudeGeometry(sh,{depth:thickness,bevelEnabled:true,bevelThickness:.012,bevelSize:.01,bevelSegments:3,steps:1});
  g.computeVertexNormals();const mesh=new THREE.Mesh(g,material);mesh.castShadow=true;group.add(mesh);return mesh;
 }
 // The reference reads as several moulded panels rather than one swollen shell.
 // A narrow centre spine forms the spear-like nose and the rear cockpit deck.
 loft([[-.84,.205,.29,.36,.425],[-.65,.225,.30,.405,.49],[-.48,.205,.31,.45,.535],[-.28,.175,.31,.445,.50],[-.03,.152,.285,.395,.445],[.25,.137,.255,.35,.392],[.54,.102,.23,.304,.335],[.82,.055,.211,.254,.273],[1.075,.012,.195,.212,.221]],white);
 // Separate wheel cowls expose a dark channel between the nose and side pods.
 for(const sign of [-1,1]){
  const z=sign*.29;
  // Blue sill is kept low so the upper white moulding has a crisp shadow line.
  loft([[-.79,.112,.225,.275,.305],[-.60,.158,.225,.302,.348],[-.36,.165,.222,.31,.36],[-.08,.128,.217,.285,.322],[.20,.142,.212,.292,.342],[.46,.158,.208,.306,.366],[.69,.11,.202,.268,.302]],blue,z,0,44);
  loft([[-.76,.096,.30,.382,.432],[-.61,.132,.305,.425,.505],[-.43,.145,.31,.455,.548],[-.23,.128,.305,.445,.515],[-.02,.105,.285,.39,.43],[.22,.122,.278,.405,.472],[.43,.13,.272,.427,.505],[.61,.105,.255,.382,.438],[.72,.055,.235,.302,.335]],ivory,z,0,48);
  // Recessed inner channel visually separates the pod from the centre spine.
  loft([[-.66,.035,.318,.335,.348],[-.42,.045,.338,.355,.37],[-.10,.04,.306,.323,.336],[.20,.038,.29,.307,.32],[.48,.028,.266,.282,.294]],dark,sign*.205,0,28);
  // Layered racing graphics follow the moulded shoulder instead of floating flat.
  patch([[-.64,.492,sign*.322],[-.48,.535,sign*.374],[-.26,.505,sign*.39],[-.43,.465,sign*.35]],scarlet);
  patch([[.18,.456,sign*.342],[.43,.520,sign*.365],[.61,.431,sign*.34],[.39,.438,sign*.322]],scarlet);
  patch([[-.69,.438,sign*.405],[-.46,.492,sign*.435],[-.20,.442,sign*.425],[-.43,.402,sign*.415]],cobalt);
  patch([[.19,.404,sign*.416],[.46,.478,sign*.424],[.61,.403,sign*.398],[.39,.383,sign*.397]],cobalt);
  // Tall front lamp pod: an extruded aero fin with a separate amber lens.
  const finG=new THREE.Shape();finG.moveTo(-.125,-.038);finG.lineTo(-.058,.118);finG.quadraticCurveTo(.008,.215,.068,.135);finG.lineTo(.125,.012);finG.quadraticCurveTo(.075,-.04,-.125,-.038);
  const finGeo=new THREE.ExtrudeGeometry(finG,{depth:.068,bevelEnabled:true,bevelSegments:5,bevelSize:.012,bevelThickness:.012,steps:1});finGeo.center();
  const finMesh=new THREE.Mesh(finGeo,blue);finMesh.position.set(.715,.335,sign*.38);finMesh.castShadow=true;group.add(finMesh);
  patch([[.665,.345,sign*.418],[.705,.458,sign*.418],[.747,.49,sign*.418],[.79,.358,sign*.418]],bright);
  // Three silver louvres echo the stepped vents behind the front wheels.
  for(let i=0;i<3;i++){const louvre=box(group,.018,.13,.018,joint,.28+i*.036,.41+i*.008,sign*.448);louvre.rotation.z=-.18;}
 }
 // Central dark windscreen: tapering down the front nose, with silver rim.
 loft([[-.47,.12,.50,.54,.585],[-.32,.148,.53,.606,.669],[-.09,.159,.54,.625,.713],[.12,.125,.50,.584,.672],[.30,.071,.45,.51,.545],[.43,.012,.405,.43,.435]],cobalt,0,0,30);
 loft([[-.44,.105,.575,.606,.623],[-.29,.130,.598,.64,.679],[-.085,.14,.606,.664,.723],[.11,.105,.558,.61,.668],[.27,.053,.512,.535,.556],[.37,.009,.48,.49,.495]],glass,0,.008,32);
 // Thin canopy rails and panel seams catch highlights and prevent a toy-like blob.
 for(const sign of [-1,1]){
  seam([[-.43,.595,sign*.11],[-.27,.655,sign*.14],[-.07,.704,sign*.148],[.12,.647,sign*.112],[.30,.532,sign*.055]],joint,.007);
  seam([[-.68,.432,sign*.39],[-.45,.478,sign*.438],[-.20,.428,sign*.425],[.07,.378,sign*.40],[.34,.424,sign*.43],[.60,.382,sign*.385]],joint,.005);
 }
 // Hood stripe and paired red lightning graphics on top of the white wedge.
 patch([[1.005,.270,0],[.83,.315,.047],[.60,.366,.083],[.31,.466,.10],[.12,.535,.058],[.18,.544,0],[.31,.466,-.10],[.60,.366,-.083],[.83,.315,-.047]],blue);
 for(const sign of [-1,1]){
  patch([[.86,.30,sign*.095],[.70,.365,sign*.14],[.48,.415,sign*.175],[.27,.469,sign*.172],[.39,.469,sign*.128],[.61,.394,sign*.115]],scarlet);
 }
 // Compact rear shoulder caps lead into the wing pylons without covering the tyres.
 loft([[-.88,.075,.36,.42,.465],[-.69,.105,.37,.465,.545],[-.49,.09,.38,.475,.535],[-.31,.045,.37,.405,.43]],white,.305,0,24);
 loft([[-.88,.075,.36,.42,.465],[-.69,.105,.37,.465,.545],[-.49,.09,.38,.475,.535],[-.31,.045,.37,.405,.43]],white,-.305,0,24);
 // Rear wing pylons and broad wing, split from body so it reads as an airfoil.
 for(const sign of [-1,1]){
  const z=sign*.30;
  box(group,.065,.14,.042,joint,-.76,.57,z);
  box(group,.24,.028,.05,white,-.78,.65,z);
 }
 // Airfoil blade with softened leading/trailing edges. Wing is across local Z.
 const wingCurve=new THREE.Shape();wingCurve.moveTo(-.997,.682);wingCurve.quadraticCurveTo(-.84,.735,-.65,.712);wingCurve.quadraticCurveTo(-.62,.704,-.63,.689);wingCurve.lineTo(-.97,.665);wingCurve.quadraticCurveTo(-1,.665,-.997,.682);
 const wingGeo=new THREE.ExtrudeGeometry(wingCurve,{depth:.95,bevelEnabled:true,bevelSegments:4,bevelSize:.018,bevelThickness:.012,steps:1});
 wingGeo.translate(0,0,-.475);wingGeo.computeVertexNormals();const wingMesh=new THREE.Mesh(wingGeo,blue);wingMesh.castShadow=true;group.add(wingMesh);
 // Rear wing top yellow swoosh / center badge.
 patch([[-.95,.708,-.39],[-.68,.714,-.39],[-.68,.714,.39],[-.95,.708,.39]],scarlet);
 patch([[-.93,.716,-.30],[-.75,.719,-.30],[-.75,.719,.30],[-.93,.716,.30]],bright);
 for(const sign of [-1,1]){
  const z=sign*.51;
  const end=new THREE.Shape();end.moveTo(-1.04,.645);end.lineTo(-1.035,.785);end.quadraticCurveTo(-.91,.83,-.69,.78);end.lineTo(-.64,.70);end.lineTo(-.66,.652);end.closePath();
  const endMesh=new THREE.Mesh(new THREE.ExtrudeGeometry(end,{depth:.03,bevelEnabled:true,bevelThickness:.007,bevelSize:.008,bevelSegments:3}),cobalt);
  endMesh.position.z=z;endMesh.castShadow=true;group.add(endMesh);
 }
 // Small side intakes / trims.
 for(const sign of [-1,1]){
  box(group,.24,.024,.04,dark,-.50,.49,sign*.39);
  box(group,.12,.018,.07,joint,.01,.45,sign*.345);
 }
 // Exposed body fasteners are small but important scale cues.
 for(const [x,z] of [[.58,0],[-.24,.205],[-.24,-.205],[-.69,.26],[-.69,-.26]]){
  cyl(group,.018,.018,.012,silver,x,.545,z);
  box(group,.025,.004,.004,dark,x,.552,z).rotation.y=Math.PI/4;
 }
 // Upgrade choices affect visual complexity without making body into blocks.
 if(kit.cut>=1){
  for(const sign of [-1,1])loft([[-.54,.038,.53,.54,.55],[-.40,.052,.53,.55,.56],[-.22,.032,.49,.50,.51]],dark,sign*.20,.007,16);
 }
 if(kit.cut>=2){
  for(const sign of [-1,1])loft([[.17,.024,.46,.47,.48],[.35,.047,.40,.41,.42],[.52,.022,.35,.36,.37]],dark,sign*.145,.011,16);
 }
 if(kit.cut>=3){
  // slim carbon-like braces visible inside the lightweight body cutouts
  for(const sign of [-1,1])box(group,.24,.018,.025,carbon,.29,.44,sign*.155);
 }
}

function buildLegacyCar(){
 wheelGroups=[];
 const group=new THREE.Group();
 const t=TYPES[cfg.type],ti=choose('tire'),r=choose('roller'),d=choose('damper'),b=choose('brake'),m=choose('motor');
 const stayPart=choose('stay'),kit=choose('bodykit');
 const body=mat(t.color,.25,.28),accent=mat(t.accent,.34,.26),bodyDark=mat(new THREE.Color(t.color).multiplyScalar(.58).getHex(),.22,.42),
  canopy=new THREE.MeshStandardMaterial({color:0x101b27,metalness:.34,roughness:.16,transparent:true,opacity:.92}),
  highlight=mat(0xf7f7fb,.58,.16),trim=mat(0x0d1117,.24,.76),amber=mat(0xf0c753,.54,.25);
 const chassisMat=cfg.type===0?mat(0xe4e9eb,.18,.34):carbon;
 const rimMat=cfg.type===0?mat(0x10aa55,.24,.31):mat(t.accent,.62,.28);
 const scale=.9;group.scale.setScalar(scale);
 // chassis and lower deck
 box(group,1.44,.08,.60,chassisMat,0,.19,0);
 box(group,1.62,.05,.71,black,0,.125,0);
 box(group,1.70,.024,.16,trim,.73,.155,0);
 box(group,1.64,.022,.18,trim,-.73,.155,0);
 const wr=ti.diam/26*.165;
 for(const x of [-.47,.47])for(const z of [-.38,.38]){
  const assembly=new THREE.Group();assembly.position.set(x,wr+.01,z);group.add(assembly);
  const wheel=cyl(assembly,wr,wr,.15,rubber,0,0,0);wheel.rotation.x=Math.PI/2;
  const side=cyl(assembly,wr*.24,wr*.24,.158,rimMat,0,0,0);side.rotation.x=Math.PI/2;
  tor(assembly,wr*.48,wr*.095,rimMat,0,0,z>0?.083:-.083,0);
  cyl(assembly,wr*.21,wr*.21,.16,silver,0,0,0).rotation.x=Math.PI/2;
  const spokeCount=cfg.type===0?5:6;
  for(let k=0;k<spokeCount;k++){const a=k*Math.PI*2/spokeCount;const spoke=box(assembly,wr*.53,.019,.022,cfg.type===0?rimMat:metal,Math.cos(a)*wr*.39,Math.sin(a)*wr*.39,z>0?.086:-.086);spoke.rotation.z=a;}
  wheelGroups.push(assembly);
 }
 // mechanical details
 box(group,.42,.14,.25,metal,-.34,.16,0);
 for(const z of [-.22,.22])box(group,.43,.11,.10,amber,.08,.205,z);
 if(cfg.type===0){
  buildSpeedShell(group,kit);
 }else{
 // base body shells with rounded outlines inspired by low, power and balanced cowl types.
 if(cfg.type===0){
  extrudeShell(group,[[.86,0],[.73,.15],[.34,.25],[-.18,.31],[-.64,.29],[-.94,.18],[-1.06,.06],[-1.02,-.06],[-.90,-.16],[-.60,-.28],[-.14,-.31],[.36,-.24],[.73,-.16]],.115,body,-.04,.35,0,.035);
  extrudeShell(group,[[.55,0],[.39,.10],[.08,.15],[-.34,.19],[-.63,.17],[-.77,.09],[-.81,0],[-.77,-.09],[-.63,-.17],[-.34,-.19],[.08,-.15],[.39,-.10]],.072,accent,-.12,.47,0,.03);
  capsule(group,.115,.40,canopy,-.08,.525,0,0,0,Math.PI/2,1.26,.84,1.0);
  capsule(group,.075,.22,bodyDark,.42,.35,.27,0,0,Math.PI/2,1.15,.85,1);
  capsule(group,.075,.22,bodyDark,.42,.35,-.27,0,0,Math.PI/2,1.15,.85,1);
  box(group,.46,.06,.09,accent,-.70,.45,0);
  box(group,.72,.05,.10,trim,.78,.29,0);
  box(group,.22,.038,.40,highlight,.83,.245,0);
  box(group,.30,.028,.13,bodyDark,.12,.58,0);
 }
 if(cfg.type===1){
  extrudeShell(group,[[.89,0],[.78,.19],[.48,.31],[-.02,.35],[-.52,.36],[-.91,.26],[-1.10,.12],[-1.06,-.12],[-.88,-.26],[-.48,-.36],[-.02,-.35],[.48,-.31],[.78,-.19]],.13,body,-.02,.355,0,.04);
  extrudeShell(group,[[.58,0],[.47,.12],[.12,.21],[-.20,.23],[-.57,.21],[-.78,.12],[-.86,0],[-.78,-.12],[-.57,-.21],[-.20,-.23],[.12,-.21],[.47,-.12]],.088,accent,-.10,.505,0,.032);
  capsule(group,.14,.36,canopy,-.08,.56,0,0,0,Math.PI/2,1.22,.96,1);
  capsule(group,.11,.28,bodyDark,.25,.39,.31,0,0,Math.PI/2,1.12,.88,1);
  capsule(group,.11,.28,bodyDark,.25,.39,-.31,0,0,Math.PI/2,1.12,.88,1);
  sph(group,.12,bodyDark,-.66,.46,.30,0,0,0,1.5,1,.86);
  sph(group,.12,bodyDark,-.66,.46,-.30,0,0,0,1.5,1,.86);
  box(group,.48,.09,.11,accent,-.83,.55,0);
  box(group,.58,.055,.60,accent,-.73,.66,0);
  box(group,.18,.08,.58,trim,-.73,.55,0);
  box(group,.21,.045,.44,highlight,.86,.255,0);
 }
 if(cfg.type===2){
  extrudeShell(group,[[.90,0],[.74,.18],[.36,.28],[-.08,.31],[-.46,.33],[-.82,.25],[-1.00,.13],[-1.03,0],[-1.00,-.13],[-.82,-.25],[-.46,-.33],[-.08,-.31],[.36,-.28],[.74,-.18]],.12,body,-.02,.35,0,.038);
  extrudeShell(group,[[.52,0],[.34,.13],[-.02,.18],[-.38,.19],[-.63,.14],[-.76,.06],[-.80,0],[-.76,-.06],[-.63,-.14],[-.38,-.19],[-.02,-.18],[.34,-.13]],.075,accent,-.10,.475,0,.03);
  capsule(group,.12,.35,canopy,-.10,.53,0,0,0,Math.PI/2,1.18,.9,1);
  capsule(group,.088,.30,bodyDark,.22,.37,.29,0,0,Math.PI/2,1.22,.82,1);
  capsule(group,.088,.30,bodyDark,.22,.37,-.29,0,0,Math.PI/2,1.22,.82,1);
  box(group,.26,.07,.57,bodyDark,-.55,.42,0);
  box(group,.42,.05,.10,accent,-.82,.45,0);
  box(group,.34,.035,.18,accent,.48,.42,0);
  box(group,.18,.04,.46,highlight,.82,.248,0);
  box(group,.34,.03,.11,amber,.08,.57,0);
 }
 // common aerodynamic pieces / axle covers
 capsule(group,.045,.66,trim,.02,.245,.34,Math.PI/2,0,0,1,1,1);
 capsule(group,.045,.66,trim,.02,.245,-.34,Math.PI/2,0,0,1,1,1);
 // Lightweight body variations remain visible in the garage.
 if(kit.cut>=1){
   for(const z of [-.18,.18])capsule(group,.022,.17,trim,.04,.50,z,0,0,Math.PI/2,1,.7,1);
 }
 if(kit.cut>=2){
   for(const x of [-.34,.28])for(const z of [-.21,.21])capsule(group,.018,.10,trim,x,.40,z,0,0,Math.PI/2,1,.72,1);
 }
 if(kit.cut===3){
   box(group,.54,.024,.16,accent,.32,.42,0);
   box(group,.32,.022,.10,highlight,.56,.33,0);
 }

 }
 // Front and rear roller units share a single centerline.
 for(const side of [-1,1]){
  const x=side*(.78+cfg.fine.rollerSpread*.055);
  const h=cfg.fine.rollerHeight*.024;
  const mount=new THREE.Group();
  mount.position.set(x,0,0);group.add(mount);
  if(side<0) box(mount,.31,.035,.16,chassisMat,.13,.205+h,0);
  box(mount,.15,stayPart.mass<0?.028:.045,1.10,stayPart.mass<0?mat(0x192b31,.28,.56):cfg.type===0?chassisMat:carbon,0,.22+h,0);
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
 if(d.mass){
  const n=d.mass>=12?4:2;
  for(let i=0;i<n;i++){
   const xx=(n===2?(cfg.parts.damper===2?-.56:.52):i<2?.52:-.56)+cfg.fine.damperBias*.10;
   const zz=i%2?-.29:.29;
   box(group,.09,.1,.11,gold,xx,.20,zz);cyl(group,.021,.021,.06,metal,xx,.28,zz)
  }
 }
 if(b.mass){
  const xx=cfg.parts.brake===2?-.88:.88;
  box(group,.20,.044,.70,mat(0xe88142),xx,.053+cfg.fine.brakeHeight*.012,0);
  if(cfg.parts.brake>=3)box(group,.18,.04,.7,mat(0xe88142),-.88,.053+cfg.fine.brakeHeight*.012,0)
 }
 if(m.rpm>1.2)box(group,.18,.03,.27,gold,-.18,.60,0);
 return group;
}

function buildCar(){
 wheelGroups=[];
 const group=buildTougeCar(cfg.type);
 wheelGroups=group.userData.wheelGroups||[];
 const r=choose('roller'),d=choose('damper'),b=choose('brake'),m=choose('motor'),stay=choose('stay');
 const halfL=group.userData.bodyHalfLength||.88;
 const halfW=Math.max(.39,group.userData.bodyHalfWidth||.38);
 const deckMat=mat(0x151c22,.22,.72),stayMat=stay.mass<0?mat(0x22343b,.32,.55):carbon;

 // A slim chassis remains under the transplanted road-car body.
 box(group,Math.max(1.35,halfL*1.62),.055,Math.max(.56,halfW*1.42),deckMat,0,.075,0);
 box(group,Math.max(1.46,halfL*1.73),.022,.15,stayMat,0,.108,0);

 const beam=(parent,x1,z1,x2,z2,y,thickness=.038)=>{
  const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz);
  const part=box(parent,len,thickness,.07,stayMat,(x1+x2)/2,y,(z1+z2)/2);
  part.rotation.y=-Math.atan2(dz,dx);return part;
 };
 // Each roller rig starts at the exact vehicle centre.  Keeping a single
 // centre datum prevents the paired rollers from looking laterally offset.
 const rollerCenters={front:[],rear:[]};
 for(const end of [-1,1]){
  const x=end*(halfL+.11+cfg.fine.rollerSpread*.026),h=.13+cfg.fine.rollerHeight*.012;
  const innerX=end*(halfL-.23);
  const span=Math.max(.49,halfW+.12);
  const rigName=end>0?'front':'rear';
  box(group,.14,.04,.12,stayMat,innerX,h,0);
  for(const side of [-1,1]){
   const z=side*span;
   beam(group,innerX,0,x,z,h,stay.mass<0?.026:.04);
   // Build every part around one local Y axis.  The old front stabilizer used
   // x-.035, so its cap and shaft visibly missed the roller centre.
   const rollerAssembly=new THREE.Group();
   rollerAssembly.position.set(x,h,z);
   rollerAssembly.userData.axis={x:0,z:0};
   group.add(rollerAssembly);
   box(rollerAssembly,.13,.035,.09,stayMat,0,0,0);
   cyl(rollerAssembly,.018,.018,.13,metal,0,.065,0);
   const rad=r.diam/13*.071;
   cyl(rollerAssembly,rad,rad,.055,r.friction<.7?gold:silver,0,.145,0);
   cyl(rollerAssembly,rad*.55,rad*.55,.06,black,0,.177,0);
   tor(rollerAssembly,rad*.72,.007,metal,0,.209,0,Math.PI/2);
   if(end>0){
    cyl(rollerAssembly,.025,.025,.10,metal,0,.20,0);
    cyl(rollerAssembly,.04,.04,.045,gold,0,.275,0);
   }
   rollerCenters[rigName].push({x,y:h+.145,z});
  }
 }
 group.userData.rollerCenters=rollerCenters;
 group.userData.frontRollerCenter={
  x:rollerCenters.front[0].x,
  y:rollerCenters.front[0].y,
  z:(rollerCenters.front[0].z+rollerCenters.front[1].z)/2
 };
 if(d.mass){
  const count=d.mass>=12?4:2;
  for(let i=0;i<count;i++){
   const front=count===2?cfg.parts.damper!==2:i<2;
   const x=(front?halfL*.56:-halfL*.56)+cfg.fine.damperBias*.055,z=(i%2?-.30:.30);
   cyl(group,.045,.052,.14,gold,x,.18,z);cyl(group,.014,.014,.08,metal,x,.285,z);
  }
 }
 if(b.mass){const x=cfg.parts.brake===2?-halfL*.92:halfL*.92;box(group,.16,.035,halfW*1.45,mat(0xe88142),x,.035+cfg.fine.brakeHeight*.01,0);if(cfg.parts.brake>=3)box(group,.16,.035,halfW*1.45,mat(0xe88142),-halfL*.92,.035+cfg.fine.brakeHeight*.01,0)}
 if(m.rpm>1.2)box(group,.18,.025,.26,gold,-.12,.12,0);
 return group;
}

const sharedCarMaterials=new Set([metal,black,rubber,carbon,silver,gold]);
function disposeCarModel(model){
 const geometries=new Set(),materials=new Set(),textures=new Set();
 model.traverse(object=>{
  if(!object.isMesh)return;
  if(object.geometry)geometries.add(object.geometry);
  const list=Array.isArray(object.material)?object.material:[object.material];
  for(const material of list){
   if(!material||sharedCarMaterials.has(material))continue;
   materials.add(material);
   for(const value of Object.values(material))if(value?.isTexture)textures.add(value);
  }
 });
 for(const texture of textures)texture.dispose();
 for(const material of materials)material.dispose();
 for(const geometry of geometries)geometry.dispose();
}
function refreshCar(){
 persist();renderUI();
 const previous=car;
 // Build first so a failed custom design never leaves the scene empty.
 const replacement=buildCar();
 car=replacement;carContainer.add(replacement);
 carContainer.position.y=screen==='test'?TRACK_CAR_Y:GARAGE_CAR_Y;
 if(screen==='test')setScreen('garage');
 if(previous){
  carContainer.remove(previous);
  try{disposeCarModel(previous)}catch(error){console.warn('旧車両リソースの解放を継続できませんでした',error)}
 }
}
// Smooth closed oval in X/Z plane, with curvature-based corner dynamics.
// Ver.0.2.1: 3x the original physical circuit length (not a 3-lap timer).
// The lane width stays unchanged: this makes a genuinely longer course.
let curveRadius=3.2*TRACK_SCALE,straightHalf=4.2*TRACK_SCALE;
let ovalLength=4*straightHalf+2*Math.PI*curveRadius;
// Four lanes retain the established 1.8-unit pitch instead of squeezing more
// cars into the old width. Every boundary is also an invisible guide wall.
let activeCourse={profile:'flat'};
let courseCurve=null;
let courseBounds={minX:-20,maxX:20,minZ:-12,maxZ:12};
let courseCurvatureSamples=new Float32Array(720);
function oval(u,r=curveRadius){let dist=((u%1)+1)%1*ovalLength;const straight=straightHalf*2, arc=Math.PI*curveRadius;
 if(courseCurve){
  const v=((u%1)+1)%1,point=courseCurve.getPointAt(v),tangent=courseCurve.getTangentAt(v);
  const ang=Math.atan2(tangent.z,tangent.x),offset=r-curveRadius;
  return {x:point.x-Math.sin(ang)*offset,z:point.z+Math.cos(ang)*offset,ang,curved:true};
 }
 if(activeCourse?.profile==='double'){
  const v=((u%1)+1)%1,a=v*Math.PI*2,span=straightHalf+curveRadius*.42;
  const cx=span*Math.sin(a),cz=curveRadius*.92*Math.sin(2*a);
  const dx=span*Math.cos(a),dz=curveRadius*1.84*Math.cos(2*a);
  const ang=Math.atan2(dz,dx),offset=r-curveRadius;
  return {x:cx-Math.sin(ang)*offset,z:cz+Math.cos(ang)*offset,ang,curved:true};
 }
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
const CUSTOM_COURSE_KEY='mini4wd_lab_custom_course_v1';
const COURSE_PRESETS={
 junior:{name:'テクニカル複合1',profile:'bridge',description:'全長約831mの大型周回コース。緩やかな連続S字とロングカーブ、ウェーブを組み合わせた4レーン平等設計。'},
 speed:{name:'テクニカル複合2',profile:'speedbridge',description:'左右対称の高速ダブルループ。中央に高さ3.25の立体交差と緩勾配のロングブリッジを配置。'},
 technical3:{name:'テクニカル複合3',profile:'technical',description:'細かな折返し、20°バンク、連続スロープ、ジャンプを組み合わせた高難度コース。'},
 doublecross:{name:'サイバークロス',profile:'double',description:'複数の交差と連続S字を持つ長大な立体コース。上段と下段を支持脚で分離。'},
 custom:{name:'マイ・カスタムコース',profile:'custom',description:'コースビルダーのパーツ数と基本レイアウトから生成するオリジナル複合コース。'}
};
function harmonicCourse(rx,rz,lobes,amplitude,phase=0){
 return Array.from({length:96},(_,i)=>{
  const a=i/96*Math.PI*2;
  const factor=1+amplitude*Math.sin(lobes*a+phase)+amplitude*.28*Math.sin((lobes+2)*a-phase*.6);
  return [rx*factor*Math.cos(a),rz*factor*Math.sin(a)];
 });
}
function figureEightCourse(rx,rz){
 return Array.from({length:128},(_,i)=>{
  const a=i/128*Math.PI*2+Math.PI/2;
  return [rx*Math.sin(a),rz*Math.sin(2*a)];
 });
}
const COURSE_PATHS={
 // Points progress continuously around the perimeter.  Unlike the previous
 // hand-drawn lists, the final tangent meets the first tangent without a cusp.
 junior:harmonicCourse(160,96,5,.045,.25),
 speed:figureEightCourse(120,65),
 customSpeed:harmonicCourse(40.5,21,3,.065,.55),
 technical3:harmonicCourse(38,22.4,6,.09,.9),
 // Keep the Cyber Cross topology, but enlarge every radius enough that the
 // four offset lane paths remain smooth instead of folding into sharp cusps.
 // Extra samples also stop the spline itself from faceting at the turnarounds.
 doublecross:Array.from({length:96},(_,i)=>{const a=i/96*Math.PI*2;return [115*Math.sin(2*a),62.5*Math.sin(3*a)]})
};
activeCourse=COURSE_PRESETS.junior;
function readCustomCourse(){try{return {layout:'balanced',straight:8,curve:8,wave:2,slope:2,bank:1,jump:1,...JSON.parse(localStorage.getItem(CUSTOM_COURSE_KEY))}}catch{return {layout:'balanced',straight:8,curve:8,wave:2,slope:2,bank:1,jump:1}}}
function configureCourse(){
 activeCourse=COURSE_PRESETS[courseMode]||COURSE_PRESETS.junior;
 let source=COURSE_PATHS[courseMode]||COURSE_PATHS.junior,scaleX=1,scaleZ=1;
 if(courseMode==='custom'){
  const c=readCustomCourse();
  source=c.layout==='speed'?COURSE_PATHS.customSpeed:c.layout==='compact'?COURSE_PATHS.technical3:COURSE_PATHS.junior;
  scaleX=.78+c.straight*.035;scaleZ=.76+c.curve*.035+c.wave*.018;
 }
 const points=source.map(([x,z])=>new THREE.Vector3(x*scaleX,0,z*scaleZ));
 courseCurve=new THREE.CatmullRomCurve3(points,true,'centripetal',.42);
 ovalLength=courseCurve.getLength();curveRadius=3.2*TRACK_SCALE;
 let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
 for(let i=0;i<720;i++){const p=courseCurve.getPointAt(i/720);minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minZ=Math.min(minZ,p.z);maxZ=Math.max(maxZ,p.z)}
 courseBounds={minX,maxX,minZ,maxZ};straightHalf=Math.max(Math.abs(minX),Math.abs(maxX));
 for(let i=0;i<courseCurvatureSamples.length;i++){
  const u=i/courseCurvatureSamples.length,d=.0015,a=courseCurve.getTangentAt((u-d+1)%1),b=courseCurve.getTangentAt((u+d)%1);
  const dot=THREE.MathUtils.clamp(a.dot(b),-1,1),angle=Math.acos(dot);
  courseCurvatureSamples[i]=angle/(ovalLength*d*2);
 }
}
function courseCurvature(u){const v=((u%1)+1)%1,index=Math.floor(v*courseCurvatureSamples.length)%courseCurvatureSamples.length;return courseCurvatureSamples[index]}
function distanceToNextCorner(u){
 const N=courseCurvatureSamples.length,start=Math.floor((((u%1)+1)%1)*N);
 for(let i=0;i<Math.min(N,100);i++){if(courseCurvatureSamples[(start+i)%N]>.035)return i/N*ovalLength}
 return ovalLength;
}
function elevation(u){
 const v=((u%1)+1)%1;
 const rise=(start,top,end,height)=>height*(smooth((v-start)/(top-start))-smooth((v-top)/(end-top)));
 const bridge=(start,upEnd,downStart,end,height)=>height*(smooth((v-start)/(upEnd-start))-smooth((v-downStart)/(end-downStart)));
 if(activeCourse.profile==='flat')return 0;
 if(activeCourse.profile==='bridge')return rise(.10,.18,.31,1.18)+rise(.61,.645,.69,.23);
 if(activeCourse.profile==='speedbridge')return bridge(.55,.65,.85,.95,3.25);
 if(activeCourse.profile==='technical')return rise(.07,.17,.29,1.4)+rise(.52,.59,.66,.62)+rise(.77,.80,.835,.28);
 // Every Cyber Cross self-intersection has one deliberately raised branch.
 // The 3.2+ unit clearance comfortably passes a complete Mini 4WD model;
 // the enlarged layout leaves long, gentle approaches despite the height.
 if(activeCourse.profile==='double')return bridge(.24,.28,.36,.40,3.2)+bridge(.39,.43,.55,.59,3.4)+bridge(.60,.64,.735,.78,3.25);
 if(activeCourse.profile==='custom'){
  const c=readCustomCourse(),s=Math.min(1,c.slope/2),j=Math.min(1,c.jump/2);
  return rise(.08,.18,.31,1.28*s)+rise(.52,.58,.66,.55*j)+(c.slope>2?rise(.73,.80,.88,.92):0);
 }
 return 0;
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
const modularCourseGroup=new THREE.Group();trackGroup.add(modularCourseGroup);
function clearObjectGroup(group){
 for(const child of [...group.children]){group.remove(child);child.traverse(o=>{if(o.geometry)o.geometry.dispose();const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list)if(m&&!sharedCarMaterials.has(m)){if(m.map)m.map.dispose();m.dispose()}})}
}
function addLaneNumber(number,offset){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#10212ddd';ctx.beginPath();ctx.roundRect(12,12,104,104,24);ctx.fill();
 ctx.strokeStyle='#ffd05a';ctx.lineWidth=8;ctx.stroke();ctx.fillStyle='#ffffff';ctx.font='900 76px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(number),64,67);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;
 const u=.012,p=oval(u),t=new THREE.Vector3(Math.cos(p.ang),0,Math.sin(p.ang)),n=new THREE.Vector3(-Math.sin(p.ang),0,Math.cos(p.ang));
 const center=new THREE.Vector3(p.x+n.x*offset,.082+elevation(u),p.z+n.z*offset),w=1.48,h=1.52;
 const corners=[center.clone().addScaledVector(n,-w/2).addScaledVector(t,-h/2),center.clone().addScaledVector(n,w/2).addScaledVector(t,-h/2),center.clone().addScaledVector(n,w/2).addScaledVector(t,h/2),center.clone().addScaledVector(n,-w/2).addScaledVector(t,h/2)];
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(corners.flatMap(v=>[v.x,v.y,v.z]),3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,1],2));geometry.setIndex([0,1,2,0,2,3]);
 const label=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide}));label.renderOrder=4;modularCourseGroup.add(label);
}
function supportPointUnderDeck(u,side,deckHeight){
 // Columns must sit inside the elevated road footprint. Try beneath the
 // outer lane first, then move inward only when another, lower pass occupies
 // that spot. A conflicting station is omitted instead of piercing its road.
 const offsets=[3.05,2.35,1.65,.95,.3];
 for(const distance of offsets){
  const offset=side*distance,candidate=oval(u,curveRadius+offset);
  let clear=true;
  for(let i=0;i<720;i++){
   const otherU=i/720;
   const separation=Math.min(Math.abs(otherU-u),1-Math.abs(otherU-u));
   if(separation<.018||elevation(otherU)>=deckHeight-.45)continue;
   const q=oval(otherU);
   if(Math.hypot(candidate.x-q.x,candidate.z-q.z)<TRACK_HALF_WIDTH+.18){clear=false;break}
  }
  if(clear)return {...candidate,offset};
 }
 return null;
}
function buildModularCourse(){
 clearObjectGroup(modularCourseGroup);
 const N=600,verts=[],indices=[];
 for(let i=0;i<=N;i++){
  const u=i/N,inner=oval(u,curveRadius-TRACK_HALF_WIDTH),outer=oval(u,curveRadius+TRACK_HALF_WIDTH),y=.048+elevation(u);
  verts.push(outer.x,y,outer.z,inner.x,y,inner.z);
  if(i<N){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2)}
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();
 const road=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0x4b5862,side:THREE.DoubleSide}));road.renderOrder=1;modularCourseGroup.add(road);
 const addCourseLine=(offset,color,radius)=>{
  // Sample the authoritative path directly. Re-fitting the already-offset
  // points caused the folded/triangular line artefacts on tight corners.
  const curve=new THREE.Curve();
  curve.getPoint=t=>{const p=oval(t,curveRadius+offset);return new THREE.Vector3(p.x,.09+elevation(t),p.z)};
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,N,radius,6,true),new THREE.MeshBasicMaterial({color}));mesh.renderOrder=2;modularCourseGroup.add(mesh);
 };
 for(let boundary=0;boundary<=TRACK_LANE_COUNT;boundary++){
  const offset=-TRACK_HALF_WIDTH+boundary*TRACK_LANE_WIDTH;
  const outside=boundary===0||boundary===TRACK_LANE_COUNT;
  addCourseLine(offset,boundary===TRACK_LANE_COUNT?0xe85f61:0xe8edf0,outside ? .055 : .018);
 }
 const start=oval(0),ahead=oval(.001),startAngle=Math.atan2(ahead.z-start.z,ahead.x-start.x);
 const startLine=box(modularCourseGroup,.12,.016,TRACK_HALF_WIDTH*2,new THREE.MeshBasicMaterial({color:0xffd05a}),start.x,.078+elevation(0),start.z);startLine.rotation.y=-startAngle;startLine.renderOrder=3;
 // Painted start boxes: lane 1 is innermost and lane 4 outermost.
 for(let lane=1;lane<=TRACK_LANE_COUNT;lane++)addLaneNumber(lane,LANE_OFFSETS[lane-1]);
 // Repeating seams make the ABS course-part construction visible.
 const partCount=THREE.MathUtils.clamp(Math.round(ovalLength/3.2),44,96);
 for(let i=0;i<partCount;i++){
  const u=i/partCount,p=oval(u),q=oval(u+.001),ang=Math.atan2(q.z-p.z,q.x-p.x);
  const seam=box(modularCourseGroup,.025,.012,TRACK_HALF_WIDTH*2.02,new THREE.MeshBasicMaterial({color:0x263945}),p.x,.07+elevation(u),p.z);seam.rotation.y=-ang;
 }
 // Bridge bents now genuinely support the deck: paired columns stand beneath
 // the elevated road, while collision checks omit columns over a lower pass.
 const supportMaterial=new THREE.MeshBasicMaterial({color:0x26323a});
 const supportRows=44;
 for(let i=0;i<supportRows;i++){
  const u=(i+.5)/supportRows,h=elevation(u);if(h<.72)continue;
  const columns=[supportPointUnderDeck(u,-1,h),supportPointUnderDeck(u,1,h)].filter(Boolean);
  for(const p of columns){
   box(modularCourseGroup,.24,h-.04,.24,supportMaterial,p.x,(h-.04)/2,p.z);
   box(modularCourseGroup,.48,.12,.48,supportMaterial,p.x,h-.025,p.z);
  }
  if(columns.length===2){
   const center=oval(u),span=Math.abs(columns[1].offset-columns[0].offset);
   const beam=box(modularCourseGroup,.22,.14,span+.38,supportMaterial,center.x,h-.04,center.z);
   beam.rotation.y=-center.ang;
  }
 }
}
function elevatedCourse(){return activeCourse.profile!=='flat'}
function showCourse(){
 configureCourse();buildModularCourse();
 // Legacy prototype surfaces remain available in code, but the visible course
 // is now assembled from the shared four-lane modular part standard.
 flatTrackMeshes.forEach(o=>o.visible=o===trackGround);
 trackGround.visible=true;
 technicalGroup.visible=false;modularCourseGroup.visible=true;
 const heading=document.getElementById('courseHeading');
 if(heading)heading.textContent=`4-LANE CIRCUIT / ${activeCourse.name}`;
 const selectLabel=document.querySelector('label[for="courseSelect"]');if(selectLabel)selectLabel.textContent='4レーンコース選択';
 const description=document.getElementById('courseDescription');
 if(description)description.textContent=`${activeCourse.description} 全長 約${ovalLength.toFixed(1)}m。透明ガイド壁を持つワイド4レーン規格。`;
 const legend=document.querySelector('#testPane .legend');if(legend)legend.textContent='プレイヤー1台で試走 / ワイド4レーン / 透明ガイド壁 / 走行テンポ4倍';
 const notice=document.querySelector('#testPane .notice');if(notice)notice.textContent='Ver.0.8.5：テクニカル複合1・2を長大化し、複合2へ専用の立体交差を追加しました。';
 const selected=document.getElementById('courseSelect');if(selected)selected.value=courseMode;
 const laneSelect=document.getElementById('laneSelect');if(laneSelect)laneSelect.value=String(playerLane);
}

// Match the scaled tires to the actual running surface and podium top.
const TRACK_CAR_Y=.04-.9*.01;
const GARAGE_CAR_Y=.185-.9*.01;
function positionRaceCar(container,u,laneOffset){
 const p=oval(u),y=TRACK_CAR_Y+elevation(u),nx=-Math.sin(p.ang),nz=Math.cos(p.ang);
 container.position.set(p.x+nx*laneOffset,y,p.z+nz*laneOffset);
 container.rotation.set(0,-p.ang,elevatedCourse()?Math.atan(roadSlope(u)):0);
}
// UI and view transformations
function fitTrackCamera(){
 // A fixed camera distance cropped the horizontal edges, especially on tall phones.
 // Fit the complete course using the live canvas aspect ratio and projected extents.
 const rect=renderer.domElement.getBoundingClientRect();
 const aspect=Math.max(.25,rect.width/Math.max(1,rect.height));
 camera.fov=48;camera.updateProjectionMatrix();
 const centerX=(courseBounds.minX+courseBounds.maxX)/2,centerZ=(courseBounds.minZ+courseBounds.maxZ)/2;
 const halfW=(courseBounds.maxX-courseBounds.minX)/2+TRACK_HALF_WIDTH+1.2,halfD=(courseBounds.maxZ-courseBounds.minZ)/2+TRACK_HALF_WIDTH+1.2;
 const direction=new THREE.Vector3(0,1.35,.65).normalize();
 const projectedVertical=halfD*direction.y+.35*direction.z;
 const halfTan=Math.tan(THREE.MathUtils.degToRad(camera.fov*.5));
 const requiredDistance=Math.max((halfW)/(halfTan*aspect),projectedVertical/halfTan)*1.20;
 controls.target.set(centerX,elevatedCourse()?.5:0,centerZ);
 camera.position.copy(direction.multiplyScalar(requiredDistance)).add(new THREE.Vector3(centerX,elevatedCourse()?.5:0,centerZ));
 controls.minDistance=3;
 controls.maxDistance=Math.max(110,requiredDistance*2.5);
 camera.updateProjectionMatrix();
}
function setView(view){if(screen==='test'){fitTrackCamera();}
else{camera.fov=38;controls.target.set(-.55,.28,0);camera.position.copy(({front:[3.8,1.5,0],side:[0,1.4,3.9],top:[.01,4.5,.01],angle:[2.8,2.3,3.8]})[view||'angle']?new THREE.Vector3(...({front:[3.8,1.5,0],side:[0,1.4,3.9],top:[.01,4.5,.01],angle:[2.8,2.3,3.8]})[view||'angle']):new THREE.Vector3(2.8,2.3,3.8));camera.position.x-=.55;}camera.updateProjectionMatrix();controls.update();}
function setScreen(mode){screen=mode;showCourse();syncArenaBackdrop();syncSceneEnvironment();const testing=mode==='test';$('garagePane').classList.toggle('hidden',testing);$('testPane').classList.toggle('hidden',!testing);$('garageTab').classList.toggle('active',!testing);$('testTab').classList.toggle('active',testing);garageGroup.visible=!testing;trackGroup.visible=testing;$('overLine').textContent=testing?'4-LANE MODULAR CIRCUIT':'CUSTOM MACHINE WORKSHOP';$('overTitle').textContent=testing?'SOLO COURSE TEST':'TUNING GARAGE';$('overHint').textContent=testing?'プレイヤー1台 / 透明ガイド壁4レーン複合コース':'ドラッグ：回転　ホイール/ピンチ：拡大縮小';$('viewStatus').classList.toggle('hidden',testing);$('sceneStats').classList.toggle('hidden',testing);if(!testing){race=null;resetPlayback();carContainer.position.set(0,GARAGE_CAR_Y,0);carContainer.rotation.set(0,0,0)}else{placeCar(0);carContainer.rotation.x=0;carContainer.rotation.z=0}setView('angle');updateBest();updateMotorSound()}
function placeCar(u){positionRaceCar(carContainer,u,LANE_OFFSETS[playerLane-1])}
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
 const base=`${courseMode}_4lane_v085_lane${playerLane}`;
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
  guideCapacity:p.guideCapacity*tractionFactor*stabilityFactor,
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
function displayRace(){if(!race)return;const r=race;$('speedRead').textContent=(r.v*3.6).toFixed(1);$('lapRead').textContent=r.time.toFixed(2);$('maxRead').textContent=(r.maxV*3.6).toFixed(1);$('stateRead').textContent=r.crash?.active?r.crash.label+'中':r.failed?'アウト':r.batteryEmpty?'電池切れ':r.done?'完走':r.active&&playbackPaused?'一時停止':r.air?'ジャンプ中':r.active?'走行中':'待機中';$('progressBar').style.width=(Math.min(100,r.distance/ovalLength*100)).toFixed(1)+'%';$('lapCount').textContent=String(r.done&&!r.loop&&!r.failed?r.laps:r.laps+1);$('lapLast').textContent=r.lastLap==null?'--.--':r.lastLap.toFixed(2);$('lapBest').textContent=r.bestLap==null?'--.--':r.bestLap.toFixed(2);updateCondition()}
function startRace(){
 const p=physics();race={active:true,done:false,failed:false,v:0,time:0,distance:0,maxV:0,p,risk:0,crash:null,wearEnabled:$('wearEnabled').checked,battery:100,tire:100,motorTemp:25,motorHealth:100,telemetry:[],loop:$('loopRun').checked,laps:0,lapStart:0,lastLap:null,bestLap:null,
   peakLateral:0,guidePeak:0,wallContactTime:0,cornerLoss:0,fastestStraight:0,curveTime:0,cornerWarnings:0,air:null,jumps:0,landings:0,landingShock:0,landingPitch:0,bounces:0,lastLanding:'未計測',bounce:null};
 playTone(880,.16,'square',.15,1120);
 $('resultTime').textContent='--.-- s';$('delta').textContent=race.loop?'連続走行中：停止ボタンで終了できます':'計測中';resetPlayback();recordRaceFrame();syncTransportUI();
 $('runLog').textContent=elevatedCourse()?`スタート！ レーン${playerLane}から複合立体コースの坂道・ジャンプ・着地を確認します。`:`スタート！ レーン${playerLane}からロングコースの最高速とコーナー性能を確認します。`;
 placeCar(0);accum=0;renderLapAnalysis(race);displayRace();
}
function stopRace(failed){
 const r=race;if(!r||r.done)return;r.done=true;r.active=false;r.failed=failed;playbackPaused=!failed;syncTransportUI();
 const key=raceRecordKey(r);const before=records[key]?.time;
 const report=`${elevatedCourse()?`ジャンプ ${r.jumps}回 / 着地 ${r.landings}回 / 着地判定 ${r.lastLanding} / 着地衝撃 ${r.landingShock.toFixed(1)} / 最大姿勢角 ${r.landingPitch.toFixed(1)}° / バウンド ${r.bounces}回。`:''}微調整［ローラー高 ${r.p.fine.rollerHeight*2}mm / 前後幅 ${r.p.fine.rollerSpread*12}mm / ダンパー ${r.p.fine.damperBias} / ブレーキ高 ${r.p.fine.brakeHeight}mm］。ローラー片側隙間 ${r.p.guideClearanceMm.toFixed(1)}mm / 壁接触 ${r.wallContactTime.toFixed(2)}秒 / 最大壁荷重 ${r.guidePeak.toFixed(2)}倍。最高速度 ${(r.maxV*3.6).toFixed(1)} km/h / コーナー走行 ${r.curveTime.toFixed(2)} 秒 / コーナー減速量 ${r.cornerLoss.toFixed(1)} km/h / 総重量 ${r.p.mass}g / 電池 ${r.battery.toFixed(1)}% / タイヤ ${r.tire.toFixed(1)}% / モーター ${r.motorTemp.toFixed(1)}℃。`;
 if(failed){
  playTone(150,.42,'sawtooth',.22,45);
  startCrashAnimation();
  $('resultTime').textContent='COURSE OUT';$('delta').textContent='コースアウト：'+r.crash.label;
  $('runLog').textContent=`コースアウト：${r.laps+1}周目 ${(r.distance/ovalLength*100).toFixed(0)}%地点。${report} 飛び出し後の演出：${r.crash.label}。ローラーやタイヤ、ダンパーを見直すか、最高速を抑えてください。`;
 }else{
  playTone(660,.18,'square',.14,880);playTone(990,.34,'sine',.13,1320);
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
 const r=race,p=deriveRunningPhysics(r),u=r.distance/ovalLength;
 const curvature=courseCurvature(u),onCurve=curvature>.035,toCorner=distanceToNextCorner(u);
 const localRadius=1/Math.max(.008,curvature);
 // Invisible guide walls are contacted by the rollers. Corner speed emerges
 // from v²/R versus roller/stay capacity instead of a visual wall collision.
 const limit=Math.sqrt(Math.max(1,p.guideCapacity*localRadius));
 const lateralLoad=onCurve?r.v*r.v/localRadius:0;
 const guideLoad=lateralLoad/Math.max(.1,p.guideCapacity);
 const technical=elevatedCourse();
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
 if(onCurve){
  const wallContact=THREE.MathUtils.clamp((guideLoad-.18)/.82,0,1.8);
  forwardAccel-=p.cornerFriction*wallContact*(.45+r.v/Math.max(1,limit));
  r.wallContactTime+=wallContact>.04?dt:0;
  r.guidePeak=Math.max(r.guidePeak,guideLoad);
  r.curveTime+=dt;
 }
 // Brake just enough before entering corners; max braking is finite.
 if(toCorner<10.0){
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
  forwardAccel-=Math.min(8.0,(r.v-limit*.94)*4+p.cornerFriction);
  r.cornerLoss+=Math.max(0,prior-forwardAccel)*dt*3.6;
 }
 r.v=Math.max(0,Math.min(p.maxSpeed,r.v+forwardAccel*dt));
 const advance=r.v*dt;
 r.distance+=advance;r.time+=dt;r.maxV=Math.max(r.maxV,r.v);
 accumulateWear(r,dt,advance);
 if(r.wearEnabled&&r.battery<=0){r.active=false;r.done=true;r.batteryEmpty=true;playbackPaused=true;playTone(105,.5,'sawtooth',.18,42);syncTransportUI();$('stateRead').textContent='電池切れ';$('resultTime').textContent='BATTERY EMPTY';$('delta').textContent=`${r.laps}周完走後、電池残量が0%になりました`;$('runLog').textContent=`連続走行終了。累計走行 ${((r.laps*ovalLength)+r.distance).toFixed(1)}m。タイヤ残量 ${r.tire.toFixed(1)}%、モーター温度 ${r.motorTemp.toFixed(1)}℃。`;displayRace();return;}
 if(technical&&activeCourse.profile!=='speedbridge'){
  // Longitudinal balance combines front/rear dampers and fine position.
  // Positive pitch = nose up; excessive nose-up/down on landing is penalized.
  const damper=choose('damper'), tire=choose('tire');
  const bias=(damper.mass ? cfg.fine.damperBias*.16 : 0)
      +(cfg.parts.damper===1? .14 : cfg.parts.damper===2?-.14:0)
      +(TYPES[cfg.type].id==='E'?.04:TYPES[cfg.type].id==='F'?-.035:0);
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
  const overload=Math.sqrt(Math.max(0,guideLoad));
  r.peakLateral=Math.max(r.peakLateral,overload);
  if(overload>1.08)r.risk+=dt*(overload-1.08)*1.8;
  else r.risk=Math.max(0,r.risk-dt*.72);
 }else r.risk=Math.max(0,r.risk-dt*1.5);
 if(r.risk>.75){placeCar(Math.min(.9999,r.distance/ovalLength));stopRace(true);return}
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
syncSoundButton();
$('soundBtn').addEventListener('click',()=>{
 soundEnabled=!soundEnabled;try{localStorage.setItem(SOUND_PREF_KEY,soundEnabled?'on':'off')}catch{}
 syncSoundButton();if(soundEnabled){initAudio();playTone(720,.1,'sine',.12,900)}updateMotorSound();
});
$('arenaBackground').addEventListener('change',syncArenaBackdrop);
$('wearEnabled').addEventListener('change',()=>{if(!race?.active){race=null;updateBest();updateCondition();}});
$('loopRun').addEventListener('change',()=>{if(race?.active){race.loop=$('loopRun').checked;syncTransportUI();}});
$('laneSelect').addEventListener('change',event=>{
 playerLane=THREE.MathUtils.clamp(Number(event.target.value)||1,1,TRACK_LANE_COUNT);try{localStorage.setItem(LANE_PREF_KEY,String(playerLane))}catch{}
 race=null;accum=0;resetPlayback();placeCar(0);updateBest();$('lapCount').textContent='1';$('lapLast').textContent='--.--';$('lapBest').textContent='--.--';$('stateRead').textContent='待機中';$('resultTime').textContent='--.-- s';$('delta').textContent=`レーン${playerLane}を選択中`;$('runLog').textContent=`スタート位置${playerLane}番（${playerLane===1?'最内側':playerLane===4?'最外側':'中間'}レーン）から試走します。`;$('progressBar').style.width='0%';updateCondition();updateMotorSound();
});
$('stopRun').addEventListener('click',()=>{if(!race)return;const r=race;playbackPaused=true;r.active=false;r.done=true;recordRaceFrame();$('stateRead').textContent='停止';$('delta').textContent=`停止：${r.laps}周完了 / 計測 ${r.time.toFixed(2)}秒`;$('runLog').textContent=`試走を停止しました。完走 ${r.laps}周。${r.bestLap==null?'完走記録なし':`最速ラップ ${r.bestLap.toFixed(2)} 秒`}。一時停止中はコマ送り戻しで直前の動作を研究できます。`;syncTransportUI();displayRace();updateMotorSound();});
$('courseSelect').addEventListener('change',e=>{courseMode=Object.hasOwn(COURSE_PRESETS,e.target.value)?e.target.value:'junior';race=null;accum=0;resetPlayback();showCourse();placeCar(0);fitTrackCamera();updateBest();$('lapCount').textContent='1';$('lapLast').textContent='--.--';$('lapBest').textContent='--.--';$('stateRead').textContent='待機中';$('resultTime').textContent='--.-- s';$('runLog').textContent='4レーンコースを切り替えました。試走スタートを押してください。';$('progressBar').style.width='0%';updateCondition();updateMotorSound();});$('startRun').onclick=()=>{if(!race||race.done||!race.active){startRace();return}playbackPaused=false;trimFutureFrames();accum=0;syncTransportUI()};$('resetBest').onclick=()=>{records={};localStorage.removeItem(recordsKey);updateBest()};$('garageTab').onclick=()=>setScreen('garage');$('testTab').onclick=()=>setScreen('test');$('backGarage').onclick=()=>setScreen('garage');$('goTest').onclick=()=>setScreen('test');$('resetView').onclick=()=>setView('angle');
// Playback, pause and bounded reversible timeline for frame-by-frame research.
// A transport frame is 1/30 simulation seconds (4 fixed physics ticks).
const SLOW_RATES=[4,2,1,.5];
let playbackPaused=false,slowIndex=0,frameHistory=[],frameCursor=-1,transportTick=0;
const FRAME_HISTORY_LIMIT=1800; // last 60 simulation seconds at 30 fps
function resetPlayback(){playbackPaused=false;slowIndex=0;frameHistory=[];frameCursor=-1;transportTick=0;syncTransportUI()}
function packRaceFrame(){
 if(!race)return null;
 const {p,crash,telemetry,...state}=race;
 return {state:structuredClone(state),telemetry:structuredClone(telemetry),crash:null,
  pos:carContainer.position.toArray(),rotation:carContainer.quaternion.toArray(),wheel:wheelAngle};
}
function recordRaceFrame(){
 if(!race)return;
 if(frameCursor<frameHistory.length-1)frameHistory.length=frameCursor+1;
 frameHistory.push(packRaceFrame());
 if(frameHistory.length>FRAME_HISTORY_LIMIT)frameHistory.shift();
 frameCursor=frameHistory.length-1;
}
function restoreRaceFrame(index){
 const f=frameHistory[index];if(!f||!race)return;
 const p=race.p;
 race={...structuredClone(f.state),p,telemetry:structuredClone(f.telemetry),crash:null};
 carContainer.position.fromArray(f.pos);carContainer.quaternion.fromArray(f.rotation);
 wheelAngle=f.wheel;for(const w of wheelGroups){if(w.userData.spinAxis==='x')w.rotation.x=wheelAngle;else w.rotation.z=wheelAngle}
 frameCursor=index;accum=0;transportTick=0;
 $('resultTime').textContent=race.lastLap==null?'--.-- s':race.lastLap.toFixed(2)+' s';
 $('delta').textContent=`コマ送り位置：${race.time.toFixed(2)} 秒 / ${race.laps+1}周目`;
 renderLapAnalysis(race);displayRace();syncTransportUI();
}
function trimFutureFrames(){if(frameCursor<frameHistory.length-1)frameHistory.length=frameCursor+1}
function advancePhysicsTick(){
 if(!race?.active)return;
 raceStep(fixed);
 transportTick++;
 if(transportTick>=4||!race.active){transportTick=0;recordRaceFrame()}
}
function syncTransportUI(){
 const exists=Boolean(race),live=Boolean(race?.active&&!race?.done);
 $('startRun').textContent=exists&&live&&playbackPaused?'▶ 再開':'▶ 再生';
 $('startRun').disabled=false;
 $('pauseRun').disabled=!live||playbackPaused;
 $('pauseRun').textContent=playbackPaused?'Ⅱ 停止中':'Ⅱ 一時停止';
 $('stopRun').disabled=!exists||(!race.active&&race.done);
 $('stepBack').disabled=!exists||!playbackPaused||frameCursor<=0;
 $('stepForward').disabled=!exists||!playbackPaused||(!race.active&&frameCursor>=frameHistory.length-1);
 $('slowRun').textContent=['スロー：通常','スロー：1/2','スロー：1/4','スロー：1/8'][slowIndex];
 $('transportStatus').textContent=`${['通常4倍','スロー2倍','スロー1倍','スロー0.5倍'][slowIndex]} / ${playbackPaused?'一時停止中・コマ送り可能':live?'再生中':'停止中'} / コマ送りは1/30秒`;
}
$('pauseRun').onclick=()=>{if(!race?.active)return;playbackPaused=true;accum=0;if(transportTick!==0){recordRaceFrame();transportTick=0}displayRace();syncTransportUI();updateMotorSound()};
$('slowRun').onclick=()=>{slowIndex=(slowIndex+1)%SLOW_RATES.length;accum=0;syncTransportUI()};
$('stepBack').onclick=()=>{if(playbackPaused&&frameCursor>0)restoreRaceFrame(frameCursor-1)};
$('stepForward').onclick=()=>{
 if(!playbackPaused||!race)return;
 if(frameCursor<frameHistory.length-1){restoreRaceFrame(frameCursor+1);return}
 if(!race.active)return;
 for(let i=0;i<4&&race.active;i++)advancePhysicsTick();
 if(transportTick>0){recordRaceFrame();transportTick=0}
 displayRace();syncTransportUI();
};
let last=performance.now(),accum=0,wheelAngle=0;const fixed=1/120;let lastConditionTime=0;
function animate(now){requestAnimationFrame(animate);const elapsed=Math.min((now-last)/1000,.075);last=now;if(screen==='test'&&race?.active&&!playbackPaused){accum+=elapsed*SLOW_RATES[slowIndex];while(accum>=fixed&&race?.active){advancePhysicsTick();accum-=fixed}displayRace();syncTransportUI()}
 if(screen==='test'&&race?.crash?.active&&!playbackPaused){updateCrashAnimation(elapsed);displayRace()}
 if(now-lastConditionTime>150){lastConditionTime=now;if(screen==='test')updateCondition();}
 const speed=screen==='test'&&race?(race.crash?.active?race.v*0.45:race.v):0;const tireRadius=(choose('tire').diam/26*.165)*.9;wheelAngle-=speed*elapsed*(race?.active&&!playbackPaused?SLOW_RATES[slowIndex]:race?.crash?.active&&!playbackPaused?1:0)/Math.max(.02,tireRadius);for(const w of wheelGroups){if(w.userData.spinAxis==='x')w.rotation.x=wheelAngle;else w.rotation.z=wheelAngle}
 if(screen==='garage'&&car){carContainer.position.set(0,GARAGE_CAR_Y,0);carContainer.rotation.y=0}
 updateMotorSound();
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
// Mobile garage analytics: swipe left to tuck the panel away, then tap the
// remaining arrow tab to bring it back. Mouse/desktop layout is unaffected.
const statsPanel=$('sceneStats'),statsHandle=$('statsHandle');let statsSwipeStart=null;
function setStatsCollapsed(collapsed){statsPanel.classList.toggle('statsCollapsed',collapsed);statsHandle.textContent=collapsed?'▶':'◀';statsHandle.setAttribute('aria-label',collapsed?'性能グラフを表示':'性能グラフを隠す');try{localStorage.setItem('mini4wd_stats_collapsed',collapsed?'1':'0')}catch{}}
statsHandle.addEventListener('click',event=>{event.stopPropagation();setStatsCollapsed(!statsPanel.classList.contains('statsCollapsed'))});
statsPanel.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')statsSwipeStart={x:event.clientX,y:event.clientY}});
statsPanel.addEventListener('pointerup',event=>{if(!statsSwipeStart)return;const dx=event.clientX-statsSwipeStart.x,dy=event.clientY-statsSwipeStart.y;statsSwipeStart=null;if(dx<-42&&Math.abs(dx)>Math.abs(dy)*1.25)setStatsCollapsed(true)});
try{if(localStorage.getItem('mini4wd_stats_collapsed')==='1')setStatsCollapsed(true)}catch{}
$('loopRun').checked=true;
new ResizeObserver(resize).observe($('scene'));window.addEventListener('resize',resize);renderUI();refreshCar();setScreen('garage');updateCondition();resize();requestAnimationFrame(animate);
document.addEventListener('visibilitychange',updateMotorSound);
