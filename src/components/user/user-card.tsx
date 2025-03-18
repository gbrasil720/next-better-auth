import { AvatarImage } from '@radix-ui/react-avatar'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { useState } from 'react'
import type { User, Order } from '@/types'
import { Check, CircleHelp, Clock, Truck, X } from 'lucide-react'

interface UserCardProps {
	user: User
}

export function UserCard({ user }: UserCardProps) {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

	const getStatusBadge = (status: Order['status']) => {
		switch (status) {
			case 'PENDING':
				return (
					<Badge
						variant="outline"
						className="border-amber-400 text-amber-400 flex items-center"
					>
						<Clock size={16} />
						Pending
					</Badge>
				)
			case 'CONFIRMED':
				return (
					<Badge
						variant="outline"
						className="border-green-500 text-green-500 flex items-center"
					>
						<Check size={16} />
						Confirmed
					</Badge>
				)
			case 'CANCELLED':
				return (
					<Badge
						variant="outline"
						className="border-destructive text-destructive flex items-center"
					>
						<X size={16} />
						Cancelled
					</Badge>
				)
			case 'DELIVERED':
				return (
					<Badge
						variant="outline"
						className="border-blue-600 text-blue-600 flex items-center"
					>
						<Truck size={16} />
						Delivered
					</Badge>
				)
			default:
				return (
					<Badge variant="outline" className="border-gray-500 text-gray-500">
						<CircleHelp size={16} />
						Unkknown
					</Badge>
				)
		}
	}

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-row items-center gap-4">
				<Avatar className="w-16 h-16">
					<AvatarImage src={user.image || '/default-avatar.png'} />
					<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div>
					<CardTitle>{user.name}</CardTitle>
					<p className="text-sm text-gray-600">{user.email}</p>
					<Badge variant={user.banned ? 'destructive' : 'outline'}>
						{user.banned ? 'Banned' : 'Active'}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<h3 className="text-sm font-semibold">Orders:</h3>
				{user.orders && user.orders.length > 0 ? (
					<ul className="mt-2 space-y-2">
						{user.orders.map((order) => (
							<li
								key={order.id}
								className="flex justify-between items-center border-b py-2"
							>
								<div className="flex items-center gap-2">
									{getStatusBadge(order.status)}
									<span className="text-sm">
										Order #{order.id} - $ {order.totalPrice}
									</span>
								</div>
								<Dialog>
									<DialogTrigger asChild>
										<Button
											size="sm"
											variant="outline"
											onClick={() => setSelectedOrder(order)}
										>
											Check details
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Order details</DialogTitle>
											<DialogDescription>
												Order #{selectedOrder?.id} -{' '}
												{getStatusBadge(selectedOrder?.status)}
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-3">
											<p className="text-sm text-gray-600">
												Data:{' '}
												{new Date(
													selectedOrder?.createdAt || ''
												).toLocaleDateString()}
											</p>
											<h3 className="font-semibold">Order items:</h3>
											<ul className="space-y-2">
												{selectedOrder?.items.map((item) => (
													<li
														key={item.id}
														className="flex justify-between text-sm border b-2 p-4 rounded-lg shadow"
													>
														<span>
															{item.quantity}x {item.name}
														</span>
														<span>$ {item.price * item.quantity}</span>
													</li>
												))}
											</ul>
											<p className="text-right font-semibold text-lg">
												Total: $ {selectedOrder?.totalPrice}
											</p>
										</div>
									</DialogContent>
								</Dialog>
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500 text-sm mt-2">No orders found</p>
				)}
			</CardContent>
		</Card>
	)
}
