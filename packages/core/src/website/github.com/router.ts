import type { Router } from '../../types'
import repo from './paths/repo'

const router: Router = {
  name: 'Github',
  category: 'Code',
  author: 'StarNexus',
  paths: [
    repo,
  ],
}

export default router
