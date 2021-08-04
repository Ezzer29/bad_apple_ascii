const jimp = require('jimp');
const br = require('./braille.json');

let ff = 1; // first frame
let lf = 6572; // last frame (could use fs to auto detect this, but i.m too lazy)
let scale_const = 3; // How many times will the original scale be divided
let threshold = 75; // above what rgb value (0-255) to consider a 'pixel' white

async function magicFunction (imgId) {
    await jimp.read('./frames/' + imgId + '.png', async (err, img) => {
        if (err) throw err;
        let w = await img.bitmap.width/scale_const;
        let h = await img.bitmap.height/scale_const;
        img.resize(w, h);
        let map = [];
        let line = [];
        img.scan(0, 0, w, h, function (x, y, idx) {
            let pix = this.bitmap.data[idx + 0];
            if ( pix <= threshold ) line.push(1); else line.push(0);
            if ( x == w-1 ) {
                map.push(line);
                line = [];
            }
        });

        console.clear();
        let fs = '';
        for ( let i = 0; i < map.length; i += 3 ) {
            let l = '';
            for ( let j = 0; j < map[i].length; j += 2 ) {
                let x = '';
                if ( map[i+1][j] == undefined || map[i+2][j] == undefined || map[i][j+1] == undefined || map[i+1][j+1] == undefined || map[i+2][j+1] == undefined ) break; // Havent teste this yet... idk if it works
                x += (!map[i][j] * 1).toString();
                x += (!map[i+1][j] * 1).toString();
                x += (!map[i+2][j] * 1).toString();
                x += (!map[i][j+1] * 1).toString();
                x += (!map[i+1][j+1] * 1).toString();
                x += (!map[i+2][j+1] * 1).toString();
                l += br[x];
            }
            // console.log(l);
            fs += l + '\n';
        }
        console.log(fs);
        // this should reduce the screen tearing like effect that occurs on some terminals
    });
}

let cont = 1;

let inv = setInterval(() => {
    if ( cont <= lf ) {
        magicFunction(cont);
        cont += 1;
    } else clearInterval(inv);
}, 1000/30);