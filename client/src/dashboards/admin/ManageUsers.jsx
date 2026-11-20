import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Shield,
  CheckCircle2,
  XCircle,
  Power,
  Eye,
  Edit3,
  Trash2,
  BookOpen,
  Award,
  DollarSign,
  Video,
  Clock,
  Key,
  ArrowRight,
  X,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  Filter,
  UserCheck,
  GraduationCap,
  Briefcase,
  Calendar,
  Mail,
  Globe,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [detailTab, setDetailTab] = useState('overview'); // 'overview', 'courses', 'certificates', 'finances'

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: '',
    name: '',
    email: '',
    role: 'student',
    headline: '',
    bio: '',
    avatar: '',
    isActive: true,
    isApprovedInstructor: false,
    newPassword: '',
    expertise: '',
    socialLinks: {
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
    },
  });

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/users', { params });
      if (res.data?.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Open Detail View Modal
  const openDetailModal = async (userId) => {
    setDetailLoading(true);
    setDetailModalOpen(true);
    setDetailTab('overview');
    try {
      const res = await api.get(`/admin/users/${userId}`);
      if (res.data?.success) {
        setSelectedUserDetails(res.data);
      }
    } catch (err) {
      toast.error('Failed to load user details.');
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setEditForm({
      _id: user._id,
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'student',
      headline: user.headline || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      isActive: user.isActive !== undefined ? user.isActive : true,
      isApprovedInstructor: user.isApprovedInstructor || false,
      newPassword: '',
      expertise: Array.isArray(user.expertise) ? user.expertise.join(', ') : '',
      socialLinks: {
        website: user.socialLinks?.website || '',
        github: user.socialLinks?.github || '',
        linkedin: user.socialLinks?.linkedin || '',
        twitter: user.socialLinks?.twitter || '',
      },
    });
    setEditModalOpen(true);
  };

  // Handle Save Edit Form
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error('Name and Email are required.');
      return;
    }

    setSavingEdit(true);
    try {
      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
        headline: editForm.headline,
        bio: editForm.bio,
        avatar: editForm.avatar,
        isActive: editForm.isActive,
        isApprovedInstructor: editForm.isApprovedInstructor,
        socialLinks: editForm.socialLinks,
        expertise: editForm.expertise,
      };

      if (editForm.newPassword && editForm.newPassword.trim().length >= 6) {
        payload.password = editForm.newPassword.trim();
      }

      const res = await api.put(`/admin/users/${editForm._id}`, payload);
      if (res.data?.success) {
        toast.success(res.data.message || 'User updated successfully!');
        setEditModalOpen(false);
        // Refresh list
        fetchUsers();
        // If detail modal is open for this user, refresh it
        if (selectedUserDetails && selectedUserDetails.user._id === editForm._id) {
          openDetailModal(editForm._id);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Toggle Active/Suspended Status
  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      if (res.data?.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: res.data.user.isActive } : u))
        );
        if (selectedUserDetails && selectedUserDetails.user._id === userId) {
          setSelectedUserDetails((prev) => ({
            ...prev,
            user: { ...prev.user, isActive: res.data.user.isActive },
          }));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  // Approve / Decline Instructor Application
  const handleApproveInstructor = async (userId, approved) => {
    try {
      const res = await api.put(`/admin/instructors/${userId}/approve`, { approved });
      if (res.data?.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isApprovedInstructor: approved } : u
          )
        );
        if (selectedUserDetails && selectedUserDetails.user._id === userId) {
          setSelectedUserDetails((prev) => ({
            ...prev,
            user: { ...prev.user, isApprovedInstructor: approved },
          }));
        }
      }
    } catch (err) {
      toast.error('Failed to update instructor status.');
    }
  };

  // Delete User
  const confirmDeleteUser = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/users/${deleteTarget._id}`);
      if (res.data?.success) {
        toast.success(res.data.message || 'User deleted successfully.');
        setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
        setDeleteTarget(null);
        if (detailModalOpen && selectedUserDetails?.user?._id === deleteTarget._id) {
          setDetailModalOpen(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  };

  // Quick stats
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalInstructors = users.filter((u) => u.role === 'instructor').length;
  const totalSuspended = users.filter((u) => !u.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#128F80] mb-1 block">
            Administrative Control Center
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
            User Directory & Access Control
          </h1>
          <p className="text-xs text-gray-500">
            Inspect in-depth student & instructor profiles, manage roles, adjust credentials, and override account details.
          </p>
        </div>

        {/* Quick Metric Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#128F80]" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              Students: <strong className="text-gray-900 dark:text-white">{totalStudents}</strong>
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              Instructors: <strong className="text-gray-900 dark:text-white">{totalInstructors}</strong>
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              Suspended: <strong className="text-gray-900 dark:text-white">{totalSuspended}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-[#18202C] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#128F80]"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#128F80]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="bg-white dark:bg-[#18202C] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-slate-900/60 uppercase font-bold text-gray-400 border-b border-gray-100 dark:border-gray-800 tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Instructor Verification</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    <div className="w-6 h-6 border-2 border-[#128F80] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* User Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#128F80]/20"
                        />
                        <div className="max-w-xs">
                          <h4 className="font-heading font-bold text-gray-900 dark:text-white truncate flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.role === 'admin' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            )}
                          </h4>
                          <p className="text-[11px] text-gray-400 truncate">{u.email}</p>
                          {u.headline && (
                            <p className="text-[10px] text-gray-400 italic truncate max-w-[200px]">
                              {u.headline}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-md ${
                          u.role === 'admin'
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            : u.role === 'instructor'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-[#128F80]/10 text-[#128F80] border border-[#128F80]/20'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Instructor Status Column */}
                    <td className="px-6 py-4">
                      {u.role === 'instructor' ? (
                        u.isApprovedInstructor ? (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified Mentor
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                              Pending
                            </span>
                            <button
                              onClick={() => handleApproveInstructor(u._id, true)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all"
                            >
                              Approve
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Account Status Column */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          u.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        ></span>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-gray-500 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => openDetailModal(u._id)}
                          className="p-2 rounded-xl text-gray-500 hover:text-[#128F80] hover:bg-[#128F80]/10 dark:hover:bg-slate-800 transition-all"
                          title="View In-Depth Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit User */}
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 rounded-xl text-gray-500 hover:text-amber-500 hover:bg-amber-500/10 dark:hover:bg-slate-800 transition-all"
                          title="Edit User Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Toggle Suspend/Reactivate */}
                        <button
                          onClick={() => handleToggleStatus(u._id)}
                          className={`p-2 rounded-xl transition-all ${
                            u.isActive
                              ? 'text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                              : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                          }`}
                          title={u.isActive ? 'Suspend User' : 'Reactivate User'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Delete User */}
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. IN-DEPTH DETAIL VIEW MODAL                            */}
      {/* ======================================================== */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#18202C] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 shadow-2xl">
            {/* Modal Header Bar */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#128F80]/10 text-[#128F80] flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                    User Deep-Dive Profile
                  </h3>
                  <p className="text-xs text-gray-500">
                    Comprehensive performance, enrolled courses, certificates, and financials.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedUserDetails?.user && (
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      openEditModal(selectedUserDetails.user);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit User</span>
                  </button>
                )}
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {detailLoading || !selectedUserDetails ? (
                <div className="py-20 text-center text-gray-400">
                  <div className="w-8 h-8 border-3 border-[#128F80] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  Fetching in-depth records from database...
                </div>
              ) : (
                (() => {
                  const { user: u, studentData, instructorData } = selectedUserDetails;
                  return (
                    <>
                      {/* Identity Card */}
                      <div className="bg-gray-50/70 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-[#128F80] shadow-md"
                        />
                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                            <h2 className="font-heading font-black text-xl text-gray-900 dark:text-white">
                              {u.name}
                            </h2>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                u.role === 'admin'
                                  ? 'bg-rose-500/10 text-rose-500'
                                  : u.role === 'instructor'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : 'bg-[#128F80]/10 text-[#128F80]'
                              }`}
                            >
                              {u.role}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                u.isActive
                                  ? 'bg-emerald-500/10 text-emerald-600'
                                  : 'bg-rose-500/10 text-rose-600'
                              }`}
                            >
                              {u.isActive ? 'Active' : 'Suspended'}
                            </span>
                            {u.role === 'instructor' && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  u.isApprovedInstructor
                                    ? 'bg-emerald-500/10 text-emerald-600'
                                    : 'bg-amber-500/10 text-amber-600'
                                }`}
                              >
                                {u.isApprovedInstructor ? 'Verified Instructor' : 'Pending Approval'}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-center sm:justify-start gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{u.email}</span>
                            <span>•</span>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                          </p>

                          {u.headline && (
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              {u.headline}
                            </p>
                          )}

                          {u.bio && (
                            <p className="text-xs text-gray-500 leading-relaxed mb-3 max-w-2xl">
                              {u.bio}
                            </p>
                          )}

                          {/* Social links */}
                          <div className="flex items-center justify-center sm:justify-start gap-3 text-gray-400">
                            {u.socialLinks?.website && (
                              <a
                                href={u.socialLinks.website}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-[#128F80]"
                              >
                                <Globe className="w-4 h-4" />
                              </a>
                            )}
                            {u.socialLinks?.github && (
                              <a
                                href={u.socialLinks.github}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-gray-900 dark:hover:text-white"
                              >
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {u.socialLinks?.linkedin && (
                              <a
                                href={u.socialLinks.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-blue-600"
                              >
                                <Linkedin className="w-4 h-4" />
                              </a>
                            )}
                            {u.socialLinks?.twitter && (
                              <a
                                href={u.socialLinks.twitter}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-sky-500"
                              >
                                <Twitter className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Detail Tabs */}
                      <div className="flex border-b border-gray-100 dark:border-gray-800 space-x-6 text-xs font-bold">
                        <button
                          onClick={() => setDetailTab('overview')}
                          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                            detailTab === 'overview'
                              ? 'border-[#128F80] text-[#128F80]'
                              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          Overview Metrics
                        </button>

                        {studentData && (
                          <>
                            <button
                              onClick={() => setDetailTab('courses')}
                              className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                                detailTab === 'courses'
                                  ? 'border-[#128F80] text-[#128F80]'
                                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              <BookOpen className="w-4 h-4" />
                              Enrolled Courses ({studentData.enrollments?.length || 0})
                            </button>

                            <button
                              onClick={() => setDetailTab('certificates')}
                              className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                                detailTab === 'certificates'
                                  ? 'border-[#128F80] text-[#128F80]'
                                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              <Award className="w-4 h-4 text-amber-500" />
                              Certificates ({studentData.certificates?.length || 0})
                            </button>

                            <button
                              onClick={() => setDetailTab('finances')}
                              className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                                detailTab === 'finances'
                                  ? 'border-[#128F80] text-[#128F80]'
                                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              <DollarSign className="w-4 h-4 text-emerald-500" />
                              Payments (${studentData.totalSpent || 0})
                            </button>
                          </>
                        )}

                        {instructorData && (
                          <>
                            <button
                              onClick={() => setDetailTab('courses')}
                              className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                                detailTab === 'courses'
                                  ? 'border-[#128F80] text-[#128F80]'
                                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              <BookOpen className="w-4 h-4" />
                              Authored Courses ({instructorData.courses?.length || 0})
                            </button>

                            <button
                              onClick={() => setDetailTab('finances')}
                              className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                                detailTab === 'finances'
                                  ? 'border-[#128F80] text-[#128F80]'
                                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              <DollarSign className="w-4 h-4 text-emerald-500" />
                              Revenue (${instructorData.totalEarnings || 0})
                            </button>
                          </>
                        )}
                      </div>

                      {/* Tab: Overview */}
                      {detailTab === 'overview' && (
                        <div className="space-y-6">
                          {studentData && (
                            <div>
                              <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white mb-3">
                                Student Academic Standing
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                  <span className="text-[11px] text-gray-400 font-medium">Courses Enrolled</span>
                                  <p className="font-heading font-black text-xl text-gray-900 dark:text-white mt-1">
                                    {studentData.enrollments?.length || 0}
                                  </p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                  <span className="text-[11px] text-gray-400 font-medium">Completed</span>
                                  <p className="font-heading font-black text-xl text-emerald-600 mt-1">
                                    {studentData.enrollments?.filter((e) => e.progressPercentage === 100).length || 0}
                                  </p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                  <span className="text-[11px] text-gray-400 font-medium">Certificates</span>
                                  <p className="font-heading font-black text-xl text-amber-500 mt-1">
                                    {studentData.certificates?.length || 0}
                                  </p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                  <span className="text-[11px] text-gray-400 font-medium">Total Invested</span>
                                  <p className="font-heading font-black text-xl text-[#128F80] mt-1">
                                    ${studentData.totalSpent || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {instructorData && (
                            <div>
                              <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white mb-3">
                                Instructor Curriculum Metrics
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                  <span className="text-[11px] text-gray-400 font-medium">Published Masterclasses</span>
                                  <p className="font-heading font-black text-xl text-gray-900 dark:text-white mt-1">
                                    {instructorData.courses?.length || 0}
                                  </p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                  <span className="text-[11px] text-gray-400 font-medium">Total Students Taught</span>
                                  <p className="font-heading font-black text-xl text-amber-500 mt-1">
                                    {instructorData.totalStudentsTaught || 0}
                                  </p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                  <span className="text-[11px] text-gray-400 font-medium">Average Rating</span>
                                  <p className="font-heading font-black text-xl text-emerald-600 mt-1">
                                    ★ {instructorData.averageRating || '5.0'}
                                  </p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                  <span className="text-[11px] text-gray-400 font-medium">Total Revenue Generated</span>
                                  <p className="font-heading font-black text-xl text-[#128F80] mt-1">
                                    ${instructorData.totalEarnings || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tab: Enrolled or Authored Courses */}
                      {detailTab === 'courses' && (
                        <div className="space-y-3">
                          {studentData && studentData.enrollments?.length > 0 && (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                              {studentData.enrollments.map((enr) => (
                                <div
                                  key={enr._id}
                                  className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-slate-900/40 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={enr.course?.thumbnail}
                                      alt={enr.course?.title}
                                      className="w-12 h-9 rounded-lg object-cover"
                                    />
                                    <div>
                                      <h5 className="font-heading font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                                        {enr.course?.title}
                                      </h5>
                                      <span className="text-[11px] text-gray-400">
                                        Enrolled on {new Date(enr.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <div className="w-24 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                      <div
                                        className="bg-[#128F80] h-full rounded-full"
                                        style={{ width: `${enr.progressPercentage || 0}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-12 text-right">
                                      {enr.progressPercentage || 0}%
                                    </span>
                                    <Link
                                      to={`/courses/${enr.course?.slug}`}
                                      target="_blank"
                                      className="text-gray-400 hover:text-[#128F80]"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {instructorData && instructorData.courses?.length > 0 && (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                              {instructorData.courses.map((c) => (
                                <div
                                  key={c._id}
                                  className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-slate-900/40 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={c.thumbnail}
                                      alt={c.title}
                                      className="w-12 h-9 rounded-lg object-cover"
                                    />
                                    <div>
                                      <h5 className="font-heading font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                                        {c.title}
                                      </h5>
                                      <span className="text-[11px] text-gray-400">
                                        Category: {c.category?.name} • Tuition:{' '}
                                        <strong className="text-[#128F80]">
                                          {c.isFree ? 'Free' : `$${c.price}`}
                                        </strong>
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 text-xs font-semibold">
                                    <span className="text-gray-500">
                                      {c.enrolledCount || 0} students
                                    </span>
                                    <span className="text-amber-500">★ {c.averageRating || 5.0}</span>
                                    <Link
                                      to={`/courses/${c.slug}`}
                                      target="_blank"
                                      className="text-gray-400 hover:text-[#128F80]"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tab: Certificates */}
                      {detailTab === 'certificates' && (
                        <div className="space-y-3">
                          {studentData?.certificates?.length > 0 ? (
                            studentData.certificates.map((cert) => (
                              <div
                                key={cert._id}
                                className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900/40 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                                    <Award className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h5 className="font-heading font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                                      {cert.courseTitle || cert.course?.title}
                                    </h5>
                                    <span className="text-[11px] text-gray-400 font-mono">
                                      ID: {cert.certificateId} • Issued on{' '}
                                      {new Date(cert.issuedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <Link
                                  to={`/verify-certificate/${cert.certificateId}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#128F80]/10 text-[#128F80] hover:bg-[#128F80] hover:text-white transition-all"
                                >
                                  <span>View Certificate</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 text-center py-6">
                              No certificates earned yet by this learner.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Tab: Finances */}
                      {detailTab === 'finances' && (
                        <div className="space-y-3">
                          {studentData?.payments?.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                              {studentData.payments.map((p) => (
                                <div
                                  key={p._id}
                                  className="p-4 flex items-center justify-between bg-white dark:bg-slate-900/40"
                                >
                                  <div>
                                    <h5 className="font-heading font-bold text-xs text-gray-900 dark:text-white">
                                      {p.course?.title || 'Masterclass Enrollment'}
                                    </h5>
                                    <p className="text-[11px] text-gray-400">
                                      Method: {p.paymentGateway?.toUpperCase()} • Trans ID: {p.transactionId || p._id}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-heading font-bold text-sm text-[#128F80]">
                                      ${p.amount}
                                    </span>
                                    <span className="block text-[10px] text-emerald-600 uppercase font-semibold">
                                      {p.paymentStatus}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : instructorData?.payments?.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                              {instructorData.payments.map((p) => (
                                <div
                                  key={p._id}
                                  className="p-4 flex items-center justify-between bg-white dark:bg-slate-900/40"
                                >
                                  <div>
                                    <h5 className="font-heading font-bold text-xs text-gray-900 dark:text-white">
                                      Enrolled: {p.student?.name}
                                    </h5>
                                    <p className="text-[11px] text-gray-400">
                                      Course: {p.course?.title}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-heading font-bold text-sm text-[#128F80]">
                                      +${p.amount}
                                    </span>
                                    <span className="block text-[10px] text-gray-400">
                                      {new Date(p.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 text-center py-6">
                              No financial records found.
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/40 flex justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ADMIN COMPLETE EDIT USER MODAL                         */}
      {/* ======================================================== */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#18202C] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                    Edit Account & Permissions
                  </h3>
                  <p className="text-xs text-gray-500">
                    Admin master control: update personal info, roles, approval, and credentials.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                    required
                  />
                </div>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Assigned Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Account Standing
                  </label>
                  <select
                    value={editForm.isActive ? 'active' : 'suspended'}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isActive: e.target.value === 'active' })
                    }
                    className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                  >
                    <option value="active">Active (Normal)</option>
                    <option value="suspended">Suspended (Banned)</option>
                  </select>
                </div>

                {editForm.role === 'instructor' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Instructor Verification
                    </label>
                    <select
                      value={editForm.isApprovedInstructor ? 'approved' : 'pending'}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          isApprovedInstructor: e.target.value === 'approved',
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                    >
                      <option value="approved">Approved & Verified</option>
                      <option value="pending">Pending Application</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Profile Avatar Image URL
                </label>
                <input
                  type="text"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={editForm.headline}
                  onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                  placeholder="e.g. Senior Software Architect @ Meta"
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Biography / Summary
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Detailed background or student bio..."
                  className="w-full p-3 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                />
              </div>

              {/* Expertise Tags (for Instructors) */}
              {editForm.role === 'instructor' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Expertise Areas (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.expertise}
                    onChange={(e) => setEditForm({ ...editForm, expertise: e.target.value })}
                    placeholder="React, TypeScript, Cloud Architecture, Docker"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                  />
                </div>
              )}

              {/* Password Override */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50">
                <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  Override Password (Optional)
                </label>
                <p className="text-[11px] text-amber-700 dark:text-amber-300/80 mb-2">
                  Leave blank to preserve user's existing credentials. Enter a minimum of 6 characters to reset their password immediately.
                </p>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  placeholder="Enter new password to force reset..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                />
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Social Links & Portfolio
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    value={editForm.socialLinks.website}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        socialLinks: { ...editForm.socialLinks, website: e.target.value },
                      })
                    }
                    placeholder="Website URL: https://..."
                    className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                  />
                  <input
                    type="text"
                    value={editForm.socialLinks.github}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        socialLinks: { ...editForm.socialLinks, github: e.target.value },
                      })
                    }
                    placeholder="GitHub: https://github.com/..."
                    className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                  />
                  <input
                    type="text"
                    value={editForm.socialLinks.linkedin}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        socialLinks: { ...editForm.socialLinks, linkedin: e.target.value },
                      })
                    }
                    placeholder="LinkedIn: https://linkedin.com/in/..."
                    className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                  />
                  <input
                    type="text"
                    value={editForm.socialLinks.twitter}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        socialLinks: { ...editForm.socialLinks, twitter: e.target.value },
                      })
                    }
                    placeholder="Twitter/X: https://x.com/..."
                    className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#128F80] hover:bg-[#087568] text-white shadow-card transition-all active:scale-95"
                >
                  {savingEdit ? 'Saving Updates...' : 'Save All Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CONFIRM DELETE MODAL                                   */}
      {/* ======================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#18202C] rounded-3xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-center text-gray-900 dark:text-white mb-2">
              Permanently Delete User?
            </h3>
            <p className="text-xs text-gray-500 text-center mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-gray-800 dark:text-gray-200">{deleteTarget.name}</strong> ({deleteTarget.email})? This action cannot be undone and will remove all their enrollments and records.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                disabled={deleting}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
