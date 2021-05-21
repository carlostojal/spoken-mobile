import { gql } from "@apollo/client";

export default queries = {
  GET_ANALYTICS: gql`
		query getPostAnalytics($id: ID!, $type: AnalyticsType!)
		{
			getPostAnalytics(id: $id, type: $type) {
				labels
				values
			}
		}
  `
}