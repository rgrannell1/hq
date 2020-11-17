import execa from 'execa';
import * as fs from 'fs';
const readStream = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
};
const test = async () => {
    const subprocess = execa('./dist/src/cli.js');
    fs.createReadStream('./example.html').pipe(subprocess.stdin);
    const content = await readStream(subprocess.stdout);
    console.log(content);
    console.log(content);
    console.log(content);
};
test();
