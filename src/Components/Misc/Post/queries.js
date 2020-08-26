import { gql } from "@apollo/client";

export default queries = {
  REACT_POST: gql`
    mutation reactPost($id: String!) {
      reactPost(id: $id) {
        id
        user_reacted
      }
    }
  `
}