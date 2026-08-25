/* Minimal static server for the demo. No dependencies, no framework.

   Serves the public/ directory only. Paths are resolved and then checked to
   be inside that directory — a normalised path is not enough on its own,
   because a crafted request can normalise to something outside it. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const DIR = path.resolve(__dirname, "public");
const PORT = process.env.PORT || 3000;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css",
                ".js": "text/javascript", ".svg": "image/svg+xml",
                ".png": "image/png", ".jpg": "image/jpeg",
                ".json": "application/json", ".woff2": "font/woff2" };

const sendIndex = (res) => {
  res.writeHead(200, { "Content-Type": TYPES[".html"] });
  fs.createReadStream(path.join(DIR, "index.html")).pipe(res);
};

http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const file = path.resolve(DIR, "." + url);
  if (!file.startsWith(DIR)) return sendIndex(res);      /* refuse to escape */

  fs.stat(file, (err, st) => {
    if (err || st.isDirectory()) return sendIndex(res);  /* SPA fallback */
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "public, max-age=300",
      "X-Robots-Tag": "noindex",
    });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, () => console.log("demo on :" + PORT));
