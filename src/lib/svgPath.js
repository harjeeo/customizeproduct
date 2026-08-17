// Uniformly rescales every numeric literal in an SVG path's "d" string by
// dividing by `divisor`. Because the scale factor is the same for both axes,
// this is safe even for paths that mix absolute and relative (h/v/c/etc.)
// commands — relative deltas remain proportionally correct.
export function scalePathD(d, divisor) {
  return d.replace(/-?\d*\.?\d+/g, (match) => {
    const val = parseFloat(match) / divisor;
    let s = val.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
    if (s === "" || s === "-") s = "0";
    return s;
  });
}
