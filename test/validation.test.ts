import 'mocha';
import chai from 'chai';
import { ValidationErrorMessage, ValidationHandler, ValidationErrorDetails } from '../src/validation';

describe('Validation', () => {

    describe('Validation Handler', () => {

        it('should assign an error message on a property for all constraints', () => {
            let message = <ValidationErrorMessage>{ target: 'page_size', message: 'Error Message' };
            let handler = new ValidationHandler(message);
            let errorDetails = <ValidationErrorDetails>{
                keyword: 'maximum',
                dataPath: '.queryStringParameters.page_size'
            }
            // here we return an array of error messages
            chai.expect(handler.handle(errorDetails)[0]).eq('Error Message');
        });

        it('should assign a generic error message on a group of constraints', () => {
            let message = <ValidationErrorMessage>{ constraints: ['required'], message: 'Error Message' };
            let handler = new ValidationHandler(message);
            let errorDetails = <ValidationErrorDetails>{
                keyword: 'required',
                dataPath: '.queryStringParameters'
            }
            chai.expect(handler.handle(errorDetails)[0]).eq('Error Message');
        });

        it('should assign a specific error message on a property and constraint', () => {
            let message = <ValidationErrorMessage>{ target: 'page_num', constraints: ['minimum'], message: 'Error Message' };
            let handler = new ValidationHandler(message);
            let errorDetails = <ValidationErrorDetails>{
                keyword: 'minimum',
                dataPath: '.queryStringParameters.page_num'
            }
            chai.expect(handler.handle(errorDetails)[0]).eq('Error Message');
        });
    });
});