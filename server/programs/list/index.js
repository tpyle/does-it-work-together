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
        let { program_name, start, end } = event.queryStringParameters;
        program_name = program_name.replace("%","").replace("*","%");
        start = Math.floor(Number(start || 0));
        end = Math.floor(Number(end || 20));

        if (isNaN(start) || isNaN(end)) {
            return resolve(generateRes({ message: "Error: `start` and `end` query parameters must be numbers" }, 400));
        }
        if (end <= start) {
            return resolve(generateRes({ message: "Error: `end` must be greater than `start`" }, 400));
        }

        db.query("SELECT `program_name`, `program_id` FROM `programs` WHERE `program_name` LIKE ? LIMIT ?,?", [program_name, start, end-start], (err, data)=>{
            if (err) {
                db.end();
                return reject(err);
            }
            db.query("SELECT COUNT(`program_id`) as size FROM `programs` WHERE `program_name` LIKE ?", [program_name], (err, sizeData)=>{
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
