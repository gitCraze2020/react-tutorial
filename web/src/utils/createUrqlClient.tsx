//// see these docs
//// https://dev.to/open-graphql/graphql-and-urql-by-example-1ldc
//// https://formidable.com/open-source/urql/docs/advanced/subscriptions/#setting-up-subscriptions-transport-ws

import { createClient, Provider } from 'urql';
//Client,
import { defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

// const createUrqlSubcriptionClient = new SubscriptionClient(
//     "ws://localhost:4001/graphql", {
//         reconnect: true,
//         timeout: 20000
//     }
// )

export const createUrqlClient = createClient({
    url: 'http://localhost:4000/graphql',
    exchanges: [
        ...defaultExchanges,
        // subscriptionExchange({
        //     forwardSubscription( operation ) {
        //         // use the SubscriptionClient's request method to create a Subscription Observable
        //         return createUrqlSubcriptionClient.request(operation);
        //         },
        //     // forwardSubscription: operation => createUrqlSubcriptionClient.request(operation)
        // }),
    ]
})

import theme from "../theme"
export default createUrqlClient;