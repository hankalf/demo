/* ─────────────────────────────────────────────────────────────────────────
   DEMO FIXTURES — entirely invented data.

   Nothing in this file comes from the real station. It is written by hand so
   that sanitising a live export is never part of the process: there is no
   copy step where something private could survive. Coordinates are a
   fictional site, channel names carry no keys, and every name, count and
   reading below was made up to look plausible.

   If you are reading this to learn the shape of the API — that is the point.
   ───────────────────────────────────────────────────────────────────────── */

const DEMO_SITE = { lat: 44.2601, lon: -72.5754, place: "Demo Valley" };
const now = () => Math.floor(Date.now() / 1000);
const ago = (m) => now() - m * 60;

const DEMO_FIXTURES = {
  "/health": { ok: true, uptime_s: 447283, version: "demo" },

  "/sysbars": {
    cpu_pct: 14, mem_pct: 38, temp_c: 46.2,
    ambient_c: 21.4, ambient_rh: 47
  },

  "/net/pulse": { online: true, metered: false, latency_ms: 38, via: "starlink" },

  "/status": { ok: true },

  "/power": {
    source: "battery", watts: 24.6, battery_pct: 72,
    runtime_min: 512, charging: false,
    history: Array.from({ length: 40 }, (_, i) => ({
      t: ago(40 - i), w: 22 + Math.round(Math.sin(i / 4) * 4) })),
  },
  "/power/draw": { total_w: 24.6, rails: [
    { name: "Pi + storage", w: 8.4 }, { name: "SDR ×2", w: 5.1 },
    { name: "Router + switch", w: 6.0 }, { name: "Screen", w: 3.2 },
    { name: "Mesh node", w: 1.9 }] },

  "/endurance": { hours_remaining: 8.5, draw_w: 24.6, battery_wh: 288 },

  /* ── comms ── */
  "/mesh": {
    present: true, connected: true, me: 111111111, ts: now(),
    nodes: [
      { num: 111111111, short: "DBAS", long: "Demo Base Station", lat: 44.2601, lon: -72.5754, snr: null, battery: 100, lastHeard: now() },
      { num: 222222222, short: "DMOB", long: "Demo Mobile Unit", lat: 44.2688, lon: -72.5620, snr: 6.5, battery: 78, lastHeard: ago(4) },
      { num: 333333333, short: "DRLY", long: "Demo Ridge Relay", lat: 44.2810, lon: -72.5930, snr: 4.0, battery: 91, lastHeard: ago(11) },
      { num: 444444444, short: "K1AB", long: "Neighbour Node", lat: 44.2450, lon: -72.6100, snr: -3.5, battery: 64, lastHeard: ago(38) },
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
    { id: 1, from: "Demo Mobile Unit", fromNum: 222222222, to: "^all", channel: 1, text: "Heading out to the ridge, back before dark.", dir: "rx", t: ago(52), snr: 6.5 },
    { id: 2, from: "me", to: "^all", channel: 1, text: "Copy. Radio check when you get there.", dir: "tx", t: ago(50) },
    { id: 3, from: "Demo Mobile Unit", fromNum: 222222222, to: "^all", channel: 1, text: "On the ridge. Clear line to the valley.", dir: "rx", t: ago(18), snr: 5.0 },
    { id: 4, from: "Demo Ridge Relay", fromNum: 333333333, to: "^all", channel: 4, text: "WX: wind gusting 30mph on the ridge", dir: "rx", t: ago(9), snr: 4.0 },
  ] },
  "/mesh/outbox": { queue: [] },
  "/mesh/config": { connected: true },
  "/mesh/trails": { trails: {} },
  "/mesh/canned": { items: ["Radio check", "On my way", "Arrived safe", "Need assistance"] },
  "/mesh/autoalerts": { weather: true, radio: true, channel: 4 },
  "/mesh/deploy": { nodes: [] },

  "/sdr": { present: true, mode: "pager", freq: 152.007, demod: "nfm", count: 2 },
  "/sdr/hw": {
    roles: { dial: "DEMO-DIAL", watch: "DEMO-WATCH" }, count: 2,
    devices: [{ serial: "DEMO-DIAL", role: "dial" }, { serial: "DEMO-WATCH", role: "watch" }],
    dial_present: true, watch_present: true,
    failsafe: "both roles present — dial and 24/7 watch run independently",
  },
  "/sdr/health": { ok: true, checks: [] },
  "/sdr/bands": { bands: [] },
  "/sdr/watch": { watching: true, freq: 162.475, label: "NOAA WX4" },

  "/comms/feed": { events: [
    { t: ago(3), kind: "433", text: "Sensor: driveway beam — clear" },
    { t: ago(21), kind: "wx", text: "NOAA SAME: no active alerts" },
    { t: ago(47), kind: "pager", text: "POCSAG: routine test page" },
    { t: ago(96), kind: "aprs", text: "Position beacon heard, 12 km SW" },
  ] },

  "/fleet": { radios: [
    { id: 1, name: "Handheld 1", model: "UV-5R Mini", carrier: "Base", programmed: true },
    { id: 2, name: "Handheld 2", model: "UV-5R Mini", carrier: "Mobile", programmed: true },
  ], channels: [
    { ch: 1, name: "FLEET-1", freq: 151.820, mode: "NFM" },
    { ch: 2, name: "FLEET-2", freq: 151.880, mode: "NFM" },
    { ch: 3, name: "WX-4", freq: 162.475, mode: "NFM" },
  ] },
  "/fleet/watch": { channel: "FLEET-1", freq: 151.820 },
  "/chirp": { files: [{ file: "demo-golden.img", model: "UV-5R Mini" }] },
  "/radio": { ports: [] },

  /* ── weather & sky ── */
  "/weather": {
    cached: true, fetched: ago(63), place: DEMO_SITE.place,
    now: { temp_c: 18.4, feels_c: 17.9, rh: 52, wind_kph: 14, desc: "Partly cloudy" },
    days: [
      { date: "Mon", hi_c: 22, lo_c: 11, desc: "Sunny", pop: 5 },
      { date: "Tue", hi_c: 24, lo_c: 13, desc: "Partly cloudy", pop: 15 },
      { date: "Wed", hi_c: 19, lo_c: 12, desc: "Rain", pop: 80 },
      { date: "Thu", hi_c: 17, lo_c: 9, desc: "Showers", pop: 60 },
      { date: "Fri", hi_c: 21, lo_c: 10, desc: "Clearing", pop: 20 },
      { date: "Sat", hi_c: 23, lo_c: 12, desc: "Sunny", pop: 0 },
      { date: "Sun", hi_c: 25, lo_c: 14, desc: "Sunny", pop: 5 },
    ],
    alerts: [],
  },
  "/sat/passes": {
    tles: true, sgp4: true, tle_age_h: 9, sdr_count: 2,
    cfg: { min_elev: 25, record: true },
    birds: [{ name: "METEOR-M2 3" }, { name: "METEOR-M2 4" }],
    passes: [
      { sat: "METEOR-M2 4", aos: now() + 3400, los: now() + 4100, max_el: 68, freq: 137.1 },
      { sat: "METEOR-M2 3", aos: now() + 19800, los: now() + 20400, max_el: 41, freq: 137.9 },
    ],
  },
  "/sat/images": { images: [] },
  "/grid": { ba: "DEMO-ISO", now_mw: 41250, pct_of_peak: 68, state: "calm",
             note: "Demand well below peak — the grid is not under strain." },

  /* ── farm, animals, preserving ── */
  "/farm": {
    almanac: { sunrise: "06:14", sunset: "19:52", daylen_h: 13.6,
               daylen_trend_min_wk: -14,
               moon: { phase: "Waxing gibbous", illum_pct: 78, age_d: 11 } },
    frost_last: "05-15", frost_first: "10-02", days_to_first_frost: 39,
    crops: [
      { id: 1, name: "Tomatoes", variety: "Roma", planted: "2026-05-20", dtm: 75, harvest: "2026-08-03", days_to_harvest: -21 },
      { id: 2, name: "Beans", variety: "Blue Lake", planted: "2026-06-10", dtm: 58, harvest: "2026-08-07", days_to_harvest: -17 },
    ],
  },
  "/farm/seeds": { seeds: [
    { id: 1, name: "Tomato", variety: "Roma", year: 2024, packets: 2, viability: "good", notes: "keeps ~4y" },
    { id: 2, name: "Bean", variety: "Blue Lake", year: 2025, packets: 4, viability: "good", notes: "" },
    { id: 3, name: "Lettuce", variety: "Buttercrunch", year: 2023, packets: 1, viability: "fading", notes: "sow thickly" },
  ] },
  "/farm/plan": { suggestions: [], avoid: [] },
  "/farm/log": { entries: [] },

  "/animals": {
    animals: [
      { id: 1, name: "Ranger", label: "Dog", kind: "pet", count: 1, weight_lb: 62, water_gal: 0.484, feed_lb: 1.55, meds: "none", notes: "" },
      { id: 2, name: "Willow", label: "Cat", kind: "pet", count: 1, weight_lb: 11, water_gal: 0.086, feed_lb: 0.22, meds: "", notes: "" },
      { id: 3, name: "flock", label: "Chicken (laying hen)", kind: "livestock", count: 6, weight_lb: 0, water_gal: 0.48, feed_lb: 1.5, gives: "~5 eggs/week in season", notes: "" },
    ],
    kinds: [
      { id: "dog", label: "Dog", kind: "pet" }, { id: "cat", label: "Cat", kind: "pet" },
      { id: "bird", label: "Bird (parrot/finch)", kind: "pet" }, { id: "reptile", label: "Reptile", kind: "pet" },
      { id: "hen", label: "Chicken (laying hen)", kind: "livestock" },
      { id: "goat", label: "Goat (dry)", kind: "livestock" },
      { id: "rabbit", label: "Rabbit", kind: "livestock" },
    ],
    feed_lb: 120, water_gal: 40,
    total_water_gal: 1.05, total_feed_lb: 3.27, feed_days: 36.7, water_days: 38.1, log: [],
  },

  "/preserve": {
    altitude_ft: 600, wb_added_min: 0, dial_psi: 11, weighted_psi: 10,
    foods: [
      { name: "Tomatoes (crushed, acidified)", acid: "acid", method: "water bath", pints: 35, quarts: 45, note: "MUST be acidified: 1 tbsp bottled lemon juice per pint." },
      { name: "Jam / jelly", acid: "acid", method: "water bath", pints: 10, quarts: 10, note: "" },
      { name: "Green beans", acid: "low", method: "pressure", pints: 20, quarts: 25, pressure: { dial_psi: 11, weighted_psi: 10 }, note: "Low-acid. Pressure only, never a water bath." },
      { name: "Beef / venison (cubed)", acid: "low", method: "pressure", pints: 75, quarts: 90, pressure: { dial_psi: 11, weighted_psi: 10 }, note: "Low-acid." },
    ],
    drying: [
      { item: "Apples", temp: "135 °F / 57 °C", hours: "6–12 h", done: "leathery, no moisture when torn" },
      { item: "Jerky (beef/venison)", temp: "160 °F / 71 °C", hours: "4–8 h", done: "meat must reach 160 °F" },
    ],
    log: [{ id: 1, date: "2026-08-12", what: "Tomatoes", jars: "9", method: "water bath", notes: "good seals" }],
  },

  /* ── security ── */
  "/armory": {
    guns: [], ammo: [], gear: [], total_rounds: 0,
    calibers: ["9mm", ".22 LR", "5.56 / .223", "12 ga"],
  },
  "/evac": {
    tiers: [["5min", "5 minutes — life only"], ["15min", "15 minutes — the essentials"],
            ["30min", "30+ minutes — comfort and recovery"], ["house", "Before the door closes"]],
    items: [
      { id: 1, tier: "5min", item: "Everyone + pets in the vehicle", why: "People first. Count heads, count animals.", done: false },
      { id: 2, tier: "5min", item: "Medication bag", why: "One bag, one grab.", done: false },
      { id: 3, tier: "5min", item: "Document binder", why: "IDs, deeds, insurance.", done: false },
      { id: 4, tier: "15min", item: "Power station + panel", why: "Heavy — load it early.", done: false },
      { id: 5, tier: "15min", item: "Go-bags", why: "Grab, do not audit.", done: false },
      { id: 6, tier: "30min", item: "Food box", why: "Shelf-stable, no-cook first.", done: false },
      { id: 7, tier: "house", item: "Water off at the main", why: "A burst pipe ruins what the event did not.", done: false },
    ],
  },
  "/perimeter": { armed: false, zones: [
    { id: 1, name: "Driveway", last: ago(34), state: "clear" },
    { id: 2, name: "Back gate", last: ago(180), state: "clear" },
  ] },
  "/cams": { cams: [], bridge_running: false },
  "/checkin": { people: [
    { id: 1, name: "Alex", status: "home", t: ago(120) },
    { id: 2, name: "Sam", status: "away", t: ago(45), note: "at the ridge" },
  ] },
  "/sos": { active: false, sent: 0, interval: 300 },

  /* ── system & net ── */
  "/hotspot": { active: true, ssid: "DemoStation", clients: 3 },
  "/net/clients": { clients: [
    { name: "phone-1", ip: "10.0.0.21", mac: "aa:bb:cc:00:00:01" },
    { name: "tablet", ip: "10.0.0.22", mac: "aa:bb:cc:00:00:02" },
    { name: "laptop", ip: "10.0.0.23", mac: "aa:bb:cc:00:00:03" },
  ] },
  "/router/data": {
    ip: "10.0.0.1", url: "#", embeddable: false, configured: false,
    embed_note: "The router refuses to be embedded — it sends X-Frame-Options: DENY.",
    note: "Demo — no router is attached.",
  },
  "/starlink": { present: false, note: "Demo — no dish attached." },
  "/wan/budget": { metered: false, used_gb: 0, cap_gb: null },
  "/usb": { devices: [
    { name: "SDR · DEMO-DIAL", port: "hub 1" }, { name: "SDR · DEMO-WATCH", port: "hub 2" },
    { name: "Mesh node", port: "hub 3" }, { name: "Storage", port: "usb3" },
  ] },
  "/climate": { temp_c: 24.1, rh: 44, dew_c: 11.2, note: "comfortable" },
  "/gps": { present: true, fix: true, sats: 9, lat: DEMO_SITE.lat, lon: DEMO_SITE.lon, alt_m: 232 },
  "/clock": { source: "gps", drift_s: 0.2 },
  "/kiosk": { mode: "auto", hdmi: false, running: false },
  "/selftest": { passed: 32, total: 32, checks: [] },
  "/vault": { unlocked: false },
  "/fs/drives": { drives: [{ id: "ssd", label: "Content drive", size_gb: 1007, free_gb: 838 }] },
  "/content/progress": { running: false, phase: "idle" },
  "/migrate": { running: false, present: false },
  "/fetchq": { items: [], metered: false },
  "/nas": { connected: false },

  /* ── knowledge, media, tools ── */
  "/media": { items: [] },
  "/docs/search": { results: [] },
  "/docs/context": { results: [] },
  "/events/search": { events: [] },
  "/supplies": { items: [
    { id: 1, name: "Water (stored)", qty: 60, unit: "gal", min: 40 },
    { id: 2, name: "Rice", qty: 40, unit: "lb", min: 25 },
    { id: 3, name: "Propane", qty: 3, unit: "tank", min: 2 },
  ] },
  "/bulletin": { notes: [
    { id: 1, who: "Alex", text: "Generator serviced, oil changed.", t: ago(600) },
  ] },
  "/calendar": { events: [] },
  "/drills": { drills: [] },
  "/trends": { series: [] },
  "/brief": { lines: ["Demo brief — all systems nominal.", "No active weather alerts.", "Mesh: 4 nodes heard in the last hour."] },
  "/notifications": { items: [] },
  "/alerts/rules": { rules: [] },
  "/plan": { pace: {} },
  "/pace": { primary: "Mesh", alternate: "FRS/GMRS", contingency: "NOAA WX", emergency: "Whistle + visual" },
  "/medical": { profiles: [], meds: [], vitals: [] },
  "/nav": { waypoints: [
    { id: 1, name: "Rally point", lat: 44.2700, lon: -72.5800 },
    { id: 2, name: "Water source", lat: 44.2550, lon: -72.5900 },
  ] },
  "/news": {
    online: true, metered: false,
    selected: ["nws-alerts", "usgs-quake", "ap-top"],
    available: [
      { id: "nws-alerts", label: "NWS active alerts (your area)", kind: "alerts", why: "Official watches and warnings." },
      { id: "usgs-quake", label: "Earthquakes (past day, M2.5+)", kind: "feed", why: "USGS live seismic feed." },
      { id: "ap-top", label: "AP top stories", kind: "rss", why: "Wire-service national news." },
    ],
    local: [],
    sources: [
      { id: "nws-alerts", label: "NWS active alerts (your area)", why: "Official watches and warnings.", items: [] },
      { id: "usgs-quake", label: "Earthquakes (past day, M2.5+)", why: "USGS live seismic feed.", items: [
        { title: "M 3.1 — 42 km NW of Demo City", when: "08-24 14:02", url: "#" },
        { title: "M 2.6 — 88 km S of Demo Harbour", when: "08-24 09:41", url: "#" },
      ] },
      { id: "ap-top", label: "AP top stories", why: "Wire-service national news.", items: [
        { title: "Demo headline: regional power restored after storm", when: "08-24 16:20", url: "#" },
        { title: "Demo headline: harvest outlook steady across the valley", when: "08-24 12:05", url: "#" },
      ] },
    ],
  },
  "/newsvideo": {
    online: true, metered: false,
    note: "Live video needs internet and moves real data.",
    channels: [
      { name: "Demo News Live", yt: "UCDEMO0000000000000000", kind: "news", why: "Placeholder — add real channels on your own box." },
      { name: "Demo Weather Live", yt: "UCDEMO1111111111111111", kind: "weather", why: "Placeholder." },
    ],
  },
};

/* Sensible empty shapes so an unmocked endpoint renders as "nothing yet"
   instead of throwing and blanking a panel. */
const DEMO_FALLBACK = { ok: true, items: [], devices: [], entries: [], results: [],
                        events: [], nodes: [], channels: [], rules: [], present: false };
