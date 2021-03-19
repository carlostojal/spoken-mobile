import { gql } from "@apollo/client";

export default queries = {

  ACCEPT_REQUEST: gql`
    mutation acceptFollowRequest($user_id: Int!){
      acceptFollowRequest(user_id: $user_id) {
        name
        surname
        username
      }
    }
  `,

  IGNORE_REQUEST: gql`
    mutation ignoreFollowRequest($user_id: Int!){
      ignoreFollowRequest(user_id: $user_id) {
        name
        surname
        username
      }
    }
  `
}