// /sanity.config.js (.ts)
// TODO: This file isn't working somehow
// when trying to deploy with a v3 configuration file the cli says that
// the current directory is not a sanity project
import { defineConfig, definePlugin } from 'sanity'
import { schemaTypes } from './schemas'

const sharedConfig = definePlugin({
  name: 'shareConfig',
  tools: deskTool(),
  schema: {
    types: schemaTypes
  }
})

export default defineConfig([
  {
    name: 'default',
    title: 'Production',
    projectId: 'ws9efkpq',
    dataset: 'production',
    // the base path is required whenever more than one workspace is defined and is used for route matching
    basePath: '/prod',
    plugins: [sharedConfig()],
  },
  {
    name: 'stage',
    title: 'Stage',
    projectId: 'ws9efkpq',
    dataset: 'stage',
    basePath: '/stage',
    plugins: [sharedConfig()],
  },
])