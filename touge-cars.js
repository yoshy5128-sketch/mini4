import * as THREE from 'three';

export const BODY_STORAGE_KEY = 'mini4wd_touge_bodies_v1';

const BASE = {
  color:'#cc2222',width:2.2,roofWidth:1.8,totalLength:5,lift:.26,noseH:.6,noseSlant:.2,spoilerAngle:.2,
  hoodL:1.6,hoodH:.8,fSlant:.8,roofH:1.5,roofL:1.5,rSlant:1,trunkH:.9,tailH:.7,
  wheelSizeFront:.45,wheelSizeRear:.45,wheelTread:-.12,wheelColor:'#e7e7e7',tireWidth:.34,rimDepth:100,wheelDesign:'Spoke_5',
  headlights:'Round_2',tailLights:'Dual',mufflerType:'Single',doorMirrors:true,bumperF:true,bumperR:true,
  bumperColor:'#111111',frontGrill:true,frontGrillStyle:'surface',grillColor:'#111111',rearGarnish:true,garnishColor:'#111111',
  bodyRoundness:0,roofRoundness:0,bumperRoundness:0,doorCount:'2door',doorHandleFrontX:0,doorHandleFrontY:0,
  doorHandleRearX:0,doorHandleRearY:0,doorHandleWidth:.38,doorHandleHeight:.07,doorHandleDepth:.08,
  tailLightOffsetX:0,tailLightOffsetY:0,customHeadlightShape:null,customTailLightGrid:null,
  plateRegion:'多摩',plateClass:'500',plateKana:'あ',plateNumber:'1234',noFrontPlate:false
};

const C=(o)=>Object.freeze({...BASE,...o});
const G=(bits)=>[...bits].map(bit=>bit==='1');
export const TOUGE_CAR_DESIGNS=Object.freeze([
 C({color:'#ff5252',lift:.2277,wheelSizeFront:.41,wheelSizeRear:.41,wheelTread:-.129,tireWidth:.3596,rimDepth:131,
   headlights:'Custom',tailLights:'Single_Bar',mufflerType:'Dual',bumperColor:'#ff5252',frontGrillStyle:'slats',
   bodyRoundness:23,bumperRoundness:55,doorHandleFrontX:-.16,doorHandleFrontY:-.14,doorHandleRearY:-.15,
   doorHandleWidth:.27,doorHandleDepth:.06,tailLightOffsetY:.01,customTailLightGrid:G('0000000000000000001111111111111111111111011111110000000000000000'),
   customHeadlightShape:[{x:-.23199999999999996,y:.14267172232754852},{x:.21642857142857141,y:.07971875},{x:.26071428571428573,y:-.18428125},{x:-.238,y:-.16906810558553304}]}),
 C({color:'#00cc00',roofWidth:1.5,totalLength:4.739,lift:.2739,noseSlant:.284,roofH:1.408,roofL:1.211,rSlant:1.2255,
   trunkH:.7684,wheelSizeFront:.43,wheelSizeRear:.43,wheelTread:-.131,tireWidth:.3208,rimDepth:138,headlights:'Custom',
   tailLights:'Round',mufflerType:'Dual',bumperF:false,bumperColor:'#00cc00',frontGrillStyle:'slats',garnishColor:'#1be600',
   bodyRoundness:22,bumperRoundness:25,doorHandleFrontX:-.32,doorHandleFrontY:-.19,doorHandleRearX:-.48,
   doorHandleWidth:.24,doorHandleDepth:.06,plateKana:'ね',plateNumber:'9687',customTailLightGrid:G('0000000000000000011111100111111001111110011111100000000000000000'),customHeadlightShape:[{x:-.21475563557942706,y:.1554918643424752},{x:.27840016682942703,y:.052451634807728395},{x:.30702215576171876,y:-.11685557676921286},{x:-.23302213541666666,y:-.11256258828013001}]}),
 C({color:'#cccc00',totalLength:5.5195,lift:.3564,noseSlant:.108,hoodL:1.1475,roofL:.994,rSlant:.1,trunkH:.7684,
   wheelSizeFront:.5,wheelSizeRear:.5,wheelTread:-.034,tireWidth:.374,wheelDesign:'Dish',headlights:'Round_2',tailLights:'Dual',
   bumperRoundness:11,grillColor:'#595959',rearGarnish:false,bodyRoundness:7,doorHandleFrontX:-.28,doorHandleFrontY:-.27,
   doorHandleWidth:.25,doorHandleDepth:.06,plateRegion:'世田谷',plateClass:'400',plateKana:'て',plateNumber:'1154',customTailLightGrid:G('0000000000000000011111100111111001111110011111100000000000000000')}),
 C({color:'#ffffff',roofWidth:1.725,totalLength:5.2255,lift:.2519,noseSlant:.083,hoodL:1.545,roofL:1.61,rSlant:.703,
   trunkH:.7973,wheelSizeFront:.45,wheelSizeRear:.45,wheelTread:-.153,wheelColor:'#c2c2c2',tireWidth:.3716,rimDepth:138,
   wheelDesign:'Twist_7',headlights:'Custom',tailLights:'Custom',bumperColor:'#a4a2a2',grillColor:'#545454',
   garnishColor:'#b5b5b5',bodyRoundness:3,bumperRoundness:26,doorHandleFrontX:-.2,doorHandleFrontY:-.23,
   doorHandleWidth:.25,doorHandleDepth:.065,tailLightOffsetY:.03,plateClass:'550',plateKana:'き',plateNumber:'5196',customTailLightGrid:G('0000000000000000000000001101111111011111110111110000000000000000'),
   customHeadlightShape:[{x:-.22933333333333333,y:.18747265568032667},{x:.2106666666666667,y:.17627242234213214},{x:.24,y:-.18},{x:-.24,y:-.18}]}),
 C({color:'#eeeeee',lift:.2739,noseSlant:.108,hoodL:.5,roofL:3.549,rSlant:.1938,wheelSizeFront:.45,wheelSizeRear:.45,
   wheelTread:-.126,tireWidth:.3268,headlights:'Custom',tailLights:'Custom',bumperR:false,grillColor:'#919191',
   garnishColor:'#ffffff',doorHandleFrontX:.8,doorHandleFrontY:-.17,doorHandleRearX:.8,doorHandleRearY:-.16,
   doorHandleWidth:.23,doorHandleDepth:.06,tailLightOffsetX:.01,tailLightOffsetY:.15,plateRegion:'品川',plateClass:'330',plateKana:'な',plateNumber:'8732',customTailLightGrid:G('0000000100000111000001110000011100000111000001110000011100000111'),
   customHeadlightShape:[{x:-.24333333333333332,y:.1557386612221088},{x:.21133333333333335,y:.10533761120023334},{x:.21266666666666667,y:-.06639929998541635},{x:-.238,y:-.06639929998541635}]}),
 C({color:'#f7d52b',width:2.2198,roofWidth:1.65,totalLength:5.061,lift:.1881,noseH:.5786,roofH:1.282,roofL:1.3475,
   rSlant:.608,trunkH:.8347,wheelSizeFront:.38,wheelSizeRear:.38,wheelTread:-.16,tireWidth:.42,rimDepth:145,
   headlights:'Custom',tailLights:'Vertical_Slim',mufflerType:'Dual',bumperColor:'#f7d52b',frontGrillStyle:'slats',
   grillColor:'#000000',bodyRoundness:26,bumperRoundness:50,doorCount:'4door',doorHandleFrontX:.35,doorHandleFrontY:-.11,
   doorHandleRearX:-.36,doorHandleRearY:-.11,doorHandleWidth:.23,doorHandleDepth:.065,customTailLightGrid:G('0000000000000000111011111110111111101111111011110000000000000000'),
   customHeadlightShape:[{x:-.24,y:.18},{x:.22266666666666668,y:.09973749453113606},{x:.24400000000000002,y:-.06453259442905056},{x:-.236,y:-.06453259442905056}]})
]);

