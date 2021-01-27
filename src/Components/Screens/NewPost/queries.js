import { gql } from "@apollo/client";

export default queries = {
  CREATE_POST: gql`
    mutation createPost($text: String!, $media_id: Int) {
      createPost(text: $text, media_id: $media_id) {
        id
        time
        text
      }
    }
  `
}