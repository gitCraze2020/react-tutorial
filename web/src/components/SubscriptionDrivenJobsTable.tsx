import React, {ChangeEvent, useState} from 'react';
import {Formik, Form, useFormik} from 'formik';
import {Button} from "@chakra-ui/core/dist";
import Input from "@chakra-ui/core/dist/Input";
import Box from "@chakra-ui/core/dist/Box";
import {Job} from "../generated/graphql";
import InputField from "./InputField";
// import {Job, useGetJobChangesSubscription, useGetJobsQuery} from "../generated/graphql";
// import {UseSubscriptionResponse} from "urql";

interface SubscriptionDrivenJobsTableProps {
    // p_subscriptionJobsInfo: UseSubscriptionResponse<Job[]> | undefined,    // make this a JobFragment, reduced set of fields for the listing
    // p_initialJobs: Job[] | undefined
}
// const getInitialJobs = () => {
//     const [{ fetching:jobsFetching, stale, error:jobsError, data:jobsData }] = useGetJobsQuery();
//     console.log("SubscriptionDrivenJobsTable, getInitialJobs jobsFetching: ", jobsFetching);
//     return [{id: 0, name: "update hardcoded zero"}, {id: 1, name: "update hardcoded one"}];
// }

const SubscriptionDrivenJobsTable: React.FC<SubscriptionDrivenJobsTableProps> = () => {
    const flushToTable = (job: Job) => {
        console.log("flushToTable; job=", job);
    }
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit(values) {
            // This will run when the form is submitted
            console.log("formik onSubmit values=", values);
        }
    });
    // const [initialJobs, getInitialJobs ] = useState<Job[]>();
    // const [subscriptionJobsInfo, useGetJobChangesSubscription] = useState<Job[]>();
    // console.log("SubscriptionDrivenJobsTable, subscriptionJobsInfo: ", subscriptionJobsInfo);
    // console.log("SubscriptionDrivenJobsTable, initialJobs: ", initialJobs);
    return (
        <>
        <Formik               initialValues={{id: 99, name: "default name"}}
              onSubmit={async (sinkValues, {setErrors} ) => {
                  // console.log("flushing setErrors:", setErrors);
                  const sId: string = `${sinkValues.id}`; // the initial value forced to be string
                  const jobId: number = parseInt( sId ); // convert string to int
                  const job: Job = {
                      "id": jobId,
                      "name": sinkValues.name
                  };
                  flushToTable(job);
              } }>
                {({values,
                    handleChange,
                    isSubmitting
                }) => (
                    <Form>
                        <InputField
                            placeholder="jobId"
                            label="Job Id"
                            name="id"
                            value={values.id}
                            onChange={formik.handleChange}
                        />
                        <InputField
                            value={values.name}
                            onChange={handleChange}
                            placeholder="jobName"
                            label="Job Name"
                            name="name"
                        />
                        <Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">Flush</Button>
                    </Form>
                )}
        </Formik>
            <div >
                <ul >
                        <div>No data</div>
                    {/*) : (*/}
                    {/*    <>*/}
                    {/*        <div>Collecting...</div>*/}
                    {/*    </>*/}
                    {/*)*/}
                </ul>
            </div>
        </>
        );
};
export default SubscriptionDrivenJobsTable;
// onChange={(e) => {
//     console.log("onChange event ", e);
//     const sId: string = `${values.id}`; // the initial value forced to be string
//     const jobId: number = parseInt( sId ); // convert string to int
//     const job: Job = {
//         "id": jobId,
//         "name": e.type && values.name
//     };
//     flushToTable(job);
// }}



// console.log("this:" , this);
// console.log("this.state:" , this.state);
// console.log("this.state.list:" , this.state.list);

// {/*{ !subscriptionJobsInfo ? (*/}
// subscriptionJobsInfo: {  subscriptionJobsInfo };
//
// subscriptionJobsInfo?.map(item => (
//     <li key={item.id}>{item.id}: {item.name}</li>
//     )
// )
//
// onAddItem = () => {
//     this.setState(
//         {
//             list: [{id: 0, name: "update hardcoded zero"}, {id: 1, name: "update hardcoded one"}]
//         }
//     );
//     // this.setState(state => {
//     // // this.setState((currentState: ArrayManagedTableProps) => {
//     //     const newList: Job[] = list ? list.concat(newJob) : [ newJob ] ;
//     //     return ({
//     //         newList,
//     //         newJob: undefined,
//     //     }) ArrayManagedTableState;
//     // });
// }
//