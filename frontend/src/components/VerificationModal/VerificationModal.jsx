import { useEffect, useState } from "react";
import ProfileEditorModal from "../ProfileEditor/ProfileEditorModal";

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("currentUser")) || {}; } catch { return {}; }
};

export default function VerificationModal({ open, onClose, onSaved }) {
  const [profile, setProfile] = useState(getStoredUser);

  useEffect(() => {
    if (open) setProfile(getStoredUser());
  }, [open]);

  return <ProfileEditorModal open={open} onClose={onClose} onSaved={(updatedUser) => { setProfile(updatedUser); onSaved?.(updatedUser); }} profile={profile} completion={profile.profileCompletion || 20} isVerification />;
}
