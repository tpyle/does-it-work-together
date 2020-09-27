const lambdaLocal = require("lambda-local");

const create = require("./create");
const read   = require("./read");
const update = require("./update");
const list   = require("./list");
const remove = require("./delete");


const createPayload = {
    body: {
        program_name: "test-program"
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
                program_id: insertedProgram.program_id
            }
        },
        lambdaFunc: read,
        timeoutMs: 3000
    });
    console.log(result);

    result = await lambdaLocal.execute({
        event: {
            pathParameters: {
                program_id: insertedProgram.program_id
            },
            body: {
                program_description: "This program is used on some nix systems to test things."
            }
        },
        lambdaFunc: update,
        timeoutMs: 3000
    });
    console.log(result);

    result = await lambdaLocal.execute({
        event: {
            queryStringParameters: {
                program_name: "t*",
                start: 1,
                end: 2
            }
        },
        lambdaFunc: list,
        timeoutMs: 3000
    });
    console.log(result);

    result = await lambdaLocal.execute({
        event: {
            pathParameters: {
                program_id: insertedProgram.program_id
            }
        },
        lambdaFunc: remove,
        timeoutMs: 3000
    });
    console.log(result);
}


main().then(()=>{}).catch(console.error);
