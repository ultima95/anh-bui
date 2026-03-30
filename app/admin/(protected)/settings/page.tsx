import ChangePasswordForm from "./ChangePasswordForm";

export default function SettingsPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Settings</h1>
      <p className="text-sm text-muted mb-10">Manage your admin account.</p>

      <div className="max-w-sm">
        <h2 className="text-base font-semibold text-foreground mb-1">Change password</h2>
        <p className="text-sm text-muted mb-6">
          You&apos;ll need your current password to set a new one.
        </p>
        <ChangePasswordForm />
      </div>
    </>
  );
}
