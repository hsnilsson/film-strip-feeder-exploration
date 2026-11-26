import { makeScene } from '../../../../film-flatness-patents/mechanism-views/assets/models/geometry.js';
import { asymmetricCup } from './cup-lip.js';
import { belt, cup, film, pile, roller, tray } from './shared.js';

const radians = (degrees) => degrees * Math.PI / 180;
const mix = (a, b, t) => a + (b - a) * t;

function cycle(camera, focus, chapters, changes, draw) {
  const stages = chapters.map(([time, figure, title, caption]) => ({ time, figure, title, caption }));
  let pose = {};
  const keyframes = changes.map(([time, values]) => [time, pose = { ...pose, ...values }]);
  const duration = keyframes.at(-1)[0];
  return {
    camera, focus, stages, duration,
    frame(time) {
      const index = Math.max(0, keyframes.findLastIndex(([start]) => start <= time));
      const [start, from] = keyframes[index];
      const [end, to] = keyframes[index + 1] ?? [start + 1, from];
      const t = Math.max(0, Math.min(1, (time - start) / (end - start)));
      const eased = t * t * (3 - 2 * t);
      const current = Object.fromEntries(Object.keys(from).map((part) => [part, mix(from[part], to[part], eased)]));
      const scene = makeScene();
      draw(scene, current);
      return scene.faces;
    },
  };
}

// Follow a route from the leading edge. Consuming arc length keeps the same sheet in view.
function feedSheet(g, route, width, length) {
  const path = [route[0]];
  let left = length;
  for (let i = 1; i < route.length && left > 0; i++) {
    const [a, b] = [route[i - 1], route[i]];
    const distance = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (distance <= 1e-8) continue;
    const ratio = Math.min(1, left / distance);
    path.push([mix(a[0], b[0], ratio), mix(a[1], b[1], ratio)]);
    left -= distance;
  }
  film(g, path, width);
}

function cassetteCarriage(g, { y, z, tilt, held, release, feed, trailingLift }) {
  const glass = .265;
  const nipY = -3.03;
  const nipZ = 1.73;
  const width = 4.37;
  const length = 4.44;
  tray(g, { y: 1.62, width: 5.15, length: 4.82, wall: .21, back: false });
  g.box('support', 0, 3.94, .24, 4.84, .17, .16);
  g.box('glass', 0, 1.72, .24, 4.53, 4.50, .024);

  for (const x of [-2.58, 2.58]) {
    g.track('support', [[x,-3.19,2.19],[x,-1.66,2.18],[x,-.78,1.66],[x,.44,1.06]], .22, .19);
    g.track('support', [[x,-3.19,1.83],[x,-1.52,1.88],[x,-.71,1.49],[x,.38,.88]], .18, .16);
    belt(g, { x, from: -3.14, to: .68, z: 2.66, radius: .15, width: .15 });
    g.sweep('moving', [x, y - .37, 2.53], [x, y, z + release], .15);
    g.cylinder('steel', [x - .13,y,z + release],[x + .13,y,z + release], .125);
  }
  roller(g, 'steel', y, z + release, .115, 5.27);
  g.around('x', [0,y,z + release], tilt, () => {
    g.box('moving', 0, y - .46, z + release - .31, 4.48, .64, .14);
    for (const x of [-1.54, 1.54]) {
      g.sweep('moving', [x,y,z + release],[x,y - .35,z + release - .29], .18);
      cup(g, x, y - .55, z + release - .67, .285);
    }
  });

  const angle = radians(tilt);
  const c = Math.cos(angle), s = Math.sin(angle);
  const rimY = y - .55 * c + .67 * s;
  const rimZ = z - .55 * s - .67 * c;
  for (const x of [-1.53, 1.53]) {
    const tip = [x, y - .16 * c + .38 * s, z + release - .16 * s - .38 * c];
    g.spring('spring', [x,y + .23,z + release + .19], tip, .095, .055, 4);
  }
  g.box('drive', 1.94, y + .13, z + release + .12, .33, .45, .25);

  const head = [mix(-.47, rimY - .36 * c, held), mix(glass, rimZ - .36 * s, held)];
  const rear = glass + trailingLift;
  const route = [
    head, [mix(-.11, rimY, held), mix(glass,rimZ,held)],
    [mix(.19, rimY + .30*c, held), mix(glass,rimZ+.30*s,held)],
    [mix(.78, rimY + .86, held), mix(glass, Math.max(rear, rimZ - .29), held)],
    [mix(1.40, rimY + 1.42, held), mix(glass, Math.max(rear, rimZ - .51), held)],
    [mix(2.20, rimY + 2.20, held), rear], [7.7, rear],
  ];
  if (feed > 0) route.unshift([head[0] - feed, head[1]]);
  feedSheet(g, route, width, length);
  for (const sign of [-1, 1]) roller(g, 'drive', nipY, nipZ + sign * .27, .266, 4.64);
}

