import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/attendance/')({
  beforeLoad: () => {
    throw redirect({
      to: '/attendance/logs/all'
    })
  },
})
