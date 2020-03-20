import { APIGatewayEvent } from "aws-lambda";
import middy from 'middy'
import { validator } from 'middy/middlewares';
import { nodeServiceInstance } from "./services/node.service";
import { SearchNodeRequest } from "./models/request.model";
import { okResponse, errorResponse } from "./helpers";
import { rules, ValidationHandler, IValidationHandler, ValidationErrorDetails } from "./validation";

//////////////////////
// ORIGINAL HANDLER //
//////////////////////

/** original search event handler */
async function search(event: APIGatewayEvent): Promise<any> {
    let params = event.queryStringParameters;
    // the query parameters object is not filled
    if (!params) return errorResponse('Invalid parameters', 400);
    // create the request model for the service
    let request = new SearchNodeRequest({
        nodeId: params['node_id'],
        language: params['language'],
        searchKeyword: params['search_keyword'],
        pageNum: params['page_num'],
        pageSize: params['page_size']
    });
    // check if the node exists first
    let nodeExists = await nodeServiceInstance.exists(request.nodeId);
    if (!nodeExists) return errorResponse('Invalid node id', 404);
    // return data in the format { nodes: [] }
    return okResponse({ nodes: await nodeServiceInstance.search(request) });
}

///////////////////////////////
// MIDDLEWARE IMPLEMENTATION //
///////////////////////////////

// create the handler through middy to include middlewares
const handler = middy(search);
// add the validation middleware
handler.use(validator(rules.searchNode));
// inject a custom validation handler
handler["validationHandler"] = new ValidationHandler(rules.searchNode.messages);
// error handling middleware
handler.onError((handler, next) => {
    // todo log errors here
    console.log(handler.error);
    // default error response declaration
    let errResponse = errorResponse(handler.error.message, 500);
    // find out the error details
    let errorDetails = <ValidationErrorDetails[]>handler.error['details'];
    // get the injected validation handler
    let validationHandler = <IValidationHandler>handler["validationHandler"];
    // it means that the error is about validation
    if (handler.error.message === 'Event object failed validation' && errorDetails && validationHandler)
        errResponse = errorResponse(validationHandler.handleAll(...errorDetails), 400);
    // attach the error response to the handler
    handler.response = errResponse;

    return next();
});
// well ready!
export { handler as searchHandler };