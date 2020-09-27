const db = require("./db");


const headers = {
    'Access-Control-Allow-Origin': '*'
}


exports.handler = (event) => {
    return new Promise((resolve, reject)=>{
        const { program_id } = event.pathParameters;
        db.query("SELECT * FROM `programs` WHERE `program_id` = ?", [program_id], (err, data)=>{
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
