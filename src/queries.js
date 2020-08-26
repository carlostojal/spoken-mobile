import { gql } from "@apollo/client";

export default queries = {

  REFRESH_TOKEN: gql`
    query refreshToken {
      refreshToken
    }
  `
}