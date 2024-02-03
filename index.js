// Import necessary modules
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Set the environment (development or production)
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare the Next.js application
app.prepare().then(() => {
  // Create the server
  createServer((req, res) => {
    // Parse request URL
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // Handle requests
    handle(req, res, parsedUrl);
  }).listen(4000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:4000');
  });
});
