import type { Router } from '../../types'
import tweet from './paths/tweet'

const router: Router = {
  name: 'Twitter',
  category: 'Social Media',
  author: 'StarNexus',
  paths: [tweet],
}

export default router
