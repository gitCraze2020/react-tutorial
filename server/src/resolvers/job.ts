import {
    Resolver,
    Query,
    Mutation,
    Arg,
    Int,
    InputType,
    Field,
    ObjectType,
    Subscription,
    Root,
    Publisher, PubSub
} from "type-graphql";
import { Job } from "../entities/Job";
import {KafkaClientSingleTopic} from "../data/KafkaClientSingleTopic";

// import { sleep } from "../utils/sleep";

@InputType()
class JobInput {
    @Field(() => Int)
    id: number

    @Field()
    name: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}


@ObjectType()
class JobResponse {
    @Field( () => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field( () => Job, {nullable: true})
    job?: Job;
}


// define a single schema that provides hello
@Resolver()
export class JobResolver {
    kafkaClient: KafkaClientSingleTopic;

    initKafkaClient(publish: Publisher<Job>) {
        // await to ensure connection is established
        this.kafkaClient = new KafkaClientSingleTopic({topicName: "jobs", pubsub: publish, onMessage: this.onMessage});
    }

    async onMessage (job: Job, pubsub_from_ctx: Publisher<Job>) : Promise<void> {
        try {
            // console.log("onMessage pubsub_from_ctx: " , pubsub_from_ctx);
            await pubsub_from_ctx(job);
            // console.log("onMessage published: " , job);
        }
        catch (e) {
            console.log("onMessage caught error: " , e);
        }
    }

    @Query(() => [Job])
    async jobs(
        @PubSub("jobChangeSubscription") publish: Publisher<Job>,
    ) : Promise<Job[]> {
        if (!this.kafkaClient) {this.initKafkaClient(publish);}
        // rather than returning data here,
        // reset the offset on kafka, which will re-trigger the subscription
        this.kafkaClient.setOffsetZero();
        return [];
    }


    @Query(() => String)
    async hello(
        @PubSub("jobChangeSubscription") publish: Publisher<Job>,
    ) {
        if (!this.kafkaClient) {this.initKafkaClient(publish);}
        return "Initialized kafka client!";
    }

    @Mutation(() => JobResponse)
    async updateJob (
        @Arg("jobToUpdate") jobUpdate: JobInput,
        @PubSub("jobChangeSubscription") publish: Publisher<Job>,
    ) : Promise<JobResponse | null> {
        if (!this.kafkaClient) {this.initKafkaClient(publish);}

        this.kafkaClient.publishToTopic(jobUpdate);

        //
        // console.log("updateJob running graphql pubsub on: ", jobUpdate);
        // Publish the job so that the subscription can fire off
        const payload: Job = jobUpdate;
        await publish(payload);
        // await pubsub.publish("jobChangeSubscription", payload);
        // pubsub.publish('jobChangeSubscription', { jobChangeSubscription: { ...sampleJobs[idx] },});
        // console.log("updateJob ran pubsub.publish of: ", payload);

        // rather than returning data here,
        // reset the offset on kafka, which will trigger the subscription
        return { job: jobUpdate };
    }

    @Subscription({
        topics: "jobChangeSubscription",
        // topics: ({ args, payload, context}) => args.topic
        // subscribe: ({args, context}) => { // pubsub.asyncIterator('jobChangeSubscription'),
        //     return context.prisma.$subscribe.users({mutation_in: [args.mutationType]});
        // },
    })
    jobChangeSubscription(
        @Root() jobPayload: Job,
        // @Args() args: NewJobArgs,
    ): Job {
        console.log("updated Job:", jobPayload);
        if (!jobPayload) {
            jobPayload = new Job();
            jobPayload.id = 999;
            jobPayload.name = "no proper value passed in, adding hard coded result for now";
            console.log(jobPayload.name);
        }
        return jobPayload;
    }
}



