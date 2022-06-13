import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    unsubscribe(encodedEmail: String!): Email
  }
`;
