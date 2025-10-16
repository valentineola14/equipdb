import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, XCircle } from "lucide-react";

interface EquipmentStatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

export function EquipmentStatusBadge({
  status,
  showIcon = false,
}: EquipmentStatusBadgeProps) {
  const statusConfig = {
    operational: {
      label: "Operational",
      className: "bg-chart-2/20 text-chart-2 border-chart-2/30",
      icon: Activity,
    },
    maintenance: {
      label: "Maintenance",
      className: "bg-chart-3/20 text-chart-3 border-chart-3/30",
      icon: AlertTriangle,
    },
    offline: {
      label: "Offline",
      className: "bg-chart-5/20 text-chart-5 border-chart-5/30",
      icon: XCircle,
    },
  };

  const normalizedStatus = status.toLowerCase();
  const config =
    statusConfig[normalizedStatus as keyof typeof statusConfig] ||
    statusConfig.offline;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} rounded-full px-2 py-0.5 text-xs font-medium`}
      data-testid={`badge-status-${normalizedStatus}`}
    >
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
