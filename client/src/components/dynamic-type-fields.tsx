import { Control } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EquipmentTypeWithFields } from "@shared/schema";

interface DynamicTypeFieldsProps {
  type: string;
  control: Control<any>;
}

export function DynamicTypeFields({ type, control }: DynamicTypeFieldsProps) {
  const { data: equipmentTypes = [] } = useQuery<EquipmentTypeWithFields[]>({
    queryKey: ["/api/equipment-types"],
  });

  const selectedTypeConfig = equipmentTypes.find(t => t.name === type);
  
  if (!selectedTypeConfig || !selectedTypeConfig.fieldsConfig || selectedTypeConfig.fieldsConfig.length === 0) {
    return null;
  }

  const fields = selectedTypeConfig.fieldsConfig.sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{type}-Specific Details</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((fieldConfig) => (
          <FormField
            key={fieldConfig.id}
            control={control}
            name={`typeSpecificData.${fieldConfig.dataKey}`}
            rules={{
              required: fieldConfig.isRequired ? `${fieldConfig.label} is required` : false,
            }}
            render={({ field }) => (
              <FormItem className={fieldConfig.inputType === "textarea" ? "md:col-span-2" : ""}>
                <FormLabel>
                  {fieldConfig.label}
                  {!fieldConfig.isRequired && " (Optional)"}
                </FormLabel>
                <FormControl>
                  {fieldConfig.inputType === "text" && (
                    <Input
                      placeholder={fieldConfig.placeholder || ""}
                      {...field}
                      value={field.value || ""}
                      data-testid={`input-${fieldConfig.dataKey}`}
                    />
                  )}

                  {fieldConfig.inputType === "number" && (
                    <Input
                      type="number"
                      placeholder={fieldConfig.placeholder || ""}
                      {...field}
                      value={field.value || ""}
                      data-testid={`input-${fieldConfig.dataKey}`}
                    />
                  )}

                  {fieldConfig.inputType === "decimal" && (
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={fieldConfig.placeholder || ""}
                      {...field}
                      value={field.value || ""}
                      data-testid={`input-${fieldConfig.dataKey}`}
                    />
                  )}

                  {fieldConfig.inputType === "date" && (
                    <Input
                      type="date"
                      placeholder={fieldConfig.placeholder || ""}
                      {...field}
                      value={field.value || ""}
                      data-testid={`input-${fieldConfig.dataKey}`}
                    />
                  )}

                  {fieldConfig.inputType === "textarea" && (
                    <Textarea
                      placeholder={fieldConfig.placeholder || ""}
                      {...field}
                      value={field.value || ""}
                      data-testid={`input-${fieldConfig.dataKey}`}
                    />
                  )}

                  {fieldConfig.inputType === "boolean" && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value === "true" || field.value === true}
                        onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        data-testid={`input-${fieldConfig.dataKey}`}
                      />
                      <span className="text-sm text-muted-foreground">Yes</span>
                    </div>
                  )}

                  {fieldConfig.inputType === "select" && fieldConfig.options && (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <SelectTrigger data-testid={`select-${fieldConfig.dataKey}`}>
                        <SelectValue placeholder={fieldConfig.placeholder || "Select an option"} />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldConfig.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {fieldConfig.inputType === "multiselect" && fieldConfig.options && (
                    <div className="space-y-2">
                      {fieldConfig.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            checked={(field.value || "").split(",").includes(option)}
                            onCheckedChange={(checked) => {
                              const current = (field.value || "").split(",").filter(Boolean);
                              if (checked) {
                                field.onChange([...current, option].join(","));
                              } else {
                                field.onChange(current.filter((v: string) => v !== option).join(","));
                              }
                            }}
                            data-testid={`checkbox-${fieldConfig.dataKey}-${option}`}
                          />
                          <label className="text-sm">{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </FormControl>
                {fieldConfig.helpText && (
                  <FormDescription>{fieldConfig.helpText}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
