import { gql } from "@apollo/client";

export default queries = {
  GET_FOLLOW_REQUEST: gql`
    query getFollowRequests {
      getFollowRequests {
        user {
          _id
          username
          name
          surname
        }
      }
    }
  `
}