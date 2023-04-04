import gql from "graphql-tag"

export const GetShowsQuery = gql`
query GetShows($cursor: String, $itemsPerPage: Int = 100, $tag: String) {
    allShowss(sortBy: meta_firstPublicationDate_DESC, after: $cursor, first: $itemsPerPage, where: {tags: $tag}) {
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