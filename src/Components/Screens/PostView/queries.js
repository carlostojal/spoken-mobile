import { gql } from "@apollo/client";

export default queries = {

  GET_COMMENTS: gql`
    query getPostComments($id: ID!) {
      getPostComments(id: $id) {
        _id
        poster {
          _id
          username
          name
          surname
          profile_pic {
            _id
          }
        }
        time
        media {
          _id
          type
        }
        text
      }
    }
  `
}