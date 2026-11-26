import { f, record, sheet, roller, shaft, end, side, iso, plan, detail, pile, tray, film, gear, jet } from './shared.js';

function notchedSheet(g,z,offset) {
  const w=5.3, d=4.18;
  g.box('film',0,0,z,w,d,.026);
  for(const direction of [-1,1]) {
    let edge=-w/2;
    for(const notch of [-1.78,-.62,.54,1.70].map(x=>x+offset)) {
      g.box('film',(edge+notch)/2,direction*(d/2+.125),z,notch-edge,.25,.026);
      edge=notch+.27;
    }
    g.box('film',(edge+w/2)/2,direction*(d/2+.125),z,w/2-edge,.25,.026);
  }
}

export const models = {
  US571470A: record('Clarke alternating-notch film pack', (g,state) => {
    if(state==='pack') {
      for(let i=0;i<9;i++) notchedSheet(g,i*.079,i%2===0?0:.37);
    } else notchedSheet(g,0,state==='even'?.37:0);
  },f(1,[
    ['1','Odd-numbered film sheet with the first pattern of opposite-edge notches.','odd',plan],
    ['2','Even-numbered film sheet with the second, offset pattern.','even',plan],
    ['3','Alternating the two patterns leaves a projection immediately behind each exposed notch. Selector stops go into the gaps to support the next sheet.','pack',iso],
  ])),

  US735746A: record('Plate rack, tipping holder and catch tray', (g,state) => {
    const plate=(y,angle=0)=>g.around('x',[0,y,1.13],angle,()=>{
      g.box('support',0,y,1.13,4.53,.17,3.41);
      g.box('glass',0,y+.11,1.27,4.29,.11,3.09);
      g.box('steel',0,y+.24,1.13,4.70,.39,.18);
      for(const x of [-2.36,2.36]) g.box('moving',x,y+.46,1.14,.31,.67,.16);
    });
    if(state==='holder') { plate(0); return; }
    if(state==='tray' || state==='rack') {
      g.box('base',0,1.51,0,5.75,3.3,.20);
      for(const x of [-2.56,2.56]) {
        for(const y of [.50,.91]) g.box('support',x,y,.21,.18,.15,1.0);
      }
    }
    if(state==='tray') return;
    for(const x of [-2.56,2.56]) {
      g.box('support',x,-1.33,.91,.38,4.30,.22);
      g.sweep('moving',[x,.29,1.17],[x,.81,1.02],.30,.13);
    }
    if(state==='guide') {g.box('base',-2.83,-.84,.21,.14,5.08,4.48);return;}
    for(const y of [-2.88,-2.24,-1.60,-.96]) plate(y);
    plate(-.28,-24);
  },f(1,[
    ['1','As the leading holder tips, the tabs leave the side ledges at the inclined lugs and enter the catches.','rack',side],
    ['2','Side guide plate with its support ledge and terminal lug.','guide',iso],
    ['3','A holder has a lower flange and tabs that carry the plate and engage the rack.','holder',detail],
    ['4','The removable exposed-plate tray has receiving guides on both sides.','tray',iso],
  ])),

  US758453A: record('Lagerman tilting suction mouthpiece', (g,state) => {
    const angle={flat:0,angled:17,steep:31,valve:0}[state];
    const pivotY=1.67;
    tray(g,{length:5.4,wall:.49});
    const stock=pile(g,{length:5.18});
    for(const x of [-1.54,1.54]) {
      g.around('x',[0,pivotY,stock],angle,()=>{
        g.box('moving',x,pivotY+.27,stock,.63,.88,.15);
        shaft(g,x,pivotY+.27,stock+.16,.10,.65,'steel');
      });
      g.cylinder('steel',[x-.43,pivotY,stock+.26],[x+.43,pivotY,stock+.26],.11);
      g.track('air',[[x,pivotY+.28,stock+.57],[x,2.48,stock+1.34],[x,1.89,stock+2.04],[0,1.15,stock+2.1]],.11);
    }
    const rise=Math.tan(angle*Math.PI/180);
    film(g,[[-2.60,stock],[.89,stock],[1.67,stock],[2.16,stock+.49*rise],
      [2.59,stock+.49*rise]],4.46,'paper');
    if(state==='flat' || state==='valve') {
      const tops=[[.0,2.4],[1.78,3.56],[1.78,3.38],[.0,2.22]];
      g.solid('spring',tops.map(([y,z])=>[-1.08,y,z]),tops.map(([y,z])=>[1.08,y,z]));
      for(let i=0;i<5;i++) g.sweep('spring',[-1.09,.32+i*.27,2.62+i*.183],[1.09,.32+i*.27,2.62+i*.183],.09);
      g.spring('spring',[.0,.42,1.55],[.0,.42,2.57],.17);
      g.cylinder('support',[0,.81,3.38],[0,1.64,3.38],.19,.10);
    }
  },f(1,[
    ['1','The flat face lies parallel to stiffer material. Bellows and tubing supply the adjustable mouthpieces.','flat',iso],
    ['2','The inclined face lifts the captured edge away from the next sheet.','angled',side],
    ['3','The second inclination increases the curl at the exposed edge.','steep',side],
    ['4','Side view of the suction assembly and its valve housing.','valve',end],
  ])),

  US1646681A: record('Carlton suction carriage with timed air blast', (g,state) => {
    const close=['acquire','nozzles','blower'].includes(state);
    const y=close?1.65:state==='handoff'?2.55:.94;
    for(const x of [-2.73,2.73]) {
      g.box('base',x,0,0,.30,7.13,1.48);
      g.cylinder('steel',[x,-2.95,2.30],[x,3.16,2.30],.12);
    }
    g.box('support',0,0,.39,4.96,5.34,.26);
    const top=pile(g,{z:.65, length:4.95,height:.67});
    g.box('moving',0,y,2.14,5.43,.49,.25);
    for(const x of [-2.39,2.39]) {
      g.box('moving',x,y+.27,1.78,.35,1.22,.42);
      g.track('steel',[[x,y-.24,1.99],[x,y+.14,1.83],[x,y+1.14,1.83]],.11);
    }
    const z=close?top:top+.47;
    for(const x of [-1.67,1.67]) {
      g.cylinder('steel',[x,y,z+.14],[x,y,2.14],.11);
      g.box('moving',x,y,z,.46,.34,.14);
      g.cylinder('air',[x,y,2.24],[x,y,2.50],.08);
    }
    if(close || state==='handoff') film(g,[[-2.43,top],[.6,top],[y,z],[2.78,z+.08]],4.50,'paper');
    g.around('x',[0,2.69,1.10],close?-22:10,()=>{
      roller(g,'air',2.69,1.10,.16,4.89);
      for(const x of [-1.8,-.9,0,.9,1.8]) {
        g.box('support',x,2.52,1.13,.17,.40,.13);
        if(close) jet(g,[x,2.38,1.18],[x,1.83,1.35]);
      }
    });
    for(const z of [1.42,1.87]) roller(g,'drive',3.23,z,.21,4.9);
    if(state==='elevator' || state==='working') {
      shaft(g,0,-.49,-.27,.19,.99);
      g.spring('spring',[0,-.49,-.31],[0,-.49,.32],.22);
    }
    if(state==='valve') g.cylinder('air',[2.65,-1.15,1.92],[3.46,-1.15,1.92],.23,.11);
  },f(1,[
    ['1','The stack lift, suction carriage and delivery rolls share the machine frame.','working',side],
    ['2','End view of the carriage and nozzle spacing.','acquire',end],
    ['8','The blower manifold turns its outlets toward the leading edges during acquisition.','blower',detail],
    ['9','The timed vacuum valve releases the sheet when the host rollers take it.','valve',iso],
  ]),f(2,[['3','The pickup carriage moves along the feed direction between its two side guides.','handoff',plan]]),
  f(3,[['4','Section through the pickup carriage, feed region and table lift.','elevator',side],
    ['5','Detached portion of the guided nozzle carriage.','working',iso],
    ['6','One end of the nozzle bracket shows how the nozzles travel with it.','nozzles',detail],
    ['7','Feed linkage moves the carriage sections relative to each other.','handoff',iso]])),

  US2423404A: record('Pollack stepped plate dispenser', (g,state) => {
    const frame=(y,z)=>{
      g.frame('steel',0,y,z,4.39,3.17,.18,.24);
      g.box('glass',0,y,z+.018,3.95,2.73,.14);
    };
    if(state==='plate') { frame(0,.03); return; }
    const step=['stroke','onward'].includes(state);
    g.box('base',0,1.55,0,6.12,9.85,.27);
    for(const x of [-2.23,2.23]) {
      g.box('support',x,1.55,.27,.42,9.61,.53);
      g.sweep('steel',[x*.915,-3.24,.772],[x*.915,6.31,.772],.15,.11);
    }
    const y=state==='onward'?2.74:step?.48:-1.61;
    g.box('moving',0,y,.33,2.87,3.62,.32);
    g.box('moving',0,y-1.68,.64,2.85,.22,.22);
    g.box('moving',0,y+1.22,.64,2.85,.22,.19);
    for(let i=0;i<6;i++) frame(-1.5,.81+i*.22+(step?.22:0));
    if(step) frame(y+.16,.81);
    if(state==='onward') frame(4.61,.81);
    if(state==='machine') {
      for(const [p,c] of [[-1.47,'support'],[1.8,'dark'],[4.90,'support']]) {
        for(const x of [-2.51,2.51]) g.box(c,x,p,.79,.19,2.99,2.8);
      }
    }
  },f(1,[
    ['1','Feed rails run through the supply magazine, exposure region and receiving chamber.','machine',side],
    ['2','Plan view of the guide, stack and reciprocating member.','station',plan],
    ['3','The stepped member is beneath the stack and catches the lowest frame.','station',side],
    ['4','Section across the independent slide and plate supports.','station',end],
    ['5','The bottom frame has advanced along the plate rails.','stroke',side],
    ['6','The pusher and the plate bear against separate guide surfaces.','onward',end],
    ['7','The photosensitive plate sits in its individual low frame.','plate',iso],
    ['8','Section through the frame lip and the supported plate.','plate',end],
  ])),

  US3469834A: record('Stationary curved retard and moving separator belt', (g,state) => {
    const relay=state==='control' || state==='registration';
    const service=state==='service';
    const detailOnly=state==='retard' || state==='cut';
    const cy=.93,cz=.93,r=.57;
    if(!detailOnly) {
      tray(g,{y:-1.42,length:4.94,wall:1.02});
      pile(g,{y:-1.44,length:4.65});
      roller(g,'drive',.12,1.30,.31,4.58);
      for(const y of [2.19,3.28]) roller(g,'moving',y,.78,.23,4.67);
    }
    roller(g,'support',cy,cz-(service?.31:0),r,4.92);
    roller(g,'steel',cy,cz-(service?.31:0),.12,5.55);
    roller(g,'drive',2.05,1.63,.38,4.55);
    roller(g,'drive',-.11,1.86,.30,4.55);
    const tangent=g.arc([0,cy,cz],r+.027,130,40,20);
    g.ribbon('dark',[[0,-.31,2.00],[0,-.11,1.57],...tangent,[0,2.13,1.24],[0,2.42,1.6],[0,2.05,2.01],[0,-.31,2.00]],4.33);
    if(!detailOnly) {
      film(g,[[-3.62,1.005],[-.76,1.005],[.27,1.34],...tangent.map(([,y,z])=>[y,z-.018]),[2.13,1.03],[3.91,1.03]],4.31,'paper');
      g.box('support',0,2.74,.57,5.47,2.82,.24);
    }
    if(relay || state==='detect') {
      roller(g,'moving',2.57,1.18,.15,4.65);
      g.box('dark',2.41,2.59,1.43,.51,.69,.41);
      g.sweep('spring',[2.39,2.00,1.08],[2.39,2.58,1.40],.13);
    }
    if(state==='machine') {
      g.box('base',0,0,-.89,5.8,8.4,.93);
      g.frame('base',0,1.87,2.0,5.8,4.01,.46,.37);
    }
  },f(1,[['1','The feed console and the path into the copying machine.','machine',iso]]),
  f(2,[['2','The hopper, feed belt and outfeed in perspective.','working',iso]]),
  f(3,[['3','The slow nudger delivers the sheet into the arc between the driven belt and stationary retard surface.','working',side]]),
  f(4,[['4','Plan shows belt and support across the document width.','working',plan]]),
  f(5,[['5','Side elevation of the belt drive and retractable separator.','service',side]]),
  f(6,[['6','A thickness-sensitive linkage can stop the feeder on a malfunction.','detect',detail],
    ['7','The stationary retard member and its shaft sit below the belt.','retard',plan],
    ['8','Section across the retard member and adjacent belt wrap.','cut',side]]),
  f(7,[['9','The downstream registration gate sets the lead edge for copying.','registration',end]]),
  f(8,[['10','The control circuit coordinates feeding, registration and sensing. The model shows the controlled transport.','control',iso]])),

  US3650751A: record('Paired-sheet film pack and coupling leaders', (g,state) => {
    if(state.startsWith('leader')){
      const w=5.3,l=7.0;
      g.box('paper',0,-2.30,.10,w,2.32,.053);
      g.box('paper',0,2.54,.10,w,1.89,.053);
      g.sweep('paper',[0,-1.14,.127],[0,1.60,.127],state==='leader-mask'?1.1:1.45,.054);
      if(state!=='leader-mask'){
        g.sweep('moving',[-.73,-.52,.18],[.73,state==='leader-angled'?.04:-.52,.18],.14,.12);
        for(let i=0;i<6;i++) g.box('dark',-.6+i*.24,.53,.16,.083,.056,.024);
      }
      g.frame('support',0,0,0,w+.55,l+.38,.09,.16);
      return;
    }
    g.frame('base',0,-.20,0,5.74,7.87,1.93,.21);
    pile(g,{y:-.11,z:.29,width:4.93,length:6.53,height:.34,part:'paper'});
    pile(g,{y:-.11,z:1.22,width:4.93,length:6.53,height:.32,part:'film'});
    g.box('spring',0,-.02,1.01,5.07,6.46,.104);
    for(const x of [-1.62,1.62]) g.spring('spring',[x,0,.65],[x,0,1.01],.12);
    film(g,[[-3.36,1.54],[-.15,1.54],[2.65,1.53],[3.73,1.20],[4.53,.86],[4.96,.86]],4.91);
    film(g,[[-3.36,.64],[-.15,.64],[2.65,.64],[3.73,.73],[4.53,.845],[4.96,.845]],4.91,'paper');
    for(const z of [.60,1.10]) roller(g,'drive',4.33,z,.24,5.29);
  },f(1,[['1 cover','The cover repeats the section through the two compartments and pressure rolls.','working',side]]),
  f(2,[['1','The photosensitive and receiving sheets follow separate paths to the shared roll nip.','working',side]]),
  f(3,[['2','A coupling strip draws the next leader and its associated sheets into position.','leader',plan],
    ['3','Mask and leader before they are pulled from the pack.','leader-mask',plan]]),
  f(4,[['4','An oblique bead initiates a progressive tear across the coupling strip.','leader-angled',plan],
    ['5','The alternate coupling strip links the two successive leaders.','leader-alt',detail]])),

  US3955092A: record('Bottom-film claw and curved exit slot', (g,state) => {
    tray(g,{width:5.9,length:6.18,wall:1.42});
    g.box('support',0,-.81,1.50,5.12,4.15,.23);
    pile(g,{y:-.23,z:.35,width:5.01,length:5.25,height:.75,part:'film'});
    for(const x of [-1.45,1.45]) g.spring('spring',[x,.31,1.10],[x,.31,1.50],.124);
    g.box('moving',0,-2.34,.24,3.62,1.06,.12);
    g.box('moving',0,-2.75,.33,3.36,.21,.071);
    film(g,[[-2.78,.38],[1.62,.38],[2.31,.42],[2.71,.72],[3.05,.94],[3.71,.98]],4.98);
    g.sweep('support',[-2.78,2.52,.45],[2.78,2.52,.45],.25,.33);
    for(const z of [.73,1.24]) roller(g,'steel',3.15,z,.24,5.63);
    if(state==='case') g.box('base',0,0,1.88,5.86,6.18,.18);
  },f(1,[['drawing cover','Cover illustration of the pusher and roller exit in the cassette.','case',iso]]),
  f(2,[['drawing','In this cutaway the low claw moves the bottom sheet into the bend at the discharge wall. Slot rollers guide it toward the handoff.','working',iso]])),
};
