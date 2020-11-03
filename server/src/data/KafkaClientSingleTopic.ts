import { Consumer } from "kafka-node";
import {JobInfo, JobDefinition, JobActivity, JobRunIdentifier} from "../entities/Job";
import {Publisher} from "type-graphql";
import {MessageEnvelope} from "../entities/MessageEnvelope";

interface KafkaClientSingleTopicOptions {
    topicName: string;
    onMessage: (jobInfo: JobInfo, pubsub_from_ctx: Publisher<JobInfo>) => Promise<void>;
    pubsub: Publisher<JobInfo>;
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

    public async publishToTopicJobs(jobInfoUpdate: JobInfo): Promise<void> {
    // public async publishToTopic(jobInfoUpdate: Job): Promise<void> {
        // console.log("publishToTopic: ", jobInfoUpdate);

        // TO DO: proper topic configs
        const updateJobTopic = "job-runbin"; //this.apiOptions.topicName;
        try {
            const infoClass = "JobDefinition" // the default object class/type in the payload structure
            const jsonFormatMessage = JSON.stringify( jobInfoUpdate.jobDefinition );
            const jobEnvelope:MessageEnvelope = {
                    id:( jobInfoUpdate.jobDefinition ) ? jobInfoUpdate.jobDefinition.id : -999,
                    name:( jobInfoUpdate.jobDefinition ) ? jobInfoUpdate.jobDefinition.name : "????",
                    infoClass: infoClass,
                    infoContentType:0,
                    infoPayload:jsonFormatMessage
                };
            const jsonFormatEnvelope = JSON.stringify(jobEnvelope)

            const Producer = this.kafka.Producer;
            var producerTopicJobs = new Producer(
                new this.kafka.KafkaClient(),
                // this.client,   // don't share client object with a consumer, because the behavior is a producer does not commit
                {
                    autoCommit: true,
                });
            const kafka_topic = updateJobTopic;
            // to do: handle partition. now hard-coded to partition 0
            console.log("sending message to topic ", updateJobTopic, ": ", jsonFormatEnvelope);

            let payloads = [
                {
                    topic: kafka_topic,
                    partition: this.apiOptions.partition,
                    messages: jsonFormatEnvelope //this.apiOptions.topicName
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
        const info = "KafkaClientSingleTopic: consumerTopicJobs: " + this.consumerTopicJobs
            + "\n"
            + "apiOptions: " + this.apiOptions;
        return info;
    }

    private async processInbound (message: any, pubsub: Publisher<JobInfo>) { // for now, message is type any
        const sMsg: string = `${message.value}`
        console.log("KafkaClientSingleTopic processInbound: ", sMsg);
        const jsonFormatMessage = JSON.parse( sMsg );
//
//         TO DO: parse the *NOT array of* activities from the payload
//         field by field and sub-structure by substructure
//         because there is no automation in typescript natively
// TO DO: describe a few scenarios of message usage and the (envelope) structure that type of message needs

        function processActivity(infoPayload: any) : JobActivity {
            const jobIdentifier: JobRunIdentifier = {
                id: infoPayload.jobIdentifier.id,
                name: infoPayload.jobIdentifier.name,
                jobInstanceId: infoPayload.jobIdentifier.jobInstanceId,
                resultSeqNum: infoPayload.jobIdentifier.resultSeqNum
            }

            const jobActivity: JobActivity = {
                jobIdentifier: jobIdentifier,
                logDateTime: infoPayload.logDateTime,
                logLevel: infoPayload.logLevel,
                result: infoPayload.result
            };
            return jobActivity;
        }
        function processDefinition(infoPayload: any) : JobDefinition {
            const jobDefinition: JobDefinition = {
                id: infoPayload.id,
                name: infoPayload.name,
                runCmd: infoPayload.runCmd,
                runCmdArgs: infoPayload.runCmdArgs,
                customJobLabel: infoPayload.customJobLabel,
                nextJobDefaultId: infoPayload.nextJobDefaultId,
                nextJobErrorDefaultId: infoPayload.nextJobErrorDefaultId,
                nextJobOptions: infoPayload.nextJobOptions,
            }
            return jobDefinition;
        }


        try {

            var jobEnvelope: MessageEnvelope;
            var jobDefinition: JobDefinition = new JobDefinition;
            var jobActivity :JobActivity = new JobActivity;
            jobEnvelope =  {
                id: jsonFormatMessage.id,
                name: jsonFormatMessage.name,
                infoClass: jsonFormatMessage.infoClass,
                infoContentType: jsonFormatMessage.infoContentType,
                infoPayload: jsonFormatMessage.infoPayload,
            }
            const jsonFormatInfoPayload = JSON.parse( jobEnvelope.infoPayload );
            // ts reflections aren't done easily at the moment, so hard coded struct names for now
            if (jobEnvelope.infoClass == "JobActivity") {
                jobActivity = processActivity(jsonFormatInfoPayload);
            } else if (jobEnvelope.infoClass == "JobDefinition") {
                jobDefinition = processDefinition(jsonFormatInfoPayload);
            } else if (jobEnvelope.infoClass == "JobInfo") {
                console.log("KafkaClientSingleTopic parsing JobInfo, needs at least one DEBUGGING step through!");
                jobDefinition = processDefinition(jsonFormatMessage.infoPayload.jobDefinition);
                jobActivity = processActivity(jsonFormatMessage.infoPayload.jobActivity);
            }


            var newJobInfo: JobInfo = new JobInfo();
            newJobInfo.jobDefinition = jobDefinition;
            newJobInfo.jobActivity = [jobActivity];

            // this allows a merge of job definitions and their activities on graphql consumer (ie the ui)
            if (newJobInfo.jobDefinition.id == undefined) {
                newJobInfo.jobDefinition.id = jobActivity.jobIdentifier.id
            }
            if (newJobInfo.jobDefinition.name == undefined){
                newJobInfo.jobDefinition.name = jobActivity.jobIdentifier.name
            }

            console.log("KafkaClientSingleTopic running pubsub on: ", newJobInfo);

            this.apiOptions.onMessage(newJobInfo, pubsub);
        }
        catch (e) {
            console.error("KafkaClientSingleTopic while sending to resolver caught error: ", e);
        }
    };


}