export function loadTougeDesign(index){
  let saved={};try{saved=JSON.parse(localStorage.getItem(BODY_STORAGE_KEY)||'{}')||{}}catch{}
  return {...TOUGE_CAR_DESIGNS[index%TOUGE_CAR_DESIGNS.length],...(saved[index]||{})};
}
export function saveTougeDesign(index,design){
  let saved={};try{saved=JSON.parse(localStorage.getItem(BODY_STORAGE_KEY)||'{}')||{}}catch{}
  saved[index]={...design};localStorage.setItem(BODY_STORAGE_KEY,JSON.stringify(saved));
}
export function resetTougeDesign(index){
  let saved={};try{saved=JSON.parse(localStorage.getItem(BODY_STORAGE_KEY)||'{}')||{}}catch{}
  delete saved[index];localStorage.setItem(BODY_STORAGE_KEY,JSON.stringify(saved));
  return {...TOUGE_CAR_DESIGNS[index]};
}

function roundedProfile(points,radius){
  const s=new THREE.Shape();s.moveTo(points[0].x,points[0].y);
  for(let i=1;i<points.length-1;i++){
    const a=points[i-1],b=points[i],c=points[i+1],v1=b.clone().sub(a),v2=c.clone().sub(b);
    const r=Math.min(radius,v1.length()*.42,v2.length()*.42);
    if(r<.004){s.lineTo(b.x,b.y);continue}
    v1.normalize();v2.normalize();const p=b.clone().sub(v1.multiplyScalar(r)),q=b.clone().add(v2.multiplyScalar(r));
    s.lineTo(p.x,p.y);s.quadraticCurveTo(b.x,b.y,q.x,q.y);
  }
  const p=points.at(-1);s.lineTo(p.x,p.y);return s;
}
function wheelArches(s,p,halfL,rearEdge,frontEdge){
  const arches=[{x:-halfL+.9,r:p.wheelSizeRear},{x:halfL-.9,r:p.wheelSizeFront}];let cursor=rearEdge;
  for(const a of arches){a.r=THREE.MathUtils.clamp(a.r*1.18,.36,Math.max(.38,halfL*.34));a.cy=THREE.MathUtils.clamp(a.r*.34+(BASE.lift-p.lift)*.72,a.r*.12,a.r*.62);
    const w=Math.sqrt(Math.max(.01,a.r*a.r-a.cy*a.cy)),left=Math.max(cursor,a.x-w),right=Math.min(frontEdge,a.x+w);s.lineTo(left,0);
    const aa=Math.asin(-a.cy/a.r),start=Math.PI-aa;for(let i=1;i<=16;i++){const t=start+(aa-start)*i/16;s.lineTo(a.x+Math.cos(t)*a.r,a.cy+Math.sin(t)*a.r)}cursor=right;
  }s.lineTo(frontEdge,0);
}
const material=(color,roughness=.45,metalness=.25)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
function box(g,size,mat,pos){const m=new THREE.Mesh(new THREE.BoxGeometry(...size),mat);m.position.set(...pos);m.castShadow=true;g.add(m);return m}
function addHood(g,p,halfL,halfW,mat){
  const a=new THREE.Vector2(halfL-p.noseSlant,p.noseH),b=new THREE.Vector2(halfL-p.hoodL,p.hoodH),dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;
  const ox=-dy/l*.035,oy=-dx/l*.035,z=halfW-.075,v=new Float32Array([a.x+ox,p.lift+a.y+oy,-z,a.x+ox,p.lift+a.y+oy,z,b.x+ox,p.lift+b.y+oy,z,a.x+ox,p.lift+a.y+oy,-z,b.x+ox,p.lift+b.y+oy,z,b.x+ox,p.lift+b.y+oy,-z]);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(v,3));geo.computeVertexNormals();const m=new THREE.Mesh(geo,mat.clone());m.material.roughness=.7;g.add(m);
}
function glassPanel(g,vertices,mat){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();g.add(new THREE.Mesh(geo,mat))}
function addLights(g,p,halfL,halfW,front,tail){
  const face=Math.atan2(p.noseSlant,p.noseH),relY=p.noseH-.22,x=halfL-(relY/p.noseH)*p.noseSlant+.04,y=p.lift+relY;
  for(const side of [-1,1]){
    if(p.headlights==='Custom'&&p.customHeadlightShape?.length>=3){const s=new THREE.Shape();p.customHeadlightShape.forEach((v,i)=>i?s.lineTo(v.x,v.y):s.moveTo(v.x,v.y));s.closePath();const m=new THREE.Mesh(new THREE.ShapeGeometry(s),front);m.rotation.y=Math.PI/2;m.rotation.z=face;m.position.set(x,y,side*(halfW-.25));m.scale.x=side;g.add(m)}
    else {const m=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.035,24),front);m.rotation.z=Math.PI/2;m.position.set(x,y,side*(halfW-.25));g.add(m)}
  }
  const rearX=-halfL-.04,baseZ=halfW-.25+p.tailLightOffsetX,kind=p.tailLights;
  for(const side of [-1,1]){const holder=new THREE.Group();holder.position.set(rearX,p.lift+p.tailH-.24+p.tailLightOffsetY,side*baseZ);g.add(holder);
    const lamp=(w,h,z=0)=>{const m=box(holder,[.035,h,w],tail,[0,0,z]);m.castShadow=false};
    if(kind==='Round'){const m=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.035,24),tail);m.rotation.z=Math.PI/2;holder.add(m)}
    else if(kind==='Dual'){for(const z of [-.12,.12]){const m=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.035,24),tail);m.rotation.z=Math.PI/2;m.position.z=z;holder.add(m)}}
    else if(kind==='Vertical_Slim')lamp(.1,.5);else if(kind==='Custom'){
      const grid=Array.isArray(p.customTailLightGrid)&&p.customTailLightGrid.length===64?p.customTailLightGrid:Array.from({length:64},(_,i)=>{const row=Math.floor(i/8),col=i%8;return row>=2&&row<=5&&col>=1&&col<=6});
      const cell=.055;for(let row=0;row<8;row++)for(let col=0;col<8;col++)if(grid[row*8+col]){const m=box(holder,[.036,cell*.9,cell*.9],tail,[0,(3.5-row)*cell,(col-3.5)*cell]);m.castShadow=false}
    }else lamp(.5,.2);
  }
}
function addWheel(root,p,x,z,radius,side,wheelGroups){
  const roll=new THREE.Group();roll.position.set(x,radius,z);root.add(roll);wheelGroups.push(roll);
  const tire=new THREE.Mesh(new THREE.TorusGeometry(radius-radius*.16,radius*.16,14,48),material(0x090a0b,.78,.05));tire.scale.z=p.tireWidth/(radius*.32);tire.castShadow=true;roll.add(tire);
  const rim=material(p.wheelColor,.16,.9),faceZ=side*p.tireWidth*.45;
  const lip=new THREE.Mesh(new THREE.TorusGeometry(radius*.72,radius*.055,10,32),rim);lip.position.z=faceZ;roll.add(lip);
  if(p.wheelDesign==='Dish'){const d=new THREE.Mesh(new THREE.CylinderGeometry(radius*.55,radius*.55,.035,32),rim);d.rotation.x=Math.PI/2;d.position.z=faceZ;roll.add(d)}else{
    const n=p.wheelDesign==='Twist_7'?7:5;for(let i=0;i<n;i++){const s=box(roll,[radius*1.3,.045,.035],rim,[0,0,faceZ]);s.rotation.z=i*Math.PI/n+(n===7?.18:0)}
    const h=new THREE.Mesh(new THREE.CylinderGeometry(radius*.16,radius*.16,.05,20),rim);h.rotation.x=Math.PI/2;h.position.z=faceZ;roll.add(h);
  }
}

