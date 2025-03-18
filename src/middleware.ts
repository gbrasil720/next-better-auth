import type { Session } from '@/lib/auth'
import { betterFetch } from '@better-fetch/fetch'
import { type NextRequest, NextResponse } from 'next/server'

const authRoutes = ['/sign-in', '/sign-up']
const authenticatedRoutes = ['/dashboard']
const adminRoutes = ['/dashboard/admin']

export default async function authMiddleware(req: NextRequest) {
	const pathName = req.nextUrl.pathname
	const isAuthRoute = authRoutes.includes(pathName)
	const isAuthenticatedRoute = authenticatedRoutes.includes(pathName)
	const isAdminRoute = adminRoutes.includes(pathName)

	const { data: session } = await betterFetch<Session>(
		'/api/auth/get-session',
		{
			baseURL: process.env.BETTER_AUTH_URL,
			headers: {
				cookie: req.headers.get('cookie') || '',
			},
		}
	)

	if (!session) {
		if (isAuthRoute) {
			return NextResponse.next()
		}

		return NextResponse.redirect(new URL('/sign-in', req.url))
	}

	const role = session.user.role

	if (!session && isAuthenticatedRoute) {
		return NextResponse.redirect(new URL('/sign-in', req.url))
	}

	if (session && role === 'admin' && isAuthenticatedRoute) {
		return NextResponse.redirect(new URL('/dashboard/admin', req.url))
	}

	if (session && role !== 'admin' && isAuthRoute) {
		return NextResponse.redirect(new URL('/dashboard', req.url))
	}

	if (session && role === 'admin' && isAuthRoute) {
		return NextResponse.redirect(new URL('/dashboard/admin', req.url))
	}

	if (session && role === 'admin' && isAdminRoute) {
		return NextResponse.next()
	}

	if (session && role !== 'admin' && isAdminRoute) {
		return NextResponse.redirect(new URL('/dashboard', req.url))
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
