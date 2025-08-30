import { useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const DataTable = <T,>({ 
  data, 
  columns, 
  searchable = false, 
  searchPlaceholder = "Search...",
  onSearch,
  className = ""
}: DataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`px-6 py-3 text-left text-sm font-medium text-muted-foreground ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-muted/25 transition-colors"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key}
                    className={`px-6 py-4 text-sm ${column.className || ''}`}
                  >
                    {getCellValue(row, column) as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};