import gql from "graphql-tag"

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