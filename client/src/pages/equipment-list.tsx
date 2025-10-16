import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Equipment } from "@shared/schema";
import { EquipmentSearch } from "@/components/equipment-search";
import { EquipmentFilters, type FilterOptions } from "@/components/equipment-filters";
import { EquipmentTable } from "@/components/equipment-table";
import { EquipmentDetailPanel } from "@/components/equipment-detail-panel";
import { useLocation } from "wouter";

interface SearchParams {
  query?: string;
  searchType: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export default function EquipmentList() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchType: "all",
  });
  const [filters, setFilters] = useState<FilterOptions>({
    types: [],
    status: "all",
    installationDateFrom: undefined,
    installationDateTo: undefined,
    lastMaintenanceFrom: undefined,
    lastMaintenanceTo: undefined,
  });
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  // Build the appropriate query key and URL
  let queryKey: (string | number)[];
  let queryFn: (() => Promise<Equipment[]>) | undefined;

  const hasSearch = searchParams.query?.trim() || 
    (searchParams.latitude !== undefined && searchParams.longitude !== undefined);

  if (hasSearch) {
    const params = new URLSearchParams();
    
    if (searchParams.latitude !== undefined && searchParams.longitude !== undefined) {
      params.append("latitude", searchParams.latitude.toString());
      params.append("longitude", searchParams.longitude.toString());
      if (searchParams.radius) {
        params.append("radius", searchParams.radius.toString());
      }
    } else if (searchParams.query) {
      params.append("query", searchParams.query.trim());
      params.append("searchType", searchParams.searchType);
    }

    queryKey = [
      "/api/equipment/search",
      params.toString(),
      searchParams.latitude ?? 0,
      searchParams.longitude ?? 0,
    ];
    queryFn = async () => {
      const res = await fetch(`/api/equipment/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    };
  } else {
    queryKey = ["/api/equipment"];
    queryFn = undefined;
  }

  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey,
    queryFn,
  });

  // Apply client-side filters for type, status, and dates
  const filteredEquipment = equipment.filter((item) => {
    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(item.type)) {
      return false;
    }

    // Status filter
    if (
      filters.status !== "all" &&
      item.status.toLowerCase() !== filters.status.toLowerCase()
    ) {
      return false;
    }

    // Installation date filter
    if (filters.installationDateFrom) {
      if (!item.installationDate) {
        // If filter is set but item has no date, filter it out
        return false;
      }
      const installDate = new Date(item.installationDate);
      const fromDate = new Date(filters.installationDateFrom);
      if (installDate < fromDate) {
        return false;
      }
    }
    if (filters.installationDateTo) {
      if (!item.installationDate) {
        // If filter is set but item has no date, filter it out
        return false;
      }
      const installDate = new Date(item.installationDate);
      const toDate = new Date(filters.installationDateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire "to" date
      if (installDate > toDate) {
        return false;
      }
    }

    // Last maintenance filter
    if (filters.lastMaintenanceFrom) {
      if (!item.lastMaintenance) {
        // If filter is set but item has no date, filter it out
        return false;
      }
      const maintenanceDate = new Date(item.lastMaintenance);
      const fromDate = new Date(filters.lastMaintenanceFrom);
      if (maintenanceDate < fromDate) {
        return false;
      }
    }
    if (filters.lastMaintenanceTo) {
      if (!item.lastMaintenance) {
        // If filter is set but item has no date, filter it out
        return false;
      }
      const maintenanceDate = new Date(item.lastMaintenance);
      const toDate = new Date(filters.lastMaintenanceTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire "to" date
      if (maintenanceDate > toDate) {
        return false;
      }
    }

    return true;
  });

  const handleViewDetails = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setDetailPanelOpen(true);
  };

  const handleViewOnMap = (equipment: Equipment) => {
    setLocation(`/map?equipment=${equipment.id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="heading-equipment-list">
          Equipment List
        </h1>
        <p className="text-sm text-muted-foreground">
          Search and view all grid equipment
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <EquipmentSearch onSearch={setSearchParams} />
          <EquipmentFilters onFilterChange={setFilters} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground" data-testid="text-results-count">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  {filteredEquipment.length} result{filteredEquipment.length !== 1 ? "s" : ""}
                  {filteredEquipment.length !== equipment.length &&
                    ` of ${equipment.length} from search`}
                </>
              )}
            </p>
          </div>

          <EquipmentTable
            equipment={filteredEquipment}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onViewOnMap={handleViewOnMap}
          />
        </div>
      </div>

      <EquipmentDetailPanel
        equipment={selectedEquipment}
        open={detailPanelOpen}
        onClose={() => setDetailPanelOpen(false)}
      />
    </div>
  );
}
