const lambdaLocal = require("lambda-local");

const create = require("./create");


const createPayload = {
    body: {
        program_name: "test-program"
    }
};


lambdaLocal.execute({
    event: createPayload,
    lambdaFunc: create,
    timeoutMs: 3000
}).then(console.log).catch(console.error);
