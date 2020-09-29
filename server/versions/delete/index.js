const db = require("./db");


const headers = {
    'Access-Control-Allow-Origin': '*'
}


exports.handler = (event) => {
    return new Promise((resolve, reject)=>{
        const { version_id } = event.pathParameters;
        db.query("DELETE FROM `versions` WHERE `version_id` = ?", [version_id], (err, data)=>{
            db.end();
            if (err) {
                return reject(err);
            }
            resolve({
                headers,
                statusCode: data.affectedRows == 1 ? 200 : 404,
                body: JSON.stringify({
                    status: data.affectedRows == 1
                })
            });
        });
    });
}
