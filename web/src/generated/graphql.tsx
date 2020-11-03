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
  jobInfos: Array<JobInfo>;
};

export type JobInfo = {
  __typename?: 'JobInfo';
  jobDefinition?: Maybe<JobDefinition>;
  jobActivity?: Maybe<Array<JobActivity>>;
};

export type JobDefinition = {
  __typename?: 'JobDefinition';
  id: Scalars['Float'];
  name: Scalars['String'];
  customJobLabel?: Maybe<Scalars['String']>;
  runCmd?: Maybe<Scalars['String']>;
  runCmdArgs?: Maybe<Scalars['String']>;
  nextJobDefaultId?: Maybe<Scalars['Float']>;
  nextJobErrorDefaultId?: Maybe<Scalars['Float']>;
  nextJobOptions?: Maybe<Scalars['String']>;
};

export type JobActivity = {
  __typename?: 'JobActivity';
  jobIdentifier: JobRunIdentifier;
  logDateTime?: Maybe<Scalars['String']>;
  logLevel?: Maybe<Scalars['Int']>;
  result?: Maybe<Scalars['String']>;
};

export type JobRunIdentifier = {
  __typename?: 'JobRunIdentifier';
  id: Scalars['Float'];
  name: Scalars['String'];
  jobInstanceId?: Maybe<Scalars['Float']>;
  resultSeqNum?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateJob: JobResponse;
};


export type MutationUpdateJobArgs = {
  jobDefinitionInput: JobInput;
};

export type JobResponse = {
  __typename?: 'JobResponse';
  errors?: Maybe<Array<FieldError>>;
  jobInfo?: Maybe<JobInfo>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type JobInput = {
  id: Scalars['Float'];
  name: Scalars['String'];
  customJobLabel?: Maybe<Scalars['String']>;
  runCmd?: Maybe<Scalars['String']>;
  runCmdArgs?: Maybe<Scalars['String']>;
  nextJobDefaultId?: Maybe<Scalars['Float']>;
  nextJobErrorDefaultId?: Maybe<Scalars['Float']>;
  nextJobOptions?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  jobChangeSubscription: JobInfo;
};

export type UpdateJobMutationVariables = Exact<{
  jobDefinition: JobInput;
}>;


export type UpdateJobMutation = (
  { __typename?: 'Mutation' }
  & { updateJob: (
    { __typename?: 'JobResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, jobInfo?: Maybe<(
      { __typename?: 'JobInfo' }
      & { jobDefinition?: Maybe<(
        { __typename?: 'JobDefinition' }
        & Pick<JobDefinition, 'id' | 'name' | 'runCmd' | 'runCmdArgs' | 'customJobLabel' | 'nextJobDefaultId' | 'nextJobErrorDefaultId' | 'nextJobOptions'>
      )>, jobActivity?: Maybe<Array<(
        { __typename?: 'JobActivity' }
        & Pick<JobActivity, 'logDateTime' | 'logLevel' | 'result'>
        & { jobIdentifier: (
          { __typename?: 'JobRunIdentifier' }
          & Pick<JobRunIdentifier, 'id' | 'name' | 'jobInstanceId' | 'resultSeqNum'>
        ) }
      )>> }
    )> }
  ) }
);

export type GetJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetJobsQuery = (
  { __typename?: 'Query' }
  & { jobInfos: Array<(
    { __typename?: 'JobInfo' }
    & { jobDefinition?: Maybe<(
      { __typename?: 'JobDefinition' }
      & Pick<JobDefinition, 'id' | 'name' | 'runCmd' | 'runCmdArgs' | 'customJobLabel' | 'nextJobDefaultId' | 'nextJobErrorDefaultId' | 'nextJobOptions'>
    )>, jobActivity?: Maybe<Array<(
      { __typename?: 'JobActivity' }
      & Pick<JobActivity, 'logDateTime' | 'logLevel' | 'result'>
      & { jobIdentifier: (
        { __typename?: 'JobRunIdentifier' }
        & Pick<JobRunIdentifier, 'id' | 'name' | 'jobInstanceId' | 'resultSeqNum'>
      ) }
    )>> }
  )> }
);

export type GetJobChangesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetJobChangesSubscription = (
  { __typename?: 'Subscription' }
  & { jobChangeSubscription: (
    { __typename?: 'JobInfo' }
    & { jobDefinition?: Maybe<(
      { __typename?: 'JobDefinition' }
      & Pick<JobDefinition, 'id' | 'name' | 'runCmd' | 'runCmdArgs' | 'customJobLabel' | 'nextJobDefaultId' | 'nextJobErrorDefaultId' | 'nextJobOptions'>
    )>, jobActivity?: Maybe<Array<(
      { __typename?: 'JobActivity' }
      & Pick<JobActivity, 'logDateTime' | 'logLevel' | 'result'>
      & { jobIdentifier: (
        { __typename?: 'JobRunIdentifier' }
        & Pick<JobRunIdentifier, 'id' | 'name' | 'jobInstanceId' | 'resultSeqNum'>
      ) }
    )>> }
  ) }
);


export const UpdateJobDocument = gql`
    mutation UpdateJob($jobDefinition: JobInput!) {
  updateJob(jobDefinitionInput: $jobDefinition) {
    errors {
      field
      message
    }
    jobInfo {
      jobDefinition {
        id
        name
        runCmd
        runCmdArgs
        customJobLabel
        nextJobDefaultId
        nextJobErrorDefaultId
        nextJobOptions
      }
      jobActivity {
        jobIdentifier {
          id
          name
          jobInstanceId
          resultSeqNum
        }
        logDateTime
        logLevel
        result
      }
    }
  }
}
    `;

export function useUpdateJobMutation() {
  return Urql.useMutation<UpdateJobMutation, UpdateJobMutationVariables>(UpdateJobDocument);
};
export const GetJobsDocument = gql`
    query getJobs {
  jobInfos {
    jobDefinition {
      id
      name
      runCmd
      runCmdArgs
      customJobLabel
      nextJobDefaultId
      nextJobErrorDefaultId
      nextJobOptions
    }
    jobActivity {
      jobIdentifier {
        id
        name
        jobInstanceId
        resultSeqNum
      }
      logDateTime
      logLevel
      result
    }
  }
}
    `;

export function useGetJobsQuery(options: Omit<Urql.UseQueryArgs<GetJobsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetJobsQuery>({ query: GetJobsDocument, ...options });
};
export const GetJobChangesDocument = gql`
    subscription getJobChanges {
  jobChangeSubscription {
    jobDefinition {
      id
      name
      runCmd
      runCmdArgs
      customJobLabel
      nextJobDefaultId
      nextJobErrorDefaultId
      nextJobOptions
    }
    jobActivity {
      jobIdentifier {
        id
        name
        jobInstanceId
        resultSeqNum
      }
      logDateTime
      logLevel
      result
    }
  }
}
    `;

export function useGetJobChangesSubscription<TData = GetJobChangesSubscription>(options: Omit<Urql.UseSubscriptionArgs<GetJobChangesSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<GetJobChangesSubscription, TData>) {
  return Urql.useSubscription<GetJobChangesSubscription, TData, GetJobChangesSubscriptionVariables>({ query: GetJobChangesDocument, ...options }, handler);
};