/**
 * A type representing the properties of a single machine entry.
 */
export interface Options {
    machine?: string;
    login?: string;
    password?: string;
    account?: string;
    index?: number;
    [key: string]: any; // Allow for dynamic properties
}
