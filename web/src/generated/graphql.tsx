import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  jobs: Array<Job>;
  ctxBody: Job;
};

export type Job = {
  __typename?: 'Job';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateJobName: JobResponse;
  updateJob: JobResponse;
};


export type MutationUpdateJobNameArgs = {
  name: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationUpdateJobArgs = {
  jobToUpdate: JobInput;
};

export type JobResponse = {
  __typename?: 'JobResponse';
  errors?: Maybe<Array<FieldError>>;
  job?: Maybe<Job>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type JobInput = {
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  jobChangeSubscription: Job;
};

export type UpdateJobMutationVariables = Exact<{
  id: Scalars['Int'];
  name: Scalars['String'];
}>;


export type UpdateJobMutation = (
  { __typename?: 'Mutation' }
  & { updateJob: (
    { __typename?: 'JobResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, job?: Maybe<(
      { __typename?: 'Job' }
      & Pick<Job, 'id' | 'name'>
    )> }
  ) }
);

export type GetJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetJobsQuery = (
  { __typename?: 'Query' }
  & { jobs: Array<(
    { __typename?: 'Job' }
    & Pick<Job, 'id' | 'name'>
  )> }
);

export type GetJobChangesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetJobChangesSubscription = (
  { __typename?: 'Subscription' }
  & { jobChangeSubscription: (
    { __typename?: 'Job' }
    & Pick<Job, 'id' | 'name'>
  ) }
);


export const UpdateJobDocument = gql`
    mutation UpdateJob($id: Int!, $name: String!) {
  updateJob(jobToUpdate: {id: $id, name: $name}) {
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

export function useUpdateJobMutation() {
  return Urql.useMutation<UpdateJobMutation, UpdateJobMutationVariables>(UpdateJobDocument);
};
export const GetJobsDocument = gql`
    query getJobs {
  jobs {
    id
    name
  }
}
    `;

export function useGetJobsQuery(options: Omit<Urql.UseQueryArgs<GetJobsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetJobsQuery>({ query: GetJobsDocument, ...options });
};
export const GetJobChangesDocument = gql`
    subscription getJobChanges {
  jobChangeSubscription {
    id
    name
  }
}
    `;

export function useGetJobChangesSubscription<TData = GetJobChangesSubscription>(options: Omit<Urql.UseSubscriptionArgs<GetJobChangesSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<GetJobChangesSubscription, TData>) {
  return Urql.useSubscription<GetJobChangesSubscription, TData, GetJobChangesSubscriptionVariables>({ query: GetJobChangesDocument, ...options }, handler);
};