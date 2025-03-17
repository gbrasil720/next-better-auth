'use client'

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from '@tanstack/react-table'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

import { StatusTag } from '../status-tag'
import { useState } from 'react'
import { Input } from '../ui/input'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { CreateOrderDialog } from './create-order-dialog'

interface OrderTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

export function OrderTable<TData, TValue>({
	columns,
	data,
}: OrderTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	})

	return (
		<div className="w-[60rem]">
			<div className="flex items-center py-4 justify-between">
				<Input
					placeholder="Filter by id..."
					value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('id')?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<div className="flex items-center gap-4">
					<CreateOrderDialog />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									)
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="rounded-md w-full border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{cell.column.id === 'items' ? (
												<div>
													{(cell.getValue() as any[]).map(
														(item: any, index: number) => (
															<div key={index}>
																<strong>{item.name}</strong>
															</div>
														)
													)}
												</div>
											) : cell.column.id === 'status' ? (
												<div className="flex items-center gap-2">
													<StatusTag cell={cell} />
												</div>
											) : (
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No orders found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
