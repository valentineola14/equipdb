import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FieldConfig, EquipmentTypeWithFields } from "@shared/schema";
import { fieldConfigSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const fieldFormSchema = fieldConfigSchema.omit({ id: true, order: true });
type FieldFormData = z.infer<typeof fieldFormSchema>;

const INPUT_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "decimal", label: "Decimal" },
  { value: "date", label: "Date" },
  { value: "select", label: "Select (Dropdown)" },
  { value: "multiselect", label: "Multi-Select" },
  { value: "boolean", label: "Boolean (Yes/No)" },
  { value: "textarea", label: "Text Area" },
];

interface FieldConfigEditorProps {
  equipmentType: EquipmentTypeWithFields;
}

export function FieldConfigEditor({ equipmentType }: FieldConfigEditorProps) {
  const { toast } = useToast();
  const [fields, setFields] = useState<FieldConfig[]>(equipmentType.fieldsConfig || []);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [optionsInput, setOptionsInput] = useState("");

  // Update fields when equipment type changes
  useEffect(() => {
    setFields(equipmentType.fieldsConfig || []);
    // Close any open dialogs when switching types
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setEditingField(null);
    setOptionsInput("");
  }, [equipmentType.id]);

  const addForm = useForm<FieldFormData>({
    resolver: zodResolver(fieldFormSchema),
    defaultValues: {
      label: "",
      dataKey: "",
      inputType: "text",
      isRequired: false,
      placeholder: "",
      helpText: "",
    },
  });

  const editForm = useForm<FieldFormData>({
    resolver: zodResolver(fieldFormSchema),
  });

  const saveFieldsMutation = useMutation({
    mutationFn: async (fieldsConfig: FieldConfig[]) => {
      return await apiRequest("PATCH", `/api/equipment-types/${equipmentType.id}/fields`, { fieldsConfig });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment-types"] });
      toast({
        title: "Fields saved",
        description: "Field configurations have been saved successfully.",
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

  const handleAddField = (data: FieldFormData) => {
    const newField: FieldConfig = {
      ...data,
      id: crypto.randomUUID(),
      order: fields.length,
      options: data.options || undefined,
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    saveFieldsMutation.mutate(updatedFields);
    setAddDialogOpen(false);
    addForm.reset();
    setOptionsInput("");
  };

  const handleEditField = (data: FieldFormData) => {
    if (!editingField) return;
    const updatedFields = fields.map(f =>
      f.id === editingField.id ? { ...f, ...data, options: data.options || undefined } : f
    );
    setFields(updatedFields);
    saveFieldsMutation.mutate(updatedFields);
    setEditDialogOpen(false);
    setEditingField(null);
    setOptionsInput("");
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedFields = fields.filter(f => f.id !== fieldId).map((f, idx) => ({ ...f, order: idx }));
    setFields(updatedFields);
    saveFieldsMutation.mutate(updatedFields);
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const updatedFields = [...fields];
    [updatedFields[index], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[index]];
    const reorderedFields = updatedFields.map((f, idx) => ({ ...f, order: idx }));
    setFields(reorderedFields);
    saveFieldsMutation.mutate(reorderedFields);
  };

  const renderFieldForm = (form: any, isEdit = false) => {
    const inputType = form.watch("inputType");
    const needsOptions = inputType === "select" || inputType === "multiselect";

    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Label</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Primary KV" {...field} data-testid="input-field-label" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Key</FormLabel>
              <FormControl>
                <Input placeholder="e.g., primaryKV" {...field} data-testid="input-field-datakey" />
              </FormControl>
              <FormDescription>
                Unique identifier for storing this field's value
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inputType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Input Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-field-type">
                    <SelectValue placeholder="Select input type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INPUT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {needsOptions && (
          <FormField
            control={form.control}
            name="options"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Options (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Option1, Option2, Option3"
                    value={optionsInput}
                    onChange={(e) => {
                      setOptionsInput(e.target.value);
                      const opts = e.target.value.split(',').map(o => o.trim()).filter(Boolean);
                      field.onChange(opts.length > 0 ? opts : undefined);
                    }}
                    data-testid="input-field-options"
                  />
                </FormControl>
                <FormDescription>
                  Enter dropdown options separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="isRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="checkbox-field-required"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Required Field</FormLabel>
                <FormDescription>
                  Users must provide a value for this field
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Enter primary voltage"
                  {...field}
                  data-testid="input-field-placeholder"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="helpText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Help Text (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional guidance for this field"
                  {...field}
                  data-testid="input-field-helptext"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{equipmentType.name} Fields</h3>
          <p className="text-sm text-muted-foreground">
            Configure custom fields for {equipmentType.name} equipment
          </p>
        </div>
        <Button
          onClick={() => {
            addForm.reset({
              label: "",
              dataKey: "",
              inputType: "text",
              isRequired: false,
              placeholder: "",
              helpText: "",
            });
            setOptionsInput("");
            setAddDialogOpen(true);
          }}
          data-testid="button-add-field"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No fields configured. Click "Add Field" to create custom fields.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Data Key</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Required</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveField(index, "up")}
                      disabled={index === 0}
                      data-testid={`button-move-up-${field.id}`}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveField(index, "down")}
                      disabled={index === fields.length - 1}
                      data-testid={`button-move-down-${field.id}`}
                    >
                      ↓
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium" data-testid={`text-field-label-${field.id}`}>
                  {field.label}
                </TableCell>
                <TableCell className="font-mono text-sm" data-testid={`text-field-datakey-${field.id}`}>
                  {field.dataKey}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{field.inputType}</Badge>
                </TableCell>
                <TableCell>
                  {field.isRequired ? (
                    <Badge variant="default">Required</Badge>
                  ) : (
                    <Badge variant="outline">Optional</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingField(field);
                        editForm.reset({
                          label: field.label,
                          dataKey: field.dataKey,
                          inputType: field.inputType,
                          isRequired: field.isRequired,
                          options: field.options,
                          placeholder: field.placeholder,
                          helpText: field.helpText,
                        });
                        setOptionsInput(field.options?.join(', ') || "");
                        setEditDialogOpen(true);
                      }}
                      data-testid={`button-edit-field-${field.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteField(field.id)}
                      data-testid={`button-delete-field-${field.id}`}
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

      {/* Add Field Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent data-testid="dialog-add-field">
          <DialogHeader>
            <DialogTitle>Add Field</DialogTitle>
            <DialogDescription>
              Add a custom field for {equipmentType.name} equipment
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddField)} className="space-y-4">
              {renderFieldForm(addForm)}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                  data-testid="button-cancel-add-field"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saveFieldsMutation.isPending}
                  data-testid="button-submit-add-field"
                >
                  {saveFieldsMutation.isPending ? "Adding..." : "Add Field"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Field Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent data-testid="dialog-edit-field">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update field configuration
            </DialogDescription>
          </DialogHeader>
          {editingField && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditField)} className="space-y-4">
                {renderFieldForm(editForm, true)}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    data-testid="button-cancel-edit-field"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saveFieldsMutation.isPending}
                    data-testid="button-submit-edit-field"
                  >
                    {saveFieldsMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
