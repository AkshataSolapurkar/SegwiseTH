import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="w-full p-[12px] text-sm border focus:outline-none border-[Blackopacity/8%] rounded-[12px] focus:border-[#afd246] flex gap-3">
      <Search className="text-gray-400" size={20} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus:outline-none w-full"
        placeholder="Search all columns..."
      />
    </div>
  )
}