import { exec } from "child_process";

/**
 * @param {String} cmd Command to Run and Execute
 * @param {Boolean} isFFmpeg is Command related to FFMPEG?
 * @returns {Promise<String | Error>} Promise Whatever the executed command gives us
 */
export async function executePromise(cmd: string, isFFmpeg: boolean = true) {
    exec(cmd, (err, out, cmdErr) => {
        if(err)
            throw err

        if(cmdErr)
            if(isFFmpeg)
                return cmdErr
            else
                throw cmdErr;

        if(out)
            return out;
    })
}