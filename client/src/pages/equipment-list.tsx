import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Equipment, type InsertEquipment } from "@shared/schema";
import { EquipmentSearch } from "@/components/equipment-search";
import { EquipmentFilters, type FilterOptions } from "@/components/equipment-filters";
import { EquipmentTable } from "@/components/equipment-table";
import { EquipmentDetailPanel } from "@/components/equipment-detail-panel";
import { EquipmentForm } from "@/components/equipment-form";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SearchParams {
  query?: string;
  searchType: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export default function EquipmentList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchType: "all",
  });
  const [filters, setFilters] = useState<FilterOptions>({
    types: [],
    status: "all",
  });
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

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

  const handleViewOnMap = (equipment: Equipment) => {
    setLocation(`/map?equipment=${equipment.id}`);
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertEquipment) => {
      const res = await apiRequest("POST", "/api/equipment", data);
      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      await queryClient.refetchQueries({ queryKey: ["/api/equipment"] });
      setCreateDialogOpen(false);
      toast({
        title: "Equipment created",
        description: "New equipment has been successfully added.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create equipment",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertEquipment> }) => {
      const res = await apiRequest("PATCH", `/api/equipment/${id}`, data);
      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      await queryClient.refetchQueries({ queryKey: ["/api/equipment"] });
      setEditDialogOpen(false);
      setEditingEquipment(null);
      toast({
        title: "Equipment updated",
        description: "Equipment has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update equipment",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="heading-equipment-list">
            Equipment List
          </h1>
          <p className="text-sm text-muted-foreground">
            Search and manage all grid equipment
          </p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          data-testid="button-add-equipment"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
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
            onEdit={handleEdit}
          />
        </div>
      </div>

      <EquipmentDetailPanel
        equipment={selectedEquipment}
        open={detailPanelOpen}
        onClose={() => setDetailPanelOpen(false)}
      />

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="dialog-title-add-equipment">Add Equipment</DialogTitle>
            <DialogDescription>
              Enter the details for the new equipment. All fields marked as required must be filled.
            </DialogDescription>
          </DialogHeader>
          {createDialogOpen && (
            <EquipmentForm
              key="create-equipment-form"
              onSubmit={(data) => createMutation.mutate(data)}
              isPending={createMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="dialog-title-edit-equipment">Edit Equipment</DialogTitle>
            <DialogDescription>
              Update the equipment details below.
            </DialogDescription>
          </DialogHeader>
          {editDialogOpen && editingEquipment && (
            <EquipmentForm
              key={`edit-equipment-form-${editingEquipment.id}`}
              defaultValues={{
                equipmentId: editingEquipment.equipmentId,
                name: editingEquipment.name,
                type: editingEquipment.type,
                status: editingEquipment.status,
                location: editingEquipment.location,
                address: editingEquipment.address,
                latitude: editingEquipment.latitude,
                longitude: editingEquipment.longitude,
                manufacturer: editingEquipment.manufacturer || "",
                model: editingEquipment.model || "",
                capacity: editingEquipment.capacity || "",
                voltage: editingEquipment.voltage || "",
                installationDate: editingEquipment.installationDate ? 
                  (typeof editingEquipment.installationDate === 'string' ? editingEquipment.installationDate.split('T')[0] : new Date(editingEquipment.installationDate).toISOString().split('T')[0]) : 
                  undefined,
                lastMaintenance: editingEquipment.lastMaintenance ? 
                  (typeof editingEquipment.lastMaintenance === 'string' ? editingEquipment.lastMaintenance.split('T')[0] : new Date(editingEquipment.lastMaintenance).toISOString().split('T')[0]) : 
                  undefined,
              }}
              onSubmit={(data) => updateMutation.mutate({ id: editingEquipment.id, data })}
              isPending={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
