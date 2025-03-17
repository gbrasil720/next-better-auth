'use client'

import { SignUpForm } from '@/components/sign-up-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage() {
	const router = useRouter()
	const [pendingCredentials, setPendingCredentials] = useState(false)

	console.log('aaaaaaaaaaaaaa')

	return (
		<SignUpForm
			router={router}
			pendingCredentials={pendingCredentials}
			setPendingCredentials={setPendingCredentials}
		/>
	)
}
