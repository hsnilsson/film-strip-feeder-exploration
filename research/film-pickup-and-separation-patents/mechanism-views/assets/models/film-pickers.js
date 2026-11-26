import { f, record, sheet, roller, shaft, end, side, iso, plan, detail, pile, tray, film, cup, gear, belt, jet } from './shared.js';

const phases = {
  home:[.74,0,.06,0], contact:[0,0,0,0], engaged:[0,0,0,0], pre:[0,.21,.03,0],
  pump:[0,.39,.06,0], bend:[0,.69,.12,0], lift:[.48,.44,.17,0],
  handoff:[.74,.67,.31,.39], gap:[.74,.59,.29,.29],
};

function heelPickup(g,state,{ oscillating=false }={}) {
  const full=state.endsWith('-full');
  const phase=state.replace('-full','');
  const [heelRise,curve,slide,advance]=phases[phase] ?? phases.home;
  const width=5.64;
  const yHeel=.13;
  const yCup=1.83-slide+advance;
  const stock=pile(g,{y:-.58,z:.25,width:width-.32,length:5.52,height:full?1.10:.60,sheets:full?13:8,part:'film'});
  tray(g,{y:-.52,length:5.90,width:6.20,wall:full?1.18:.74});
  for(const x of [-2.91,2.91]){
    for(const y of [-2.82,2.59]) g.box('support',x,y,.28,.26,.30,2.74);
    g.box('support',x,-.115,2.78,.26,5.42,.18);
    g.cylinder('steel',[x,-2.72,2.92],[x,2.90,2.92],.12);
  }
  if(phase==='system') {
    g.box('base',0,-.48,-.60,6.4,6.4,.6);
    g.box('support',0,2.89,.27,5.97,.44,3.82);
    g.box('dark',0,-1.78,3.24,5.69,1.93,.29);
  }
  const yPivot=-1.36;
  const zHeel=stock+heelRise;
  g.track('moving',[[0,yPivot,zHeel+1.17],[0,-.56,zHeel+.47],[0,yHeel,zHeel+.16]],5.21,.21);
  roller(g,'steel',yPivot,zHeel+1.17,.125,5.56);
  roller(g,'steel',yHeel,zHeel+.32,.12,5.32);
  for(const x of [-1.94,1.94]) {
    g.box('moving',x,yHeel,zHeel,.62,.44,.25);
    g.spring('spring',[x,yHeel-.30,zHeel+.29],[x,yHeel-.65,zHeel+1.02],.14);
  }
  const skew=phase==='bend' || phase==='pump' ? .105:0;
  const cupSpacing=[-2.04,-.68,.68,2.04];
  const deliver=phase==='handoff'||phase==='gap';
  const yEdge=deliver?(phase==='handoff'?2.85:2.67):1.99+advance-slide*.70;
  const nip=stock+1.17;
  const filmAtCup=(x)=>stock+heelRise*.65+curve+skew*(1-Math.abs(x)/2.04);
  for(const x of cupSpacing) {
    const zCup=filmAtCup(x);
    cup(g,x,yCup,zCup,.42);
    g.sweep('moving',[x,yHeel,zHeel+.32],[x,yCup-.30,zCup+.64],.41,.18);
    g.cylinder('steel',[x,yCup-.60,zCup+.65],[x,yCup+.53,zCup+.65],.076);
    g.spring('spring',[x,yCup-.53,zCup+.64],[x,yCup-.12,zCup+.64],.11,.052,4);
  }
  const lifted=['engaged','pre','pump','bend','lift','handoff','gap'].includes(phase);
  if(lifted) {
    const back=-3.27;
    const segments=18;
    const totalWidth=width-.32;
    const rows=[back,-1.42,yHeel,yHeel+.60,yCup,yEdge,yEdge+.21];
    const zAt=(x,i)=>[stock,stock,stock+heelRise*.12,stock+heelRise*.39+curve*.22,
      filmAtCup(x),deliver?nip:filmAtCup(x)+curve*.05,deliver?nip:filmAtCup(x)+curve*.055][i];
    for(let j=0;j<segments;j++){
      const x0=totalWidth*(j/segments-.5),x1=x0+totalWidth/segments;
      for(let i=1;i<rows.length;i++){
        g.face('film',[[x0,rows[i-1],zAt(x0,i-1)],[x1,rows[i-1],zAt(x1,i-1)],
          [x1,rows[i],zAt(x1,i)],[x0,rows[i],zAt(x0,i)]],false);
      }
    }
  }
  roller(g,'drive',2.85,nip-.23,.23,5.48);
  roller(g,'moving',2.85,nip+(phase==='handoff'?.23:.43),.23,5.48);
  g.box('support',0,2.57,nip-.14,5.63,.48,.13);
  g.track('dark',[[2.39,-2.50,3.15],[2.39,-.47,3.08],[2.39,yHeel+.21,zHeel+1.07],[2.39,yCup-.15,filmAtCup(2.04)+.70]],.077);
  if(oscillating) {
    g.box('drive',2.57,-2.50,2.74,.59,.89,.71);
    roller(g,'steel',-2.49,3.16,.19,.34,2.55);
    if(phase==='system'||phase==='pump') g.track('air',[[2.53,-2.53,3.10],[3.29,-2.53,2.85],[3.29,.93,1.65]],.093);
  }
}

