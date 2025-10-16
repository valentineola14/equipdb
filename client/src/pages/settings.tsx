import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { LoginForm } from "@/components/login-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import type { EquipmentType, EquipmentTypeWithFields } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FieldConfigEditor } from "@/components/field-config-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const equipmentTypeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type EquipmentTypeFormData = z.infer<typeof equipmentTypeFormSchema>;

export default function Settings() {
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [addTypeDialogOpen, setAddTypeDialogOpen] = useState(false);
  const [editTypeDialogOpen, setEditTypeDialogOpen] = useState(false);
  const [deleteTypeDialogOpen, setDeleteTypeDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<EquipmentType | null>(null);
  const [deletingType, setDeletingType] = useState<EquipmentType | null>(null);
  const [selectedTypeForFields, setSelectedTypeForFields] = useState<string>("");

  const { data: equipmentTypes = [], isLoading } = useQuery<EquipmentType[]>({
    queryKey: ["/api/equipment-types"],
    enabled: isAuthenticated,
  });

  const createTypeMutation = useMutation({
    mutationFn: async (data: EquipmentTypeFormData) => {
      return await apiRequest("POST", "/api/equipment-types", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment-types"] });
      setAddTypeDialogOpen(false);
      toast({
        title: "Equipment type added",
        description: "Equipment type has been added successfully.",
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

  const updateTypeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EquipmentTypeFormData }) => {
      return await apiRequest("PATCH", `/api/equipment-types/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment-types"] });
      setEditTypeDialogOpen(false);
      setEditingType(null);
      toast({
        title: "Equipment type updated",
        description: "Equipment type has been updated successfully.",
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

  const deleteTypeMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/equipment-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment-types"] });
      setDeleteTypeDialogOpen(false);
      setDeletingType(null);
      toast({
        title: "Equipment type deleted",
        description: "Equipment type has been deleted successfully.",
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

  const addForm = useForm<EquipmentTypeFormData>({
    resolver: zodResolver(equipmentTypeFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const editForm = useForm<EquipmentTypeFormData>({
    resolver: zodResolver(equipmentTypeFormSchema),
  });

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage equipment field configurations</p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="equipment-types" className="space-y-4">
          <TabsList>
            <TabsTrigger value="equipment-types" data-testid="tab-equipment-types">
              Equipment Types
            </TabsTrigger>
            <TabsTrigger value="field-config" data-testid="tab-field-config">
              Field Configuration
            </TabsTrigger>
            <TabsTrigger value="status-options" data-testid="tab-status-options">
              Status Options
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment-types" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Equipment Types</CardTitle>
                    <CardDescription>
                      Manage the types available in equipment dropdown (e.g., Transformer, Generator)
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      addForm.reset({ name: "", description: "" });
                      setAddTypeDialogOpen(true);
                    }}
                    data-testid="button-add-type"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Type
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : equipmentTypes.length === 0 ? (
                  <p className="text-muted-foreground">No equipment types configured</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipmentTypes.map((type) => (
                        <TableRow key={type.id}>
                          <TableCell className="font-medium" data-testid={`text-type-name-${type.id}`}>
                            {type.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground" data-testid={`text-type-description-${type.id}`}>
                            {type.description || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingType(type);
                                  editForm.reset({
                                    name: type.name,
                                    description: type.description || "",
                                  });
                                  setEditTypeDialogOpen(true);
                                }}
                                data-testid={`button-edit-type-${type.id}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setDeletingType(type);
                                  setDeleteTypeDialogOpen(true);
                                }}
                                data-testid={`button-delete-type-${type.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="field-config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Field Configuration</CardTitle>
                <CardDescription>
                  Configure custom fields for each equipment type (e.g., Primary KV for Transformer, BusID for Circuit Breaker)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Equipment Type</label>
                    <Select
                      value={selectedTypeForFields}
                      onValueChange={setSelectedTypeForFields}
                    >
                      <SelectTrigger className="w-full max-w-md" data-testid="select-equipment-type">
                        <SelectValue placeholder="Choose an equipment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTypeForFields && (
                    <FieldConfigEditor
                      equipmentType={
                        equipmentTypes.find(t => t.id === selectedTypeForFields) as EquipmentTypeWithFields
                      }
                    />
                  )}

                  {!selectedTypeForFields && (
                    <div className="text-center py-8 text-muted-foreground">
                      Select an equipment type to configure its fields
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status-options" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status Options</CardTitle>
                <CardDescription>
                  Manage the status values available in equipment forms (e.g., Operational, Maintenance, Offline)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Status options management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Equipment Type Dialog */}
        <Dialog open={addTypeDialogOpen} onOpenChange={setAddTypeDialogOpen}>
          <DialogContent data-testid="dialog-add-type">
            <DialogHeader>
              <DialogTitle>Add Equipment Type</DialogTitle>
              <DialogDescription>
                Add a new equipment type to the dropdown options
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit((data) => createTypeMutation.mutate(data))}
                className="space-y-4"
              >
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Transformer"
                          {...field}
                          data-testid="input-type-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of this equipment type"
                          {...field}
                          data-testid="input-type-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddTypeDialogOpen(false)}
                    data-testid="button-cancel-add"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createTypeMutation.isPending}
                    data-testid="button-submit-add"
                  >
                    {createTypeMutation.isPending ? "Adding..." : "Add Type"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Equipment Type Dialog */}
        <Dialog open={editTypeDialogOpen} onOpenChange={setEditTypeDialogOpen}>
          <DialogContent data-testid="dialog-edit-type">
            <DialogHeader>
              <DialogTitle>Edit Equipment Type</DialogTitle>
              <DialogDescription>
                Update the equipment type configuration
              </DialogDescription>
            </DialogHeader>
            {editingType && (
              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit((data) =>
                    updateTypeMutation.mutate({ id: editingType.id, data })
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Transformer"
                            {...field}
                            data-testid="input-edit-type-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of this equipment type"
                            {...field}
                            data-testid="input-edit-type-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditTypeDialogOpen(false)}
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateTypeMutation.isPending}
                      data-testid="button-submit-edit"
                    >
                      {updateTypeMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Equipment Type Dialog */}
        <AlertDialog open={deleteTypeDialogOpen} onOpenChange={setDeleteTypeDialogOpen}>
          <AlertDialogContent data-testid="dialog-delete-type">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Equipment Type</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingType?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingType && deleteTypeMutation.mutate(deletingType.id)}
                data-testid="button-confirm-delete"
              >
                {deleteTypeMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
