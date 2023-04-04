import gql from 'graphql-tag';

export const GetLandingPageQuery = gql`
query GetLandingPage {
  allLandingpages {
    edges {
      node {
        welcome_message
        _meta {
          lastPublicationDate
        }
        
        body {
          ... on LandingpageBodyFeatured_brodcasts {
            fields {
              ... on LandingpageBodyFeatured_brodcastsFields {
                broadcast {
                  ... on Broadcasts {
                    _meta {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`
