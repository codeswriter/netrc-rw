/**
 * Helper function to handle escaped characters like \xHH.
 * @param s - The string to unescape.
 * @returns The unescaped string.
 */
export function unescape(s: string): string {
    let match = /\\x([0-9a-fA-F]{2})/.exec(s);
    while (match) {
        s = s.substring(0, match.index) +
            String.fromCharCode(parseInt(match[1], 16)) +
            s.substring(match.index + 4);
        match = /\\x([0-9a-fA-F]{2})/.exec(s);
    }
    return s;
}

/**
 * Helper function to insert a substring into a string at a specific index.
 * @param str - The string to modify.
 * @param ins - The string to insert.
 * @param at - The index to insert at.
 * @returns The modified string.
 */
export function insertInto(str: string, ins: string, at: number): string {
    return str.slice(0, at) + ins + str.slice(at);
}
