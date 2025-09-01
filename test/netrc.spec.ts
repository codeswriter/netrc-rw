import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import * as process from 'process';
import pkg from '../package.json';
import {NetRC} from "../src/netrc";

describe('netrc', () => {
    let netrc: NetRC;
    let inputFilename: string;
    let emptyFilename: string;
    let outputFilename: string;
    let privateFilename: string;

    beforeEach(() => {
        // Reinitialize variables before each test to ensure isolation.
        netrc = new NetRC();
        inputFilename = path.join(__dirname, '.netrc');
        outputFilename = path.join(__dirname, '.netrc-modified');
        emptyFilename = path.join(__dirname, '.netrc-empty');
        privateFilename = path.join(__dirname, '.netrc-private');

        // Copy the input file to the output file for a clean test environment.
        fs.writeFileSync(outputFilename, fs.readFileSync(inputFilename, { encoding: 'utf8' }));
    });

    it("changes the default filename", () => {
        // The original JS code assumes a specific HOME directory, which can be brittle.
        // The new NetRC class handles the HOME variable more robustly.
        assert.equal(netrc.filename, path.join(process.env.HOME || '', "/.netrc"));

        netrc.filename = inputFilename;
        assert.equal(netrc.filename, inputFilename);
    });

    it("reads the .netrc file", () => {
        netrc.filename = inputFilename;

        // Using strict non-null assertion (!) because hasHost() will call read()
        // and populate `this.machines`. This is a common pattern in tests
        // where you have control over the execution flow.
        assert.equal(netrc.hasHost("code.example.com"), true);
        assert.equal(netrc.host("code.example.com").login, "alice@code.example.com");
        assert.equal(netrc.host("code.example.com").password, "86801bc8abbffd7fa4f203329ba55c4043f4db78");
        assert.equal(netrc.host("api.example.com").login, "alice@api.example.com");
        assert.equal(netrc.host("api.example.com").password, "86802bc8abbffd7fa4f203329ba55c4043f4db78");
        assert.equal(netrc.host("git.example.com").login, "alice@git.example.com");
        assert.equal(netrc.host("git.example.com").password, "86803bc8abbffd7fa4f203329ba55c4043f4db78");
    });

    it("reads an empty .netrc file", () => {
        netrc.filename = emptyFilename;
        netrc.read();
        assert.deepStrictEqual(netrc.machines, {});
    });

    it("knows if a machine is in the .netrc", () => {
        netrc.filename = inputFilename;

        assert.equal(netrc.hasHost("code.example.com"), true);
        assert.equal(netrc.hasHost("blarg.com"), false);
    });

    it("adds a machine to the .netrc representation", () => {
        netrc.filename = inputFilename;

        netrc.addHost("new.example.com", {
            login: "alice@new.example.com",
            password: "p@ssword"
        });

        assert.equal(netrc.host("new.example.com").login, "alice@new.example.com");
        assert.equal(netrc.host("new.example.com").password, "p@ssword");
    });

    it("writes the .netrc file", () => {
        netrc.filename = inputFilename;
        netrc.read();

        netrc.filename = outputFilename;
        netrc.write();

        assert.equal(fs.readFileSync(outputFilename, { encoding: 'utf8' }), fs.readFileSync(inputFilename, { encoding: 'utf8' }));
    });

    it("modifies and writes the .netrc file", () => {
        netrc.filename = inputFilename;

        const original = fs.readFileSync(inputFilename, { encoding: 'utf8' });
        const modified = original +
            "\nmachine new.example.com\n" +
            "  login alice@new.example.com\n" +
            "  password p@ssword";

        netrc.addHost("new.example.com", {
            login: "alice@new.example.com",
            password: "p@ssword"
        });

        netrc.filename = outputFilename;
        netrc.write();

        assert.equal(fs.readFileSync(outputFilename, { encoding: 'utf8' }), modified);
    });

    it("modifies and writes originally empty .netrc file", () => {
        netrc.filename = emptyFilename;
        netrc.read();

        const original = '';
        const modified = original +
            "machine new.example.com\n" +
            "  login alice@new.example.com\n" +
            "  password p@ssword";

        netrc.addHost("new.example.com", {
            login: "alice@new.example.com",
            password: "p@ssword"
        });

        netrc.filename = outputFilename;
        netrc.write();

        assert.equal(fs.readFileSync(outputFilename, { encoding: 'utf8' }), modified);
    });

    it("reads a non-existing input netrc file as an empty one", () => {
        netrc.filename = '.netrc-non-existing-' + (Math.round(Math.random() * 10000));
        netrc.read();
        assert.deepStrictEqual(netrc.machines, {});
    });

     // This test case is difficult to replicate in a controlled environment due to permissions
     // and is often skipped in automated tests.
     if (pkg.config.test.permissions) {
       it("checks if the existing input netrc file is not readable due to permissions", (done) => {
         netrc.filename = privateFilename;
         try {
           netrc.read();
         } catch(e) {
           // @ts-ignore
             assert.equal(e.code, 'EACCES');
           return done();
         }
         console.log('ATTENTION: Make sure to change the owner of the .netrc-private and the mode to 0600.');
       });
     }
});
