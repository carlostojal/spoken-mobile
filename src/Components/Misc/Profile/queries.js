import { gql } from "@apollo/client";

export default queries = {
    
  GET_PROFILE: gql`
    query getProfile($user_id: String) {
      getUserData(id: $user_id) {
        id
        name
        surname
        birthdate
        email
        username
      }
    }
  `
}