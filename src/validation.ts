/** prototype for details property of handler error */
export interface ValidationErrorDetails {
    keyword: string;
    dataPath: string;
    schemaPath: string;
    params: any[];
    message: string;
}

/** prototype for matching validation constraints with messages */
export interface ValidationErrorMessage {
    /** the property constrained */
    property: string;
    /** the possible cases / constraints  */
    constraints: string[];
    /** corresponding error message */
    message: string;
}

/**
 * prototype for validation handling.
 * the main goal is to match the validation rules with the messages.
 * eventually try to produce a meaningful validation messages
 */
export interface IValidationHandler {
    /** messages rule set */
    messages: ValidationErrorMessage[];
    /** 
     * finds error messages for the given validation details
     * @param details error details collection about the validation
     */
    handleAll: (...details: ValidationErrorDetails[]) => string[];
    /**
     * finds error messages for a single details
     * @param details error details about the validation
     */
    handleSingle: (details: ValidationErrorDetails) => string[];
}

export class ValidationHandler implements IValidationHandler {

    messages: ValidationErrorMessage[];

    constructor (messages: ValidationErrorMessage[]) {
        this.messages = messages;
    }

    handleAll(...details: ValidationErrorDetails[]): string[] {
        // collect the messages for all details
        let messageCollection = details.map(x => this.handleSingle(x));
        // reduce and return the messages
        return messageCollection.reduce((acc, curr) => {
            // if curr has value
            if (curr) curr.forEach(x => acc.push(x));
            return acc;
        }, [])
    }

    handleSingle(details: ValidationErrorDetails): string[] {
        console.log(details);
        // the format will be like '.queryStringParameters.page_size'
        let dataPathParts = details.dataPath.split('.');
        // if the data path can not be serialized then we cannot know the message
        if (!dataPathParts || !dataPathParts.length) return [""];
        // the last one will point the property
        let property = dataPathParts[dataPathParts.length - 1];
        // keyword points the case
        let _case = details.keyword;

        return this.messages.filter(m => m.constraints.includes(_case) && m.property === property).map(m => m.message);
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
            { property: 'id_node', constraints: ['required'], message: 'Missing mandatory params' },
            { property: 'language', constraints: ['required'], message: 'Missing mandatory params' },
            { property: 'page_num', constraints: ['minimum'], message: 'Invalid page number requested' },
            { property: 'page_size', constraints: ['minimum', 'maximum'], message: 'Invalid page size requested' },
        ]
    }
};