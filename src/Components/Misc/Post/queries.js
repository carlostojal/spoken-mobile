import { gql } from "@apollo/client";

export default queries = {

  REACT_POST: gql`
    mutation reactPost($id: String!) {
      reactPost(id: $id) {
        id
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
    mutation commentPost($id: String!, $text: String!) {
      commentPost(id: $id, text: $text) {
        id
        time
        poster {
          name
          surname
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
  `,

  PROMOTE_POST: gql`
    mutation promotePost($id: Int!) {
      promotePost(id: $id)
    }
  `
}