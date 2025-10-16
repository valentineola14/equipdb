import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Equipment } from "@shared/schema";
import { EquipmentMap } from "@/components/equipment-map";
import { EquipmentSearch } from "@/components/equipment-search";
import { EquipmentFilters, type FilterOptions } from "@/components/equipment-filters";
import { EquipmentDetailPanel } from "@/components/equipment-detail-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EquipmentStatusBadge } from "@/components/equipment-status-badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useLocation } from "wouter";

interface SearchParams {
  query?: string;
  searchType: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export default function MapView() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchType: "all",
  });
  const [filters, setFilters] = useState<FilterOptions>({
    types: [],
    status: "all",
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

  // Check if there's an equipment ID in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const equipmentId = params.get("equipment");
    if (equipmentId && equipment.length > 0) {
      const item = equipment.find((e) => e.id === equipmentId);
      if (item) {
        setSelectedEquipment(item);
      }
    }
  }, [location, equipment]);

  // Apply client-side filters for type and status
  const filteredEquipment = equipment.filter((item) => {
    if (filters.types.length > 0 && !filters.types.includes(item.type)) {
      return false;
    }

    if (
      filters.status !== "all" &&
      item.status.toLowerCase() !== filters.status.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  const handleViewDetails = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setDetailPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="heading-map-view">
          Map View
        </h1>
        <p className="text-sm text-muted-foreground">
          Visual location of all grid equipment
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          <EquipmentSearch onSearch={setSearchParams} />
          <Card className="overflow-hidden">
            <EquipmentMap
              equipment={filteredEquipment}
              selectedEquipment={selectedEquipment}
              onViewDetails={handleViewDetails}
              className="h-[calc(100vh-16rem)]"
            />
          </Card>
        </div>

        <div className="space-y-4">
          <EquipmentFilters onFilterChange={setFilters} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Equipment ({filteredEquipment.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-24rem)]">
                <div className="space-y-2 p-4">
                  {isLoading ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      Loading...
                    </p>
                  ) : filteredEquipment.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      No equipment found
                    </p>
                  ) : (
                    filteredEquipment.map((item) => (
                      <Card
                        key={item.id}
                        className={`cursor-pointer transition-colors hover-elevate ${
                          selectedEquipment?.id === item.id
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() => setSelectedEquipment(item)}
                        data-testid={`card-equipment-${item.equipmentId}`}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-mono text-xs text-muted-foreground truncate">
                                  {item.equipmentId}
                                </p>
                                <p className="font-semibold truncate">{item.name}</p>
                              </div>
                              <EquipmentStatusBadge status={item.status} />
                            </div>
                            <div className="space-y-1 text-xs">
                              <p className="text-muted-foreground">{item.type}</p>
                              <p className="truncate text-muted-foreground">
                                {item.address}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(item);
                              }}
                              data-testid={`button-details-${item.equipmentId}`}
                            >
                              <Eye className="mr-2 h-3 w-3" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
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
