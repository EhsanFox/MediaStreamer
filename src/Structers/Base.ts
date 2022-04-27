import { StreamingPlatforms } from "../types";

/**
 * @class
 * @classdesc Base Class for Streamer Class
 */
export class Base {

    /**
     * RTMP Connection URL
     * @type {String}
     * @readonly
     */
    readonly RTMPServer: string;

    /**
     * @description Detected Platform from RTMP Url
     * @type {StreamingPlatforms}
     * @readonly
     */
    readonly platform: StreamingPlatforms;

    /**
     * @param {String} rtmpURL RTMP Connection URL
     */
    constructor(rtmpURL: string)
    {
        if(rtmpURL.split("://")[0].toLowerCase() == 'rtmp' || rtmpURL.split("://")[0].toLowerCase() == 'rtmps')
            this.RTMPServer = rtmpURL;
        else
            throw new Error(`Only RTMP(s) Connections are Supported.`);

        //Detect platform
        if(rtmpURL.split(".").includes("youtube"))
            this.platform = "youtube";
        else if(rtmpURL.split(".").includes("live-video"))
            this.platform = "twitch";
        else
            this.platform = "unknown";
    }
}