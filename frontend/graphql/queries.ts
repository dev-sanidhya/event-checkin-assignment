import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      name
      location
      startTime
      attendees {
        id
        name
        email
      }
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      location
      startTime
      attendees {
        id
        name
        email
      }
    }
  }
`;

export const JOIN_EVENT_MUTATION = gql`
  mutation JoinEvent($eventId: ID!) {
    joinEvent(eventId: $eventId) {
      id
      name
      location
      startTime
      attendees {
        id
        name
        email
      }
    }
  }
`;

export const LEAVE_EVENT_MUTATION = gql`
  mutation LeaveEvent($eventId: ID!) {
    leaveEvent(eventId: $eventId) {
      id
      name
      location
      startTime
      attendees {
        id
        name
        email
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`;

