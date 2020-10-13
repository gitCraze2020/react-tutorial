import { Consumer } from "kafka-node";
import {Job} from "../entities/Job";
import {Publisher} from "type-graphql";
interface KafkaClientSingleTopicOptions {
    topicName: string;
    // onMessage: string;
    // onMessage: (job: Job) => void;
    onMessage: (job: Job, pubsub_from_ctx: Publisher<Job>) => Promise<void>;
    pubsub: Publisher<Job>;
    //onMessage: (...args: any[]) => void, options?: Object
    // onMessage(): { (myArgument: string): string };
}
export class KafkaClientSingleTopic {
    onMessage: (job: Job, pubsub_from_ctx: Publisher<Job>) => Promise<void>;
    pubsub: Publisher<Job>;
    topicName: string;
    kafka = require('kafka-node');
    Consumer = this.kafka.Consumer;
    client = new this.kafka.KafkaClient();
    consumerTopicJobs: Consumer;


    constructor(apiOptions: KafkaClientSingleTopicOptions) {
        // var kafka = require('kafka-node'),
        //     Consumer = kafka.Consumer,
        //     client = new kafka.KafkaClient(),
        this.consumerTopicJobs = new this.kafka.Consumer(
                this.client,
                [
                    { topic: apiOptions.topicName, partition: 0 }
                    // { topic: 't', partition: 0 }, { topic: 't1', partition: 1 }
                ],
                {
                    autoCommit: false
                }
            );
        this.onMessage = apiOptions.onMessage;
        this.consumerTopicJobs.on('error', function (err: any) { // for now, message is type any
            console.log(err);
        });

        // this.consumerTopicJobs.on('message',  (message: any) => this.processInbound(message)); // for now, message is type any
        this.consumerTopicJobs.on('message',  (message: any) => this.processInbound(message, apiOptions.pubsub)); // for now, message is type any
    }

    public toString() {
        const info = "KafkaClientSingleTopic: " + typeof this.consumerTopicJobs;
        return info;
    }

    private async processInbound (message: any, pubsub: Publisher<Job>) { // for now, message is type any
        console.log(message);
        console.log(message.value);
        const sMsg: string = `${message.value}`
        const jsonFormatMessage = JSON.parse( sMsg );
        console.log("jsonFormatMessage: ", jsonFormatMessage.id);
        console.log("jsonFormatMessage id: ", jsonFormatMessage.id);
        var jobId: number = jsonFormatMessage.id;
        var jobName: string = jsonFormatMessage.name;
        const newJob: Job = { id: jobId, name: jobName };
        console.log("kafkaClient running pubsub on: ", newJob);
        try {
            this.onMessage(newJob, pubsub);
        }
        catch (e) {
            console.log("processInbound while sending to resolver caught error: ", e);
        }
    };

    // consumerTopicJobs.on('message', function (message: any) { // for now, message is type any
    //     console.log(message);
    //     console.log(message.value);
    //     const sMsg: string = `${message.value}`
    //     const jsonFormatMessage = JSON.parse( sMsg );
    //     console.log("jsonFormatMessage: ", jsonFormatMessage.id);
    //     console.log("jsonFormatMessage id: ", jsonFormatMessage.id);
    //     var jobId: number = jsonFormatMessage.id;
    //     var jobName: string = jsonFormatMessage.name;
    //     const newJob: Job = { id: jobId, name: jobName };
    //     console.log("kafkaClient running pubsub on: ", newJob);
    //
    //     console.log("gqlServer: ", gqlServer);
    //     if (!gqlServer) {
    //         throw "kafka client needs graphql server property set";
    //     }
    //     gqlServer.executeOperation({ query: "query { hello }"});
    //
    // });

}



