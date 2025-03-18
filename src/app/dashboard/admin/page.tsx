'use client'

import { UserList } from '@/components/user/user-list'
import { authClient } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import type { User, Order } from '@/types'

export default function AdminDashboard() {
	const [users, setUsers] = useState<User[]>([])

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const fetchedUsers = await authClient.admin.listUsers({
					query: { limit: 10 },
				})

				if (!fetchedUsers.data || !fetchedUsers.data.users) {
					console.error('Error fetching users:', fetchedUsers)
					return
				}

				const users: User[] = fetchedUsers.data.users.map((user: any) => ({
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image || '',
					banned: user.banned,
					role: user.role,
				}))

				const userIds = users.map((user) => user.id)

				const ordersResponse = await fetch('/api/users-orders', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ids: userIds }),
				})

				const ordersData: Record<string, Order[]> = await ordersResponse.json()

				const usersWithOrders: User[] = users.map((user) => ({
					...user,
					orders: ordersData[user.id] || [],
				}))

				setUsers(usersWithOrders)
			} catch (error) {
				console.error('Error fetching users:', error)
			}
		}

		fetchUsers()
	}, [])

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">User list</h1>
			<UserList users={users} />
		</div>
	)
}
