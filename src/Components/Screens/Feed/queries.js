import { gql } from "@apollo/client";

export default queries = {
  GET_FEED: gql`
    query getUserFeed {
      getUserFeed {
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
        }
        original_post {
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
          text
        }
        text
        reactions {
          _id
          username
          name
          surname
        }
        edited
      }
    }
  `,

  GET_TOKEN: gql`
    query getToken($username: String!, $password: String!) {
      getToken(username: $username, password: $password) 
    }
  `,

  GET_USER_DATA: gql`
    query getUserData {
      getUserData {
        _id
        name
        profile_pic {
          _id
        }
      }
    }
  `
}