function buildApproxTougeCar(index,design=loadTougeDesign(index)){
  const p={...BASE,...design},root=new THREE.Group(),raw=new THREE.Group(),S=.34;raw.scale.setScalar(S);root.add(raw);
  const bodyMat=material(p.color,.52,.24),glass=new THREE.MeshStandardMaterial({color:0x071019,roughness:.12,metalness:.75,transparent:true,opacity:.92,side:THREE.DoubleSide}),
    dark=material(p.grillColor,.5,.25),bumper=material(p.bumperColor,.38,.4),head=new THREE.MeshBasicMaterial({color:0xfff2c6}),tail=new THREE.MeshStandardMaterial({color:0x9d1010,emissive:0x370000,emissiveIntensity:.55}),garnish=material(p.garnishColor,.25,.55);
  const halfL=p.totalLength/2,halfW=p.width/2,round=p.bodyRoundness/100,rx=THREE.MathUtils.lerp(0,Math.min(.52,halfL*.16),round),ry=THREE.MathUtils.lerp(0,Math.min(.38,p.noseH*.5,p.tailH*.62),round);
  const profile=roundedProfile([new THREE.Vector2(halfL-rx,0),new THREE.Vector2(halfL,ry),new THREE.Vector2(halfL-p.noseSlant,p.noseH),new THREE.Vector2(halfL-p.hoodL,p.hoodH),new THREE.Vector2(halfL-p.hoodL-p.fSlant-p.roofL-p.rSlant,p.trunkH),new THREE.Vector2(-halfL,p.tailH),new THREE.Vector2(-halfL,ry),new THREE.Vector2(-halfL+rx,0)],THREE.MathUtils.lerp(0,.42,round));
  wheelArches(profile,p,halfL,-halfL+rx,halfL-rx);profile.closePath();
  const shell=new THREE.Mesh(new THREE.ExtrudeGeometry(profile,{depth:p.width,bevelEnabled:true,bevelThickness:THREE.MathUtils.lerp(.035,.075,round),bevelSize:THREE.MathUtils.lerp(.035,.075,round),bevelSegments:round>.02?5:1}),bodyMat);shell.position.set(0,p.lift,-halfW);shell.castShadow=true;raw.add(shell);addHood(raw,p,halfL,halfW,bodyMat);
  box(raw,[p.roofL,.05,p.roofWidth],bodyMat,[halfL-p.hoodL-p.fSlant-p.roofL/2,p.lift+p.roofH,0]);
  const fs=halfL-p.hoodL,fe=fs-p.fSlant,rs=fe-p.roofL,re=rs-p.rSlant;
  glassPanel(raw,[fs,p.lift+p.hoodH,-halfW*.98,fs,p.lift+p.hoodH,halfW*.98,fe,p.lift+p.roofH,p.roofWidth*.49,fs,p.lift+p.hoodH,-halfW*.98,fe,p.lift+p.roofH,p.roofWidth*.49,fe,p.lift+p.roofH,-p.roofWidth*.49],glass);
  glassPanel(raw,[rs,p.lift+p.roofH,-p.roofWidth*.49,rs,p.lift+p.roofH,p.roofWidth*.49,re,p.lift+p.trunkH,halfW*.98,rs,p.lift+p.roofH,-p.roofWidth*.49,re,p.lift+p.trunkH,halfW*.98,re,p.lift+p.trunkH,-halfW*.98],glass);
  for(const side of [-1,1])glassPanel(raw,[fs,p.lift+p.hoodH,side*halfW,fe,p.lift+p.roofH,side*p.roofWidth*.5,rs,p.lift+p.roofH,side*p.roofWidth*.5,fs,p.lift+p.hoodH,side*halfW,rs,p.lift+p.roofH,side*p.roofWidth*.5,re,p.lift+p.trunkH,side*halfW],glass);
  if(p.frontGrill){const gx=halfL-(p.noseH-.28)/p.noseH*p.noseSlant+.045;box(raw,[.05,.23,p.width*.45],dark,[gx,p.lift+p.noseH-.28,0]);if(p.frontGrillStyle==='slats')for(const dy of [-.08,-.025,.03,.085])box(raw,[.065,.014,p.width*.46],dark,[gx+.02,p.lift+p.noseH-.28+dy,0])}
  if(p.bumperF)box(raw,[.16,.15,p.width+.2],bumper,[halfL-(.15/p.noseH)*p.noseSlant+.08,p.lift+.15,0]);if(p.bumperR)box(raw,[.16,.15,p.width+.2],bumper,[-halfL-.08,p.lift+.1,0]);
  if(p.rearGarnish)box(raw,[.035,.2,p.width*.45],garnish,[-halfL-.07,p.lift+p.tailH-.25,0]);addLights(raw,p,halfL,halfW,head,tail);
  if(p.spoilerAngle>0){const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(p.spoilerAngle,0);s.lineTo(0,.15);s.closePath();const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:p.width,bevelEnabled:false}),bodyMat);m.position.set(halfL-.05,p.lift,-halfW);raw.add(m)}
  if(p.doorMirrors)for(const side of [-1,1]){box(raw,[.3,.16,.07],bodyMat,[fs-.14,p.lift+p.hoodH+.12,side*(halfW+.1)]);box(raw,[.05,.11,.04],bodyMat,[fs,p.lift+p.hoodH+.05,side*(halfW+.05)])}
  const baseX=halfL-p.hoodL-p.fSlant-p.roofL*.5,baseY=p.lift+THREE.MathUtils.lerp(p.hoodH,p.roofH,.42)-.18,handles=[[baseX+p.doorHandleFrontX,baseY+p.doorHandleFrontY]];if(p.doorCount==='4door')handles.push([baseX-Math.max(.42,p.roofL*.36)+p.doorHandleRearX,baseY+p.doorHandleRearY]);for(const side of [-1,1])for(const h of handles)box(raw,[p.doorHandleWidth,p.doorHandleHeight,p.doorHandleDepth],dark,[h[0],h[1],side*(halfW+p.doorHandleDepth*.58)]);
  const muffler=material(0xaaaaaa,.22,1),offsets=p.mufflerType==='Dual'?[-halfW+.34,-halfW+.52]:[-halfW+.4];for(const z of offsets){const m=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.38,16),muffler);m.rotation.z=Math.PI/2;m.position.set(-halfL-.15,p.lift-.05,z);raw.add(m)}
  const wheels=[];const wz=halfW+.15+p.wheelTread;for(const [x,rad] of [[halfL-.9,p.wheelSizeFront],[-halfL+.9,p.wheelSizeRear]])for(const side of [-1,1])addWheel(raw,p,x,side*wz,rad,side,wheels);
  root.userData.wheelGroups=wheels;root.userData.bodyHalfLength=halfL*S;root.userData.bodyHalfWidth=halfW*S;root.userData.design=p;return root;
}

