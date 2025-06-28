const http = require('http');
const path = require('path');
const fs = require('fs');
const port = 5050;

const server = http.createServer((req, res) => {
    const logRequest = `${new Date().toLocaleString()} ${req.method} ${req.url}\n`;

    fs.appendFile('log.data', logRequest, 'utf8', err => {
        if (err) {
            console.error(err);
        }
    });

    if (req.method === 'GET' && req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');

        res.end('Home Page');
    }
    else if (req.method === 'GET' && req.url === '/about') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');

        res.end('About Page');
    }
    else if (req.method === 'POST' && req.url === '/echo') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');

        res.end(String(Date.now()));
    }
    else if (req.method === 'GET' && req.url === '/htmlfile') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end('Server Error');
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(data);
        });
    }
    else if (req.method === 'GET' && req.url === '/image') {
        fs.readFile(path.join(__dirname, 'public', 'test-img.png'), (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end('Server Error');
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/png');
            res.end(data);
        });
    }
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');

        res.end('404 Not Found');
    }
});

server.listen(port, () => console.log('start native server'));