const db = require("./db");


const headers = {
    'Access-Control-Allow-Origin': '*'
}


exports.handler = (event) => {
    return new Promise((resolve, reject)=>{
        const { version_id } = event.pathParameters;
        db.query("SELECT * FROM `versions` WHERE `version_id` = ?", [version_id], (err, data)=>{
            db.end();
            if (err) {
                return reject(err);
            }
            resolve({
                headers,
                statusCode: data.length == 1 ? 200 : 404,
                body: data.length ? JSON.stringify(data[0]) : "{}"
            });
        });
    });
}
