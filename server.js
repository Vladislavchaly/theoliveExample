const {createServer} = require('http')
const {Server} = require('socket.io')
let spawn = require('child_process').spawn;

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
})

const key = '84b6f036-c3cb-4516-8c53-23ac7a45d4ed'
io.on('connection', (socket) => {

    const ops = [
        '-i', '-',
        '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
        '-max_muxing_queue_size', '1000',
        '-bufsize', '5000',
        '-r', '30', '-g', '30', '-keyint_min', '30',
        '-x264opts', 'keyint=30', '-crf', '25', '-pix_fmt', 'yuv420p',
        '-profile:v', 'baseline', '-level', '3',
        '-c:a', 'aac', '-b:a', '64k', '-ar', '44100',
        '-f', 'flv', `rtmp://rtmp.europe-west.theo.live/live/${key}`
    ];


    let ffmpeg_process = spawn('ffmpeg', ops);

    ffmpeg_process.stderr.on('data', function (d) {
        socket.emit('ffmpeg_stderr', '' + d);
        console.log('ffmpeg_stderr', '' + d);
    });

    ffmpeg_process.on('error', function (e) {
        console.log('child process error' + e);
        socket.emit('fatal', 'ffmpeg error!' + e);

    });

    ffmpeg_process.on('exit', function (e) {
        console.log('child process exit' + e);

        socket.disconnect();
    });


    socket.on('stream',  (data) => {
        console.log('connected')
        ffmpeg_process.stdin.write(data);
    });
})
httpServer.listen(9999)
