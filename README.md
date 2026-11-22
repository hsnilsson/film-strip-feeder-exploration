# Film Strip Feeder Exploration

**WIP · Research and concepts — not a working or validated design.**

Collecting ideas for automatically feeding **loose 35 mm film strips, including single-frame negatives**, from a stack into a camera-scanning transport. The priorities are reliable separation, no double-feeding, and no film damage.

## Current solutions and limitations

| Existing solution | Relevant capability / limitation |
| --- | --- |
| [Pacific Image PowerFilm Plus](https://www.scanace.com/) | Only batch feeder out there. Up to 10 strips. Down to 2 frames per strip. Only 24mp, slow CCD scanner. |
| [SlideSnap Strip](https://slidesnap.com/product/slidesnap-strip/) | Transports single frames, but doesn't provide unattended feeding from a stack of loose strips. Handles many many different film sizes. Struggles against gravity. Cannot garantee flatness. |
| [toneCarrier 35 mm](https://tonephotographic.com/products/tonecarrier-35-mm) | Synchronized edge rollers; minimum four frames per strip. |
| [Filmomat Autocarrier](https://shop.filmomat.eu/) | Automated film transport; an independent batch separator is the missing part for this concept. Keeps film very flat. Cannot handle less than three frames. |
| [Lento Dock 35](https://lento.fun/shop/dock-35/) | Automated film transport and frame detection. Each strip is loaded by hand and must be at least 123 mm long (about four full frames or seven half frames). |

All carriers currently have some amount of stray light, or Non Image Forming Light, i.e. light that bounces into the walls of something after hitting the film and before entering the camera sensor. Autocarrier seems to have the least of this.

## Concepts to investigate

### 1. Two-stage pickup (initial manual experiment)

Stand strips roughly vertically, slightly tilted towards the feed direction. A rubber roller contacts the outer strip's glossy base side and advances it; a second roller could take over once its edge protrudes.

**Key risk:** the extracted strip's trailing edge scraping the next strip during handoff.

### 2. Passive separation (PowerFilm Plus hypothesis)

Video of the PowerFilm Plus appears to show an upper rubber pickup roller, two felt-like flexible supports under the stack, and an angled retaining lip.

**Unverified hypothesis:** the supports push the stack towards the roller; the lip and friction retain the lower strips while the rubber roller extracts the uppermost. The next strip then moves into position automatically. We have **not confirmed** the components' materials, spring action, or actual separation method.

References: [Feeding footage at 1:22](https://youtu.be/FA9UKOKTuyk?t=82) · [Roller cleaning / internal view](https://www.youtube.com/watch?v=_j4d6bKq0QE)

### 3. Transport and flatten single frames

Use two narrow, continuously driven rubber belts along the film's perforated edges so even one frame remains under drive inside the gate. At capture, clamp the edges against the belts and apply a **small outward displacement** to reduce transverse curl without touching the image area. Film deformation and longitudinal curl remain open questions.

Related: [SlideSnap Strip](https://slidesnap.com/product/slidesnap-strip/) · [Kodak film-flattening patent](https://patents.google.com/patent/EP0660170A1/en)

## Prototype plan

1. **Manual rig:** adjustable stack angle, roller height/pressure, flexible separator pads and lip; hand-cranked pickup; optional second roller.
2. **Test separation:** single-frame through multi-frame strips, mixed curl and stack sizes; inspect for scratches and double feeds. Initial target: **100 consecutive successful feeds**.
3. **Motorize:** independently driven geared motors, adjustable speeds, edge sensing, and double-feed/error detection (e.g. ESP32).
4. **Integrate:** continuous-belt gate, optional lateral-tension clamps, and connection to an existing carrier or custom imaging stage.

## References

- [Xerox separator mechanism patent](https://patents.google.com/patent/EP1721846B1/en)
- [Brother scanner separation pad](https://store.brother.se/accessories/scanners/sp2001c)
- [MakerBeamXL modular framing](https://www.makerbeam.com/makerbeamxl/)
- [Pololu micro gearmotors](https://www.pololu.com/category/60/micro-metal-gearmotors)
- [Open-source automatic film scanning](https://github.com/techcakelab/Auto-film-scanning)
- [DIY negative scanner](https://github.com/FruitieX/negative_scanner)

Feedback, experiments, corrections, and alternative designs are welcome. See [planned diagrams](assets/README.md).
