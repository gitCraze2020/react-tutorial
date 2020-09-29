import React from 'react';
import { Formik, Form } from 'formik';
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useMutation } from 'urql';

interface jobsProps {  }

const MUT_UPDATE_JOB = `
mutation UpdateJob ($id: Int!, $name: String!) {
  updateJob  (  jobToUpdate: {id: $id, name: $name }) {
    errors {
      field
      message
    }
    job {
      id
      name
    }
  }
}
`;

const Jobs: React.FC<jobsProps> = ({}) => {
    // the first item in the returned array has information about what is going on with
    // the mutation, such as fetching, error, data, operation?
    // we can leave it as an empty object {} or we can just use a comma
    // the second element in the returned array is the name of our function, which you can name whatever
    // so we name it updateOneJob. once named, you can call that in the onSubmit element below
    // and pass in the values for the parameters as defined in the useMutation's graphql syntax
    const [,updateOneJob] = useMutation(MUT_UPDATE_JOB);

    return (
        <Wrapper sizeProfile="small">

        <Formik initialValues={{id: -1, name: "job name here"}}
            // onSubmit={(submitValues) => {
            // changed this to 'async', in coordination with adding 'await' on the hook function call below
            onSubmit={async (submitValues) => {
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
                //
                // this is why we use the graphql-code-generator package.
                // it will create hook functions with properly defined return types
                // that we can use in the forms here
                // see http://graphql-code-generator.com/docs/getting-started/installation
                //
                const response = await updateOneJob(
                    {"id": jobId,
                    "name": submitValues.name}
                );
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
    );
}

export default Jobs;
