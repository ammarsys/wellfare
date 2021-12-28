import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    resetPassword(email: String!): User
  }
`;
