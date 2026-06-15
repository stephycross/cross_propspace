import { FormEvent, useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import { userApi } from "../api/user.api";
import { useAuth } from "../hooks/useAuth";
import { validatePassword, validateRequired } from "../utils/validation";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import "./ProfilePage.css";

function ProfilePage() {
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState({
    username: user?.username ?? "",
    phone: user?.phone ?? "",
    avatarUrl: user?.avatarUrl ?? "",
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string | undefined>>({});
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string | undefined>>({});
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleProfileSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const errors = { username: validateRequired(profile.username, "Username") ?? undefined };
    setProfileErrors(errors);
    if (errors.username) return;

    setSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);
    try {
      const updated = await userApi.updateProfile(profile);
      setUser(updated);
      setProfileMessage("Profile updated successfully");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const errors = {
      currentPassword: validateRequired(passwords.currentPassword, "Current password") ?? undefined,
      newPassword: validatePassword(passwords.newPassword) ?? undefined,
    };
    setPasswordErrors(errors);
    if (errors.currentPassword || errors.newPassword) return;

    setSavingPassword(true);
    setPasswordMessage(null);
    setPasswordError(null);
    try {
      await userApi.changePassword(passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      setPasswordMessage("Password changed successfully");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Account settings</h1>
            <p className="page-subtitle">Manage your profile and security.</p>
          </div>
        </div>

        <div className="profile-layout">
          <form className="profile-card card" onSubmit={handleProfileSubmit} noValidate>
            <h2 className="profile-card-title">
              <FiUser size={18} />
              Profile details
            </h2>

            {profileMessage ? <div className="alert alert-success">{profileMessage}</div> : null}
            {profileError ? <div className="alert alert-error">{profileError}</div> : null}

            <InputField label="Email" name="email" value={user?.email ?? ""} disabled />
            <InputField
              label="Username"
              name="username"
              value={profile.username}
              error={profileErrors.username}
              onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
            />
            <InputField
              label="Phone number"
              name="phone"
              placeholder="+237 5555 0100"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            />
            <InputField
              label="Avatar URL"
              name="avatarUrl"
              placeholder="https://..."
              value={profile.avatarUrl}
              onChange={(e) => setProfile((p) => ({ ...p, avatarUrl: e.target.value }))}
            />
            <button className="btn btn-primary" disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save profile"}
            </button>
          </form>

          <form className="profile-card card" onSubmit={handlePasswordSubmit} noValidate>
            <h2 className="profile-card-title">
              <FiLock size={18} />
              Change password
            </h2>

            {passwordMessage ? <div className="alert alert-success">{passwordMessage}</div> : null}
            {passwordError ? <div className="alert alert-error">{passwordError}</div> : null}

            <InputField
              label="Current password"
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              error={passwordErrors.currentPassword}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
              }
            />
            <InputField
              label="New password"
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              error={passwordErrors.newPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
            />
            <button className="btn btn-primary" disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default ProfilePage;
