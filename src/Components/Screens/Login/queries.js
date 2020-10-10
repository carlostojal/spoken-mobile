import { gql } from "@apollo/client";

export default queries = {
  GET_TOKEN: gql`
    query getToken($username: String!, $password: String!, $userPlatform: String) {
      getToken(username: $username, password: $password, userPlatform: $userPlatform) 
    }
  `
}