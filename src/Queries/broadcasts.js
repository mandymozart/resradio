import gql from 'graphql-tag';

/* Query broadcasts with a 1 day buffer in case a show crosses into the new day */
/** General Purpose Query */
export const GetBroadcastsQuery = gql`
  query GetBroadcasts (
      $sortBy: SortBroadcastsy, 
      $tags: [String!], 
      $moodId: String, 
      $bpm_range: [Float!],
      $endAfter:DateTime, 
      $beginBefore:DateTime,
      $itemsPerPage: Int,
      $currentCursor: String,
      $q: String,
      $bpm_min: Float,
      $bpm_max: Float,
    ) {
    allBroadcastss( 
        sortBy: $sortBy, 
        tags_in: $tags, 
        fulltext: $q, 
        after: $currentCursor,
        first: $itemsPerPage,
        where: { 
          end_after: $endAfter, 
          begin_before: $beginBefore,
          mood: $moodId, 
          bpm_range: $bpm_range,
          bpm_min_gt: $bpm_min, 
          bpm_max_lt: $bpm_max,
        }) {
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...broadcast
        }
      }
    }
  }
  `

/** refactor with general purpose query */
export const GetBroadcastByShowQuery = gql`
query GetBroadcastsByShowQuery(
  $id: String!,
  $itemsPerPage: Int,
  $currentCursor: String,
  $sortBy: SortBroadcastsy,
  ) {
  allBroadcastss(
    first: $itemsPerPage,
    after: $currentCursor,
    sortBy: $sortBy,
    where: {
      hostedby: $id,
    }) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        ...broadcast
      }
    }
  }
}`

export const GetBroadcastQuery = gql`
  query GetBroadcastQuery($uid:String!) {
  broadcasts(uid:$uid, lang: "en-eu") {
    ...broadcast
  }
}`

export const GetFeatureBroadcastQuery = gql`
query GetFeatureBroadcast {
  allFeaturebroadcasts {
    edges {
      node {
      	broadcast {
          ...broadcast
        }
      }
    }
  }
}`

/** remove soon */
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
    title
    description
    _meta {
      tags
      id
      uid
    }
    begin
    end
    bpm
    bpm_min
    bpm_max
    length
    duration
    image
    audio
    hostedby {
      ... on Shows {
        title
        _meta {
          uid
          id
          tags
        }
        image
      }
    }
    mood {
      ... on Mood {
        _meta {
          id
        }
        name
      }
    }
  }
  `

export const getBroadcastsQuery = gql`
  ${GetBroadcastsQuery}
  ${BroadcastFragment}
`

export const getBroadcastQuery = gql`
${GetBroadcastQuery}
${BroadcastFragment}
`

export const getFeatureBroadcastQuery = gql`
${GetFeatureBroadcastQuery}
${BroadcastFragment}
`

export const getBroadcastsByShowQuery = gql`
${GetBroadcastByShowQuery}
${BroadcastFragment}
`
