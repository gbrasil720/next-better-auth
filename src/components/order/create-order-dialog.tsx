'use client'

import { betterFetch } from '@better-fetch/fetch'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { Plus } from 'lucide-react'

type Item = {
	id: string
	name: string
	price: number
}

export function CreateOrderDialog() {
	const router = useRouter()
	const [items, setItems] = useState<Item[]>([])
	const [selectedItems, setSelectedItems] = useState<
		{ id: string; quantity: number }[]
	>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		async function fetchItems() {
			const { data } = await betterFetch<{ items: Item[] }>('/api/items')
			setItems(data?.items || [])
		}

		fetchItems()
	}, [])

	const handleSelectItem = (id: string) => {
		setSelectedItems((prev) => {
			const existing = prev.find((item) => item.id === id)
			if (existing) {
				return prev.map((item) =>
					item.id === id ? { ...item, quantity: item.quantity + 1 } : item
				)
			}

			return [...prev, { id, quantity: 1 }]
		})
	}

	const handleQuantityChange = (id: string, quantity: number) => {
		setSelectedItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, quantity } : item))
		)
	}

	const handleCreateOrder = async () => {
		if (selectedItems.length === 0) {
			console.log('No items selected')
		}

		setLoading(true)

		const { data } = await betterFetch('/api/orders', {
			method: 'POST',
			body: JSON.stringify({
				items: selectedItems.map((item) => ({
					itemId: item.id,
					quantity: item.quantity,
				})),
			}),
			headers: {
				'content-type': 'application/json',
			},
		})

		setSelectedItems([])
		router.refresh()

		setLoading(false)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<Plus size={16} />
					Create Order
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new order</DialogTitle>
					<DialogDescription>Select items for your new order</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold">Available items:</h3>
						<ul className="space-y-2">
							{items.map((item) => (
								<li
									key={item.id}
									className="flex justify-between items-center border p-2 rounded"
								>
									<span>
										{item.name} - ${item.price}
									</span>
									<Button size="sm" onClick={() => handleSelectItem(item.id)}>
										Add
									</Button>
								</li>
							))}
						</ul>
					</div>

					{selectedItems.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold">Order</h3>
							<ul className="space-y-2">
								{selectedItems.map((item) => {
									const itemInfo = items.find((i) => i.id === item.id)

									return (
										<li
											key={item.id}
											className="flex justify-between items-center border p-2 rounded"
										>
											<span>
												{itemInfo?.name} - ${itemInfo?.price}
											</span>
											<Input
												type="number"
												value={item.quantity}
												className="w-16"
												onChange={(e) =>
													handleQuantityChange(
														item.id,
														Number.parseInt(e.target.value)
													)
												}
											/>
										</li>
									)
								})}
							</ul>
						</div>
					)}

					<Separator />

					<Button
						onClick={handleCreateOrder}
						disabled={loading}
						className="w-full"
					>
						{loading ? 'Creating order...' : 'Create order'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
