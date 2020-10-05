//// see these docs
//// https://dev.to/open-graphql/graphql-and-urql-by-example-1ldc
//// https://formidable.com/open-source/urql/docs/advanced/subscriptions/#setting-up-subscriptions-transport-ws

import { defaultExchanges,  ssrExchange, subscriptionExchange} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import {isServer} from "./isServer";
// global.createdUrqlClient = true;

// import WebSocket from 'ws';
// import fetch from 'isomorphic-fetch';

console.log("Global.createdUrqlClient: ", global.createdUrqlClient);
import ssrWs from 'ws';

// import {ClientRequest, IncomingMessage} from "http";


console.log("process.browser: ", process.browser);
// if (!process.browser) {
//     global.fetch = fetch
// }
console.log("isServer: ", isServer());
// if (!runCreation) {
//     console.log("createUrqlClient: ", createUrqlClient);
//     console.log("Already done; NOT re-creating websocket, graphQL client etc");
// }
// else {
    console.log("Now creating websocket, graphQL client etc");

    const ws_url = "ws://localhost:4001/graphql";
    /////   NOTE: this code runs either in browser or on server, and the
    /////   code must make a different configuration
    /////   see examples at https://github.com/apollographql/subscriptions-transport-ws/issues/333

    /////   OR

    /////  Apply SSR coding technique as seen in Ben Awad's video at 4:10

    //const ws = new WebSocket(ws_url, { perMessageDeflate: false, });

    // ws.on("error", (error: Error) => {
    //     console.log("caught error: ", error)
    // });
    // ws.on("ping", (error: Error) => {
    //     console.log("caught ping, error: ", error)
    // });
    // ws.on("unexpected-response" , (_ws: WebSocket, http:ClientRequest, response: IncomingMessage ) => {
    //     console.log("caught unexpected-response");
    //     // console.log("WebSocket: ", _ws);
    //     console.log("IncomingMessage: ", response);
    //     console.log("ClientRequest: ", http);
    // });
    // ws.on("error", (_ws: WebSocket, err:Error ) => {
    //     console.log("event error");
    //     // console.log("WebSocket: ", _ws);
    //     console.log("Error: ", err);
    // });
    // ws.on("upgrade",  (_ws: WebSocket,  response: IncomingMessage ) => {
    //     console.log("event upgrade");
    //     // console.log("WebSocket: ", _ws);
    //     console.log("IncomingMessage: ", response);
    // });
    // ws.on( "close",  (_ws: WebSocket,  code: number, reason: string ) => {
    //     console.log("event close");
    //     console.log("WebSocket: ", _ws);
    //     console.log("code: ", code);
    //     console.log("reason: ", reason);
    // });

    // ws.on("unexpected-response", (error: Error, event: Event) => {
    //     console.log("caught unexpected-response, event: ", event)
    //     console.log("caught unexpected-response, error: ", error)
    // });

    // ws.onopen = () => {
    //     console.log("onopen, ws.readyState: ", ws.readyState );
    //     console.log("onopen, readyState CONNECTING: ", ws.CONNECTING );
    //     console.log("onopen, readyState OPEN: ", ws.OPEN );
    //     console.log("onopen, readyState CLOSING: ", ws.CLOSING );
    //     console.log("onopen, readyState CLOSED: ", ws.CLOSED );
    //     console.log("ws.eventNames() : ", ws.eventNames() );
    //
    //     // ws.ping("my=ping");
    //     // ws.pong("my=pong");
    //     //
    //     // ws.send("a"); // Send the message 'Ping' to the server
    //     // console.log("onopen, sent data...");
    // };
    // ws.onmessage = () => {
    //     console.log("onmessage, ws.readyState: ", ws.readyState );
    // };
    //
    // ws.onclose = () => {
    //     console.log("onclose, ws.readyState: ", ws.readyState );
    // };

    // console.log("ws(1): ", ws);
    // console.log("ws(1)^^^^^^^^^^^^^^^^^^^^^^^");
    // ws.protocol = "ws";
    // console.log("ws(2): ", ws);
    // console.log("ws(2)^^^^^^^^^^^^^^^^^^^^^^^");
    //
    // ws.ping();
    // console.log("wsping: ", ws);
    // console.log("wsping^^^^^^^^^^^^^^^^^^^^^^^");
    //
    const ws = process.browser ? WebSocket : ssrWs;
console.log("ws: ", ws);
console.log("^^^^ native websocket: ", process.browser);
    const createUrqlSubcriptionClient = new SubscriptionClient(
        ws_url, {
            lazy: true,
            reconnect: false,
            // reconnect: true,
            timeout: 20000
        },
        ws
    );
    // ____@ts-ignore____ // <<< remove the ____ suffix/prefix if you want to access the private variable below
    // createUrqlSubcriptionClient.maxConnectTimeGenerator.setMin(30000)

    // console.log("createUrqlSubcriptionClient: ", createUrqlSubcriptionClient);
    // console.log("createUrqlSubcriptionClient^^^^^^^^^^^^^^^^^^^^^^^");
    const http_url = 'http://localhost:4000/graphql';
    // create the function which will be used at the bottom of the various pages in the export default statement
    export const createUrqlClient = (ssrExchange: any) => ({
        url: http_url,
        exchanges: [
            ...defaultExchanges,
            // dedupExchange,
            ssrExchange,
            // fetchExchange,
            subscriptionExchange({
                forwardSubscription( operation ) {
                    // use the SubscriptionClient's request method to create a Subscription Observable
                    return createUrqlSubcriptionClient.request(operation);
                },
                // forwardSubscription: operation => createUrqlSubcriptionClient.request(operation)
            }),
        ]
    });
    global.createdUrqlClient = true;
console.log("at end of createUrqlClient, global.createdUrqlClient: ", global.createdUrqlClient);

// console.log("createUrqlClient: ", createUrqlClient);
    // console.log("createUrqlClient^^^^^^^^^^^^^^^^^^^^^^^");
// }
export default createUrqlClient;

