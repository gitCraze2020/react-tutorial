import React from "react";
import {Button, Form, Input, List} from "antd";
import {Job, useGetJobChangesSubscription} from "../generated/graphql";
// import React, {ChangeEvent, FormEvent, useEffect, useLayoutEffect, useState} from "react";
// import {CombinedError, Operation} from "@urql/core";


// see https://codersera.com/blog/react-hooks-with-typescript-use-state-and-use-effect-in-2020/

type jobList = { [id: number]: Job } | undefined;
interface Props {
    // type Dict = { [key: string]: string };
    // const store: Record<string, string> = {};
    jobs: jobList;
}

const StateHooksFunctionalComponent: React.FC<Props> = ({jobs}) => {
    // const MERGEJOB = "mergeJob: ";
    const OUTER = "OUTER: ";
    // const HANDLESUSPEND = "handleSuspend: ";
    // const HANDLESUBMIT = "handleSubmit: ";
    // const ONNAMECHANGE = "onNameChange: ";
    // const ONIDCHANGE = "onIdChange: ";
    // const USEEFFECTMOUNT = "Mount: ";
    // const USEEFFECTUNMOUNT = "UnMount: ";
    // const USEEFFECTANY = "ANY Effect: ";
    // const USEEFFECTNAME = "Name Effect: ";

    const mergeJob = (newJob: Job) => {
        if (!newJob) {
            console.error("argument is undefined, expected new job")
            return;
        }
        // console.log(MERGEJOB, newJob);
        var newJobsList: jobList = jobs;
        if (!newJobsList) {
            newJobsList = { [newJob.id]: newJob };
        }
        else {
            newJobsList[newJob.id] = newJob;
        }
        jobs = newJobsList;
    }


    if (!jobs) {
        console.error(OUTER, "initializing jobs with FC local values");
        jobs = [{id: 0, name: "update hardcoded zero"}, {id: 1, name: "update hardcoded one"}];
    }
    // else {
    //     Object.entries(jobs).map(([jobId, job]) => {
    //         console.log(OUTER, "top id/name: ", jobId, job.name);
    //     })
    // }
    // var subscriptionJobsList: GetJobChangesSubscription | undefined;

    // console.log(OUTER, "Running useGetJobChangesSubscription()");
    const [{
        data: subscriptionList
        , fetching: subscriptionJobsFetching
        // , stale: subscriptionJobsStale
        // , error: subscriptionJobsCombinedError
        // , extensions: subscriptionJobsRecordStringAny
        // , operation: subscriptionJobsOperation
        }
    ] = useGetJobChangesSubscription();

    console.log(OUTER, "data: ", subscriptionList);
    console.log(OUTER, "fetching: ", subscriptionJobsFetching);
    // console.log(OUTER, "stale: ", subscriptionJobsStale);
    // console.log(OUTER, "error: ", subscriptionJobsCombinedError);
    // console.log(OUTER, "extensions: ", subscriptionJobsRecordStringAny);
    // console.log(OUTER, "operation: ", subscriptionJobsOperation);


    if (subscriptionList) {
        mergeJob(subscriptionList.jobChangeSubscription);
    }

    // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    //     console.log(HANDLESUBMIT, "handleSubmit e: ", e);
    //     e.preventDefault();
    // };

    // useEffect(() => {
    //     console.log(USEEFFECTMOUNT, "Component mounted");
    //     return () => {
    //         console.log(USEEFFECTUNMOUNT, "Component will be unmounted");
    //     }
    // }, []);

    // useEffect(() => {
    //     console.log(USEEFFECTANY, `subscriptionJobsList: ${subscriptionJobsList}, subscriptionJobsFetching: ${subscriptionJobsFetching}`);
    //     if (subscriptionJobsList) {
    //         console.log(USEEFFECTANY, `subscriptionJobsList.jobChangeSubscription: ${subscriptionJobsList?.jobChangeSubscription}, subscriptionJobsFetching: ${subscriptionJobsFetching}`);
    //         // mergeJob(subscriptionJobsList.jobChangeSubscription);
    //         // const newJob: Job = subscriptionJobsList.jobChangeSubscription;
    //
    //         console.log(USEEFFECTANY, ">>>");
    //         jobs ? (
    //             Object.entries(jobs).map(([jobId, job]) => {
    //             console.log(USEEFFECTANY, " id/name: ", jobId, job.name);
    //                 })
    //             ) : (
    //             console.log(USEEFFECTANY, " jobs undefined: ", jobs)
    //         );
    //         console.log(USEEFFECTANY,"^^^");
    //         console.log(USEEFFECTANY,"subscriptionJobsFetching: ", subscriptionJobsFetching);
    //     }
    // });

    // useEffect(() => {
    //     console.log(USEEFFECTNAME, `subscriptionJobsList: ${subscriptionJobsList}, subscriptionJobsFetching: ${subscriptionJobsFetching}`);
    //     console.log(USEEFFECTNAME, ">>>");
    //     if (subscriptionJobsList) {
    //         // mergeJob(subscriptionJobsList.jobChangeSubscription);
    //         jobs ? (
    //             Object.entries(jobs).map(([jobId, job]) => {
    //                 console.log(USEEFFECTNAME, "id/name: ", jobId, job.name);
    //             })
    //         ) : (
    //             console.log(USEEFFECTNAME, "jobs undefined: ", jobs)
    //         );
    //         console.log(USEEFFECTNAME, "^^^");
    //         console.log(USEEFFECTNAME, "subscriptionJobsFetching: ", subscriptionJobsFetching);
    //     }
    // }, [name]);

    Object.entries(jobs).map(([jobId, job]) => {
        console.log(OUTER, "bottom id/name: ", jobId, job.name);
    })
    console.log(OUTER, "returning content...");

    return (
        <>
            <div>entries: {Object.entries(jobs).length}</div>
            <List >{
                Object.entries(jobs).map( ([key, value]) => (
                        <li>{value.id}: {value.name} </li>
                ))
            }
            </List>
            </>
    )

}

export default StateHooksFunctionalComponent;
