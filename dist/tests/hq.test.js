import stream from 'stream';
import execa from 'execa';
const { Readable } = stream;
const test = async () => {
    const subprocess = execa('./dist/src/cli.js');
    const readable = Readable.from([
        `<html><p attr0=val0>content0</html>`
    ]);
    readable.pipe(subprocess.stdin);
    const { stdout } = await subprocess;
    console.log(stdout);
};
test();
