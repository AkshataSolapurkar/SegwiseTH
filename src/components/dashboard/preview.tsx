import { useState } from "react"
import { X } from "lucide-react"
import { AdData } from "@/types/types"

interface PreviewProps {
  data: AdData
  onClose: () => void
}

export const Preview: React.FC<PreviewProps> = ({ data, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const truncatedId = `..${data.creative_id.slice(-4)}`

  return (
    <div
      className={`
        fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 
        transition-all duration-300 z-50
        ${isExpanded 
          ? "w-[90vw] h-[80vh] md:w-[600px] md:h-[70vh]" 
          : "w-[90vw] max-w-[320px]"}
      `}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Preview</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className={`space-y-4 ${isExpanded ? "overflow-y-auto h-[calc(100%-5rem)]" : ""}`}>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Creative ID</p>
          <p className="font-medium">{truncatedId}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Name</p>
          <p className="font-medium">{data.creative_name}</p>
        </div>

        {isExpanded && (
          <>
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">Additional Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => {
                  if (!["creative_id", "creative_name"].includes(key)) {
                    return (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="font-medium">
                          {typeof value === "number" 
                            ? key === "ctr" 
                              ? `${(value * 100).toFixed(2)}%`
                              : key.includes("cost") || key === "spend"
                                ? `$${value.toFixed(2)}`
                                : value.toLocaleString()
                            : String(value)}
                        </p>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}