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
import { sampleJobs } from "..";
import { Context } from "graphql-composer";
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
    // psctx: any;

    initKafkaClient(publish: Publisher<Job>) {
        // console.log("constructor, this.kafkaClient:", this.kafkaClient);
        // console.log("initKafkaClient received ctx: ", ctx);
        // this.psctx = ctx.pubsub_in_ctx;
        // console.log("initKafkaClient set this.psctx: ", this.psctx);
        this.kafkaClient = new KafkaClientSingleTopic({topicName: "jobs", pubsub: publish, onMessage: this.onMessage});
    }

    async onMessage (job: Job, pubsub_from_ctx: Publisher<Job>) : Promise<void> {
        console.log("onMessage received from kafka: " , job);
        try {
            console.log("onMessage pubsub_from_ctx: " , pubsub_from_ctx);
            await pubsub_from_ctx(job);
            console.log("onMessage published: " , job);
            // await publish(job);
            // await ctx.req.pubsub.publish('jobChangeSubscription', job);
        }
        catch (e) {
            console.log("onMessage caught error: " , e);
        }
        // await Ctx.req.pubsub.publish('jobChangeSubscription', job);
    }


    @Query(() => [Job])
    async jobs() : Promise<Job[]> {
        // async jobs() {
    //     await sleep(8000);
        return sampleJobs;
    }


    @Query(() => String)
    async hello(
        // @Ctx() ctx: any,
        @PubSub("jobChangeSubscription") publish: Publisher<Job>,
    ) {
        //await ctx.req.pubsub.publish('jobChangeSubscription');
        this.initKafkaClient(publish);
        return "Initialized kafka client!";
    }

    @Mutation(() => JobResponse)
    async updateJobName (
        @Arg("id", () => Int) jobId: number,
        @Arg("name") jobName: string
    ) : Promise<JobResponse | null> {
        // return sampleJobs[0]
        let idx : number = -1;
        var BreakException = {};
        try {
            sampleJobs.forEach(job => {
                idx += 1;
                if (job.id === jobId) {
                    throw BreakException;
                };
            });
        } catch (e) {
            if (e !== BreakException) {
                return {
                    errors: [{
                        field: "id",
                        message: e.message
                    }]
                }
            };
        }
        if (idx === -1) {
            return {
                errors: [{
                    field: "id",
                    message: "No jobs found"
                }]
            }
        }
        if (idx === sampleJobs.length) {
            return {
                errors: [{
                    field: "id",
                    message: `No job found with id ${jobId}`
                }]
            }
        }
        sampleJobs[idx].name = jobName;

        return {
            job: sampleJobs[idx]
        };
        // .filter((job: Job) => job.id === jobId)
    }


// console.log("updateJobName running pubsub on: ", sampleJobs[idx]);
//         // Publish the job so that the subscription can fire off
//         pubsub.publish('jobChangeSubscription', {
//             jobChangeSubscription: { ...sampleJobs[idx], jobName },
//         });


    @Mutation(() => JobResponse)
    async updateJob (
        @Arg("jobToUpdate") jobUpdate: JobInput,
        @PubSub("jobChangeSubscription") publish: Publisher<Job>,
    ) : Promise<JobResponse | null> {
        // return sampleJobs[0]
        let idx : number = -1;
        var BreakException = {};
        try {
            sampleJobs.forEach(job => {
                idx += 1;
                if (job.id === jobUpdate.id) {
                    throw BreakException;
                };
            });
        } catch (e) {
            if (e !== BreakException) {
                return {
                    errors: [{
                        field: "id",
                        message: e.message
                    }]
                }
            };
        }
        if (idx === -1) {
            return {
                errors: [{
                    field: "id",
                    message: "No jobs found"
                }]
            }
        }
        if (sampleJobs[idx].id != jobUpdate.id) {
            return {
                errors: [{
                    field: "id",
                    message: `No job found with id ${jobUpdate.id}`
                }]
            }
        }
        sampleJobs[idx].name = jobUpdate.name;

        console.log("updateJob running pubsub on: ", sampleJobs[idx]);
        // Publish the job so that the subscription can fire off
        const payload: Job = sampleJobs[idx];
        await publish(payload);
        // await pubsub.publish("jobChangeSubscription", payload);
        // pubsub.publish('jobChangeSubscription', { jobChangeSubscription: { ...sampleJobs[idx] },});
        console.log("updateJob ran pubsub.publish of: ", payload);

        return {
            job: sampleJobs[idx]
        };
        // .filter((job: Job) => job.id === jobId)
    }

    @Query(() => Job)
    ctxBody(context: Context) {
        console.log("context.body before:", context.body);

        context.body = new Job();

        console.log("context.body after:", context.body);

    }

    // @PubSub("jobChangeSubscription") pubsub: Publisher<Job>,
    // GetJobChangesSubscription: {
    //     jobChangeSubscription: {
    //         subscribe: () => pubsub.asyncIterator("jobChangeSubscription"),
    //     },
    // }
    //

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

    // @Query()
    // trigger(): JobResponse {
    //     pubsub.publish('jobChange', { job: sampleJobs[idx] });
    //     // ...
    // }
    //
    //     jobChange: {
    //         subscribe: () => (return sampleJobs[idx])
    //         // subscribe: () => pubsub.asyncIterator(['jobChange']),
    //     },
    // }
}
