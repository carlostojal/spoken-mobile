import { gql } from "@apollo/client";

export default queries = {
    
  GET_PROFILE: gql`
    query getProfile($user_id: ID) {
      getUserData(id: $user_id) {
        _id
        name
        surname
        birthdate
        username
        is_followed
        is_himself
      }
    }
  `,

  GET_USER_POSTS: gql`
    query getUserPosts($user_id: ID) {
      getUserPosts(user_id: $user_id) {
        _id
        time
        poster {
          _id
          name
          surname
          username
        }
        media {
          _id
          is_nsfw
          url
        }
        text
        reactions {
          _id
        }
      }
    }
  `,

  FOLLOW: gql`
    mutation follow($user_id: ID!) {
      followUser(id: $user_id) {
        _id
      }
    }
  `
}