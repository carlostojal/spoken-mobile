import { gql } from "@apollo/client";

export default queries = {

  GET_TOKEN: gql`
    query getToken($username: String!, $password: String!, $userPlatform: String, $pushToken: String) {
      getToken(username: $username, password: $password, userPlatform: $userPlatform, pushToken: $pushToken) 
    }
  `,

  SET_PUSH_TOKEN: gql`
    mutation setPushToken($token: String!) {
      setExpoPushToken(token: $token)
    }
  `
}