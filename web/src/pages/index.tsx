import {useGetJobsQuery} from "../generated/graphql";
import {withUrqlClient} from "next-urql";
import createUrqlClient from "../utils/createUrqlClient";
import React from "react";

const Index = () => {
// return (<div>test</div>
    const [{ data }] = useGetJobsQuery();
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

