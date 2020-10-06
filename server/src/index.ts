import "dotenv-safe/config";
import "reflect-metadata";
import expressWs from 'express-ws';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { JobResolver } from "./resolvers/job";
import { Job } from "./entities/Job";
import cors from "cors";
import { createServer } from "http";


export const sampleJobs: Job[] = [{id: 0, name: "first job"}, {id: 1, name: "second job"}];

const main = async () => {
    // const app = express();
    // add graphql endpoint by instantiating an instance and calling applyMiddleware
    const graphQLServer = new ApolloServer ({
        // buildSchema returns a Promise with a graphql schema,
        // which is why we 'await' it:
        schema: await buildSchema({
            // add some resolvers. Define these in server/src/resolvers
            // example: hello.ts
            resolvers: [HelloResolver, JobResolver],
            validate: false // apolloServer uses something like class validator, which we do without
        }),
        context: ({req, res}) => ( { req, res })
        // context: ({req, res}) => ( { req, res, samples: sampleJobs, em: orm.em })
    });


    const wsInstance = expressWs(express() , undefined, {leaveRouterUntouched: true} );
    const app = wsInstance.app;

    // this creates a graphql endpoint for us on express.
    // by default, Apollo implies
    //     , cors: {origin: "*"}
    // but that will throw a CORS error as soon as you turn on
    // (in urql's graphql createClient) fetchoptions: { credentials: "include" }
    //
    // so, we could set up the origin here to avoid that once we get to using credentials
    //         apolloServer.applyMiddleware({
    //             app
    //             , cors: {origin: "http://localhost:3000"}
    //         });
    // however, we would rather expand the cors setup beyond Apollo's middleware routes
    // and so we will disable it here and we
    // and will set up cors globally: download a cors middleware package from express
    // (on server folder, 'yarn cors; yarn add -D @types/cors' to add, and add import plus use in this entry point
    //         import cors from "cors";
    //         app.use(
    //             cors( {
    //                 origin: "http://localhost:3000",
    //                 credentials: true,
    //             })
    //         )
    //
    //
    //

    app.use(
        // we set up cors to to apply on all routes.
        //
        // if you want this middleware to apply to specific route(s) only
        // prefix this option with
        // '/someroute',
        //
        cors( {
            origin: "http://localhost:3000",
            // origin: [ "http://localhost:3000", "ws://localhost:4000" ],
            // credentials: true,
        })
    );
    graphQLServer.applyMiddleware({
        app
        , cors: false
    });

    const port = process.env.PORT as string;

    const httpServer = createServer(app);
    graphQLServer.installSubscriptionHandlers(httpServer);

    // console.log("\n======app:", app);
    // console.log("\n======:");



    // app.get("/", ( _ , res) => {
    //     res.send("hello")
    // })

    httpServer.listen(4001, () => {
        console.log("WS Server listening on port: ", 4001);
    });

    app.listen(port, () => {
        console.log("Server listening on port: ", port);
    });
    //
    // console.log(" wsInstance.getWss(): ", wsInstance.getWss());
}



main().catch((err) => {
    console.error("caught by index.ts::main()", err);
});
