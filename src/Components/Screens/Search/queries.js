import { gql } from "@apollo/client";

export default queries = {

  SEARCH: gql`
    query userSearch($query: String!) {
      userSearch(query: $query) {
        id
        username
        name
        surname
      } 
    }
  `
}