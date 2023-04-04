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

export const GetBroadcastQuery = gql`
  query GetBroadcast($id:String!) {
    allBroadcastss (id:$id) {
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
    }
  }
  `
