'use client'

import { SignInForm } from '@/components/sign-in-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignInPage() {
	const router = useRouter()
	const [pendingCredentials, setPendingCredentials] = useState(false)

	return (
		<>
			<SignInForm
				router={router}
				pendingCredentials={pendingCredentials}
				setPendingCredentials={setPendingCredentials}
			/>
		</>
	)
}
