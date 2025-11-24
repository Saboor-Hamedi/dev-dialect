import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Camera, Loader2, Check } from "lucide-react";
import { supabase } from "../../../supabase";
import { useToast } from "../../../context/ToastContext";

const Account = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    bio: "",
    avatar_url: "",
    twitter: "",
    facebook: "",
    github: "",
    website: "",
  });

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        // Fetch profile data
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          setProfile({
            full_name: data.full_name || "",
            email: user.email, // Email comes from auth
            bio: data.bio || "",
            avatar_url: data.avatar_url || "",
            twitter: data.twitter || "",
            facebook: data.facebook || "",
            github: data.github || "",
            website: data.website || "",
          });
        } else {
          // If no profile exists yet, just set email
          setProfile((prev) => ({ ...prev, email: user.email }));
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profile.full_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        twitter: profile.twitter,
        facebook: profile.facebook,
        github: profile.github,
        website: profile.website,
        updated_at: new Date(),
      });

      if (error) throw error;
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Error updating profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) return;

    try {
      setUpdatingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      showToast("Password updated successfully!", "success");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      showToast("Error updating password: " + error.message, "error");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Avatar upload state
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e) => {
    try {
      setUploadingAvatar(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
      showToast("Avatar uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showToast("Error uploading avatar", "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
          Profile Information
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Update your account details and public profile.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (
                    profile.full_name?.[0] ||
                    user?.email?.[0] ||
                    "U"
                  ).toUpperCase()
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={24} />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white dark:bg-slate-700 p-2 rounded-full shadow-md border border-gray-200 dark:border-slate-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                <Camera
                  size={16}
                  className="text-gray-600 dark:text-gray-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-xl font-bold text-slate-800 dark:text-white">
                {profile.full_name || "User"}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 text-sm rounded-lg block w-full pl-10 p-2.5 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                Bio
              </label>
              <textarea
                rows="4"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                placeholder="Write a short bio..."
              ></textarea>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-4">
              Social Media Links
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                  Twitter Username
                </label>
                <input
                  type="text"
                  value={profile.twitter}
                  onChange={(e) =>
                    setProfile({ ...profile, twitter: e.target.value })
                  }
                  placeholder="username"
                  className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                  Facebook Username
                </label>
                <input
                  type="text"
                  value={profile.facebook}
                  onChange={(e) =>
                    setProfile({ ...profile, facebook: e.target.value })
                  }
                  placeholder="username"
                  className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={profile.github}
                  onChange={(e) =>
                    setProfile({ ...profile, github: e.target.value })
                  }
                  placeholder="username"
                  className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                  Website URL
                </label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) =>
                    setProfile({ ...profile, website: e.target.value })
                  }
                  placeholder="https://yourwebsite.com"
                  className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-700">
            <button
              onClick={handleUpdateProfile}
              disabled={saving}
              className="px-5 py-2.5 bg-primary hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
          Security
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Manage your password and security preferences.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                <Shield size={20} />
              </div>
              <div>
                <div className="font-medium text-slate-800 dark:text-white">
                  Change Password
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Ensure your account is secure
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 md:w-48 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg p-2.5"
              />
              <button
                onClick={handleUpdatePassword}
                disabled={!newPassword || updatingPassword}
                className="px-4 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {updatingPassword ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
