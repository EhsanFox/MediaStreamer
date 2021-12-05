import { exec } from "child_process"
/**
 * @param {String} cmd Command to Run and Execute
 * @param {Boolean} isFFmpeg is Command related to FFMPEG?
 * @returns {Promise<String | Error>} Promise Whatever the executed command gives us
 */
export function executePromise(cmd, isFFmpeg = true) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, out, cmdErr) => {
            if(err)
                reject(err);

            if(cmdErr)
                if(isFFmpeg)
                    resolve(cmdErr);
                else
                    reject(cmdErr);

            if(out)
                resolve(out);
        })
    })
}