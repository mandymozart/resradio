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
      $first: Int,
      $q: String,
    ) {
    allBroadcastss( 
        sortBy: $sortBy, 
        tags_in: $tags, 
        fulltext: $q, 
        first: $first,
        where: { 
          end_after: $endAfter, 
          begin_before: $beginBefore,
          mood: $moodId, 
          bpm_range: $bpm_range
        }) {
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
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

/** refactor with general purpose query */
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

/** refactor to return only single  */
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

/** remove soon */
export const GetBroadcastsByTagsMoodBPM = gql`
query GetBroadcastsByTagsMoodBPM($tags: [String!], $moodId: String, $bpm_range: [Float!]) {
  allBroadcastss(tags_in: $tags, where: {mood: $moodId, bpm_range: $bpm_range}) {
    edges {
      node {
        title
        _meta {
          tags
          uid
          id
        }
      }
    }
  }
}

`


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
      id
      uid
    }
    begin
    end
    bpm
    length
    image
    audio {
      ... on _FileLink {
        name
        url
        size
      }
    }
    hostedby {
      ... on Shows {
        title
        _meta {
          id
          uid
        }
      }
    }
    tags {
      ...broadcastTags
    }
  }
  `

export const BroadcastTagsFragment = gql`
fragment broadcastTags on BroadcastsTags {
  tag {
    _linkType
    ... on Tag {
      name
      _meta {
        id
        uid
      }
      category {
        ... on Category {
          name
          _meta {
            id
            uid
          }
        }
      }
    }
  }
}

  `

export const getBroadcastsQuery = gql`
  ${GetBroadcastsQuery}
  ${BroadcastFragment}
  ${BroadcastTagsFragment}
`