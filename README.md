# Film Strip Feeder Exploration

[Documentation website](https://hsnilsson.github.io/film-strip-feeder-exploration/) · [Historical film-flatness patent archive](research/film-flatness-patents/index.md)

## Introduction

This is an exploration of automatic film scanning and a collection ideas for how to build something like "the best possible automatic batch film strip feeder and autocarrier for cut and uncut strips". It is my very informal braindump of how to possibly solve some shortcomings of the current intents.

The film scanning workflow is often seen from two slightly different perspectives; one from people shooting new film and scan rolls, and another from people scanning and archiving film in the form of cut strips.

Many people have been custructing parts of this flow, but there are always shortcomings and prioritizations. The goal with this exploration is that it might help someone realize a potential problem earlier in their design or find a better solution to some part of this flow.

## Wishlist for scanning flow

- batch feeder for cut strips down to singles
    (this is the most overlooked feature by others so I dive into it deeply here. It could be solved as a separate unit or more proably a built in part of the solution)
- perfect flatness
- exchangable light source
- fast
- dust detection
- handles many formats
- easy to clean and repair


## Current solutions and limitations

| Existing solution                                                            | Relevant capability                                                                                                | Limitations                                                                                                                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Pacific Image PowerFilm Plus](https://www.scanace.com/product/film-scanners/powerfilm-plus)                     | <ul><li>The only film batch feeder I've found</li><li>Up to 10 strips</li><li>Down to 2 frames per strip</li><li>ICE</li></ul> | <ul><li>24 MP scanner</li><li>Slow (CCD scanner)</li></ul>                                                                                               |
| [SlideSnap Strip](https://slidesnap.com/product/slidesnap-strip/)            | <ul><li>Transports single frames</li><li>Handles many different film sizes</li></ul>                               | <ul><li>Does not provide unattended feeding from a stack of loose strips</li><li>Cannot guarantee flatness of edge frames</li></ul> |
| [toneCarrier 35 mm](https://tonephotographic.com/products/tonecarrier-35-mm) | <ul><li>Synchronized edge rollers</li></ul>                                                                        | <ul><li>Minimum four frames per strip</li></ul>                                                                                                        |
| [Filmomat Autocarrier](https://shop.filmomat.eu/products/135-autocarrier)     | <ul><li>Keeps film very flat</li><li>IR light</li></ul>                                            | <ul><li>Independent batch separator is missing for this concept</li><li>Cannot handle fewer than three frames</li></ul>                                |
| [Lento Dock 35](https://lento.fun/shop/dock-35/)                             | <ul><li>Automated film transport</li><li>RGB scanning</li></ul>                                                 | <ul><li>Flatness not confirmed</li><li>Strip length of minimum 123 mm</li></ul>                          |

## Independent and DIY scanning projects

The [project survey](INDEPENDENT_PROJECTS.md) compares crowdfunded carriers, prototypes and DIY builds by transport mechanism, minimum strip length and loading method. Gretag Imaging patented a mechanism for feeding loose negative strips from a stack into a camera-scanning path. [Published suction pickup design](docs/2-pickup-and-separation.md#closest-published-design-for-loose-strips)

## Overview

```mermaid
flowchart LR
    stack["1. Film stack"] --> pickup["2. Pickup & separation"]
    pickup --> transport["3. Transport"]
    transport --> capture["4. Flattening & capture"]
    capture --> output["5. Output"]
```

| Stage                                                     | What happens                                              |
| --------------------------------------------------------- | --------------------------------------------------------- |
| 1. [Film stack](docs/1-film-stack.md)                       | Present loose strips to the pickup point.                 |
| 2. [Pickup & separation](docs/2-pickup-and-separation.md)   | Extract one strip and hand it off to transport.           |
| 3. [Transport](docs/3-transport.md)                         | Keep both film edges under drive and position each frame. |
| 4. [Flattening & capture](docs/4-flattening-and-capture.md) | Stop, clamp, tension, capture, then release.              |
| 5. [Output](docs/5-output.md)                               | Collect the strip after its final frame.                  |
| [Sensors & control](docs/sensors-and-control.md)          | Coordinate movement, capture and fault recovery.          |

## Transport and flatten single frames

Use two narrow, continuously driven rubber belts along the film's perforated edges so even one frame remains under drive inside the gate. [Edge-belt transport and its SlideSnap reference](docs/3-transport.md#proposed-continuous-edge-belts)

At capture, clamp the edges against the belts and apply a **small outward displacement** to reduce transverse curl without touching the image area. Film deformation and longitudinal curl remain open questions. [Proposed clamping sequence](docs/4-flattening-and-capture.md#proposed-edge-clamping-and-lateral-tension) · [Kodak clamp precedents](docs/4-flattening-and-capture.md#kodak-film-clamps)

Feedback, experiments, corrections, and alternative designs are welcome.
