import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/core';
// import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import {
    useGetJobsQuery,
    useUpdateJobMutation
} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import createUrqlClient from "../utils/createUrqlClient";
// import {isServer} from "../utils/isServer";
import {SimpleGrid, Stack} from "@chakra-ui/core/dist";
import SubscriptionDrivenJobsTable from "../components/SubscriptionDrivenJobsTable";
import {any} from "prop-types";
import StateHooksFunctionalComponent from "../components/StateHooksFunctionalComponent";

interface jobsProps {  }

const Jobs: React.FC<jobsProps> = ({}) => {
    // the first item in the returned array has information about what is going on with
    // the mutation, such as fetching, error, data, operation?
    // we can leave it as an empty object {} or we can just use a comma
    // the second element in the returned array is the name of our function, which you can name whatever
    // so we name it updateOneJob. once named, you can call that in the onSubmit element below
    // and pass in the values for the parameters as defined in the useMutation's graphql syntax
    const [,updateOneJob] = useUpdateJobMutation();
    const [{ fetching:jobsFetching, stale, error:jobsError, data:jobsData }] = useGetJobsQuery();
    // const [ { fetching:jobsFetching, data:jobsData } ] = useGetJobsQuery();

    // console.log("getJobsResult: ", jobsData);
    // console.log("getJobsResult.fetching: ", jobsFetching);
    // console.log("getJobsResult.data:jobsData: ", jobsData);

    // const [{ data:subscriptionJobsList, fetching:subscriptionJobsFetching }] = useGetJobChangesSubscription();

    const router = useRouter();
    // if (subscriptionJobsFetching) {
    //     return (
    //         <div>Fetching subscription data!</div>
    //     )
    // }
    // if (subscriptionJobsList) {
    //     console.log(        {subscriptionJobsList}        );
    //     // const gridNode = this.myRef;
    //     // console.log(        "gridNode: ", jobsGrid        );
    //     // gridNode.current.onAddItem();
    // }
    if (!jobsFetching && !jobsData) {
        return (
            <div>
                <div>you got query failed for some reason</div>
                <div>{jobsError?.message}</div>
            </div>
        );
    }
    return (
        <>
        <SimpleGrid columns={2}>
        <Wrapper sizeProfile="small">
                <Formik initialValues={{id: -1, name: "job name here"}}
                    // onSubmit={(submitValues) => {
                    // changed this to 'async', in coordination with adding 'await' on the hook function call below
                    onSubmit={async (submitValues, {setErrors} ) => { // Formik supports the setErrors feature
                        console.log('submitting: ', submitValues);
                        const sId: string = `${submitValues.id}`; // the initial value forced to be string
                        const jobId: number = parseInt( sId ); // convert string to int
                        // note: the below 'return' means returning a Promise,
                        // and it will stop the submit button from spinning after clicking it
                        //                return updateOneJob(..)
                        //
                        //
                        // notice that the hook function
                        //                const response = updateOneJob(
                        // returns a type <any> by default
                        //                const response: Promise<OperationResult<any>>
                        // which is not very useful when you want to get specific responses
                        // to handle (like errors), which our graphql resolver returns and
                        // would fall between the cracks unless we do something with it
                        // Also, it isn't very type-safe.
                        //
                        // This is why we use the graphql-code-generator package.
                        // it will create hook functions with properly defined return types
                        // that we can use in the forms here
                        // see http://graphql-code-generator.com/docs/getting-started/installation
                        //
                        // when that package is used, it will have created hook function named
                        //      const [,updateOneJob] = useUpdateJobMutation();
                        // and the response type is good:
                        //      const response: OperationResult<UpdateJobMutation>
                        //
                        const response = await updateOneJob(
                            {"id": jobId,
                            "name": submitValues.name}
                        );
                        // now using the codegen-generated response type, the
                        // response object has known deep structure values such as
                        // response.data.updateJob.job.name
                        //
                        // note the ? after data. that means if there is no data, it will return undefined
                        // instead of throwing an error, which happens when there is no data and
                        // we do not specify the "optional" attribute '?'
                        if (response.data?.updateJob.errors) {
                            // Formik expects the error info structure as follows (key: value)
                            //  setErrors({ id: "you have an error in the id field", });
                            // however, our graphql error reporting is in the form/shape of
                            //  [{field: 'id', message: 'the error'}]
                            // so we created a utility that turns an array into an object/structure
                            setErrors(toErrorMap(response.data.updateJob.errors));
                        }
                        else {
                            // that worked, navigate to home page - as example response to show the use of navigation
                            // using next/router
                            //router.push("/");
                            console.log("update successful")
                        }
                    }}
                >
                    {({values, handleChange, isSubmitting}) => (
                        <Form>
                            <InputField
                                value={values.id}
                                onChange={handleChange}
                                placeholder="jobId"
                                label="Job Id"
                                name="id"
                            />
                            <Box mt={4}>
                            <InputField
                                value={values.name}
                                onChange={handleChange}
                                placeholder="jobName"
                                label="Job Name"
                                name="name"
                            />
                            </Box>
                            <Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">Update</Button>
                        </Form>
                    )}
                </Formik>
        </Wrapper>
            <SimpleGrid id="jobs" columns={1}>
            <Box marginTop={8}>
                <h1>Pre-loaded data</h1>
                { !jobsData && jobsFetching ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <StateHooksFunctionalComponent jobs={jobsData? jobsData?.jobs : undefined}/>
                    {/*<SubscriptionDrivenJobsTable/>*/}
                    </>
                )}
            </Box>
            </SimpleGrid>
        </SimpleGrid>
        </>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: false}) (Jobs);
// {/*{subscriptionJobsList?.jobChangeSubscription}*/}
// <SubscriptionDrivenJobsTable list={jobsData ? jobsData : initialData}/>
// {/*<Box>*/}
// {/*    <div key = {data.jobChangeSubscription.id}>{data.jobChangeSubscription.id}: {data.jobChangeSubscription.name}</div>*/}
// {/*</Box>*/}
