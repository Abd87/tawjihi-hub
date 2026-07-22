import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

// Default sender address using your verified domain
const SENDER_EMAIL = process.env.EMAIL_FROM || 'Tawjihi Hub <support@tawjihihub.com>';

export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
  try {
    const data = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject: 'مرحباً بك في منصة توجيهي هب! | Welcome to Tawjihi Hub',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #020617; color: #e2e8f0; padding: 30px; border-radius: 16px;">
          <h1 style="color: #38bdf8; text-align: center;">أهلاً بك في توجيهي هب 🎉</h1>
          <p style="font-size: 16px; line-height: 1.6;">مرحباً <strong>${name}</strong>،</p>
          <p style="font-size: 16px; line-height: 1.6;">يسعدنا انضمامك إلى منصة توجيهي هب، المنصة الأولى المخصصة لتمكين طلاب التوجيهي الأكاديمي والمهني (BTEC) في الأردن.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://tawjihihub.com/dashboard" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">الانتقال إلى لوحة التحكم</a>
          </div>
          <hr style="border-color: #1e293b; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">إذا كان لديك أي استفسار، تواصل معنا عبر البريد: support@tawjihihub.com</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

export async function sendTeacherApplicationNotification({
  fullName,
  email,
  phoneNumber,
  subject,
}: {
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
}) {
  try {
    const data = await resend.emails.send({
      from: SENDER_EMAIL,
      to: ['admin@tawjihihub.com', 'support@tawjihihub.com'],
      subject: `طلب انضمام معلم جديد: ${fullName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #020617; color: #e2e8f0; padding: 30px; border-radius: 16px;">
          <h2 style="color: #f59e0b;">طلب انضمام معلم جديد 📝</h2>
          <p><strong>الاسم:</strong> ${fullName}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>رقم الهاتف:</strong> ${phoneNumber}</p>
          <p><strong>المادة / التخصص:</strong> ${subject}</p>
          <div style="margin-top: 20px;">
            <a href="https://tawjihihub.com/admin/teachers" style="background-color: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">مراجعة الطلبات في لوحة الإدارة</a>
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send teacher application notification:', error);
    return { success: false, error };
  }
}
