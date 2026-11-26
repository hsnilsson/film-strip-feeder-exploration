import { f, record, sheet, roller, shaft, end, side, iso, plan, detail, pile, tray, film, cup, belt, jet, gear } from './shared.js';

function airKnife(g,y,z,{ auxiliary=false, fluffer=true, away=-1, alternative=false }={}) {
  g.box('support',0,y,z-.30,5.01,.52,.50);
  g.box('air',0,y+away*.26,z-.04,4.64,.075,.10);
  for(const x of [-2.03,-1.23,-.40,.40,1.23,2.03]){
    const target=alternative?x*.47:x*.30;
    jet(g,[x,y+away*.28,z],[target,y+away*1.57,z+.35],.09);
    if(fluffer) jet(g,[x,y+away*.29,z-.20],[x,y+away*.88,z+.043],.065);
  }
  if(auxiliary) for(const x of [-1.54,1.54]){
    jet(g,[x,y+away*.29,z-.22],[x*.31,y+away*.85,z+.04],.13);
  }
}

function vacuumDeck(g,y,z,{ split=false, length=1.2 }={}) {
  const lanes=split?[-1.63,1.63]:[-1.57,-.54,.54,1.57];
  g.box('support',0,y,z-.11,4.67,length+.35,.45);
  for(const x of lanes) {
    belt(g,{x,from:y-length/2,to:y+length/2,z,radius:.28,width:split?1.20:.77});
    for(let yy=y-length/2+.15;yy<y+length/2;yy+=.24) {
      shaft(g,x,yy,z-.302,.052,.015,'air');
    }
  }
  g.box('spring',0,y,z-.36,.52,length,.15);
  g.track('air',[[0,y,z+.24],[0,y,z+.82],[.68,y,z+.99],[1.61,y,z+.99]],.14);
}

