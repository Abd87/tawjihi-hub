'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Users, Search, ShieldCheck, User, Loader2, CheckCircle2 } from 'lucide-react';

export default function UsersAdminPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
            {locale === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="text-slate-400">
            {locale === 'ar' ? 'إدارة الصلاحيات (للمدير الرئيسي فقط)' : 'Manage roles and permissions (Master Admin only)'}
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
            placeholder={locale === 'ar' ? 'بحث بالاسم أو الإيميل...' : 'Search users...'}
          />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">{locale === 'ar' ? 'الاسم' : 'Name'}</th>
                <th className="px-6 py-4">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="px-6 py-4">{locale === 'ar' ? 'الدور' : 'Role'}</th>
                <th className="px-6 py-4 text-end">{locale === 'ar' ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-900/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                    {user.isMasterAdmin && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                    {locale === 'ar' ? user.nameAr : (user.nameEn || user.nameAr)}
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
                  <td className="px-6 py-4 text-end">
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
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    {locale === 'ar' ? 'لا يوجد نتائج' : 'No users found'}
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
