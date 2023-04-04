import { gql } from "graphql.macro";

export const GetAnnouncement = gql`
query GetAnnouncement {
    allAnnouncements {
      edges {
        node {
          text
          _meta {
            lastPublicationDate
          }
          link {
            _linkType
            ... on _ExternalLink {
              url
              target
            }
            ... on Broadcasts {
              _meta {
                uid
              }
              title
              description
            }
            ... on Shows {
              _meta {
                uid
              }
            }
          }
        }
      }
    }
  }
  
` 