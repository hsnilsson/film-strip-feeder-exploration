import { f, record, sheet, roller, shaft, end, side, iso, plan, detail, pile, tray, film, cup, gear } from './shared.js';

function mount(g,x,y,z,part='steel'){
  g.frame(part,x,y,z,2.90,2.91,.105,.38);
  sheet(g,'film',x,y,z+.026,2.13,2.13);
}

export const models = {
  US5555042A: record('Rotary slide tray, loader and separate return arm',(g,state)=>{
    const onlyGate=['gate','optics'].includes(state);
    const detached=state==='exploded';
    const wheel=['tray','exploded','machine'].includes(state);
    if(wheel) {
      const c=[0,-2.40,1.63];
      const y=detached?-3.54:-2.40;
      const r=2.07;
      g.cylinder('support',[0,y-.47,1.63],[0,y+.48,1.63],r,1.08,44);
      g.cylinder('steel',[0,y+.47,1.63],[0,y+.61,1.63],2.25,1.82,44);
      for(let i=0;i<18;i++) g.around('y',[0,y,1.63],i*20,()=>{
        g.sweep('support',[0,y-.39,2.63],[0,y+.43,3.55],.077,.13);
        g.sweep('steel',[0,y-.27,2.64],[0,y+.42,3.48],.057,.15);
      });
      if(detached) gear(g,2.48,c[1]+1.25,1.44,.42,.28);
    }
    if(!onlyGate) g.frame('base',0,.21,.21,5.48,5.27,.33,.42);
    for(const x of [-1.60,1.60]) g.box('support',x,.75,.59,.23,3.76,.22);
    const y=state==='return'?.25:1.04;
    mount(g,0,y,.64,'moving');
    g.box('moving',0,2.15,.63,3.2,.31,.20);
    for(const x of [-1.65,1.65]) {
      g.spring('spring',[x,y,1.12],[x*1.20,y,1.49],.13);
      g.box('support',x,y,.71,.32,2.90,.28);
    }
    if(state==='optics' || state==='machine') {
      shaft(g,0,1.05,1.30,.56,1.09,'glass');
      shaft(g,0,1.05,-.91,.48,.46,'glass');
      g.sweep('light',[0,1.05,-.44],[0,1.05,1.30],.075);
    }
    if(onlyGate || state==='machine') return;
    for(const s of [-1,1]) {
      const x=s*2.35,z=.79;
      shaft(g,x,-1.61,.42,.18,.49);
      const targetY=s===-1 ? state==='return'?-.39:.71 : state==='return'?.65:-1.43;
      g.track(s===-1?'moving':'drive',[[x,-1.61,z],[s*1.07,targetY,z],[s*.71,targetY,z]],.23,.14);
    }
  },f(1,[['2 cover','The cover depicts the slide gate and scanner drive assembly.','machine']]),
  f(2,[['1','Optical geometry and the scanning direction relative to the mounted slide.','optics',iso]]),
  f(3,[['2','The scan gate aligns with the light integrator and carriage.','machine',iso]]),
  f(4,[['3','Self-centring guide jaws locate the slide against a stop.','gate',detail]]),
  f(5,[['4','The rotary tray indexes a radial slot at the load opening.','tray',iso]]),
  f(6,[['5','Exploded tray, mounting adapter and stepper drive.','exploded',iso]]),
  f(7,[['6','The separate load and return arms share the fixed guide to the scan gate.','load',iso]]),
  f(8,[['7','Plan of the pivots. The second arm sends the mount back to its tray slot.','return',plan]]),
  f(9,[['8','Controller schematic for tray positioning, scan and return. The scene shows the arm and gate controlled by it.','return',iso]])),

  EP0750228A1: record('Photofinishing receptacle sorting and film retainer',(g,state)=>{
    const retention=state.startsWith('retainer');
    const open=state.endsWith('open');
    const alternate=state.startsWith('retainerB');
    const receiver=(y,z)=>{
      g.box('base',0,y,z,3.52,2.16,.16);
      for(const x of [-1.65,1.65]) {
        g.box('support',x,y,z+.16,.20,2.18,.58);
        g.cylinder('steel',[x-.32,y+.55,z+.12],[x+.32,y+.55,z+.12],.14);
      }
      g.box('support',0,y+.99,z+.16,3.17,.17,.44);
      g.box('spring',1.11,y,z+.22,.21,1.67,.26);
      for(let i=0;i<4;i++) g.box('paper',-.35,y,z+.18+i*.035,1.97,1.55,.03);
      g.box('film',1.23,y,z+.28,.69,1.69,.075);
    };
    if(retention){
      receiver(0,.25);
      g.box('support',-1.66,0,.31,.19,2.28,4.31);
      const z=alternate?1.83:2.22;
      shaft(g,-1.37,-.56,.49,.075,3.04,'moving');
      g.around('z',[-1.36,-.56,z],open?-60:18,()=>{
        g.track('moving',[[-1.36,-.56,z],[-.81,-.56,z],[-.56,.05,z],[-.43,.48,z]],.16);
        g.box('spring',-.43,.48,z-.13,.16,.38,.31);
      });
      g.spring('spring',[-1.42,-.25,z-.50],[-1.42,-.25,z+.21],.13);
      g.box('film',-.62,.51,.41,.13,1.08,3.53);
      if(alternate) {
        shaft(g,-1.39,.45,.47,.083,3.11,'steel');
        g.sweep('moving',[-1.39,.43,z+.29],[-.76,1.12,z+.29],.16);
      }
      return;
    }
    if(state==='single'){receiver(0,.14);return;}
    const incline=state==='waiting'?20:12;
    g.around('x',[0,0,.69],-incline,()=>{
      for(const x of [-1.93,1.93]){
        g.box('support',x,0,.52,.39,8.19,.25);
        for(const y of [-3.41,-2.11,-.89,.36,1.56,2.74,3.76]) {
          g.cylinder('steel',[x-.21,y,.74],[x+.21,y,.74],.15);
        }
      }
      for(const y of [-2.81,-.44,state==='release'?2.35:1.78]) receiver(y,.86);
      const q=state==='waiting'?1.31:2.52;
      g.around('x',[0,q,.68],state==='release'?32:-12,()=>{
        roller(g,'drive',q,.69,.17,4.46);
        for(const x of [-1.82,1.82]) g.sweep('moving',[x,q,.69],[x,q-.32,1.26],.24);
      });
      if(state==='sensors') for(const x of [-1.87,1.87]) {
        g.box('dark',x,.93,1.52,.31,.34,.44);
        g.sweep('light',[x,.94,1.66],[x*.22,.94,1.66],.048);
      }
    });
    if(['line','exposure','second'].includes(state)){
      g.box('base',0,0,-.80,5.37,9.38,.71);
      g.box('dark',0,2.65,2.70,4.37,1.36,.76);
      if(state==='exposure') shaft(g,0,-.77,1.61,.45,.82,'glass');
    }
  },f(1,[['1 cover','The cover shows the delivery loop across the photofinishing line.','line',iso]]),
  f(9,[['1','Overall line with receptacles linking print and film operations.','line',iso]]),
  f(10,[['2','Exposure and processing layout. The scene shows the relevant physical station.','exposure',iso]]),
  f(11,[['3','Perspective of the essential transport and sorting loop.','line',[-144,44,1]]]),
  f(12,[['4','Guide rollers support the receptacle while it travels.','waiting',end],['5','A receptacle has separate locations for prints and film.','single',iso]]),
  f(13,[['6','The sorter drives receptacles around the guide path.','release',side]]),
  f(14,[['7','Film-loading station stop presented against the oncoming receptacle.','release',side],
    ['8','The waiting-station stopper meters one receptacle out of the queue.','waiting',iso]]),
  f(15,[['9','Photoelectric sensing points across the print loading station.','sensors',plan],
    ['10','Alternative installation of the photofinishing line.','second',iso]]),
  f(16,[['11','The film retainer arm sits beside its vertical release shaft.','retainerA',iso]]),
  f(17,[['12A','The arm holds the film at rest.','retainerA',side],['12B','The arm moves clear to release the film.','retainerA-open',side],
    ['12C','Release shaft and arm in the retaining condition.','retainerA',plan],['12D','The shaft has turned to the release condition.','retainerA-open',plan]]),
  f(18,[['13','Modified retainer with an additional lever and shaft.','retainerB',iso]]),
  f(19,[['14A','Modified retainer with the film released.','retainerB-open',end],
    ['14B','The release condition viewed in plan.','retainerB-open',plan],
    ['14C','The arm returns to retain the film.','retainerB',end],
    ['14D','Plan view of the same retaining condition.','retainerB',plan]]),
  f(20,[['15A','A second view of the modified retainer in its first position.','retainerB',side],
    ['15B','The arm and guide in the other position.','retainerB-open',side]])),

  US6556276B2: record('Strip hopper with swinging sucker and closing nip',(g,state)=>{
    if(state==='negative'){
      sheet(g,'film',0,0,.45,2.62,8.42);
      for(const x of [-1.06,1.06]) for(let y=-3.90;y<4.0;y+=.46) g.box('dark',x,y,.45,.16,.21,.032);
      for(const y of [-2.74,0,2.74]) g.frame('steel',0,y,.463,1.63,2.42,.035,.058);
      return;
    }
    const stage=state==='overview' || state==='plan';
    const atStack=state==='pickup';
    const stop=.42;
    g.frame('base',0,.56,0,5.68,8.11,.30,.45);
    const zp=.55;
    g.around('x',[0,stop,zp],54,()=>{
      tray(g,{y:-1.96,z:.29,width:3.19,length:3.97,wall:.27});
      pile(g,{y:-1.93,z:.54,width:2.81,length:3.73,height:.28,part:'film'});
      g.box('support',0,-.05,.54,3.05,.18,.59);
      for(const x of [-1.34,1.34]) g.spring('spring',[x,-2.00,.49],[x*.70,-2.00,.83],.12);
      roller(g,'support',-1.12,1.07,.21,3.02);
    });
    const y=atStack?.05:1.56;
    const contact=atStack?1.12:1.26;
    cup(g,0,y,contact,.37);
    roller(g,'steel',.43,1.81,.11,3.18);
    g.track('moving',[[0,.43,1.81],[0,y+.50,contact+.62],[0,y,contact+.69]],.29,.22);
    if(!atStack) film(g,[[.29,1.10],[.81,1.16],[y,contact],[2.67,contact]],2.81);
    roller(g,'drive',2.07,1.54,.27,3.05);
    roller(g,'moving',2.07,atStack?.77:.995,.27,3.05);
    if(stage || state==='path'){
      for(const yy of [2.88,3.69]) roller(g,'steel',yy,1.06,.19,3.01);
      g.frame('support',0,3.14,.82,3.46,2.11,.19,.34);
      if(stage) g.box('dark',1.70,3.17,1.03,1.16,1.53,1.08);
    }
  },f(1,[['3 cover','Cover drawing follows the strip across the digital reorder unit.','path',side]]),
  f(2,[['1','The strip feeder, scan and operator stations in the reorder machine.','overview',iso],
    ['2','Plan of the reorder machine and insertion area.','plan',plan]]),
  f(3,[['3','Cross section follows the picked strip into the existing scanner.','path',side]]),
  f(4,[['4A','The cup pivots from the registered end of the pile toward a nip that closes for handoff.','working',side],
    ['4B','End view of the spring-squared hopper and guides.','pickup',end],
    ['5','A conventional strip has image frames and rows of perforations.','negative',plan]])),

  EP1267203B1: record('Slide cartridge with rising separator projection',(g,state)=>{
    const close=['lip','lip-work'].includes(state);
    const loaded=state==='pick'||state==='lift'||state==='lip-work';
    const lift=state==='lift'||state==='lip-work';
    const frameZ=.64;
    const travel=state==='pick'?.36:lift?1.13:0;
    const rear=-1.38;
    if(close){
      mount(g,0,travel,frameZ,'moving');
      g.around('x',[0,-1.42,.812],lift?11:0,()=>mount(g,0,0,.812,'support'));
      return;
    }
    g.box('base',0,.55,0,5.41,10.0,.28);
    for(const x of [-1.57,1.57]) {
      if (state==='exploded') g.box('support',x,0,.28,.34,3.07,2.88);
      else for(const y of [-1.42,1.42]) g.box('support',x,y,.28,.34,.29,2.88);
    }
    g.box('support',0,1.47,1.17,3.44,.21,2.09);
    for(const x of [-1.46,1.46]) g.box('steel',x,0,.35,.46,3.03,.28);
    for(let i=1;i<=7;i++) {
      const z=frameZ+i*.14;
      g.around('x',[0,rear,z],i===1&&lift?9:0,()=>mount(g,0,0,z,'steel'));
    }
    mount(g,0,travel,frameZ,'moving');
    g.box('moving',0,rear+travel,.32,2.24,2.45,.22);
    g.box('moving',0,rear-.01+travel,.54,2.27,.21,.16);
    const z=lift?.79:.55;
    g.sweep('moving',[0,rear-.28+travel,.49],[0,rear+.06+travel,z],.35,.21);
    g.box('spring',0,1.59,.70,2.95,.18,.56);
    g.spring('spring',[0,1.72,1.15],[0,1.95,1.56],.16);
    gear(g,1.99,rear,-.046,.48,.30);
    if(state==='exploded') g.box('support',0,1.84,1.80,3.28,.22,1.54);
    if(['line','overview','recess'].includes(state)) {
      for(const y of [2.09,3.50]) for(const z of [.47,.85]) roller(g,'drive',y,z,.18,3.24);
      g.frame('support',0,3.24,.31,3.58,2.41,.20,.31);
      if(state==='line') g.frame('base',0,4.48,.28,3.55,1.63,.65,.35);
    }
  },f(10,[['1','Supply, scanning area and receiving cartridge in the carrier.','overview',iso]]),
  f(11,[['2','Exploded supply cartridge and the spring-biased slot guard.','exploded',iso]]),
  f(12,[['3','Standby. The lowest slide rests on its lateral supports.','working',side],
    ['4','The feed step starts pushing the bottom mount from its rear edge.','pick',side]]),
  f(13,[['5','The moving projection lifts the next mount away from the one being fed.','lift',side],
    ['6','The feeder returns and the next mount can settle.','working',[-86,20,1]]]),
  f(14,[['7','Front elevation of supply, transport and receiving positions.','line',end]]),
  f(15,[['8','Plan of the feed, sensing and receiving positions.','line',plan]]),
  f(16,[['9','The overlapping lips of the lower two mounts can interfere.','lip',side],
    ['10','With the next mount lifted, the moving lower lip passes free.','lip-work',side]]),
  f(17,[['11','A recess in the base provides extra room at the feed path.','recess',end],
    ['12','A bowed mount can pass through the provided recess.','recess',side]])),
};
