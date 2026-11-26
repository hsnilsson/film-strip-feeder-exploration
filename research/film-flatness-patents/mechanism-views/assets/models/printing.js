import { figures as f, record, sheet, roller, shaft, bow, iso, plan, end, side, detail } from './geometry.js';

const roll = (g, color, y, z, r, w) => {
  roller(g,color,y,z,r,w);
  roller(g,'steel',y,z,r+.035,.13,w/2);
  roller(g,'steel',y,z,r+.035,.13,-w/2);
};

export const models = {
  US2227987A: record('Tuttle and Bredemann projection printer', (g, state) => {
    const paper = state === 'paper' || state === 'perforator' || state === 'shutter';
    const drive = ['drive','clutch','cam','electrical'].includes(state);
    if (paper) {
      g.frame('base',0,0,0,6.75,6.7,.37,.38);
      roll(g,'paper',-2.61,1.44,1.06,5.12);
      roll(g,'drive',0,1.40,1.30,5.20);
      roll(g,'paper',2.73,1.47,.82,5.12);
      g.ribbon('paper',[[0,-2.8,2.49],[0,-1.62,2.13],...g.arc([0,0,1.40],1.31,146,34),[0,2.72,2.31]],4.9);
      if (state === 'perforator') {
        g.box('moving',0,-.72,2.90,5.6,.43,.35);
        for (let x=-2.4;x<2.5;x+=.43) shaft(g,x,-.72,2.61,.065,.33,'drive');
      }
      if (state === 'shutter') {
        for (const y of [-.50,.50]) g.box('moving',0,y,3.05,4.95,.72,.19);
      }
      return;
    }
    if (drive) {
      g.box('base',0,0,0,6.55,4.05,.33);
      for (const y of [-1.34,0,1.10]) {
        roller(g,'steel',y,1.12,.15,6.12);
        for (const x of [-1.95,.88,2.02]) {
          const r = y === 0 ? .75 : .45;
          roller(g,y === 0?'drive':'dark',y,1.13,r,.40,x);
        }
      }
      const x = state === 'clutch' ? 2.52 : .88;
      roller(g,'moving',-.21,1.52,.67,.31,x);
      roller(g,'steel',.05,2.18,.19,.27,x);
      g.track('moving',[[x,.05,2.18],[x,1.62,2.18],[x,1.84,1.45]],.16);
      return;
    }
    g.frame('base',0,0,0,6,8.85,.43,.45);
    for (const y of [-3.40,3.40]) roll(g,'film',y,1.16,1.08,2.21);
    roller(g,'spring',-1.63,1.10,.53,2.28);
    roller(g,'drive',1.66,1.13,.52,2.28);
    g.frame('support',0,0,.46,3.38,2.57,.29,.52);
    g.ribbon('film',[[0,-3.40,2.25],[0,-1.65,1.64],[0,-1.24,.755],[0,1.24,.755],[0,1.63,1.65],[0,3.40,2.25]],2.01);
    for (const x of [-1.06,1.06]) g.box('moving',x,0,.78,.24,2.68,.17);
    g.spring('spring',[1.34,-1.63,1.09],[2.20,-1.81,1.53],.14);
    if (state === 'machine' || state === 'lamp') {
      for (const y of [-.70,.70]) {
        shaft(g,0,y,1.54,.36,1.08,'glass');
        g.box('light',0,y,2.65,1.06,.78,.64);
      }
      if (state === 'machine') {
        g.box('support',0,0,3.11,5.2,5.90,.24);
        g.box('dark',-2.50,.72,.42,.45,4.52,2.8);
      }
    }
  }, f(1,[['1','The apparatus combines negative feed, illumination, transport drive and paper feed.','machine'],['27','Short groups of negatives are spliced into a continuous strip. The model shows the transport for that strip.','working',plan]]),
  f(2,[['2','Section through lamps and the gate-opening region.','lamp',side],['3','The lamp and photoelectric housings in plan.','lamp',plan]]),
  f(3,[['4','The drive, shutter and control shafts lie behind the side plate.','drive',side],['16','Cam profile controlling the lamp resistances.','cam',side],['17','Upper end of the resistance mechanism.','drive',detail],['18','Gate end with removable film-clamping members.','working',end]]),
  f(4,[['5','Paper feed and perforating mechanisms at the right end.','paper',side]]),
  f(5,[['6','Plan of the control mechanism and its shafts.','drive',plan],['7','Elevation of the same control shafts.','drive',side],['8','One clutch on the control shaft.','clutch',end],['9','A second clutch shown end-on.','clutch',side]]),
  f(6,[['10','Film transport with the yielding sprocket between the supply and gate.','working',plan],['11','Vertical section through the gate and drive.','working',end],['12','The second transport section.','working',side],['13','Film supply reel mounting.','working',detail]]),
  f(7,[['14','Cam and resistance-control linkages.','drive',side],['15','Section through resistance switching.','cam',end]]),
  f(8,[['19','Paper support drum and reel spindles.','paper',end],['28','Layout of the exposed paper web with trimming and identifying perforations.','paper',plan]]),
  f(9,[['20','Section across the upper paper-feed unit.','paper',plan],['21','The perforating unit sits over the paper-advance drum.','perforator',end],['22','The perforator and its cam drive in elevation.','perforator',side],['23','Paper meets the shutter and support drum in section.','shutter',side]]),
  f(10,[['24','Paper gate and the framing advance.','shutter',end],['25','Wiring diagram. The model locates the controlled drive train.','electrical',iso]]),
  f(11,[['26','Timing chart. The complementary view locates the mechanically timed shafts and cams.','cam',iso]])),
  US2248646A: record('Small bowed-spring film tensioner', (g, state) => {
    const open = state.endsWith('open');
    const alt = state.startsWith('lever') || state.startsWith('slide');
    g.frame('base',0,0,0,6.4,6.8,.36,.72);
    g.frame('support',0,0,.36,5.44,5.12,.11,.45);
    sheet(g,'film',0,0,.476,4.35,7.31);
    for (const s of [-1,1]) {
      const x=s*(open ? 1.80 : 1.96);
      g.box('moving',x,0,open?.75:.478,.35,3.83,.17);
      if (alt) {
        g.track('spring',[[x,-1.87,.73],[x,-.92,open?1.4:1.05],[x,0,open?1.65:1.13],[x,1.86,.73]],.14);
        g.sweep('moving',[x,-.5,.99],[x,-2.6,1.53],.15,.22);
      } else bow(g,'spring',x,1.86,.67,open?.85:.21,.22);
      g.spring('spring',[x,0,open?1.52:.89],[x,0,1.95],.16);
    }
    g.around('x',[0,-2.4,1.92],open?19:0,() => g.frame('moving',0,0,1.80,5.70,5.40,.17,.45));
    if (state === 'projector') {
      g.box('support',-3.1,0,0,.39,.58,4.5);
      shaft(g,0,0,2.0,.79,1.41,'dark');
    }
  }, f(1,[['I','Film-tensioning slide installed in the projection printer.','projector',side],['II','End elevation of the slide and projecting gate.','working',end],['III','Section through the removable slide in the projector.','projector',end]]),
  f(2,[['IV','Perspective of the carrier showing its opening and handle.','working',iso],['V','Longitudinal section through the carrier.','working',side],['VI','The bowed tensioning strips stand up in one slide condition.','bow-open',side],['VII','In the other condition the clamp presses the film.','working',side]]),
  f(3,[['VIII','Perspective of the alternative grip and operated bail.','lever-working'],['IX','With the bow springs flattened, the grippers bear on the film.','lever-working',side],['X','The bail retracts the gripping members.','lever-open',side]]),
  f(4,[['XI','End view of the further slide construction.','slide-working',end],['XII','Plan section exposes the grip linkage.','slide-working',plan],['XIII','Slide in its gripping position.','slide-working',side],['XIV','A released position of the same parts.','slide-open',side]])),
  US2357707A: record('Three-roller pressure pad', (g, state) => {
    const pad = state==='pad';
    if (!pad) {
      g.frame('base',0,0,0,5.6,6.2,.38,.70);
      sheet(g,'paper',0,0,.39,3.61,6.50);
      sheet(g,'film',0,0,.415,3.61,6.50);
    }
    for (const y of [-1.62,1.62]) roller(g,'moving',y,.76,.34,4.25);
    roller(g,'moving',0,.91,.24,4.10);
    for (const x of [-2.13,2.13]) {
      g.box('support',x,0,.76,.23,4.21,.65);
      g.spring('spring',[x,-.44,1.14],[x,-.44,1.85],.15);
      g.spring('spring',[x,.44,1.14],[x,.44,1.85],.15);
    }
    g.frame('steel',0,0,1.78,4.42,4.30,.17,.31);
  }, f(1,[['1','The pressure pad bears on two films at the camera gate.','working',side],['2','Three rollers and their support form the removable pad.','pad'],['3','Section through the pressure pad and exposure aperture.','working',end],['4','The unequal roller positions can be compared in plan.','pad',plan]])),
  US2741154A: record('Ludwig sprung negative carrier', (g, state) => {
    const raised = state==='open';
    const full = state==='machine' || state==='carrier';
    g.frame('base',0,0,0,6.32,5.46,.30,.78);
    sheet(g,'film',0,0,.31,4.94,4.02);
    g.around('x',[0,-2.45,.48],raised ? 54 : 0,() => g.frame('moving',0,0,.33,5.90,5.12,.29,.66));
    roller(g,'steel',-2.45,.48,.12,5.7);
    for (const x of state==='alternative' ? [-1.8,1.8] : [-2.1,-1.47,1.47,2.1]) {
      g.track('spring',[[x,-2.57,.62],[x,-2.22,.47],[x,-1.60,raised?.39:.315]],.104,.05);
    }
    if (full) {
      for (const x of [-3.3,3.3]) g.box('support',x,0,-.28,.25,7.32,.32);
      g.box('support',0,-3.45,-.28,6.83,.30,.32);
      if (state==='machine') {
        shaft(g,0,0,.93,1.14,1.62,'dark');
        g.box('base',0,0,-2.01,7.75,7.8,.27);
        g.box('support',-3.45,-2.87,-1.74,.34,.63,4.45);
      }
    }
  }, f(1,[['1','Side section of the enlarger and its negative carrier.','machine',side],['2','The holder slides as an assembly into the enlarger.','machine',end]]),
  f(2,[['3','The glassless holder forms a frame around the negative.','working',plan],['4','The open frame leaves a path for inserting the film.','open',side],['5','The resilient hinge grips the margin before full closure.','working',side],['6','Alternative resilient member.','alternative',plan],['7','The carrier guides the removable negative holder.','carrier',iso]])),
  US2964995A: record('Tondreau optical and contact printer', (g,state) => {
    const gate = state==='gate' || state==='pressure';
    const optical = state==='optical' || state==='matte' || state==='screen';
    if (!gate) {
      for (const y of [-4,4]) roll(g,'film',y,1.33,1.22,2.58);
      for (const y of [-2.49,2.49]) roller(g,'drive',y,1.07,.44,3.03);
      g.frame('base',0,0,0,6.52,9.4,.39,.43);
      g.ribbon('film',[[0,-4,2.55],[0,-2.40,1.45],[0,-1.55,.866],[0,1.55,.866],[0,2.40,1.45],[0,4,2.55]],2.41);
    } else sheet(g,'film',0,0,.866,2.55,4.73);
    g.frame('support',0,0,.39,4,3.33,.47,.63);
    for (const x of [-1.35,1.35]) {
      g.box('moving',x,0,.88,.41,2.84,.19);
      g.spring('spring',[x,-.75,1.08],[x,-.75,1.75],.18);
      shaft(g,x,-.75,1.05,.106,1.15,'steel');
    }
    if (state==='pressure' || optical) sheet(g,'paper',0,0,.881,2.32,2.98);
    if (state==='matte') sheet(g,'film',0,0,.900,2.20,2.88);
    if (optical) {
      for (const z of [1.64,2.53,3.63]) shaft(g,0,0,z,.62,.18,'glass');
      for (const x of [-.72,.72]) g.sweep('light',[x,0,.90],[.45*x,0,3.82],.065);
      if (state==='screen') g.box('paper',0,0,3.87,3.44,2.91,.085);
    }
    if (state==='drive') {
      for (const [y,r] of [[-1.07,.68],[0,.42],[.94,.49]]) {
        g.cylinder('drive',[2.34,y,1.02],[2.62,y,1.02],r,.14);
      }
      g.track('dark',[[2.49,-1.55,1.18],[2.49,-.45,1.64],[2.49,.95,1.56],[2.49,1.43,1.03]],.13);
    }
  }, f(1,[['1','Combination optical and contact printer with its feed and take-up.','working',side]]),
  f(2,[['2','Printer viewed end-on.','working',end],['3','Aperture adjustment seen at the projecting head.','gate',end],['6','Section through an adjustable optical support.','optical',side]]),
  f(3,[['4','Projection mechanism in elevation.','optical',side]]),f(4,[['5','Magnified projector mechanism and film path.','optical',iso]]),
  f(5,[['7','Section through the precision gate and pressure members.','gate',end]]),
  f(6,[['8','Aperture pressure adjustment on the film stack.','pressure',end],['8A','Section through the pressure adjustment and its spring.','pressure',detail],['9','Drive components along the base.','drive',side]]),
  f(7,[['10','Registration diagram. The model shows the related optical chain.','optical',iso],['11','Projection screen at the viewing end.','screen',plan]]),
  f(8,[['12','One printing arrangement uses a travelling matte and a film stack.','matte',end]])),
  US3007368A: record('Web transport with vacuum stop and loop storage', (g,state) => {
    const alt=state==='alternative';
    g.frame('base',0,0,0,7.65,9.1,.34,.46);
    for (const y of [-3.55,3.59]) roll(g,'film',y,3.05,1.00,4.34);
    const centers=alt ? [[-2.4,.99],[2.37,1.43]] : [[-2.17,1.17],[2.26,1.17]];
    for (const [y,z] of centers) {
      roller(g,'moving',y,z,.35,4.63);
      for (const x of [-2.47,2.47]) g.spring('spring',[x,y,z],[x,y,3.51],.14);
    }
    g.box('support',0,0,.38,5.33,2.52,.44);
    for (const x of [-1.26,0,1.26]) for (const y of [-.7,0,.7]) shaft(g,x,y,.815,.07,.014,'air');
    g.ribbon('film',[[0,-3.55,4.06],[0,-2.53,1.14],...g.arc([0,...centers[0]],.36,180,360,14),
      [0,-1.25,.829],[0,1.25,.829],...g.arc([0,...centers[1]],.36,180,360,14),[0,3.59,4.06]],4.22);
  }, f(1,[['1','The two spring-loaded loops absorb stock while vacuum holds a frame on the platen.','working',side],['2','The alternate loop arrangement has an altered moving roller position.','alternative',side]])),
  US3237543A: record('Portable duplex vacuum film holder', (g,state) => {
    g.frame('base',0,0,0,6.76,8.10,1.12,.40);
    if (state!=='section') {
      g.box('glass',0,0,1.12,5.96,7.3,.12);
      g.box('glass',0,0,-.13,5.96,7.3,.13);
    }
    for (let i=-2;i<=2;i++) {
      g.box('support',i,0,.29,.18,7.3,.53);
      for (let j=-2;j<=2;j++) shaft(g,i,j*1.08,.80,.079,.34,'air');
    }
    g.track('air',[[0,-2.8,.54],[2.65,-2.80,.54],[3.2,-2.34,.54],[3.78,-2.34,.54]],.18);
    if (state==='reverse') sheet(g,'film',0,0,-.145,5.56,6.93);
    else sheet(g,'film',0,0,1.244,5.56,6.93);
    g.box('moving',0,3.86,.89,4.92,.40,.24);
  }, f(1,[['1','First vacuum surface with a sheet in place.','working',plan],['2','The reverse side can hold a sheet over the same chamber.','reverse',[165,-57,1]],['3','End section through the two surfaces and evacuated chamber.','section',end],['4','Longitudinal section and shared vacuum path.','section',side],['5','Section at the retaining margin and ported support.','section',detail]])),
  US3574460A: record('Fluid-pressure contact printing shoe', (g,state) => {
    if (state==='code') {
      sheet(g,'film',0,0,.02,2.92,7.50);
      for (const y of [-2.28,0,2.28]) g.frame('steel',0,y,.025,2.11,1.84,.033,.074);
      for (const y of [-1.15,1.15]) for (const x of [-.53,0,.53]) g.box('dark',x,y,.03,.20,.16,.047);
      return;
    }
    roller(g,'glass',0,1.88,1.85,5.34);
    for (const x of [-2.45,2.45]) roller(g,'steel',0,1.88,1.93,.16,x);
    for (const s of [-1,1]) {
      const [lo,hi]=s===1?[19,67]:[113,161];
      const a = g.arc([0,0,1.88],1.98,lo,hi,12);
      const b = g.arc([0,0,1.88],2.27,lo,hi,12);
      for (let i=1;i<a.length;i++) {
        const part=[a[i-1],a[i],b[i],b[i-1]];
        g.solid('support',part.map(([,y,z])=>[-2.55,y,z]),part.map(([,y,z])=>[2.55,y,z]),false);
      }
    }
    g.ribbon('paper',g.arc([0,0,1.88],1.855,21,160),4.73);
    g.ribbon('film',g.arc([0,0,1.88],1.878,21,160),4.70);
    g.box('glass',0,0,4.04,4.88,1.57,.14);
    if (state==='control') {
      g.track('air',[[2.54,.92,3.84],[3.20,.92,3.84],[3.50,.54,3.88],[3.50,.54,2.82]],.15);
      for (const y of [-.46,0,.46]) g.sweep('air',[0,y,4.01],[0,y,3.79],.1);
      g.box('moving',3.50,.54,2.57,.58,.73,.30);
    }
  }, f(2,[['1','The shoe wraps the drum. Gas pressure brings the film and stock into contact through the small exposure gap.','working',side],['2','Lateral section shows the width of the shoe, window and drum steps.','working',end],['3','Controlled gas feed through the shoe pivot and ducts.','control',iso],['4','Interframe code on the original film.','code',plan]])),
};
