const db = require("./db");


const headers = {
    'Access-Control-Allow-Origin': '*'
}


exports.handler = (event) => {
    return new Promise((resolve, reject)=>{
        const { program_id } = event.pathParameters;
        const { version, version_description } = event.body;
        db.query("INSERT INTO `versions`(`program_id`, `version`, `version_description`) VALUES (?, ?, ?)", [program_id, version, version_description || ""], (err, data)=>{
            if (err) {
                db.end();
                return reject(err);
            }
            db.query("SELECT * FROM `versions` WHERE `version_id` = ?", [data.insertId], (err, data)=>{
                db.end();
                if (err || data.length == 0) {
                    return reject(err);
                }
                resolve({
                    headers,
                    statusCode: 200,
                    body: JSON.stringify(data[0])
                });
            });
        });
    });
}
