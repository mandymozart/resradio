import gql from 'graphql-tag';
import { BroadcastFragment } from './broadcasts';

/* Query broadcasts with a 1 day buffer in case a show crosses into the new day */
export const GetPlaylistsQuery = gql`
  query GetPlaylists {
    allPlaylists {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        node {
          ...playlistBrief
        }
      }
    }
  }
  `

export const GetPlaylistQuery = gql`
query GetPlaylist($uid:String!) {
  allPlaylists(uid:$uid) {
    edges {
      node {
        ...playlist
      }
    }
  }
}
`


export const PlaylistBriefFragment = gql`
  fragment playlistBrief on Playlist {
    _meta {
      uid
      id
      firstPublicationDate
    }
    title
    user
    description
    tags {
      ...playlistTags
    }
  }
  `

export const PlaylistFragment = gql`
  fragment playlist on Playlist {
    _meta {
      uid
      id
      firstPublicationDate
    }
    title
    user
    description
    tags {
      ...playlistTags
    }
    broadcasts {
      broadcast {
        ...broadcast
      }
    }
  }
  `

export const PlaylistTagsFragement = gql`
  fragment playlistTags on PlaylistTags {
    tag {
      _linkType
    }
  }
  `
export const getPlaylistQuery = gql`
${GetPlaylistQuery}
${PlaylistFragment}
${BroadcastFragment}
${PlaylistTagsFragement}
`
