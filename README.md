Description
-----------

ES6 module to read and write your .netrc file.

Installation
------------

    npm install @codeswriter/netrc-rw


Usage
-----

    import NetRC from '@codeswriter/netrc-rw';
    
    # read
    const pass = NetRC.host('domain.com').password;

    # edit
    NetRC.host('domain.com').password = "passw0rd";
    NetRC.write();

    # add new
    NetRC.addHost('api.domain.com').password = "otherPassw0rd";
    NetRC.write();

Dependencies
------------

None.


Testing
-------
    
    npm test

