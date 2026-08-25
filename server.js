/* Minimal static server for the demo. No dependencies, no framework —
   it serves exactly one directory and nothing else. Railway sets PORT. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css",
                ".js": "text/javascript", ".svg": "image/svg+xml",
                ".png": "image/png", ".json": "application/json" };

http.createServer((req, res) => {
  /* one page app: everything resolves to index.html, and path traversal
     cannot escape DIR because we only ever join a basename */
  const url = (req.url || "/").split("?")[0];
  const name = url === "/" ? "index.html" : path.basename(url);
  const file = path.join(DIR, name);
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(200, { "Content-Type": TYPES[".html"] });
      return fs.createReadStream(path.join(DIR, "index.html")).pipe(res);
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(name)] || "application/octet-stream",
      "Cache-Control": "public, max-age=300",
      "X-Robots-Tag": "noindex",
    });
    res.end(buf);
  });
}).listen(PORT, () => console.log("demo on :" + PORT));
