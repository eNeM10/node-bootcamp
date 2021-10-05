const fs = require('fs');

// Blocking, Synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about avocados: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);

// console.log('File written!');

// Non-Blocking, Asynchronous way
fs.readFile('./txt/start.txt', 'utf-8', (error, data1) => {
    if (error) return console.log('ERROR!');
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
        // console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (error, data3) => {
            // console.log(data3);
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
                console.log('File written!');
            });
        });
    });
});
console.log('Will read file!');