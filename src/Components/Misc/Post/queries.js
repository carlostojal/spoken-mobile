import { gql } from "@apollo/client";

export default queries = {

  REACT_POST: gql`
    mutation reactPost($id: String!) {
      reactPost(id: $id) {
        id
        time
        poster {
          username
        }
        text
      }
    }
  `,

  COMMENT_POST: gql`
    mutation commentPost($id: String!, $text: String!) {
      commentPost(id: $id, text: $text) {
        id
        time
        poster {
          username
        }
        text
        media_url
        user_reacted
        comments {
          id
          user {
            id
            username
          }
          time
          text
        }
      }
    }
  `
}