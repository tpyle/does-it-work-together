const lambdaLocal = require("lambda-local");

const create = require("./create");
const read   = require("./read");
const update = require("./update");
const list   = require("./list");
const remove = require("./delete");


const createPayload = {
    pathParameters: {
        program_id: 22
    },
    body: {
        version: "1.0.1",
        version_description: "Latest patch, allows editing the fields on buildings"
    }
};


async function main() {
    let result = await lambdaLocal.execute({
        event: createPayload,
        lambdaFunc: create,
        timeoutMs: 3000
    });
    console.log(result);

    const insertedProgram = JSON.parse(result.body);

    result = await lambdaLocal.execute({
        event: {
            pathParameters: {
                version_id: insertedProgram.version_id
            }
        },
        lambdaFunc: read,
        timeoutMs: 3000
    });
    console.log(result);

    result = await lambdaLocal.execute({
        event: {
            pathParameters: {
                version_id: insertedProgram.version_id
            },
            body: {
                version_description: "Not sure what this patch does."
            }
        },
        lambdaFunc: update,
        timeoutMs: 3000
    });
    console.log(result);

    result = await lambdaLocal.execute({
        event: {
            pathParameters: {
                program_id: 22
            },
            queryStringParameters: {
                version: "1.*",
                start: 0,
                end: 10
            }
        },
        lambdaFunc: list,
        timeoutMs: 3000
    });
    console.log(result);

    result = await lambdaLocal.execute({
        event: {
            pathParameters: {
                version_id: insertedProgram.version_id
            }
        },
        lambdaFunc: remove,
        timeoutMs: 3000
    });
    console.log(result);
}


main().then(()=>{}).catch(console.error);
