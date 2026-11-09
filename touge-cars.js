import * as THREE from 'three';

export const BODY_STORAGE_KEY = 'mini4wd_touge_bodies_v1';

const BASE = {
  color:'#cc2222',width:2.2,roofWidth:1.8,totalLength:5,lift:.28,noseH:.6,noseSlant:.2,spoilerAngle:.2,
  hoodL:1.6,hoodH:.8,fSlant:.8,roofH:1.5,roofL:1.5,rSlant:1,trunkH:.9,tailH:.7,
  wheelSizeFront:.45,wheelSizeRear:.45,wheelTread:-.1,wheelColor:'#ffffff',tireWidth:.34,rimDepth:100,wheelDesign:'Spoke_5',
  headlights:'Round_2',tailLights:'Dual',mufflerType:'Single',doorMirrors:true,bumperF:true,bumperR:true,
  bumperColor:'#dddddd',frontGrill:true,frontGrillStyle:'surface',grillColor:'#111111',rearGarnish:true,garnishColor:'#111111',
  bodyRoundness:0,roofRoundness:0,bumperRoundness:0,doorCount:'2door',doorHandleFrontX:0,doorHandleFrontY:0,
  doorHandleRearX:0,doorHandleRearY:0,doorHandleWidth:.38,doorHandleHeight:.07,doorHandleDepth:.08,
  tailLightOffsetX:0,tailLightOffsetY:0,customHeadlightShape:null,customTailLightGrid:null
};

const C=(o)=>Object.freeze({...BASE,...o});
export const TOUGE_CAR_DESIGNS=Object.freeze([
 C({color:'#ff5252',lift:.2277,wheelSizeFront:.41,wheelSizeRear:.41,wheelTread:-.129,tireWidth:.3596,rimDepth:131,
   headlights:'Custom',tailLights:'Single_Bar',mufflerType:'Dual',bumperColor:'#ff5252',frontGrillStyle:'slats',
   bodyRoundness:23,bumperRoundness:55,doorHandleFrontX:-.16,doorHandleFrontY:-.14,doorHandleRearY:-.15,
   doorHandleWidth:.27,doorHandleDepth:.06,tailLightOffsetY:.01,
   customHeadlightShape:[{x:-.232,y:.1427},{x:.2164,y:.0797},{x:.2607,y:-.1843},{x:-.238,y:-.1691}]}),
 C({color:'#00cc00',roofWidth:1.5,totalLength:4.739,lift:.2739,noseSlant:.284,roofH:1.408,roofL:1.211,rSlant:1.2255,
   trunkH:.7684,wheelSizeFront:.43,wheelSizeRear:.43,wheelTread:-.131,tireWidth:.3208,rimDepth:138,headlights:'Custom',
   tailLights:'Round',mufflerType:'Dual',bumperF:false,bumperColor:'#00cc00',frontGrillStyle:'slats',garnishColor:'#1be600',
   bodyRoundness:22,bumperRoundness:25,doorHandleFrontX:-.32,doorHandleFrontY:-.19,doorHandleRearX:-.48,
   doorHandleWidth:.24,doorHandleDepth:.06,customHeadlightShape:[{x:-.2148,y:.1555},{x:.2784,y:.0525},{x:.307,y:-.1169},{x:-.233,y:-.1126}]}),
 C({color:'#cccc00',totalLength:5.5195,lift:.3564,noseSlant:.108,hoodL:1.1475,roofL:.994,rSlant:.1,trunkH:.7684,
   wheelSizeFront:.5,wheelSizeRear:.5,wheelTread:-.034,tireWidth:.374,wheelDesign:'Dish',headlights:'Round_2',tailLights:'Dual',
   bumperRoundness:11,grillColor:'#595959',rearGarnish:false,bodyRoundness:7,doorHandleFrontX:-.28,doorHandleFrontY:-.27,
   doorHandleWidth:.25,doorHandleDepth:.06}),
 C({color:'#ffffff',roofWidth:1.725,totalLength:5.2255,lift:.2519,noseSlant:.083,hoodL:1.545,roofL:1.61,rSlant:.703,
   trunkH:.7973,wheelSizeFront:.45,wheelSizeRear:.45,wheelTread:-.153,wheelColor:'#c2c2c2',tireWidth:.3716,rimDepth:138,
   wheelDesign:'Twist_7',headlights:'Custom',tailLights:'Custom',bumperColor:'#a4a2a2',grillColor:'#545454',
   garnishColor:'#b5b5b5',bodyRoundness:3,bumperRoundness:26,doorHandleFrontX:-.2,doorHandleFrontY:-.23,
   doorHandleWidth:.25,doorHandleDepth:.065,tailLightOffsetY:.03,
   customHeadlightShape:[{x:-.2293,y:.1875},{x:.2107,y:.1763},{x:.24,y:-.18},{x:-.24,y:-.18}]}),
 C({color:'#eeeeee',lift:.2739,noseSlant:.108,hoodL:.5,roofL:3.549,rSlant:.1938,wheelSizeFront:.45,wheelSizeRear:.45,
   wheelTread:-.126,tireWidth:.3268,headlights:'Custom',tailLights:'Custom',bumperR:false,grillColor:'#919191',
   garnishColor:'#ffffff',doorHandleFrontX:.8,doorHandleFrontY:-.17,doorHandleRearX:.8,doorHandleRearY:-.16,
   doorHandleWidth:.23,doorHandleDepth:.06,tailLightOffsetX:.01,tailLightOffsetY:.15,
   customHeadlightShape:[{x:-.2433,y:.1557},{x:.2113,y:.1053},{x:.2127,y:-.0664},{x:-.238,y:-.0664}]}),
 C({color:'#f7d52b',width:2.2198,roofWidth:1.65,totalLength:5.061,lift:.1881,noseH:.5786,roofH:1.282,roofL:1.3475,
   rSlant:.608,trunkH:.8347,wheelSizeFront:.38,wheelSizeRear:.38,wheelTread:-.16,tireWidth:.42,rimDepth:145,
   headlights:'Custom',tailLights:'Vertical_Slim',mufflerType:'Dual',bumperColor:'#f7d52b',frontGrillStyle:'slats',
   grillColor:'#000000',bodyRoundness:26,bumperRoundness:50,doorCount:'4door',doorHandleFrontX:.35,doorHandleFrontY:-.11,
   doorHandleRearX:-.36,doorHandleRearY:-.11,doorHandleWidth:.23,doorHandleDepth:.065,
   customHeadlightShape:[{x:-.24,y:.18},{x:.2227,y:.0997},{x:.244,y:-.0645},{x:-.236,y:-.0645}]})
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

export function buildTougeCar(index,design=loadTougeDesign(index)){
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
