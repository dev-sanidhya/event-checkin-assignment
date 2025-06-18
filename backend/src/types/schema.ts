import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    events: [Event!]!
    createdAt: String!
    updatedAt: String!
  }

  type Event {
    id: ID!
    name: String!
    location: String!
    startTime: String!
    attendees: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    events: [Event!]!
    me: User
    event(id: ID!): Event
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    joinEvent(eventId: ID!): Event!
    leaveEvent(eventId: ID!): Event!
  }

  type Subscription {
    eventUpdated(eventId: ID!): Event!
  }
`;

