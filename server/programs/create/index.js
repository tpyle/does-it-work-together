const db = require("./db");


const headers = {
    'Access-Control-Allow-Origin': '*'
}


exports.handler = (event) => {
    return new Promise((resolve, reject)=>{
        const { program_name, program_description } = event.body;
        db.query("INSERT INTO `programs`(`program_name`, `program_description`) VALUES (?, ?)", [program_name, program_description || ""], (err, data)=>{
            if (err) {
                db.end();
                return reject(err);
            }
            db.query("SELECT * FROM `programs` WHERE `program_id` = ?", [data.insertId], (err, data)=>{
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
