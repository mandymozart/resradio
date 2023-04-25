
import gql from "graphql-tag"

export const GetMoodsQuery = gql`
query GetMoods {
    allMoods {
      edges {
       node {
        name
        description
        _meta {
          id
          uid
        }
      } 
      }
    }
  }
  `