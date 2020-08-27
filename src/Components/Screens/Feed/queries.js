import { gql } from "@apollo/client";

export default queries = {
  GET_FEED: gql`
    query getUserFeed($page: Int!, $perPage: Int!) {
      getUserFeed(page: $page, perPage: $perPage) {
        id
        time
        poster {
          username
        }
        text
        media_url
        user_reacted
        comments {
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

  GET_TOKEN: gql`
    query getToken($username: String!, $password: String!) {
      getToken(username: $username, password: $password) 
    }
  `
}