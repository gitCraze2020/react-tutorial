import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class Job {
    @Field(() => Int)
    id!: number;

    @Field()
    name!: string;
}