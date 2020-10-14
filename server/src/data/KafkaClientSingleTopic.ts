import { Consumer } from "kafka-node";
import {Job} from "../entities/Job";
import {Publisher} from "type-graphql";

interface KafkaClientSingleTopicOptions {
    topicName: string;
    onMessage: (job: Job, pubsub_from_ctx: Publisher<Job>) => Promise<void>;
    pubsub: Publisher<Job>;
    partition?: number;
}
export class KafkaClientSingleTopic {
    static DEFAULT_PARTITION: number = 0;
    apiOptions: KafkaClientSingleTopicOptions;
    kafka = require('kafka-node');
    client = new this.kafka.KafkaClient();
    consumerTopicJobs: Consumer;

    public setOffsetZero() {
        if (this.consumerTopicJobs) {
            this.consumerTopicJobs.setOffset(
                this.apiOptions.topicName,
                this.apiOptions.partition ? this.apiOptions.partition : KafkaClientSingleTopic.DEFAULT_PARTITION,
                0);
        }
        else {
            console.error("setOffsetZero: consumerTopicJobs is undefined, KafkaClientSingleTopic needs initialize call first");
        }
    }

    public async publishToTopic(jobUpdate: Job): Promise<void> {
        // console.log("publishToTopic: ", jobUpdate);

        try {
            const jsonFormatMessage = JSON.stringify( jobUpdate );

            const Producer = this.kafka.Producer;
            var producerTopicJobs = new Producer(
                new this.kafka.KafkaClient(),
                // this.client,   // don't share client with the consumer, as the behavior is that producer does not commit
                {
                    autoCommit: true,
                });
            const kafka_topic = this.apiOptions.topicName;
            // to do: handle partition. now hard-coded to partition 0
            console.log("sending message to topic ", this.apiOptions.topicName, ": ", jsonFormatMessage);

            let payloads = [
                {
                    topic: kafka_topic,
                    partition: this.apiOptions.partition,
                    messages: jsonFormatMessage //this.apiOptions.topicName
                }
            ];

            producerTopicJobs.on('ready', async function() {
                // console.log("opened/ready state on producerTopicJobs connection");
                // producerTopicJobs.off('message');
                var push_status = producerTopicJobs.send(payloads, (err: any, data: any) => {
                    if (err) {
                        console.error('[kafka-producer -> '+kafka_topic+']: broker update failed. push_status = ', push_status, "; err = ", err);
                    } else {
                        console.log('[kafka-producer -> '+kafka_topic+']: broker update success. push_status = ', push_status, "; data = ", data);
                    }
                    if (producerTopicJobs) {
                        // console.log("closing producerTopicJobs connection");
                        producerTopicJobs.close();
                    }
                });
            });

            producerTopicJobs.on('error', function(err: any) {
                console.log("producerTopicJobs caught error on connect: ", err);
                console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
                if (producerTopicJobs) {
                    producerTopicJobs.close();
                }
                throw err;
            });
        }
        catch (e) {
            console.error(e);
        }

    };

    constructor(apiOptions: KafkaClientSingleTopicOptions) {
        this.apiOptions = apiOptions;
        if (!apiOptions.partition) {
            this.apiOptions.partition = KafkaClientSingleTopic.DEFAULT_PARTITION;
        }
        this.consumerTopicJobs = new this.kafka.Consumer(
                this.client,
                [
                    { topic: apiOptions.topicName, partition: this.apiOptions.partition }
                    // { topic: 't', partition: 0 }, { topic: 't1', partition: 1 }
                ],
                {
                    autoCommit: false
                }
            );
        this.consumerTopicJobs.on('error', function (err: any) { // for now, err is type any
            console.error(err);
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



