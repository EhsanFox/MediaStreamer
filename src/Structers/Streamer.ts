import { Base } from "./Base";
import { executePromise } from "./ExecPromise";
import fs from "fs";
import { EventEmitter } from "events";
import { ffmpegAudioCodec, ffmpegPreset, StreamerOptions } from "../types";

/**
 * Streamer Class
 * @class
 * @extends Base
 */
export class Streamer extends Base {

    /**
     * @type {number}
     * @description CPU Core numbers allowed for FFMPEG to use for Stream
     * @public
     */
    public threads: number = 0;

    /**
     * @type {string}
     * @description Video File to Stream
     * @public
     */
    // eslint-disable-next-line
    // @ts-ignore
    public file: string;

    /**
     * @type {string}
     * @description Video Bitrate
     * @public
     */
    public videoBitrate: string = '4500k';

    /**
     * @type {String}
     * @description Audio Bitrate
     * @public
     */
    public audioBitrate: string = '128k';

    /**
     * @type {number}
     * @description Audio Sample Rate
     * @public
     */
    public audioSampleRate: number = 44100;

    /**
     * @description Stream Frame Rate
     * @type {number}
     * @public
     */
    public frameRate: number = 25;

    /**
     * @type {number}
     * @description Audio Channels
     * @public
     */
    public audioChannels: number = 2;

    /**
     * @public
     * @type {number}
     * @description Content Rate Factor, an x264 argument that tries to keep reasonably consistent video quality, while varying bitrate during more 'complicated' scenes, etc. A value of 30 allows somewhat lower quality and bit rate.
     */
    public contentRateFactor: number = 28;

    /**
     * @description Stream output wrapper
     * @type {string}
     * @private
     */
    private wrapper: string = 'flv';

    /**
     * @description Video Codec
     * @type {string}
     * @private
     */
    private videoCodec: string = 'libx264';

    /**
     * @description Audio Codec
     * @type {string}
     * @public
     */
    public audioCodec: ffmpegAudioCodec = 'aac';

    /**
     * @description Encoder Speed
     * @type {string}
     * @public
     */
    public preset: ffmpegPreset = 'medium';

    /**
     * @type {String}
     * @description Bundeled Command to be executed on OS
     * @private
     */
    private BundeledCommand: string = "";

    /**
     * @param {String} rtmpURL RTMP Url Connection
     * @param {StreamerOptions} opts Options related to your stream 
     */
    constructor(rtmpURL: string, opts: StreamerOptions = {})
    {
        super(rtmpURL);
        
        if('threads' in opts && typeof opts.threads == "number")
            this.threads = opts.threads;
        
        if('file' in opts)
            if(fs.existsSync(opts.file as string))
                this.file = opts.file as string;
            else
                throw new Error(`${opts.file} is not valid.`);

        if('audioChannels' in opts)
            this.audioChannels = opts.audioChannels as number;

        if('videoBitrate' in opts)
            this.videoBitrate = opts.videoBitrate as string;

        if('audioBitrate' in opts)
            this.audioBitrate = opts.audioBitrate as string;

        if('audioSampleRate' in opts)
            this.audioSampleRate = opts.audioSampleRate as number;

        if('crf' in opts)
            this.contentRateFactor = opts.crf as number;

        if('frameRate' in opts)
            this.frameRate = opts.frameRate as number;

        this.Bundle();
    }

    /**
     * Set file to stream
     * @param {String} path - File path - required 
     * @returns {Streamer}
     */
    public setFile(path: string): this
    {
        if(path && typeof path == 'string' && path !== '' && fs.existsSync(path))
            this.file = path;
        else
            throw new Error(`Invalid input recived as the file path.`);

        this.Bundle()
        return this;
    }

    /**
     * Set Video Bitrate
     * @param {String} x - Video bitrate 
     * @returns {Streamer}
     */
    public setVideoBitrate(x: string): this
    {
        this.videoBitrate = x;
        this.Bundle()
        return this;
    }

    /**
     * Set Audio Bitrate
     * @param {String} x - Audio bitrate 
     * @returns {Streamer}
     */
    public setAudioBitrate(x: string): this
    {
        this.audioBitrate = x
        this.Bundle()
        return this;
    }

    /**
     * Set Audio Sample rate
     * @param {Number} x - Audio Sample Rate
     * @returns {Streamer}
     */
    public setAudioSampleRate(x: number): this
    {
        this.audioSampleRate = x;
        this.Bundle()
        return this;
    }

    /**
     * Set Stream Frame rate
     * @param {Number} x - Frame Rate 
     * @returns {Streamer}
     */
    public setFrameRate(x: number): this
    {
        this.frameRate = x;
        this.Bundle()
        return this;
    }

    /**
     * Set CPU Cores/threads to use
     * @param {Number} x - CPU Cores
     * @returns {Streamer}
     */
    public setThreads(x: number): this
    {
        this.threads = x;
        this.Bundle()
        return this;
    }

    /**
     * Set Audio Channels
     * @param {Number} x - Audio Channels
     * @returns {Streamer}
     */
    public setAudioChannels(x: number): this
    {
        this.audioChannels = x;
        this.Bundle()
        return this;
    }

    /**
     * Set Content Rate Factor
     * @param {Number} x - Content Rate Factor
     * @returns {Streamer}
     */
    public setCRF(x: number): this
    {
        this.contentRateFactor = x;
        this.BundeledCommand = this.Bundle()
        return this;
    }

    /**
     * Set Streaming process preset
     * @param {ffmpegPreset} x - Process preset
     * @returns {Streamer}
     */
    public setPreset(x: ffmpegPreset): this
    {
        this.preset = x;
        this.Bundle()
        return this;
    }

    /**
     * Bundle the executable FFMPEG Command
     * @returns {String}
     * @private
     */
    private Bundle(): string
    {
        if(typeof this.audioBitrate !== 'string' || typeof this.videoBitrate !== 'string' || typeof this.audioChannels !== 'number' || typeof this.audioSampleRate !== 'number' || typeof this.contentRateFactor !== 'number' || typeof this.threads !== 'number' || typeof this.frameRate !== 'number' || !["ultrafast", "fast", "medium"].includes(this.preset))
            throw new Error(`One of imported values types are not valid.`);
        
        const result = `ffmpeg -re -i ${this.file} -pix_fmt yuvj420p -x264-params keyint=48:min-keyint=48:scenecut=-1 -b:v ${this.videoBitrate} -b:a ${this.audioBitrate} -ar ${this.audioSampleRate} -acodec ${this.audioCodec} -vcodec ${this.videoCodec} -preset ${this.preset} -crf ${this.contentRateFactor} -threads ${this.threads} -f ${this.wrapper} "${this.RTMPServer}"`
        this.BundeledCommand = result;
        return result;
    }

    /**
     * @description Start Streaming with FFMPEG
     * @returns {EventEmitter}
     */
    start()
    {
        const result = new EventEmitter();
        executePromise(this.BundeledCommand)
        .then(log => result.emit("finish", log))
        .catch(err => result.emit("error", err));
        return result;
    }
}