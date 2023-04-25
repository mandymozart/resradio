import gql from "graphql-tag"

export const GetShowsQuery = gql`
query GetShows($cursor: String, $itemsPerPage: Int = 100) {
    allShowss(sortBy: meta_firstPublicationDate_DESC, after: $cursor, first: $itemsPerPage) {
      pageInfo {
        hasPreviousPage
        startCursor
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        node {
          ...showFragment
        }
      }
    }
  }
`

export const SearchShowsQuery = gql`
query SearchShowsQuery($q:String!) {
  allShowss (fulltext: $q, first: 100) {
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