function curlingLip(g, { y, z, bend, held, trailingLift, release, feed }) {
  const floor = .27;
  const nipY = 3.60;
  const nipZ = 1.23;
  tray(g, { y: -.50, width: 5.12, length: 5.54, wall: .37 });
  g.box('glass',0,-.55,.24,4.68,5,.029);
  g.box('support',0,2.21,.24,4.84,.18,.38);
  g.box('support',0,2.85,1.06,4.67,.60,.10);

  for (const x of [-2.54, 2.54]) {
    g.cylinder('steel', [x,-1.92,2.88],[x,3.35,2.88], .12);
    g.box('moving', x, y - .46, 2.74, .25, .61, .30);
  }
  g.box('moving',0,y - .43,2.82,5.17,.41,.19);
  for (const x of [-1.31, 1.31]) {
    asymmetricCup(g, x, y, z + release, .39, .87, bend);
    const end = [x,y,z + release + .70];
    g.track('moving', [[x,y-.43,2.84],[x,y-.69,z+release+1.06], end], .18, .16);
    g.sweep('steel',[x,y-.24,2.78],[x,y-.44,z+release+1.04],.13);
  }
  const frontZ = mix(floor, z + bend, held);
  const frontY = mix(2.02, y + .45, held);
  const route = [
    [frontY + feed, frontZ],
    [mix(1.87, y + .32, held), mix(floor, z + .83 * bend, held)],
    [mix(1.56, y, held), mix(floor,z,held)],
    [mix(1.16, y - .40, held), mix(floor,z,held)],
    [y-.91, mix(floor, Math.max(floor + trailingLift, z - .36), held)],
    [y-1.60, floor + trailingLift], [-8,floor + trailingLift],
  ];
  if (feed > 0) route.splice(1, 0, [frontY, frontZ]);
  feedSheet(g, route, 4.43, 4.96);
  for (const sign of [-1, 1]) roller(g,'drive',nipY,nipZ+sign*.257,.253,4.79);
}

const stock = .90;
const heelY = .06;
const radius = .56;
const freeLength = 1.94;
const edgeMargin = .37;
const nipY = 2.85;
const nipZ = stock + 1.18;
const followerY = .50;
const followerZ = .35;
const followerRadius = .12;
const shelfHeight = (y) => 3.14 - .15 / 1.79 * (y + .29);

