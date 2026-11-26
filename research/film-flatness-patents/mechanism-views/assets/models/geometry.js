const palette = {
  base: '#aebfba', support: '#879b96', dark: '#4b6260', moving: '#e5a24f',
  spring: '#a38ab5', film: '#52b4a5', glass: '#8dbdd7', drive: '#c07756',
  light: '#e9c25d', air: '#7eacd3', paper: '#ede1bd', steel: '#d0d7d0',
};
const transparent = { film: .74, glass: .48, light: .52, air: .62 };
const tau = Math.PI * 2;
const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const add = (a, b) => a.map((value, i) => value + b[i]);
const scale = (v, factor) => v.map((value) => value * factor);
const sub = (a, b) => add(a, scale(b, -1));
const cross = ([a, b, c], [x, y, z]) => [b * z - c * y, c * x - a * z, a * y - b * x];
const unit = (v) => scale(v, 1 / (Math.hypot(...v) || 1));
const light = unit([-.5, -.6, 1]);

export function makeScene() {
  const faces = [];
  let transform = (point) => point;
  const face = (part, vertices, withEdge = true) => {
    vertices = vertices.map(transform);
    const normal = unit(cross(sub(vertices[1], vertices[0]), sub(vertices[2], vertices[0])));
    const shade = .82 + .18 * Math.abs(dot(normal, light));
    const fill = palette[part];
    if (!fill) throw new Error('Unknown model material ' + part);
    faces.push({
      vertices, fill, shade, opacity: transparent[part] ?? 1,
      edge: withEdge && !transparent[part] ? '#384947' : undefined,
    });
  };

  const solid = (part, start, end, outlines = true) => {
    face(part, start);
    face(part, end);
    for (let i = 0; i < start.length; i++) {
      const j = (i + 1) % start.length;
      face(part, [start[i], start[j], end[j], end[i]], outlines);
    }
  };

  const box = (part, x, y, z, w, d, h) => {
    const section = [[x-w/2,y-d/2], [x+w/2,y-d/2], [x+w/2,y+d/2], [x-w/2,y+d/2]];
    solid(part, section.map(([x,y]) => [x,y,z]), section.map(([x,y]) => [x,y,z+h]));
  };

  const frame = (part, x, y, z, w, d, h, tx, ty = tx) => {
    for (const s of [-1, 1]) {
      box(part, x+s*(w-tx)/2, y, z, tx, d, h);
      box(part, x, y+s*(d-ty)/2, z, w-2*tx, ty, h);
    }
  };

  const sweep = (part, a, b, width, height = width) => {
    const v = unit(sub(b, a));
    const n = unit(cross(v, Math.abs(v[2]) < .99 ? [0,0,1] : [0,1,0]));
    const m = cross(n, v);
    const offsets = [[-1,-1],[1,-1],[1,1],[-1,1]]
      .map(([y,z]) => add(scale(n, y*width/2), scale(m, z*height/2)));
    solid(part, offsets.map((off) => add(a, off)), offsets.map((off) => add(b, off)));
  };

  const cylinder = (part, a, b, radius, inner = 0, steps = 24) => {
    const v = unit(sub(b, a));
    const n = unit(cross(v, Math.abs(v[2]) < .99 ? [0,0,1] : [0,1,0]));
    const m = cross(v, n);
    const ring = (at, r) => Array.from({ length: steps }, (_, i) =>
      add(at, add(scale(n, r*Math.cos(tau*i/steps)), scale(m, r*Math.sin(tau*i/steps)))));
    const f = ring(a, radius);
    const g = ring(b, radius);
    if (!inner) {
      solid(part, f, g, false);
      return;
    }
    const u = ring(a, inner);
    const w = ring(b, inner);
    for (let i = 0; i < steps; i++) {
      const j = (i + 1) % steps;
      face(part, [f[i], f[j], g[j], g[i]], false);
      face(part, [u[i], u[j], w[j], w[i]], false);
      face(part, [f[i], u[i], u[j], f[j]], false);
      face(part, [g[i], w[i], w[j], g[j]], false);
    }
  };

  const ribbon = (part, points, width, across = [1,0,0]) => {
    const half = scale(across, width/2);
    for (let i = 1; i < points.length; i++) {
      const a = points[i-1], b = points[i];
      face(part, [sub(a, half), add(a, half), add(b, half), sub(b, half)], false);
    }
  };

  const arc = (center, radius, from, to, steps = 24) => Array.from({ length: steps+1 }, (_, i) => {
    const angle = (from+(to-from)*i/steps)*Math.PI/180;
    return [center[0],center[1]+radius*Math.cos(angle),center[2]+radius*Math.sin(angle)];
  });

  const track = (part, points, width, height = width) => {
    for (let i = 1; i < points.length; i++) sweep(part, points[i-1], points[i], width, height);
  };

  const spring = (part, a, b, radius, wire = .065, coils = 5) => {
    const v = unit(sub(b, a));
    const n = unit(cross(v, Math.abs(v[2]) < .99 ? [0,0,1] : [0,1,0]));
    const m = cross(v, n);
    const size = 12 * coils;
    const points = Array.from({ length: size+1 }, (_, i) => {
      const theta = tau*coils*i/size;
      return add(add(a, scale(sub(b, a), i/size)), add(scale(n, radius*Math.cos(theta)), scale(m, radius*Math.sin(theta))));
    });
    track(part, points, wire);
  };

  const around = (axis, at, degrees, draw) => {
    const previous = transform;
    const a = degrees * Math.PI / 180;
    const s = Math.sin(a), c = Math.cos(a);
    transform = (point) => {
      const [x,y,z] = sub(point, at);
      const rotated = axis === 'x' ? [x,y*c-z*s,y*s+z*c] :
        axis === 'y' ? [x*c+z*s,y,z*c-x*s] : [x*c-y*s,x*s+y*c,z];
      return previous(add(rotated, at));
    };
    try { draw(); } finally { transform = previous; }
  };

  return { faces, face, solid, box, frame, sweep, cylinder, ribbon, arc, track, spring, around };
}

// The records give source-specific states and cameras. Dimensions in the scenes are schematic.
export function figures(page, rows) {
  return rows.map(([label, caption, state = 'working', camera = iso]) => ({ page, label, caption, state, camera }));
}

export const iso = [33, 49, 1];
export const plan = [0, 86, 1];
export const end = [0, 16, 1];
export const side = [86, 16, 1];
export const detail = [30, 39, 1.12];

export function record(title, draw, ...pages) {
  return { title, figures: pages.flat(), build(state) {
    const scene = makeScene();
    draw(scene, state);
    return scene.faces;
  } };
}

export function sheet(scene, part, x, y, z, width, length) {
  scene.ribbon(part, [[x,y-length/2,z], [x,y+length/2,z]], width);
}

export function roller(scene, part, y, z, radius, width, x = 0) {
  scene.cylinder(part, [x-width/2,y,z], [x+width/2,y,z], radius);
}

export function shaft(scene, x, y, z, radius, height, part = 'steel') {
  scene.cylinder(part, [x,y,z], [x,y,z+height], radius);
}

export function bow(scene, part, x, halfLength, z, rise, width = .17) {
  const points = Array.from({ length: 17 }, (_, i) => {
    const t = i/8-1;
    return [x, halfLength*t, z+rise*(1-t*t)];
  });
  scene.track(part, points, width, .055);
}
