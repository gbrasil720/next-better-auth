import { betterFetch } from '@better-fetch/fetch'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { type JSX, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { Separator } from '../ui/separator'

type Item = {
	id: string
	name: string
	price: number
	quantity: number
}

type Order = {
	order: {
		items: Item[]
		status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Delivered'
		createdAt: string
		totalPrice: number
	}
}

export function OrderDetailsDialog({
	orderId,
	children,
}: { orderId: string; children: JSX.Element }) {
	const router = useRouter()
	const [orderItems, setOrderItems] = useState<Item[]>([])
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [isOrderDetailDialogOpen, setIsOrderDetailDialogOpen] = useState(false)

	useEffect(() => {
		async function fetchItems() {
			const { data } = await betterFetch<Order>(`/api/orders/${orderId}`)

			setOrderItems(data?.order.items ?? [])
		}

		fetchItems()
	}, [])

	const handleCancelOrder = async () => {
		setLoading(true)

		await betterFetch(`/api/orders/${orderId}`, {
			method: 'DELETE',
			body: JSON.stringify({
				orderId,
			}),
			headers: {
				'content-type': 'application/json',
			},
		})

		setLoading(false)

		router.refresh()
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Your order</DialogTitle>
					<DialogDescription>
						Check the details from order with id: {orderId}{' '}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold">Order items:</h3>
						<ul className="space-y-2">
							{orderItems.map((item) => (
								<li key={item.id} className="items-center border p-2 rounded">
									<div className="flex justify-between items-center">
										<span className="justify-start">
											{item.name} - ${item.price}
										</span>
										<span className="text-xs justify-end">
											x{item.quantity}
										</span>
									</div>
								</li>
							))}
						</ul>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<Button
							onClick={handleCancelOrder}
							disabled={loading}
							className="w-fit bg-destructive hover:bg-[#fb2c36] hover:cursor-pointer"
						>
							{loading ? 'Cancelling order' : 'Cancel order'}
						</Button>
						<Button
							onClick={() => setOpen(false)}
							className="w-fit hover:cursor-pointer"
						>
							Close
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
