import { figures as f, record, sheet, roller, shaft, bow, iso, plan, end, side, detail } from './geometry.js';

export const models = {
  US432990A: record('Eastman and Walker roller holder', (g, state) => {
    const detailView = ['locked','released','marker','counter'].includes(state);
    if (!detailView) {
      g.frame('base',0,0,0,6.4,8,.65,.5);
      g.box('support',0,0,.65,5.3,3,.35);
      for (const y of [-3,3]) roller(g,'film',y,1.36,1.04,4.8);
      g.ribbon('film', [[0,-3.2,2.39],[0,-2.3,1.45],[0,-1.52,1],[0,1.52,1],[0,2.32,1.45],[0,3.1,2.39]], 4.6);
    }
    const x = detailView ? 0 : 2.74;
    roller(g,'support',-1.85,1.08,.43,detailView ? 3.6 : 5.55,x-(detailView ? 0 : 2.68));
    g.cylinder('drive',[x,-2.65,1.35],[x+.22,-2.65,1.35],.81,.11,28);
    g.cylinder('moving',[x,2.8,1.36],[x+.24,2.8,1.36],.89,.15,30);
    for (let i=0;i<18;i++) {
      const a = i*Math.PI/9;
      const p = [x+.11,2.8+.92*Math.cos(a),1.36+.92*Math.sin(a)];
      g.sweep('moving',[x+.11,2.8+.81*Math.cos(a),1.36+.81*Math.sin(a)],p,.16,.15);
    }
    const engaged = state === 'locked' || state === 'marker';
    const y = engaged ? 1.97 : 1.87, z = engaged ? 1.54 : 2.04;
    g.track('moving',[[x+.22,.3,1.9],[x+.22,1.48,1.82],[x+.22,y,z]],.16);
    g.cylinder('steel',[x-.12,1.35,1.84],[x+.48,1.35,1.84],.095);
    g.spring('spring',[x+.22,.35,1.85],[x+.22,-.44,2.25],.105);
    if (state === 'marker') {
      g.sweep('spring',[x,-2.49,1.87],[x,-1.85,1.38],.10);
      g.sweep('moving',[x,-1.85,1.1],[x,-1.85,1.58],.075);
    }
    if (state === 'counter') {
      g.cylinder('steel',[x+.25,-.65,1.48],[x+.5,-.65,1.48],.53,.11);
      g.sweep('moving',[x+.52,-.65,1.48],[x+.52,-.42,1.82],.075);
    }
  }, f(1, [
    ['1','Case side with the winding and indicating parts.','working',side],
    ['2','Back removed to show the supply, take-up and broad exposure support.','working',plan],
    ['3','Guide rollers bring the film down onto the exposure support.','working',end],
  ]), f(2, [
    ['4','Side view of the released lock and marking drive.','released',side],
    ['5','The cam trips the detent into the spool teeth.','locked',side],
    ['6','The drive on the measuring roller acts on a movable marking pin.','marker',side],
    ['7','Look along the marker roller to inspect the arm and projected pin.','marker',detail],
    ['8','Counter section at the case wall.','counter',end],
    ['9','Indicator at the end of the housing.','counter',side],
    ['10','The spool-detent nose meets a tooth.','locked',detail],
    ['11','The detent nose clears the spool teeth.','released',detail],
  ])),
  US450794A: record('Jones roll-paper holder', (g, state) => {
    if (state === 'marker') {
      for (const x of [-1.6,1.6]) {
        roller(g,'moving',0,0,.77,.27,x);
        g.sweep('steel',[x,0,0],[x,0,-.91],.10);
      }
      roller(g,'steel',0,0,.13,3.8);
      return;
    }
    g.box('base',0,0,0,5.8,4,.30);
    for (const x of [-2.64,2.64]) g.box('base',x,0,.30,.22,4.0,4.8);
    roller(g,'paper',1.24,3.7,.76,4.5);
    g.box('spring',0,1.24,2.8,4.55,1.38,.13);
    for (const x of [-1.8,1.8]) {
      g.spring('spring',[x,1.24,2.12],[x,1.24,2.8],.13);
      roller(g,'moving',.20,4.08,.32,.40,x);
    }
    roller(g,'steel',.20,4.08,.11,4.9);
    g.box('support',0,-.40,1.10,4.7,.16,2.65);
    for (const y of [.45,1.60]) roller(g,'drive',y,.75,.32,4.57);
    g.ribbon('dark', [[0,.45,1.08],[0,1.60,1.08],[0,1.93,.75],[0,1.60,.42],[0,.45,.42],[0,.12,.75],[0,.45,1.08]],4.38);
    g.ribbon('paper',[[0,1.26,4.45],[0,.46,4.22],[0,.20,3.76],[0,-.54,3.77],[0,-.54,1.11],[0,.45,1.08]],4.13);
    if (state === 'case') {
      g.box('base',0,1.97,.3,5.6,.17,4.8);
      g.box('base',0,0,5.1,5.6,4,.14);
    }
  }, f(1, [
    ['1','The transport fits in the rear of the camera box.','case'],
    ['2','Roll stock goes over the guide flange and between the upright frames.','working',side],
    ['3','The backing plate supports the exposure area. The lower belt takes up the stock.','working',end],
    ['4','Adjustable tips are carried by the tension drums.','marker',detail],
  ])),
  US813531A: record('McGinley contact-printing frame', (g, state) => {
    const angle = state === 'closed' ? 0 : state === 'caught' ? 24 : 78;
    g.frame('base',0,0,0,5.7,6.3,.34,.52);
    g.box('glass',0,0,.10,4.71,5.31,.19);
    sheet(g,'film',0,0,.292,4.30,4.80);
    sheet(g,'paper',0,0,.33,4.42,4.92);
    for (const x of [-2.26,2.26]) {
      g.box('steel',x,.7,.33,.17,.70,.20);
      g.box('steel',x,-.7,.33,.17,.70,.20);
    }
    g.around('x',[0,-3.17,.64],angle,() => {
      g.box('moving',0,-.04,.64,5.52,6.12,.23);
      g.box('dark',0,-.04,.37,4.90,5.50,.27);
      g.box('moving',0,3.64,.64,1.03,1.25,.23);
    });
    g.cylinder('steel',[-2.94,-3.17,.64],[2.94,-3.17,.64],.11);
    g.spring('spring',[-1.08,-3.17,.64],[.07,-3.17,.64],.21,.07,4);
    g.track('spring',[[.07,-3.17,.78],[.12,-2.62,.68],[.37,-1.65,angle>60?.54:.34]],.086);
  }, f(1, [['drawing','The paper-holding spring wraps the pintle. Its free leg catches the paper before the lid is fully down.','open',iso]])),
  US1139079A: record('Film sheet with inclined edge slots', (g, state) => {
    g.box('base',0,0,0,6.25,6.9,.22);
    g.box('steel',0,3.34,.22,5.2,.15,.19);
    for (const s of [-1,1]) {
      const edge = [[s*2.72,.21],[s*3.05,.21],[s*2.88,.53],[s*2.73,.52],[s*2.85,.33]];
      // The rail section consists of a foot and an inward-sloping cover.
      g.box('support',s*2.92,0,.19,.26,6.66,.16);
      g.solid('support', edge.slice(1).map(([x,z])=>[x,-3.33,z]), edge.slice(1).map(([x,z])=>[x,3.33,z]));
    }
    g.ribbon('film',[[-2.85,0,.32],[-2.58,0,.225],[2.58,0,.225],[2.85,0,.32]],6.48,[0,1,0]);
    if (state === 'section') {
      g.track('film',[[-2.86,0,.34],[-2,0,.74],[0,0,1.03],[2,0,.74],[2.86,0,.34]],.045);
    }
  }, f(1, [
    ['1','The sheet slides lengthwise into two angled margins.','working'],
    ['2','Backing plate and end stop in plan.','working',plan],
    ['3','The angled slots hold the bent edges while the centre hugs the flat plate. The upper trace indicates free curvature.','section',end],
  ])),
  US1581999A: record('Gates enlargement and contact printer', (g, state) => {
    const raised = state === 'raised' || state === 'carriage';
    if (state === 'paper') {
      sheet(g,'paper',0,0,.03,8,3.45);
      for (const x of [-2.45,0,2.45]) {
        g.cylinder('moving',[x,0,.045],[x,0,.07],.94,.76,36);
        g.cylinder('film',[x,0,.04],[x,0,.055],.62,0,36);
      }
      return;
    }
    if (state === 'mask' || state === 'negative') {
      g.frame('steel',0,0,0,6.2,6.9,.23,.57);
      g.cylinder('dark',[0,0,.23],[0,0,.27],2.3,1.8,48);
      if (state === 'negative') {
        g.box('glass',0,0,.13,5.02,5.69,.10);
        sheet(g,'film',0,0,.231,4.53,5.3);
      }
      return;
    }
    for (const x of [-3.38,3.38]) g.box('support',x,0,0,.29,8.2,.25);
    g.frame('base',0,0,.25,6.75,7.0,.36,.57);
    g.box('glass',0,0,.32,5.55,5.81,.17);
    sheet(g,'film',0,0,.50,4.92,5.12);
    const z = raised ? 1.37 : .53;
    sheet(g,'paper',0,0,z,5.36,5.88);
    g.box('moving',0,0,z+.025,5.69,6.0,.25);
    for (const x of [-2.5,2.5]) {
      const p = [x,-2.45,.67];
      g.track('moving',[p,[x,-1.60,z+.18],[x,-1.33,z+.19]],.14);
      for (const y of [-3.0,3.0]) shaft(g,x,y,.39,.11,1.7);
    }
    if (state === 'carriage' || state === 'vertical-lock') {
      g.box('dark',3.22,0,.46,.37,.7,.26);
      g.spring('spring',[3.1,0,.62],[2.45,0,.62],.095);
    }
  }, f(1, [['I','Plan of the travelling mask and negative carriage.','working',plan]]),
  f(2, [['II','Side elevation of the carriage and raised support.','raised',side],['III','Platen raising and lowering linkage.','raised',detail]]),
  f(3, [['IV','Section through the assembled printing layers.','working',end],['V','An example mask with an oval opening.','mask',plan],['VI','The negative-bearing mask locates the image behind its border.','negative',iso],['VII','The carriage lock acts against its guide.','carriage',detail]]),
  f(4, [['VIII','Three projected areas paired with contact-printed frames on the paper.','paper',plan],['IX','The vertical position lock holds the support setting.','vertical-lock',end]])),
  US1829332A: record('Four-point stretching exposure frame', (g, state) => {
    const isDetail = ['rim','screw'].includes(state);
    if (!isDetail) {
      for (const y of [-3.25,3.25]) roller(g,'film',y,.92,.83,4.92);
      g.ribbon('film', [[0,-3.26,1.76],[0,-2.48,.64],[0,2.48,.64],[0,3.26,1.76]],4.56);
    } else sheet(g,'film',0,0,.64,4.56,4.96);
    g.frame('base',0,0,0,5.4,5.4,.36,.58);
    g.frame('spring',0,0,.36,4.9,5.0,.19,.39);
    for (const [x,y] of [[-2.2,0],[2.2,0],[0,-2.3],[0,2.3]]) g.box('spring',x,y,.53,.46,.43,.11);
    if (state === 'rim') return;
    const z = state === 'open' ? 1.31 : .645;
    g.frame('moving',0,0,z,4.7,4.9,.23,.49);
    for (const x of [-1.8,1.8]) {
      shaft(g,x,1.54,z+.23,.10,.88);
      g.spring('spring',[x,1.54,z+.24],[x,1.54,2.50],.20);
    }
    if (state === 'screw') {
      shaft(g,0,-1.8,z+.21,.15,1.64,'drive');
      roller(g,'drive',-1.8,z+1.74,.22,1.05);
    } else roller(g,'drive',1.54,2.75,.28,3.95);
  }, f(1, [['1','The pressure rim stands clear for film transport.','open',side],['2','The cam lowers the pressure assembly for exposure.','working',side]]),
  f(2, [['3','Clearance in the free position, viewed at the edge.','open',end],['4','The pressure rim engages the high areas first.','working',end],['5','The raised points interrupt the shape of the resilient aperture rim.','rim',detail],['6','A screw sets the pressure without the shutter actuator.','screw',iso]])),
  US2008982A: record('Hopkins enlarger with interlocked carrier', (g, state) => {
    const gate = state === 'winding' ? 15 : 0;
    if (state === 'machine' || state === 'optics') {
      g.box('base',0,0,0,7.8,7.8,.38);
      g.box('support',-3.24,0,.38,.46,.73,6);
      g.box('support',-1.71,0,5.93,3.2,.54,.51);
      shaft(g,0,0,3.82,.77,1.68,'dark');
      shaft(g,0,0,3.52,.56,.27,'glass');
      if (state === 'optics') {
        for (const x of [-1.25,1.25]) {
          g.sweep('light',[0,0,3.52],[x,-1.4,.38],.09);
          g.sweep('light',[0,0,3.52],[x,1.4,.38],.09);
        }
      }
    }
    const z = ['machine','optics'].includes(state) ? 5.50 : 0;
    g.frame('base',0,0,z,5.5,4.5,.27,.53);
    g.box('glass',0,0,z+.26,3.76,3.45,.11);
    sheet(g,'film',0,0,z+.374,3.38,5.6);
    g.around('x',[0,-1.9,z+.38],gate,() => {
      g.frame('moving',0,0,z+.44,4.42,4.12,.27,.5);
      g.box('glass',0,0,z+.375,3.52,3.15,.12);
    });
    for (const y of [-2.82,2.82]) roller(g,'drive',y,z+.76,.39,3.7);
    g.track('moving',[[2.50,-1.9,z+.42],[2.50,-1.4,z+.75],[3.32,-.60,z+.75]],.19);
    g.spring('spring',[3.30,-.5,z+.75],[3.30,1.11,z+.75],.18);
    if (state === 'interlock' || state === 'winding') {
      g.sweep('dark',[2.82,-1.2,z+.42],[3.26,-.85,z+.64],.20);
      shaft(g,3.26,-.85,z+.48,.10,.84,'steel');
    }
  }, f(1, [['1','Carrier and optical column on the enlarger.','machine'],['9','Detail of the interlock between the film-frame positioning and reeling mechanisms.','interlock',detail]]),
  f(2, [['2','Plan with the negative gate and reeling arrangement.','working',plan],['3','The carriage drive is visible with the covers removed.','winding',plan]]),
  f(3, [['4','Glass carrier and projection optics in section.','optics',side],['5','The optical axis runs from the negative to the print plane.','optics',iso],['6','In winding position the upper glass swings clear of the strip.','winding',side]]),
  f(4, [['7','The film holder and reels share a carriage.','working',end],['8','The lower carriage plate locates the guide and drive.','winding',plan]])),
  US2063016A: record('Ames oscillating film gate', (g, state) => {
    const moving = state === 'transport';
    g.frame('base',0,0,0,5.65,6.55,.34,.77);
    g.frame('support',0,0,.34,4.18,4.61,.15,.46);
    sheet(g,'film',0,0,moving ? .60 : .495,3.86,7.34);
    for (const x of [-1.56,1.56]) {
      g.box('steel',x,0,.49,.20,4.52,.084);
      shaft(g,x,-1.83,.34,.075,.36,'dark');
    }
    g.around('x',[0,-2.49,.54],moving?11:0,() => {
      g.frame('moving',0,0,.60,4.57,4.96,.25,.61);
      for (const x of [-1.56,1.56]) {
        g.box('moving',x,0,.50,.24,3.99,.14);
        g.spring('spring',[x,.86,.66],[x,.86,1.24],.13);
      }
    });
    roller(g,'steel',-2.49,.59,.13,5.2);
    g.track('drive',[[2.57,-2.51,.71],[3.15,-1.82,.82],[3.15,-.32,.82]],.23);
    if (moving) {
      for (const x of [-1.56,1.56]) shaft(g,x,.13,.24,.085,.50,'moving');
    }
  }, f(1,[['1','Rear elevation locates the movable plate and the aperture.','working',plan]]),
  f(2,[['2','The rocking film guide clears the rails during pull-down.','transport',side],['5','The aperture frame carries the film reference.','working',plan],['6','The rocking connection and clearance at the edge are visible in section.','transport',end]]),
  f(3,[['3','In printing position the sprung rails press the stationary film.','working',side],['4','Bottom view of the gate and its supporting frame.','working',end]])),
  US2131926A: record('Camera magazine with moving vacuum back', (g, state) => {
    const z = state==='winding' ? .30 : .71;
    g.frame('base',0,0,0,7.00,9.1,.38,.55);
    g.frame('support',0,0,.45,4.9,4.1,.245,.52);
    g.box('moving',0,0,z-.16,4.17,3.42,.16);
    sheet(g,'film',0,0,.708,4.22,5.25);
    for (const y of [-3.35,3.35]) {
      roller(g,'film',y,1.25,1.19,4.5);
      roller(g,'support',Math.sign(y)*2.23,.85,.24,4.52);
    }
    for (const x of [-1.25,1.25]) {
      for (const y of [-.77,.77]) shaft(g,x,y,z,.081,.027,'air');
      g.spring('spring',[x,0,.08],[x,0,z-.165],.13);
    }
    g.track('air',[[0,0,z-.13],[2.37,0,z-.13],[2.75,.62,z-.13],[2.75,1.32,.29]],.105);
    for (const [y,r] of [[2.71,.49],[1.74,.41],[.96,.30]]) {
      g.cylinder('drive',[2.65,y,1.11],[2.93,y,1.11],r,.085);
    }
    if (state==='counter') g.cylinder('moving',[2.88,.5,1.8],[3.02,.5,1.8],.55,.10);
  }, f(1,[['1','Plan section across the magazine and exposure plane.','working',plan]]),
  f(2,[['2','The side cover is removed to expose the drive.','counter',side],['3','Supply and take-up are carried in the magazine.','winding',end]]),
  f(3,[['4','The positioning plate and its linkage in vertical section.','working',side],['5','The winding clearance at the exposure opening.','winding',detail]]),
  f(4,[['6','Cross section through the positioning assembly and vacuum back.','working',end]])),
  US2168688A: record('Simms enlarger with cruciform platen', (g, state) => {
    const expose = state!=='shutter';
    const overall = ['machine','stripped'].includes(state);
    if (overall) {
      g.box('base',0,0,0,7,8,.33);
      g.box('support',-3.1,0,.33,.41,.78,5.4);
      g.box('support',-1.45,0,4.11,3.3,.45,.39);
      shaft(g,0,0,1.17,.67,1.26,'dark');
      shaft(g,0,0,3.56,.61,.50,'glass');
      if (state==='machine') for (const y of [-2.92,2.92]) roller(g,'drive',y,3.36,1.42,1.34);
    }
    const z = overall ? 2.75 : 0;
    g.frame('base',0,0,z,4.05,4.7,.33,.7);
    sheet(g,'film',0,0,z+.334,2.02,5.50);
    if (state!=='gate' && state!=='stripped') {
      const p = z+.34;
      g.frame('moving',0,0,p,2.69,3.25,.16,.43);
      for (const x of [-1.56,1.56]) {
        g.box('spring',x,0,p,.64,.48,.16);
        g.spring('spring',[x,0,p+.16],[x,0,p+.73],.16);
      }
      for (const y of [-1.85,1.85]) g.box('moving',0,y,p,.54,.57,.16);
    }
    if (state==='shutter' || overall) {
      const x = expose ? 1.31 : 0;
      g.cylinder('dark',[x,0,z-.17],[x,0,z-.06],1.05);
      g.track('moving',[[x,0,z-.11],[1.75,1.02,z-.11],[2.23,1.02,z-.11]],.17);
    }
  }, f(1,[['1','Side elevation with film reels and optical column.','machine',side]]),
  f(2,[['2','Film runs across the enlarger gate.','machine',plan],['3','The view removes reels and optics to expose the base and drive.','stripped',plan]]),
  f(3,[['4','Looking along the projection mechanism and film plane.','machine',end],['5','Platen and shutter above the enclosure.','shutter',plan],['6','Section through the gate and platen spring.','working',end],['7','The gate with the exposure opening.','gate',detail],['8','The spring-loaded cruciform platen.','working',detail],['9','The shutter closes across the optical opening.','shutter',iso],['10','The catch retains the shutter for viewing.','shutter',side]])),
};
