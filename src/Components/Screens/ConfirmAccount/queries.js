import { gql } from "@apollo/client";

export default queries = {
  CONFIRM_ACCOUNT: gql`
    mutation confirmAccount($username: String!, $code: Int!) {
      confirmAccount(username: $username, code: $code) {
        _id
        username
      }
    }
  `,
  RESEND_EMAIL: gql`
    query sendConfirmationEmail($username: String!, $password: String!) {
      sendConfirmationEmail(username: $username, password: $password)
    }
  `
}