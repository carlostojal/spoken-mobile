import { gql } from "@apollo/client";

export default queries = {
    
  GET_PROFILE: gql`
    query getProfile($user_id: String) {
      getUserData(id: $user_id) {
        id
        name
        surname
        birthdate
        email
        username
        is_followed
        is_himself
      }
    }
  `,

  GET_USER_POSTS: gql`
    query getUserPosts($page: Int!, $perPage: Int!, $user_id: String) {
      getUserPosts(page: $page, perPage: $perPage, user_id: $user_id) {
        id
        time
        poster {
          id
          name
          surname
          username
        }
        text
        user_reacted
        edited
      }
    }
  `,

  FOLLOW: gql`
    mutation follow($user_id: String!) {
      followUser(id: $user_id) {
        id
      }
    }
  `
}