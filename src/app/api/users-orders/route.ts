import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/auth'

export async function POST(req: NextRequest) {
	try {
		const { ids } = await req.json()

		if (!Array.isArray(ids) || ids.length === 0) {
			return NextResponse.json({ error: 'Invalid IDs array' }, { status: 400 })
		}

		const orders = await prisma.order.findMany({
			where: {
				userId: { in: ids },
			},
			include: {
				items: true,
				user: true,
			},
		})

		const groupedOrders = orders.reduce((acc: any, order) => {
			if (!acc[order.userId]) {
				acc[order.userId] = []
			}
			acc[order.userId].push(order)
			return acc
		}, {})

		return NextResponse.json(groupedOrders)
	} catch (error) {
		console.error('Error fetching orders:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
