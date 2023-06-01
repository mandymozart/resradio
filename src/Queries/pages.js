import gql from 'graphql-tag';

/* Query broadcasts with a 1 day buffer in case a show crosses into the new day */
export const GetPageQuery = gql`
 query GetPageQuery($uid: String!) {
  page (uid:$uid,lang:"en-eu") {
    ... pageFragment
  }
}
`

export const PageFragment = gql`
  fragment pageFragment on Page {
    title
    text
    image
    _meta {
      uid
      id
    }
  }
`

export const getPageQuery = gql`
  ${GetPageQuery}
  ${PageFragment}
`