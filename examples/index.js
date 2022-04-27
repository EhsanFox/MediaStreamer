/**
 * Choose the one you want:
 * 1- ESM / Modules
 *  * import { Streamer } from "mediastreamer"
 * 2- CommonJS/CJS
 *  * const { Streamer } = require("mediastreamer")
 */
const { Streamer } = require("mediastreamer")
const myStream = new Streamer('rtmp://......')
myStream
    .setPreset('medium')
    .setFile('/path/to/file.mp4')
    .setThreads(0) // ALL Cpu Cores

const streamStatus = myStream.start();

streamStatus.on("finish", () => console.log(`Stream ended.`))
streamStatus.on("error", (e) => console.error(e));