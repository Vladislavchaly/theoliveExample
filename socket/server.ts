const { createServer } = require('http')
const { Server } = require('socket.io')
let spawn = require('child_process').spawn;

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

const key = ''
io.on('connection', (socket) => {
  console.log(socket.connected)
  socket.on('stream', (data) => {
    const ffmpeg = spawn('ffmpeg', [
      "-f",
      "lavfi",
      "-i",
      "anullsrc",
      "-i",
      "-",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-tune",
      "zerolatency",
      "-c:a",
      "aac",
      "-f",
      "flv",
      `rtmps://rtmp.europe-west.theo.live/live/${key}`
    ]).on('error',function(m){
      console.log(m)
      console.error("FFMpeg not found in system cli; please install ffmpeg properly or make a softlink to ./!");
      process.exit(-1);
    });

     ffmpeg.stdin.write(data, (c) => {
       console.log(c)
     })
  })
})
httpServer.listen(9999)
