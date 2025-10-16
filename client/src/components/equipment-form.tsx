import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEquipmentSchema, type InsertEquipment } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface EquipmentFormProps {
  defaultValues?: Partial<InsertEquipment>;
  onSubmit: (data: InsertEquipment) => void;
  isPending?: boolean;
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
  { value: "operational", label: "Operational" },
  { value: "maintenance", label: "Maintenance" },
  { value: "offline", label: "Offline" },
];

// Enhanced validation to ensure lat/lon are valid decimal strings
const formSchema = insertEquipmentSchema.extend({
  latitude: z.string().regex(/^-?\d+\.?\d*$/, "Must be a valid number"),
  longitude: z.string().regex(/^-?\d+\.?\d*$/, "Must be a valid number"),
});

export function EquipmentForm({ defaultValues, onSubmit, isPending }: EquipmentFormProps) {
  const form = useForm<InsertEquipment>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      equipmentId: "",
      name: "",
      type: "",
      status: "operational",
      location: "",
      address: "",
      latitude: "",
      longitude: "",
      manufacturer: "",
      model: "",
      capacity: "",
      voltage: "",
      installationDate: undefined,
      lastMaintenance: undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="equipmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="TRF-001-NYC"
                    data-testid="input-equipment-id"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Central Park Transformer"
                    data-testid="input-equipment-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-equipment-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {equipmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-equipment-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Manhattan"
                    data-testid="input-location"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="123 Main St, New York, NY"
                    data-testid="input-address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="40.7128"
                    data-testid="input-latitude"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="-74.0060"
                    data-testid="input-longitude"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="ABB"
                    data-testid="input-manufacturer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="TXP-500"
                    data-testid="input-model"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="500 MVA"
                    data-testid="input-capacity"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voltage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voltage (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="345 kV"
                    data-testid="input-voltage"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="installationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Installation Date (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                    data-testid="input-installation-date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastMaintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Maintenance (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                    data-testid="input-last-maintenance"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={isPending}
            data-testid="button-submit-equipment"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {defaultValues ? "Update Equipment" : "Add Equipment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
