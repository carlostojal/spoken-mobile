import { gql } from "@apollo/client";

export default queries = {

  GET_MEDIA: gql`
    query getUserMedia($user_id: ID!) {
      getUserMedia(user_id: $user_id) {
          _id
          type
      }
    }
  `,

  SET_PUSH_TOKEN: gql`
    mutation setPushToken($token: String!) {
      setExpoPushToken(token: $token)
    }
  `
}