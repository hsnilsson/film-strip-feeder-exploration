import { figures as f, record, sheet, roller, shaft, iso, plan, end, side, detail } from './geometry.js';

export const models = {
  US5461492A: record('Dual-gate scanner with movable light integrator', (g,state) => {
    const slide=state.startsWith('slide');
    const slideOnly=state==='slide-part';
    const x=slide?1.87:-1.83;
    if (!slideOnly) {
      g.frame('base',0,0,0,9.19,7.48,.39,.43);
      g.frame('support',-1.83,0,.41,4.25,5.50,.33,.65);
      sheet(g,'film',-1.83,0,.75,3.03,7.84);
      for (const y of [-3.05,3.05]) {
        roller(g,'moving',y,.65,.30,3.5,-1.83);
        roller(g,'steel',y,1.26,.30,3.5,-1.83);
      }
      if (state==='pre' || state==='feed') shaft(g,-1.83,-1.77,.89,.25,1.82,'glass');
      if (state==='withdraw') g.ribbon('film',[[-1.83,1.49,.76],[-1.83,2.85,1.0],[-2.7,3.7,1.40]],2.97);
    }
    g.frame('moving',1.87,0,.43,3.81,4.34,.41,.68);
    sheet(g,'glass',1.87,0,.847,2.47,2.95);
    sheet(g,'film',1.87,0,.855,2.34,2.81);
    for (const y of [-1.43,1.43]) g.box('spring',1.87,y,.87,2.69,.29,.15);
    if (!slideOnly) {
      g.cylinder('steel',[-4.23,-2.58,.52],[4.25,-2.58,.52],.17);
      g.cylinder('steel',[-4.23,2.58,.52],[4.25,2.58,.52],.17);
      g.around('y',[0,0,2.68],state==='turn'?37:0,()=>{
        shaft(g,x,0,1.12,.41,1.43,'glass');
        g.box('dark',x,0,2.51,1.31,1.37,.52);
        g.sweep('moving',[0,0,2.70],[x,0,2.70],.32);
      });
    }
  },f(2,[['1','System block diagram for film routing and scanner control. The scene shows the two gate paths.','feed',plan]]),
  f(3,[['2','Scanner control and carriage diagram. The scene locates the translating carriage.','slide',plan]]),
  f(4,[['3','The housing has distinct slide and filmstrip paths.','feed',side]]),
  f(5,[['4','Filmstrip gate frame and carriage guides.','working']]),
  f(6,[['5','Insertion rollers ahead of the filmstrip clamp.','feed']]),
  f(7,[['6','The light integrator sits over the common scanning area.','working',iso]]),
  f(8,[['7','The next strip is introduced into the filmstrip gate.','feed',side]]),
  f(9,[['8','Moving film passes the preliminary scan position.','pre',side]]),
  f(10,[['9','A strip is withdrawn from the gate after scanning.','withdraw',side]]),
  f(11,[['10','The light integrator rotates to serve the other gate.','turn',side]]),
  f(12,[['11','The integrator is now over the slide rather than the strip.','slide',end]]),
  f(13,[['12','Front perspective of the slide gate and supporting frame.','slide-part',iso],['13','Rear perspective shows the same cassette contact from the other side.','slide-part',[-147,40,1]]]),
  f(14,[['14','Top plan view of the slide gate.','slide-part',plan],['15','Bottom plan view of the slide gate.','slide-part',[0,-86,1]],['16','Front elevation comparing the film reference and the holder.','slide-part',end]])),
  EP0588308B1: record('Arcuate scanner gate and conforming laminate', (g,state) => {
    const yoke=state.startsWith('yoke');
    const raised=['open','exploded','yoke-exploded'].includes(state);
    const strip=state.startsWith('strip');
    const only=state==='laminate' || state==='flexure' || strip;
    const arc = (x, extra) => Array.from({length:25},(_,i)=>{const t=i/12-1;return [x,3.51*t,1.29-.54*t*t+extra];});
    if (!only) {
      for (const s of [-1,1]) {
        g.track('base',arc(s*2.01,-.17),.71,.32);
        roller(g,'steel',s*3.56,.71,.23,5.05);
      }
      g.ribbon('film',arc(0,.010),3.99);
    }
    if (state==='gate') return;
    const lift=raised?1.04:.019;
    const explode=state.includes('exploded')?.85:0;
    for (const x of [-1.52,1.52]) g.track('spring',arc(x,lift),.41,.072);
    for (const y of [-1.53,1.53]) g.box('spring',0,y,1.19+lift,2.70,.34,.072);
    if (strip) {
      g.ribbon('film',arc(0,0),3.9);
      if (state==='strip-paper') {
        g.ribbon('paper',arc(1.99,.020),.49);
        g.track('spring',arc(2.05,.055),.28,.065);
      }
    }
    if (state==='laminate' || strip) return;
    g.frame('moving',0,0,1.39+lift+explode,4.48,4.20,.22,.47);
    for (const x of [-1.65,1.65]) g.sweep('support',[x,-1.51,1.42+lift],[x,2.81,1.72+lift+explode],.23,.18);
    if (state==='flexure') return;
    const distance=yoke?.50:1.11;
    for (const x of [-distance,distance]) g.track('moving',[[x,1.03,1.60+lift],[x,3.23,1.87],[x,4.02,1.87]],.26,.21);
    roller(g,'steel',3.22,1.87,.14,3.9);
    if (yoke) {
      g.box('support',0,2.81,1.72,2.95,1.00,.22);
      g.spring('spring',[0,2.81,1.20],[0,2.81,1.73],.18);
    }
    if (['machine','rear','yoke-drive'].includes(state)) {
      g.frame('base',0,0,-.13,6.24,10.42,.31,.60);
      for (const y of [-4.38,4.38]) roller(g,'film',y,1.75,.94,3.96);
      g.cylinder('drive',[2.19,3.22,1.87],[3.23,3.22,1.87],.52,.14);
      shaft(g,0,0,-.84,.56,.71,'glass');
    }
  },f(11,[['1','Film transport, curved gate and scanner assembly in perspective.','machine']]),
  f(12,[['2','The front elevation shows the film path at the clamp.','machine',plan]]),
  f(13,[['3','The clamp linkage on the rear side of the support.','rear',[-147,46,1]]]),
  f(14,[['4','Rear elevation showing the linkage relative to the machine plate.','rear',[0,-75,1]]]),
  f(15,[['5','Arc-segment guides establish the curved optical film plane.','gate',iso]]),
  f(16,[['6','Double-arm clamp above the curved scan gate.','working',iso]]),
  f(17,[['7','Bottom plan of the clamp and its two supporting arms.','working',[0,-86,1]]]),
  f(18,[['8','Exploded clamp stack, arms, spring plate and contact frame.','exploded']]),
  f(19,[['9','The arms separate the clamp from the film for advance.','open',iso]]),
  f(20,[['10','Bottom view shows the frame at the end of the two arms.','working',[-146,-49,1]],['11','Clamp frame isolated from the actuator assembly.','flexure',detail]]),
  f(21,[['11A','Plan of the compliant, rectangular film contact.','laminate',plan],['11B','Section through the contact frame in one direction.','laminate',end],['11C','Orthogonal section of the compliant frame.','laminate',side],['11D','The flexure plate provides support around the open scan area.','flexure',plan]]),
  f(22,[['12','Side view of both arms and the drive.','machine',side]]),
  f(23,[['13','The resilient clamp pad bears against the notched film without a laminated paper margin.','strip',iso],['14','An additional pad bears against the paper laminated to the perforated edge.','strip-paper',iso]]),
  f(24,[['15','Alternative yoke actuation of the scanner clamp.','yoke-drive',iso]]),
  f(25,[['16','Bottom plan of the yoke version.','yoke',[0,-86,1]]]),
  f(26,[['17','Exploded view of the alternate actuator and contact stack.','yoke-exploded',iso]]),
  f(27,[['18','The underside of the yoke and contact frame.','yoke',[-147,-40,1]]]),
  f(28,[['19','The yoke and the contact frame with the solenoid mounting block removed.','yoke',[-145,43,1]]]),
  f(29,[['20','Solenoid, pivot and the released contact frame in profile.','yoke-drive',side]])),
  US5812245A: record('Asynchronous motion-picture contact printer', (g,state) => {
    if (state==='control-disc' || state==='position-disc') {
      const steps=state==='control-disc'?16:24;
      const r=2.41;
      g.cylinder('support',[0,0,0],[0,0,.24],r,.27,steps);
      for(let i=0;i<steps;i++) {
        const phi=i*360/steps;
        g.around('z',[0,0,0],phi,()=>{
          g.cylinder('steel',[2.10,0,.239],[2.10,0,.27],.075);
          if(state==='position-disc' && i%2===0) g.box('moving',2.50,0,.06,.31,.19,.18);
        });
      }
      return;
    }
    const parted=['open','register'].includes(state);
    const z=parted?1.82:.95;
    g.frame('base',0,0,0,8.7,8.7,.39,.46);
    g.box('support',0,0,.47,4.97,2.39,.36);
    g.box('glass',0,0,z,4.97,2.39,.30);
    for (const x of [-2.00,2.00]) {
      shaft(g,x,0,z+.31,.18,.7,'drive');
      if (state==='register') shaft(g,x,.50,.77,.065,.20,'moving');
    }
    for (const y of [-3.26,3.26]) {
      roller(g,'film',y,1.48,.94,3.51);
      roller(g,'paper',y,2.64,.91,4.21);
    }
    g.ribbon('film',[[0,-3.27,2.44],[0,-2.50,1.10],[0,-1.17,.838],[0,1.17,.838],[0,2.50,1.12],[0,3.27,2.44]],3.40);
    g.ribbon('paper',[[0,-3.27,3.57],[0,-2.49,2.49],[0,-1.17,z-.017],[0,1.17,z-.017],[0,2.49,2.49],[0,3.27,3.57]],4.06);
    if (state==='control') {
      g.box('dark',3.46,.16,.40,1.27,1.83,.50);
      g.track('air',[[3.46,.16,.80],[3.46,1.69,.80],[3.30,2.37,1.49]],.11);
    }
  },f(3,[['1','The separately indexed transports meet at the contact-printing gate.','working',side]]),
  f(4,[['2','The platens bring both films together for printing.','working',[0,-72,1]]]),
  f(5,[['3','A clear interval between platens permits independent film advance.','open',side]]),
  f(6,[['4','Pin registration in the separated arrangement.','register',plan]]),
  f(7,[['5','Elevation through the registering portion of the gate.','register',end]]),
  f(8,[['6','The control disk provides indexed cues.','control-disc',plan],['7','The positioning disk adds peripheral vanes separated by gaps.','position-disc',plan]]),
  f(9,[['8','Controller and drive flow chart. The model shows the controller relative to the transport it synchronises.','control',iso]])),
  US5822045A: record('Film gate with long outside-margin strips', (g,state) => {
    const z=state==='open'?.91:.45;
    g.frame('base',0,0,0,6.75,7.7,.42,.70);
    for (const x of [-2.55,2.55]) g.box('support',x,0,.42,.35,7.34,.37);
    if (state==='channel') return;
    const a=state==='open'?.48:0;
    const film=Array.from({length:13},(_,i)=>{const t=i/6-1;return [0,4.06*t,.43+a*t*t*t*t];});
    g.ribbon('film',film,4.60);
    for (const x of [-2.02,2.02]) {
      g.box('moving',x,0,z,.27,6.38,.17);
      for (const y of [-2.57,2.57]) {
        g.sweep('moving',[x,y,z+.17],[x+1.35,y,1.08],.23,.14);
        g.spring('spring',[x+.31,y,z+.19],[x+.31,y,1.25],.13);
      }
    }
    if (state==='scanner') {
      g.box('dark',0,0,2.56,4.39,3.14,1.00);
      shaft(g,0,0,1.56,.68,1.01,'glass');
      for (const x of [-.98,.98]) g.sweep('light',[x,0,.44],[x*.47,0,1.55],.08);
    }
  },f(2,[['1','Perspective identifies the two long members alongside the film path.','working']]),
  f(3,[['2','The strips extend beyond the ends of the scanner aperture.','working',plan]]),
  f(4,[['3','The retracted members leave room for the curved ends of the strip.','open',end],['4A','The long strips grip the margins and flatten the middle.','working',end]]),
  f(5,[['4B','The channel and central aperture with the movable members removed.','channel',iso]]),
  f(6,[['5','The optics look through the film and the central opening.','scanner',side]]),
  f(7,[['6','The scanner retains the film gate beside the optical unit.','scanner',iso]])),
  EP0935160A1: record('Gretag format-changing transport and scanner', (g,state) => {
    const swap=state==='formatB' || state==='driveB';
    const path=state.startsWith('path');
    const shift=swap?.63:0;
    g.frame('base',0,0,0,7.8,7.75,.37,.46);
    g.box('support',0,shift,.38,6.31,4.76,.39);
    for (const s of [-1,1]) {
      const x=s*(swap?1.40:1.97);
      g.box('moving',x,shift,.77,.37,4.59,.18);
      for (const y of [-1.68,1.68]) roller(g,'steel',y+shift,1.09,.27,.89,x);
    }
    for (const y of [-2.78,2.78]) {
      roller(g,'steel',y,.57,.14,7.18);
      g.cylinder('drive',[3.2,y,.57],[4.1,y,.57],.35);
    }
    sheet(g,'film',0,shift,.956,swap?2.72:3.79,6.54);
    g.box('light',0,shift,1.22,4.51,.165,.28);
    if (path || state==='machine') {
      const y=state==='path4'?2.91:state==='path3'?2.60:2.33;
      for (const dy of [-1.95,-1.35,-.77,.0,.59,1.17]) roller(g,'drive',y+dy,1.78,.19,5.31);
      g.ribbon('film',[[0,-3.41,.95],[0,.43,.95],[0,y-1.25,1.99],[0,y,1.99],[0,3.68,1.74]],swap?2.73:3.78);
      if (state==='machine') {
        g.box('base',0,0,-2.4,8.1,7.56,2.4);
        g.frame('base',0,0,2.05,7.5,7.14,.37,.50);
        g.box('dark',1.78,-2.30,2.42,2.26,1.40,.32);
      }
    }
  },f(7,[['1','Position of the transport and optical modules in the copying unit.','machine'],['2','Roller path and film guide arrangement.','path2',side]]),
  f(8,[['3','A second transport-path condition at the scanning station.','path3',side]]),
  f(9,[['4','The transport directs the stock through the region of the scanner.','path4',side]]),
  f(10,[['5','Another position of film routing around the exchange region.','formatB',side]]),
  f(11,[['6','The change platform supports paired rollers and the two guide widths.','working']]),
  f(12,[['7','Plan shows the exchange platform between the paired drive ends.','formatB',plan]]),
  f(13,[['8','Section through the platform and drive linkage.','working',end]]),
  f(14,[['9','View across the platform and shaft supports.','driveB',side]]),
  f(15,[['10','The film scanner is housed in an integrated minilab.','machine']]),
  f(16,[['11','Film routing within the minilab system.','machine',side]])),
  US6002469A: record('Copy master tensioner with travelling counter-bearing', (g,state) => {
    const wide=state==='working';
    const disp=wide?.25:0;
    g.frame('base',0,0,0,7.47,6.81,.45,.75);
    sheet(g,'film',disp/2,0,.457,4.64+disp,7.19);
    g.box('support',-2.01,0,.43,.53,5.17,.035);
    g.box('moving',-2.01,0,wide?.461:.78,.48,4.98,.20);
    g.cylinder('support',[1.95+disp,-2.71,.29],[1.95+disp,2.71,.29],.165);
    g.box('moving',1.95+disp,0,wide?.464:.78,.47,4.98,.20);
    for (const y of [-1.82,1.82]) {
      g.track('moving',[[1.95+disp,y,.64],[2.91,y,.78],[3.40,y+.24,1.25]],.22);
      g.track('spring',[[3.3,y-.62,1.1],[2.97,y-.13,.87],[2.85,y+.37,.72]],.13,.064);
      shaft(g,3.34,y,.45,.11,.86,'steel');
    }
    g.track('moving',[[-2.05,-2.35,.70],[-2.80,-2.72,.88],[-3.41,-2.28,1.14]],.20);
  },f(2,[['1','The two sides are placed over the copying aperture.','open',iso]]),
  f(3,[['2','The moving counter-bearing travels with the second pressed margin. Its roller permits motion relative to the platen.','working',iso]]),
  f(4,[['3','Plan shows both bearings, pivot points and the transverse stroke.','working',plan]])),
};
