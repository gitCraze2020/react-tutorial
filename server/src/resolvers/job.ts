import { Resolver, Query, Mutation, Arg, Int, InputType, Field, ObjectType } from "type-graphql";
import { Job } from "../entities/Job";
import { sampleJobs } from "..";

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
    @Query(() => [Job])
    jobs() {
        return sampleJobs;
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


    @Mutation(() => JobResponse)
    async updateJob (
        @Arg('jobToUpdate') jobUpdate: JobInput
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
        return {
            job: sampleJobs[idx]
        };
        // .filter((job: Job) => job.id === jobId)
    }

}
