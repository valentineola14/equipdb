import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

export interface FilterOptions {
  types: string[];
  status: string;
  installationDateFrom?: string;
  installationDateTo?: string;
  lastMaintenanceFrom?: string;
  lastMaintenanceTo?: string;
}

interface EquipmentFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const equipmentTypes = [
  "Transformer",
  "Substation",
  "Generator",
  "Circuit Breaker",
  "Capacitor Bank",
  "Voltage Regulator",
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "operational", label: "Operational" },
  { value: "maintenance", label: "Maintenance" },
  { value: "offline", label: "Offline" },
];

export function EquipmentFilters({ onFilterChange }: EquipmentFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [installationDateFrom, setInstallationDateFrom] = useState("");
  const [installationDateTo, setInstallationDateTo] = useState("");
  const [lastMaintenanceFrom, setLastMaintenanceFrom] = useState("");
  const [lastMaintenanceTo, setLastMaintenanceTo] = useState("");

  const emitFilters = (updates: Partial<FilterOptions>) => {
    onFilterChange({
      types: selectedTypes,
      status: selectedStatus,
      installationDateFrom: installationDateFrom || undefined,
      installationDateTo: installationDateTo || undefined,
      lastMaintenanceFrom: lastMaintenanceFrom || undefined,
      lastMaintenanceTo: lastMaintenanceTo || undefined,
      ...updates,
    });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...selectedTypes, type]
      : selectedTypes.filter((t) => t !== type);
    setSelectedTypes(newTypes);
    emitFilters({ types: newTypes });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    emitFilters({ status });
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedStatus("all");
    setInstallationDateFrom("");
    setInstallationDateTo("");
    setLastMaintenanceFrom("");
    setLastMaintenanceTo("");
    onFilterChange({ 
      types: [], 
      status: "all",
      installationDateFrom: undefined,
      installationDateTo: undefined,
      lastMaintenanceFrom: undefined,
      lastMaintenanceTo: undefined,
    });
  };

  const hasActiveFilters = 
    selectedTypes.length > 0 || 
    selectedStatus !== "all" ||
    installationDateFrom ||
    installationDateTo ||
    lastMaintenanceFrom ||
    lastMaintenanceTo;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-md border border-border bg-card">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full justify-between px-4 py-3 hover-elevate"
            data-testid="button-toggle-filters"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
              {hasActiveFilters && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  Active
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {isOpen ? "Hide" : "Show"}
            </span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="space-y-6 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Equipment Type</Label>
                {selectedTypes.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSelectedTypes([]);
                      emitFilters({ types: [] });
                    }}
                    data-testid="button-clear-type-filters"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {equipmentTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={(checked) =>
                        handleTypeChange(type, checked as boolean)
                      }
                      data-testid={`checkbox-type-${type.toLowerCase().replace(/\s+/g, "-")}`}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm font-medium">Status</Label>
              <RadioGroup
                value={selectedStatus}
                onValueChange={handleStatusChange}
              >
                {statusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.value}
                      id={`status-${option.value}`}
                      data-testid={`radio-status-${option.value}`}
                    />
                    <label
                      htmlFor={`status-${option.value}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm font-medium">Installation Date</Label>
              <div className="grid gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="install-from" className="text-xs text-muted-foreground">From</Label>
                  <Input
                    id="install-from"
                    type="date"
                    value={installationDateFrom}
                    onChange={(e) => {
                      setInstallationDateFrom(e.target.value);
                      emitFilters({ installationDateFrom: e.target.value || undefined });
                    }}
                    data-testid="input-installation-date-from"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="install-to" className="text-xs text-muted-foreground">To</Label>
                  <Input
                    id="install-to"
                    type="date"
                    value={installationDateTo}
                    onChange={(e) => {
                      setInstallationDateTo(e.target.value);
                      emitFilters({ installationDateTo: e.target.value || undefined });
                    }}
                    data-testid="input-installation-date-to"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm font-medium">Last Maintenance</Label>
              <div className="grid gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="maintenance-from" className="text-xs text-muted-foreground">From</Label>
                  <Input
                    id="maintenance-from"
                    type="date"
                    value={lastMaintenanceFrom}
                    onChange={(e) => {
                      setLastMaintenanceFrom(e.target.value);
                      emitFilters({ lastMaintenanceFrom: e.target.value || undefined });
                    }}
                    data-testid="input-maintenance-date-from"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="maintenance-to" className="text-xs text-muted-foreground">To</Label>
                  <Input
                    id="maintenance-to"
                    type="date"
                    value={lastMaintenanceTo}
                    onChange={(e) => {
                      setLastMaintenanceTo(e.target.value);
                      emitFilters({ lastMaintenanceTo: e.target.value || undefined });
                    }}
                    data-testid="input-maintenance-date-to"
                  />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <>
                <Separator />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleReset}
                  data-testid="button-reset-filters"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
