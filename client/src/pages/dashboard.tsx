import { useQuery } from "@tanstack/react-query";
import { type Equipment } from "@shared/schema";
import { BarChart3, Zap, Activity, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: equipment, isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  const stats = {
    total: equipment?.length || 0,
    operational:
      equipment?.filter((e) => e.status.toLowerCase() === "operational").length || 0,
    maintenance:
      equipment?.filter((e) => e.status.toLowerCase() === "maintenance").length || 0,
    offline: equipment?.filter((e) => e.status.toLowerCase() === "offline").length || 0,
  };

  const typeDistribution =
    equipment?.reduce(
      (acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="heading-dashboard">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of electric grid equipment
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold" data-testid="stat-total">
                {stats.total}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <Activity className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div>
                <div className="text-2xl font-bold text-chart-2" data-testid="stat-operational">
                  {stats.operational}
                </div>
                {stats.total > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {Math.round((stats.operational / stats.total) * 100)}% of total
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div>
                <div className="text-2xl font-bold text-chart-3" data-testid="stat-maintenance">
                  {stats.maintenance}
                </div>
                {stats.total > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {Math.round((stats.maintenance / stats.total) * 100)}% of total
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <XCircle className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div>
                <div className="text-2xl font-bold text-chart-5" data-testid="stat-offline">
                  {stats.offline}
                </div>
                {stats.total > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {Math.round((stats.offline / stats.total) * 100)}% of total
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Equipment by Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(typeDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(count / stats.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm font-medium">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
