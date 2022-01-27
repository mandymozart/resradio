import * as prismic from '@prismicio/client'

// Fill in your repository name
export const repositoryName = 'resradio'
export const endpoint = prismic.getEndpoint(repositoryName)

export const client = prismic.createClient(endpoint, {
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
  ],
})