import { ArrowUpDown } from "lucide-react"
import { flexRender, type Header } from "@tanstack/react-table"
import { AdData } from "@/types/types"
import { cn } from "@/lib/utils"

interface TableHeaderProps {
  header: Header<AdData, unknown>
}

export const TableHeader: React.FC<TableHeaderProps> = ({ header }) => {
  if (header.isPlaceholder) return null

  return (
    <div
      className={cn(
        "flex items-center space-x-2",
        header.column.getCanSort() && "cursor-pointer select-none"
      )}
      onClick={header.column.getToggleSortingHandler()}
    >
      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
      {header.column.getCanSort() && <ArrowUpDown size={14} />}
    </div>
  )
}