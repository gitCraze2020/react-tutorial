import { Resolver, Query } from "type-graphql";

// define a single schema that provides hello
@Resolver()
export class HelloResolver {
    @Query( () => String )
    hello() {
        return "Hello, World!"
    }
}