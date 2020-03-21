/** prototype for details property of handler error */
export interface ValidationErrorDetails {
    /** 
     * the field validation failed
     * e.g. minimum 
    */
    keyword: string;
    /** 
     * the path in the schema 
     * e.g. .queryStringParameters.page_num
     */
    dataPath: string;
    /**
     * extras, giving missing property
     */
    params?: { missingProperty: string }
    /**
     * default message
     */
    message: string;
}

/** prototype for matching validation constraints with messages */
export interface ValidationErrorMessage {
    /** the property constrained */
    target?: string;
    /** 
     * the possible cases / constraints. 
     * if constraints is null, then it applies all cases 
     */
    constraints?: string[];
    /** corresponding error message */
    message: string;
}

/**
 * prototype for validation handling.
 * the main goal is to match the validation rules with the messages.
 * eventually try to produce meaningful validation messages
 */
export interface IValidationHandler {
    /** messages rule set */
    messages: ValidationErrorMessage[];
    /** 
     * finds error messages for the given validation details
     * @param details error details collection about the validation
     */
    handle: (...details: ValidationErrorDetails[]) => string[];
}

export class ValidationHandler implements IValidationHandler {

    messages: ValidationErrorMessage[];

    constructor(...messages: ValidationErrorMessage[]) {
        this.messages = messages;
    }

    handle(...details: ValidationErrorDetails[]): string[] {
        // collect the messages for all details
        return details.map(x => this.handleSingle(x));
    }

    /**
     * finds error messages for a single details
     * @param details error details about the validation
     */
    private handleSingle(details: ValidationErrorDetails): string {
        // the format will be like '.queryStringParameters.page_size'
        let dataPathParts = details.dataPath.split('.');
        // if the data path can not be serialized then we cannot know the message
        if (!dataPathParts || !dataPathParts.length) return details.message;
        // the last one will point the target
        let target = dataPathParts[dataPathParts.length - 1];
        // keyword points the case
        let constraint = details.keyword;
        // try to find a message in the list, otherwise return null
        let getMessageBy = (predicate: (item: ValidationErrorMessage) => boolean | undefined) => {
            let indexOfMatch = this.messages.findIndex(predicate);
            return indexOfMatch !== -1 ? this.messages[indexOfMatch].message : null;
        }

        // first check items matching both constraint and (target = could be missing property or target itself)
        return getMessageBy(x => x.constraints?.includes(constraint) && (x.target === target || x.target === details.params?.missingProperty)) ||
            // else check items matching only constraints
            getMessageBy(x => x.constraints?.includes(constraint)) ||
            // eventually check with only target, whose constrainsts is null
            getMessageBy(x => !x.constraints && x.target === target) ||
            // finally return default message
            details.message;
    }
}

/** validation rules */
export const rules = {
    // search node validation rules
    searchNode: {
        inputSchema: {
            properties: {
                queryStringParameters: {
                    properties: {
                        node_id: { type: 'number', minimum: 0 },
                        language: { type: 'string' },
                        search_keyword: { type: 'string' },
                        page_num: { type: 'integer', minimum: 0 },
                        page_size: { type: 'integer', minimum: 0, maximum: 1000 },
                    },
                    required: ['node_id', 'language']
                }
            },
            required: ['queryStringParameters']
        },
        messages: [
            { constraints: ['required'], message: 'Missing mandatory params' },
            { target: 'node_id', constraints: ['required'], message: 'Invalid node id' },
            { target: 'page_num', constraints: ['minimum'], message: 'Invalid page number requested' },
            { target: 'page_size', constraints: ['minimum', 'maximum'], message: 'Invalid page size requested' },
        ]
    }
};