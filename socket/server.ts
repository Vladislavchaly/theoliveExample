const {createServer} = require('http')
const {Server} = require('socket.io')
let spawn = require('child_process').spawn;

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
})

const key = ''
io.on('connection', (socket) => {

    socket.on('stream', (data) => {


        const ffmpeg = spawn('ffmpeg', [
            '-re',
            '-f', 'lavfi',
            '-i', 'testsrc=size=1280x720:rate=30',
            '-f', 'lavfi',
            '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
            '-pix_fmt', 'yuv420p',
            '-c:v', 'libx264',
            '-x264-params', 'keyint=60:scenecut=0',
            '-tune', 'zerolatency',
            '-preset', 'superfast',
            '-c:a', 'aac',
            '-f', 'flv',
            `rtmps://rtmp.europe-west.theo.live/live/${key}`
        ]).on('error', function (m) {
            console.log(m)
            console.error("FFMpeg not found in system cli; please install ffmpeg properly or make a softlink to ./!");
            process.exit(-1);
        });
        ffmpeg.stdin.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });


        ffmpeg.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ffmpeg.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        ffmpeg.on('error', (err) => {
            console.error(`Error starting ffmpeg: ${err}`);
        });

        ffmpeg.stdin.write(data)


    })
})
httpServer.listen(9999)