function heelBend(g, { tilt, lift, travel, leveling, filmTilt, filmLift, filmTravel, gap, release, feed }) {
  const width = 5.08;
  tray(g, { y: -.72, length: 5.68, width: 5.76, wall: .47, back: false });
  pile(g, { y: -.68, z:.27, width: width + .02, length: 5.44, height:.64, sheets: 8 });
  const angle = radians(tilt);
  const pivotY = heelY + travel;
  const pivotHeight = stock + radius + lift;
  const rollerY = pivotY + followerY * Math.cos(angle) - followerZ * Math.sin(angle);
  const rollerHeight = pivotHeight + followerY * Math.sin(angle) + followerZ * Math.cos(angle);
  // Once the cam follower reaches the shelf, keep the carriage in contact as it levels.
  const correction = leveling * (shelfHeight(rollerY) - rollerHeight);
  const pivot = [0, pivotY, pivotHeight + correction];
  for (const x of [-2.79, 2.79]) {
    for (const y of [-2.84, 2.53]) g.box('support',x,y,.24,.25,.29,3.05);
    g.box('support',x,-.155,3.08,.24,5.38,.19);
    g.track('moving', [[x,-1.37,stock+1.55],[x,-.49,pivot[2]-.14],[x,pivot[1],pivot[2]]],.21);
    const shelfX = Math.sign(x) * 2.69;
    g.track('steel', [-.32,1.60].map((y) => [shelfX,y,shelfHeight(y)+followerRadius+.05]), .16, .10);
    g.around('x', pivot, tilt, () => {
      const pinY = pivotY + followerY;
      const pinZ = pivot[2] + followerZ;
      g.sweep('moving', [shelfX,pivotY,pivot[2]], [shelfX,pinY,pinZ], .14);
      roller(g, 'drive', pinY, pinZ, followerRadius, .14, shelfX);
    });
  }
  roller(g, 'steel', pivot[1], pivot[2], .127, 5.66);
  for (const x of [-1.81, 1.81]) {
    g.box('moving',x,pivot[1]-.32,stock+lift,.53,.46,.18);
    g.spring('spring',[x,pivot[1]-.34,stock+lift+.18],[x,pivot[1]-.08,pivot[2]+.19],.105,.052,4);
  }

  const lengthOnCarriage = freeLength - radius * angle;
  const cupY = pivot[1] + lengthOnCarriage - edgeMargin;
  const cupZ = pivot[2] - radius;
  g.around('x', pivot, tilt, () => {
    g.box('moving',0,cupY-.15,cupZ+.52,5.21,.39,.17);
    for (const x of [-1.94, -.65, .65, 1.94]) {
      cup(g,x,cupY,cupZ+release,.315);
      g.cylinder('steel',[x,pivot[1]+.09,cupZ+.52],[x,pivot[1]+1.76,cupZ+.52],.063);
      g.spring('spring',[x,cupY-.31,cupZ+.56],[x,cupY+.06,cupZ+.56],.096,.048,4);
    }
    for (const x of [-1.23, 1.23]) {
      g.track('spring',[[x,cupY+.075,cupZ+.45],[x,cupY+.27,cupZ+.24],
        [x,cupY+.26,cupZ+.04],[x,cupY+.18,cupZ+.013],[x,cupY+.085,cupZ+.028]],.061);
    }
  });
  g.track('dark', [[2.57,-2.63,3.19],[2.57,-1.29,3.19],[2.57,pivot[1]-.13,pivot[2]+.16]], .075);

  const bent = radians(filmTilt);
  const root = heelY + filmTravel;
  const height = stock + filmLift + correction;
  const bendEnd = [root + radius*Math.sin(bent), height + radius*(1 - Math.cos(bent))];
  const straight = freeLength - radius*bent;
  const front = [bendEnd[0] + straight*Math.cos(bent), bendEnd[1] + straight*Math.sin(bent)];
  const route = [front, bendEnd];
  for (let i = 9; i >= 0; i--) {
    const a = bent * i / 10;
    route.push([root + radius*Math.sin(a), height + radius*(1 - Math.cos(a))]);
  }
  // Fig. 11 shows the rear of the film still resting on the pack at handoff.
  for (let i = 1; i <= 12; i++) {
    const t = i / 12;
    route.push([root - 2.65 * t, mix(height, stock, t * t * (3 - 2 * t))]);
  }
  route.push([root - 6, stock]);
  if (feed > 0) route.unshift([front[0] + feed, front[1]]);
  feedSheet(g, route, width, 5.37);

  roller(g,'drive',nipY,nipZ-.235,.231,5.30);
  roller(g,'moving',nipY,nipZ+.235+gap,.231,5.30);
  g.box('support',0,3.18,nipZ-.15,5.54,.39,.13);
}

