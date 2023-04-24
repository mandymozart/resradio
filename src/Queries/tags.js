

import gql from 'graphql-tag';

export const GetTagsQuery = gql`
query GetTags($categoryId: String!) {
    allTags(where: {category: $categoryId}) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ... on Tag {
            _meta {
              id
            }
            name
            description
            category {
              ... on Category {
                _meta {
                  id
                }
                name
              }
            }
          }
        }
      }
    }
  }  
  `

export const GetCategorysQuery = gql`
  query GetCategorys {
    allCategorys {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ... on Category {
            _meta {
              id
            }
            name
          }
        }
      }
    }
  }`