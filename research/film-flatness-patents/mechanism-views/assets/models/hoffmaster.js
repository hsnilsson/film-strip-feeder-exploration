const materials = {
  frame: { top: '#c4d1cc', side: '#84978f', edge: '#536962' },
  flange: { top: '#998baa', side: '#756485', edge: '#62506c' },
  toggle: { top: '#efac5e', side: '#ca8240', edge: '#774921' },
  pin: { top: '#fae2ac', side: '#d4a15e', edge: '#774921' },
};

// All geometry is illustrative. X runs across the film, Y along it, and Z up.
export function holderFaces(seated) {
  const faces = [];

  function prism(section, fromY, toY, material) {
    const near = section.map(([x, z]) => [x, fromY, z]);
    const far = section.map(([x, z]) => [x, toY, z]);
    faces.push({ vertices: near, fill: material.side, edge: material.edge });
    faces.push({ vertices: far, fill: material.side, edge: material.edge });
    for (let i = 0; i < section.length; i++) {
      const next = (i + 1) % section.length;
      const dx = section[next][0] - section[i][0];
      const dz = section[next][1] - section[i][1];
      faces.push({
        vertices: [near[i], near[next], far[next], far[i]],
        fill: -dx >= Math.abs(dz) ? material.top : material.side,
        edge: material.edge,
      });
    }
  }

  function box(left, right, front, back, bottom, top, material) {
    prism([[left, bottom], [right, bottom], [right, top], [left, top]], front, back, material);
  }

  // The strip is trapped between a rough foot and the base, under the free flange lip.
  const surfaceZ = .045;
  const halfAngle = seated ? 0 : Math.PI / 10;
  const cos = Math.cos(halfAngle);
  const sin = Math.sin(halfAngle);
  const grip = [[2.12, -.06], [2.49, -.06], [2.53, .16], [2.42, .27], [2.12, .21]];
  const strut = [[.30, -.06], [2.30, -.06], [2.30, .20], [.30, .20]];
  const jointEnd = [[-.09, -.06], [.30, -.06], [.30, .20], [-.09, .15]];
  const jointZ = surfaceZ - Math.min(...grip.map(([x, z]) => -x * sin + z * cos));
  const orient = ([x, z]) => [x * cos + z * sin, jointZ - x * sin + z * cos];
  const rigidSide = (section, side, from, to) => {
    const oriented = section.map(orient).map(([x, z]) => [side * x, z]);
    prism(side < 0 ? oriented.reverse() : oriented, from, to, materials.toggle);
  };

  // The flange lip meets the bar bevel at its inner tip in both poses.
  const tipX = 2.42;
  const [outerX, outerZ] = orient(grip[2]);
  const [innerX, innerZ] = orient(grip[3]);
  const lipZ = innerZ + (outerZ - innerZ) * (tipX - innerX) / (outerX - innerX);

  // Four rails form the base. The free end of each spring flange yields under the bevel.
  for (const side of [-1, 1]) {
    const rail = [side * 1.75, side * 3.12].sort((a, b) => a - b);
    const end = [side * 2.42, side * 3.50].sort((a, b) => a - b);
    const belowPin = [side * 2.42, side * 2.77].sort((a, b) => a - b);
    box(...rail, -3.50, 3.50, -.22, 0, materials.frame);
    box(-1.75, -.25, ...end, -.22, 0, materials.frame);
    box(.25, 1.75, ...end, -.22, 0, materials.frame);
    box(-.25, .25, ...belowPin, -.22, 0, materials.frame);
    const flange = [
      [[tipX, lipZ], [2.51, lipZ], [2.54, lipZ + .055], [tipX, lipZ + .055]],
      [[2.51, lipZ], [2.73, .06], [2.76, .12], [2.54, lipZ + .055]],
      [[2.73, .06], [3.00, .06], [3.00, .12], [2.76, .12]],
    ];
    for (const section of flange) {
      const mirrored = section.map(([x, z]) => [side * x, z]);
      prism(side < 0 ? mirrored.reverse() : mirrored, -2.92, 2.92, materials.flange);
    }
    rigidSide(grip, side, -2.88, 2.88);
  }

  // Nearly the same projected width in both states. The bow is exaggerated for legibility.
  const filmWidth = seated ? 2.60 : 2.59;
  const filmZ = (x) => surfaceZ + (seated ? 0 : .16 * Math.max(0, 1 - (x / 2.15) ** 2));

  for (let column = 0; column < 24; column++) {
    const left = filmWidth * (column / 12 - 1);
    const right = filmWidth * ((column + 1) / 12 - 1);
    faces.push({
      vertices: [[left, -2.94, filmZ(left)], [right, -2.94, filmZ(right)],
        [right, 2.94, filmZ(right)], [left, 2.94, filmZ(left)]],
      fill: '#3d9a8a', opacity: .72,
    });
  }

  for (const y of [-2.65, 2.65]) {
    for (const side of [-1, 1]) rigidSide(strut, side, y - .22, y + .22);
    rigidSide(jointEnd, -1, y - .07, y + .07);
    rigidSide(jointEnd, 1, y - .22, y - .08);
    rigidSide(jointEnd, 1, y + .08, y + .22);
    // The pin axis lies close to the underside, below the flange reaction once seated.
    const pin = Array.from({ length: 12 }, (_, i) => {
      const angle = i * Math.PI / 6;
      return [.055 * Math.cos(angle), jointZ + .055 * Math.sin(angle)];
    });
    prism(pin, y - (y < 0 ? .39 : .23), y + (y > 0 ? .39 : .23), materials.pin);
  }

  return faces;
}
