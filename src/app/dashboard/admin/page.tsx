'use client'

import { authClient } from '@/lib/auth-client'
import { useEffect, useState } from 'react'

type User = {
	id: string
	name: string
	email: string
	image: string
	role: string | null
}

export default function AdminDashboard() {
	const [users, setUsers] = useState<User[]>([])

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const fetchedUsers = await authClient.admin.listUsers({
					query: {
						limit: 10,
					},
				})

				if (!fetchedUsers.data || !fetchedUsers.data.users) {
					console.error('Error fetching users:', fetchedUsers)
				}

				console.log('fetched users: ', fetchedUsers.data?.users[0])

				setUsers(
					(fetchedUsers.data?.users || []).map((user) => ({
						...user,
						image: user.image || '',
					})) as User[]
				)
			} catch (error) {
				console.error('Error fetching users:', error)
			}
		}

		fetchUsers()
	}, [])

	return (
		<>
			{users.map((user) => (
				<div key={user.id}>
					<p>{user.name}</p>
					<p>{user.email}</p>
					<p>{user.role}</p>
					<img
						src={user.image || 'http://github.com/diego3g.png'}
						alt={user.name}
					/>
				</div>
			))}
		</>
	)
}
