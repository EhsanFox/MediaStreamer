import { Base } from "./Base.js";
import fs from "fs";
import { executePromise } from "./ExecPromise.js";
import { EventEmitter } from "events";

/**
 * @typedef {object} StreamerOptions
 * @property {String} StreamerOptions.file Video File to Stream - required
 * @property {String} StreamerOptions.videoBitrate Bitrate of Video - optional
 * @property {String} StreamerOptions.audioBitrate Bitrate of Audio - optional
 * @property {number} StreamerOptions.audioSampleRate Sample rate of Audio - optional
 * @property {number} StreamerOptions.frameRate Stream Frame Rate - optional
 * @property {number} StreamerOptions.threads CPU Core numbers allowed for FFMPEG to use for Stream, 0 = ALL - optional
 * @property {number} StreamerOptions.audioChannels Audio Channels for Stream - optional
 * @property {number} StreamerOptions.crf Content Rate Factor - optional
 */

/**
 * @class
 * @classdesc Streamer Class
 */
 export class Streamer extends Base {

    /**
     * @type {number}
     * @description CPU Core numbers allowed for FFMPEG to use for Stream
     */
    threads = 0;

    /**
     * @type {string}
     * @description Video File to Stream
     */
    file;

    /**
     * @type {string}
     * @description Video Bitrate
     */
    videoBitrate = '4500k';

    /**
     * @type {String}
     * @description Audio Bitrate
     */
    audioBitrate = '128k';

    /**
     * @type {number}
     * @description Audio Sample Rate
     */
    audioSampleRate = 44100;

    /**
     * @description Stream Frame Rate
     * @type {string}
     */
    frameRate = 25;

    /**
     * @type {number}
     * @description Audio Channels
     */
    audioChannels = 2;

    /**
     * @type {number}
     * @description Content Rate Factor, an x264 argument that tries to keep reasonably consistent video quality, while varying bitrate during more 'complicated' scenes, etc. A value of 30 allows somewhat lower quality and bit rate.
     */
    contentRateFactor = 28;

    /**
     * @description Stream output wrapper
     * @type {string}
     * @private
     */
    #wrapper = 'flv';

    /**
     * @description Video Codec
     * @type {string}
     * @private
     */
    #videoCodec = 'libx264';

    /**
     * @description Audio Codec
     * @type {string}
     * @private
     */
    #audioCodec = 'aac';

    /**
     * @description Encoder Speed
     * @type {string}
     * @private
     */
    #preset = 'medium';

    /**
     * @type {String}
     * @description Bundeled Command to be executed on OS
     * @private
     */
    #BundeledCommand = null;

    /**
     * @param {String} rtmpURL RTMP Url Connection
     * @param {StreamerOptions} opts Options related to your stream 
     */
    constructor(rtmpURL, opts = {})
    {
        super(rtmpURL);
        
        if('threads' in opts)
            this.threads = opts.threads;
        
        if('file' in opts)
            if(fs.existsSync(opts.file))
                this.file = opts.file;
            else
                throw new Error(`${opts.file} is not valid.`);

        if('audioChannels' in opts)
            this.audioChannels = opts.audioChannels;

        if('videoBitrate' in opts)
            this.videoBitrate = opts.videoBitrate;

        if('audioBitrate' in opts)
            this.audioBitrate = opts.audioBitrate;

        if('audioSampleRate' in opts)
            this.audioSampleRate = opts.audioSampleRate;

        if('crf' in opts)
            this.contentRateFactor = opts.crf;

        if('frameRate' in opts)
            this.frameRate = opts.frameRate;

        this.#BundeledCommand = this.#Bundle();
    }

    setFile(path)
    {
        if(path && typeof path == 'string' && path !== '' && fs.existsSync(path))
            this.file = path;
        else
            throw new Error(`Invalid input recived as the file path.`);
    }

    #Bundle()
    {
        if(typeof this.audioBitrate !== 'string' || typeof this.videoBitrate !== 'string' || typeof this.audioChannels !== 'number' || typeof this.audioSampleRate !== 'number' || typeof this.contentRateFactor !== 'number' || typeof this.threads !== 'number' || typeof this.frameRate !== 'number')
            throw new Error(`One of imported values types are not valid.`);

        return `ffmpeg -re -i ${this.file} -pix_fmt yuvj420p -x264-params keyint=48:min-keyint=48:scenecut=-1 -b:v ${this.videoBitrate} -b:a ${this.audioBitrate} -ar ${this.audioSampleRate} -acodec ${this.#audioCodec} -vcodec ${this.#videoCodec} -preset ${this.#preset} -crf ${this.contentRateFactor} -threads ${this.threads} -f ${this.#wrapper} ${this.server}`
    }

    /**
     * @description Start Streaming with FFMPEG
     * @returns {EventEmitter}
     */
    Start()
    {
        let result = new EventEmitter();
        executePromise(this.#BundeledCommand)
        .then(log => result.emit("finish", log))
        .catch(err => result.emit("error", err))
    }
}