import { useState } from "react";
import { type Equipment } from "@shared/schema";
import { ArrowUpDown, Eye, MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EquipmentStatusBadge } from "./equipment-status-badge";
import { Skeleton } from "@/components/ui/skeleton";

interface EquipmentTableProps {
  equipment: Equipment[];
  isLoading?: boolean;
  onViewDetails: (equipment: Equipment) => void;
  onViewOnMap: (equipment: Equipment) => void;
  onEdit?: (equipment: Equipment) => void;
}

type SortField = "equipmentId" | "name" | "type" | "status" | "lastMaintenance";
type SortDirection = "asc" | "desc";

export function EquipmentTable({
  equipment,
  isLoading,
  onViewDetails,
  onViewOnMap,
  onEdit,
}: EquipmentTableProps) {
  const [sortField, setSortField] = useState<SortField>("equipmentId");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEquipment = [...equipment].sort((a, b) => {
    let aValue: string | number | Date = a[sortField] as string;
    let bValue: string | number | Date = b[sortField] as string;

    if (sortField === "lastMaintenance") {
      aValue = a.lastMaintenance ? new Date(a.lastMaintenance).getTime() : 0;
      bValue = b.lastMaintenance ? new Date(b.lastMaintenance).getTime() : 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-border bg-card">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No equipment found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => handleSort("equipmentId")}
                data-testid="button-sort-id"
              >
                Equipment ID
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => handleSort("name")}
                data-testid="button-sort-name"
              >
                Name
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => handleSort("type")}
                data-testid="button-sort-type"
              >
                Type
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => handleSort("status")}
                data-testid="button-sort-status"
              >
                Status
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Coordinates</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => handleSort("lastMaintenance")}
                data-testid="button-sort-maintenance"
              >
                Last Maintenance
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEquipment.map((item) => (
            <TableRow key={item.id} className="hover-elevate">
              <TableCell className="font-mono text-xs" data-testid={`cell-id-${item.equipmentId}`}>
                {item.equipmentId}
              </TableCell>
              <TableCell className="font-medium" data-testid={`cell-name-${item.equipmentId}`}>
                {item.name}
              </TableCell>
              <TableCell data-testid={`cell-type-${item.equipmentId}`}>{item.type}</TableCell>
              <TableCell>
                <EquipmentStatusBadge status={item.status} />
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {item.address}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {Number(item.latitude).toFixed(4)}, {Number(item.longitude).toFixed(4)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.lastMaintenance
                  ? new Date(item.lastMaintenance).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(item)}
                      data-testid={`button-edit-${item.equipmentId}`}
                      aria-label="Edit equipment"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onViewDetails(item)}
                    data-testid={`button-view-${item.equipmentId}`}
                    aria-label="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onViewOnMap(item)}
                    data-testid={`button-map-${item.equipmentId}`}
                    aria-label="View on map"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
