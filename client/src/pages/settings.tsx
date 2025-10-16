import { useAuth } from "@/contexts/auth-context";
import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Settings() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

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
        <Button
          variant="outline"
          onClick={logout}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="rounded-md border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Equipment management interface coming soon...
        </p>
      </div>
    </div>
  );
}
