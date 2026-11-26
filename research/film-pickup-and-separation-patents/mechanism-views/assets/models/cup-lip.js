// The thin half of the sealing lip rises while the thicker half holds its shape.
export function asymmetricCup(g, x, y, z, radius, scale = 1, bend = 0) {
  const rings = [[1,0,true],[.86,.11,false],[.40,.48,false],[.23,.48,false],
    [.34,.21,false],[.80,.028,true],[1,0,true]].map(([fraction, height, flex]) =>
    Array.from({ length: 24 }, (_, i) => {
      const angle = i * Math.PI / 12;
      const side = Math.sin(angle);
      return [x + radius * fraction * Math.cos(angle), y + radius * fraction * side,
        z + height * scale + (flex ? Math.max(0, side) * bend : 0)];
    }));
  for (let j = 1; j < rings.length; j++) {
    for (let i = 0; i < 24; i++) {
      const next = (i + 1) % 24;
      g.face('spring', [rings[j - 1][i], rings[j - 1][next], rings[j][next], rings[j][i]], false);
    }
  }
  g.cylinder('steel', [x,y,z + .43 * scale], [x,y,z + .90 * scale], radius * .22, radius * .12);
}
