import { gql } from "@apollo/client";

export default queries = {
  CREATE_POST: gql`
    mutation createPost($text: String!, $media_id: ID, $original_post_id: ID) {
      createPost(text: $text, media_id: $media_id, original_post_id: $original_post_id) {
        _id
        time
        text
      }
    }
  `
}