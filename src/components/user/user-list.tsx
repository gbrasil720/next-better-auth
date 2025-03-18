import { UserCard } from './user-card'
import type { User } from '@/types'

interface UserListProps {
	users: User[]
}

export function UserList({ users }: UserListProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{users.map((user) => (
				<UserCard key={user.id} user={user} />
			))}
		</div>
	)
}
