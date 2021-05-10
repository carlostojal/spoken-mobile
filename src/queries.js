import { gql } from "@apollo/client";

export default queries = {

  REFRESH_TOKEN: gql`
    query refreshToken($user_lat: Float, $user_long: Float) {
      refreshToken(user_lat: $user_lat, user_long: $user_long)
    }
  `
}