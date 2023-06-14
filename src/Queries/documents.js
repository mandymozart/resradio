import gql from "graphql-tag"
import { BroadcastFragment } from "./broadcasts"
import { PageFragment } from "./pages"
import { ShowFragment } from "./shows"

export const SearchDocumentsQuery = gql`
query SearchDocumentsQuery($q:String!) {
  _allDocuments (fulltext: $q, first: 100) {
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    totalCount
    edges {
      node {
        ... showFragment
        ... broadcast
        ... pageFragment
      }
    }
  }
}
`


export const searchShowsQuery = gql`
  ${SearchDocumentsQuery}
  ${ShowFragment}
  ${BroadcastFragment}
  ${PageFragment}
`