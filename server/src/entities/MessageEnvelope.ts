import {ObjectType, Field, Int, Float} from "type-graphql";

@ObjectType()
export class MessageEnvelope {
    @Field(() => Float!)
    id!: number;

    @Field()
    name!: string;

    // a means to securely verify the identity of the message; pass back what was received
    @Field()
    sessionKey?: string;

    // default is JobDefinition
    @Field()
    infoClass?: string;

    @Field(() => Int)
    infoContentType?: number;

    @Field()
    infoPayload!: string;
}
