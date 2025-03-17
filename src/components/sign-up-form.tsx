'use client'

import { authClient } from '@/lib/auth-client'
import { signUpFormSchema } from '@/lib/schemas/form'
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

interface SignUpFormProps {
	pendingCredentials: boolean
	setPendingCredentials: (value: boolean) => void
	router: AppRouterInstance
}

export function SignUpForm({
	pendingCredentials,
	setPendingCredentials,
	router,
}: SignUpFormProps) {
	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	})

	console.log(form)

	async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
		console.log(values)

		try {
			await authClient.signUp.email(
				{
					email: values.email,
					password: values.password,
					name: values.name,
				},
				{
					onRequest: () => {
						setPendingCredentials(true)
					},
					onSuccess: () => {
						router.push('/')
						router.refresh()
					},
					onError: (ctx: ErrorContext) => {
						console.log(ctx)
					},
				}
			)
		} catch (err) {
			console.log(err)
		}

		setPendingCredentials(false)
	}

	function teste() {
		console.log('enviado')
	}

	console.log(onSubmit)

	return (
		<div className="grow flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-center text-gray-800">
						Sign Up
					</CardTitle>
					<CardDescription>Create an account</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Your name here" {...field} />
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
							{/* <LoadingButton pending={pendingCredentials}>
								Sign Up
							</LoadingButton> */}
							<Button type="submit">Sign Up</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
