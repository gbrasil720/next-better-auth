'use client'

import { authClient } from '@/lib/auth-client'
import { LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import SignOutButton from './sign-out-button'
import { AvatarDropdown } from './avatar-dropdown'

export function AuthButtons() {
	const { data, isPending } = authClient.useSession()
	if (isPending) return <LoaderCircle size={16} className="animate-spin" />

	const session = data

	return !session ? (
		<div className="flex gap-2 justify-center">
			<Link href="/sign-in">
				<Button>Sign In</Button>
			</Link>
			<Link href="/sign-up">
				<Button>Sign Up</Button>
			</Link>
		</div>
	) : (
		<div>
			{/* <SignOutButton /> */}
			<AvatarDropdown />
		</div>
	)
}
