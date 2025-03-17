'use client'

import type { ColumnDef } from '@tanstack/react-table'
import {
	ArrowUpDown,
	CheckCircle,
	Clock,
	MoreHorizontal,
	Truck,
	XCircle,
} from 'lucide-react'
import { Button } from '../ui/button'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { OrderDetailsDialog } from './order-details-dialog'
import { useState } from 'react'

export type Order = {
	id: string
	items: { name: string; quantity: number; price: number }[]
	totalPrice: number
	status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Delivered'
}

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: 'id',
		header: 'Order ID',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'quantity',
		header: 'Items',
		cell: ({ row }) => {
			const order = row.original

			const orderQuantity = order.items.reduce(
				(acc, item) => acc + item.quantity,
				0
			)

			return <div className="ml-6">{orderQuantity}</div>
		},
	},
	{
		accessorKey: 'totalPrice',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Price
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			return <div className="ml-6">{row.original.totalPrice}</div>
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const order = row.original

			return (
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0 hover:cursor-pointer"
						>
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(order.id)}
						>
							Copy order ID
						</DropdownMenuItem>
						<OrderDetailsDialog orderId={order.id}>
							<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
								View order details
							</DropdownMenuItem>
						</OrderDetailsDialog>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive">
							Cancel order
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
