import { f, record, sheet, roller, shaft, end, side, iso, plan, detail, pile, tray, film, gear, belt, jet } from './shared.js';

const canonSection = [-86,18,1];

export const models = {
  US6932338B1: record('Independently driven reversible retard roller',(g,state)=>{
    const head=['gate','exploded'].includes(state);
    const z=state==='exploded'?2.47:1.54;
    if(!head){
      g.around('x',[0,.30,1.05],-44,()=>{
        tray(g,{y:-1.75,z:.76,length:4.52,wall:.59});
        pile(g,{y:-1.73,z:1.0,length:4.26,height:.79});
      });
      for(const x of [-2.39,2.39]) belt(g,{x:x*.56,from:-1.57,to:2.07,z:.76,radius:.31,width:1.22});
      roller(g,'drive',2.81,.91,.24,4.51);
      film(g,[[-2.95,3.58],[-1.61,2.32],[-.70,1.47],[.33,1.084],[1.07,1.084],[2.80,1.15]],4.40,'paper');
      if(state==='machine') {
        g.box('base',0,.28,0,6.05,6.49,.25);
        g.box('support',-2.86,.22,.24,.22,6.37,3.79);
      }
    } else roller(g,'drive',.78,.77,.46,4.23);
    roller(g,'spring',.78,z,.45,4.01);
    roller(g,'steel',.78,z,.131,4.82);
    for(const x of [-2.21,2.21]) {
      g.box('support',x,.92,z-.24,.31,.91,1.37);
      shaft(g,x,.98,z+.80,.13,.76,'moving');
    }
    g.box('support',0,.91,z+.97,4.65,.69,.26);
    g.track('drive',[[2.30,.79,z],[2.53,.81,z+.45],[2.53,1.06,z+.97]],.19);
    g.cylinder('drive',[2.42,1.10,z+.97],[3.07,1.10,z+.97],.37,.13);
  },f(1,[['2 cover','Side section on the cover shows the gate and independent upper drive.','working',side]]),
  f(2,[['1','Steep stack tray and downstream feed path in the machine.','machine',iso]]),
  f(3,[['2','Upper and lower surfaces are independently driven. The upper retard roller can turn either way at the sheet contact.','working',side]]),
  f(4,[['3','Front view of the gate roller, brackets and adjustable height.','gate',end]]),
  f(5,[['4','Gate height screw and retard roller in side elevation.','gate',side]]),
  f(6,[['5','Exploded height adjuster and gate assembly.','exploded',iso]])),

  US7654522B2: record('Ultrasonic overlap detector with guided sheet path',(g,state)=>{
    const double=state==='double'||state==='graph';
    const close=['single','double','graph','rollers','opposed','coax'].includes(state);
    const point=state==='before'?-1.2:state==='after'?1.23:state==='branch'?.78:.10;
    const upper=state==='opposed'||state==='coax'?0:.24;
    const guideZ=1.03;
    if(!close) {
      tray(g,{y:-2.68,z:.20,width:5.45,length:4.21,wall:.64});
      pile(g,{y:-2.72,z:.44,length:3.90,height:.52});
      roller(g,'drive',-1.34,1.20,.26,4.37);
      roller(g,'spring',-.66,.79,.27,4.65);
      if(state==='machine') {
        g.frame('base',0,.69,-.38,6.14,10.17,.61,.26);
        g.box('base',0,2.30,.20,5.75,2.88,3.51);
        roller(g,'support',2.02,3.49,.40,5.35);
      }
    }
    const sheets=double?2:1;
    for(let i=0;i<sheets;i++) film(g,[[-3.34,guideZ+i*.052],[0,guideZ+i*.052],[1.64,guideZ+i*.057],[3.54,guideZ+i*.056]],4.57,'paper');
    if(state!=='single' && state!=='double'){
      for(const y of [point-.47,point+.48]){
        for(const x of [-1.48,1.48]){
          roller(g,'steel',y,guideZ-.26,.26,.83,x);
          roller(g,'spring',y,guideZ+.26,.26,.83,x);
        }
      }
      g.box('support',0,point+1.38,.54,4.80,2.20,.11);
    }
    const a=[0,point-.25,.61], b=[0,point+upper,1.47];
    g.cylinder('moving',a,[0,point-.30,.38],.23);
    g.cylinder('moving',b,[0,point+upper+.05,1.70],.23);
    g.sweep('air',a,b,double?.09:.14);
    if(state==='branch') g.sweep('support',[-2.06,point+.71,.98],[2.06,point+.49,1.29],.17,.12);
  },f(1,[['3 cover','Cover illustration of the inclined ultrasonic beam across the feeding path.','single',side]]),
  f(2,[['1','The document feeder sits above the rest of the image-forming machine.','machine',side]]),
  f(3,[['2','Side view of pickup, separation, detector and downstream reading path.','working',side]]),
  f(4,[['3','A single sheet crosses the beam between transmitter and receiver.','single',side],
    ['4','Two overlapping sheets put an extra interface and air layer across the beam.','double',side],
    ['5','Attenuation graph for successive sheet counts. This view shows the physical measurement through two sheets.','graph',detail]]),
  f(5,[['6','Roller pairs flank the sensing region and constrain sheet motion there.','rollers',plan],
    ['7','Alternative location of the sensing modules relative to the rollers.','opposed',plan]]),
  f(6,[['8','Detector position in a first modified automatic feeder.','before',side]]),
  f(7,[['9','Detector placement in another section of the feeder.','after',side]]),
  f(8,[['10','A further layout changes how the detector sits beside the sheet path.','branch',side]]),
  f(9,[['11','Enlarged view of the arrangement with opposed modules across the guide.','coax',plan]])),

  US7819396B2: record('Vacuum shuttle with indexing edge retard',(g,state)=>{
    const beltVersion=!['roller','roller-detail','roller-drive'].includes(state);
    const high=state==='loaded'||state==='cross';
    const camZ=.72;
    const y=beltVersion?1.70:1.87;
    if(!['free','loaded','cross','roller-detail'].includes(state)) {
      tray(g,{y:-.67,width:5.60,length:5.52,wall:.72});
      const z=pile(g,{y:-.59,length:5.05,height:.87});
      const pick=state==='driver'?1.95:state==='reset'?-.38:.55;
      g.box('moving',0,pick,z+.22,4.71,2.26,.31);
      for(const x of [-1.59,-.52,.52,1.59]) shaft(g,x,pick,z+.14,.074,.16,'air');
      film(g,[[-3.09,z],[-.86,z],[pick+.35,z+.18],[pick+1.11,z+.18],[3.36,z+.22]],4.48,'paper');
      if(state==='driver'){
        g.box('drive',2.69,-1.67,1.49,.72,.76,.63);
        g.sweep('moving',[2.67,-1.30,1.76],[2.27,1.48,1.15],.23);
      }
    }
    if(beltVersion) {
      const top=high?1.12:.93;
      const yr=y+(high?-.10:.10);
      for(const x of [-1.46,1.46]){
        roller(g,'moving',yr,top,.28,.50,x);
        roller(g,'steel',yr+.29,.24,.24,.50,x);
        g.around('x',[x,yr+.17,.56],high?14:28,()=>{
          g.box('support',x,yr+.16,.34,.37,.36,.63);
        });
        g.ribbon('dark',[[x,yr-.28,top],[x,yr+.07,.19],[x,yr+.29,0],
          [x,yr+.53,.24],[x,yr+.27,top],[x,yr,top+.28],[x,yr-.28,top]],.49);
        g.spring('spring',[x,yr+.34,.30],[x,yr+.34,high?.67:.91],.13);
        if(state==='cross') gear(g,x,yr+.21,.48,.32,.19);
      }
      if(state==='free'||high) {
        roller(g,'drive',y+.43,camZ,.17,4.33);
        g.cylinder('moving',[1.79,y+.41,camZ+.10],[2.12,y+.41,camZ+.10],.31);
      }
    } else {
      roller(g,'spring',y,.93,.47,4.44);
      roller(g,'steel',y,.93,.14,5.13);
      for(const x of [-2.28,2.28]){
        g.box('support',x,y+.12,.33,.25,.66,1.06);
        g.spring('spring',[x,y+.12,.27],[x,y+.12,.67],.13);
        if(state==='roller-drive') gear(g,x,y+.68,.59,.38,.19);
      }
    }
  },f(1,[['4 cover','Cover figure of the one-way rotating retard design.','roller-drive',side],
    ['5 cover','Cover drawing of the alternative edge-retard belt and vacuum shuttle.','driver',side]]),
  f(2,[['1','A retard roller contacts the exit edge while the vacuum head takes the top sheet.','roller',side]]),
  f(3,[['2','End profile of the retard roller and sprung side plates.','roller-detail',side],
    ['3','Cross section across the support and one-way clutch.','roller-detail',end]]),
  f(4,[['4','Driven retard roller, shaft and indexing configuration.','roller-drive',side],
    ['5','Alternative uses an angled belt against the edge of the pile.','working',side]]),
  f(5,[['6','During reset the spring is relaxed and the carrier pressure is low.','free',side],
    ['7','The cam compresses the spring for higher force against the edge during extraction.','loaded',side]]),
  f(6,[['8','The cross section shows the drive between the belts and one-way gear.','cross',end],
    ['9','The shuttle and motor-driven retard assembly in perspective.','driver',iso]])),

  EP1721846B1: record('Spring-set pad with two friction regions',(g,state)=>{
    const loaded=['second','feed'].includes(state);
    const exploded=state==='exploded';
    const active=state==='feed'||state==='initial';
    const gap=exploded?.73:0;
    const offset=loaded?.42:0;
    const lip=[[.41,.44],[.76,.63],[.98,1.02],[1.32,1.17]];
    for(const x of [-2.10,2.10]) {
      g.track('support',[[x,-2.06,.35],[x,.35,.35],[x,.71,.57],[x,.98,1.17],[x,1.69,1.28]],.31,.23);
      g.sweep('steel',[x,1.29,.23],[x,1.78,.96],.15,.17);
      g.spring('spring',[x,1.24+offset,.36+gap],[x,1.90,.66+gap],.17);
    }
    g.track('support',lip.map(([y,z])=>[0,y,z]),3.92,.16);
    g.track('spring',[[0,.57+offset,.54+gap],[0,.86+offset,.77+gap],[0,1.035+offset,1.06+gap]],3.62,.12);
    g.box('moving',0,1.14+offset,1.062+gap,3.62,.31,.12);
    if(loaded||exploded) g.box('steel',0,.88+offset,.98+gap,3.62,.28,.085);
    if(active) {
      tray(g,{y:-2.15,length:4.49,width:5.12,wall:.47});
      const z=pile(g,{y:-2.22,length:4.22,height:.57});
      roller(g,'drive',.39,1.40,.49,4.32);
      film(g,[[-4.25,z],[-1.49,z],[-.27,.91],[.43,.903],[.82,.99],[1.27,1.17],
        [loaded?2.31:1.47,loaded?1.26:1.18]],4.46,'paper');
    }
  },f(14,[['1','The bracket shields the low-friction region in the first position.','working',iso],
    ['2','As the pad slides, both friction regions become exposed.','second',iso]]),
  f(15,[['3','Exploded support, sliding pad and return springs.','exploded',iso]]),
  f(16,[['4','The assembled guides hold the pad against two lateral springs.','second',[-151,50,1]]]),
  f(17,[['5','End view with the pad displaced to its second position.','second',side],
    ['6','Section with the pad back in its initial position.','working',side]]),
  f(18,[['7','The top sheet meets the high-friction region first.','initial',side],
    ['8','The sheet carries the pad forward and bridges the two contact regions.','feed',side]])),

  US20230202784A1: record('Two-stage upstream air jets and reverse-retard nip',(g,state)=>{
    const cover=state==='overview';
    const jetOnly=state==='shutter';
    const old=state.startsWith('compare');
    const first=['first','both'].includes(state);
    const next=['second','both'].includes(state);
    const display=state==='distributor';
    const nipY=1.79,nipZ=1.13;
    const y1=1.08,y2=2.37;
    const xPositions=[-1.92,-.97,0,.97,1.92];
    if(jetOnly){
      g.box('support',0,0,.17,4.98,.59,.23);
      for(const x of xPositions) {
        g.box('air',x,.21,.33,.24,.24,.096);
        g.box('moving',x+.13,-.025,.385,.43,.27,.081);
      }
      g.cylinder('steel',[-2.68,-.02,.44],[2.68,-.02,.44],.079);
      g.box('drive',2.50,-.02,.32,.59,.48,.35);
      return;
    }
    if(!display) {
      tray(g,{y:-2.12,width:5.28,length:4.55,wall:.83});
      const top=pile(g,{y:-2.12,width:4.83,length:4.24,height:.68});
      roller(g,'moving',-.63,top+.34,.34,2.06);
      roller(g,'support',-.63,top+.34,.12,4.61);
      film(g,[[-4.24,top],[-1.34,top],[-.63,top],[.02,top+.055],[y1,nipZ-.013],[nipY,nipZ],[2.79,nipZ],[3.84,nipZ]],4.68,'paper');
      const lowerLead=state==='initial'?1.55:state==='first'?.76:state==='second'?1.81:state==='both'?.54:1.12;
      const lowerZ=old?.968:top-.016;
      if(state!=='working'&&state!=='machine'&&!cover){
        film(g,[[-3.24,top-.047],[.19,lowerZ],[lowerLead,nipZ-(first?.22:.091)]],4.64,'paper');
      }
    }
    roller(g,'drive',nipY,nipZ+.49,.49,4.78);
    roller(g,'spring',nipY,nipZ-.48,.48,4.55);
    g.cylinder('drive',[2.31,nipY,nipZ-.48],[2.88,nipY,nipZ-.48],.20,.09);
    g.spring('spring',[2.29,1.81,.12],[2.29,1.81,.53],.14);
    for(const yy of old?[y2]:[y1,y2]){
      g.box('support',0,yy,nipZ-.39,4.92,.33,.30);
      for(const x of xPositions){
        g.box('air',x,yy-.16,nipZ-.08,.24,.19,.10);
        const active=(yy===y1&&first)||(yy===y2&&(next||state==='compare-air'));
        if(active) jet(g,[x,yy-.24,nipZ-.028],[x,yy-.89,nipZ-.094],.105);
      }
    }
    if(!old){
      g.track('air',[[2.36,y1,nipZ-.31],[2.57,y1,nipZ-.49],[2.57,y2,nipZ-.49],[2.35,y2,nipZ-.31]],.16);
      g.box('moving',2.46,y2,nipZ-.19,.41,.43,.14);
    }
    if(cover||state==='machine') {
      g.frame('base',0,0,-.32,6.31,9.32,.31,.48);
      for(const y of [-1.32,.10,1.42,2.68]) roller(g,'support',y,2.64,.52,4.65);
      if(state==='machine') g.box('dark',0,.61,3.45,5.39,6.85,.53);
    }
  },f(1,[['2A cover','Cover section through the roller and pneumatic separation system.','working',side]]),
  f(2,[['1A','The sheet feeder supplies the image-forming machine from below its transfer mechanism.','machine',side]]),
  f(3,[['1B','Schematic of the transfer and fixing path. The scene shows the corresponding upper transport.','overview',iso]]),
  f(4,[['2A','The pickup roller advances the stack surface into the conveying and reverse-retard pair.','working',canonSection],
    ['2B','With the upper cover removed, both rows of outlets and the separator area are visible.','working',iso]]),
  f(5,[['2C','Enlarged view of both rows of air outlets around the separator.','distributor',iso],
    ['2D','The movable shield opens or closes the downstream row.','shutter',iso]]),
  f(6,[['3A-A','Initial condition with air off at both port groups.','initial',canonSection],
    ['3A-B','Overlapped sheet edges before any air is blown.','initial',[-86,17,1.08,[0,1.28,1.12,1.43]]]]),
  f(7,[['3B-A','The upstream outlets are open and the downstream set remains shut.','first',canonSection],
    ['3B-B','Detail of the first separation at the upper sheet edge.','first',[-86,17,1.08,[0,1.17,1.02,1.48]]]]),
  f(8,[['3C-A','The downstream outlets blow back toward the nip while the first set is closed.','second',canonSection],
    ['3C-B','Detail of the corresponding edge contact downstream of the first outlets.','second',[-86,17,1.08,[0,1.63,1.08,1.48]]]]),
  f(9,[['3D-A','Both groups blow upstream, one group at each location.','both',canonSection],
    ['3D-B','The two air stages act on overlapping edges while the separator draws one sheet forward.','both',[-86,17,1.08,[0,1.49,1.05,1.48]]]]),
  f(10,[['4','Comparative feeder with a single blowing region.','compare',side]]),
  f(11,[['5A','The comparative feeder before applying air.','compare',side],
    ['5B','The comparative single jet blowing at the overlapped margin.','compare-air',side]])),
};
