/* ─────────────────────────────────────────────────────────────────────────
   DEMO FIXTURES — entirely invented data.

   Nothing here comes from a real station. It is written by hand so that
   sanitising a live export is never part of the process: there is no copy
   step where something private could survive.

   The site, names, quantities, callsigns and coordinates are fictional and
   deliberately unlike any real setup. Several panels are shown in an ALERT
   state on purpose — a frost warning, a node on low battery, a perimeter
   trip, supplies under their floor — because those states are what the
   station is actually for, and a demo where everything is fine shows none
   of the reason it exists.
   ───────────────────────────────────────────────────────────────────────── */

/* Wrapped so the helpers below stay private. The dashboard defines its own
   dAgo() and dNow() — leaking ours into the same global scope kills the whole
   main script with "Identifier already declared", and every panel goes blank. */
const DEMO_FIXTURES = (() => {
const DEMO_SITE = { lat: 44.2601, lon: -72.5754, place: "Demo Valley" };
const dNow = () => Math.floor(Date.now() / 1000);
const dAgo = (m) => dNow() - m * 60;
const dSoon = (m) => dNow() + m * 60;
return {

  /* ── station ─────────────────────────────────────────────────────────── */
  "/health": { ok: true, uptime_s: 447283, version: "demo" },
  "/status": { ok: true },
  "/brand": {
    name: "North Star", accent_word: "Star", tagline: "Home Base",
    short: "NS", title: "North Star Home Base — demo", operator: "demo",
    hostname: "demostation", mdns: "demostation.local",
  },
  "/sysbars": { cpu_pct: 17, mem_pct: 41, temp_c: 47.8, ambient_c: 21.4, ambient_rh: 47 },
  "/net/pulse": { online: true, metered: false, latency_ms: 38, via: "starlink" },
  "/climate": { temp_c: 24.1, rh: 44, dew_c: 11.2, note: "comfortable" },
  "/gps": { present: true, fix: true, sats: 9, lat: DEMO_SITE.lat, lon: DEMO_SITE.lon, alt_m: 232 },
  "/clock": {
    source: "gps", drift_s: 0.2,
    alarms: [{ id: 1, at: "05:30", label: "Livestock water check", on: true }],
    reminders: [
      { id: 1, text: "Rotate the fuel cans — oldest first", due: dSoon(2880), repeat_days: 90 },
      { id: 2, text: "Replace the desiccant in the repeater box", due: dSoon(60), repeat_days: 180 },
    ],
  },

  /* ── power: a battery mid-discharge, which is the interesting state ──── */
  "/power": {
    source: "battery", watts: 26.4, battery_pct: 61, runtime_min: 388, charging: false,
    history: Array.from({ length: 48 }, (_, i) => ({
      t: dAgo(48 - i), w: 24 + Math.round(Math.sin(i / 5) * 5) })),
  },
  "/power/draw": { total_w: 26.4, rails: [
    { name: "Pi + storage", w: 8.4 }, { name: "SDR ×2", w: 5.1 },
    { name: "Router + LTE + switch", w: 7.2 }, { name: "Screen", w: 3.2 },
    { name: "Mesh node", w: 1.9 }, { name: "Sensors", w: 0.6 }] },
  "/endurance": { hours_remaining: 6.5, draw_w: 26.4, battery_wh: 288 },
  "/usb": { devices: [
    { name: "SDR · DEMO-DIAL", port: "hub 1", draw_ma: 280 },
    { name: "SDR · DEMO-WATCH", port: "hub 2", draw_ma: 280 },
    { name: "Mesh node", port: "hub 3", draw_ma: 90 },
    { name: "Content drive", port: "usb3", draw_ma: 450 },
    { name: "Touchscreen", port: "hub 4", draw_ma: 500 }] },

  /* ── mesh: a real-looking conversation across channels ───────────────── */
  "/mesh": {
    present: true, connected: true, me: 111111111, ts: dNow(),
    nodes: [
      { num: 111111111, short: "DBAS", long: "Demo Base Station", hw: "HELTEC_V4", lat: 44.2601, lon: -72.5754, snr: null, battery: 98, voltage: 4.17, lastHeard: dNow() },
      { num: 222222222, short: "DMOB", long: "Demo Mobile Unit", hw: "T_DECK", lat: 44.2688, lon: -72.5620, snr: 6.5, battery: 74, voltage: 3.84, lastHeard: dAgo(4) },
      { num: 333333333, short: "DRLY", long: "Demo Ridge Relay", hw: "RAK4631", lat: 44.2810, lon: -72.5930, snr: 4.0, battery: 19, voltage: 3.51, lastHeard: dAgo(11) },
      { num: 444444444, short: "DTRK", long: "Demo Pack Tracker", hw: "TRACKER_T1000E", lat: 44.2540, lon: -72.5488, snr: 2.0, battery: 88, lastHeard: dAgo(26) },
      { num: 555555555, short: "K1XX", long: "Cedar Hill Repeater", hw: "STATION_G2", lat: 44.2380, lon: -72.6120, snr: -4.5, battery: null, lastHeard: dAgo(52) },
    ],
    channels: [
      { index: 0, name: "LongFast", psk_kind: "default" },
      { index: 1, name: "Demo Main", psk_kind: "encrypted (256-bit)" },
      { index: 2, name: "Demo Tact", psk_kind: "encrypted (256-bit)" },
      { index: 3, name: "Demo CH2", psk_kind: "encrypted (256-bit)" },
      { index: 4, name: "Demo WX", psk_kind: "encrypted (256-bit)" },
    ],
  },
  "/mesh/channels": { channels: [
    { index: 0, role_name: "PRIMARY", name: "LongFast", psk_kind: "default" },
    { index: 1, role_name: "SECONDARY", name: "Demo Main", psk_kind: "encrypted (256-bit)" },
    { index: 2, role_name: "SECONDARY", name: "Demo Tact", psk_kind: "encrypted (256-bit)" },
    { index: 3, role_name: "SECONDARY", name: "Demo CH2", psk_kind: "encrypted (256-bit)" },
    { index: 4, role_name: "SECONDARY", name: "Demo WX", psk_kind: "encrypted (256-bit)" },
  ] },
  "/mesh/messages": { messages: [
    { id: 1, from: "Demo Mobile Unit", fromNum: 222222222, to: "^all", channel: 1, text: "Heading up to the ridge to check the relay panel.", dir: "rx", t: dAgo(184), snr: 6.5 },
    { id: 2, from: "me", to: "^all", channel: 1, text: "Copy. Its battery has been sliding since Tuesday.", dir: "tx", t: dAgo(181) },
    { id: 3, from: "Demo Mobile Unit", fromNum: 222222222, to: "^all", channel: 1, text: "At the relay. Panel is shaded by new growth — cutting it back.", dir: "rx", t: dAgo(126), snr: 5.5 },
    { id: 4, from: "me", to: "^all", channel: 1, text: "That would do it. Nice catch.", dir: "tx", t: dAgo(124) },
    { id: 5, from: "Demo Ridge Relay", fromNum: 333333333, to: "^all", channel: 4, text: "WX: wind gusting 34 mph on the ridge", dir: "rx", t: dAgo(61), snr: 4.0 },
    { id: 6, from: "me", to: "^all", channel: 1, text: "[check-in] all clear at 19:40", dir: "tx", t: dAgo(48) },
    { id: 7, from: "Demo Pack Tracker", fromNum: 444444444, to: "^all", channel: 1, text: "Back on the road, 20 min out.", dir: "rx", t: dAgo(26), snr: 2.0 },
    { id: 8, from: "me", to: "^all", channel: 4, text: "[auto] NWS: Frost Advisory until 09:00", dir: "tx", t: dAgo(19) },
  ] },
  "/mesh/outbox": { queue: [] },
  "/mesh/config": { connected: true },
  "/mesh/canned": { items: ["Radio check", "On my way", "Arrived safe", "Need assistance", "Send the truck"] },
  "/mesh/autoalerts": { weather: true, radio: true, channel: 4 },
  "/mesh/trails": { trails: {} },
  "/mesh/roster": {
    me: 111111111, count: 5, ours: 4, neighbours: 1, ts: dNow(),
    nodes: [
      { id: "!0069f6a1", num: 111111111, short: "DBAS", long: "Demo Base Station", hw: "HELTEC_V4", role: "CLIENT", is_me: true, favorite: true, snr: null, hops: null, last_heard_ago: null, battery: 98, voltage: 4.17, ch_util: 3.1, air_tx: 0.42, uptime_s: 447283, lat: 44.2601, lon: -72.5754, alt_m: 232,
        bt: { enabled: true, mode: "RANDOM_PIN", pin: 123456, note: "PIN shows on the device screen at pairing" },
        stats: { packets_tx: 412, packets_rx: 1883, rx_dupe: 240, tx_relay: 96, online_nodes: 5, total_nodes: 5, noise_floor: -119, heap_free: 156168, heap_total: 271488, uptime_s: 447283 } },
      { id: "!00d40e32", num: 222222222, short: "DMOB", long: "Demo Mobile Unit", hw: "T_DECK", role: "CLIENT", is_me: false, snr: 6.5, hops: 0, last_heard_ago: "4m", battery: 74, voltage: 3.84, ch_util: 3.0, air_tx: 0.31, uptime_s: 18400, lat: 44.2688, lon: -72.5620,
        bt: { enabled: true, mode: "FIXED_PIN", pin: 418205 } },
      { id: "!00a13c77", num: 333333333, short: "DRLY", long: "Demo Ridge Relay", hw: "RAK4631", role: "ROUTER", is_me: false, snr: 4.0, hops: 0, last_heard_ago: "11m", battery: 19, voltage: 3.51, ch_util: 3.4, air_tx: 0.66, uptime_s: 2214000, lat: 44.2810, lon: -72.5930, alt_m: 511,
        bt: { enabled: false, mode: "NO_PIN" } },
      { id: "!00b82a10", num: 444444444, short: "DTRK", long: "Demo Pack Tracker", hw: "TRACKER_T1000E", role: "TRACKER", is_me: false, snr: 2.0, hops: 1, last_heard_ago: "26m", battery: 88, voltage: 4.02, lat: 44.2540, lon: -72.5488 },
      { id: "!00c9114b", num: 555555555, short: "K1XX", long: "Cedar Hill Repeater", hw: "STATION_G2", role: "ROUTER", is_me: false, snr: -4.5, hops: 2, last_heard_ago: "52m", battery: null, lat: 44.2380, lon: -72.6120, alt_m: 604 },
    ],
  },
  "/mesh/deploy/ports": { batch: { running: false, done: [], total: 0, log: [] }, ports: [
    { port: "/dev/ttyACM0", responding: true, short_name: "DMOB", long_name: "Demo Mobile Unit", hw: "T_DECK", firmware: "2.7.26", region: "US", role: "CLIENT", node_id: "!00d40e32", bt_mode: "FIXED_PIN", bt_pin: 418205 },
    { port: "/dev/ttyACM1", responding: true, short_name: "DSPR", long_name: "Demo Spare Node", hw: "HELTEC_V3", firmware: "2.7.26", region: "UNSET", role: "CLIENT", node_id: "!00e55f01", bt_mode: "FIXED_PIN", bt_pin: 123456 },
    { port: "/dev/ttyACM2", responding: true, is_base: true, long_name: "(home base — held by the mesh daemon)", note: "not probed; provisioning targets other nodes" },
  ] },
  "/mesh/deploy": { connected: true, port: "/dev/ttyACM0",
    device: { long_name: "Demo Mobile Unit", short_name: "DMOB", region: "US", firmware: "2.7.26", battery: 74 },
    channels: ["LongFast", "Demo Main", "Demo Tact", "Demo CH2", "Demo WX"],
    base_channels: ["LongFast", "Demo Main", "Demo Tact", "Demo CH2", "Demo WX"] },

  /* ── SDR and comms ───────────────────────────────────────────────────── */
  "/sdr": { present: true, model: "Generic RTL2832U", service: "active", streaming: false,
    mode: "pager", freq: 152.007, demod: "nfm", count: 2, port: 1234,
    presets: [{ name: "NOAA WX1", freq: 162.4, mode: "NFM" }, { name: "NOAA WX4", freq: 162.475, mode: "NFM" },
              { name: "Fleet 1", freq: 151.82, mode: "NFM" }, { name: "APRS", freq: 144.39, mode: "NFM" }] },
  "/sdr/hw": { roles: { dial: "DEMO-DIAL", watch: "DEMO-WATCH" }, count: 2,
    devices: [{ serial: "DEMO-DIAL", role: "dial" }, { serial: "DEMO-WATCH", role: "watch" }],
    dial_present: true, watch_present: true,
    failsafe: "both roles present — dial and 24/7 watch run independently" },
  "/sdr/health": { ok: true, checks: [
    { name: "dial dongle", state: "ok", note: "responding" },
    { name: "watch dongle", state: "ok", note: "responding, on the pager band" }] },
  "/sdr/bands": { bands: [
    { id: "wx", name: "NOAA weather", start: 162.4, end: 162.55, step: 12.5, mode: "nfm", about: "Seven National Weather Service channels, broadcasting continuously." },
    { id: "frs", name: "FRS / GMRS", start: 462.55, end: 467.7, step: 12.5, mode: "nfm", about: "Licence-free handhelds — what neighbours are most likely to be using." },
    { id: "murs", name: "MURS", start: 151.82, end: 154.6, step: 12.5, mode: "nfm", about: "Five VHF channels, no licence, better range than FRS." },
    { id: "air", name: "Airband", start: 118.0, end: 136.0, step: 25, mode: "am", about: "Aircraft and towers, AM." }] },
  "/sdr/watch": { watching: true, freq: 152.007, label: "POCSAG pager watch" },
  "/comms/feed": { events: [
    { t: dAgo(2), kind: "433", text: "Driveway beam — TRIPPED (zone: Driveway)" },
    { t: dAgo(9), kind: "433", text: "Outbuilding thermometer: 4.1 °C, battery ok" },
    { t: dAgo(19), kind: "wx", text: "NWS SAME: Frost Advisory issued until 09:00" },
    { t: dAgo(34), kind: "pager", text: "POCSAG 152.007: routine county test page" },
    { t: dAgo(58), kind: "aprs", text: "Position beacon heard — 12 km SW, 144.390" },
    { t: dAgo(96), kind: "433", text: "Greenhouse sensor: 11.8 °C / 71 % RH" },
    { t: dAgo(140), kind: "acars", text: "ACARS 131.550: routine dispatch message decoded" },
  ] },
  "/fleet": { radios: [
    { id: 1, name: "Handheld 1", model: "UV-5R Mini", carrier: "Base", programmed: true, battery: "full" },
    { id: 2, name: "Handheld 2", model: "UV-5R Mini", carrier: "Mobile", programmed: true, battery: "3/4" },
    { id: 3, name: "Handheld 3", model: "UV-5R Mini", carrier: "Spare — go-bag", programmed: true, battery: "unknown" },
  ], channels: [
    { ch: 1, name: "FLEET-1", freq: 151.82, mode: "NFM", note: "primary voice" },
    { ch: 2, name: "FLEET-2", freq: 151.88, mode: "NFM", note: "secondary" },
    { ch: 3, name: "WX-4", freq: 162.475, mode: "NFM", note: "receive only" },
    { ch: 4, name: "CALL", freq: 146.52, mode: "NFM", note: "the national simplex calling frequency" },
  ] },
  "/fleet/watch": { channel: "FLEET-1", freq: 151.82 },
  "/chirp": { files: [{ file: "demo-uv5r-golden.img", model: "UV-5R Mini", when: "2026-07-14" }] },
  "/radio": { ports: [{ port: "/dev/ttyUSB0", model: "UV-5R programming cable" }] },
  "/pace": { primary: "Mesh (Demo Main)", alternate: "MURS FLEET-1", contingency: "NOAA WX receive", emergency: "Whistle, mirror, ground signal" },
  "/cw": { decoded: [] },

  /* ── weather, sky, grid ──────────────────────────────────────────────── */
  "/weather": {
    cached: true, fetched: dAgo(63), place: DEMO_SITE.place,
    now: { temp_c: 6.4, feels_c: 3.1, rh: 72, wind_kph: 22, desc: "Clear and cooling" },
    days: [
      { date: "Mon", hi_c: 11, lo_c: -1, desc: "Frost early, then sun", pop: 5 },
      { date: "Tue", hi_c: 14, lo_c: 2, desc: "Partly cloudy", pop: 15 },
      { date: "Wed", hi_c: 9, lo_c: 1, desc: "Rain", pop: 80 },
      { date: "Thu", hi_c: 8, lo_c: 0, desc: "Showers, windy", pop: 60 },
      { date: "Fri", hi_c: 12, lo_c: 3, desc: "Clearing", pop: 20 },
      { date: "Sat", hi_c: 15, lo_c: 5, desc: "Sunny", pop: 0 },
      { date: "Sun", hi_c: 16, lo_c: 6, desc: "Sunny", pop: 5 },
    ],
    alerts: [
      { event: "Frost Advisory", severity: "Moderate", headline: "Frost Advisory in effect until 09:00 — protect tender plants and livestock water", effective: "tonight 22:00" },
    ],
  },
  "/sat/passes": { tles: true, sgp4: true, tle_age_h: 9, sdr_count: 2,
    cfg: { min_elev: 25, record: true },
    birds: [{ name: "METEOR-M2 3" }, { name: "METEOR-M2 4" }],
    passes: [
      { sat: "METEOR-M2 4", aos: dSoon(38), los: dSoon(50), max_el: 68, freq: 137.1 },
      { sat: "METEOR-M2 3", aos: dSoon(196), los: dSoon(206), max_el: 41, freq: 137.9 },
      { sat: "METEOR-M2 4", aos: dSoon(742), los: dSoon(753), max_el: 79, freq: 137.1 },
    ] },
  "/sat/images": { images: [
    { day: "2026-08-24", file: "meteor-m2-4_1842_68deg.png", path: "/sat/2026-08-24/a.png", size: 1840000 },
    { day: "2026-08-24", file: "meteor-m2-3_0611_44deg.png", path: "/sat/2026-08-24/b.png", size: 1610000 },
    { day: "2026-08-23", file: "meteor-m2-4_1903_72deg.png", path: "/sat/2026-08-23/c.png", size: 1920000 },
  ] },
  "/grid": { ba: "DEMO-ISO", now_mw: 58420, pct_of_peak: 86, state: "strained",
    note: "Demand at 86% of seasonal peak — the grid is working hard. Worth charging anything that stores energy." },

  /* ── farm, animals, preserving ───────────────────────────────────────── */
  "/farm": {
    almanac: { sunrise: "06:14", sunset: "19:52", daylen_h: 13.6, daylen_trend_min_wk: -14,
               moon: { phase: "Waxing gibbous", illum_pct: 78, age_d: 11 } },
    frost_last: "05-15", frost_first: "10-02", days_to_first_frost: 6,
    crops: [
      { id: 1, name: "Tomatoes", variety: "Roma", planted: "2026-05-20", dtm: 75, harvest: "2026-08-03", days_to_harvest: -21, notes: "second flush coming" },
      { id: 2, name: "Beans", variety: "Blue Lake", planted: "2026-06-10", dtm: 58, harvest: "2026-08-07", days_to_harvest: -17 },
      { id: 3, name: "Winter squash", variety: "Waltham", planted: "2026-06-01", dtm: 105, harvest: "2026-09-14", days_to_harvest: 21, notes: "cure before storing" },
      { id: 4, name: "Kale", variety: "Lacinato", planted: "2026-07-22", dtm: 60, harvest: "2026-09-20", days_to_harvest: 27, notes: "sweetens after frost" },
    ],
  },
  "/farm/seeds": { seeds: [
    { id: 1, name: "Tomato", variety: "Roma", year: 2024, packets: 2, viability: "good", notes: "open-pollinated — saves true" },
    { id: 2, name: "Bean", variety: "Blue Lake", year: 2025, packets: 4, viability: "good", notes: "easiest seed to save" },
    { id: 3, name: "Lettuce", variety: "Buttercrunch", year: 2023, packets: 1, viability: "fading", notes: "sow thickly this year" },
    { id: 4, name: "Squash", variety: "Waltham Butternut", year: 2025, packets: 2, viability: "good", notes: "crosses readily — isolate" },
    { id: 5, name: "Carrot", variety: "Danvers", year: 2022, packets: 1, viability: "poor", notes: "replace — carrot seed is short-lived" },
  ] },
  "/farm/plan": {
    suggestions: [
      { bed: "Bed 1", plant: "Garlic", why: "goes in after the first frost, out in July" },
      { bed: "Bed 2", plant: "Kale + carrots", why: "both improve after frost" },
      { bed: "Bed 3", plant: "Cover crop — rye", why: "the beds that fed tomatoes need it back" },
    ],
    avoid: [
      { what: "Tomatoes in Bed 3", why: "same family two years running invites blight" },
      { what: "Brassicas next to strawberries", why: "they compete badly" },
    ] },
  "/farm/log": { entries: [
    { id: 1, date: "2026-08-22", text: "Pulled the first winter squash to cure on the porch." },
    { id: 2, date: "2026-08-18", text: "Bean beds done — turned in and sowed rye." },
    { id: 3, date: "2026-08-11", text: "Second tomato flush setting. Blight-free so far." },
  ] },
  "/animals": {
    animals: [
      { id: 1, name: "Scout", label: "Dog", kind: "pet", count: 1, weight_lb: 62, water_gal: 0.484, feed_lb: 1.55, meds: "joint supplement daily", notes: "microchipped", chip: "DEMO-000-111" },
      { id: 2, name: "Marmalade", label: "Cat", kind: "pet", count: 1, weight_lb: 11, water_gal: 0.086, feed_lb: 0.22, meds: "", notes: "indoor only" },
      { id: 3, name: "layers", label: "Chicken (laying hen)", kind: "livestock", count: 9, gives: "~5 eggs/week in season", water_gal: 0.72, feed_lb: 2.25, notes: "mixed ages so laying never stops at once" },
      { id: 4, name: "does", label: "Goat (milking)", kind: "livestock", count: 2, gives: "~0.75 gal milk/day", water_gal: 8.0, feed_lb: 10.0, notes: "water rises hard while in milk" },
      { id: 5, name: "grow-out", label: "Rabbit", kind: "livestock", count: 6, gives: "meat, ~6 kits/litter", water_gal: 0.78, feed_lb: 1.5, notes: "very lean — needs fat from elsewhere" },
    ],
    kinds: [
      { id: "dog", label: "Dog", kind: "pet" }, { id: "cat", label: "Cat", kind: "pet" },
      { id: "bird", label: "Bird (parrot/finch)", kind: "pet" }, { id: "reptile", label: "Reptile", kind: "pet" },
      { id: "smallpet", label: "Small pet (rabbit/guinea/hamster)", kind: "pet" }, { id: "fish", label: "Fish tank", kind: "pet" },
      { id: "hen", label: "Chicken (laying hen)", kind: "livestock" }, { id: "duck", label: "Duck", kind: "livestock" },
      { id: "goat", label: "Goat (dry)", kind: "livestock" }, { id: "goatm", label: "Goat (milking)", kind: "livestock" },
      { id: "rabbit", label: "Rabbit", kind: "livestock" }, { id: "pig", label: "Pig", kind: "livestock" },
      { id: "sheep", label: "Sheep", kind: "livestock" }, { id: "cowd", label: "Cow (dairy)", kind: "livestock" },
    ],
    feed_lb: 210, water_gal: 60,
    total_water_gal: 10.07, total_feed_lb: 15.52, feed_days: 13.5, water_days: 6.0,
    log: [{ t: "2026-08-23 07:10", text: "Goats to the far browse — front paddock is grazed out." }],
  },
  "/preserve": {
    altitude_ft: 1200, wb_added_min: 5, dial_psi: 11, weighted_psi: 15,
    foods: [
      { name: "Tomatoes (crushed, acidified)", acid: "acid", method: "water bath", pints: 40, quarts: 50, note: "MUST be acidified: 1 tbsp bottled lemon juice per pint, 2 per quart." },
      { name: "Pickles (fresh pack)", acid: "acid", method: "water bath", pints: 15, quarts: 20, note: "Vinegar of at least 5% acidity; do not dilute the brine." },
      { name: "Jam / jelly", acid: "acid", method: "water bath", pints: 15, quarts: 15, note: "" },
      { name: "Applesauce", acid: "acid", method: "water bath", pints: 20, quarts: 25, note: "" },
      { name: "Green beans", acid: "low", method: "pressure", pints: 20, quarts: 25, pressure: { dial_psi: 11, weighted_psi: 15 }, note: "Low-acid. Pressure only, never a water bath." },
      { name: "Corn (whole kernel)", acid: "low", method: "pressure", pints: 55, quarts: 85, pressure: { dial_psi: 11, weighted_psi: 15 }, note: "Low-acid and dense — long process." },
      { name: "Beef / venison (cubed)", acid: "low", method: "pressure", pints: 75, quarts: 90, pressure: { dial_psi: 11, weighted_psi: 15 }, note: "Low-acid." },
      { name: "Soup / stock", acid: "low", method: "pressure", pints: 60, quarts: 75, pressure: { dial_psi: 11, weighted_psi: 15 }, note: "No flour, rice, pasta or dairy — thickeners stop heat reaching the centre." },
      { name: "Pumpkin / squash (CUBED)", acid: "low", method: "pressure", pints: 55, quarts: 90, pressure: { dial_psi: 11, weighted_psi: 15 }, note: "Cubed only. Pureed pumpkin has NO safe home canning process." },
    ],
    drying: [
      { item: "Apples", temp: "135 °F / 57 °C", hours: "6–12 h", done: "leathery, no moisture when torn" },
      { item: "Tomatoes", temp: "135 °F / 57 °C", hours: "8–14 h", done: "brittle at the edges" },
      { item: "Herbs", temp: "95 °F / 35 °C", hours: "2–6 h", done: "crumbles between fingers" },
      { item: "Jerky (beef/venison)", temp: "160 °F / 71 °C", hours: "4–8 h", done: "meat must reach 160 °F" },
    ],
    log: [
      { id: 1, date: "2026-08-22", what: "Crushed tomatoes", jars: "11", method: "water bath", notes: "all sealed, rings off" },
      { id: 2, date: "2026-08-15", what: "Green beans", jars: "9", method: "pressure", notes: "15 psi, weighted" },
      { id: 3, date: "2026-08-02", what: "Apple rings", jars: "4 bags", method: "dried", notes: "conditioned a week, no condensation" },
    ],
  },

  /* ── security ────────────────────────────────────────────────────────── */
  "/armory": {
    total_rounds: 1480,
    guns: [
      { id: 1, name: "Bolt rifle", kind: "rifle", caliber: ".308", serial: "", notes: "scoped, zeroed 100 yd", last_cleaned: "2026-08-10" },
      { id: 2, name: "Pump shotgun", kind: "shotgun", caliber: "12 ga", serial: "", notes: "cylinder bore", last_cleaned: "2026-07-28" },
      { id: 3, name: "Rimfire rifle", kind: "rifle", caliber: ".22 LR", serial: "", notes: "small game, cheap practice", last_cleaned: "2026-08-19" },
    ],
    ammo: [
      { id: 1, caliber: ".22 LR", rounds: 900, min: 500, status: "ok" },
      { id: 2, caliber: ".308", rounds: 180, min: 200, status: "low" },
      { id: 3, caliber: "12 ga", rounds: 300, min: 150, status: "ok" },
      { id: 4, caliber: "9mm", rounds: 100, min: 250, status: "critical" },
    ],
    gear: [
      { id: 1, item: "Ear + eye protection", qty: 4, location: "range bag", notes: "" },
      { id: 2, item: "Cleaning kit", qty: 1, location: "bench drawer", notes: "solvent low" },
      { id: 3, item: "Sling", qty: 2, location: "range bag", notes: "" },
    ],
    calibers: ["9mm", ".22 LR", "5.56 / .223", ".308 / 7.62x51", "12 ga", "20 ga"],
  },
  "/evac": {
    tiers: [["5min", "5 minutes — life only"], ["15min", "15 minutes — the essentials"],
            ["30min", "30+ minutes — comfort and recovery"], ["house", "Before the door closes"]],
    items: [
      { id: 1, tier: "5min", item: "Everyone + pets in the vehicle", why: "People first. Count heads, count animals.", done: true },
      { id: 2, tier: "5min", item: "Medication bag", why: "One bag, one grab — meds, inhalers, the cooler.", done: true },
      { id: 3, tier: "5min", item: "Document binder", why: "IDs, deeds, insurance, credentials sheet.", done: false },
      { id: 4, tier: "5min", item: "The handheld radios", why: "Charged, on the shelf by the station.", done: false },
      { id: 5, tier: "15min", item: "Power station + panel", why: "Heavy — two hands, load it early.", done: false },
      { id: 6, tier: "15min", item: "Go-bags", why: "Grab, do not open and audit.", done: false },
      { id: 7, tier: "15min", item: "Pet go-kit", why: "Food, leads, carriers, rabies papers.", done: false },
      { id: 8, tier: "15min", item: "The box, or its drive", why: "The library and records ride along.", done: false },
      { id: 9, tier: "30min", item: "Food box", why: "Shelf-stable, no-cook first.", done: false },
      { id: 10, tier: "30min", item: "Blankets / sleeping bags", why: "Night one is likely in the vehicle.", done: false },
      { id: 11, tier: "30min", item: "Tools: bar, saw, gloves, rope", why: "Downed limbs between you and the road.", done: false },
      { id: 12, tier: "house", item: "Water off at the main", why: "A burst pipe ruins what the event did not.", done: false },
      { id: 13, tier: "house", item: "Note on the door + tell the mesh", why: "Where you went, when, how to reach you.", done: false },
    ],
  },
  "/perimeter": { armed: true, decoder: true,
    zones: [
      { id: 1, name: "Driveway", last: dAgo(2), state: "TRIPPED", sensor: "433 PIR" },
      { id: 2, name: "Back gate", last: dAgo(240), state: "clear", sensor: "433 PIR" },
      { id: 3, name: "Barn approach", last: dAgo(1180), state: "clear", sensor: "433 PIR" },
    ],
    log: [
      { t: dAgo(2), zone: "Driveway", text: "Beam broken — armed, pushed to Demo Tact" },
      { t: dAgo(240), zone: "Back gate", text: "Beam broken — disarmed, logged only" },
      { t: dAgo(1180), zone: "Barn approach", text: "Beam broken — disarmed, logged only" },
    ] },
  "/cams": { bridge_running: true, cams: [
    { id: 1, name: "Driveway", state: "online", last: dAgo(1) },
    { id: 2, name: "Barn", state: "online", last: dAgo(3) },
    { id: 3, name: "Back door", state: "offline", last: dAgo(2880) },
  ] },
  "/checkin": { people: [
    { id: 1, name: "A.", status: "home", t: dAgo(48) },
    { id: 2, name: "B.", status: "away", t: dAgo(26), note: "on the road, 20 min out" },
    { id: 3, name: "C.", status: "home", t: dAgo(300) },
  ] },
  "/sos": { active: false, message: "", interval: 300, started: 0, sent: 0,
    preview: "SOS - assistance needed - Demo Valley 44.2601,-72.5754" },
  "/blackout": { active: false },

  /* ── medical ─────────────────────────────────────────────────────────── */
  "/medical": {
    profiles: [
      { id: 1, name: "A.", blood: "O+", allergies: "penicillin", conditions: "none", notes: "" },
      { id: 2, name: "B.", blood: "A-", allergies: "none known", conditions: "asthma", notes: "rescue inhaler in the go-bag" },
    ],
    meds: [
      { id: 1, name: "Rescue inhaler", who: "B.", qty: 2, expires: "2027-03", min: 2 },
      { id: 2, name: "Amoxicillin", who: "shared", qty: 1, expires: "2026-11", min: 2 },
      { id: 3, name: "Antihistamine", who: "shared", qty: 3, expires: "2028-01", min: 2 },
      { id: 4, name: "Ibuprofen", who: "shared", qty: 4, expires: "2029-06", min: 2 },
    ],
    vitals: [
      { ts: dAgo(2880), person: "B.", temp_f: 98.6, pulse: 72, bp: "118/76", spo2: 98, note: "routine" },
    ],
  },

  /* ── supplies, tools, notes ──────────────────────────────────────────── */
  "/supplies": { items: [
    { id: 1, name: "Water (stored)", qty: 45, unit: "gal", min: 60, cat: "water" },
    { id: 2, name: "Rice", qty: 40, unit: "lb", min: 25, cat: "food" },
    { id: 3, name: "Beans (dry)", qty: 30, unit: "lb", min: 25, cat: "food" },
    { id: 4, name: "Propane", qty: 3, unit: "tank", min: 2, cat: "fuel" },
    { id: 5, name: "Petrol (stabilised)", qty: 5, unit: "gal", min: 10, cat: "fuel" },
    { id: 6, name: "Batteries — AA", qty: 24, unit: "cell", min: 20, cat: "power" },
    { id: 7, name: "Toilet paper", qty: 18, unit: "roll", min: 12, cat: "sanitation" },
    { id: 8, name: "Bleach (unscented)", qty: 1, unit: "gal", min: 2, cat: "sanitation" },
  ] },
  "/electronics": {
    count: 14,
    cats: [
      { id: "passive", label: "Passives", hint: "resistors, capacitors, inductors, diodes" },
      { id: "semi", label: "Semiconductors", hint: "transistors, regulators, MOSFETs, ICs" },
      { id: "module", label: "Modules & boards", hint: "MCUs, sensors, radios, breakouts" },
      { id: "power", label: "Power", hint: "batteries, cells, chargers, converters, fuses" },
      { id: "conn", label: "Connectors & wire", hint: "JST, Dupont, SMA, terminals, hookup wire" },
      { id: "tool", label: "Tools & consumables", hint: "solder, flux, heatshrink, tape" },
      { id: "spare", label: "Spares for this build", hint: "anything that replaces a part of the station" },
    ],
    by_cat: {
      passive: [
        { id: 1, cat: "passive", name: "Resistor assortment (E12, 1/4 W)", qty: 1, min: 1, where: "drawer A1", notes: "the most-reached-for box" },
        { id: 2, cat: "passive", name: "Capacitor assortment", qty: 1, min: 1, where: "drawer A2", notes: "ceramic + electrolytic" },
      ],
      semi: [
        { id: 3, cat: "semi", name: "1N4001 diodes", qty: 40, min: 20, where: "drawer B1", notes: "reverse-polarity protection" },
        { id: 4, cat: "semi", name: "AMS1117-3.3 regulators", qty: 6, min: 5, where: "drawer B2", notes: "" },
      ],
      module: [
        { id: 5, cat: "module", name: "ESP32 dev boards", qty: 2, min: 1, where: "bin C", notes: "spare mesh nodes" },
        { id: 6, cat: "module", name: "DHT22 sensors", qty: 3, min: 2, where: "bin C", notes: "" },
      ],
      power: [
        { id: 7, cat: "power", name: "Fuse assortment + inline holders", qty: 1, min: 1, where: "drawer D1", notes: "" },
        { id: 8, cat: "power", name: "18650 cells", qty: 4, min: 8, where: "cell case", notes: "stored at storage charge" },
        { id: 9, cat: "power", name: "TP4056 charge modules", qty: 5, min: 3, where: "drawer D2", notes: "" },
      ],
      conn: [
        { id: 10, cat: "conn", name: "JST-PH pigtails", qty: 10, min: 6, where: "drawer E1", notes: "check polarity — vendors differ" },
        { id: 11, cat: "conn", name: "SMA / U.FL pigtails", qty: 2, min: 4, where: "drawer E2", notes: "RG178, for node antennas" },
        { id: 12, cat: "conn", name: "Silicone hookup wire 22 AWG", qty: 3, min: 2, where: "spool rack", notes: "stays flexible cold" },
      ],
      tool: [
        { id: 13, cat: "tool", name: "Self-fusing silicone tape", qty: 1, min: 2, where: "drawer F", notes: "weatherproofs RF joints" },
      ],
      spare: [
        { id: 14, cat: "spare", name: "Spare microSD with a box image", qty: 1, min: 2, where: "faraday pouch", notes: "a dead card is otherwise a rebuild" },
      ],
    },
    low: [
      { id: 8, cat: "power", name: "18650 cells", qty: 4, min: 8, where: "cell case" },
      { id: 11, cat: "conn", name: "SMA / U.FL pigtails", qty: 2, min: 4, where: "drawer E2" },
      { id: 13, cat: "tool", name: "Self-fusing silicone tape", qty: 1, min: 2, where: "drawer F" },
      { id: 14, cat: "spare", name: "Spare microSD with a box image", qty: 1, min: 2, where: "faraday pouch" },
    ],
    suggested_missing: [
      { cat: "semi", name: "1N5819 Schottky diodes", why: "low forward drop for solar input paths" },
      { cat: "power", name: "Buck converter modules", why: "12 V to 5 V without an inverter" },
      { cat: "tool", name: "Solder, flux, braid", why: "rosin-core; braid lifts mistakes" },
    ],
  },
  "/bulletin": { notes: [
    { id: 1, who: "A.", text: "Generator serviced, oil changed, ran 30 min under load.", t: dAgo(600) },
    { id: 2, who: "B.", text: "Ridge relay panel was shaded — cut back the growth.", t: dAgo(126) },
    { id: 3, who: "C.", text: "Frost tonight — covers are by the greenhouse door.", t: dAgo(30) },
  ] },
  "/calendar": { events: [
    { id: 1, date: "2026-08-25", title: "Frost — cover tender beds", kind: "farm" },
    { id: 2, date: "2026-08-28", title: "Radio net check-in, 19:00", kind: "radio" },
    { id: 3, date: "2026-09-01", title: "Rotate stored fuel", kind: "supply" },
    { id: 4, date: "2026-09-05", title: "Test the spare SD card", kind: "drill" },
  ] },
  "/drills": { drills: [
    { id: "spare-sd", name: "Boot the spare SD", desc: "Swap in the cloned card, verify the box comes up, swap back", interval_days: 90, last_done: dAgo(60 * 24 * 40), due_in_days: 50 },
    { id: "evac", name: "Evacuation run-through", desc: "Time the 15-minute tier for real", interval_days: 180, last_done: null, due_in_days: -12 },
    { id: "radio", name: "Fleet radio check", desc: "Every handheld, every channel, from the far end of the property", interval_days: 30, last_done: dAgo(60 * 24 * 26), due_in_days: 4 },
  ] },
  "/nav": { waypoints: [
    { id: 1, name: "Rally point", lat: 44.2700, lon: -72.5800, note: "the barn if the house is unusable" },
    { id: 2, name: "Water source", lat: 44.2550, lon: -72.5900, note: "spring, needs filtering" },
    { id: 3, name: "Ridge relay", lat: 44.2810, lon: -72.5930, note: "solar node, 511 m" },
    { id: 4, name: "Road out — north", lat: 44.2900, lon: -72.5600, note: "floods at the low bridge" },
  ] },
  "/trends": { climate: Array.from({ length: 40 }, (_, i) => ({
    ts: dAgo((40 - i) * 30), t: 21 + Math.sin(i / 6) * 3, h: 45 + Math.cos(i / 5) * 6,
    d: 11 + Math.sin(i / 7) * 2 })) },
  "/brief": { lines: [
    "Frost Advisory tonight until 09:00 — six days to the average first frost.",
    "Ridge relay battery at 19% and falling; panel was shaded, now cleared.",
    "Perimeter: driveway beam tripped 2 minutes ago, armed.",
    "Supplies: water, petrol and bleach are under their floors.",
    "Mesh: 4 nodes heard, 1 neighbouring repeater.",
    "Grid at 86% of seasonal peak.",
  ] },

  /* ── the alert states — the whole point of the station ───────────────── */
  "/notifications": { items: [
    { ts: dAgo(2), kind: "perimeter", text: "Driveway beam TRIPPED — perimeter is armed", level: "alert" },
    { ts: dAgo(11), kind: "mesh", text: "Ridge Relay battery 19% — solar not keeping up", level: "warn" },
    { ts: dAgo(19), kind: "weather", text: "NWS Frost Advisory until 09:00 — pushed to Demo WX", level: "warn" },
    { ts: dAgo(34), kind: "supply", text: "Water below floor: 45 of 60 gal", level: "warn" },
    { ts: dAgo(47), kind: "radio", text: "POCSAG page decoded on the watch dongle", level: "info" },
    { ts: dAgo(96), kind: "farm", text: "Six days to average first frost — squash still out", level: "warn" },
    { ts: dAgo(150), kind: "health", text: "Self-test: 30 of 32 checks passed", level: "warn" },
    { ts: dAgo(320), kind: "power", text: "Running on battery — 6.5 h remaining at 26 W", level: "info" },
  ] },
  "/alerts/rules": { rules: [
    { name: "EAS emergency alert", contains: "", kind: "eas-alert", push_mesh: true, enabled: true, hits: 2 },
    { name: "Frost risk in season", contains: "frost", kind: "weather", push_mesh: true, enabled: true, hits: 1 },
    { name: "Perimeter trip while armed", contains: "", kind: "perimeter", push_mesh: true, enabled: true, hits: 1 },
    { name: "Node battery under 20%", contains: "", kind: "mesh", push_mesh: false, enabled: true, hits: 1 },
    { name: "Supply under its floor", contains: "", kind: "supply", push_mesh: false, enabled: true, hits: 3 },
  ] },
  "/events/search": { hits: [
    { ts: dAgo(2), kind: "perimeter", who: "", text: "Driveway beam TRIPPED — armed, pushed to Demo Tact", freq: 433.92 },
    { ts: dAgo(19), kind: "wx", who: "", text: "NWS SAME decode: Frost Advisory", freq: 162.475 },
    { ts: dAgo(34), kind: "pager", who: "", text: "POCSAG: county test page", freq: 152.007 },
    { ts: dAgo(48), kind: "mesh", who: "DMOB", text: "check-in: all clear at 19:40", freq: null },
    { ts: dAgo(126), kind: "note", who: "B.", text: "Ridge relay panel shaded — cleared", freq: null },
    { ts: dAgo(320), kind: "power", who: "", text: "Switched to battery", freq: null },
  ] },
  "/selftest": { passed: 30, total: 32, checks: [
    { name: "box-api", state: "ok", note: "responding" },
    { name: "mesh daemon", state: "ok", note: "radio connected, 5 channels" },
    { name: "library (kiwix)", state: "ok", note: "26 books indexed" },
    { name: "SDR dial", state: "ok", note: "present" },
    { name: "SDR watch", state: "ok", note: "on the pager band" },
    { name: "content drive", state: "ok", note: "1007 GB, 78% free" },
    { name: "back door camera", state: "fail", note: "offline for 2 days" },
    { name: "evacuation drill", state: "fail", note: "overdue by 12 days" },
  ] },

  /* ── network & services ──────────────────────────────────────────────── */
  "/hotspot": { active: true, ssid: "DemoStation", clients: 3, band: "2.4 GHz" },
  "/net/clients": { clients: [
    { name: "phone-a", ip: "10.0.0.21", mac: "aa:bb:cc:00:00:01", since: dAgo(300) },
    { name: "tablet", ip: "10.0.0.22", mac: "aa:bb:cc:00:00:02", since: dAgo(120) },
    { name: "laptop", ip: "10.0.0.23", mac: "aa:bb:cc:00:00:03", since: dAgo(45) },
  ] },
  "/router/data": {
    ip: "10.0.0.1", url: "#demo-router", embeddable: false, configured: true,
    embed_note: "The router refuses to be embedded — it sends X-Frame-Options: DENY, which browsers honour. These readings come through its API instead.",
    system: { model: "Demo AC1200", firmware_version: "4.6.2", uptime: 447000, load: [0.14, 0.11, 0.09], memory: { total: 268435456, free: 121000000 } },
    wan: { status: "connected", online: true, type: "starlink", ipv4: "203.0.113.44", uptime: 92000 },
    clients: { clients: [
      { name: "north-star-box", ip: "10.0.0.10", mac: "aa:bb:cc:00:00:10", iface: "eth" },
      { name: "phone-a", ip: "10.0.0.21", mac: "aa:bb:cc:00:00:01", iface: "wifi" },
    ] },
  },
  "/starlink": { reachable: true, state: "online", latency_ms: 38, down_mbps: 96, up_mbps: 12,
    usage: { iface: "eth0", month_gb: 61.4, metered: false, budget_gb: 100.0, since: dAgo(60 * 24 * 18) } },
  "/wan/budget": { metered: false, used_gb: 61.4, cap_gb: 100 },
  "/fs/drives": { drives: [
    { id: "ssd", label: "SSD — content drive", total: 1007000000000, free: 787000000000, pct: 22 },
    { id: "sd", label: "SD — system drive", total: 62253056000, free: 31620382720, pct: 49 },
    { id: "usb", label: "USB — backup drive", total: 250903887872, free: 79969656832, pct: 68 },
  ] },
  "/content/progress": { running: false, phase: "idle" },
  "/migrate": { running: false, present: false },
  "/fetchq": { metered: false, items: [
    { id: 1, name: "Wikipedia (with images) 124GB", status: "fetching", url: "#", added: dAgo(300) },
    { id: 2, name: "Project Gutenberg (all) 221GB", status: "queued", url: "#", added: dAgo(299) },
    { id: 3, name: "SE electronics 4.2GB", status: "done", url: "#", added: dAgo(600) },
  ] },
  "/nas": { connected: false },
  "/kiosk": { mode: "auto", hdmi: true, running: true },
  "/vault": { unlocked: false },
  "/media": { items: [
    { name: "Public-domain film night", kind: "video", count: 24 },
    { name: "Audiobooks", kind: "audio", count: 61 },
    { name: "Music", kind: "audio", count: 430 },
  ] },
  "/docs/search": { results: [] },
  "/docs/context": { results: [] },
  "/plan": { pace: {} },

  /* ── news ────────────────────────────────────────────────────────────── */
  "/news": {
    online: true, metered: false,
    selected: ["nws-alerts", "usgs-quake", "ap-top"],
    available: [
      { id: "nws-alerts", label: "NWS active alerts (your area)", kind: "alerts", why: "Official watches and warnings for this exact location." },
      { id: "nws-state", label: "NWS alerts (statewide)", kind: "alerts", why: "Everything active across the state." },
      { id: "usgs-quake", label: "Earthquakes (past day, M2.5+)", kind: "feed", why: "USGS live seismic feed." },
      { id: "ap-top", label: "AP top stories", kind: "rss", why: "Wire-service national news." },
      { id: "fema", label: "FEMA", kind: "rss", why: "Federal disaster declarations." },
    ],
    local: [{ name: "Demo County Alerts", url: "#" }, { name: "Valley Gazette", url: "#" }],
    sources: [
      { id: "nws-alerts", label: "NWS active alerts (your area)", why: "Official watches and warnings.", items: [
        { title: "Frost Advisory: tonight until 09:00", when: "08-24 18:02", url: "#", severity: "Moderate" },
      ] },
      { id: "usgs-quake", label: "Earthquakes (past day, M2.5+)", why: "USGS live seismic feed.", items: [
        { title: "M 3.1 — 42 km NW of Demo City", when: "08-24 14:02", url: "#" },
        { title: "M 2.6 — 88 km S of Demo Harbour", when: "08-24 09:41", url: "#" },
      ] },
      { id: "ap-top", label: "AP top stories", why: "Wire-service national news.", items: [
        { title: "Demo headline: regional power restored after storm", when: "08-24 16:20", url: "#" },
        { title: "Demo headline: harvest outlook steady across the valley", when: "08-24 12:05", url: "#" },
      ] },
      { id: "local-Demo County", label: "Demo County Alerts", why: "your local source", items: [
        { title: "Road 12 closed at the low bridge — flooding", when: "08-24 15:10", url: "#" },
      ] },
    ],
  },
  "/newsvideo": {
    online: true, metered: false,
    note: "Live video needs internet and moves real data — on a metered link, watch the usage.",
    channels: [
      { name: "Demo News Live", yt: "UCDEMO0000000000000000", kind: "news", why: "Placeholder — add real channels on your own box." },
      { name: "Demo Weather Live", yt: "UCDEMO1111111111111111", kind: "weather", why: "Placeholder." },
    ],
  },
};
})();

/* Sensible empty shapes so an unmocked endpoint renders as "nothing yet"
   instead of throwing and blanking a panel. */
const DEMO_FALLBACK = { ok: true, items: [], devices: [], entries: [], results: [],
                        events: [], nodes: [], channels: [], rules: [], hits: [],
                        drives: [], zones: [], present: false };
