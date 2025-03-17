import { prisma } from '@/lib/auth'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	const order = await prisma.order.findUnique({
		where: {
			id,
		},
		include: {
			items: true,
		},
	})

	return Response.json({ order })
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	await prisma.order.delete({
		where: {
			id,
		},
	})

	return Response.json({ message: 'Order cancelled successfully' })
}
