import React, { useEffect, useState } from 'react';
import { Camera, Save, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const fieldClassName =
  'w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    socialLinks: {
      website: user?.socialLinks?.website || '',
      github: user?.socialLinks?.github || '',
      linkedin: user?.socialLinks?.linkedin || '',
      twitter: user?.socialLinks?.twitter || '',
    },
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || '',
      headline: user?.headline || '',
      bio: user?.bio || '',
      socialLinks: {
        website: user?.socialLinks?.website || '',
        github: user?.socialLinks?.github || '',
        linkedin: user?.socialLinks?.linkedin || '',
        twitter: user?.socialLinks?.twitter || '',
      },
    });
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || '');
  }, [user]);

  useEffect(() => {
    if (!avatarFile) return undefined;

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('socialLinks.')) {
      const key = name.slice('socialLinks.'.length);
      setForm((previous) => ({
        ...previous,
        socialLinks: { ...previous.socialLinks, [key]: value },
      }));
      return;
    }

    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file. PDFs and documents can't be used as profile photos.");
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Profile images must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setAvatarFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      let avatar = user?.avatar || '';
      if (avatarFile) {
        const uploadData = new FormData();
        uploadData.append('file', avatarFile);
        const uploadResponse = await api.post('/upload/profile-image', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (!uploadResponse.data?.success || !uploadResponse.data.fileUrl) {
          throw new Error(uploadResponse.data?.message || 'Profile image upload failed.');
        }
        avatar = uploadResponse.data.fileUrl;
      }

      const result = await updateProfile({ ...form, avatar });
      if (result?.success) {
        setAvatarFile(null);
        setAvatarPreview(avatar);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Update your profile photo, name, and personal details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft space-y-7"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <UserRound className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#128F80] text-white text-sm font-semibold cursor-pointer hover:bg-[#087568] transition-colors">
              <Camera className="w-4 h-4" />
              Change photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="sr-only"
              />
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Choose an image up to 5 MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="profile-name" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Name
            </label>
            <input
              id="profile-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={fieldClassName}
              maxLength={60}
              required
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Email
            </label>
            <input
              id="profile-email"
              value={user?.email || ''}
              className={`${fieldClassName} opacity-70`}
              readOnly
            />
          </div>
        </div>

        <div>
          <label htmlFor="profile-headline" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Headline
          </label>
          <input
            id="profile-headline"
            name="headline"
            value={form.headline}
            onChange={handleChange}
            className={fieldClassName}
            maxLength={120}
            placeholder="A short introduction about you"
          />
        </div>

        <div>
          <label htmlFor="profile-bio" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            About you
          </label>
          <textarea
            id="profile-bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className={`${fieldClassName} min-h-32 resize-y`}
            maxLength={1000}
            placeholder="Share a little about yourself"
          />
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Social links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['website', 'Website'],
              ['github', 'GitHub'],
              ['linkedin', 'LinkedIn'],
              ['twitter', 'Twitter'],
            ].map(([key, label]) => (
              <div key={key}>
                <label htmlFor={`profile-${key}`} className="sr-only">
                  {label}
                </label>
                <input
                  id={`profile-${key}`}
                  name={`socialLinks.${key}`}
                  type="url"
                  value={form.socialLinks[key]}
                  onChange={handleChange}
                  className={fieldClassName}
                  placeholder={label}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 dark:border-gray-800 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#128F80] text-white text-sm font-semibold hover:bg-[#087568] disabled:opacity-60 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
