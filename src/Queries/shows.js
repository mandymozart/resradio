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

export const ShowFragment = gql`
fragment showFragment on Shows {
    _meta {
      uid
      id
      firstPublicationDate
    }
    title
    description
    keyword
    image
    tags {
      ...showTagsFragment
    }
  }
`

export const ShowTagsFragment = gql`
fragment showTagsFragment on ShowsTags {
    tag {
      _linkType
      ... on Tag {
        name
        _meta {
          id
        }
        category {
          ... on Category {
            name
            _meta {
              id
            }
          }
        }
      }
    }
  }
`
export const GetShowQuery = gql`

  query GetShow($uid: String!) {
    allShowss(uid:$uid) {
      edges {
        node {
          ...showFragment
        }
      }
    }
  }
  
  fragment showFragment on Shows {
    _meta {
      uid
      id
      firstPublicationDate
    }
    title
    description
    keyword
    image
    tags {
      ...showTagsFragment
    }
  }
  
  fragment showTagsFragment on Tag {
    name
    category {
      ... on Category {
        name
      }
    }
  }
  `