import { figures as f, record, sheet, roller, shaft, bow, iso, plan, end, side, detail } from './geometry.js';

export const models = {
  US3746444A: record('Microfiche recorder with moving vacuum platen', (g,state) => {
    const short=state==='section';
    const y=state==='transfer'?-.66:0;
    g.box('base',0,0,0,6.95,short?4.28:11.2,.35);
    g.box('support',0,y,.58,5.68,4.24,.44);
    sheet(g,'film',0,y,.568,4.65,short?3.85:6.32);
    for (const x of [-1.22,0,1.22]) for (const s of [-1,1]) shaft(g,x,y+s*.91,.53,.077,.051,'air');
    for (const x of [-2.89,2.89]) {
      g.cylinder('steel',[x,-3.1,.67],[x,3.1,.67],.11);
      g.box('moving',x,y,.67,.40,1.55,.42);
    }
    if (!short) {
      roller(g,'film',-3.57,1.45,.72,4.65);
      roller(g,'steel',-2.72,.65,.12,4.9);
      for (const y of [3.02,3.70,4.38]) {
        roller(g,'moving',y,.87,.25,4.7);
        roller(g,'steel',y,.36,.25,4.7);
      }
      g.box('moving',0,2.61,.52,5.23,.36,.38);
      g.box('dark',0,-.8,1.12,3.01,2.75,1.23);
    } else g.box('glass',0,0,.37,5.36,3.8,.155);
  }, f(2,[['1','System layout places the step-and-repeat platen between recording and processing.','transfer',plan]]),
  f(3,[['2','The film supply travels with the X–Y platen.','working',iso]]),
  f(4,[['3','Vacuum holes hold the film against the platen underside at the reference.','section',end],['4','The carriage pulls out a recorded length for cutting and transfer.','transfer',side]])),
  US3966320A: record('Microfilm camera with travelling suction holder', (g,state) => {
    const lifted = state==='lifted' || state==='camera';
    const z = lifted ? 2.24 : .49;
    g.frame('base',0,0,0,6.68,5.28,.36,.70);
    g.frame('glass',0,0,.36,5.44,4.44,.115,.49);
    g.box('moving',0,0,z,4.88,4.16,.30);
    sheet(g,'film',0,0,z-.025,4.50,3.86);
    for (const x of [-1.59,0,1.59]) for (const y of [-1.27,0,1.27]) shaft(g,x,y,z-.016,.075,.027,'air');
    for (const y of [-2.38,2.38]) g.cylinder('steel',[-3.27,y,3.32],[3.27,y,3.32],.12);
    shaft(g,0,0,z+.30,.18,3.31-z-.30,'support');
    g.box('support',0,0,3.28,1.77,5.14,.24);
    g.track('air',[[0,1.80,z+.30],[1.30,2.77,z+.58],[2.85,2.77,2.16],[3.2,1.5,1.52]],.12);
    if (state==='camera') {
      g.box('support',-3.21,0,-3,.42,.83,6.25);
      g.box('base',0,0,-3,6.8,6.01,.26);
      shaft(g,0,0,-.95,.66,.9,'glass');
    }
    if (['seated','third','gate'].includes(state)) {
      g.track('air',[[2.37,.75,.44],[2.93,.75,.44],[3.36,1.49,.54]],.11);
    }
  }, f(2,[['1','The suction carriage is above the optical gate and subject table.','camera',side]]),
  f(3,[['2','The mobile vacuum plate holds the sheet while lifted clear of the gate.','lifted',side],['3','Enlarged film gate and contact reference.','gate',detail]]),
  f(4,[['4','The sheet and mobile holder are seated on the gate.','seated',end]]),
  f(5,[['5','Third suction routing arrangement, with the sheet at the exposure reference.','third',side]])),
  US4145127A: record('Projector shuttle and selectable film gate', (g,state) => {
    const detailCam=['cam','shuttle','claw'].includes(state);
    const open=state==='thread';
    const still=state==='still';
    const z=open?1.28:.50;
    if (!detailCam) {
      g.frame('base',0,0,0,5.9,6.50,.35,.48);
      g.frame('support',0,0,.35,4.30,4.68,.115,.50);
      sheet(g,'film',0,0,.475,3.65,6.91);
      g.frame('moving',0,0,z,4.21,4.82,.19,.46);
      for (const y of [-1.70,1.70]) {
        g.spring('spring',[1.68,y,z+.19],[1.68,y,1.84],.16);
        g.box('support',1.75,y,1.78,.77,.47,.16);
      }
      bow(g,'spring',-2.11,1.79,.63,.39,.09);
    }
    g.track('moving',[[2.74,-1.94,1.13],[2.68,-.78,1.01],[2.55,.62,.93],[still||open?2.4:1.72,1.16,still||open?.72:.477]],.18,.17);
    g.cylinder('drive',[2.45,-1.77,1.16],[2.79,-1.77,1.16],.91,.10);
    g.cylinder('steel',[2.70,-1.23,.86],[2.99,-1.23,.86],.32,.08);
    if (state==='camera' || state==='shutter') {
      for (const y of [-3.19,3.19]) roller(g,'drive',y,1.33,.82,3.85);
      g.cylinder('dark',[.0,0,1.6],[.0,0,1.69],1.47,.29);
      for (const a of [0,120,240]) g.around('z',[0,0,1.63],a,()=>g.box('moving',.65,0,1.695,1.56,.36,.075));
    }
  }, f(2,[['1','The transport module sits inside the projector.','camera',side],['2','The drive side shows rollers and linkage behind the housing.','camera',iso]]),
  f(3,[['3','The removed module in profile at the gate.','working',side],['4','Its opposite side and the selector linkage.','still',side]]),
  f(4,[['5','Forward mode lowers the shuttle claw into the film margin.','working',side],['6','Section through the drive cam.','cam',detail],['7','Section through shuttle and gate in a running mode.','working',end],['9','Exploded relationships of shuttle pivot and drive.','shuttle',iso]]),
  f(5,[['8','Still mode keeps the film in the gate with the shuttle disengaged.','still',end],['11','Forward shuttle position and cam.','working',side]]),
  f(6,[['10','Front view of cam and shuttle in the alternative position.','still',side],['12','The end of the shuttle presents the film-engaging claw.','claw',end],['15','Pressure relief for threading; the film is free between the plates.','thread',end],['16','Section at the film gate mechanism.','working',end]]),
  f(7,[['13','The shuttle shown apart from its mount.','shuttle',plan],['17','Gate retention spring in cross section.','working',detail],['18','Shutter on the transport drive.','shutter',side]]),
  f(8,[['14','Film gate and framing mechanism with pressure plate and control lever.','working',plan]])),
  US4203658A: record('Microimage cassette glass gate', (g,state) => {
    const exploded=state==='exploded';
    const separated=state==='search' || exploded;
    const full=['machine','exploded','search'].includes(state);
    const z=separated?1.3:.76;
    g.frame('base',0,0,0,6.82,5.52,.42,.43);
    if (full) {
      for (const x of [-2.45,2.45]) shaft(g,x,1.15,.45,.95,.68,'drive');
      g.box('dark',0,1.46,1.34,6.15,2.15,.22);
    }
    g.box('glass',0,-.84,.52,3.68,2.02,.20);
    sheet(g,'film',0,-.84,.729,4.9,1.48);
    g.box('glass',0,-.84,z,3.68,2.02,.20);
    for (const x of [-1.7,1.7]) {
      shaft(g,x,-.73,.43,.095,1.44,'steel');
      g.spring('spring',[x,-.73,z+.21],[x,-.73,1.98],.16);
    }
    if (state==='projection' || state==='machine') {
      shaft(g,0,-.84,2.16,.62,1.14,'glass');
      for (const x of [-.61,.61]) g.sweep('light',[x,-.84,z+.20],[x*.6,-.84,3.66],.08);
    }
    if (exploded) g.box('moving',0,-.83,2.12,4.41,1.65,.21);
  }, f(2,[['1','The cassette enters a movable viewer carriage.','exploded'],['2','The viewer carries the cassette between addressing and projecting positions.','machine',side],['3','The cassette aperture in plan.','search',plan],['4','The transparent plates face each other across the strip passage.','working',end]]),
  f(3,[['5','Enlarged spacing between cassette bight and glass plates.','search',end],['6','Perspective showing the viewer assembly.','machine'],['7','Exploded clamping and separating parts.','exploded',detail],['8','Assembled plate separation and clamping mechanism.','working',end],['9','The projected light passes through the glass-closed film plane.','projection',side]])),
  US4249821A: record('Vacuum-belt microfilm camera', (g,state) => {
    const magazines=state==='magazines' || state==='machine';
    g.frame('base',0,0,0,6.72,6.71,.38,.48);
    g.box('support',0,0,.38,5.35,4.08,.54);
    for (const x of [-1.64,0,1.64]) {
      const a=-2.13,b=2.13,z=.92,r=.33;
      roller(g,'moving',a,z,r,.92,x); roller(g,'moving',b,z,r,.92,x);
      g.ribbon('dark',[[x,a,z+r], ...g.arc([x,b,z],r,90,-90), ...g.arc([x,a,z],r,-90,-270)],.86);
      for (const y of [-1.48,-.52,.40,1.40]) shaft(g,x,y,z+r,.082,.017,'air');
    }
    sheet(g,'film',0,0,1.267,4.66,4.41);
    g.track('air',[[0,.71,.61],[2.27,.71,.61],[2.85,1.41,.61],[3.58,1.41,.61]],.13);
    if (magazines) {
      for (const y of [-4.18,4.18]) {
        roller(g,'film',y,1.71,1.51,4.70);
        g.ribbon('film',[[0,y,3.23],[0,y*.78,1.77],[0,y*.54,1.266]],4.65);
      }
    }
    if (state==='shutter') {
      shaft(g,0,0,2.0,1.78,.22,'drive');
      g.box('air',1.39,-.1,2.22,.39,.47,.40);
    }
    if (['control','motor','driver'].includes(state)) {
      g.box('drive',3.28,2.13,.56,.82,.83,.79);
      roller(g,'steel',2.13,.92,.105,1.0,2.83);
      g.box('dark',2.93,-.72,.45,1.08,.94,.39);
    }
  }, f(2,[['1','Forward elevation of the microfilm camera and belt path.','machine',side]]),
  f(3,[['2','Feed and take-up magazines sit on opposite sides of the camera.','magazines',side]]),
  f(4,[['3','The coplanar vacuum belts share the same film-contact plane.','working',plan]]),
  f(5,[['4','Rear elevation exposes rollers and drive side.','machine',[155,45,1]]]),
  f(6,[['5','Shutter and sensor above the transport.','shutter',plan]]),
  f(7,[['6','Logic diagram. The corresponding 3D scene locates the clocked belt drive and sensor.','control',iso]]),
  f(8,[['7','Belt pull-down circuit and the controlled drive.','motor',detail]]),
  f(9,[['8','Stepper driver and phase timing. The scene shows which motor makes the pull-down.','driver',end]]),
  f(10,[['9','Shutter control schematic. The scene identifies the sensing point at the shutter.','shutter',detail]]),
  f(11,[['10','Feed and take-up control. The scene shows the two coupled magazine paths.','magazines',iso]])),
  GB2138152A: record('Evacuated cut-film carrier with embossed cover', (g,state) => {
    const open=state==='loading';
    const station=state==='station';
    const z=open ? .98 : .24;
    g.box('base',0,0,0,5.51,9.81,.21);
    sheet(g,'film',0,0,.216,4.79,8.74);
    g.ribbon('glass', [[0,-4.68,.253],[0,-3.75,z],[0,3.6,z],[0,4.68,.253]],5.05);
    for (let x=-1.8;x<2;x+=.49) for (let y=-3.05;y<3.1;y+=.66) shaft(g,x,y,z-.038,.045,.040,'support');
    g.box('spring',0,-4.43,.22,5.08,.42,.09);
    g.track('air',[[0,-4.42,.27],[-2.47,-4.42,.27],[-2.81,-4.15,.27],[-3.24,-4.15,.27]],.12);
    if (station) {
      g.frame('support',0,0,-.37,6.2,11.41,.36,.31);
      roller(g,'drive',-5.23,.52,.37,5.38);
      g.cylinder('dark',[2.71,-4.06,.92],[3.16,-4.06,.92],1.36,.12);
    }
  }, f(1,[['1 cover','The cover repeats the camera transport drawing.','station',side]]),
  f(2,[['1','Transport moves the cut-film carrier past the camera opening.','station',side]]),
  f(3,[['2','The flexible sheet seals around the film support.','working',plan],['3','Section through the carrier while holding film.','working',end],['4','The edge construction connects to the evacuating passage.','working',detail]]),
  f(4,[['5','Plan of the carrier and its margin connections.','working',plan],['6','Section of the edge with flexible cover lifted schematically.','loading',end],['7','The embossed passages distribute the suction.','working',detail],['8','Film surface detail. The model shows the supporting sheet and its contact layer.','working',iso]])),
  US4483612A: record('Copy master with opposed flap clamps', (g,state) => {
    const angle=state==='open'?62:0;
    g.frame('base',0,0,0,6.58,6.72,.37,.65);
    sheet(g,'film',0,0,.375,4.98,4.74);
    for (const s of [-1,1]) {
      const x=s*2.87;
      g.cylinder('steel',[x,-2.79,.63],[x,2.79,.63],.106);
      g.around('y',[x,0,.63],s*angle,() => {
        g.box('moving',x-s*.51,0,.49,1.12,5.30,.24);
        g.box('spring',x-s*.74,0,.375,.35,4.91,.12);
      });
      g.track('drive',[[x,2.76,.65],[x,3.16,.75],[x-s*.52,3.32,1.05]],.15);
    }
    if (state==='detail') {
      for (const x of [-2.77,2.77]) g.spring('spring',[x,-2.36,.54],[x,-2.36,1.26],.13);
    }
  }, f(2,[['1','The opposed flaps open clear of the travelling copy master.','open',end],['2','The flap contact strips come down on the two sides.','working',end],['3','Plan shows the pair of flaps and their axes.','working',plan]]),
  f(3,[['4','An edge detail with the flap seated.','detail',end],['5','The flap drive in the transverse detail.','detail',detail]])),
  US4761675A: record('Rotatable negative-mask carrier', (g,state) => {
    const exploded=state==='exploded';
    const z=exploded?1.71:.35;
    g.frame('base',0,0,0,7.06,6.76,.35,.85);
    g.around('z',[0,0,0],state==='turned'?90:0,() => {
      g.frame('support',0,0,z,5.18,5.14,.34,.54);
      sheet(g,'film',0,0,z+.344,3.56,7.37);
      for (const x of [-2.13,2.13]) g.box('steel',x,0,z+.35,.32,5.11,.22);
      g.around('x',[0,-2.54,z+.72],exploded?28:0,() => {
        g.frame('moving',0,0,z+.565+(exploded?.75:0),4.94,4.58,.23,.58);
        for (const x of [-1.76,1.76]) g.box('spring',x,0,z+.36+(exploded?.75:0),.22,4.18,.22);
      });
      roller(g,'steel',-2.54,z+.72,.127,5.16);
    });
  }, f(2,[['1','First film-feed orientation.','working',plan],['2','Section through the mask and its hinged presser.','working',end],['3','The side view shows the hinge and mounting recess.','working',side]]),
  f(3,[['4','The mask support turns 90° for the other feed direction.','turned',plan],['5','Exploded base, mask and presser.','exploded',iso]])),
  US4774553A: record('Four-edge film gate with adjustable guideway', (g,state) => {
    const narrow=state==='clamp';
    const q=narrow?1.18:1.65;
    g.frame('base',0,0,0,6.56,7.85,.38,.66);
    sheet(g,'film',0,0,.386,2*q+.58,8.02);
    for (const s of [-1,1]) {
      g.box('support',s*(q+.32),0,.38,.42,7.36,.31);
      g.box('moving',s*q,0,narrow?.39:.70,.24,2.94,.17);
      for (const y of [-2.90,2.90]) roller(g,'drive',y,.71,.24,.44,s*(q+.36));
    }
    for (const y of [-1.44,1.44]) g.box('moving',0,y,narrow?.39:.70,2*q,.21,.17);
    if (state==='drive' || state==='working') {
      const z=1.07;
      shaft(g,1.96,2.53,.34,.46,1.34,'drive');
      g.track('spring',[[-1.96,2.53,z],[-1.96,-2.48,z],[1.96,-2.48,z],[1.96,2.53,z],[-1.96,2.53,z]],.09);
      g.sweep('moving',[-2.01,2.53,z+.41],[1.99,2.53,z+.41],.22);
    }
    if (state==='optics') shaft(g,0,0,.55,.61,1.50,'glass');
  }, f(2,[['1','The top view locates the adjustable film guideway over the apertures.','working',plan]]),
  f(3,[['2','End elevation through the gate and film entry.','working',end]]),
  f(4,[['3','The capstan and cable reposition the guide bars.','drive',iso],['4','Elevational relationship of the capstan and crossbar.','drive',end]]),
  f(5,[['5','Four edges of the selected film area are held at the gate.','clamp',iso]]),
  f(6,[['6','The pad, lens and guideway share the base reference.','optics',side]])),
};
