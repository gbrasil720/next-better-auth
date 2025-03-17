import { Separator } from '@/components/ui/separator'
import type { ReactNode } from 'react'

export default function TextSeparator({ children }: { children: ReactNode }) {
	return (
		<div className="flex items-center gap-4">
			<Separator className="flex-1" />
			<span className="text-muted-foreground">{children}</span>
			<Separator className="flex-1" />
		</div>
	)
}
