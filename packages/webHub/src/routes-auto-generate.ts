// Auto Generated by '@stargram/generate-routes'
import type { Routes } from '@stargram/core'
import { router as common } from './website/common/router'
import { pathInfo as commonAny } from './website/common/paths/any'
import { router as githubcom } from './website/github.com/router'
import { pathInfo as githubcomRepo } from './website/github.com/paths/repo'
import { router as twittercom } from './website/twitter.com/router'
import { pathInfo as twittercomTweet } from './website/twitter.com/paths/tweet'

common.paths = [
  commonAny,
].sort((a, b) => (b.sequence ?? 0) - (a.sequence ?? 0))
githubcom.paths = [
  githubcomRepo,
].sort((a, b) => (b.sequence ?? 0) - (a.sequence ?? 0))
twittercom.paths = [
  twittercomTweet,
].sort((a, b) => (b.sequence ?? 0) - (a.sequence ?? 0))

export const routes: Routes = {
  'common': common,
  'github.com': githubcom,
  'twitter.com': twittercom,
}
