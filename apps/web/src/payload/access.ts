import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => Boolean(user)

export const anyone: Access = () => true

export const publishedOrAdmin: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: { equals: 'published' },
  }
}

export const activeOrAdmin: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    is_active: { equals: true },
  }
}
