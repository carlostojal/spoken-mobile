import { gql } from "@apollo/client";

export default queries = {
  
  PROMOTE_POST: gql`
    mutation promotePost($id: Int!) {
      promotePost(id: $id)
    }
  `
}