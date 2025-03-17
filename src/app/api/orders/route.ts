import { auth, prisma } from '@/lib/auth'
import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const orders = await prisma.order.findMany({
		where: {
			userId: session.user.id,
		},
		include: {
			items: true,
		},
	})

	console.log(orders)

	return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
	const { items } = await req.json()
	console.log(items)

	const safeItems = Array.isArray(items) ? items : []

	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const itemIds = safeItems
		.filter((item: any) => item.itemId)
		.map((item: any) => item.itemId)

	console.log('Item IDs:', itemIds)

	if (itemIds.length === 0) {
		return NextResponse.json(
			{ error: 'No valid item IDs provided' },
			{ status: 400 }
		)
	}

	const existingItems = await prisma.item.findMany({
		where: {
			id: { in: itemIds },
		},
	})

	console.log('Existing items from DB:', existingItems)

	if (existingItems.length === 0) {
		return NextResponse.json(
			{ error: 'No valid items found in the database' },
			{ status: 400 }
		)
	}

	const existingItemIds = new Set(existingItems.map((item) => item.id))

	const invalidItems = itemIds.filter((id: string) => !existingItemIds.has(id))

	if (invalidItems.length > 0) {
		return NextResponse.json(
			{ error: `Invalid item IDs: ${invalidItems.join(', ')}` },
			{ status: 400 }
		)
	}

	let totalPrice = 0

	const orderItems = safeItems
		.map((item: any) => {
			const existingItem = existingItems.find((i) => i.id === item.itemId)
			if (!existingItem) {
				return null
			}

			const price = Number.parseInt(existingItem.price.toString())
			const quantity = item.quantity || 1
			totalPrice += price * quantity

			return {
				itemId: existingItem.id,
				name: existingItem.name,
				quantity,
				price,
			}
		})
		.filter((item) => item !== null)

	console.log('Order items:', orderItems)

	if (orderItems.length === 0) {
		return NextResponse.json(
			{ error: 'No valid items to create the order' },
			{ status: 400 }
		)
	}

	try {
		const order = await prisma.order.create({
			data: {
				user: { connect: { id: session.user.id } },
				status: 'PENDING',
				totalPrice,
				items: {
					create: orderItems,
				},
			},
			include: { items: true },
		})

		console.log('Order created successfully:', order)
		return NextResponse.json(order, { status: 201 })
	} catch (error) {
		console.error('Error creating order:', error)
		return NextResponse.json({ error: 'Error creating order' }, { status: 500 })
	}
}
