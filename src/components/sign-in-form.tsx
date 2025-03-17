'use client'

import { authClient } from '@/lib/auth-client'
import { signInFormSchema } from '@/lib/schemas/form'
import type { ErrorContext } from '@better-fetch/fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { LoadingButton } from './loading-button'
import { Button } from './ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Label } from './ui/label'
import TextSeparator from './text-separator'
import { GitHubAuthButton } from './github-auth-button'

interface SignInFormProps {
	pendingCredentials: boolean
	setPendingCredentials: (value: boolean) => void
	router: AppRouterInstance
}

export function SignInForm({
	pendingCredentials,
	setPendingCredentials,
	router,
}: SignInFormProps) {
	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof signInFormSchema>) {
		await authClient.signIn.email(
			{
				email: values.email,
				password: values.password,
			},
			{
				onRequest: () => {
					setPendingCredentials(true)
				},
				onSuccess: () => {
					router.push('/dashboard')
					router.refresh()
				},
				onError: (ctx: ErrorContext) => {
					console.log(ctx)
				},
			}
		)

		setPendingCredentials(false)
	}

	return (
		<div className="grow flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-center text-gray-800">
						Sign In
					</CardTitle>
					<CardDescription>Sign in to your account</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<Input
												placeholder="test@test.com"
												{...field}
												type="email"
											/>
										</FormControl>
										<FormDescription>
											{form.formState.errors.email?.message}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												placeholder="********"
												{...field}
												type="password"
											/>
										</FormControl>
										<FormDescription>
											{form.formState.errors.password?.message}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<LoadingButton pending={pendingCredentials}>
								Sign In
							</LoadingButton>
						</form>
					</Form>
					<TextSeparator>or</TextSeparator>
					<GitHubAuthButton />
				</CardContent>
			</Card>
		</div>
	)
}
