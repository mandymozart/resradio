import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import * as prismic from '@prismicio/client'

// Fill in your repository name
export const repositoryName = 'resradio'
export const endpoint = prismic.getEndpoint(repositoryName)

export const prismicClient = prismic.createClient(endpoint, {
  // If your repo is private, add an access token
  accessToken: 'MC5ZZVd6RkJFQUFDd0E0cml0.77-9SGDvv70hce-_vVvvv70iPe-_ve-_vS3vv71wKU8EAEp6LO-_ve-_vQZwAQ8277-977-9',

  // This defines how you will structure URL paths in your project.
  // Update the types to match the Custom Types in your project, and edit
  // the paths to match the routing in your project.
  //
  // If you are not using a router in your project, you can change this
  // to an empty array or remove the option entirely.
  routes: [
    {
      type: 'shows',
      path: '/show/:uid',
    },
    {
      type: 'events',
      path: '/event/:uid',
    },
    {
      type: 'broadcasts',
      path: '/broadcast/:uid',
    },
    {
      type: 'page',
      path: '/page/:uid',
    },
    {
      type: 'playlist',
      path: '/studio/playlist/:uid',
    },
  ],
})

// Create a persistent cache for Apollo Client
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        allBroadcastss: {
          // Properly merge data in the cache
          keyArgs: ["endAfter", "beginBefore", "sortBy"],
          merge(existing = { edges: [] }, incoming) {
            // If exact same query, replace data
            if (existing.__typename === incoming.__typename) {
              return incoming;
            }
            // Otherwise merge the data
            return {
              ...incoming,
              edges: [...existing.edges, ...incoming.edges],
            };
          },
        },
        allShowss: {
          keyArgs: ["endAfter", "beginBefore", "sortBy"],
          merge(existing = { edges: [] }, incoming) {
            if (existing.__typename === incoming.__typename) {
              return incoming;
            }
            return {
              ...incoming,
              edges: [...existing.edges, ...incoming.edges],
            };
          },
        },
        allFeaturebroadcasts: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: new HttpLink({
    uri: prismic.getGraphQLEndpoint(repositoryName),
    fetch: prismicClient.graphqlFetch,
    useGETForQueries: true,
  }),
  cache,
  defaultOptions: {
    watchQuery: {
      // First use cache but fetch in background for future renders
      fetchPolicy: 'cache-and-network',
      // On subsequent renders of the same query, only use cache
      nextFetchPolicy: 'cache-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
  connectToDevTools: process.env.NODE_ENV === 'development',
})
