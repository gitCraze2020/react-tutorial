import "dotenv-safe/config";
import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { JobResolver } from "./resolvers/job";
import { Job } from "./entities/Job";

export const sampleJobs: Job[] = [{id: 0, name: "first job"}, {id: 1, name: "second job"}];

const main = async () => {
    const app = express();
    const port = process.env.PORT as string;

    app.listen(port, () => {
        console.log("Server listening on port: ", port);
    })

    // add graphql endpoint by instantiating an instance and calling applyMiddleware
    const apolloServer = new ApolloServer ({
        // buildSchema returns a Promise with a graphql schema,
        // which is why we 'await' it:
        schema: await buildSchema({
            // add some resolvers. Define these in server/src/resolvers
            // example: hello.ts
            resolvers: [HelloResolver, JobResolver],
            validate: false // apolloServer uses something like class validator, which we do without
            }),
        // context: () => ( { samples: sampleJobs })
    })
    // this creates a graphql endpoint for us on express:
    apolloServer.applyMiddleware({ app });

    // app.get("/", ( _ , res) => {
    //     res.send("hello")
    // })
}



main().catch((err) => {
    console.error("caught by index.ts::main()", err);
});
