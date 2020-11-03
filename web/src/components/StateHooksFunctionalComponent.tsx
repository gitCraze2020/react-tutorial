import React from "react";
import { List, ListItem, Text } from '@chakra-ui/core';
// import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/core';
// import {Button, Form, Input, List} from "antd";
import {JobInfo, useGetJobChangesSubscription} from "../generated/graphql";
import {Box, Flex, Stack} from "@chakra-ui/core/dist";
import {number} from "prop-types";
import {switchCase} from "@babel/types";
// import React, {ChangeEvent, FormEvent, useEffect, useLayoutEffect, useState} from "react";
// import {CombinedError, Operation} from "@urql/core";


// see https://codersera.com/blog/react-hooks-with-typescript-use-state-and-use-effect-in-2020/

type jobList = { [id: number]: JobInfo } | undefined;
interface Props {
    jobs: jobList;
}

const StateHooksFunctionalComponent: React.FC<Props> = ({jobs}) => {
    const OUTER = "OUTER: ";

    const mergeJob = (newJob: JobInfo) => {
        if (!newJob) {
            console.error("argument is undefined, expected new job")
            return;
        }
        // we intend to affect the state of this component, held in variables defined in Props
        var newJobsList: jobList = jobs;
        if (!newJobsList) {
            newJobsList = { [newJob.jobDefinition.id]: newJob };
        }
        else {
            // ID in graphql is carried as string; use the unary + operator to parse to number:
            newJobsList[+newJob.jobDefinition.id] = newJob;
        }
        jobs = newJobsList;
    }

    if (!jobs) {
        console.error(OUTER, "initializing jobs with an empty array");
        jobs = [];
    }
    const [{
        data: subscriptionList
        , fetching: subscriptionJobsFetching
        }
    ] = useGetJobChangesSubscription();

    console.log(OUTER, "data: ", subscriptionList);
    console.log(OUTER, "fetching: ", subscriptionJobsFetching);


    if (subscriptionList) {
        mergeJob(subscriptionList.jobChangeSubscription);
    }
    Object.entries(jobs).map(([jobId, job]) => {
        console.log(OUTER, "bottom id/name: ", jobId, job.jobDefinition.name);
    })
    console.log(OUTER, "returning content...");

    let logLevel: number;
    // {/*// FATAL:100 ERROR:200 WARN:300 INFO:400 DEBUG:500 TRACE:600 ALL:Integer.MAX_VALUE*/}
    let logLevelDefault: number = 1000;
    let logColorDefault: string = "gray.200";
    let logColorInfo: string = "teal.200";
    let logColorWarning: string = "banana";
    let logColorError: string = "tomato";
    return (
        <>
            <Stack spacing={8}>
            <div>entries: {Object.entries(jobs).length}</div>
            <List >{
                Object.entries(jobs).map( ([key, value]) => (
                    <>
                    <p hidden>{ // not sure why the logLevel value shows on screen, but 'p hidden' is a workaround for it
                        logLevel = value.jobActivity ? (
                        value.jobActivity[0].logLevel ? value.jobActivity[0].logLevel : logLevelDefault
                        ) : logLevelDefault}
                    </p>
                     <Flex key={value.jobDefinition.id} p={5} shadow="md" borderWidth="1px">
                <ListItem color="green" key={value.jobDefinition.id}>
                    <Box flex={1} bg={
                        logLevel >= 500 ? ( logColorDefault ): (
                            logLevel >= 400 ? ( logColorInfo ): (
                                logLevel >= 300 ? ( logColorWarning ): (
                                    logLevel >= 200 ? ( logColorError ): (
                                        logColorDefault
                                    )
                                )
                            )
                        )
                    } >
                        <Text>{value.jobDefinition.id}: {value.jobDefinition.name}</Text>
                        <Text>{!value.jobDefinition.runCmd ? null : (value.jobDefinition.runCmd)}</Text>
                        <Text>{!value.jobDefinition.runCmdArgs ? null : (value.jobDefinition.runCmdArgs)}</Text>
                        <Text>{!value.jobActivity ? null : (value.jobActivity[0].logDateTime)}</Text>
                        <Text>{!value.jobActivity ? null : (value.jobActivity[0].result)}</Text>
                    </Box>
                    </ListItem>
                    </Flex>
                    </>
                ))
            }
            </List>
            </Stack>
            </>
    )

}

export default StateHooksFunctionalComponent;
