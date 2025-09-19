import { createFileRoute } from '@tanstack/react-router'
import RegionRedirect from '../components/region-redirect'

export const Route = createFileRoute('/store')({
  component: () => <RegionRedirect />,
})
