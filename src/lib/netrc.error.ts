/**
 * Custom error class for handling .netrc related errors.
 * Extends the built-in Error class for proper stack trace and inheritance.
 */
class NetrcError extends Error {
    public code: string;

    /**
     * Constructs a new NetrcError instance.
     * @param {string} message - The error message.
     * @param {string} [code] - An optional error code. Defaults to 'NONE'.
     */
    constructor(message: string, code: string = 'NONE') {
        // Call the parent constructor (Error) with the message.
        // This is mandatory for a derived class.
        super(message || ".netrc Error");

        // Set the name of the error for easier identification.
        this.name = 'NetrcError';

        // Assign the error code.
        this.code = code;
    }
}

export default NetrcError;
