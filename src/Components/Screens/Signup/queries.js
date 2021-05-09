import { gql } from "@apollo/client";

export default queries = {

  REGISTER_USER: gql`
    mutation registerUser($username: String!, $password: String!, $name: String!, $surname: String!, $birthdate: String!, $email: String!, $profile_type: ProfileType!, $profile_privacy_type: ProfilePrivacyType!){
      registerUser(username: $username, password: $password, name: $name, surname: $surname, birthdate: $birthdate, email: $email, profile_type: $profile_type, profile_privacy_type: $profile_privacy_type) {
        _id
        name
        username
      }
    }
  `
}