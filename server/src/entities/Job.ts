import {ObjectType, Field, Int, Float} from "type-graphql";

@ObjectType()
export class JobDefinition {
    @Field(() => Float!)
    id!: number;

    // TO DO: make a decision whether name belongs here only, or also in JobRunIdentifier
    // Hint: the id field has a similar question. Design time vs run-time?
    @Field()
    name!: string;

    @Field({ nullable: true })
    customJobLabel?: string;

    @Field({ nullable: true })
    runCmd?: string;

    @Field({ nullable: true })
    runCmdArgs?: string;

    @Field(() => Float,{ nullable: true })
    nextJobDefaultId?: number;

    @Field(() => Float,{ nullable: true })
    nextJobErrorDefaultId?: number;

    // TO DO: handle array of numbers passed through graphql and other structures.
    // FOR NOW - PROTOTYPE STAGE - use a string of numbers comma separated
    // @Field(() => [Int])
    @Field({ nullable: true })
    nextJobOptions?: string;
    // nextJobOptions?: [number];

    // TO DO: decide how to do versioning, supporting prior versions of definitions
    // which may need to be restored on replay of prior events, or during rolling upgrades if that applies
}

@ObjectType()
export class JobRunIdentifier {
    @Field(() => Float!)
    id!: number;

    @Field()
    name!: string;

    @Field(() => Float, { nullable: true })
    jobInstanceId?: number;

    @Field(() => Float, { nullable: true })
    resultSeqNum?: number;
}

@ObjectType()
export class JobInfo {
    @Field(() => JobDefinition,{ nullable: true })
    jobDefinition?: JobDefinition;

    @Field(() => [JobActivity],{ nullable: true })
    jobActivity?: JobActivity[];
}

@ObjectType()
export class JobActivity {
    @Field(() => JobRunIdentifier)
    jobIdentifier!: JobRunIdentifier;

    @Field(() => String, { nullable: true })
    logDateTime?: Date;

    @Field(() => Int, { nullable: true })
    logLevel?: number;

    @Field({ nullable: true })
    result?: string;
}
