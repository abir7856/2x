const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const port = process.env.PORT || 8000;

const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.join(root, urlPath);
    if (filePath.endsWith(path.sep)) filePath = path.join(filePath, 'index.html');

    fs.stat(filePath, (err, st) => {
      if (err || !st.isFile()) {
        res.statusCode = 404;
        return res.end('Not Found');
      }
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    });
  } catch (e) {
    res.statusCode = 500;
    res.end('Server error');
  }
});

server.listen(port, () => {
  console.log(`Server at http://localhost:${port}/`);
});