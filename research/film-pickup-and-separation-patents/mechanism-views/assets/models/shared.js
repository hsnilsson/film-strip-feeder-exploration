export { figures as f, record, sheet, roller, shaft, bow, iso, plan, end, side, detail } from '../../../../film-flatness-patents/mechanism-views/assets/models/geometry.js';
import { roller } from '../../../../film-flatness-patents/mechanism-views/assets/models/geometry.js';

export function pile(g, { x = 0, y = 0, z = .28, width = 4.5, length = 4.8, height = .72, sheets = 8, part = 'paper' } = {}) {
  const spacing = height/sheets;
  for (let i=0;i<sheets;i++) g.box(part,x,y,z+i*spacing,width,length,spacing*.80);
  return z+height;
}

export function tray(g, { x = 0, y = 0, z = 0, width = 5.3, length = 5.6, wall = .88, back = true } = {}) {
  g.box('base',x,y,z,width,length,.24);
  for (const s of [-1,1]) g.box('support',x+s*(width/2-.11),y,z+.24,.22,length,wall);
  if (back) g.box('support',x,y-length/2+.11,z+.24,width-.44,.22,wall);
}

// A hollow elastomer skirt connects the sealing rim to the rigid inlet and stem.
export function cup(g,x,y,z,r=.38, part='spring') {
  const ring=(radius,height)=>Array.from({length:20},(_,i)=>{
    const theta=i*Math.PI/10;
    return [x+radius*Math.cos(theta),y+radius*Math.sin(theta),z+height];
  });
  const rings=[ring(r,0),ring(r*.88,.07),ring(r*.46,.26),ring(r*.46,.34),
    ring(r*.23,.34),ring(r*.30,.21),ring(r*.78,0)];
  rings.push(rings[0]);
  for(let band=1;band<rings.length;band++){
    for(let i=0;i<20;i++){
      const j=(i+1)%20, a=rings[band-1], b=rings[band];
      g.face(part,[a[i],a[j],b[j],b[i]],false);
    }
  }
  g.cylinder('steel',[x,y,z+.32],[x,y,z+.74],r*.23,r*.115);
}

export function belt(g,{ x=0, from=-1.5, to=1.5, z=1, radius=.25, width=1, part='dark', drive='drive' }={}) {
  roller(g,drive,from,z,radius,width,x);
  roller(g,drive,to,z,radius,width,x);
  const path=[...g.arc([x,to,z],radius+.018,90,-90,16),...g.arc([x,from,z],radius+.018,-90,-270,16)];
  g.ribbon(part,[...path,path[0]],width+.025);
}

export function film(g, points, width=4.45, part='film', x=0) {
  g.ribbon(part,points.map(([y,z])=>[x,y,z]),width);
}

export function jet(g, start, finish, width=.074) {
  const neck=finish.map((n,i)=>n*.79+start[i]*.21);
  g.sweep('air',start,neck,width);
  const [x,y,z]=neck;
  g.solid('air',[[x-width*1.35,y,z],[x+width*1.35,y,z],[x+width*1.35,y,z+width],[x-width*1.35,y,z+width]],
    Array(4).fill(finish),false);
}

export function gear(g,x,y,z,r,width=.18,part='drive') {
  roller(g,part,y,z,r,width,x);
  for(let i=0;i<18;i++){
    const a=i*Math.PI/9;
    const b=(rr)=>[x,y+rr*Math.cos(a),z+rr*Math.sin(a)];
    g.sweep(part,b(r-.024),b(r+.078),.16,.12);
  }
}
