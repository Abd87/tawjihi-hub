'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';

export default function HomeAuthRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'STUDENT') {
          router.replace('/dashboard');
        } else if (user.role === 'TEACHER') {
          router.replace('/admin/courses');
        } else if (user.role === 'PARENT') {
          router.replace('/parent/dashboard');
        } else if (user.role === 'ADMIN') {
          router.replace('/admin/courses');
        }
      } catch (e) {}
    }
  }, [router]);
  
  return null;
}
