import { gql } from "@apollo/client";

export default queries = {

  REACT_POST: gql`
    mutation reactPost($id: ID!, $user_lat: Float, $user_long: Float, $user_platform: String, $user_os: String) {
      reactPost(id: $id, user_lat: $user_lat, user_long: $user_long, user_platform: $user_platform, user_os: $user_os) {
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
  `,

  DELETE_POST: gql`
    mutation deletePost($id: ID!) {
      deletePost(id: $id) {
        _id
      }
    }
  `,

  COLLECT_VIEW: gql`
    mutation collectPostView($id: ID!, $user_lat: Float, $user_long: Float, $user_platform: String, $user_os: String, $view_time: Float) {
      collectPostView(id: $id, user_lat: $user_lat, user_long: $user_long, user_platform: $user_platform, user_os: $user_os, view_time: $view_time) {
        _id
      }
    }
  `
}