import { gql } from "@apollo/client";

export default queries = {

  ACCEPT_REQUEST: gql`
    mutation acceptFollowRequest($user_id: ID!){
      acceptFollowRequest(user_id: $user_id) {
        _id
      }
    }
  `,

  IGNORE_REQUEST: gql`
    mutation ignoreFollowRequest($user_id: ID!){
      ignoreFollowRequest(user_id: $user_id) {
        _id
      }
    }
  `
}