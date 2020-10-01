import {useGetJobsQuery} from "../generated/graphql";

const Index = () => {
    const [{ data }] = useGetJobsQuery();
    return (
        <>
        { !data ? (
            <div>no data</div>
            ) : (
            data.jobs.map((j) =>
            <div key = {j.id}>{j.name}</div>
            )
        )}
        </>
    );
};

export default Index
