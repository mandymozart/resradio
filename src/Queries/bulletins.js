import gql from 'graphql-tag';

export const GetBulletinsQuery = gql`
query GetBulletinsQuery {
    allBulletins {
      edges {
        node {
          _meta {
            id
          }
          title
          link {
            ... on _ExternalLink {
              url
              target
            }
          }
          image
        }
      }
    }
  }`