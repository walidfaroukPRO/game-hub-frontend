import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Loader, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api'; // ✅ استخدام authAPI

export default function VerifyEmailPage() {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split('');
    while (newCode.length < 6) newCode.push('');
    setCode(newCode);
    document.getElementById('code-5')?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      toast.error(language === 'ar' ? 'الرجاء إدخال الكود كاملاً' : 'Please enter complete code');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyEmail(email, verificationCode); // ✅ استخدام authAPI

if (response.data.success) {
  toast.success(
    language === 'ar' 
      ? '🎉 تم تفعيل حسابك بنجاح! سيتم تحويلك إلى الصفحة الرئيسية...' 
      : '🎉 Your account has been activated! Redirecting to homepage...'
  );

  localStorage.setItem('token', response.data.token);
  login(response.data.user, response.data.token);

  // ⏳ تأخير بسيط قبل التحويل للصفحة الرئيسية
  setTimeout(() => navigate('/'), 2500);
}
    } catch (error) {
      console.error('Verify error:', error);
      toast.error(error.response?.data?.message || (language === 'ar' ? 'كود غير صحيح' : 'Invalid code'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await authAPI.resendCode(email); // ✅ استخدام authAPI
      
      if (response.data.success) {
        toast.success(language === 'ar' ? 'تم إرسال كود جديد' : 'New code sent');
        setTimer(60);
        setCanResend(false);
        setCode(['', '', '', '', '', '']);
        
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error(error.response?.data?.message || (language === 'ar' ? 'فشل الإرسال' : 'Failed to resend'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <Mail className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'ar' ? 'تأكيد البريد الإلكتروني' : 'Verify Your Email'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'ar' ? 'أدخل الكود المرسل إلى' : 'Enter the code sent to'}
          </p>
          <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">{email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 justify-center mb-6" dir="ltr">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || code.join('').length !== 6}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {language === 'ar' ? 'جارٍ التحقق...' : 'Verifying...'}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {language === 'ar' ? 'تأكيد' : 'Verify'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              {resending && <Loader className="w-4 h-4 animate-spin" />}
              {language === 'ar' ? 'إعادة إرسال الكود' : 'Resend Code'}
            </button>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ar' ? `إعادة الإرسال بعد ${timer} ثانية` : `Resend in ${timer}s`}
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {language === 'ar' 
            ? '⏱️ الكود صالح لمدة 10 دقائق'
            : '⏱️ Code valid for 10 minutes'}
        </p>
      </div>
    </div>
  );
}