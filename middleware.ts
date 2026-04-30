import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublic = ['/', '/login'].includes(pathname)

  if (!req.auth && !isPublic) {
    return Response.redirect(new URL('/login', req.url))
  }
  if (req.auth && pathname === '/login') {
    return Response.redirect(new URL('/feed', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png).*)'],
}
