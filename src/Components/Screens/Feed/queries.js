import { gql } from "@apollo/client";

export default queries = {
  GET_FEED: gql`
    query getUserFeed($page: Int!, $perPage: Int!) {
      getUserFeed(page: $page, perPage: $perPage) {
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

  GET_TOKEN: gql`
    query getToken($username: String!, $password: String!) {
      getToken(username: $username, password: $password) 
    }
  `
}