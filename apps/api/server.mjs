import http from "node:http";
import "dotenv/config";
const server = http.createServer((req, res) => {
  if (req.url === "/health") { res.writeHead(200, { "Content-Type": "text/plain" }); res.end("ok"); return; }
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("storiesV13 api");
});
server.listen(4000, () => console.log("API storiesV13 escuchando en :4000 (NODE_ENV=" + (process.env.NODE_ENV || "dev") + ")"));

