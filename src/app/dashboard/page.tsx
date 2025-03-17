'use client'

import { columns } from '@/components/order/columns'
import { CreateOrderDialog } from '@/components/order/create-order-dialog'
import { OrderTable } from '@/components/order/order-table'
import { Button } from '@/components/ui/button'
import { betterFetch } from '@better-fetch/fetch'
import { useEffect, useState } from 'react'
import { getCurrentSession } from './actions'

interface OrdersData {
	orders: {
		id: string
		createdAt: string
		updatedAt: string
		status: string
		total: number
	}
}

export default function Dashboard() {
	const [orders, setOrders] = useState<any>([])
	const [session, setSession] = useState<any>(null)
	useEffect(() => {
		async function fetchData() {
			try {
				// Buscar sessão
				const sessionData = await getCurrentSession()
				setSession(sessionData)

				// Buscar pedidos
				const { data: ordersData } = await betterFetch<OrdersData>(
					'/api/orders',
					{
						headers: { cookie: document.cookie },
					}
				)

				console.log(ordersData)

				setOrders(ordersData?.orders || [])
			} catch (error) {
				console.error('Erro ao buscar dados:', error)
			}
		}

		fetchData()
	}, []) // Use apenas dependências necessárias, para evitar re-renders infinitos

	return (
		<main className="flex items-center justify-center h-screen">
			<div className="flex flex-col items-center gap-4 w-full">
				<h1 className="text-7xl">Dashboard</h1>
				<p>You are logged in as: {session?.user.email}</p>

				{orders.length === 0 ? (
					<div className="flex flex-col items-center gap-4">
						<h3>You have no orders... What about create one?</h3>
						<CreateOrderDialog />
					</div>
				) : (
					<OrderTable columns={columns} data={orders} />
				)}
			</div>
		</main>
	)
}
