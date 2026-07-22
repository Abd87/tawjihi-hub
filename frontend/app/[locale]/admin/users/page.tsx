'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Users, Search, ShieldCheck, Loader2, Trash2 } from 'lucide-react';

export default function UsersAdminPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, newRole }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update role');
      }
      
      const data = await res.json();
      setUsers(users.map(u => u.id === userId ? data.user : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRevenueShareChange = async (userId: string, percent: number) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, revenueSharePercent: percent }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update revenue share');
      }

      const data = await res.json();
      setUsers(users.map(u => u.id === userId ? data.user : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(isRtl ? `هل أنت تأكد من حذف المستخدم (${userEmail}) نهائياً؟` : `Are you sure you want to permanently delete (${userEmail})?`)) {
      return;
    }

    setDeletingId(userId);
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isRtl ? 'حدث خطأ أثناء الحذف' : 'Failed to delete user'));
      }

      setUsers(users.filter((u) => u.id !== userId));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.email || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.nameAr || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-brand-500" />
            {isRtl ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="text-slate-400">
            {isRtl ? 'إدارة وحذف الحسابات وتعديل الصلاحيات' : 'Manage roles, edit permissions, and remove test accounts'}
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 start-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-brand-500 transition-all"
            placeholder={isRtl ? 'بحث بالاسم أو الإيميل...' : 'Search users...'}
          />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">{isRtl ? 'الاسم' : 'Name'}</th>
                <th className="px-6 py-4">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="px-6 py-4">{isRtl ? 'الدور' : 'Role'}</th>
                <th className="px-6 py-4">{isRtl ? 'نسبة الأرباح %' : 'Share %'}</th>
                <th className="px-6 py-4 text-end">{isRtl ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-900/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                    {user.isMasterAdmin && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                    {isRtl ? user.nameAr : (user.nameEn || user.nameAr)}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      user.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-400' :
                      user.role === 'TEACHER' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'TEACHER' ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={user.revenueSharePercent ?? 70}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val !== user.revenueSharePercent) {
                              handleRevenueShareChange(user.id, val);
                            }
                          }}
                          className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-emerald-400 text-center outline-none focus:border-emerald-500"
                        />
                        <span className="text-xs text-slate-500">%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-end flex items-center justify-end gap-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.isMasterAdmin}
                      className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-300 outline-none focus:border-brand-500 disabled:opacity-50"
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="PARENT">PARENT</option>
                      <option value="TEACHER">TEACHER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>

                    {!user.isMasterAdmin && (
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        disabled={deletingId === user.id}
                        title={isRtl ? 'حذف المستخدم' : 'Delete User'}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {deletingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    {isRtl ? 'لا يوجد نتائج' : 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
