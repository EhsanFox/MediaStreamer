/**
 * Streaming Platform
 * @typedef {"youtube" | "twitch" | "unknown"} StreamingPlatforms
 */
export type StreamingPlatforms = "youtube" | "twitch" | "unknown";

/**
 * Supported FFmpeg Process Presets
 * @typedef {"ultrafast" | "fast" | "medium"} ffmpegPreset
 */
export type ffmpegPreset = "ultrafast" | "fast" | "medium";

/**
 * Supported FFmpeg Audio Codecs
 * @typedef {"libmp3lame" | "aac"} ffmpegAudioCodec
 */
export type ffmpegAudioCodec = "libmp3lame" | "aac";

/**
 * Streamer Class Options
 * @interface StreamerOptions
 */
export interface StreamerOptions {
    /**
     * Video File to Stream - optinal
     */
    file?: string;

    /**
     * Bitrate of Video - optional
     */
    videoBitrate?: string;

    /**
     * Bitrate of Audio - optional
     */
    audioBitrate?: string;

    /**
     * Sample rate of Audio - optional
     */
    audioSampleRate?: number;

    /**
     * Stream Frame Rate - optional
     */
    frameRate?: number;

    /**
     * CPU Core numbers allowed for FFMPEG to use for Stream, 0 = ALL - optional
     */
    threads?: number;

    /**
     * Audio Channels for Stream - optional
     */
    audioChannels?: number;

    /**
     * Content Rate Factor - optional
     */
    crf?: number;
}