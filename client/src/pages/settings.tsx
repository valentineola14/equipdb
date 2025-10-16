export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="heading-settings">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Application settings and preferences
        </p>
      </div>
      <div className="flex h-96 items-center justify-center rounded-md border border-border bg-card">
        <p className="text-sm text-muted-foreground">Settings coming soon</p>
      </div>
    </div>
  );
}
