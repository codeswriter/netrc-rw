import * as fs from 'fs';
import * as path from 'path';
import Machine from "./lib/machine";
import NetrcError from "./lib/netrc.error";
import {Options} from "./interfaces/options.interface";
import {unescape, insertInto} from "./lib/helpers";

/**
 * A class for reading, writing, and manipulating a .netrc file.
 */
class NetRC {
    filename: string;
    machines: { [hostname: string]: Machine } | null = null;
    private comments: { [lineNumber: string]: { [charNumber: string]: string } } = {};

    /**
     * Constructs a new NetRC instance.
     * @param filename - The path to the .netrc file. Defaults to ~/.netrc.
     */
    constructor(filename?: string) {
        this.filename = filename || path.join(process.env.HOME || '', ".netrc");
    }

    /**
     * Retrieves a Machine instance by its hostname.
     * Throws an error if the host is not found.
     * @param hostname - The hostname to find.
     * @returns The corresponding Machine object.
     */
    public host(hostname: string): Machine {
        if (!this.hasHost(hostname)) {
            throw new NetrcError(`Machine ${hostname} not found in ${this.filename}`, 'NOMACHINE');
        }
        return this.machines![hostname];
    }

    /**
     * Checks if a host exists in the loaded .netrc file.
     * @param hostname - The hostname to check.
     * @returns True if the host exists, otherwise false.
     */
    public hasHost(hostname: string): boolean {
        if (this.machines === null) {
            this.read();
        }
        return !!this.machines![hostname];
    }

    /**
     * Adds a new host to the .netrc file.
     * Throws an error if the machine already exists.
     * @param hostname - The hostname to add.
     * @param options - The machine properties to add.
     * @returns The newly created Machine object.
     */
    public addHost(hostname: string, options: Options): Machine {
        if (this.machines === null) {
            this.read();
        }

        if (this.machines![hostname]) {
            throw new NetrcError(`Machine ${hostname} already exists in ${this.filename}`, 'MACHINEEXISTS');
        }

        const maxIndex = Object.keys(this.machines!).length;
        const machine = new Machine(maxIndex + 1);
        machine.machine = hostname;

        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                (machine as any)[key] = options[key];
            }
        }

        this.machines![machine.machine] = machine;
        return machine;
    }

    /**
     * Reads the .netrc file from the file system.
     */
    public read(): void {
        let data: string;
        this.machines = {};

        try {
            data = fs.readFileSync(this.filename, {encoding: 'utf8'});
        } catch (e: any) {
            if (e.code === 'ENOENT') {
                data = "";
            } else {
                throw new NetrcError(e.message, e.code);
            }
        }

        this.parse(this.stripComments(data));
    }

    /**
     * Parses the raw data string from the .netrc file.
     * @param data - The data string to parse.
     */
    private parse(data: string): void {
        const tokens = data.split(/[ \t\n\r]+/);
        let machine: Machine | undefined;
        let key: string | null = null;
        let index = 0;

        for (const token of tokens) {
            if (!key) {
                key = token;
                if (key === 'machine') {
                    if (machine) {
                        this.machines![machine.machine!] = machine;
                    }
                    machine = new Machine(index++);
                }
            } else {
                (machine as any)[key] = unescape(token);
                key = null;
            }
        }
        if (machine && machine.machine) {
            this.machines![machine.machine] = machine;
        }
    }

    /**
     * Strips comments from the .netrc data and stores them.
     * @param data - The data string with comments.
     * @returns The data string with comments removed.
     */
    private stripComments(data: string): string {
        const lines = data.split('\n');
        for (const n in lines) {
            const i = lines[n].indexOf('#');
            if (i > -1) {
                this.comments[n] = {};
                this.comments[n][i] = lines[n].substring(i);
                lines[n] = lines[n].substring(0, i);
            }
        }
        return lines.join('\n');
    }

    /**
     * Inserts the previously stripped comments back into the data.
     * @param data - The data string without comments.
     * @returns The data string with comments re-inserted.
     */
    private insertComments(data: string): string {
        const lines = data.split('\n');
        for (const lineNumber in this.comments) {
            const lineIndex = parseInt(lineNumber, 10);
            if (isNaN(lineIndex)) continue; // Ensure lineNumber is a valid number

            for (const charNumber in this.comments[lineNumber]) {
                const charIndex = parseInt(charNumber, 10);
                if (isNaN(charIndex)) continue; // Ensure charNumber is a valid number

                lines[lineIndex] = insertInto(lines[lineIndex], this.comments[lineNumber][charNumber], charIndex);
            }
        }
        return lines.join('\n');
    }

    /**
     * Writes the current machine data to the .netrc file.
     */
    public write(): void {
        const lines: string[] = [];
        const machines: Machine[] = [];

        if (this.machines) {
            for (const key in this.machines) {
                machines[this.machines[key].index] = this.machines[key];
            }
        }

        machines.forEach((machine) => {
            lines.push(machine.output());
        });

        const data = this.insertComments(lines.join('\n'));
        fs.writeFileSync(this.filename, data);
    }
}

export default new NetRC();
export {NetRC}
