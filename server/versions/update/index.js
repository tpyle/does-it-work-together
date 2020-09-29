const db = require("./db");


const headers = {
    'Access-Control-Allow-Origin': '*'
}


exports.handler = (event) => {
    return new Promise((resolve, reject)=>{
        const { version_id } = event.pathParameters;
        const { version_description } = event.body;
        if (!version_description) {
            return resolve({
                headers,
                statusCode: 400,
                body: JSON.stringify({ message: "ERROR: Something to update must be provided." })
            });
        }
        db.query("UPDATE `versions` SET `version_description` = ? WHERE `version_id` = ?", [version_description, version_id], (err, data)=>{
            if (err) {
                db.end();
                return reject(err);
            }
            if (data.affectedRows != 1) {
                return resolve({
                    headers,
                    statusCode: 404,
                    body: JSON.stringify({ message: `Error: No version with id ${version_id} exists` })
                });
            }
            db.query("SELECT * FROM `versions` WHERE `version_id` = ?", [version_id], (err, data)=>{
                db.end();
                if (err) {
                    return reject(err);
                }
                resolve({
                    headers,
                    statusCode: data.length ? 200 : 404,
                    body: data.length ? JSON.stringify(data[0]) : undefined
                });
            });
        });
    });
}