export const playback = {
  EP0512084B1: cycle([73,34,1.13], [0,.30,1.32,4.06], [
    [0,'2','Pickup','The carriage runs down the curved guide. The electromagnet places the cups against the film.'],
    [2.5,'3','Peel','With vacuum applied, spring 35 tilts plate 11. The patent gives 35° as an example. The far end still rests in the cassette.'],
    [4.25,'4','Carry','The drive reverses and the cups carry the loosened sheet up towards transport rollers 14.'],
    [6.9,'4','Handoff','The film reaches the roller pair. The cups vent and lift clear so the rollers can draw the film onward.'],
  ], [
    [0,{ y:-1.93,z:2.01,tilt:-22,held:0,release:0,feed:0,trailingLift:0 }],
    [1.45,{ y:-.80,z:1.48,tilt:-9 }],
    [2.10,{ y:.44,z:.935,tilt:0 }],
    [2.45,{ held:1 }],
    [2.60,{}],
    [3.64,{ tilt:-35 }],
    [4.25,{}],
    [5.53,{ y:-.84,z:1.74,tilt:-25,trailingLift:.55 }],
    [6.34,{ y:-1.58,z:2.01,tilt:-22,trailingLift:1.04 }],
    [6.90,{ y:-1.93 }],
    [7.22,{}],
    [7.75,{ release:.39 }],
    [9.20,{ feed:1.74 }],
  ], cassetteCarriage),

  EP0467203B1: cycle([76,32,1.08], [0,.56,1.45,4.35], [
    [0,'4','Pickup','The relaxed suction lip lands near the leading edge of the film.'],
    [1.64,'5','Curl','Vacuum lifts the thin part of the lip. This opens a gap between the film edge and the support.'],
    [2.95,'6','Clear the wall','The carrier draws the captured film back from the cassette wall before lifting higher.'],
    [4.19,'7','Lift','The suction assembly raises the same sheet over the obstruction.'],
    [5.80,'8','Handoff','The leading edge enters the feed-roll nip. The roller path carries the film onward.'],
  ], [
    [0,{ y:1.57,z:.91,bend:0,held:0,trailingLift:0,release:0,feed:0 }],
    [1.34,{ z:.27 }],
    [1.60,{ held:1 }],
    [1.82,{}],
    [2.72,{ bend:.18 }],
    [2.95,{}],
    [4.01,{ y:1.01 }],
    [4.19,{}],
    [5.58,{ z:1.16,trailingLift:.79 }],
    [5.80,{}],
    [6.61,{ y:2.56,z:1.23,bend:0,trailingLift:.96 }],
    [7.58,{ y:3.19 }],
    [7.89,{}],
    [8.28,{ release:.36 }],
    [9.51,{ feed:1.63 }],
  ], curlingLip),

  WO2004079448A1: cycle([75,28,1.15], [0,.20,1.75,4.14], [
    [0,'5','Heel contact','The pickup descends until the heel pads rest on the film pack.'],
    [1.62,'6','Pickup','The cups seal on the leading margin while the heel keeps the pack down.'],
    [2.34,'7','Pre-pump','The cup carriage makes a short bend and returns toward the pack.'],
    [3.87,'8','Separate','The carriage rotates approximately 90°. The cups slide toward the pivot as the edge bends up.'],
    [6.43,'10','Lift and align','The heel leaves the pack. The pivot rollers meet the angled shelf, which levels the leading edge above the open nip.'],
    [8.87,'11','Handoff','The upper idler closes on the film, then the cups release. The back of the sheet still rests against the pack as the rollers start pulling.'],
  ], [
    [0,{ tilt:0,lift:.72,travel:0,leveling:0,filmTilt:0,filmLift:0,filmTravel:0,gap:.28,release:0,feed:0 }],
    [1.62,{ lift:0 }],
    [2.34,{}],
    [3.11,{ tilt:26,filmTilt:26 }],
    [3.87,{ tilt:0,filmTilt:0 }],
    [5.42,{ tilt:90,filmTilt:90 }],
    [6.43,{}],
    [7.56,{ lift:1.18,filmLift:1.18,leveling:1 }],
    [8.87,{ tilt:0,filmTilt:0,travel:.94,filmTravel:.94 }],
    [9.28,{}],
    [9.83,{ gap:0 }],
    [10.07,{}],
    [10.57,{ release:.17 }],
    [12.10,{ feed:1.62 }],
  ], heelBend),
};
