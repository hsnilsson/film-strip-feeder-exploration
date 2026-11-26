import { figures as f, record, sheet, roller, shaft, iso, plan, end, side, detail } from './geometry.js';

const lens = (g,z,r=.63) => shaft(g,0,0,z,r,.18,'glass');

export const models = {
  US6020952A: record('Opposed air-bearing film scanner', (g,state) => {
    const optics = ['transmit','single','reflect','fibre'].includes(state);
    const opened=state==='grooves';
    const z=opened?1.58:.73;
    for (const y of [-.90,.90]) {
      g.box('support',0,y,0,5.37,1.65,.44);
      g.box('support',0,y,z,5.37,1.65,.43);
      for (const [x,q] of [[-1.51,y],[1.51,y],[-.71,y],[.71,y]]) {
        g.sweep('air',[x,q-.59,.445],[x,q+.59,.445],.075,.06);
        g.sweep('air',[x,q-.59,z-.013],[x,q+.59,z-.013],.075,.06);
      }
    }
    sheet(g,'film',0,0,.587,4.15,6.81);
    for (const y of [-2.46,2.46]) roller(g,'moving',y,.37,.21,4.44);
    if (!opened) {
      for (const x of [-2.34,2.34]) g.spring('spring',[x,1.07,z+.43],[x,1.07,1.67],.18);
    }
    if (optics) {
      if(['transmit','single'].includes(state)) {
        g.box('light',0,0,-1.24,1.62,1.11,.45);
        for(const x of [-.72,0,.72]) g.sweep('light',[x,0,-.79],[x*.35,0,.59],.07);
      } else {
        g.box('light',-1.61,0,2.21,.78,.81,.36);
        g.sweep('light',[-1.36,0,2.22],[0,0,.59],.10);
      }
      lens(g,1.73,.72);
      if (state==='fibre') {
        for (const x of [-.31,-.15,0,.15,.31]) g.track('air',[[x,0,1.94],[x-.31,.17,2.44],[x-1.22,1.28,2.79]],.075);
      } else shaft(g,0,0,2.05,.38,.75,'dark');
    }
  },f(2,[['1','Transmitted-light scanning through the twin air-bearing plates.','transmit']]),
  f(3,[['2','Opposed plates provide pressures above and below the film plane.','working',end],['3','The film-facing surfaces carry air-supply passages.','grooves',iso]]),
  f(4,[['4','Single-aperture scanner embodiment.','single',side]]),
  f(5,[['5','Reflective illumination arrangement.','reflect',iso]]),
  f(6,[['6','A fibre bundle collects image light from the air-supported film.','fibre',iso]])),
  US6304315B2: record('Continuous optical film printer with common shaft', (g,state) => {
    const prior=state.startsWith('prior');
    const rays=state==='optical' || state==='aperture';
    if (prior) {
      roller(g,'support',0,1,1,5.52);
      g.ribbon('film',g.arc([0,0,1],1.02,20,160),3.43);
      g.ribbon('paper',g.arc([0,0,1],1.055,20,160),3.38);
      if(state==='prior') for(const y of [-3.1,3.1]) {
        roller(g,'film',y,1.62,.83,3.46);
        roller(g,'paper',y,3.19,.78,3.46);
      }
      lens(g,3.1);
      g.sweep('light',[0,0,2.02],[0,0,3.36],.10);
      return;
    }
    for(const x of [-1.63,1.63]) {
      roller(g,'support',0,1.74,1.73,2.83,x);
      g.ribbon(x<0?'film':'paper',g.arc([x,0,1.74],1.748,-15,178),2.58);
    }
    g.cylinder('steel',[-3.18,0,1.74],[3.18,0,1.74],.19);
    if (!rays) {
      g.frame('base',0,0,-.37,6.82,6.94,.37,.42);
      for(const x of [-1.63,1.63]) for(const y of [-2.71,2.71]) roller(g,'moving',y,2.21,.42,2.72,x);
    }
    g.cylinder('glass',[0,0,4.65],[0,0,4.88],2.20,1.45,36);
    g.cylinder('glass',[0,0,3.79],[0,0,3.93],.68,0,24);
    for(const k of [-.43,-.15,.15,.43]) {
      g.track('light',[[-1.63+k,-.34,3.46],[-1.34+k,.16,4.66],[k*.43,.16,3.8],
        [1.34+k,.16,4.66],[1.63+k,-.34,3.46]],.052,.050);
    }
  },f(2,[['1','Prior art places the two emulsions together at the copying drum.','prior',side]]),
  f(3,[['2','Two side-by-side films wrap the common drum axis while the relay links their image lines.','working']]),
  f(4,[['3A','Prior-art numerical-aperture diagram. The scene locates the single copying line.','prior-aperture',end],['3B','Illumination and imaging apertures at separated film lines.','aperture',end]]),
  f(5,[['4A','The Offner relay connects conjugate lines through its mirrors.','optical',end],['4B','A second view exposes the separation of the two conjugate lines.','optical',side]]),
  f(6,[['5','Perspective of the second implementation with film paths and optical group.','working',iso]])),
  US6501530B2: record('Projector optics with film-margin heating', (g,state) => {
    const prior=state.startsWith('prior');
    const profile=state.includes('profile');
    const local=state.startsWith('gate');
    const fly=state.startsWith('fly');
    g.frame('base',0,0,0,5.25,5.94,.30,.56);
    sheet(g,'film',0,0,.31,4.02,6.36);
    for(const x of [-1.64,1.64]) for(const y of [-1.92,1.92]) {
      g.box('support',x,y,.31,.26,1.26,.19);
    }
    if (profile) {
      if(state==='prior-profileRing'){
        for(const [r,w] of [[1.79,.11],[1.32,.105],[.94,.095]]) g.cylinder('light',[0,0,.328],[0,0,.35],r,r-w);
      } else g.box('light',0,0,.32,2.55,3.31,.035);
      return;
    }
    const top=local?2.63:6.25;
    if(!local) {
      shaft(g,0,0,top,.18,.42,'light');
      g.cylinder('support',[0,0,top+.25],[0,0,top+.46],1.54,.65,32);
      if(fly) {
        for(const [x,y] of [-.48,0,.48].flatMap(x=>[-.48,0,.48].map(y=>[x,y]))) {
          for(const z of [3.82,4.33]) g.box('glass',x,y,z,.43,.43,.14);
        }
        lens(g,5.03,.91);
      }
    }
    if(state!=='gate-film') lens(g,local?1.67:2.38,local?.84:1.13);
    for(const s of [-1,1]) for(const y of [-.59,.59]) {
      const far=prior?s*.81:s*1.80;
      if(state!=='gate-film') g.track('light',[[0,y*.3,top],[s*.55,y*.75,2.49],[s*.89,y*.77,.335]],.073,.061);
      if(!prior) {
        g.box('light',far,y,.323,.27,1.03,.039);
        if (state==='gate-secondary') g.cylinder('glass',[far,y,1.32],[far,y,1.41],.36);
      }
    }
    if(fly||state==='beamB') {
      for(const s of [-1,1]) {
        const topPipe=[s*1.04,0,4.13], foot=[s*1.83,0,.34];
        if(state==='flyC') {
          g.cylinder('glass',[s*1.04,0,4.03],topPipe,.29);
          g.track('glass',[topPipe,[s*1.50,0,3.56],[s*1.95,0,2.69],[s*2.09,0,1.54],[s*1.90,0,.78]],.26,.23);
          g.sweep('light',[s*1.90,0,.78],foot,.082);
        } else {
          const z=state==='beamB'?1.58:2.96;
          g.around('y',[s*1.35,0,z],s*23,()=>g.box('glass',s*1.35,0,z,.60,.58,.16));
          g.track('light',[[0,0,top],[s*1.35,0,z],foot],.07);
        }
      }
    }
    if (state==='timing') {
      shaft(g,2.18,-1.78,.47,.62,.20,'drive');
      for(const s of [-1,1]) g.box('moving',2.18+s*.54,-1.78,.52,.31,.23,.17);
    }
  },f(2,[['1','Prior projector, its light source and film gate.','prior',iso]]),
  f(3,[['2A','Prior-art spot profile drawn on its film plane.','prior-profileRing',plan],['2B','Irradiance section. The scene shows the plane sampled by the curve.','prior-profileRing',detail]]),
  f(4,[['3','Alternate prior arrangement of the light-conditioning elements.','prior',iso]]),
  f(5,[['4','Prior transmission path in side section.','prior',side]]),
  f(6,[['5A','Earlier rectangular illumination field at the film.','prior-profile',plan],['5B','Intensity section across the same illuminated area.','prior-profile',detail]]),
  f(7,[['6A','The gate separates the projected image area from areas illuminated for margin heating.','gate-primary',iso],['6B','A transverse view of the auxiliary paths toward the film.','gate-primary',end]]),
  f(8,[['7','The timing chart links film movement, shutter and heating. The scene identifies the drive and illuminated areas.','timing']]),
  f(9,[['8','First illumination arrangement and fly’s-eye elements.','flyA',side]]),
  f(10,[['9','The traditional elliptical-reflector lamp gains separate steering optics for spill light.','beamB',side]]),
  f(11,[['10','The alternate fly’s-eye system couples spill light into pipes that end near the film margins.','flyC',iso]]),
  f(12,[['11','Targeted areas lie beside and between the image regions.','gate-film',iso],['12','Auxiliary optics direct additional light to the designated areas.','gate-secondary',end]])),
  US7106480B2: record('Film scanner with sprung focusing arm', (g,state) => {
    const paired=state==='paired';
    const screw=state==='screw';
    const media=state==='tilted'?6:0;
    const forwardSpring=state==='spring-between';
    const overhead=state==='spring-above';
    const pivot=forwardSpring||overhead?2.04:.45;
    const press=overhead?-1.21:forwardSpring?.88:2.11;
    const foot=-1.54;
    const mediaAxis=.54;
    const contact=.89;
    const joint=overhead?1.67:1.40;
    const radians=media*Math.PI/180;
    const heightAt=(x)=>(contact-mediaAxis-x*Math.sin(radians))/Math.cos(radians)+mediaAxis;
    const tilt=Math.atan2(heightAt(foot)-contact,pivot-foot)*180/Math.PI;
    g.frame('base',0,0,0,6.84,6.27,.38,.54);
    g.around('y',[0,0,mediaAxis],media,()=>{
      g.frame('support',0,0,.41,5.15,5.18,.21,.55);
      sheet(g,'film',0,0,.625,3.94,4.56);
      g.frame('support',foot,0,.63,.92,4.21,.26,.16);
      if(paired) g.frame('support',-foot,0,.63,.92,4.21,.26,.16);
    });
    g.around('y',[pivot,0,joint],tilt,()=>{
      g.box('moving',0,0,1.40,5.07,.49,.27);
      const head=(x)=>{
        g.frame('moving',x,0,contact,.88,1.14,.51,.14);
        shaft(g,x,0,1.10,.25,.15,'glass');
        g.around('y',[x,0,1.34],-40,()=>g.box('glass',x,0,1.34,.52,.43,.046));
      };
      head(foot);
      if(paired) head(-foot);
    });
    if (overhead) {
      g.sweep('support',[2.82,.44,.4],[2.82,.44,2.51],.22);
      g.sweep('support',[2.82,.44,2.51],[-1.41,.44,2.51],.20);
      shaft(g,pivot,0,joint,.16,.81,'dark');
      g.spring('spring',[press,0,1.67],[press,.36,2.48],.15);
    } else {
      shaft(g,pivot,0,.39,.16,1.01,'dark');
      const armHeight=1.40+(pivot-press)*Math.sin(tilt*Math.PI/180);
      g.spring('spring',[press,0,.55],[press,0,armHeight],.17);
    }
    if(screw || state==='assembly'){
      g.cylinder('steel',[-2.95,-2.68,.47],[2.94,-2.68,.47],.16);
      g.box('drive',.36,-2.68,.32,.71,.47,.41);
      for(let x=-2.8;x<2.8;x+=.23) g.cylinder('moving',[x,-2.68,.47],[x+.06,-2.68,.47],.166,.14,12);
    }
  },f(2,[['1','Scanner structure carries the optics and moving media holder.','assembly',iso]]),
  f(3,[['2','The optical and media-holder parts are biased together.','working',side]]),
  f(4,[['2-1','A spring and fulcrum bias the guide at the other end of the arm.','working',end],['3-1','Guide contact defines the distance from the optics to the film plane.','working',end]]),
  f(5,[['3-2','The contact guide follows the tilted reference surface.','tilted',end],['3-3','The paired view shows two focus windows and their local film-plane references.','paired',end]]),
  f(6,[['4','Alternate carrier and lens reference.','working',side],['5','A pair of capture positions can share the moving media holder.','paired',end]]),
  f(7,[['6-1','The tension device sits between the pressure guide and the rear fulcrum.','spring-between',end],['6-2','The spring and fulcrum are both above the optical arm in this alternative.','spring-above',end],['7','Lead screw and mounting block drive the relative scan motion.','screw',iso]])),
  US7210259B2: record('Sliding-lid holder with guided flattening bar', (g,state) => {
    const prior=state==='prior';
    const apart=state==='exploded' || state==='top';
    const locked=state==='locked';
    const shift=locked?.69:0;
    const z=apart?1.6:.44;
    g.frame('base',0,0,0,6.59,7.38,.42,.72);
    sheet(g,'film',0,0,.427,5.03,6.01);
    for(const s of [-1,1]){
      g.box('support',s*2.91,0,.42,.22,6.7,.16);
      if(!prior){
        g.box('dark',s*2.81,1.65,.42,.18,1.13,.10);
        g.sweep('dark',[s*2.79,1.1,.50],[s*2.79,2.1,.71],.13,.07);
      }
    }
    g.frame('moving',0,shift,z,6.39,6.93,.26,.58);
    if(prior) return;
    const barZ=apart?1.07:locked?.426:.56;
    const y=1.47+shift;
    g.box('spring',0,y,barZ,5.49,.33,.18);
    for(const x of [-2.82,2.82]){
      g.cylinder('steel',[x-.17,y,barZ+.10],[x+.17,y,barZ+.10],.13);
      g.spring('spring',[x,y,barZ+.14],[x,y,z+.47],.12);
    }
    if(state==='exploded') for(const x of [-2.76,2.76]) g.box('steel',x,1.47,1.33,.32,.33,.18);
  },f(2,[['1','Prior film holder with a fixed recess.','prior',side]]),
  f(3,[['2','Enlarged edge section of the earlier design.','prior',end]]),
  f(4,[['3','Separated base, lid and spring-mounted flatting bar.','exploded',iso]]),
  f(5,[['4','Lid and guided friction member shown in an elevated view.','top',iso]]),
  f(6,[['5A','Two parts of the holder before being brought together.','exploded',iso],['5B','The lid is placed on its base before the sliding stroke.','working',iso]]),
  f(7,[['6','Section through the initial lid position and guide slot.','working',end],['8','Section after the lid has moved and the friction member has loaded the film.','locked',end]]),
  f(8,[['7','Initial combination. The gap leaves room before the lid is slid.','working',detail]]),
  f(9,[['9','After sliding, the guided member presses the film.','locked',detail]])),
  US20240364825A1: record('Drop-in cap film holder on scanner glass', (g,state) => {
    const prior=state.startsWith('prior');
    const lifted=['exploded','prior-exploded','positive'].includes(state);
    const join=state==='join';
    const module=(offset,part)=>{
      g.frame('base',0,offset,.16,4.72,7.01,.26,.49);
      for(const y of [-2.06,0,2.06]){
        g.box('support',-1.76,offset+y,.19,.83,.25,.23);
        for(const x of [-1.73,1.73]) g.box('spring',x,offset+y,.435,.20,.83,.16);
      }
      if(part==='positive'){
        for(const y of [-2.05,0,2.05]){
          g.frame('moving',0,offset+y,lifted?1.57:.44,3.49,1.88,.25,.26);
          sheet(g,'film',0,offset+y,lifted?1.825:.695,2.84,1.37);
        }
      }else{
        const z=lifted?1.4:.182;
        sheet(g,'film',0,offset,z,3.37,6.34);
        if(prior) g.frame('moving',0,offset,lifted?2.10:.43,3.53,6.46,.22,.20);
        else g.box('glass',0,offset,lifted?2.11:.188,3.38,6.28,.16);
      }
    };
    g.box('glass',0,0,0,5.35,join?14.22:7.57,.165);
    module(join?-3.45:0,state);
    if(join) module(3.57,state);
  },f(1,[['1 cover','The abstract repeats the exploded holder, cap and film drawing.','exploded']]),
  f(2,[['1','The removable flat cap sits above the negative and its locating pads.','exploded']]),
  f(3,[['2','The holder also accepts mounted positives in its separate slots.','positive']]),
  f(4,[['3','The flat cap brings the negative into contact with the scanner glass.','working',end]]),
  f(5,[['4','A connector joins two holders end to end.','join',iso]]),
  f(6,[['5','Earlier frame and film stack in exploded view.','prior-exploded']]),
  f(7,[['6','Another earlier holder arrangement with a separable top piece.','positive',iso]]),
  f(8,[['7','Prior-art section supports the rim of the negative.','prior',end]])),
};
