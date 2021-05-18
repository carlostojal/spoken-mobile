import { gql } from "@apollo/client";

export default queries = {
    
  GET_PROFILE: gql`
    query getProfile($user_id: ID) {
      getUserData(id: $user_id) {
        _id
        name
        surname
        username
        profile_pic {
          _id
        }
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
          profile_pic {
            _id
          }
        }
        media {
          _id
          is_nsfw
          type
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