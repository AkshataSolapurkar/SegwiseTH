import { useState, useEffect } from "react"
import { Plus, Search, ChevronDown, ChevronRight, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Filter } from "lucide-react"

interface FilterOption {
  label: string
  value: string
  options?: FilterOption[]
}

// Parse the provided filter string into structured data
const parseFilters = (filterString: string) => {
  const filters = filterString.split(';').map(filter => {
    const [category, value] = filter.split(':').map(s => s.trim());
    return { category, value };
  });

  // Group by category
  const groupedFilters = filters.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = [];
    }
    acc[curr.category].push(curr.value);
    return acc;
  }, {} as Record<string, string[]>);

  return Object.entries(groupedFilters).map(([category, values]) => ({
    label: category,
    value: category,
    options: values.map(value => ({
      label: value,
      value: `${category}:${value}` // Store the full filter string as the value
    }))
  }));
};

const FILTER_OPTIONS = parseFilters("Concept:UGC;Audio - Type:voiceover;Audio - Language:English;End card elements - CTA:download it and start crushing those levels!;End card elements - Objects:colored bubbles;End card elements - Objects:wand;End card elements - Objects:rocks;End card elements - Objects:boots;End card elements - Language:English;End card elements - CTA Placement:Middle-Right;End card elements - Background Colour:Orange;End card elements - Background setting:fantasy;End card elements - CTA background colour:Dark Purple");

export const FilterDropdown = ({ onFilterChange }: { onFilterChange: (filters: string[]) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Tags")
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(true)
  const [currentOptions, setCurrentOptions] = useState<FilterOption[]>([])

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    setSelectedFilter(null)
  }

  // Filter options based on search
  const filteredOptions = FILTER_OPTIONS.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  // When a filter category is selected, set its options
  useEffect(() => {
    if (selectedFilter) {
      const filterData = FILTER_OPTIONS.find(f => f.value === selectedFilter)
      if (filterData && filterData.options) {
        setCurrentOptions(filterData.options)
      }
    }
  }, [selectedFilter])

  // Handle applying filters
  const handleApplyFilters = () => {
    if (selectedValues.length > 0) {
      const formattedFilters = selectedValues.map(value => {
        const [category, val] = value.split(':')
        return `${category}:${val}`
      })
      onFilterChange(formattedFilters)
      // Reset states after applying filters
      setIsOpen(false)
      setSelectedFilter(null)
      setShowFilters(true)
      setSearchValue("")
    }
  }

  // Add clear all filters function
  const clearAllFilters = () => {
    setSelectedValues([])
    onFilterChange([]) // This will clear all filters and show all data
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 w-[130px] flex items-center gap-2 bg-white border border-[Blackopacity/8%] rounded-[12px] p-[12px]"
        >
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-500"/>
              <span className="text-sm text-gray-700 font-normal">Filter</span>
            </div>
            {selectedValues.length > 0 && (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#E3FA99] text-[#1C1C1C]">
                {selectedValues.length}
              </span>
            )}
          </div>
        </button>

        {/* Add clear all button */}
        {selectedValues.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
            title="Clear all filters"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 top-[100%] left-0 w-[320] mt-1">
          <div className="bg-white border border-[Blackopacity/8%] rounded-[12px] shadow-lg p-2">
            <div className="flex items-center w-full gap-3 p-[12px] text-[#292929] bg-[#F3F9EB] rounded-lg shadow-[0px_2px_8px_0px_rgba(99,121,168,0.08)] border border-[rgba(0,0,0,0.12)]">
              <Plus size={18} className="text-[#1C1C1C] bg-[#E3FA99] rounded-sm border border-black/6" />
              <span className="text-sm font-normal text-[#626262]">
                Add Filter
              </span>
            </div>

            {/* Rest of the dropdown content */}
            {selectedFilter && (
              <div className="bg-white border border-[Blackopacity/8%] rounded-[12px] shadow-lg text-[Blacks/800] p-[8px] mb-2">
                <div className="flex items-center justify-between">
                  <button
                    className="flex items-center p-[9px] gap-2 text-sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <span className="text-gray-600">Tag</span>
                    <ChevronRight size={16} className="text-gray-400" />
                    <span className="font-medium">{selectedFilter}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedFilter(null)
                      setShowFilters(true)
                      setSelectedValues([])
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 border border-[Blackopacity/8%] rounded-sm shadow-[0px_3px_4px_0px_rgba(99,121,168,0.06)]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-[12px] p-2">
                  <Search className="text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search values"
                    className="w-full text-sm border border-transparent rounded-lg placeholder-[Blacks/600] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className={cn(
              "bg-white border border-gray-200 rounded-[12px] shadow-lg overflow-hidden mt-2",
              selectedFilter ? "-mt-2" : ""
            )}>
              {showFilters && !selectedFilter && (
                <>
                  <div className="py-[10px] px-[12px]">
                    <div className="flex items-center gap-[12px]">
                      <Search className="text-gray-400" size={20} />
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search filters"
                        className="w-full text-sm border border-transparent rounded-lg placeholder-[Blacks/600] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex border-b border-t border-gray-200">
                    {["Dimensions", "Tags", "Metrics"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={cn(
                          "px-4 py-2 text-sm font-semibold transition-colors",
                          activeTab === tab
                            ? "text-[#1C1C1C] border-b-2 border-[#1C1C1C]"
                            : "text-[#757575] hover:text-[#404040]"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {!selectedFilter ? (
                <div className="py-1">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedFilter(option.value)
                        setShowFilters(false)
                        setSearchValue("")
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 p-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedValues(currentOptions.map(opt => opt.value))
                        } else {
                          setSelectedValues([])
                        }
                      }}
                      checked={selectedValues.length === currentOptions.length}
                    />
                    Select all
                  </label>

                  {currentOptions
                    .filter(option => 
                      option.label.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedValues.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedValues([...selectedValues, option.value])
                            } else {
                              setSelectedValues(selectedValues.filter(v => v !== option.value))
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                        />
                        {option.label}
                      </label>
                    ))}

                  <button
                    onClick={handleApplyFilters}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-[#1C1C1C] rounded-lg hover:bg-[#2C2C2C] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}