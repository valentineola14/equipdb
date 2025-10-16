import { useState } from "react";
import { Upload, Download, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from "xlsx";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertEquipment } from "@shared/schema";

interface BulkImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedRow {
  data: Partial<InsertEquipment>;
  errors: string[];
  row: number;
}

export function BulkImport({ open, onOpenChange }: BulkImportProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);

  const validateRow = (row: any, rowIndex: number): ParsedRow => {
    const errors: string[] = [];
    const data: Partial<InsertEquipment> = {};

    // Required fields
    if (!row.equipmentId || typeof row.equipmentId !== 'string') {
      errors.push("equipmentId is required");
    } else {
      data.equipmentId = row.equipmentId.trim();
    }

    if (!row.name || typeof row.name !== 'string') {
      errors.push("name is required");
    } else {
      data.name = row.name.trim();
    }

    const validTypes = ["Transformer", "Substation", "Generator", "Circuit Breaker", "Capacitor Bank", "Voltage Regulator"];
    if (!row.type || !validTypes.includes(row.type)) {
      errors.push(`type must be one of: ${validTypes.join(", ")}`);
    } else {
      data.type = row.type;
    }

    const validStatuses = ["operational", "maintenance", "offline"];
    if (!row.status || !validStatuses.includes(row.status.toLowerCase())) {
      errors.push(`status must be one of: ${validStatuses.join(", ")}`);
    } else {
      data.status = row.status.toLowerCase();
    }

    if (!row.location || typeof row.location !== 'string') {
      errors.push("location is required");
    } else {
      data.location = row.location.trim();
    }

    if (!row.address || typeof row.address !== 'string') {
      errors.push("address is required");
    } else {
      data.address = row.address.trim();
    }

    if (row.latitude === undefined || isNaN(parseFloat(row.latitude))) {
      errors.push("latitude must be a valid number");
    } else {
      data.latitude = parseFloat(row.latitude).toString();
    }

    if (row.longitude === undefined || isNaN(parseFloat(row.longitude))) {
      errors.push("longitude must be a valid number");
    } else {
      data.longitude = parseFloat(row.longitude).toString();
    }

    // Optional fields
    if (row.manufacturer) data.manufacturer = row.manufacturer.trim();
    if (row.model) data.model = row.model.trim();
    if (row.capacity) data.capacity = row.capacity.trim();
    if (row.voltage) data.voltage = row.voltage.trim();
    if (row.installationDate) data.installationDate = new Date(row.installationDate);
    if (row.lastMaintenance) data.lastMaintenance = new Date(row.lastMaintenance);

    return { data, errors, row: rowIndex };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const parsed = jsonData.map((row, index) => validateRow(row, index + 2)); // +2 for header row and 1-indexing
        setParsedData(parsed);
      } catch (error) {
        toast({
          title: "Parse Error",
          description: error instanceof Error ? error.message : "Failed to parse file",
          variant: "destructive",
        });
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleImport = async () => {
    const validRows = parsedData.filter((row) => row.errors.length === 0);
    if (validRows.length === 0) {
      toast({
        title: "No Valid Data",
        description: "Please fix validation errors before importing",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    let successCount = 0;
    let failedCount = 0;

    for (const row of validRows) {
      try {
        await apiRequest("POST", "/api/equipment", row.data);
        successCount++;
      } catch (error) {
        failedCount++;
        console.error(`Failed to import row ${row.row}:`, error);
      }
    }

    setImporting(false);
    setImportResults({ success: successCount, failed: failedCount });
    queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });

    toast({
      title: "Import Complete",
      description: `Successfully imported ${successCount} of ${validRows.length} valid records`,
    });
  };

  const downloadTemplate = () => {
    const template = [
      {
        equipmentId: "TRF-001-NYC",
        name: "Main Transformer",
        type: "Transformer",
        status: "operational",
        location: "Manhattan",
        address: "123 Main St, New York, NY",
        latitude: 40.7580,
        longitude: -73.9855,
        manufacturer: "ABB",
        model: "T-500",
        capacity: "500 kVA",
        voltage: "13.8 kV",
        installationDate: "2020-01-15",
        lastMaintenance: "2024-10-01",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Equipment");
    XLSX.writeFile(wb, "equipment_import_template.xlsx");
  };

  const validCount = parsedData.filter((row) => row.errors.length === 0).length;
  const errorCount = parsedData.filter((row) => row.errors.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Import Equipment</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file with equipment data. Download the template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              data-testid="button-download-template"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>

            <div className="flex-1">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                data-testid="input-file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  data-testid="button-choose-file"
                >
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {file ? file.name : "Choose File"}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {parsedData.length > 0 && (
            <>
              <Alert>
                <AlertDescription className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{validCount} valid records</span>
                  </div>
                  {errorCount > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm">{errorCount} records with errors</span>
                    </div>
                  )}
                </AlertDescription>
              </Alert>

              <ScrollArea className="flex-1 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Row</TableHead>
                      <TableHead>Equipment ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((item) => (
                      <TableRow key={item.row} className={item.errors.length > 0 ? "bg-destructive/10" : ""}>
                        <TableCell className="font-mono text-xs">{item.row}</TableCell>
                        <TableCell className="font-mono text-xs">{item.data.equipmentId || "-"}</TableCell>
                        <TableCell>{item.data.name || "-"}</TableCell>
                        <TableCell>{item.data.type || "-"}</TableCell>
                        <TableCell>{item.data.status || "-"}</TableCell>
                        <TableCell>
                          {item.errors.length > 0 ? (
                            <div className="text-xs text-destructive">{item.errors.join(", ")}</div>
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </>
          )}

          {importResults && (
            <Alert>
              <AlertDescription>
                <div className="text-sm">
                  <p className="font-semibold">Import Results:</p>
                  <p>✓ {importResults.success} successfully imported</p>
                  {importResults.failed > 0 && <p>✗ {importResults.failed} failed</p>}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setFile(null);
              setParsedData([]);
              setImportResults(null);
              onOpenChange(false);
            }}
            data-testid="button-cancel-import"
          >
            {importResults ? "Close" : "Cancel"}
          </Button>
          {parsedData.length > 0 && !importResults && (
            <Button
              onClick={handleImport}
              disabled={validCount === 0 || importing}
              data-testid="button-confirm-import"
            >
              {importing ? "Importing..." : `Import ${validCount} Records`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
