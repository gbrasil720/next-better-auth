export interface User {
	id: string
	name: string
	email: string
	image?: string
	orders?: Order[]
	banned?: boolean | null
	role: string | null
}

export interface Order {
	id: string
	userId: string
	totalPrice: number
	createdAt: string
	status: OrderStatus | undefined
	items: OrderItem[]
}

interface OrderItem {
	id: string
	name: string
	quantity: number
	price: number
}

export enum OrderStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	CANCELLED = 'CANCELLED',
	DELIVERED = 'DELIVERED',
}
