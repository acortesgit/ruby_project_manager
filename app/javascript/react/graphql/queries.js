import { gql } from "@apollo/client";

export const PROJECTS_QUERY = gql`
  query Projects {
    projects {
      id
      name
      description
      createdAt
      updatedAt
      tasks {
        id
        title
        status
        createdAt
      }
    }
  }
`;

export const PROJECT_QUERY = gql`
  query Project($id: ID!) {
    project(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
      tasks {
        id
        title
        description
        status
        assignee {
          id
          email
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const TASKS_QUERY = gql`
  query Tasks($projectId: ID, $status: StatusEnum, $assigneeId: ID) {
    tasks(projectId: $projectId, status: $status, assigneeId: $assigneeId) {
      id
      title
      description
      status
      project {
        id
        name
      }
      assignee {
        id
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const TASK_QUERY = gql`
  query Task($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      project {
        id
        name
      }
      assignee {
        id
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const ACTIVITIES_QUERY = gql`
  query Activities($recordType: String, $recordId: ID) {
    activities(recordType: $recordType, recordId: $recordId) {
      id
      action
      user {
        id
        email
      }
      metadata
      createdAt
      recordType
      recordId
    }
  }
`;

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      email
    }
  }
`;

