/**
 * @class
 * @classdesc Base Class for Streamer Class
 */
export class Base {

    /**
     * RTMP Connection URL
     * @type {String}
     * @private
     */
    #RTMPServer;

    /**
     * @description Detected Platform from RTMP Url
     * @type {String}
     */
    platform;

    /**
     * @param {String} rtmpURL RTMP Connection URL
     */
    constructor(rtmpURL)
    {
        if(rtmpURL.split(":")[0].toLowerCase() !== 'rtmp')
            throw new Error(`Only RTMP Connections are Supported.`);

        this.#RTMPServer = rtmpURL;

        //Detect platform
        if(rtmpURL.split(".").includes("youtube"))
            this.platform = "youtube";
        else if(rtmpURL.split(".").includes("live-video"))
            this.platform = "twitch";
    }

    /**
     * @readonly
     * @description RTMP URL of Connection
     */
    get server()
    {
        return this.#RTMPServer;
    }
}