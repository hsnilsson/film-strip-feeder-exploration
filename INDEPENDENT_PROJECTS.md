# Independent and DIY film-scanning projects

This survey covers crowdfunded carriers, independent prototypes and one-off builds relevant to feeding 35 mm still negatives into a camera-scanning setup. Strip lengths and loading methods are taken from the linked sources where documented.

## Camera-based film transports

| Project | Transport and capture | Strip length and loading | Sources |
| --- | --- | --- | --- |
| CAMERADACTYL Mongoose | Ethan Moses's Kickstarter-funded 35 mm carrier advances film and triggers a digital camera by cable. It has manual, fixed-step and automatic modes. | The maker specifies a minimum of four standard frames. The operator loads each roll or strip. | [Kickstarter campaign](https://www.kickstarter.com/projects/cameradactylmongoose/the-cameradactyl-mongoose-fast-automated-35mm-film-scanning/description) · [Maker's specifications](https://www.cameradactyl.com/buttergrip/p/mongoose) |
| Filmolino Multiformat Scanner | Roger Ludwig and Francesco Bagnato built a multiformat camera-scanning prototype with motorized film transport and centralized control. | The original project page could not be retrieved. Minimum strip length and loading method remain unverified. | [Original project page](https://filmolino.com/multiformat-scanner/) · [Firsthand account of correspondence with the builders](https://photoinfos.com/Fotolabor-digital/Dias-3-Filmolino-Diaprojektorund-Kamera.htm) |
| Digie35 | Custom 35 mm digitizer with a Raspberry Pi, perforation detection and tethered camera control. The makers list manual, semi-automatic and automatic feed adapters. | Designed to process whole strips. Minimum strip length and pickup from a loose stack are undocumented in the cited pages. | [Project overview](https://www.digie35.cz/en) · [Device design](https://www.digie35.cz/en/digie35) |
| Sigí | Motorized prototype with live frame detection for uneven frame spacing. The maker describes automated loading and unloading at the carrier and shows a drive fitted to an existing manual carrier. | The prototype is described as handling cut and uncut film. The planned standalone carrier targets shorter strips and support for 35 mm and 120. No minimum length or stack pickup is specified. | [Prototype overview](https://sigi-scan.com/) · [Features and specs](https://sigi-scan.com/features-specs) |
| FruitieX negative_scanner | A 3D-printed carrier uses an Arduino for stepper and shutter control. The Rust program looks for gaps between frames in the camera's live feed. | The motor advances slowly while the operator inserts the next strip. Minimum length is unspecified. | [Build and operating notes](https://github.com/FruitieX/negative_scanner) |
| ccyyturralde Film-Scanner | Raspberry Pi and Arduino rig uses calibrated stepper advance and triggers a tethered camera. | The documented workflow learns spacing from the first two frames and asks the operator to load the next strip. Minimum strip length is unspecified. | [Build and operating notes](https://github.com/ccyyturralde/Film-Scanner#usage) |
| Seckin Sinan Isik's Film Scanning Project | An Arduino Nano and belt-driven stepper move the film. The Python mode uses the camera's live feed to correct alignment before capture. The builder shows the drive on a commercial carrier and on a cardboard prototype. | Demonstrated on uncut 35 mm film. Minimum strip length is unspecified. | [Builder's write-up](https://petapixel.com/2020/09/23/how-to-make-an-auto-35mm-film-scanner-with-arduino-nano-and-python/) · [Source code](https://github.com/SeckinSinanIsik/FilmScaningProject) |
| TechcakeLab ESP32 Autocarrier | A 3D-printed, stepper-driven transport uses an optical interrupter to count perforations and triggers the camera. The published 35 mm firmware advances eight perforations per full frame in automatic roll scanning. | The build video describes a rig for 35 mm and 120 film. Minimum strip length and stack pickup are unspecified. | [Build video and parts list](https://www.youtube.com/watch?v=9vTWN9rXZQk) · [35 mm firmware and operating modes](https://github.com/techcakelab/Auto-film-scanning) |
| RoboScan | LEGO and Raspberry Pi film-roll scanner with a small stepper and camera capture over libgphoto2. The project includes a brick assembly model and a printable stepper adapter. | Documented as a roll scanner. Minimum strip length is unspecified. | [Parts and source code](https://github.com/bezineb5/RoboScan) |
| DIY sprocket-wheel transport | A Raspberry Pi drives a stepper and a sprocket wheel salvaged from a 35 mm camera. The wheel engages the film perforations to advance one frame at a time. | Demonstrated on uncut 35 mm rolls. Minimum strip length is unspecified. | [Builder's demonstration](https://www.youtube.com/watch?v=a8peJ_dliyM) |

## Batch handling and positioning references

| Project | Mechanism and relevance | Sources |
| --- | --- | --- |
| Filmolino SlideScanner | A modified slide projector feeds mounted slides from a magazine and a controller triggers a digital camera. | [Build and source code](https://github.com/filmolino/SlideScanner) |
| pictureSlideCapture | A printed hopper holds mounted slides. A rotary pusher feeds them one at a time, and an optical sensor triggers the camera. The builder reports using it to scan an entire slide collection. | [Feeder, demo and CAD files](https://github.com/thatSFguy/pictureSlideCapture) |
| PiSlide | A 3D-printed motorized carrier positions mounted 35 mm slides for a DSLR and drops them onto a return platform after capture. | [Build and model files](https://github.com/OneGherkinTwoOlives/Slide-Film-Scanner) |
| University of Connecticut Library X-Y capture table | A programmable table moves a preloaded holder beneath a digital camera. The institution reports support for 35 mm strips and mounted slides and publishes throughput measurements for slides. | [Design and evaluation paper](https://library.imaging.org/admin/apis/public/api/ist/website/downloadArticle/archiving/17/1/art00014) |
| autoFilmScanner | A DIY stepper gantry advances a loaded Plustek OpticFilm holder. A script watches for each completed scan before advancing to the next frame. | [Gantry and controls](https://github.com/gertminov/autoFilmScanner) |

## Closest published design for loose strips

Gretag Imaging's photographic reorder patent describes a hopper that feeds loose negative strips one at a time into a track for a digital camera. Figures 4A and 4B show a spring-biased plate that squares the stack and a pivoting suction cup that hands each strip to a driven exit roller and a movable pinch roller. The patent gives a direct mechanical precedent for stack pickup. It provides no performance data for batches of loose single frames. [US Patent 6,556,276](https://www.freepatentsonline.com/6556276.html)

The surveyed builds document several ways to position film once it enters a carrier. None of the builds reviewed here documents unattended stack feeding of loose 35 mm negatives down to single frames.


