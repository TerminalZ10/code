const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('url');

const server = http.createServer((req, res) => {
    const { pathname } = parse(req.url);

    if (pathname === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && pathname === '/todo') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { todoItem } = JSON.parse(body);
            console.log('New to-do item:', todoItem);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item added to the to-do list' }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = 4000;

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
