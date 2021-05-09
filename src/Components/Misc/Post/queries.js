import { gql } from "@apollo/client";

export default queries = {

  REACT_POST: gql`
    mutation reactPost($id: ID!) {
      reactPost(id: $id) {
        _id
        time
        poster {
          name
          surname
          username
        }
        text
        user_reacted
      }
    }
  `,

  COMMENT_POST: gql`
    mutation commentPost($id: ID!, $text: String!) {
      commentPost(id: $id, text: $text) {
        _id
        time
        poster {
          name
          surname
          username
        }
        text
      }
    }
  `,

  PROMOTE_POST: gql`
    mutation promotePost($id: ID!) {
      promotePost(id: $id)
    }
  `
}