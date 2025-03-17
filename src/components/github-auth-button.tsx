'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LoadingButton } from './loading-button'
import { Github } from 'lucide-react'
import { toast } from 'sonner'
import type { ErrorContext } from '@better-fetch/fetch'

export function GitHubAuthButton() {
	const router = useRouter()
	const [pendingGithub, setPendingGithub] = useState(false)

	const handleSigninWithGithub = async () => {
		try {
			await authClient.signIn.social(
				{
					provider: 'github',
				},
				{
					onRequest: () => {
						setPendingGithub(true)
					},
					onSuccess: () => {
						router.push('/dashboard')
					},
					onError: (ctx: ErrorContext) => {
						console.log('Error signing in with Github')
						toast('Something went wrong. Please try again.', {
							description: ctx.error.message,
							duration: 10000,
						})
					},
				}
			)
		} catch (e) {
			console.log('deu erro')
		}

		setPendingGithub(false)
	}

	return (
		<LoadingButton
			pending={pendingGithub}
			onClick={() => handleSigninWithGithub()}
		>
			<Github size={16} />
			Continue with Github
		</LoadingButton>
	)
}
