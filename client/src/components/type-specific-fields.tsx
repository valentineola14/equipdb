import { Control } from "react-hook-form";
import {
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

interface TypeSpecificFieldsProps {
  type: string;
  control: Control<any>;
}

export function TypeSpecificFields({ type, control }: TypeSpecificFieldsProps) {
  if (type === "Transformer") {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Transformer-Specific Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="typeSpecificData.primaryVoltage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Voltage (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 138 kV"
                    data-testid="input-primary-voltage"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.secondaryVoltage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Voltage (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 13.8 kV"
                    data-testid="input-secondary-voltage"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.kvaRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>kVA Rating (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 50000 kVA"
                    data-testid="input-kva-rating"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.coolingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cooling Type (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-cooling-type">
                      <SelectValue placeholder="Select cooling type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ONAN">ONAN (Oil Natural Air Natural)</SelectItem>
                    <SelectItem value="ONAF">ONAF (Oil Natural Air Forced)</SelectItem>
                    <SelectItem value="OFAF">OFAF (Oil Forced Air Forced)</SelectItem>
                    <SelectItem value="OFWF">OFWF (Oil Forced Water Forced)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.tapChangerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tap Changer Type (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-tap-changer">
                      <SelectValue placeholder="Select tap changer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="OLTC">On-Load Tap Changer (OLTC)</SelectItem>
                    <SelectItem value="DETC">De-Energized Tap Changer (DETC)</SelectItem>
                    <SelectItem value="None">No Tap Changer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  if (type === "Substation") {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Substation-Specific Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="typeSpecificData.voltageLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voltage Level (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 138/13.8 kV"
                    data-testid="input-voltage-level"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.numberOfTransformers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Transformers (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 2"
                    data-testid="input-num-transformers"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.switchgearType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Switchgear Type (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-switchgear-type">
                      <SelectValue placeholder="Select switchgear" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AIS">Air-Insulated Switchgear (AIS)</SelectItem>
                    <SelectItem value="GIS">Gas-Insulated Switchgear (GIS)</SelectItem>
                    <SelectItem value="Hybrid">Hybrid Switchgear</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.controlSystem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control System (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., SCADA"
                    data-testid="input-control-system"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.busConfiguration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bus Configuration (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-bus-config">
                      <SelectValue placeholder="Select configuration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Single">Single Bus</SelectItem>
                    <SelectItem value="Double">Double Bus</SelectItem>
                    <SelectItem value="Ring">Ring Bus</SelectItem>
                    <SelectItem value="Breaker-and-a-Half">Breaker-and-a-Half</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  if (type === "Generator") {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Generator-Specific Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="typeSpecificData.fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-fuel-type">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Natural Gas">Natural Gas</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Coal">Coal</SelectItem>
                    <SelectItem value="Nuclear">Nuclear</SelectItem>
                    <SelectItem value="Hydro">Hydro</SelectItem>
                    <SelectItem value="Wind">Wind</SelectItem>
                    <SelectItem value="Solar">Solar</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.ratedPowerMW"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rated Power (MW) (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 500 MW"
                    data-testid="input-rated-power"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.efficiency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Efficiency (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 95%"
                    data-testid="input-efficiency"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.startType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Type (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-start-type">
                      <SelectValue placeholder="Select start type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.coolantType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coolant Type (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-coolant-type">
                      <SelectValue placeholder="Select coolant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Air">Air</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Hydrogen">Hydrogen</SelectItem>
                    <SelectItem value="Oil">Oil</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  if (type === "Circuit Breaker") {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Circuit Breaker-Specific Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="typeSpecificData.breakingCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breaking Capacity (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 40 kA"
                    data-testid="input-breaking-capacity"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.ratedCurrent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rated Current (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 3000 A"
                    data-testid="input-rated-current"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.numberOfPoles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Poles (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-num-poles">
                      <SelectValue placeholder="Select poles" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1-Pole</SelectItem>
                    <SelectItem value="2">2-Pole</SelectItem>
                    <SelectItem value="3">3-Pole</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.mechanismType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mechanism Type (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-mechanism-type">
                      <SelectValue placeholder="Select mechanism" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Spring">Spring Operated</SelectItem>
                    <SelectItem value="Pneumatic">Pneumatic</SelectItem>
                    <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.insulatingMedium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insulating Medium (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-insulating-medium">
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Oil">Oil</SelectItem>
                    <SelectItem value="SF6">SF6 Gas</SelectItem>
                    <SelectItem value="Vacuum">Vacuum</SelectItem>
                    <SelectItem value="Air">Air</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  if (type === "Switch") {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Switch-Specific Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="typeSpecificData.switchType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Switch Type (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-switch-type">
                      <SelectValue placeholder="Select switch type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Disconnect">Disconnect Switch</SelectItem>
                    <SelectItem value="Load Break">Load Break Switch</SelectItem>
                    <SelectItem value="Earthing">Earthing Switch</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.ratedCurrent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rated Current (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 2000 A"
                    data-testid="input-switch-rated-current"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.numberOfPoles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Poles (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-switch-poles">
                      <SelectValue placeholder="Select poles" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1-Pole</SelectItem>
                    <SelectItem value="2">2-Pole</SelectItem>
                    <SelectItem value="3">3-Pole</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.operatingMechanism"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operating Mechanism (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-operating-mechanism">
                      <SelectValue placeholder="Select mechanism" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Motorized">Motorized</SelectItem>
                    <SelectItem value="Remote">Remote Control</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeSpecificData.insulationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insulation Type (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger data-testid="select-insulation-type">
                      <SelectValue placeholder="Select insulation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Air">Air</SelectItem>
                    <SelectItem value="SF6">SF6 Gas</SelectItem>
                    <SelectItem value="Solid">Solid Insulation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  return null;
}
