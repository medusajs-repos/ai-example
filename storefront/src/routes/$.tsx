import { createFileRoute } from '@tanstack/react-router'
import RegionRedirect from '@/components/common/region-redirect';

export const Route = createFileRoute("/$")({
  component: () => <RegionRedirect isChecking404={true} />,
})
