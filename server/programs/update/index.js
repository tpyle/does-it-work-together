const db = require("./db");


const headers = {
    'Access-Control-Allow-Origin': '*'
}


exports.handler = (event) => {
    return new Promise((resolve, reject)=>{
        const { program_id } = event.pathParameters;
        const { program_description } = event.body;
        db.query("UPDATE `programs` SET `program_description` = ? WHERE `program_id` = ?", [program_description, program_id], (err, data)=>{
            if (err) {
                db.end();
                return reject(err);
            }
            if (data.affectedRows != 1) {
                return resolve({
                    headers,
                    statusCode: 404,
                    body: JSON.stringify({ message: `Error: No program with id ${program_id} exists` })
                });
            }
            db.query("SELECT * FROM `programs` WHERE `program_id` = ?", [program_id], (err, data)=>{
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
