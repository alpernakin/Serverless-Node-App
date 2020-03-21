import { APIGatewayEvent, Context } from "aws-lambda";
import middy from 'middy'
import { validator } from 'middy/middlewares';
import { NodeService } from "./services/node.service";
import { rules, ValidationHandler, IValidationHandler, ValidationErrorDetails } from "./validation";
import { sequelize } from "./db/model";
import { NodeController } from "./controllers/node.controller";

// here we init the controller with a service of our choice
const controller = new NodeController(new NodeService(sequelize));

// response helpers
const okResponse = (data, statusCode = 200) => ({
    statusCode: statusCode,
    body: JSON.stringify({ ...data })
});

const errorResponse = (error, statusCode = 500) => ({
    statusCode: statusCode,
    body: JSON.stringify({ error: error })
});

//////////////////////
// ORIGINAL HANDLER //
//////////////////////

/** original search event handler */
async function search(event: APIGatewayEvent, context: Context): Promise<any> {
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
    context.callbackWaitsForEmptyEventLoop = false;

    return okResponse({ nodes: await controller.search(event.queryStringParameters) });
}

///////////////////////////////
// MIDDLEWARE IMPLEMENTATION //
///////////////////////////////

// create the handler through middy to include middlewares
const handler = middy(search);
// add the validation middleware
handler.use(validator(rules.searchNode));
// inject a custom validation handler
handler["validationHandler"] = new ValidationHandler(...rules.searchNode.messages);
// error handling middleware
handler.onError((handler, next) => {
    console.error(`${handler.error["domain"] || "No Domain"} ${handler.error.message}`);
    // default error response declaration
    let errResponse = errorResponse(handler.error.message, 500);
    // find out the error details
    let errorDetails = <ValidationErrorDetails[]>handler.error['details'];
    // get the injected validation handler
    let validationHandler = <IValidationHandler>handler["validationHandler"];
    // it means that the error is about validation
    if (handler.error.message === 'Event object failed validation' && errorDetails && validationHandler)
        errResponse = errorResponse(validationHandler.handle(...errorDetails), 400);
    // attach the error response to the handler
    handler.response = errResponse;

    return next();
});
// well ready!
export { handler as searchHandler };