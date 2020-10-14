import { Consumer } from "kafka-node";
import {Job} from "../entities/Job";
import {Publisher} from "type-graphql";

interface KafkaClientSingleTopicOptions {
    topicName: string;
    onMessage: (job: Job, pubsub_from_ctx: Publisher<Job>) => Promise<void>;
    pubsub: Publisher<Job>;
}
export class KafkaClientSingleTopic {
    apiOptions: KafkaClientSingleTopicOptions;
    kafka = require('kafka-node');
    client = new this.kafka.KafkaClient();
    consumerTopicJobs: Consumer;

    constructor(apiOptions: KafkaClientSingleTopicOptions) {
        this.apiOptions = apiOptions;
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
        this.consumerTopicJobs.on('error', function (err: any) { // for now, err is type any
            console.log(err);
        });

        this.consumerTopicJobs.on('message',  (message: any) => this.processInbound(message, apiOptions.pubsub));
    }

    public toString() {
        const info = "KafkaClientSingleTopic: " + this.consumerTopicJobs
            + "\n"
            + "apiOptions: " + this.apiOptions;
        return info;
    }

    private async processInbound (message: any, pubsub: Publisher<Job>) { // for now, message is type any
        const sMsg: string = `${message.value}`
        const jsonFormatMessage = JSON.parse( sMsg );

        var jobId: number = jsonFormatMessage.id;
        var jobName: string = jsonFormatMessage.name;
        const newJob: Job = { id: jobId, name: jobName };
        console.log("KafkaClientSingleTopic running pubsub on: ", newJob);

        try {
            this.apiOptions.onMessage(newJob, pubsub);
        }
        catch (e) {
            console.log("KafkaClientSingleTopic while sending to resolver caught error: ", e);
        }
    };

}



