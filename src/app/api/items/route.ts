import { prisma } from '@/lib/auth'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const items = await prisma.item.findMany()

	return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
	const { name, price } = await req.json()

	await prisma.item.create({
		data: {
			name,
			price,
		},
	})

	return NextResponse.json({ message: 'Item created successfully' })
}
