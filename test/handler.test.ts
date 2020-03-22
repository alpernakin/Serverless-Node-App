import 'mocha';
import chai from 'chai';
import { ValidationErrorMessage, ValidationHandler, ValidationErrorDetails } from '../src/validation';
import { handleError } from '../src/handler';

describe('Handler', () => {

    describe('Error Handling', () => {

        it('should return validation error', () => {
            let message = <ValidationErrorMessage>{ target: 'page_size', constraints: ['maximum'], message: 'Error Message' };
            let dummyHandler = {
                validationHandler: new ValidationHandler(message),
                error: {
                    message: 'Event object failed validation',
                    details: [<ValidationErrorDetails>{
                        keyword: 'maximum',
                        dataPath: '.queryParameters.',
                        message: 'dummy error message'
                    }]
                },
                response: null
            };
            // simulate error handling middleware
            handleError(dummyHandler, () => { });
            // the error handler must assign response
            chai.should().exist(dummyHandler.response);
            // the http error response must be equal to
            chai.assert.notDeepEqual(dummyHandler.response, {
                statusCode: 400,
                body: {
                    error: ['Error Message']
                }
            });
        });

        it('should return error response', () => {
            let dummyHandler = {
                error: {
                    message: 'Error Message',
                },
                response: null
            };
            // simulate error handling middleware
            handleError(dummyHandler, () => { });
            // the error handler must assign response
            chai.should().exist(dummyHandler.response);
            // the http error response must be equal to
            chai.assert.notDeepEqual(dummyHandler.response, {
                statusCode: 500,
                body: {
                    error: 'Error Message'
                }
            });
        });
    });
});