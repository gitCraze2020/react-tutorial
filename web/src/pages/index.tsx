import {useGetJobsQuery} from "../generated/graphql";
import {withUrqlClient} from "next-urql";
import createUrqlClient from "../utils/createUrqlClient";
import React from "react";
import {type} from "os";
// import 'antd/dist/antd.css';

const Index = () => {
// return (<div>test</div>
    const getJobsResult = useGetJobsQuery();
    console.log("getJobsResult: ", getJobsResult);
    console.log("typeof getJobsResult: ", typeof getJobsResult);
    const [{ data }] = useGetJobsQuery();
    console.log("typeOf data: ", typeof data);
    console.log("typeOf data.jobs: ", typeof data?.jobs);
    console.log("data: ", data);
    return (
        <>
            {/*<div>this page is ssr: {isServer() ? "true" : "false"}</div>*/}
        { !data ? (
            <div>Loading...</div>
            ) : (
            data.jobs.map((j) =>
            <div key = {j.id}>{j.id} : {j.name}</div>
            )
        )}
        </>
    );
};

export default withUrqlClient(createUrqlClient, {ssr: true}) (Index);

