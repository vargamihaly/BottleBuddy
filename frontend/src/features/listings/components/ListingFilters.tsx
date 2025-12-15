import {useState} from "react";
import {SlidersHorizontal, ArrowUpDown, X} from "lucide-react";
import {Button} from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import {Badge} from "@/shared/ui/badge";
import {Switch} from "@/shared/ui/switch";
import {Label} from "@/shared/ui/label";
import {useTranslation} from "react-i18next";

export type SortOption = "date" | "bottles" | "refund" | "deadline";
export type BottleRange = "all" | "1-10" | "11-50" | "50+";
export type DeadlineFilter = "all" | "upcoming" | "past";

export interface FilterState {
  sortBy: SortOption;
  sortDesc: boolean;
  bottleRange: BottleRange;
  hasRequests: boolean | null;
  deadlineFilter: DeadlineFilter;
}

interface ListingFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const sortOptions: {value: SortOption; label: string}[] = [
  {value: "date", label: "Date Created"},
  {value: "bottles", label: "Bottle Count"},
  {value: "refund", label: "Est. Refund"},
  {value: "deadline", label: "Deadline"},
];

const bottleRanges: {value: BottleRange; label: string}[] = [
  {value: "all", label: "All Sizes"},
  {value: "1-10", label: "1-10 bottles"},
  {value: "11-50", label: "11-50 bottles"},
  {value: "50+", label: "50+ bottles"},
];

const deadlineOptions: {value: DeadlineFilter; label: string}[] = [
  {value: "all", label: "Any deadline"},
  {value: "upcoming", label: "Upcoming"},
  {value: "past", label: "Past"},
];

export const ListingFilters = ({filters, onFiltersChange}: ListingFiltersProps) => {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = [
    filters.bottleRange !== "all",
    filters.hasRequests !== null,
    filters.deadlineFilter !== "all",
  ].filter(Boolean).length;

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({...filters, [key]: value});
  };

  const resetFilters = () => {
    onFiltersChange({
      sortBy: "date",
      sortDesc: true,
      bottleRange: "all",
      hasRequests: null,
      deadlineFilter: "all",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 lg:gap-3">
      {/* Sort Select */}
      <div className="flex items-center gap-2">
        <Select
          value={filters.sortBy}
          onValueChange={(v) => updateFilter("sortBy", v as SortOption)}
        >
          <SelectTrigger className="w-[140px] lg:w-[160px] h-9 bg-white border-gray-200">
            <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-gray-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => updateFilter("sortDesc", !filters.sortDesc)}
        >
          <ArrowUpDown
            className={`w-4 h-4 transition-transform ${
              filters.sortDesc ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Filter Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2 bg-white border-gray-200">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 px-1.5 text-xs bg-green-600 text-white"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4 bg-white border-gray-200" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filters</h4>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-gray-500 hover:text-gray-900"
                  onClick={resetFilters}
                >
                  Reset all
                </Button>
              )}
            </div>

            {/* Bottle Range */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Bottle Count</Label>
              <div className="flex flex-wrap gap-1.5">
                {bottleRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={filters.bottleRange === range.value ? "default" : "outline"}
                    size="sm"
                    className={`h-7 text-xs px-2.5 ${
                      filters.bottleRange === range.value
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }`}
                    onClick={() => updateFilter("bottleRange", range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Has Pending Requests */}
            <div className="flex items-center justify-between">
              <Label className="text-sm">Has pending requests</Label>
              <div className="flex items-center gap-2">
                {filters.hasRequests !== null && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => updateFilter("hasRequests", null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                <Switch
                  checked={filters.hasRequests === true}
                  onCheckedChange={(checked) =>
                    updateFilter(
                      "hasRequests",
                      filters.hasRequests === null ? true : checked ? true : null
                    )
                  }
                />
              </div>
            </div>

            {/* Deadline Filter */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Deadline</Label>
              <Select
                value={filters.deadlineFilter}
                onValueChange={(v) => updateFilter("deadlineFilter", v as DeadlineFilter)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {deadlineOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="hidden lg:flex items-center gap-1.5">
          {filters.bottleRange !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1">
              {bottleRanges.find((r) => r.value === filters.bottleRange)?.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter("bottleRange", "all")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {filters.hasRequests !== null && (
            <Badge variant="secondary" className="gap-1 pr-1">
              {filters.hasRequests ? "Has requests" : "No requests"}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter("hasRequests", null)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {filters.deadlineFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1">
              {deadlineOptions.find((d) => d.value === filters.deadlineFilter)?.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter("deadlineFilter", "all")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};