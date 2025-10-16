import { type Equipment, type EquipmentTypeWithFields, type FieldConfig } from "@shared/schema";
import { X, MapPin, Calendar, Wrench, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EquipmentStatusBadge } from "./equipment-status-badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

interface EquipmentDetailPanelProps {
  equipment: Equipment | null;
  open: boolean;
  onClose: () => void;
}

export function EquipmentDetailPanel({
  equipment,
  open,
  onClose,
}: EquipmentDetailPanelProps) {
  const { data: equipmentTypes } = useQuery<EquipmentTypeWithFields[]>({
    queryKey: ["/api/equipment-types"],
  });

  if (!equipment) return null;

  const equipmentType = equipmentTypes?.find((t) => t.name === equipment.type);
  const fieldConfigs: FieldConfig[] = equipmentType?.fieldsConfig ?? [];
  const sortedFields = [...fieldConfigs].sort((a, b) => a.order - b.order);
  const typeSpecificData: Record<string, any> = (equipment.typeSpecificData as Record<string, any>) || {};

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto" data-testid="panel-equipment-details">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-xl font-semibold">
                {equipment.name}
              </SheetTitle>
              <p className="font-mono text-sm text-muted-foreground" data-testid="text-equipment-id">
                {equipment.equipmentId}
              </p>
            </div>
            <EquipmentStatusBadge status={equipment.status} showIcon />
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" data-testid="tab-overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="technical" data-testid="tab-technical">
              Technical
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Equipment Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium" data-testid="text-equipment-type">
                      {equipment.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize" data-testid="text-equipment-status">
                      {equipment.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium" data-testid="text-equipment-location">
                      {equipment.location}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Address
                    </span>
                    <span className="font-medium" data-testid="text-equipment-address">
                      {equipment.address}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Coordinates
                    </span>
                    <span className="font-mono text-xs" data-testid="text-equipment-coordinates">
                      {Number(equipment.latitude).toFixed(6)},{" "}
                      {Number(equipment.longitude).toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Maintenance Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Installation Date</span>
                    <span className="font-medium" data-testid="text-installation-date">
                      {equipment.installationDate
                        ? new Date(equipment.installationDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Maintenance</span>
                    <span className="font-medium" data-testid="text-last-maintenance">
                      {equipment.lastMaintenance
                        ? new Date(equipment.lastMaintenance).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Technical Specifications
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manufacturer</span>
                    <span className="font-medium" data-testid="text-manufacturer">
                      {equipment.manufacturer || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-medium" data-testid="text-model">
                      {equipment.model || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium" data-testid="text-capacity">
                      {equipment.capacity || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voltage</span>
                    <span className="font-medium" data-testid="text-voltage">
                      {equipment.voltage || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {sortedFields.length > 0 && (
                <>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      {equipment.type}-Specific Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      {sortedFields.map((fieldConfig) => {
                        const value = typeSpecificData[fieldConfig.dataKey];
                        let displayValue = "N/A";

                        // Format display based on input type
                        if (value !== null && value !== undefined && value !== "") {
                          if (fieldConfig.inputType === "boolean") {
                            displayValue = (value === "true" || value === true) ? "Yes" : "No";
                          } else if (fieldConfig.inputType === "multiselect") {
                            displayValue = value.split(",").filter(Boolean).join(", ");
                          } else if (fieldConfig.inputType === "date") {
                            displayValue = new Date(value).toLocaleDateString();
                          } else {
                            displayValue = String(value);
                          }
                        } else if (fieldConfig.inputType === "boolean" && value === "") {
                          // Handle empty string for boolean (should show N/A, not "No")
                          displayValue = "N/A";
                        }

                        return (
                          <div key={fieldConfig.id} className="flex justify-between">
                            <span className="text-muted-foreground">
                              {fieldConfig.label}
                              {fieldConfig.isRequired && " *"}
                            </span>
                            <span className="font-medium" data-testid={`text-${fieldConfig.dataKey}`}>
                              {displayValue}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="rounded-md bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">
                  This equipment is part of the electric grid infrastructure.
                  Regular maintenance and monitoring ensure optimal performance
                  and reliability.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
