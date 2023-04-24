import gql from 'graphql-tag';

/* Query broadcasts with a 1 day buffer in case a show crosses into the new day */
export const GetBroadcastsQuery = gql`
  query GetBroadcasts {
    allBroadcastss(sortBy: meta_firstPublicationDate_ASC) {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        node {
          ...broadcast
        }
      }
    }
  }
  `

export const GetBroadcastByTagQuery = gql`
  query GetBroadcastsByTagQuery($id: String!) {
    allBroadcastss(where: {tags: {tag: $id}}) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ...broadcast
        }
      }
    }
  }`

export const GetBroadcastByShowQuery = gql`
query GetBroadcastsByShowQuery($id: String!) {
  allBroadcastss(where: {hostedby: $id}) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...broadcast
      }
    }
  }
}`

export const GetBroadcastByIdQuery = gql`
  query GetBroadcastById($id:String!) {
    allBroadcastss (id:$id) {
      edges {
        node {
          ...broadcast
        }
      }
    }
  }`

export const GetBroadcastQuery = gql`
  query GetBroadcast($uid:String!) {
    allBroadcastss (uid:$uid) {
      edges {
        node {
          ...broadcast
        }
      }
    }
  }`
export const GetFeatureBroadcastQuery = gql`
query GetFeatureBroadcast {
  allFeaturebroadcasts {
    edges {
      node {
        description
      	broadcast {
          ...broadcast
        }
      }
    }
  }
}`

export const GetBroadcastsInRangeQuery = gql`
query GetBroadcastsInRange($endAfter:DateTime!, $beginBefore:DateTime) {
  allBroadcastss(sortBy: begin_ASC, where: { end_after: $endAfter, begin_before: $beginBefore }) {
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
    edges {
      node {
        ...broadcast
      }
    }
  }
}`

export const SearchBroadcastsQuery = gql`
query SearchBroadcastsQuery($q:String!) {
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
        ... broadcast
      }
    }
  }
}`

export const BroadcastFragment = gql`
  fragment broadcast on Broadcasts {
    _meta {
      uid
      id
      firstPublicationDate
    }
    title
    hostedby {
      ... on Shows {
        title
        _meta {
          uid
          id
        }
      }
    }
    description
    begin
    end
    length
    keyword
    image
    audio {
      ... on _FileLink {
        name
        url
        size
        _linkType
      }
    }
    tags {
      ...broadcastTags
    }
  }
  `

export const BroadcastTagsFragement = gql`
fragment broadcastTags on BroadcastsTags {
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
