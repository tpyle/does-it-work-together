const db = require("./db");


const headers = {
    'Access-Control-Allow-Origin': '*'
}


function generateRes(body={}, statusCode=200) {
    return {
        headers,
        statusCode,
        body: JSON.stringify(body)
    }
}


exports.handler = (event) => {
    return new Promise((resolve, reject)=>{
        const { program_id } = event.pathParameters;
        let { version="*", start, end } = event.queryStringParameters;
        version = version.replace("%","").replace("*","%");
        start = Math.floor(Number(start || 0));
        end = Math.floor(Number(end || 20));

        if (isNaN(start) || isNaN(end)) {
            return resolve(generateRes({ message: "Error: `start` and `end` query parameters must be numbers" }, 400));
        }
        if (end <= start) {
            return resolve(generateRes({ message: "Error: `end` must be greater than `start`" }, 400));
        }
        if (!program_id) {
            return resolve(generateRes({ message: "Error: `program_id` must be provided" }, 400))
        }

        db.query("SELECT `version_id`, `version`, `version_description` FROM `versions` WHERE `version` LIKE ? AND program_id = ? LIMIT ?,?", [version, program_id, start, end-start], (err, data)=>{
            if (err) {
                db.end();
                return reject(err);
            }
            db.query("SELECT COUNT(`version_id`) as size FROM `versions` WHERE `version` LIKE ? AND program_id = ?", [version, program_id], (err, sizeData)=>{
                db.end();
                if (err) {
                    return reject(err);
                }
                resolve(generateRes(
                    {
                        data,
                        size: sizeData[0].size
                    }
                ));
            });
        });
    });
}