// Direct port of Touge SIM's createRoadrageStyleCar pipeline. Keep the source
// hierarchy and coordinate transforms intact; rotate only the completed car.
const tgFinite=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
const tgColor=(value,fallback)=>/^#[0-9a-f]{6}$/i.test(String(value||''))?String(value):fallback;
const tgGrid=grid=>Array.isArray(grid)&&grid.length===64?grid.map(Boolean):Array.from({length:64},(_,i)=>{const y=Math.floor(i/8),x=i%8;return y>=2&&y<=5&&x>=1&&x<=6});
function normalizeExactDesign(design){
 const p={...BASE,...(design||{})};
 p.color=tgColor(p.color,BASE.color);p.wheelColor=tgColor(p.wheelColor,BASE.wheelColor);p.bumperColor=tgColor(p.bumperColor,BASE.bumperColor);p.grillColor=tgColor(p.grillColor,BASE.grillColor);p.garnishColor=tgColor(p.garnishColor,BASE.garnishColor);
 p.frontGrillStyle=p.frontGrillStyle==='slats'?'slats':'surface';
 const clamp=(key,lo,hi,fallback=BASE[key])=>p[key]=THREE.MathUtils.clamp(tgFinite(p[key],fallback),lo,hi);
 clamp('width',1.75,2.55);clamp('roofWidth',1.1,p.width,p.width*.8);clamp('totalLength',4,6.2);clamp('lift',.16,.44);clamp('noseH',.35,.95);clamp('noseSlant',.02,.5,.02);p.spoilerAngle=Math.max(0,tgFinite(p.spoilerAngle,0));
 clamp('hoodL',.45,2.3);clamp('hoodH',.45,1.1);clamp('fSlant',.1,1.4);clamp('roofH',1.05,1.9);clamp('roofL',.65,3.7);clamp('rSlant',.08,1.45);clamp('trunkH',.45,1.2);clamp('tailH',.4,1);
 clamp('wheelSizeFront',.34,.56);clamp('wheelSizeRear',.34,.56);clamp('wheelTread',-.16,.12);clamp('tireWidth',.24,.42);clamp('rimDepth',45,155);clamp('bodyRoundness',0,100);clamp('roofRoundness',0,100);clamp('bumperRoundness',0,100);
 clamp('doorHandleFrontX',-.8,.8,0);clamp('doorHandleFrontY',-.35,.35,0);clamp('doorHandleRearX',-.8,.8,0);clamp('doorHandleRearY',-.35,.35,0);clamp('doorHandleWidth',.18,.7);clamp('doorHandleHeight',.035,.16);clamp('doorHandleDepth',.02,.14);clamp('tailLightOffsetX',-.22,.22,0);clamp('tailLightOffsetY',-.22,.22,0);
 p.doorCount=p.doorCount==='4door'?'4door':'2door';p.noFrontPlate=!!p.noFrontPlate;p.customTailLightGrid=tgGrid(p.customTailLightGrid);
 p.plateRegion=(String(p.plateRegion??'').trim().replace(/\s+/g,'')||BASE.plateRegion).slice(0,4);p.plateClass=(String(p.plateClass??'').replace(/\D/g,'')||BASE.plateClass).slice(0,3);p.plateKana=(String(p.plateKana??'').trim().replace(/\s+/g,'')||BASE.plateKana).slice(0,1);p.plateNumber=(String(p.plateNumber??'').replace(/\D/g,'')||BASE.plateNumber).slice(0,4).padStart(4,'0');return p;
}
const tgBox=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
function tgCylinder(radius,depth,segments,axis=''){const g=new THREE.CylinderGeometry(radius,radius,depth,segments);if(axis==='x')g.rotateX(Math.PI/2);else if(axis==='y')g.rotateY(Math.PI/2);else if(axis==='z')g.rotateZ(Math.PI/2);return g}
function tgCircle(radius,segments,axis=''){const g=new THREE.CircleGeometry(radius,segments);if(axis==='x')g.rotateX(Math.PI/2);else if(axis==='y')g.rotateY(Math.PI/2);else if(axis==='z')g.rotateZ(Math.PI/2);return g}
function tgTorus(radius,tube,radial,tubular,axis=''){const g=new THREE.TorusGeometry(radius,tube,radial,tubular);if(axis==='x')g.rotateX(Math.PI/2);else if(axis==='y')g.rotateY(Math.PI/2);else if(axis==='z')g.rotateZ(Math.PI/2);return g}
function tgHeadGeometry(points){const s=new THREE.Shape();points.forEach((p,i)=>i?s.lineTo(p.x,p.y):s.moveTo(p.x,p.y));s.closePath();return new THREE.ShapeGeometry(s).rotateY(Math.PI/2)}
function tgAddHeadlights(group,p,mat,mirror=false){
 const rect=(w,h)=>new THREE.Mesh(tgBox(.035,h,w),mat),round=r=>new THREE.Mesh(tgCylinder(r,.035,24,'z'),mat);
 if(p.headlights==='Square_2')group.add(rect(.35,.22));else if(p.headlights==='Square_4'){for(const z of [-.12,.12]){const m=rect(.2,.14);m.position.z=z;group.add(m)}}else if(p.headlights==='Round_Dual'){for(const z of [-.12,.12]){const m=round(.1);m.position.z=z;group.add(m)}}else if(p.headlights==='Custom'&&p.customHeadlightShape?.length>=3){const m=new THREE.Mesh(tgHeadGeometry(p.customHeadlightShape),mat);m.position.x=.018;group.add(m)}else group.add(round(.17));if(mirror)group.scale.z=-1;
}
function tgAddTailCells(group,p,mat,lights){const grid=tgGrid(p.customTailLightGrid),cell=.062,origin=-(cell*7)*.5;for(let y=0;y<8;y++){let x=0;while(x<8){if(!grid[y*8+x]){x++;continue}const start=x;while(x<8&&grid[y*8+x])x++;const n=x-start,m=new THREE.Mesh(tgBox(cell*n,cell,.032),mat);m.position.set(origin+(start+(n-1)*.5)*cell,origin+(7-y)*cell,0);group.add(m);lights.push(m)}}}
function tgAddTails(group,p,mat,lights){const rect=(w,h)=>new THREE.Mesh(tgBox(w,h,.032),mat),round=r=>new THREE.Mesh(tgCylinder(r,.032,24,'x'),mat),add=m=>{group.add(m);lights.push(m)};if(p.tailLights==='Round')add(round(.15));else if(p.tailLights==='Dual')for(const x of [-.12,.12]){const m=round(.1);m.position.x=x;add(m)}else if(p.tailLights==='Dual_Square')for(const x of [-.12,.12]){const m=rect(.15,.15);m.position.x=x;add(m)}else if(p.tailLights==='Vertical_Slim'||p.tailLights==='VerticalSlim'){const m=rect(.1,.5);m.rotation.z=Math.PI/2;add(m)}else if(p.tailLights==='Custom')tgAddTailCells(group,p,mat,lights);else add(rect(.5,.2))}
function tgAddDoorHandles(visual,p,halfL,halfW,mat){const baseX=halfL-p.hoodL-p.fSlant-p.roofL*.5,baseY=p.lift+THREE.MathUtils.lerp(p.hoodH,p.roofH,.42)-.18,handles=[{x:baseX+p.doorHandleFrontX,y:baseY+p.doorHandleFrontY}];if(p.doorCount==='4door')handles.push({x:baseX-Math.max(.42,p.roofL*.36)+p.doorHandleRearX,y:baseY+p.doorHandleRearY});const w=THREE.MathUtils.clamp(p.doorHandleWidth,.18,.7),h=THREE.MathUtils.clamp(p.doorHandleHeight,.035,.16),d=THREE.MathUtils.clamp(p.doorHandleDepth,.02,.14);for(const side of [-1,1])for(const a of handles){const m=new THREE.Mesh(tgBox(w,h,d),mat);m.position.set(a.x,a.y,side*(halfW+d*.58));m.rotation.y=side>0?0:Math.PI;m.renderOrder=18;visual.add(m)}}
function tgAddHood(group,p,halfL,halfW,mat){const front=new THREE.Vector2(halfL-p.noseSlant,p.noseH),rear=new THREE.Vector2(halfL-p.hoodL,p.hoodH),dx=rear.x-front.x,dy=rear.y-front.y,len=Math.hypot(dx,dy)||1,lx=-dy/len*.035,ly=-dx/len*.035,zL=-halfW+.075,zR=halfW-.075;const v=new Float32Array([front.x+lx,p.lift+front.y+ly,zL,front.x+lx,p.lift+front.y+ly,zR,rear.x+lx,p.lift+rear.y+ly,zR,front.x+lx,p.lift+front.y+ly,zL,rear.x+lx,p.lift+rear.y+ly,zR,rear.x+lx,p.lift+rear.y+ly,zL]);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(v,3));g.computeVertexNormals();const pm=mat.clone();pm.roughness=Math.max(pm.roughness??.4,.68);pm.metalness=Math.min(pm.metalness??.35,.08);group.add(new THREE.Mesh(g,pm))}
function tgWheelArches(shape,halfL,frontRadius,rearRadius,lift,rearEdge=-halfL,frontEdge=halfL){const liftComp=THREE.MathUtils.clamp((BASE.lift-lift)*.72,-.12,.12),arches=[{x:-halfL+.9,r:THREE.MathUtils.clamp(rearRadius*1.18,.36,Math.max(.38,halfL*.34)),base:rearRadius},{x:halfL-.9,r:THREE.MathUtils.clamp(frontRadius*1.18,.36,Math.max(.38,halfL*.34)),base:frontRadius}];let cursor=rearEdge;for(const a of arches){a.cy=THREE.MathUtils.clamp(a.base*.34+liftComp,a.base*.12,a.base*.62);const bh=Math.sqrt(Math.max(.01,a.r*a.r-a.cy*a.cy)),left=Math.max(cursor,a.x-bh),right=Math.min(frontEdge,a.x+bh);if(right<=cursor+.02)continue;shape.lineTo(left,0);const ra=Math.asin(-a.cy/a.r),la=Math.PI-ra;for(let i=1;i<=16;i++){const t=la+(ra-la)*i/16;shape.lineTo(a.x+Math.cos(t)*a.r,a.cy+Math.sin(t)*a.r)}cursor=right}shape.lineTo(frontEdge,0)}
function tgRoundedProfile(points,radius){const s=new THREE.Shape();s.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length-1;i++){const prev=points[i-1],cur=points[i],next=points[i+1],a=cur.clone().sub(prev),b=next.clone().sub(cur),r=Math.min(radius,a.length()*.42,b.length()*.42);if(r<=.004){s.lineTo(cur.x,cur.y);continue}a.normalize();b.normalize();const before=cur.clone().sub(a.multiplyScalar(r)),after=cur.clone().add(b.multiplyScalar(r));s.lineTo(before.x,before.y);s.quadraticCurveTo(cur.x,cur.y,after.x,after.y)}const last=points.at(-1);s.lineTo(last.x,last.y);return s}
function tgRoundedRect(w,h,radius){const hw=w*.5,hh=h*.5,r=Math.max(0,Math.min(radius,hw*.92,hh*.92)),s=new THREE.Shape();s.moveTo(-hw+r,-hh);s.lineTo(hw-r,-hh);s.quadraticCurveTo(hw,-hh,hw,-hh+r);s.lineTo(hw,hh-r);s.quadraticCurveTo(hw,hh,hw-r,hh);s.lineTo(-hw+r,hh);s.quadraticCurveTo(-hw,hh,-hw,hh-r);s.lineTo(-hw,-hh+r);s.quadraticCurveTo(-hw,-hh,-hw+r,-hh);return s}
function tgRoundedBox(w,h,d,r){const g=new THREE.ExtrudeGeometry(tgRoundedRect(w,d,r),{depth:h,bevelEnabled:true,bevelThickness:Math.min(.025,h*.28),bevelSize:Math.min(.025,Math.max(.002,r*.16)),bevelSegments:r>.03?3:1});g.rotateX(Math.PI/2);g.translate(0,h*.5,0);return g}
function tgAddWheelDesign(roll,p,wheel,mat,shadow,inner){const side=Math.sign(wheel.x||1),outside=(p.tireWidth/2-Math.min(.04,wheel.radius*.085))*side,maxDepth=Math.min(.16,p.tireWidth*.42),minDepth=Math.min(.055,maxDepth*.46),depth=THREE.MathUtils.lerp(minDepth,maxDepth,THREE.MathUtils.clamp((tgFinite(p.rimDepth,BASE.rimDepth)-45)/110,0,1)),face=outside-side*depth;const lip=new THREE.Mesh(tgTorus(wheel.radius*.72,wheel.radius*.055,10,36,'y'),mat);lip.position.x=outside;roll.add(lip);const innerFace=new THREE.Mesh(tgCircle(wheel.radius*.46,40,'y'),inner||mat);innerFace.position.x=face-side*.026;roll.add(innerFace);if(p.wheelDesign==='Dish'){const dish=new THREE.Mesh(tgCylinder(wheel.radius*.55,.026,32,'z'),mat);dish.position.x=face+side*.012;roll.add(dish);return}const n=p.wheelDesign==='Twist_7'?7:5;for(let i=0;i<n;i++){const spoke=new THREE.Mesh(tgBox(.045,wheel.radius*1.46,.075),mat);spoke.position.x=face+side*.028;spoke.rotation.x=i/n*Math.PI+(n===7?.18:0);roll.add(spoke)}const hub=new THREE.Mesh(tgCylinder(wheel.radius*.16,.04,24,'z'),mat);hub.position.x=face+side*.034;roll.add(hub)}
function tgPlateTexture(p){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d'),roundRect=(a,b,w,h,r)=>{r=Math.min(r,w*.5,h*.5);x.beginPath();x.moveTo(a+r,b);x.lineTo(a+w-r,b);x.quadraticCurveTo(a+w,b,a+w,b+r);x.lineTo(a+w,b+h-r);x.quadraticCurveTo(a+w,b+h,a+w-r,b+h);x.lineTo(a+r,b+h);x.quadraticCurveTo(a,b+h,a,b+h-r);x.lineTo(a,b+r);x.quadraticCurveTo(a,b,a+r,b);x.closePath()};x.fillStyle='#f8f8f2';roundRect(10,10,492,236,22);x.fill();x.strokeStyle='#222';x.lineWidth=6;x.stroke();roundRect(20,20,472,216,16);x.lineWidth=2;x.stroke();for(const px of [86,426]){x.beginPath();x.arc(px,56,10,0,Math.PI*2);x.fill();x.stroke()}x.fillStyle='#08723a';x.textAlign='center';x.textBaseline='middle';x.font="700 58px 'Yu Gothic',sans-serif";x.fillText(`${p.plateRegion} ${p.plateClass}`,278,56);x.font="700 44px 'Yu Gothic',sans-serif";x.fillText(p.plateKana,64,158);x.font="800 118px 'Arial Narrow',sans-serif";x.fillText(`${p.plateNumber.slice(0,2)}-${p.plateNumber.slice(2)}`,294,156);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=t.magFilter=THREE.LinearFilter;return t}
function tgAddPlates(visual,p,halfL,faceAngle,frontOffset,rearOffset){const texture=tgPlateTexture(p),w=THREE.MathUtils.clamp(p.width*.28,.54,.74),h=w*.48;for(const front of [true,false]){if(front&&p.noFrontPlate)continue;const backing=(front?p.bumperF:p.bumperR)?p.bumperColor:p.color,side=new THREE.MeshStandardMaterial({color:backing,roughness:.55,metalness:.02}),face=new THREE.MeshStandardMaterial({map:texture,roughness:.48,metalness:.02,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),plate=new THREE.Mesh(new THREE.BoxGeometry(.026,h,w),[face,face,side,side,side,side]);if(front){const rel=p.bumperF ? .15 : THREE.MathUtils.clamp(p.noseH*.22,.13,.23),x=p.bumperF?halfL-(.15/p.noseH)*p.noseSlant+.184:halfL-(rel/p.noseH)*p.noseSlant+frontOffset+.018,z=p.bumperF?0:-p.width*.5+w*.5+.035;plate.position.set(x,p.lift+rel,z);plate.rotation.z=p.bumperF?0:faceAngle}else plate.position.set(p.bumperR?-halfL-.184:-halfL-rearOffset-.004,p.lift+.175-h*.5,0);plate.renderOrder=24;visual.add(plate)}}
function createExactTougeSource(design){
 const p=normalizeExactDesign(design),group=new THREE.Group(),bodyMat=new THREE.MeshStandardMaterial({color:p.color,roughness:.52,metalness:.24}),glassMat=new THREE.MeshStandardMaterial({color:0x050505,roughness:.1,metalness:1,transparent:true,opacity:.9,side:THREE.DoubleSide}),darkMat=new THREE.MeshStandardMaterial({color:p.grillColor,roughness:.45,metalness:.28}),bumperMat=new THREE.MeshStandardMaterial({color:p.bumperColor,roughness:.38,metalness:.4}),wheelMat=new THREE.MeshStandardMaterial({color:p.wheelColor,roughness:.12,metalness:.92}),wheelInnerMat=new THREE.MeshStandardMaterial({color:new THREE.Color(p.wheelColor).lerp(new THREE.Color(0x202326),.28),roughness:.2,metalness:.86,side:THREE.DoubleSide}),tireMat=new THREE.MeshStandardMaterial({color:0x0b0b0b,roughness:.7,side:THREE.DoubleSide}),lightMat=new THREE.MeshBasicMaterial({color:0xfff5cf}),brakeMat=new THREE.MeshStandardMaterial({color:0x5a1010,emissive:0x160000,emissiveIntensity:.03,roughness:.18}),garnishMat=new THREE.MeshStandardMaterial({color:p.garnishColor,roughness:.2,metalness:.55});brakeMat.toneMapped=false;
 const visual=new THREE.Group();visual.rotation.y=-Math.PI/2;group.add(visual);const halfL=p.totalLength/2,halfW=p.width/2,bodyRound=p.bodyRoundness/100,bumperRound=p.bumperRoundness/100,rx=THREE.MathUtils.lerp(0,Math.min(.52,halfL*.16),bodyRound),ry=THREE.MathUtils.lerp(0,Math.min(.38,p.noseH*.5,p.tailH*.62),bodyRound);
 const profile=tgRoundedProfile([new THREE.Vector2(halfL-rx,0),new THREE.Vector2(halfL,ry),new THREE.Vector2(halfL-p.noseSlant,p.noseH),new THREE.Vector2(halfL-p.hoodL,p.hoodH),new THREE.Vector2(halfL-p.hoodL-p.fSlant-p.roofL-p.rSlant,p.trunkH),new THREE.Vector2(-halfL,p.tailH),new THREE.Vector2(-halfL,ry),new THREE.Vector2(-halfL+rx,0)],THREE.MathUtils.lerp(0,.42,bodyRound));tgWheelArches(profile,halfL,p.wheelSizeFront,p.wheelSizeRear,p.lift,-halfL+rx,halfL-rx);profile.closePath();const bevel=THREE.MathUtils.lerp(.035,.075,bodyRound),body=new THREE.Mesh(new THREE.ExtrudeGeometry(profile,{depth:p.width,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:bodyRound>.02?5:1}),bodyMat);body.position.set(0,p.lift,-halfW);body.castShadow=body.receiveShadow=true;visual.add(body);tgAddHood(visual,p,halfL,halfW,bodyMat);
 const roof=new THREE.Mesh(tgBox(p.roofL,.05,p.roofWidth),bodyMat);roof.position.set(halfL-p.hoodL-p.fSlant-p.roofL/2,p.lift+p.roofH,0);roof.castShadow=true;visual.add(roof);
 const addGlass=(s,e,sw,ew)=>{const g=new THREE.BufferGeometry(),wS=sw*.49,wE=ew*.49;g.setAttribute('position',new THREE.BufferAttribute(new Float32Array([s[0],s[1],-wS,s[0],s[1],wS,e[0],e[1],wE,s[0],s[1],-wS,e[0],e[1],wE,e[0],e[1],-wE]),3));g.computeVertexNormals();const m=new THREE.Mesh(g,glassMat);m.position.y=p.lift;visual.add(m)};addGlass([halfL-p.hoodL,p.hoodH],[halfL-p.hoodL-p.fSlant,p.roofH],p.width,p.roofWidth);addGlass([halfL-p.hoodL-p.fSlant-p.roofL,p.roofH],[halfL-p.hoodL-p.fSlant-p.roofL-p.rSlant,p.trunkH],p.roofWidth,p.width);
 for(const side of [1,-1]){const g=new THREE.BufferGeometry(),hW=halfW+.005,rW=p.roofWidth/2+.005,pts=[new THREE.Vector3(halfL-p.hoodL,p.hoodH,hW*side),new THREE.Vector3(halfL-p.hoodL-p.fSlant,p.roofH,rW*side),new THREE.Vector3(halfL-p.hoodL-p.fSlant-p.roofL,p.roofH,rW*side),new THREE.Vector3(halfL-p.hoodL-p.fSlant-p.roofL-p.rSlant,p.trunkH,hW*side)];g.setAttribute('position',new THREE.BufferAttribute(new Float32Array([pts[0].x,pts[0].y,pts[0].z,pts[1].x,pts[1].y,pts[1].z,pts[2].x,pts[2].y,pts[2].z,pts[0].x,pts[0].y,pts[0].z,pts[2].x,pts[2].y,pts[2].z,pts[3].x,pts[3].y,pts[3].z]),3));g.computeVertexNormals();const m=new THREE.Mesh(g,glassMat);m.position.y=p.lift;visual.add(m)}
 const frontSurface=THREE.MathUtils.lerp(.022,.112,bodyRound),frontTrim=THREE.MathUtils.lerp(.018,.098,bodyRound),rearSurface=THREE.MathUtils.lerp(.022,.096,bodyRound),rearTrim=THREE.MathUtils.lerp(.018,.084,bodyRound),rearX=-halfL-rearSurface,faceAngle=Math.atan2(p.noseSlant,p.noseH),hlRelY=p.noseH-.22,hlX=halfL-(hlRelY/p.noseH)*p.noseSlant,frontLift=Math.sin(faceAngle)*THREE.MathUtils.lerp(0,.075,bodyRound),tailLights=[];
 if(p.frontGrill){const gg=new THREE.Group(),slats=p.frontGrillStyle==='slats';gg.position.set(hlX+frontTrim+(slats?0:.034),p.lift+hlRelY+frontLift,0);gg.rotation.z=faceAngle;const grill=new THREE.Mesh(tgBox(.04,.25,p.width*.45),darkMat);grill.position.x=slats?-.032:0;gg.add(grill);for(const y of [-.09,-.03,.03,.09]){const s=new THREE.Mesh(tgBox(.05,.018,p.width*.45),darkMat);s.position.set(slats ? .018 : .014,y,0);gg.add(s)}visual.add(gg)}
 if(p.bumperF){const m=new THREE.Mesh(tgRoundedBox(.16,.15,p.width+.2,THREE.MathUtils.lerp(.012,.28,bumperRound)),bumperMat);m.position.set(halfL-(.15/p.noseH)*p.noseSlant+.08,p.lift+.15,0);visual.add(m)}if(p.bumperR){const m=new THREE.Mesh(tgRoundedBox(.16,.15,p.width+.2,THREE.MathUtils.lerp(.012,.28,bumperRound)),bumperMat);m.position.set(-halfL-.08,p.lift+.1,0);visual.add(m)}
 const tailBase=halfW-.25+p.tailLightOffsetX;for(const z of [halfW-.25,-halfW+.25]){const l=new THREE.Group();tgAddHeadlights(l,p,lightMat,z<0);l.position.set(hlX+frontSurface,p.lift+hlRelY+frontLift,z);l.rotation.z=faceAngle;visual.add(l)}for(const z of [tailBase,-tailBase]){const t=new THREE.Group();tgAddTails(t,p,brakeMat,tailLights);if(z<0)t.scale.x=-1;t.rotation.y=-Math.PI/2;t.position.set(rearX,p.lift+p.tailH-.24+p.tailLightOffsetY,z);visual.add(t)}if(p.rearGarnish){const m=new THREE.Mesh(tgBox(.035,.2,p.width*.45),garnishMat);m.position.set(-halfL-rearTrim,p.lift+p.tailH-.25,0);visual.add(m)}tgAddPlates(visual,p,halfL,faceAngle,frontSurface,rearSurface);
 if(p.spoilerAngle>0){const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(p.spoilerAngle,0);s.lineTo(0,.15);s.closePath();const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:p.width,bevelEnabled:false}),bodyMat);m.position.set(halfL-.05,p.lift,-halfW);visual.add(m)}const mufflerMat=new THREE.MeshStandardMaterial({color:0xaaaaaa,metalness:1}),offsets=p.mufflerType==='Double'?[-halfW+.38,halfW-.38]:p.mufflerType==='Dual'?[-halfW+.34,-halfW+.52]:[-halfW+.4],mufflerLength=THREE.MathUtils.lerp(.6,.34,bodyRound),mufflerX=-halfL-THREE.MathUtils.lerp(.1,.018,bodyRound);for(const z of offsets){const m=new THREE.Mesh(tgCylinder(.06,mufflerLength,16,'z'),mufflerMat);m.position.set(mufflerX,p.lift-.05,z);visual.add(m)}
 if(p.doorMirrors){const left=new THREE.Group(),mirror=new THREE.Mesh(tgBox(.3,.2,.05),bodyMat);mirror.position.set(-.15,.15,0);left.add(mirror);const stem=new THREE.Mesh(tgCylinder(.03,.1,16),bodyMat);stem.position.y=.05;stem.rotation.x=Math.PI/2;left.add(stem);left.position.set(halfL-p.hoodL,p.lift+p.hoodH,halfW+.1);left.rotation.y=Math.PI/4;visual.add(left);const right=left.clone();right.position.z=-halfW-.1;right.rotation.y*=-1;visual.add(right)}tgAddDoorHandles(visual,p,halfL,halfW,bodyMat);
 const wheels=[],wheelZ=halfW+.15+p.wheelTread,positions=[{x:-wheelZ,z:halfL-.9,front:true,radius:p.wheelSizeFront,side:-1},{x:wheelZ,z:halfL-.9,front:true,radius:p.wheelSizeFront,side:1},{x:-wheelZ,z:-halfL+.9,front:false,radius:p.wheelSizeRear,side:-1},{x:wheelZ,z:-halfL+.9,front:false,radius:p.wheelSizeRear,side:1}];for(const pos of positions){const pivot=new THREE.Group(),roll=new THREE.Group(),tube=pos.radius*.16,tire=new THREE.Mesh(tgTorus(pos.radius-tube,tube,14,52,'y'),tireMat);tire.scale.x=p.tireWidth/(tube*2);tire.castShadow=true;roll.add(tire);tgAddWheelDesign(roll,p,pos,wheelMat,null,wheelInnerMat);pivot.add(roll);pivot.position.set(pos.x,pos.radius,pos.z);group.add(pivot);wheels.push({pivot,roll,radius:pos.radius,front:pos.front,side:pos.side})}group.userData.wheels=wheels;group.userData.design=p;return group;
}

export function buildTougeCar(index,design=loadTougeDesign(index)){
 const p=normalizeExactDesign(design),root=new THREE.Group(),source=createExactTougeSource(p),scale=.34;
 source.scale.setScalar(scale);source.rotation.y=Math.PI/2;root.add(source);
 root.userData.wheelGroups=source.userData.wheels.map(w=>w.roll);for(const wheel of root.userData.wheelGroups)wheel.userData.spinAxis='x';root.userData.wheelAxis='x';
 root.userData.bodyHalfLength=p.totalLength*.5*scale;root.userData.bodyHalfWidth=p.width*.5*scale;root.userData.design=p;
 return root;
}
