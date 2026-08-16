# Attributions

## thinking-orbs (visual & behavioural inspiration)

AREN's Orb takes **visual and behavioural inspiration** from:

- **Project:** thinking-orbs — "Dotted thought-orb loading indicators for AI & agent UIs"
- **Author:** Jakub Antalik
- **Repository:** https://github.com/Jakubantalik/thinking-orbs
- **License:** MIT

### What was adapted

Concepts only — **no source code was copied**. AREN's Orb is an independent,
native implementation written for the Expo / React Native stack using
`@shopify/react-native-skia`. The following *ideas* were studied and reworked:

- the "dotted globe" language (particles distributed on a projected sphere);
- a **scan meridian** that sweeps and illuminates dots (AREN `SEARCHING`);
- a **rolling waveform** through the particle field (AREN `LISTENING` / `HEARING`);
- tilted **orbital** particle motion and depth-shaded dots;
- a **reduced-motion** static representative frame.

AREN's geometry, state model (12 canonical AREN states), color system,
profiles, projection math, layering and rendering pipeline are original to this
project. The reference package is **not** used as a runtime dependency.

### MIT License (thinking-orbs)

```
MIT License

Copyright (c) Jakub Antalik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Rendering library

- **@shopify/react-native-skia** (MIT) — native 2D rendering engine, bundled in
  Expo Go for SDK 57. Used for the Orb's particle field, glows and rings.
