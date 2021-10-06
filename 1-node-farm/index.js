const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////////
//FILES

// Blocking, Synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about avocados: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);

// console.log('File written!');

// Non-Blocking, Asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (error, data1) => {
//     if (error) return console.log('ERROR!');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
//         // console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (error, data3) => {
//             // console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('File written!');
//             });
//         });
//     });
// });
// console.log('Will read file!');

//////////////////////////////
//SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const slugs = dataObj.map(ele => slugify(ele.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
    const baseURL = req.protocol + '://' + req.headers.host + '/';
    // const reqUrl = new URL(req.url, baseURL);
    // const pathname = req.url;
    const { searchParams, pathname } = new URL(req.url, baseURL);

    // Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const cardsHtml = dataObj.map(ele => replaceTemplate(templateCard, ele)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

        // Product Page
    } else if (pathname === '/product') {
        const productId = searchParams.get('id');
        const product = dataObj[productId];
        console.log(product);

        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const output = replaceTemplate(templateProduct, product);

        res.end(output);

        // API
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json',
        });
        res.end(data);

        // 404
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Not a valid address!</h1>');
    }
});

server.listen(8080, '127.0.0.1', () => {
    console.log('Listening to requests on port 8080');
});