const cycle = (start, rows) => rows.map((row,i)=>f(start+i,[row]));

export const models = {
  WO2004079448A1: record('Cartridge pickup with heel, sliding cups and film wrap',(g,state)=>heelPickup(g,state),
    f(1,[['drawing cover','Cover illustration of the pickup and the spring-supported heel.','engaged',side]]),
    ...cycle(17,[
      ['1','Location of the film supply in the laser imager.','system',end],
      ['2','Pickup, heel, cartridge lip and roller in isometric view.','home',iso],
      ['3','Detail of four sliding cup carriers sharing the pickup beam.','contact',[-148,42,1]],
      ['4','Home position. The pickup and heel stand clear of the film supply.','home',side],
      ['5','Heel contact establishes the top of the stack.','contact',side],
      ['6','The cups are engaged at the leading edge with the heel still on the stock.','engaged',side],
      ['7','Before the pumping stroke, the cup carriers begin to move relative to the heel.','pre',side],
      ['8','Maximum bend. The cups lift the leading margin while the heel restrains the remainder.','bend',side],
      ['9','Isometric view across the bent edge, cup carriers and receiver.','bend',detail],
      ['10','The head lifts the selected film clear of the cartridge.','lift',side],
      ['11','Back at home, the roller pair receives the selected film.','handoff',side],
      ['12','Cup engagement at the higher stock level of a full cartridge.','engaged-full',side],
      ['13','The gap at the roller allows the leading margin to enter before contact.','gap-full',side],
      ['14','Maximum bend above a full rather than partly used cartridge.','bend-full',side],
      ['15','Home position with a full cartridge.','home-full',side],
    ])),

  WO2007019045A1: record('Oscillating film pickup with a heel reference',(g,state)=>heelPickup(g,state,{oscillating:true}),
    f(1,[['1 cover','Cover block diagram places the film supply at the start of the imaging transport.','system',iso]]),
    ...cycle(24,[
      ['1','System diagram. This view locates the film supply and its controlled motor at the transport inlet.','system',end],
      ['2','Perspective of the pickup, cartridge and cable drive.','home',iso],
      ['3','The vacuum cup carriage and heel pads share the pickup assembly.','contact',[-144,41,1]],
      ['4','Home before engaging a sheet.','home',side],
      ['5','The heel establishes the position of the film surface at contact.','contact',side],
      ['6','The cups seal against the selected edge.','engaged',side],
      ['7','The pump position begins bending the film. The claimed method can drive oscillation about the held edge.','pump',side],
      ['8','A maximum-bend posture in the separation cycle. The view shows geometry, without simulating a vibration frequency.','bend',side],
      ['9','An oblique view shows the lateral cup spacing and deformation.','bend',detail],
      ['10','After separation, the assembly lifts the sheet.','lift',side],
      ['11','The transport nip accepts the lifted film before the cups release.','handoff',side],
    ])),

  US7950654B2: record('Registered batch film lift and perforation handoff',(g,state)=>{
    const gravity=state.startsWith('gravity');
    const station=state.startsWith('station');
    const clamp=state.startsWith('clamp');
    const mating=state.startsWith('mating');
    const rotate=state.startsWith('rotate');
    const flatten=state.startsWith('flatten');
    const beltReceiver=state.startsWith('belt');
    const postless=['sensors','beltFull','multi'].includes(state)||gravity||station;
    const deck=3.21;
    const stripWidth=2.48;
    const pickup=['pickup','tray','contact'].includes(state);
    const matingPath=(z,y,part='film')=>film(g,[[y-3.0,z],[y+3.0,z]],stripWidth,part);
    const upperRail=state==='tray'?1.24:deck-.05;
    const part=state==='tray'?'steel':'base';
    const teeth=(y,z,r,x)=>gear(g,x,y,z,r,.20,'moving');
    if(flatten) {
      const up=state==='flatten-open'?.42:.06;
      g.frame('support',0,0,.16,3.16,7.10,.18,.20);
      sheet(g,'film',0,0,.36,2.43,6.12);
      for(const x of [-1.38,1.38]) for(const y of [-2.7,-1.38,0,1.38,2.7]) {
        shaft(g,x,y,.31,.09,.61);
        g.box('moving',x*.90,y,.36+up,.45,.17,.12);
      }
      return;
    }
    if(mating || clamp || (station&&state.includes('roller'))) {
      const n=state.endsWith('closed')||state.endsWith('feed'), r=.43, z=1.05;
      g.frame('base',0,0,0,4.37,5.97,.29,.48);
      matingPath(z,0);
      for(const x of [-.99,.99]) {
        if(!state.includes('smooth')) teeth(.50,z-r,r,x);
        else roller(g,'support',.50,z-r,r,.36,x);
        roller(g,'drive',.50,z+r+(n?0:.39),r,.31,x);
        shaft(g,x,-1.23,.25,.068,1.02);
      }
      if(clamp){
        for(const x of [-1.12,1.12]) {
          g.box('support',x,1.04,.77,.25,.92,.28);
          g.box('moving',x*(n?.91:1.22),1.04,1.05,.34,.91,.19);
          if(n) g.cylinder('moving',[x*.86,1.04,1.24],[x*.86,1.04,1.00],.060);
        }
      } else if(!n){
        g.box('moving',0,-.67,1.17,2.82,.95,.17);
        for(const x of [-.69,.69]) cup(g,x,-.67,z,.30);
      }
      return;
    }
    if(gravity || station) {
      const dropped=state.endsWith('release');
      const low=dropped||state.endsWith('seat');
      const z=low?.52:1.13;
      g.box('base',0,0,0,4.73,3.83,.29);
      for(const x of [-1.35,1.35]) g.box('support',x,0,.29,.21,.51,4.21);
      g.box('support',0,0,.34,2.83,.49,.23);
      const angle=state==='gravity-enter'?-71:-90;
      g.around('x',[0,0,z],angle,()=>{
        sheet(g,'film',0,-1.51,z,2.43,3.02);
        if(!dropped){
          cup(g,0,-1.72,z,.32);
          shaft(g,0,-1.72,z+.49,.14,1.19,'moving');
        }
      });
      if(state.includes('door')){
        g.box('moving',1.37,.05,.86,.32,.69,1.54);
        g.spring('spring',[1.38,.36,2.43],[1.38,.36,2.88],.12);
      }
      return;
    }
    const trayZ=.23, trayY=-.39;
    const dz=pickup? .89:deck;
    tray(g,{y:trayY,width:3.51,length:6.88,wall:.72});
    if(state==='multi') tray(g,{x:3.54,y:trayY,width:3.51,length:6.88,wall:.82});
    pile(g,{y:trayY,z:trayZ+.01,width:stripWidth,length:6.53,height:.64,part:'film'});
    if(!postless) {
      for(const x of [-.97,.97]) {
        shaft(g,x,1.86,trayZ,.063,upperRail-trayZ);
        if(state!=='slotted') shaft(g,x,-2.56,trayZ,.063,upperRail-trayZ);
      }
    }
    if(state==='tray') return;
    if(rotate) {
      const angle=state==='rotate-up'?-76:state==='rotate-half'?-28:0;
      g.around('y',[0,0,dz],angle,()=>{
        matingPath(dz,-.21);
        for(const x of [-.66,.66]) cup(g,x,.12,dz,.29);
      });
    } else {
      matingPath(dz,pickup?-.39:.34);
      for(const x of [-.66,.66]) cup(g,x,-.48,dz,.29);
    }
    g.box('moving',0,-.44,dz+.50,1.87,1.33,.24);
    g.cylinder('steel',[0,-.42,dz+.71],[0,-.42,deck+1.0],.15);
    g.box('support',0,-.42,deck+.84,.81,.89,.29);
    if(state==='sensors') {
      for(const x of [-1.14,1.14]){
        g.box('dark',x,1.58,deck+.24,.32,.56,.32);
        g.sweep('light',[x,1.57,deck+.24],[x,1.57,deck],.057);
      }
    }
    if(state==='multi') jet(g,[2.50,1.39,.62],[1.01,1.39,.78],.14);
    if(beltReceiver || state==='beltFull') {
      const positions=state==='beltFull'?[0]:[-.98,.98];
      for(const x of positions) belt(g,{x,from:1.49,to:3.47,z:deck+.32,radius:.30,width:state==='beltFull'?2.51:.45});
    } else {
      for(const x of [-.98,.98]) {
        teeth(2.92,deck-.39,.39,x);
        roller(g,'drive',2.92,deck+.48,.43,.27,x);
      }
    }
    if(state==='edge-grab') {
      for(const x of [-1.38,1.38]) g.sweep('moving',[x,2.62,deck],[x*.73,2.62,deck],.15);
    }
  },f(1,[['1A cover','Cover illustration of the registered lift from tray to receiver.','working',iso]]),
  f(2,[['1A','A vacuum head lifts film from the supply tray to the backing rollers and sprockets.','working',iso]]),
  f(3,[['1B','Detail of the perforation drive and adjacent backup rollers.','mating-closed',detail]]),
  f(4,[['1C','Section across film and backing rollers at the mating assembly.','mating-closed',end],
    ['2','From the side, the head lifts the sheet along the stacking guides.','working',side],
    ['3','Plan of the supply tray and the posts that line up with film perforations.','tray',plan]]),
  f(5,[['4A','An alternative mating assembly positions the margins with paired rollers.','mating-open',end],
    ['4B','Another mating assembly seen from the feed end.','mating-smooth-open',end],
    ['4C','Section through the roller-to-film contact and edge drive.','mating-closed',side]]),
  f(6,[['5A','View from below as the alternative receiver takes the film margin.','edge-grab',[0,-85,1]],
    ['5B','Side view of the suction lift and the alternative receiver.','edge-grab',side],
    ['5C','Plan of the alternate supply tray.','slotted',plan]]),
  f(7,[['6A','First belt receiver, viewed across the film.','belt-lanes',end],
    ['6B','Belt receiver and vacuum pickup in section.','belt-lanes',side],
    ['6C','Tray plan for this embodiment.','tray',plan]]),
  f(8,[['7A','Second belt receiver, pictured at the film margins.','beltFull',end],
    ['7B','The counterpressure belt advances the held film.','beltFull',side],
    ['7C','Plan of the supply for the full-width belt receiver.','tray',plan]]),
  f(9,[['8A','Optical sensors register the film without using posts.','sensors',side]]),
  f(10,[['8B','The spaced supports and hold-downs of the flattening mechanism.','flatten-open',iso],
    ['8C','The same supports brought down around the film.','flatten-closed',iso]]),
  f(11,[['9','The head can rotate the sheet into a near-vertical positioning bay.','gravity-enter',iso]]),
  f(12,[['10A','A sheet enters the positioning bay.','gravity-enter',side],
    ['10B','Sidewalls keep the sheet registered as it approaches its rest.','gravity-seat',side],
    ['10C','The sheet is lowered onto its datum.','gravity-release',side]]),
  f(13,[['11A','An alternative vertical registration bay includes a movable shutter.','gravity-door-enter',side],
    ['11B','The head and sheet move toward the receiver.','gravity-door-seat',side],
    ['11C','The sheet reaches its registration surface at the bay.','gravity-door-release',side]]),
  f(14,[['12A','The sheet descends toward a lower registration platform.','station-enter',side],
    ['12B','The film end rests on the platform.','station-seat',side],
    ['12C','With the film positioned, the receiver grips the edges.','station-roller-closed',side]]),
  f(15,[['13A','The alternative roller approach before mating.','station-roller-open',side],
    ['13B','The registered sheet advances into the pressure roller.','station-roller-closed',side],
    ['13C','The carrier can then feed the sheet through the contacting pair.','station-roller-feed',side]]),
  f(16,[['14A','An alternative uses a smooth opposed contact.','mating-smooth-open',side],
    ['14B','Smooth rollers form a nip with the film supported.','mating-smooth-closed',side],
    ['14C','The sheet continues through the closed nip.','mating-smooth-feed',side]]),
  f(17,[['15A','The vacuum head aligns with the film before contact.','rotate-start',iso],
    ['15B','Head orientation changes while it holds the film.','rotate-half',iso],
    ['15C','The head and captured film move up toward the receiver.','rotate-up',iso]]),
  f(18,[['16A','Sheet and roller mating assembly shown clear of one another.','mating-open',iso],
    ['16B','Partially engaged sheet at the roller pair.','mating-open',side],
    ['16C','The mating assembly grips the sheet for handoff.','mating-closed',side]]),
  f(19,[['17','Batch loading system with an additional film supply.','multi',iso]]),
  f(20,[['18A','The engagement arms begin clear of the film.','clamp-open',iso],
    ['18B','The side arms move toward the perforated margins.','clamp-open',side],
    ['18C','The engagement arms move the film after the pin seats.','clamp-closed',iso]]),
  f(21,[['18D','Partial cutaway at the pin and one film perforation.','clamp-closed',detail]]),
  f(22,[['19A','The end assembly and its pivoting engagement members.','clamp-feed',iso],
    ['19B','Front elevation through the two edge contacts.','clamp-feed',end]])),
};
