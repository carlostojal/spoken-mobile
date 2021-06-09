import { gql } from "@apollo/client";

export default queries = {

  GET_TOKEN: gql`
    query getToken($username: String!, $password: String!, $userPlatform: String, $pushToken: String, $user_lat: Float, $user_long: Float) {
      getToken(username: $username, password: $password, userPlatform: $userPlatform, pushToken: $pushToken, user_lat: $user_lat, user_long: $user_long) {
        access
        refresh
      }
    }
  `,

  SET_PUSH_TOKEN: gql`
    mutation setPushToken($token: String!) {
      setExpoPushToken(token: $token)
    }
  `
}