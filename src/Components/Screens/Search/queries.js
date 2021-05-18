import { gql } from "@apollo/client";

export default queries = {

  SEARCH: gql`
    query userSearch($query: String!) {
      userSearch(query: $query) {
        _id
        username
        name
        surname
      } 
    }
  `,

  NEARBY_USERS: gql`
    query getNearbyUsers($current_lat: Float!, $current_long: Float!, $max_distance: Int!) {
      getNearbyUsers(current_lat: $current_lat, current_long: $current_long, max_distance: $max_distance) {
        _id
        username
        name
        surname
        profile_pic {
          _id
        }
      }
    }
  `
}