# North Star Home Base — live demo

A browsable demo of an **offline-first emergency command station** built on a
Raspberry Pi: mesh radio, software-defined radio, an offline encyclopedia,
weather, medical reference, farm and food-preservation planning, power
monitoring, and a good deal more — all designed to keep working with no
internet, no cell service, and no grid.

**Every reading on this page is invented.** It is not connected to a real
station and cannot reach one.

## Run it

```
npm start
```

Then open <http://localhost:3000>.

It is a single self-contained HTML file. No build step, no dependencies, no
network calls — you can also just open `public/index.html` in a browser.

## What you are looking at

The real dashboard talks to a local API on the Pi. This demo replaces that API
with a fixture layer: `fetch` is never called, there is no origin to reach, and
every endpoint returns hand-written sample data from `fixtures.js`.

That matters for more than tidiness. The demo is built **from fixtures**, never
from a sanitised copy of live data — so there is no step in the process where
real coordinates, radio encryption keys, medical records or supply inventories
exist and have to be scrubbed out. That scrubbing step is the one that
normally goes wrong.

## Worth a look

- **Comms** — mesh chat, node roster with battery and signal telemetry, SDR
  receiver, radio fleet, satellite pass prediction
- **Medical** — 37 first-aid cards, including a "long outage" tier covering
  carbon monoxide, rehydration salts, sanitation and keeping insulin viable
  without power
- **Farm** — almanac, garden planner, seed catalogue, livestock water and feed
  maths, and food preservation with altitude-corrected canning times
- **Security** — perimeter, evacuation grab-list tiered by how much warning you
  get, armory inventory
- **System** — power draw, self-test, storage, station identity

## Deploy

Any static host works. For Railway: new project from this repo, set the root
directory, and Nixpacks will run `npm start`.

## Licence

Demo content and fixtures are free to use as a reference.
