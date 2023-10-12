const http=require('http');
const ip='127.0.0.1';
const port='3000';
const server=http.createServer((req,res) => {
  res.write("Hello from Node");
  res.end();
});

server.listen(port, ip, () => {
  console.log(`[-] INFO :: Server running at http://${ip}:${port}/`);
});