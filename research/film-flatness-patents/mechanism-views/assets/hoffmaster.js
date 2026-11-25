const materials = {
  frame: { top: '#c4d1cc', side: '#84978f', edge: '#536962' },
  flange: { top: '#998baa', side: '#756485', edge: '#62506c' },
  toggle: { top: '#efac5e', side: '#ca8240', edge: '#774921' },
  pin: { top: '#fae2ac', side: '#d4a15e', edge: '#774921' },
};

// All geometry is illustrative. X runs across the film, Y along it, and Z up.
function holderFaces(seated) {
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
      fill: '#3d9a8a',
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

function uploadHolder(gl, faces) {
  const solids = [];
  const outlines = [];
  const film = [];
  const rgb = (color) => [1, 3, 5].map((start) => parseInt(color.slice(start, start + 2), 16) / 255);

  for (const { vertices, fill, edge } of faces) {
    const fillColor = rgb(fill);
    const triangles = edge ? solids : film;
    for (let index = 1; index < vertices.length - 1; index++) {
      triangles.push(...vertices[0], ...fillColor, ...vertices[index], ...fillColor, ...vertices[index + 1], ...fillColor);
    }
    if (edge) {
      const edgeColor = rgb(edge);
      for (let index = 0; index < vertices.length; index++) {
        outlines.push(...vertices[index], ...edgeColor, ...vertices[(index + 1) % vertices.length], ...edgeColor);
      }
    }
  }

  return [[gl.TRIANGLES, solids, 1], [gl.LINES, outlines, 1], [gl.TRIANGLES, film, .62]].map(([mode, vertices, opacity]) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return { mode, buffer, opacity, count: vertices.length / 6 };
  });
}

function holderRenderer(gl) {
  const vertexShader = `
    attribute vec3 point;
    attribute vec3 color;
    uniform vec2 angles;
    uniform vec2 scale;
    varying vec3 surfaceColor;

    void main() {
      float side = point.x * cos(angles.x) + point.y * sin(angles.x);
      float away = -point.x * sin(angles.x) + point.y * cos(angles.x);
      float rise = point.z * cos(angles.y) - away * sin(angles.y);
      float depth = away * cos(angles.y) + point.z * sin(angles.y);
      gl_Position = vec4(side * scale.x, rise * scale.y, -depth / 8.0, 1.0);
      surfaceColor = color;
    }
  `;
  const fragmentShader = `
    precision mediump float;
    uniform float opacity;
    varying vec3 surfaceColor;
    void main() { gl_FragColor = vec4(surfaceColor, opacity); }
  `;
  const program = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER, vertexShader], [gl.FRAGMENT_SHADER, fragmentShader]]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.polygonOffset(1, 1);
  gl.clearColor(.973, .98, .973, 1);
  const { width, height } = gl.canvas;
  const point = gl.getAttribLocation(program, 'point');
  const color = gl.getAttribLocation(program, 'color');
  const angles = gl.getUniformLocation(program, 'angles');
  const opacityUniform = gl.getUniformLocation(program, 'opacity');
  gl.enableVertexAttribArray(point);
  gl.enableVertexAttribArray(color);
  gl.uniform2f(gl.getUniformLocation(program, 'scale'), 2 * height / (width * 9.5), 2 / 9.5);

  return (geometry, rotation, tilt) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform2f(angles, rotation * Math.PI / 180, tilt * Math.PI / 180);
    for (const { mode, buffer, opacity, count } of geometry) {
      if (mode === gl.TRIANGLES) gl.enable(gl.POLYGON_OFFSET_FILL);
      else gl.disable(gl.POLYGON_OFFSET_FILL);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(point, 3, gl.FLOAT, false, 24, 0);
      gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 24, 12);
      gl.uniform1f(opacityUniform, opacity);
      gl.drawArrays(mode, 0, count);
    }
  };
}

function startModel(model) {
  const canvas = model.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) return;
  const draw = holderRenderer(gl);
  if (!draw) return;

  const form = model.querySelector('form');
  const status = model.querySelector('.model-state');
  const { position, rotation, tilt } = form.elements;
  const views = { raised: uploadHolder(gl, holderFaces(false)), seated: uploadHolder(gl, holderFaces(true)) };
  let drag;

  const render = () => {
    draw(views[position.value], rotation.valueAsNumber, tilt.valueAsNumber);
    const caption = position.value === 'seated'
      ? 'The bars seat beneath the spring flanges. The end arms press the film and the pin axes lie below the flange reaction.'
      : 'Each long bar tilts with both arms attached to it. The low edges of the bars rest on the film margins.';
    if (status.textContent !== caption) status.textContent = caption;
  };

  form.addEventListener('input', render);
  form.querySelector('button').addEventListener('click', () => {
    rotation.value = rotation.defaultValue;
    tilt.value = tilt.defaultValue;
    render();
  });

  canvas.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(drag.id);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const nextRotation = rotation.valueAsNumber + (event.clientX - drag.x) * .8;
    rotation.value = ((nextRotation + 180) % 360 + 360) % 360 - 180;
    tilt.value = tilt.valueAsNumber + (event.clientY - drag.y) * .6;
    drag.x = event.clientX;
    drag.y = event.clientY;
    render();
  });
  canvas.addEventListener('lostpointercapture', () => { drag = undefined; });

  model.hidden = false;
  document.querySelector('.model-alternative').hidden = true;
  render();
}

startModel(document.querySelector('.mechanism-model'));
