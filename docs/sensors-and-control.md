# Sensors & control

[Overview](../README.md#overview)

Sensor choices and the motorized control sequence are proposals. Control spans the whole film path.

| Stage | Signals and actions to investigate |
| --- | --- |
| [Film stack](1-film-stack.md) | Determine whether film is available for the next pickup. |
| [Pickup & separation](2-pickup-and-separation.md) | Detect arrival and double feeds before downstream transport takes over. |
| [Transport](3-transport.md) | Track strip edges and locate frames. Compare perforation sensing with camera-based frame detection. |
| [Flattening & capture](4-flattening-and-capture.md) | Gate capture on transport stopped and film clamped. Resume after release. |
| [Output](5-output.md) | Confirm the previous strip cleared before admitting the next. |

Perforation sensing provides a movement reference. Camera-based detection can look for the image boundary directly, including where spacing varies. Reliability on single frames, curled pieces and different films needs testing. An ultrasonic double-sheet sensor is one option to test for double feeds. [microsonic dbk+4/3CDD/M18 E+S](https://www.microsonic.de/en/sensordetail/dbk+4-3CDD-M18%20E+S)

## Open questions and experiments

- In manual rig and later motorized trials, log signals for ordinary feeds, missed pickups, overlapping pieces and deliberate jams.
- Test whether stopping and releasing the affected drive can recover a strip without dragging it against its neighbor. Record which cases need manual intervention.

## References

- [Independent transport projects with perforation and frame detection](../INDEPENDENT_PROJECTS.md#camera-based-film-transports)
- [Repository prototype sequence](../README.md#prototype-plan)

---

[Overview](../README.md#overview)
