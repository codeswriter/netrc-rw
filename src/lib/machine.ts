/**
 * Represents a machine configuration parsed from a .netrc file.
 */
class Machine {
    public index: number;
    public machine: string | null;
    public login: string | null;
    public password: string | null;
    public account: string | null;
    public macdef: string | null;

    constructor(index?: number) {
        this.index = index || 0;
        this.machine = null;
        this.login = null;
        this.password = null;
        this.account = null;
        this.macdef = null;
    }

    /**
     * Formats the machine's properties into a .netrc file string.
     * @returns {string} The formatted output string.
     */
    public output(): string {
        const lines = [`machine ${this.machine}`];

        // Explicitly defines the keys to check to ensure type safety.
        const keys: Array<keyof Machine> = ['login', 'password', 'account', 'macdef'];

        keys.forEach((key) => {
            if (this[key]) {
                lines.push(`  ${key} ${this[key]}`);
            }
        });

        return lines.join('\n');
    }
}

export default Machine;
