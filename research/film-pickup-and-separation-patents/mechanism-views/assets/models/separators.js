import { f, record, sheet, roller, shaft, end, side, iso, plan, detail, pile, tray, film, gear, belt } from './shared.js';

export const models = {
  US3966189A: record('Self-tightening toggle retard pad', (g,state) => {
    const reverse=state==='reverse';
    const bypass=state==='bypass';
    const zipped=state==='towed';
    const isolated=state==='drive';
    if(!isolated) {
      const stock=state==='empty'?0:.76;
      tray(g,{y:-1.76,length:5.28,wall:1.11});
      if(stock) pile(g,{y:-1.76,length:4.95,height:stock});
      const tilt=state==='drawer'?-13:0;
      g.around('x',[0,-3.83,1.67],tilt,()=>{
        belt(g,{from:-1.99,to:1.05,z:1.77,radius:.45,width:2.96});
      });
      const pivot=[0,1.40,.69];
      const angle=reverse?24:bypass?39:-5;
      g.around('x',pivot,angle,()=>{
        g.track('moving',[[0,1.40,.69],[0,1.44,.92],[0,1.22,1.18],[0,.99,1.32],[0,.71,1.34]],3.11,.12);
        g.box('spring',0,.91,1.34,3.19,.61,.10);
      });
      roller(g,'steel',1.40,.69,.095,4.5);
      g.spring('spring',[1.58,1.32,.74],[1.58,2.08,.39],.12);
      if(state!=='empty') {
        const curve=state==='buckle'?.50:state==='assist'?.31:.12;
        film(g,[[-4.12,1.04],[-1.21,1.06],[-.21,1.30],[.80,1.33],[1.39,1.33],[2.09,1.31+curve],[2.83,1.30],[3.77,1.30]],4.36,'paper');
      }
      if(zipped) {
        for(const x of [-1.48,1.48]) g.around('z',[x,2.93,1.1],x>0?-8:8,()=>{
          roller(g,'drive',2.93,1.55,.25,1.3,x); roller(g,'drive',2.93,1.05,.25,1.3,x);
        });
      } else {
        for(const z of [1.04,1.55]) roller(g,'drive',2.93,z,.25,4.57);
      }
      if(['bypass','assist','buckle'].includes(state)) {
        g.box('moving',0,2.71,.78,4.33,.21,.46);
        g.box('air',2.54,2.3,1.66,.24,.43,.42);
      }
      if(state==='both') {
        pile(g,{y:-1.76,z:2.33,length:4.95,height:.78});
        belt(g,{x:1.28,from:-1.25,to:1.15,z:2.02,radius:.23,width:1.2});
      }
    }
    if(isolated||state==='control'||state==='drawer'){
      for(const [y,z,r] of [[-.89,1.05,.48],[.48,1.31,.42],[1.26,1.76,.32]]) gear(g,2.42,y,z,r);
      g.sweep('moving',[2.42,-.8,1.05],[2.42,1.3,1.74],.20);
    }
  },f(1,[['6 cover','Cover illustration of the driven belt and pivoted retard pad.','working',side]]),
  f(2,[['1','Feeding assembly in its installed position.','working']]),
  f(3,[['2','The drawer extends for loading and separates from its drive.','drawer',iso]]),
  f(4,[['3A','Forward motion pulls the pad into the belt span and increases its load.','working',side],
    ['3B','Withdrawal reverses the toggle and opens the throat.','reverse',side]]),
  f(5,[['4','Drive coupling shown detached to expose the shaft and link.','drive',iso],
    ['12','Alternative lever before helping a buckle form.','assist',side],
    ['13','The assist moves the sheet toward the registration rolls.','buckle',side]]),
  f(6,[['5A','A sheet holds the sensing linkage in its loaded position.','working',side],
    ['5B','In the empty position the sensing linkage changes state.','empty',side]]),
  f(7,[['6','The pad pivots about a transverse pin below the belt.','working',side],
    ['7','Alternative arrangement with the registration path and both feeds.','both',side]]),
  f(8,[['8','Buckle-height control flow diagram and the associated gate and sensor location.','buckle',iso],
    ['9','Electrical schematic for the buckle-height system. Its controlled part is shown in 3D.','control',iso]]),
  f(9,[['10','Timing diagram for the coupled feed and registration functions.','buckle',side],
    ['16A','Plan of a sheet constrained at the separator and registration rolls.','working',plan],
    ['16B','End view of those roller contacts.','working',end],
    ['17A','A pre-registration bump changes the region between the two contacts.','buckle',plan],
    ['17B','End view of the guide and pre-registration bump.','buckle',end],
    ['18A','Toe-out of the two registration rolls.','towed',plan],
    ['18B','Roller toe-out viewed from the feed end.','towed',end]]),
  f(10,[['11A','Pivoted chute in the feeding position.','working',iso],
    ['11B','The bypass chute opens access for another feed path.','bypass',iso]]),
  f(11,[['14','Top and bottom feeders sit on opposite sides of the shared path.','both',side],
    ['15A','One belt feeds from above the tray toward registration.','both',side],
    ['15B','The opposite belt can feed from below.','both',[-86,23,1]]])),

  US4179114A: record('Cam-sequenced pin and film bow', (g,state) => {
    const touch=state==='touch', bow=state==='bow';
    tray(g,{y:-.54,length:6.73,wall:.97});
    const top=pile(g,{y:-.63,length:6.30,height:.64,part:'film'});
    const y=bow ? .89 : 1.35;
    film(g,[[-3.75,top],[-1.3,top],[-.32,top+(bow?.53:0)],[.56,top+(bow?.60:0)],
      [y,top],[2.50-(bow?.41:0),top]],4.48);
    for(const x of [-2.61,2.61]){
      g.box('support',x,.36,.25,.22,6.2,.24);
      g.sweep('support',[x,-1.58,.44],[x,-.51,1.72],.23);
      g.sweep('support',[x,-.51,1.72],[x,1.22,2.24],.23);
      gear(g,x,1.22,2.24,.92,.21,'drive');
    }
    roller(g,'steel',1.22,2.24,.16,5.50);
    const pointZ=touch||bow?top:top+.50;
    for(const x of [-1.55,1.55]){
      g.sweep('moving',[x,1.14,2.25],[x,y-.15,pointZ+.33],.18);
      g.cylinder('steel',[x,y-.15,pointZ+.34],[x,y,pointZ],.064);
      if(bow) g.track('moving',[[x,2.64,pointZ+.12],[x,1.13,pointZ+.10],[x,.62,pointZ+.29]],.32,.12);
    }
    for(const z of [1.22,1.73]) roller(g,'drive',3.03,z,.24,4.78);
  },f(1,[['drawing cover','The cover shows the cam body, its lever and the cassette in side section.','working',side]]),
  f(2,[['1','End view establishes pin and guide locations across the cassette.','working',end],
    ['4','The single film bows, creating a gap for the supporting guide.','bow',side]]),
  f(3,[['2','The cam holds the pin clear in the starting position.','working',side],
    ['3','The pin bears on the upper film margin just before the cam moves it along the sheet.','touch',side]])),

  US4239202A: record('Pendulum-plough dispenser for notched X-ray film', (g,state) => {
    const lift=state==='detail';
    const reach=state==='peel' || lift;
    if(!lift) {
      g.box('base',0,0,0,5.89,3.83,.26);
      g.around('x',[0,0,.26],-12,()=>{
        for(let i=0;i<8;i++) {
          const y=-1.05+i*.09;
          g.box('film',0,y,.62,4.61,.035,3.55);
          const x=i%2?1.25:-1.25;
          g.box('film',x*.69,y,4.14,1.15,.035,.26);
          g.box('film',-x*.89,y,4.14,2.38,.035,.26);
        }
        roller(g,'support',-.24,.70,.19,5.08);
      });
      if(reach) {
        const rows=[[.03,4.32],[.30,3.6],[.55,2.95],[.56,2.21],[.48,1.58],[.39,.94]];
        film(g,rows,4.53);
      }
    }
    g.cylinder('steel',[-2.78,.36,4.42],[2.78,.36,4.42],.14);
    const x=reach?-1.22:1.22;
    const wedge=reach?.36:.69;
    g.track('moving',[[x,.36,4.42],[x,.44,3.81],[x,wedge,3.11]],.25,.23);
    g.solid('moving',[[x-.26,wedge,3.15],[x+.22,wedge,3.15],[x+.16,wedge-.19,3.31]],
      [[x-.26,wedge,3.41],[x+.22,wedge,3.41],[x+.16,wedge-.19,3.35]]);
    if(lift) {
      g.box('support',x,0,3.11,2.13,.30,.45);
      for(let i=0;i<5;i++) g.box('film',x,.03-i*.06,3.02,1.78,.032,1.16);
    }
  },f(1,[['1 cover','The cover repeats the dispenser with the traversing pendulum.','working',end]]),
  f(2,[['1','The pendulum traverses the width of the stack to reach alternate notches.','working',end],
    ['2','The sloped holder supports the stack while one sheet can fall toward the outlet.','peel',side]]),
  f(3,[['3','The stack support and its plough engagement in elevation.','detail',iso],
    ['4','In section the moving plough enters the exposed notch and separates the outer sheet.','detail',side]])),

  US4365793A: record('Darkslide cavity and bottom roller feeder', (g,state) => {
    if(state==='seal'){
      g.frame('dark',0,0,0,5.41,4.96,.38,.55);
      g.box('spring',0,2.07,.37,4.63,.74,.72);
      g.box('support',0,-1.30,.37,5.06,2.57,.35);
      return;
    }
    const magazine=['magazine','tall'].includes(state);
    const load=['open','insert','drop'].includes(state);
    tray(g,{width:5.62,length:6.47,wall:1.47});
    const z=state==='tall'?1.85:.65;
    pile(g,{y:-.51,z:.31,width:4.67,length:4.61,height:z,part:'film'});
    const darkY=load?-3.38:-.57;
    g.box('dark',0,darkY,magazine?z+.50:1.82,5.44,4.68,.11);
    g.box('moving',0,darkY-2.30,1.94,1.18,.26,.18);
    if(magazine){ g.frame('support',0,-.50,.26,5.12,5.01,z+.24,.26); return; }
    roller(g,'drive',2.28,.48,.32,4.72);
    // The blade's low edge sits above the roller tangent by approximately one film thickness.
    g.box('steel',0,2.25,.846,4.89,.113,.87);
    if(state==='feed'||state==='machine'||state==='interface'){
      const track=[[-2.77,.335],[.95,.335],[1.80,.61],[2.28,.801],[2.67,.76],[3.62,.62],[4.54,.62]];
      film(g,track,4.59);
      g.box('dark',0,3.47,.56,5.2,.42,.07);
      for(const z of [.42,.83]) roller(g,'drive',4.12,z,.20,4.65);
      g.cylinder('steel',[2.41,2.28,.48],[2.92,2.28,.48],.14);
      g.sweep('dark',[2.71,2.23,.57],[2.71,3.64,1.13],.18);
      if(state==='interface') g.frame('spring',0,4.60,.42,5.55,1.31,.43,.28);
    }
    if(state==='machine') g.around('x',[0,-2.99,1.93],56,()=>g.frame('base',0,-.35,1.93,5.62,5.78,.19,.36));
  },f(1,[['drawing cover','Cover illustration of the roller transport and light-tight delivery.','feed',side]]),
  f(2,[['1','Overall film handler with side cover and base removed.','machine',iso],
    ['5','The darkslide is closed across the cavity.','working',iso]]),
  f(3,[['2','Standard magazine, with the nested cover partially opened.','magazine',iso],
    ['3','Alternative deep magazine for larger film stacks.','tall',iso],
    ['4','Darkslide passage and alignment surfaces exposed.','open',iso]]),
  f(4,[['6','Section through the handler before a magazine is inserted.','working',side],
    ['7','Magazine and cover in the insertion position.','insert',side]]),
  f(5,[['8','Opening the darkslide lets the complete film stack drop into the isolated cavity.','drop',side],
    ['9','The darkslide is locked before single-sheet feed starts.','feed',side]]),
  f(6,[['10','The film exit closure seals around the narrow delivery path.','seal',iso]]),
  f(7,[['11','The powered rubber roller takes the lowest sheet through the blade gap to the processor.','feed',iso]]),
  f(8,[['12A','Light-tight interface between the feeder and the adjacent processor.','interface',iso],
    ['12B','Shaped foam block around the processor interface.','seal',detail]])),

  EP0521459A1: record('Upright roller-fed film magazine', (g,state) => {
    const x=0;
    g.box('base',0,0,0,5.56,3.24,.27);
    for(const s of [-1,1]) g.box('support',s*2.67,-.65,.27,.19,1.83,6.18);
    for(let i=0;i<10;i++) {
      const y=-1.60+i*.076;
      g.around('x',[0,y,1.68],-6,()=>g.box('film',0,y,1.68,4.76,.042,4.20));
    }
    g.track('moving',[[0,-1.84,1.18],[0,-1.87,2.01],[0,-1.59,4.96]],.34,.21);
    g.spring('spring',[0,-2.22,.78],[0,-1.84,1.18],.16);
    roller(g,'drive',-.61,2.84,.42,4.86);
    roller(g,'support',.41,1.71,.43,4.86);
    g.sweep('support',[-2.48,-1.23,1.58],[2.48,-1.23,1.58],.24,.33);
    g.track('support',[[0,-1.43,1.61],[0,-.97,1.48],[0,-.54,1.16],[0,-.12,.91]],4.78,.18);
    film(g,[[-.83,5.86],[-.99,2.77],[-1.01,1.60],[-.89,1.45],[-.48,1.10],[.19,.82],[.92,.76]],4.75);
    if(state==='overview') g.box('base',2.62,-.39,.27,.22,2.34,6.16);
  },f(1,[['drawing cover','The abstract drawing shows the upright stack, pressing lever and film exit.','overview',side]]),
  f(4,[['drawing','The driven roller buckles the selected film over the wedge. The exit throat intentionally accommodates more than one film thickness.','working',[76,29,1]]])),

  EP0405466B1: record('Offset pick roller, dam and retard pad', (g,state) => {
    const force=state==='diagram';
    const late=state==='delivery';
    const manual=state==='manual';
    const detailOnly=['detector','exploded'].includes(state);
    if(!detailOnly) {
      g.around('x',[0,-3.78,.65],11,()=>{
        tray(g,{y:-1.68,z:.18,length:5.13,width:5.39,wall:.91});
        const top=pile(g,{z:.43,y:-1.66,length:4.88,height:.65});
        film(g,[[-4.06,top],[-.12,top],[.69,top-.12]],4.43,'paper');
      });
      if(!force){
        g.spring('spring',[0,-2.04,.18],[0,-2.04,.52],.21);
        g.box('support',0,1.01,.38,5.38,.26,.93);
      }
      roller(g,'moving',.72,1.73,.59,4.63);
      g.sweep('support',[-2.38,1.06,1.1],[2.38,1.06,1.1],.19,.30);
      g.box('spring',0,1.29,.978,4.63,.49,.11);
      g.spring('spring',[0,1.31,.49],[0,1.31,.98],.15);
      if(late||manual) film(g,[[.02,1.68],[.69,1.34],[1.04,1.14],[1.44,1.083],[2.79,1.08],[3.86,1.08]],4.38,'paper');
    }
    if(late||manual||detailOnly||state==='control'){
      for(const z of [.84,1.32]) roller(g,'drive',2.79,z,.23,4.63);
      g.box('support',0,2.74,.47,5.46,2.29,.26);
      for(const x of [-1.38,1.38]) {
        shaft(g,x,2.02,1.31,.096,.42,'steel');
        g.box('dark',x,2.01,1.67,.47,.62,.38);
      }
    }
    if(state==='exploded') roller(g,'moving',.72,2.64,.58,4.63);
  },f(14,[['1','The roller picks at the exposed edge, offset from the face of the next sheet.','diagram',side],
    ['2','The offset resolves the roller load at the corner before the edge meets the dam.','diagram',end]]),
  f(15,[['3A','Side elevation at the spring-loaded input tray.','working',side]]),
  f(16,[['3B','The sheet path continues through the central drive and sensing region.','delivery',side]]),
  f(17,[['3C','Side elevation of the downstream transport.','delivery',iso]]),
  f(18,[['4A','Partial top view of the infeed side.','working',plan]]),
  f(19,[['4B','Partial top view of the central and outfeed side.','delivery',plan]]),
  f(20,[['5','Plan of the aligned sheet region and support table.','working',plan]]),
  f(21,[['6','A separate plan view locates the transport features.','delivery',plan]]),
  f(22,[['7','Side detail of the offset pick and downstream detector and drives.','delivery',side],
    ['8','Front elevation through the detector assembly.','detector',end],
    ['9','Top view shows the spacing of the sensing parts relative to the sheet path.','detector',plan]]),
  f(23,[['10','The force comparison contrasts different positions of the picking arc at a sheet edge.','diagram',iso]]),
  f(24,[['11','The block diagram connects drive, clutch and sensors. In 3D, the sensing units sit on the outfeed.','control',iso]])),
};
