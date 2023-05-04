import type { Routes } from '../types'
import github from './github.com/router'
import twitter from './twitter.com/router'

const routes: Routes = {
  'github.com': github,
  'twitter.com': twitter,
}

export default routes