export const models = {
  US4451028A: record('Dual-plenum feeder and converging rear air knife',(g,state)=>{
    const knifeOnly=['knife','footprint','airflow','alternative'].includes(state);
    if(knifeOnly){
      airKnife(g,0,.43,{away:1, alternative:state==='alternative'});
      if(state==='footprint') {
        g.box('paper',0,1.33,.39,5.1,2.45,.038);
        g.cylinder('air',[0,1.17,.43],[0,1.17,.46],.63,0);
      }
      return;
    }
    const moving=state==='overlap'||state==='delivery';
    tray(g,{y:-.15,wall:.76});
    const stock=pile(g,{y:-.27,height:.60});
    const headZ=1.56;
    airKnife(g,-2.97,stock+.08,{away:1});
    g.box('support',0,-1.91,1.13,4.65,.79,.44);
    g.box('spring',0,-1.92,1.07,.60,.69,.12);
    g.track('air',[[0,-1.90,1.50],[0,-1.90,2.42],[1.11,-1.25,2.46],[1.11,.95,2.46],[1.11,.95,2.00]],.16);
    vacuumDeck(g,1.07,headZ,{split:true,length:1.58});
    if(state==='valve') shaft(g,1.12,1.07,2.05,.26,.43,'moving');
    const rise=stock+.32;
    if(!moving) film(g,[[-2.59,1.12],[-1.89,1.145],[-.9,stock],[.38,rise],[1.60,headZ-.295],[2.14,headZ-.295]],4.47,'paper');
    else {
      film(g,[[-1.40,rise],[.10,1.238],[1.31,headZ-.294],[2.76,1.30],[3.73,1.30]],4.46,'paper');
      film(g,[[-2.59,1.12],[-1.89,1.145],[-.9,stock],[.30,stock]],4.45,'paper');
    }
    for(const z of [1.03,1.57]) roller(g,'drive',3.31,z,.26,4.72);
  },f(1,[['1 cover','Cover illustration of the two separately supplied vacuum plenums.','acquire',side]]),
  f(2,[['1','The rear plenum acquires and the forward plenum transports. The air knife feeds the rear edge.','acquire',iso]]),
  f(3,[['2A','Both plenums hold the first sheet at the start of transport.','acquire',side],
    ['2B','The first sheet advances while the rear plenum acquires the following one.','overlap',side]]),
  f(4,[['3A','Front plenum, perforated belts and projecting corrugation member.','overlap',end],
    ['3B','The other section shows the rear plenum corrugation member.','acquire',[-177,21,1]]]),
  f(5,[['4','The front plenum valve controls when the belt develops suction at the sheet.','valve',side]]),
  f(6,[['5','Front view of transport belts and sheet crossing the tray.','delivery',end],
    ['6','Manifold nozzles converge laterally toward the middle of the rear edge.','knife',plan],
    ['11','Additional fluffer openings sit below the main converging row.','knife',end]]),
  f(7,[['7A','Flow diagram showing lateral convergence of the jet paths.','airflow',plan],
    ['7B','Side diagram of the resulting spread in the vertical direction.','airflow',side],
    ['8','Alternative manifold concentrates airflow through differently aimed outlets.','alternative',iso]]),
  f(8,[['9','Pressure-region comparison with the straight air knife. The model shows the converging outlet geometry.','knife',iso],
    ['10','Illustrative pressure footprint at the upper sheet edges.','footprint',plan]])),

  US4627605A: record('Front air knife with auxiliary downcurl jets',(g,state)=>{
    const auxiliary=['detail','flow','outline','downcurl'].includes(state);
    if(['flow','outline'].includes(state)){
      airKnife(g,0,.40,{auxiliary:true});
      return;
    }
    tray(g,{y:-1.00,length:5.75,wall:1.00});
    const top=pile(g,{y:-.95,height:.76,length:5.38});
    const radius=.32;
    const z=1.65;
    vacuumDeck(g,.53,z,{length:2.18});
    airKnife(g,1.95,top+.06,{auxiliary:true});
    const bend=state==='downcurl'?.24:.025;
    film(g,[[-3.59,top],[-.93,top],[-.21,z-radius-.03],[.91,z-radius-.035],
      [1.40,top+.20],[1.69,top+.08-bend]],4.52,'paper');
    for(const x of [-2.14,2.14]) {
      g.sweep('moving',[x,1.72,.71],[x,1.77,1.08],.17,.26);
      if(auxiliary) jet(g,[x*.90,1.652,top-.14],[x*.73,1.08,top+.07],.095);
    }
    for(const rr of [.98,1.59]) roller(g,'drive',3.32,rr,.29,4.76);
    if(state==='machine') g.frame('base',0,1.32,-.56,5.87,10.31,.56,.65);
  },f(1,[['2 cover','Cover section through the front air knife and vacuum belt.','downcurl',side]]),
  f(2,[['1','The document feed tray and exit path in the host copying machine.','machine',side]]),
  f(3,[['2','The front air knife lifts the leading edge to the vacuum belts, including curled stock.','downcurl',side]]),
  f(4,[['3','End view of the perforated belts and centre corrugation member.','detail',end],
    ['6','One auxiliary nozzle aims at the troublesome downcurl region.','outline',detail],
    ['7A','Plan diagram of converging jet paths.','flow',plan],
    ['7B','Lateral convergence causes the stream to spread vertically.','flow',side]]),
  f(5,[['4','Front view of the converging slot, fluffer openings and auxiliary outlets.','outline',end],
    ['5','Plan section through the laterally aimed nozzles.','outline',plan]])),

  US4979729A: record('Film sucker with an air-admission channel',(g,state)=>{
    const machine=state==='machine';
    const detail=!['machine','pair'].includes(state);
    const suction=['suction','section7','section8'].includes(state);
    const alternate=['underside2','section7','section8'].includes(state);
    const z=detail?.40:1.07;
    const head=(x,y)=>{
      cup(g,x,y,z,detail?.85:.43);
      const span=detail?.56:.28;
      if(alternate) {
        for(const s of [-1,1]) g.sweep('moving',[x+s*span*.56,y-span,z+.11],[x+s*span*.54,y+span,z+.02],.135,.14);
      } else {
        g.box('moving',x,y+.04,z+.12,span*.36,span*1.48,.14);
        g.box('moving',x,y-span*.67,z+.085,span*.44,span*.36,.10);
      }
    };
    if(detail) {
      head(0,0);
      if(state==='contact'||suction) {
        const across=[-1.28,-.82,-.39,-.18,0,.18,.39,.82,1.28];
        g.ribbon('film',across.map(x=>[x,0,z-(suction?0:.025)+(suction?.17*Math.max(0,1-Math.abs(x)/.38):0)]),2.04,[0,1,0]);
      }
      if(suction) jet(g,[0,1.35,z+.075],[0,.43,z+.105],.10);
      return;
    }
    tray(g,{length:5.28});
    pile(g,{length:4.8,height:.79,part:'film'});
    for(const x of [-1.35,1.35]) {
      head(x,1.87);
      g.cylinder('steel',[x,1.87,z+.70],[x,1.87,z+1.04],.105);
    }
    roller(g,'moving',1.88,2.19,.17,4.68);
    g.box('support',0,2.48,.27,5.11,.21,.80);
    if(machine) for(const zz of [1.13,1.61]) roller(g,'drive',3.09,zz,.23,4.58);
  },f(1,[['1 cover','Cover perspective of the supply, sucker pair and forward transport.','machine',iso]]),
  f(2,[['1','The two suckers acquire the front margin behind the stop.','machine',iso],
    ['2','One sucker seals near the film edge. The local lip geometry creates the vent.','pair',detail]]),
  f(3,[['3','Plan of the cup, whose axis is above the film edge.','top',plan],
    ['4','Underside shows the shaping feature inside the circular seal.','underside',[0,-85,1]],
    ['5A','The lip and film are separate immediately before suction.','contact',end],
    ['5B','The captured film arches locally and admits air at its edge.','suction',end],
    ['6','The alternative cup has a channel between two wedge portions.','underside2',[0,-85,1]],
    ['7','Section along one plane of the alternative cup and the displaced film.','section7',end],
    ['8','Orthogonal section along the air-entry channel.','section8',side]])),

  EP0512084B1: record('Tilting suction plate on a belt-driven carriage',(g,state)=>{
    const transfer=state==='transfer';
    const peeled=state==='peel';
    const cassetteAngle=-12, pivotZ=.58, pivotY=-.32;
    const cassetteTilt=cassetteAngle*Math.PI/180;
    const surface=(y)=>pivotZ+(y-pivotY)*Math.tan(cassetteTilt)+.02/Math.cos(cassetteTilt);
    g.around('x',[0,pivotY,pivotZ],cassetteAngle,()=>{
      tray(g,{z:.34,y:pivotY,width:5.48,length:4.94,wall:.45});
      if(!peeled&&!transfer) sheet(g,'film',0,pivotY,.60,4.85,4.46);
      g.box('glass',0,pivotY,.58,4.87,4.50,.018);
    });
    for(const x of [-2.63,2.63]) {
      g.track('support',[[x,-2.67,2.25],[x,-.44,2.25],[x,.64,1.94],[x,1.96,1.30]],.35,.23);
      g.track('dark',[[x,-2.67,2.44],[x,-1.08,2.44],[x,.42,2.44],[x,1.83,1.95]],.10);
    }
    const contactY=transfer?-.34:1.45;
    const contactZ=transfer?1.63:peeled?.68:surface(contactY);
    const angle=transfer?-2:peeled?17:cassetteAngle;
    const axle=1.52+contactZ*.49;
    roller(g,'steel',contactY,axle,.12,5.38);
    g.box('moving',0,contactY,axle-.12,5.12,.64,.31);
    g.around('x',[0,contactY,contactZ+.42],angle,()=>{
      for(const x of [-1.55,1.55]) cup(g,x,contactY,contactZ,.34);
      g.box('moving',0,contactY,contactZ+.48,4.43,.91,.16);
    });
    for(const x of [-1.55,1.55]) {
      g.sweep('moving',[x,contactY,axle],[x,contactY-.29,contactZ+.62],.18);
      g.spring('spring',[x,contactY-.56,contactZ+.58],[x,contactY,axle],.12);
    }
    if(peeled||transfer) film(g,[[-2.64,transfer?1.22:surface(-2.64)],[-1.53,transfer?1.33:surface(-1.53)],
      [-.49,transfer?1.53:surface(-.49)],[contactY-.11,contactZ],
      [contactY+.46,contactZ+.15]],4.75);
    for(const z of [1.35,1.81]) roller(g,'drive',-2.91,z,.22,4.75);
  },f(10,[['1','Perspective shows the carriage, belt and tilting cup plate.','overview',iso]]),
  f(11,[['2','At first contact the carrier presents the cup plate toward the opened cassette.','contact',side]]),
  f(12,[['3','Spring-driven tilt bends the exposed film edge up. A rigid floor would prevent this motion.','peel',side]]),
  f(13,[['4','The carriage returns up the guides to bring the film into the transport rollers.','transfer',side]])),

  EP0467203B1: record('Asymmetric cup for curling X-ray film',(g,state)=>{
    const cupOnly=['cup','bottom','section'].includes(state);
    const curled=['curl','back','lift','transport','linkage'].includes(state);
    const y={back:1.06,lift:1.06,transport:2.39}[state]??1.58;
    const base=.27;
    const z=cupOnly?.12:state==='lift'?1.03:state==='transport'?1.15:base;
    const r=cupOnly?1.6:.55;
    const scale=cupOnly?2.4:1;
    const head=(x)=>{
      // The thin half can rise locally while the opposite half retains the cup shape.
      const ring=(radius,h,flex)=>Array.from({length:32},(_,i)=>{
        const angle=i*Math.PI/16, sy=Math.sin(angle);
        const elevation=curled&&flex?Math.max(0,sy)*.17:0;
        return [x+radius*Math.cos(angle),(cupOnly?0:y)+radius*sy,z+h*scale+elevation];
      });
      const rows=[ring(r,0,true),ring(r*.86,.11,false),ring(r*.40,.48,false),ring(r*.23,.48,false),
        ring(r*.34,.21,false),ring(r*.80,.028,true)];
      rows.push(rows[0]);
      for(let j=1;j<rows.length;j++) for(let i=0;i<32;i++){
        const next=(i+1)%32;
        g.face('spring',[rows[j-1][i],rows[j-1][next],rows[j][next],rows[j][i]],false);
      }
      g.cylinder('steel',[x,cupOnly?0:y,z+.43*scale],[x,cupOnly?0:y,z+.90*scale],r*.22,r*.12);
    };
    if(cupOnly) { head(0);return; }
    tray(g,{z:0,y:-.42,length:5.25,wall:.20});
    sheet(g,'glass',0,-.56,.243,4.84,4.64);
    g.box('support',0,2.34,.24,5.17,.20,.42);
    if(state==='code') {
      roller(g,'support',-.21,2.64,.66,3.36);
      for(let i=0;i<8;i++) g.around('x',[0,-.21,2.64],i*45,()=>g.box('dark',0,-.21,3.28,2.99,.13,.06));
    }
    for(const x of [-1.34,1.34]) {
      head(x);
      g.track('moving',[[x,y,z+.68],[x,y-.49,z+1.02],[x,y-1.40,z+1.19]],.20);
    }
    if(curled) {
      film(g,[[-2.73,base],[-1.4,base],[y-1.15,base+(z-base)*.42],[y-.28,z],[y+.39,z+.085],[y+.62,z+.163]],4.67);
    } else sheet(g,'film',0,-.43,base,4.64,4.89);
    for(const zz of [.80,1.39]) roller(g,'drive',3.52,zz,.28,4.87);
    if(['mechanism','multiple','linkage'].includes(state)) {
      roller(g,'steel',-.28,2.41,.16,5.22);
      for(const x of [-1.35,1.35]) {
        g.sweep('moving',[x,-.28,2.41],[x,y-.15,z+.85],.24,.19);
        g.sweep('support',[x,-.53,1.94],[x,y-.36,z+.73],.19,.16);
      }
    }
  },f(10,[['1','Side elevation of the cup and inlet stem.','cup',side],
    ['2','The annular seal viewed from beneath. The thin arcuate portion faces the edge to be lifted.','bottom',[0,-86,1]],
    ['3','Section through the stem and asymmetric elastomer lip.','section',end]]),
  f(11,[['4','The relaxed suction cups land near the leading margin in the open cassette.','contact',side]]),
  f(12,[['5','Vacuum deforms the thin lip and curls the film edge, admitting air between the sheets.','curl',side]]),
  f(13,[['6','The cup shifts away from the obstruction before lifting higher.','back',side]]),
  f(14,[['7','The captured sheet lifts above the obstruction.','lift',side]]),
  f(15,[['8','The raised film leads into the transport rollers.','transport',side]]),
  f(16,[['9','Side view of the driven linkage that translates and lifts the head.','mechanism',side]]),
  f(17,[['10','Multiple pickup cups share the crosswise carrier.','multiple',plan]]),
  f(18,[['11','The developed position-code pattern indexes the pickup shaft. The scene shows its drum.','code',iso],
    ['12','Side linkage supports and guides the stem of one cup.','linkage',detail]])),

  EP1197450B1: record('Timed air pulse and perforated suction belts',(g,state)=>{
    const pulse=state==='pulse'||state==='ports';
    const moving=state==='transport';
    tray(g,{y:-1.01,width:5.51,length:5.69,wall:.73});
    const z=pile(g,{y:-.91,length:5.35,height:.67});
    vacuumDeck(g,.67,1.63,{length:2.3});
    g.box('support',0,1.82,.58,4.97,.52,.73);
    for(const s of [-1,1]){
      g.track('air',[[s*2.27,2.51,.54],[s*2.27,2.02,.82],[s*1.49,1.70,1.13]],.16);
      if(pulse) for(const dx of [-.3,0,.3]) jet(g,[s*1.48+dx,1.61,1.12],[s*1.41+dx,.78,z+.35]);
    }
    const source=[[-3.58,z],[-1.28,z],[.08,pulse||moving?1.33:z],[1.34,pulse||moving?1.338:z]];
    if(moving) source.push([2.12,1.34],[3.49,1.34]);
    film(g,source,4.46,'paper');
    for(const h of [1.11,1.57]) roller(g,'drive',2.97,h,.22,4.78);
    if(state==='machine') g.frame('base',0,0,-.22,5.91,8.91,.39,.63);
  },f(7,[['1','Side arrangement of the stack tray and downstream feed.','machine',side]]),
  f(8,[['2','Plan locates the suction belts across the sheet path.','transport',plan]]),
  f(9,[['3','The air knife directs a pulse into the top of the stack before the belt feeds.','pulse',side]]),
  f(10,[['4','Close section shows the positive air duct and the vacuum path through the belts.','pulse',detail]]),
  f(11,[['5','End view of the pickup device and its vacuum supply.','transport',end],
    ['6','End view of the separation air outlets and pickup clearance.','ports',end]])),
};
