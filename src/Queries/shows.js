import gql from "graphql-tag"

export const GetShowsQuery = gql`
query GetShows($currentCursor: String, $q: String, $itemsPerPage: Int,) {
    allShowss(sortBy: meta_firstPublicationDate_DESC, fulltext: $q, after: $currentCursor, first: $itemsPerPage) {
      pageInfo {
        hasPreviousPage
        startCursor
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...showFragment
        }
      }
    }
  }
`

export const SearchShowsQuery = gql`
query SearchShowsQuery($currentCursor: String, $itemsPerPage: Int, $q:String!) {
  allShowss (after: $currentCursor, fulltext: $q, first: $itemsPerPage) {
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    totalCount
    edges {
      cursor
      node {
        ... showFragment
      }
    }
  }
}
`

export const ShowFragment = gql`
fragment showFragment on Shows {
    _meta {
      uid
      id
      tags
      firstPublicationDate
    }
    title
    description
    keyword
    image
  }
`
export const GetShowQuery = gql`
query GetShow($uid: String!) {
  shows (uid:$uid, lang:"en-eu") {
    title
    description
    image
    _meta {
      id
      tags
    }
  }
}
`
