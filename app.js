/* eslint linebreak-style: ["error", "windows"] */
const http = require('http');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { readDir, grayScale } = require('./IOhandler');
const IOhandler = require("./IOhandler");

const server = http.createServer((req, res) => {
  if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
    // parse a file upload
    const form = formidable({ multiples: true, uploadDir: path.join(__dirname, 'uploads'), keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if(err){
        res.writeHead(500, 'Server Error');
        res.end('<h1>error 500</h1>');
      }
      res.writeHead(200, { 'content-type': 'text/html' });
      res.write(fs.readFileSync('./successPage/success.html'));
      res.end(JSON.stringify({ fields, files }, null, 2));
      readDir(path.join(__dirname, 'uploads'))
        .then((pathArray) => {
          pathArray.forEach((element) => {
            grayScale(element, path.join(__dirname, 'grayscale')); // grayscale each image in unzipped folder
          });
        })
        .catch((error) => console.log(error)); // catches errors
    });
    return;
  } 
  else if (req.url === '/css/index.css') {
    res.writeHead(200, { 'context-type': 'text/css' });
    res.write(fs.readFileSync('./css/index.css'));
  } 
  else if(req.url === '/'){
    // show a file upload form
    res.writeHead(200, { 'content-type': 'text/html' });
    res.write(fs.readFileSync('./index.html'));
  }
  res.end();

});

server.listen(8000, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});
