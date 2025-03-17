import { authClient } from '@/lib/auth-client'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, User } from 'lucide-react'

export function AvatarDropdown() {
	const router = useRouter()
	const { data } = authClient.useSession()
	const session = data

	const handleSignOut = async () => {
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push('/sign-in')
						router.refresh()
					},
				},
			})
		} catch (error) {
			console.error('Error signing out:', error)
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className="cursor-pointer w-10 h-10">
					<AvatarImage src={session?.user.image || ''} />
					<AvatarFallback className="bg-neutral-200">RG</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="mr-4">
				<DropdownMenuItem>
					<Link href="/profile" className="flex items-center gap-4">
						<User size={16} />
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Link href="/settings" className="flex items-center gap-4">
						<Settings size={16} />
						Settings
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => handleSignOut()}
					className="flex items-center gap-4 cursor-pointer hover:bg-neutral-100"
				>
					<LogOut size={16} className="text-destructive" />
					<span className="text-destructive">Sign Out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
