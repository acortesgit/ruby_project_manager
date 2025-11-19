import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String) {
    createProject(name: $name, description: $description) {
      project {
        id
        name
        description
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $name: String, $description: String) {
    updateProject(id: $id, name: $name, description: $description) {
      project {
        id
        name
        description
        updatedAt
      }
      errors
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
      errors
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($projectId: ID!, $title: String!, $description: String, $assigneeId: ID) {
    createTask(projectId: $projectId, title: $title, description: $description, assigneeId: $assigneeId) {
      task {
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
          fullName
        }
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $description: String, $status: StatusEnum, $assigneeId: ID) {
    updateTask(id: $id, title: $title, description: $description, status: $status, assigneeId: $assigneeId) {
      task {
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
          fullName
        }
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: StatusEnum!) {
    updateTaskStatus(id: $id, status: $status) {
      task {
        id
        title
        status
        updatedAt
      }
      errors
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      errors
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($fullName: String!, $email: String!, $userType: Int) {
    createUser(fullName: $fullName, email: $email, userType: $userType) {
      user {
        id
        fullName
        email
        userType
        createdAt
      }
      errors
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $fullName: String, $email: String, $userType: Int) {
    updateUser(id: $id, fullName: $fullName, email: $email, userType: $userType) {
      user {
        id
        fullName
        email
        userType
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      errors
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      notification {
        id
        read
      }
      errors
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      success
      count
      errors
    }
  }
`;

