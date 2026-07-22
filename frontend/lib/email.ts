import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_build_placeholder');

// Default sender address using your verified domain
const SENDER_EMAIL = process.env.EMAIL_FROM || 'Tawjihi Hub <support@tawjihihub.com>';
const LOGO_URL = 'https://tawjihihub.com/logo.svg';

export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
  try {
    const data = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject: 'مرحباً بك في منصة توجيهي هب! | Welcome to Tawjihi Hub',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #020617; color: #e2e8f0; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="${LOGO_URL}" alt="Tawjihi Hub" style="height: 50px; width: auto; display: inline-block;" />
          </div>
          <h1 style="color: #38bdf8; text-align: center; font-size: 22px;">أهلاً بك في توجيهي هب 🎉</h1>
          <p style="font-size: 16px; line-height: 1.6;">مرحباً <strong>${name}</strong>،</p>
          <p style="font-size: 16px; line-height: 1.6;">يسعدنا انضمامك إلى منصة توجيهي هب، المنصة الأولى المخصصة لتمكين طلاب التوجيهي الأكاديمي والمهني (BTEC) في الأردن.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://tawjihihub.com/dashboard" style="background-color: #0284c7; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">الانتقال إلى لوحة التحكم</a>
          </div>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">إذا كان لديك أي استفسار، تواصل مع فريق الدعم: <a href="mailto:support@tawjihihub.com" style="color: #38bdf8; text-decoration: none;">support@tawjihihub.com</a></p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

export async function sendAdminNewUserAlert({
  name,
  email,
  role,
  trackType,
}: {
  name: string;
  email: string;
  role: string;
  trackType?: string | null;
}) {
  try {
    const data = await resend.emails.send({
      from: SENDER_EMAIL,
      to: ['admin@tawjihihub.com', 'support@tawjihihub.com'],
      subject: `تسجيل مستخدم جديد: ${name} (${role})`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #020617; color: #e2e8f0; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="${LOGO_URL}" alt="Tawjihi Hub" style="height: 50px; width: auto; display: inline-block;" />
          </div>
          <h2 style="color: #38bdf8; text-align: center;">إشعار تسجيل مستخدم جديد 👤</h2>
          <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; margin-top: 20px; line-height: 1.8;">
            <p style="margin: 6px 0;"><strong>الاسم:</strong> ${name}</p>
            <p style="margin: 6px 0;"><strong>البريد الإلكتروني:</strong> ${email}</p>
            <p style="margin: 6px 0;"><strong>نوع الحساب:</strong> ${role}</p>
            ${trackType ? `<p style="margin: 6px 0;"><strong>الفرع الدراسي:</strong> ${trackType}</p>` : ''}
          </div>
          <div style="text-align: center; margin-top: 28px;">
            <a href="https://tawjihihub.com/admin/users" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">عرض قائمة المستخدمين</a>
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send new user admin alert:', error);
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
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #020617; color: #e2e8f0; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="${LOGO_URL}" alt="Tawjihi Hub" style="height: 50px; width: auto; display: inline-block;" />
          </div>
          <h2 style="color: #f59e0b; text-align: center;">طلب انضمام معلم جديد 📝</h2>
          <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; margin-top: 20px; line-height: 1.8;">
            <p style="margin: 6px 0;"><strong>الاسم:</strong> ${fullName}</p>
            <p style="margin: 6px 0;"><strong>البريد الإلكتروني:</strong> ${email}</p>
            <p style="margin: 6px 0;"><strong>رقم الهاتف:</strong> ${phoneNumber}</p>
            <p style="margin: 6px 0;"><strong>المادة / التخصص:</strong> ${subject}</p>
          </div>
          <div style="text-align: center; margin-top: 28px;">
            <a href="https://tawjihihub.com/admin/teachers" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">مراجعة الطلبات في لوحة الإدارة</a>
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

export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}: {
  email: string;
  name: string;
  resetUrl: string;
}) {
  try {
    const data = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject: 'إعادة تعيين كلمة المرور | Password Reset - Tawjihi Hub',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #020617; color: #e2e8f0; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="${LOGO_URL}" alt="Tawjihi Hub" style="height: 50px; width: auto; display: inline-block;" />
          </div>
          <h1 style="color: #38bdf8; text-align: center; font-size: 22px;">إعادة تعيين كلمة المرور 🔑</h1>
          <p style="font-size: 16px; line-height: 1.6;">مرحباً <strong>${name}</strong>،</p>
          <p style="font-size: 16px; line-height: 1.6;">لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في منصة توجيهي هب.</p>
          <p style="font-size: 14px; color: #94a3b8;">اضغط على الزر أدناه لتعيين كلمة مرور جديدة (هذا الرابط صالـح لمدة 60 دقيقة فقط):</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #0284c7; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">إعادة تعيين كلمة المرور</a>
          </div>
          <p style="font-size: 12px; color: #64748b; text-align: center;">إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني بأمان.</p>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">دعم توجيهي هب: <a href="mailto:support@tawjihihub.com" style="color: #38bdf8; text-decoration: none;">support@tawjihihub.com</a></p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
}

export async function sendBroadcastEmail({
  emails,
  subject,
  content,
}: {
  emails: string[];
  subject: string;
  content: string;
}) {
  try {
    // Process in batches of 50 to respect Resend rate limits
    const batchSize = 50;
    let sentCount = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      await Promise.all(
        batch.map((to) =>
          resend.emails.send({
            from: SENDER_EMAIL,
            to,
            subject,
            html: `
              <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #020617; color: #e2e8f0; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <img src="${LOGO_URL}" alt="Tawjihi Hub" style="height: 50px; width: auto; display: inline-block;" />
                </div>
                <h2 style="color: #38bdf8; text-align: center; font-size: 20px;">${subject}</h2>
                <div style="font-size: 15px; line-height: 1.8; color: #cbd5e1; margin: 20px 0; white-space: pre-wrap;">${content}</div>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://tawjihihub.com" style="background-color: #0284c7; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">زيارة منصة توجيهي هب</a>
                </div>
                <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
                <p style="font-size: 12px; color: #94a3b8; text-align: center;">تصلك هذه الرسالة بصفتك مسجلاً في منصة توجيهي هب. تواصل معنا: <a href="mailto:support@tawjihihub.com" style="color: #38bdf8; text-decoration: none;">support@tawjihihub.com</a></p>
              </div>
            `,
          }).catch(err => console.error(`Error sending to ${to}:`, err))
        )
      );
      sentCount += batch.length;
    }

    return { success: true, count: sentCount };
  } catch (error) {
    console.error('Failed to send broadcast email:', error);
    return { success: false, error };
  }
}
