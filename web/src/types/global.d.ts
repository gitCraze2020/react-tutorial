/**
 * IMPORTANT - do not use imports in this file!
 * It will break global definition.
 */
declare namespace window {
    export interface Global {
        createdUrqlClient: boolean;
    }
}

declare var createdUrqlClient: boolean;

// // usage
// // in one file
// global.createdUrqlClient = true;
// // in another file
// log.info(global.createdUrqlClient);
// if (global.createdUrqlClient ... etc
