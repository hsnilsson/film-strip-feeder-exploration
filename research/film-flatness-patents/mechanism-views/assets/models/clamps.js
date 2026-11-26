import { figures as f, record, sheet, roller, shaft, iso, plan, end, side, detail } from './geometry.js';
import { holderFaces } from './hoffmaster.js';

const wideFilm = (g,state) => {
  g.frame('base',0,0,0,6.83,6.11,.36,.81);
  const shift = state==='tension' || state==='four' ? .18 : 0;
  sheet(g,'film',shift/2,0,.37,4+shift,6.22);
  for (const s of [-1,1]) {
    g.sweep('moving',[s*1.82,0,1.20],[s*(1.82+shift),0,.37],.12);
    if (state==='four') g.sweep('moving',[0,s*1.94,1.20],[0,s*(1.94+shift),.37],.12);
  }
};

export const models = {
  US2824491A: {
    title: 'Hoffmaster toggle with tongue-and-slot pins',
    build: (state) => holderFaces(state === 'seated'),
    figures: f(1, [
      ['1','The two transverse hinges couple the oblong gripping bars. Each bar rotates as one rigid half with its two arms.','seated',plan],
      ['2','The toggle is raised and the rough undersides make the first film contact. Each rigid half is shown at an illustrative 18° tilt.','raised',[0,20,1]],
      ['3','The film is flat under the end arms. The long bars have wedged beneath the spring lips.','seated',[0,15,1]],
      ['4','The bar is tilted at initial contact. Rotate to look along the free edge of the flange.','raised',[0,16,1.10,[2.48,-1.9,.30,1.75]]],
      ['5','The bevel and flange meet above the pin axis with the bar pressing the film against the base.','seated',[0,13,1.10,[2.48,-1.9,.27,1.75]]],
    ]),
  },
  US4835555A: record('Progressive tensioning blade with pinned datum', (g,state) => {
    const released=state==='released' || state==='exploded' || state==='open';
    const mid=state==='first';
    const alternate=state.startsWith('alternate');
    const dz=released ? .91 : mid ? .22 : 0;
    if (state==='cam') {
      g.cylinder('drive',[0,0,.23],[0,0,.54],1.33,.24);
      g.cylinder('moving',[.54,0,.54],[.54,0,.72],.74,.17);
      g.track('spring',[[1.31,0,.4],[1.62,0,.4],[2.38,.93,.4]],.14);
      shaft(g,1.31,0,.16,.16,.44);
      return;
    }
    g.frame('base',0,0,0,6.78,7.16,.39,.79);
    sheet(g,'film',0,0,.395,4.81,7.56);
    for (const y of [-1.42,1.42]) {
      const h=released?.19:.44;
      shaft(g,-1.93,y,.15,.098,h,'moving');
    }
    g.around('x',[0,2.88,1.6],state==='open'?61:0,() => {
      g.frame('support',0,0,1.52+dz,5.38,5.4,.33,.51);
      g.box('moving',-1.95,0,.405+dz,.39,4.15,1.14-dz*.14);
      const edge=alternate?2.01:mid?1.97:2.21;
      const blade=[[1.49,1.56+dz],[1.75,1.28+dz],[2.13,.95+dz],[2.31,.74+dz],[edge,.398+(released?dz:0)]];
      for (let i=1;i<blade.length;i++) {
        const [[a,b],[x,z]]=blade.slice(i-1,i+1);
        const section=[[a,b],[x,z],[x+.075,z+.04],[a+.075,b+.04]];
        g.solid('spring',section.map(([x,z])=>[x,-2.06,z]),section.map(([x,z])=>[x,2.06,z]),false);
      }
    });
    if (['advance','exploded','open'].includes(state)) {
      for (const y of [-3.22,3.22]) roller(g,'drive',y,1.27,.39,4.88);
      g.track('steel',[[2.70,-3.02,1.15],[2.70,3.00,1.15],[3.07,3.45,1.15]],.18);
    }
  }, f(2,[['1','The film transport and projection group in elevation.','advance',side],['5','Drive gears of the transport are seen from the side.','advance',end]]),
  f(3,[['2','The hinged projection head opens to expose pin and blade.','open'],['2A','The projection head is closed and the pins start to register the film.','first',side]]),
  f(4,[['3','The projection head surrounds the positioned film.','working']]),
  f(5,[['4','Separated transport and projection head parts.','exploded',iso]]),
  f(6,[['6','The blade pulls laterally against the registered edge.','working',end],['7','The face plate withdraws to let the strip move.','released',end],['8','The outer tip of the curved blade makes the first blade contact.','first',end]]),
  f(7,[['9','Cam and follower locate the phases of the clamp.','cam',plan],['10','Timing diagram for the actuation. The scene shows the cam and follower it describes.','cam',iso]]),
  f(8,[['11','Alternative face member arrangement at the gate.','alternate'],['12','Section of the alternative member at the film.','alternate',end],['13','Second section through the alternative edge contact.','alternate',side]]),
  f(9,[['14','The alternative shuttle-type advance is separate from the flattening blade.','advance']]),
  f(10,[['15','Perspective of the second transport clamp.','alternate',iso]]),
  f(11,[['16','Section through the second clamp while pressing the film.','alternate',end],['17','The second clamp clears the film for advance.','released',end],['18','Cross section over the aperture and opposed contact edges.','alternate',side]])),
  US5028956A: record('Kodak belt-fed transverse clamp', (g,state) => {
    if (state==='press' || state==='tension') return wideFilm(g,state);
    const clamped=state==='clamped';
    const ax=-1.76;
    const filmZ=.446;
    const beltZ=.764;
    const r=.30;
    const thickness=.018;
    // Platen 3, horizontal track 4 and the transverse aperture 5.
    g.frame('base',0,0,0,6.15,7.72,.43,1.46,1.81);
    g.box('support',-2.58,0,.43,.18,5.98,.16);
    g.box('support',2.62,0,.43,.20,5.98,.17);
    for (const s of [-1,1]) {
      const y=s*3.24;
      roller(g,'steel',y,beltZ,r,.36,ax);
      const drop=.54*Math.tan(10*Math.PI/180);
      g.sweep('support',[ax,y,.37],[ax,s*3.78,.37-drop],.68,.16);
    }
    sheet(g,'film',clamped?-.06:.02,0,filmZ,4.86,7.35);
    // Belt wrap along Y. The low run is tangent to the film and bar 18 touches it for scanning.
    const belt = (radius) => [...g.arc([ax,3.24,beltZ],radius,90,-90),...g.arc([ax,-3.24,beltZ],radius,-90,-270)];
    const inner=belt(r), outer=belt(r+thickness);
    g.ribbon('dark',[...inner,inner[0]],.36);
    g.ribbon('dark',[...outer,outer[0]],.36);
    for (const x of [ax-.18,ax+.18]) {
      for(let i=0;i<outer.length;i++) {
        const j=(i+1)%outer.length;
        g.face('dark',[inner[i],inner[j],outer[j],outer[i]].map(([,y,z])=>[x,y,z]),false);
      }
    }
    if (state==='wrap') return;
    const barZ=clamped?beltZ-r:.515;
    g.box('moving',ax,0,barZ,.23,5.36,.445);
    const cyX=clamped?2.10:1.93;
    const cyZ=clamped?filmZ+.174:.86;
    g.cylinder('moving',[cyX,-2.69,cyZ],[cyX,2.69,cyZ],.174);
    g.box('moving',cyX,0,cyZ+.08,.29,5.40,.22);
    for (const y of [-1.92,1.92]) {
      const crest=clamped?1.30:1.43;
      const points=[[-2.85,y,.98],[-2.61,y,clamped?1.04:.98],[-2.30,y,clamped?1.05:.98],
        [ax-.1,y,barZ+.25],[ax+.19,y,barZ+.25],[-.93,y,crest],[cyX-.24,y,cyZ+.28],[cyX,y,cyZ+.28]];
      g.track('spring',points,.28,.066);
      g.sweep('drive',[-2.70,y,crest+.08],[-.87,y,crest+.08],.27,.16);
    }
    g.cylinder('steel',[-2.68,-2.74,1.41],[-2.68,2.76,1.41],.12);
    if (state==='drive') {
      g.cylinder('drive',[-3.18,2.83,1.63],[-2.55,2.83,1.63],.51);
      g.cylinder('drive',[-2.70,-3.24,beltZ],[-1.91,-3.24,beltZ],.29);
      g.track('moving',[[-2.59,2.74,1.41],[-2.59,2.74,1.78],[-2.59,2.24,1.91]],.23);
    }
  }, f(2,[['1','Prior-art review of downward loads around the aperture.','press'],['2','Prior-art section across the clamped film and aperture.','press',end],['3','Lateral tension principle in perspective.','tension'],['4','Section resolves downward and outward force at opposite film margins.','tension',end]]),
  f(3,[['5','Both spring arms carry both tie bars. A separate motor advances the belt around its pulleys.','drive'],['6','The lower belt run follows the working surface and wraps the pulleys at the sloped ends.','wrap',side]]),
  f(4,[['7A','During advance only the belt contacts the upper face of the film. The tie bar and far cylinder are clear.','working',end],['7B','The tie bar loads the lower belt first. The far cylinder then presses down and outward.','clamped',end]])),
  US5088813A: record('Scanner guide fingers and belt wrap', (g,state) => {
    const curl=state.startsWith('curl');
    const radius=1.43;
    if (curl) {
      const height={curlA:.76,curlB:.54,curlC:.30,curlD:.13}[state] ?? .69;
      const points=Array.from({length:17},(_,i)=>{const t=i/8-1;return [2.10*t,0,.22+height*t*t];});
      g.ribbon('film',points,4.7,[0,1,0]);
      for (const x of [-1.68,1.68]) g.box('moving',x,.02,.25+height*.64,.29,2.85,.17);
      g.box('base',0,0,0,5.18,4.86,.16);
      return;
    }
    for (const y of [-1.72,1.72]) {
      roller(g,'support',y,1.48,radius,4.34);
      roller(g,'steel',y,1.48,radius+.06,.14,-2.18);
      roller(g,'steel',y,1.48,radius+.06,.14,2.18);
    }
    for (const x of [-1.58,1.58]) {
      for (const y of [-1.78,1.78]) g.ribbon('dark',g.arc([x,y,1.48],1.48,23,158),.24);
      if (state!=='no-guide' && state!=='wrap') {
        g.track('moving',[[x,-3.17,3.21],[x,-2.17,3.10],[x,-1.43,2.97],[x,-.95,2.82]],.23,.09);
        g.track('moving',[[x,3.17,3.21],[x,2.17,3.10],[x,1.43,2.97],[x,.95,2.82]],.23,.09);
      }
    }
    g.ribbon('film',[[0,-3.12,2.46],...g.arc([0,-1.72,1.48],1.467,142,45),[0,0,2.52],...g.arc([0,1.72,1.48],1.467,135,38),[0,3.12,2.46]],3.75);
    if (state!=='wrap') g.frame('base',0,0,0,5.8,7.10,.38,.50);
  },f(2,[['1','Scanner transport with the movable guides omitted.','no-guide'],['2','The scan region sits beside the roller pair.','no-guide',side]]),
  f(3,[['3','The two movable end guides are visible with outer parts removed.','working'],['4','Belt and guide positions around a roller at the gate.','working',side]]),
  f(4,[['5','One belt wraps around the film-support roller.','wrap',side],['6','The free film end can curl as it leaves its support.','curl',iso],
    ['7A','Curl close to the unsupported end.','curlA',end],['7B','Curl at the next position along the strip.','curlB',end],['7C','Curl at an intermediate position farther into the film.','curlC',end],['7D','The more supported region has less curl.','curlD',end]])),
  US5111241A: record('Bernoulli scan gate', (g,state) => {
    g.frame('base',0,0,0,5.80,5.07,.47,.60);
    // Keep the narrow line opening clear. The film rides just above the two faces.
    for (const y of [-1.04,1.04]) g.box('support',0,y,.47,4.69,1.95,.27);
    sheet(g,'film',0,0,.81,4.35,6.22);
    g.frame('glass',0,0,1.37,5.50,4.73,.16,.29);
    for (const x of [-1.48,1.48]) for (const y of [-.77,.77]) {
      shaft(g,x,y,.70,.11,.11,'air');
      for (const sx of [-1,1]) g.sweep('air',[x,y,.80],[x+.46*sx,y,.81],.07,.046);
      if (state==='supply') g.track('air',[[x,y,.68],[x,y,.21],[0,y,.21],[0,2.65,.21]],.14);
    }
    if (state==='supply') g.track('air',[[0,2.64,.21],[1.3,2.70,.21],[2.10,3.14,.21]],.19);
    else for (const y of [-2.63,2.63]) roller(g,'moving',y,.54,.27,4.42);
  },f(2,[['1','The line aperture sits between four air outlets and the feed rollers.','working',plan]]),
  f(3,[['2','Side section shows gas turning along the film to create the thin air bearing.','working',side]]),
  f(4,[['3','The air supply branches to the four orifices below the platen.','supply',iso]])),
  US5258807A: record('Gimballed clamp with four outward strips', (g,state) => {
    if (['press','tension','four'].includes(state)) return wideFilm(g,state);
    const z=state==='open'?2.16:.56;
    const aperture=state==='plate';
    const insert=state==='insert';
    if (!insert) {
      g.frame('base',0,0,0,6.49,6.18,.39,1.35);
      for (const x of [-1.82,1.82]) for (const y of [-1.65,1.65]) shaft(g,x,y,.39,.13,.38);
      if (!aperture) sheet(g,'film',0,0,.40,3.34,5.79);
    }
    if (aperture) return;
    g.around('x',[0,-2.84,z+.13],state==='open'?34:0,() => {
      g.frame('moving',0,0,z,5.92,5.61,.32,1.06);
      for (const s of [-1,1]) {
        g.sweep('spring',[s*1.93,-1.47,z+.05],[s*1.93,1.47,z+.05],.33,.14);
        g.sweep('spring',[-1.59,s*1.59,z+.05],[1.59,s*1.59,z+.05],.33,.14);
      }
    });
    if (!insert) roller(g,'steel',-2.84,z+.13,.14,6.16);
  },f(2,[['1','Prior-art pressure diagram in perspective.','press'],['2','Prior-art trace through the aperture.','press',end],['3','Prior-art forces across two margins.','tension'],['4','Prior-art vertical and transverse force components.','tension',end]]),
  f(3,[['5','The new force arrangement grips four sides of the frame.','four'],['6','Outward grip and downward pressure act together in section.','four',end],['7','The gimballed clamp opens away from the aperture plate.','open']]),
  f(4,[['8','The selected insert lies flat in the closed position.','working'],['9','Removable aperture plate with its positioning pins.','plate']]),
  f(5,[['10','The insert carries outwardly inclined strips on four edges.','insert',iso]])),
  US5406352A: record('Two-stage flattening gate for a towed film segment', (g,state) => {
    if (state==='web') {
      sheet(g,'paper',2.38,0,.12,.67,9.95);
      for (const y of [-3.24,0,3.24]) {
        sheet(g,'film',0,y,.12,4.04,2.95);
        g.box('moving',1.89,y,.12,.68,.54,.07);
      }
      return;
    }
    const relief=state==='relief';
    const explode=state==='exploded'?1.49:0;
    const sideZ=(['partial','working'].includes(state)?.43:.97)+explode;
    const endZ=(state==='working'?.44:1.11)+explode*1.74;
    g.frame('base',0,0,0,7.0,6.78,.41,1.03,1.21);
    for(const s of [-1,1]) {
      g.sweep('support',[-2.47,s*2.77,.45],[-2.12,s*2.21,.38],.30,.13);
      g.sweep('support',[2.47,s*2.77,.45],[2.12,s*2.21,.38],.30,.13);
    }
    if (relief) return;
    const a={curlUp:.72,curlDown:-.52,partial:-.22}[state]??0;
    if (state!=='empty' && state!=='exploded') {
      const film=Array.from({length:17},(_,i)=>{const t=i/8-1;return [0,3.24*t,.424+a*t*t];});
      g.ribbon('film',film,4.45);
      sheet(g,'paper',2.68,0,.425,.55,6.66);
    }
    for (const x of [-2.00,2.00]) {
      g.box('moving',x,0,sideZ,.31,5.26,.19);
      for (const y of [-1.47,1.47]) {
        shaft(g,x,y,sideZ+.17,.106,.99,'steel');
        g.spring('spring',[x,y,sideZ+.19],[x,y,1.64+explode],.17);
      }
    }
    for (const y of [-2.02,2.02]) {
      g.box('support',0,y,endZ,3.81,.31,.21);
      g.spring('spring',[0,y,endZ+.21],[0,y,endZ+.79],.21);
    }
    g.frame('support',0,0,1.67+explode,5.39,5.58,.18,.45);
  },f(2,[['1','Negative segments are attached to a narrow tow web, with free ends between sections.','web',plan]]),
  f(3,[['2','The nest, two clamp members, guide posts and springs in an exploded arrangement.','exploded']]),
  f(4,[['3','Assembled gate and strip path.','empty',iso],['4','Reliefs at the aperture end let a curled edge pass.','relief',end]]),
  f(5,[['5','The empty gate with both members retracted.','empty',side],['6','Retracted gate with the film curled toward the clamp.','curlUp',side],['7','Retracted gate with the film curled toward the base.','curlDown',side]]),
  f(6,[['8','The longitudinal members make the first contact.','partial',side],['9','The second member finishes flattening the ends while the first keeps contact.','working',side]])),
  EP0660170A1: record('Side-first Kodak scanning gate', (g,state) => {
    if (['press','tension','four'].includes(state)) return wideFilm(g,state);
    const apart=state==='open';
    const first=state==='first';
    g.frame('base',0,0,0,6.31,6.5,.44,.75);
    sheet(g,'film',0,0,.45,4.63,6.80);
    const hold=apart?1.05:.451;
    for (const s of [-1,1]) {
      const x=s*2.47;
      g.cylinder('steel',[x,-2.71,.73],[x,2.71,.73],.13);
      g.around('y',[x,0,.73],apart?s*44:0,()=>{
        g.box('moving',x-s*.39,0,hold-(apart?.599:0),.56,5.13,.23);
        g.box('spring',x-s*.49,0,.45,.27,4.87,.10);
      });
      const y=s*2.0;
      g.box('support',0,y,(apart||first)?.89:.451,3.68,.30,.20);
      g.spring('spring',[0,y,(apart||first)?1.11:.65],[0,y,1.52],.15);
    }
    g.cylinder('drive',[2.41,-2.61,.74],[3.41,-2.61,.74],.54,.12);
    g.track('moving',[[2.33,-2.54,.74],[2.70,-2.12,1.18],[2.70,-1.31,1.18]],.17);
  },f(14,[['1','Prior-art clamping loads in perspective.','press'],['2','Downward clamping force across a section.','press',end],['3','Earlier lateral tension arrangement.','tension'],['4','Downward and outward components in cross section.','tension',end]]),
  f(15,[['5','Four-edge load example in perspective.','four'],['6','Four-edge load components in cross section.','four',end],['7','The invention separates the end pressure from the side tension.','first',iso]]),
  f(16,[['8','The side and end clamping system at the scan gate.','working']]),
  f(17,[['9','Alternative perspective showing the gated film path with the members apart.','open']]),
  f(18,[['10','Section through the long pivoting clamps and their actuator.','first',end]]),
  f(19,[['11','Released position with the film free to advance.','open',end],['12','The side bars bear outward as the end members press down.','working',end]])),
};
