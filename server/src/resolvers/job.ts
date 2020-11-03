import {
    Resolver,
    Query,
    Mutation,
    Arg,
    InputType,
    Field,
    ObjectType,
    Subscription,
    Root,
    Publisher, PubSub, Float
} from "type-graphql";
import {JobRunIdentifier, JobInfo, JobDefinition, JobActivity} from "../entities/Job";
import {KafkaClientSingleTopic} from "../data/KafkaClientSingleTopic";

// import { sleep } from "../utils/sleep";

@InputType()
class JobInput {
    @Field(() => Float!)
    id: number

    @Field()
    name: string

    @Field({nullable:true})
    customJobLabel?: string

    @Field({nullable:true})
    runCmd?: string

    @Field({nullable:true})
    runCmdArgs?: string

    @Field(() => Float, {nullable: true})
    nextJobDefaultId?: number

    @Field(() => Float, {nullable: true})
    nextJobErrorDefaultId?: number

    // TO DO: handle array of numbers passed through graphql and other structures.
    // FOR NOW - PROTOTYPE STAGE - use a string of numbers comma separated
    // @Field(() => [Int], {nullable: true})
    @Field({nullable:true})
    nextJobOptions?: string
    // nextJobOptions?: [number]
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

    @Field( () => JobInfo, {nullable: true})
    jobInfo?: JobInfo;
}


@Resolver()
export class JobResolver {
    kafkaClient: KafkaClientSingleTopic;

    initKafkaClient(publish: Publisher<JobInfo>) {
        // await to ensure connection is established
        this.kafkaClient = new KafkaClientSingleTopic({topicName: "job-progress", pubsub: publish, onMessage: this.onMessage});
    }

    async onMessage (job: JobInfo, pubsub_from_ctx: Publisher<JobInfo>) : Promise<void> {
        try {
            // console.log("onMessage pubsub_from_ctx: " , pubsub_from_ctx);
            await pubsub_from_ctx(job);
            // console.log("onMessage published: " , job);
        }
        catch (e) {
            console.log("onMessage caught error: " , e);
        }
    }

    // @Query(() => [JobInfo])
    // async jobs(
    //     @PubSub("jobChangeSubscription") publish: Publisher<JobInfo>,
    // ) : Promise<JobInfo[]> {
    //     if (!this.kafkaClient) {this.initKafkaClient(publish);}
    //     // rather than returning data here,
    //     // reset the offset on kafka, which will re-trigger the subscription
    //     this.kafkaClient.setOffsetZero();
    //     return [];
    // }


    @Query(() => [JobInfo])
    async jobInfos(
        @PubSub("jobChangeSubscription") publish: Publisher<JobInfo>,
    ) : Promise<JobInfo[]> {
        if (!this.kafkaClient) {this.initKafkaClient(publish);}
        // rather than returning data here,
        // reset the offset on kafka, which will re-trigger the subscription
        this.kafkaClient.setOffsetZero();
        return [];
    }


    @Query(() => String)
    async hello(
        @PubSub("jobChangeSubscription") publish: Publisher<JobInfo>,
    ) {
        if (!this.kafkaClient) {this.initKafkaClient(publish);}
        return "Initialized kafka client!";
    }

    @Mutation(() => JobResponse)
    async updateJob (
        @Arg("jobDefinitionInput") jobInput: JobInput,
        @PubSub("jobChangeSubscription") publish: Publisher<JobInfo>,
    ) : Promise<{ jobResponse: JobResponse }> {
        if (!this.kafkaClient) {this.initKafkaClient(publish);}

        //
        // Publish the job so that the subscription can fire off
        var jobResponse: JobResponse = new JobResponse();
        var jobIdentifier: JobRunIdentifier = new JobRunIdentifier();
        jobIdentifier.id = jobInput.id;
        jobIdentifier.name = jobInput.name;
        var jobInfo: JobInfo = new JobInfo();
        var jobActivity: JobActivity = new JobActivity();
        jobActivity.jobIdentifier = jobIdentifier;
        jobInfo.jobActivity = [jobActivity];
        var jobDefinition: JobDefinition = new JobDefinition();
        jobDefinition.id = jobInput.id;
        jobDefinition.name = jobInput.name;
        jobDefinition.runCmd = jobInput.runCmd;
        jobDefinition.runCmdArgs = jobInput.runCmdArgs;
        jobDefinition.customJobLabel = jobInput.customJobLabel;
        jobDefinition.nextJobDefaultId = jobInput.nextJobDefaultId;
        jobDefinition.nextJobErrorDefaultId = jobInput.nextJobErrorDefaultId;
        jobDefinition.nextJobOptions = jobInput.nextJobOptions;
        jobInfo.jobDefinition = jobDefinition;

        this.kafkaClient.publishToTopicJobs(jobInfo);
        // publish(jobInfo);
        await publish(jobInfo);

        jobResponse.jobInfo = jobInfo
        return { jobResponse: jobResponse };
    }

    @Subscription({
        topics: "jobChangeSubscription",
    })
    jobChangeSubscription(
        @Root() jobPayload: JobInfo,
        // @Args() args: NewJobArgs,
    ): JobInfo {
        console.log("updated Job:", jobPayload);
        if (!jobPayload
            || jobPayload.jobActivity === undefined
            || jobPayload.jobActivity[0].jobIdentifier === undefined
            || jobPayload.jobActivity[0].jobIdentifier.id === undefined) {
            jobPayload = new JobInfo();
            const ji: JobRunIdentifier = ({
                id: 999
                , name: "no proper value passed in, adding hard coded result for now(1)"
            });
            const jd: JobDefinition = ({
                id: 999
                , name: "no proper value passed in, adding hard coded result for now(2)"
            });
            const ja: JobActivity = new JobActivity() ; ja.jobIdentifier = ji;
            jobPayload.jobActivity =[ ja ];
            jobPayload.jobDefinition = jd;
            console.log(jobPayload.jobDefinition.name);
        }
        return jobPayload;
    }
}
