function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function makeRenderer(canvas) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: true });
  if (!gl) return;

  const vertex = compile(gl, gl.VERTEX_SHADER, `
    attribute vec3 point;
    attribute vec4 color;
    uniform vec3 center;
    uniform vec2 angles;
    uniform vec2 scale;
    uniform float depthScale;
    varying vec4 surface;
    void main() {
      vec3 p = point - center;
      float x = p.x*cos(angles.x) + p.y*sin(angles.x);
      float y = -p.x*sin(angles.x) + p.y*cos(angles.x);
      float z = p.z;
      gl_Position = vec4(x * scale.x, (z*cos(angles.y)-y*sin(angles.y))*scale.y,
        -(y*cos(angles.y)+z*sin(angles.y))*depthScale, 1.0);
      surface = color;
    }
  `);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying vec4 surface;
    void main() { gl_FragColor = surface; }
  `);
  if (!vertex || !fragment) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.polygonOffset(1, 1);
  gl.clearColor(.973, .98, .973, 1);
  const point = gl.getAttribLocation(program, 'point');
  const color = gl.getAttribLocation(program, 'color');
  const center = gl.getUniformLocation(program, 'center');
  const angles = gl.getUniformLocation(program, 'angles');
  const scale = gl.getUniformLocation(program, 'scale');
  const depthScale = gl.getUniformLocation(program, 'depthScale');
  gl.enableVertexAttribArray(point);
  gl.enableVertexAttribArray(color);
  const buffers = [gl.createBuffer(), gl.createBuffer(), gl.createBuffer()];
  const modes = [gl.TRIANGLES, gl.LINES, gl.TRIANGLES];
  let sizes = [0, 0, 0];
  let radius = 1;

  function mesh(faces, focus) {
    const colors = new Map();
    const rgb = (hex) => {
      if (!colors.has(hex)) colors.set(hex, [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255));
      return colors.get(hex);
    };
    const low = [Infinity, Infinity, Infinity], high = [-Infinity, -Infinity, -Infinity];
    const data = [[], [], []];
    for (const { vertices, fill, edge, shade = 1, opacity = 1 } of faces) {
      const triangles = data[opacity < 1 ? 2 : 0];
      const rgba = [...rgb(fill).map((value) => value*shade), opacity];
      for (const p of vertices) {
        for (let axis = 0; axis < 3; axis++) {
          low[axis] = Math.min(low[axis], p[axis]);
          high[axis] = Math.max(high[axis], p[axis]);
        }
      }
      for (let i = 1; i < vertices.length - 1; i++) {
        triangles.push(...vertices[0], ...rgba, ...vertices[i], ...rgba, ...vertices[i + 1], ...rgba);
      }
      if (edge) {
        const line = [...rgb(edge), .82];
        for (let i = 0; i < vertices.length; i++) {
          data[1].push(...vertices[i], ...line, ...vertices[(i + 1) % vertices.length], ...line);
        }
      }
    }
    sizes = data.map((vertices, index) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
      return vertices.length / 7;
    });
    const middle = focus?.slice(0,3) ?? low.map((value, i) => (value + high[i])/2);
    gl.uniform3f(center, ...middle);
    radius = focus?.[3] ?? Math.max(...high.map((value, i) => value - low[i])) / 2;
    const depthRadius = Math.hypot(...middle.map((value, i) => Math.max(high[i]-value,value-low[i])));
    gl.uniform1f(depthScale, .92 / depthRadius);
  }

  function draw(rotation, tilt, zoom) {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
    const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    const size = .74 * zoom / radius;
    gl.uniform2f(scale, size*Math.min(1,height/width), size*Math.min(1,width/height));
    gl.uniform2f(angles, rotation*Math.PI/180, tilt*Math.PI/180);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (let i = 0; i < modes.length; i++) {
      if (i === 1) gl.disable(gl.POLYGON_OFFSET_FILL);
      else gl.enable(gl.POLYGON_OFFSET_FILL);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i]);
      gl.vertexAttribPointer(point, 3, gl.FLOAT, false, 28, 0);
      gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 28, 12);
      gl.drawArrays(modes[i], 0, sizes[i]);
    }
  }

  return { mesh, draw };
}
