import { CheckCircle, Clock, Truck, XCircle } from 'lucide-react'

export function StatusTag({ cell }: { cell: any }) {
	const status = cell.getValue() as string
	let icon
	const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

	switch (status) {
		case 'PENDING':
			icon = <Clock className="text-yellow-500" size={16}/>
			break
		case 'CONFIRMED':
			icon = <CheckCircle className="text-green-500" size={16}/>
			break
		case 'CANCELLED':
			icon = <XCircle className="text-red-500" size={16}/>
			break
		case 'DELIVERED':
			icon = <Truck className="text-blue-500" size={16}/>
			break
		default:
			icon = null
			break
	}

	return (
		<div className="flex items-center gap-2">
			{icon}
			{statusLabel}
		</div>
	)
}
