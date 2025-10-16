import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { LoginForm } from "@/components/login-form";
import { EquipmentForm } from "@/components/equipment-form";
import { BulkImport } from "@/components/bulk-import";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, LogOut, Upload } from "lucide-react";
import type { Equipment, InsertEquipment } from "@shared/schema";

export default function Settings() {
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null);

  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertEquipment) => {
      return await apiRequest("POST", "/api/equipment", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      setAddDialogOpen(false);
      toast({
        title: "Equipment added",
        description: "Equipment has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertEquipment> }) => {
      return await apiRequest("PATCH", `/api/equipment/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      setEditDialogOpen(false);
      setEditingEquipment(null);
      toast({
        title: "Equipment updated",
        description: "Equipment has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/equipment/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      setDeleteDialogOpen(false);
      setDeletingEquipment(null);
      toast({
        title: "Equipment deleted",
        description: "Equipment has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const statusColors: Record<string, "default" | "destructive" | "secondary"> = {
    operational: "default",
    maintenance: "secondary",
    offline: "destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="heading-settings">
            Equipment Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Add, edit, or delete equipment from the system
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setBulkImportOpen(true)}
            data-testid="button-bulk-import"
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button
            onClick={() => setAddDialogOpen(true)}
            data-testid="button-add-equipment"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
          <Button
            variant="outline"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64" data-testid="loading-equipment">
          <p className="text-sm text-muted-foreground">Loading equipment...</p>
        </div>
      ) : (
        <div className="rounded-md border" data-testid="equipment-table-container">
          <Table data-testid="equipment-table">
            <TableHeader>
              <TableRow>
                <TableHead>Equipment ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-testid="equipment-table-body">
              {equipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground" data-testid="empty-state">
                    No equipment found. Add your first equipment to get started.
                  </TableCell>
                </TableRow>
              ) : (
                equipment.map((item) => (
                  <TableRow key={item.id} data-testid={`row-equipment-${item.id}`}>
                    <TableCell className="font-mono text-sm" data-testid={`text-equipment-id-${item.id}`}>
                      {item.equipmentId}
                    </TableCell>
                    <TableCell data-testid={`text-name-${item.id}`}>{item.name}</TableCell>
                    <TableCell data-testid={`text-type-${item.id}`}>{item.type}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[item.status]} data-testid={`badge-status-${item.id}`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell data-testid={`text-location-${item.id}`}>{item.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingEquipment(item);
                            setEditDialogOpen(true);
                          }}
                          data-testid={`button-edit-${item.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingEquipment(item);
                            setDeleteDialogOpen(true);
                          }}
                          data-testid={`button-delete-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Equipment Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Equipment</DialogTitle>
            <DialogDescription>
              Fill in the equipment details below to add it to the system.
            </DialogDescription>
          </DialogHeader>
          <EquipmentForm
            onSubmit={(data) => createMutation.mutate(data)}
            isPending={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Equipment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
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
                  (editingEquipment.installationDate instanceof Date ? editingEquipment.installationDate.toISOString().split('T')[0] : String(editingEquipment.installationDate).split('T')[0]) : 
                  undefined,
                lastMaintenance: editingEquipment.lastMaintenance ? 
                  (editingEquipment.lastMaintenance instanceof Date ? editingEquipment.lastMaintenance.toISOString().split('T')[0] : String(editingEquipment.lastMaintenance).split('T')[0]) : 
                  undefined,
                typeSpecificData: editingEquipment.typeSpecificData || undefined,
              }}
              onSubmit={(data) => updateMutation.mutate({ id: editingEquipment.id, data })}
              isPending={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the equipment{" "}
              <span className="font-semibold">{deletingEquipment?.equipmentId}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEquipment && deleteMutation.mutate(deletingEquipment.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Import Dialog */}
      <BulkImport open={bulkImportOpen} onOpenChange={setBulkImportOpen} />
    </div>
  );
}
