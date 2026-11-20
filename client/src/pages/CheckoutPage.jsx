import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Check, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const CheckoutPage = () => {
  const { courseId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentGateway, setPaymentGateway] = useState('stripe'); // 'stripe' or 'razorpay'

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast('Please login to proceed to checkout.', { icon: '🔒' });
      navigate('/login');
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        if (res.data?.success) {
          setCourse(res.data.course);
        }
      } catch (err) {
        toast.error('Course not found.');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, isAuthenticated]);

  const rawPrice = course
    ? (course.discountPrice > 0 ? course.discountPrice : (course.price !== undefined ? course.price : 49))
    : 49;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPrice = Math.max(0, rawPrice - discountAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    try {
      const res = await api.post('/payments/apply-coupon', {
        code: couponCode,
        coursePrice: rawPrice,
      });

      if (res.data?.success) {
        setAppliedCoupon(res.data.coupon);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCompletePayment = async () => {
    setProcessingPayment(true);

    try {
      if (paymentGateway === 'stripe') {
        const res = await api.post('/payments/stripe/checkout', {
          courseId: course._id,
          couponCode: appliedCoupon?.code,
          paymentMethodId: 'pm_card_visa_demo',
        });

        if (res.data?.success) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          toast.success('Payment verified! Welcome to the course.');
          navigate(`/learn/${course._id}`);
        }
      } else {
        // Razorpay flow
        const orderRes = await api.post('/payments/razorpay/create-order', {
          courseId: course._id,
          couponCode: appliedCoupon?.code,
        });

        if (orderRes.data?.success) {
          // Verify
          const verifyRes = await api.post('/payments/razorpay/verify', {
            razorpay_order_id: orderRes.data.order.id,
            razorpay_payment_id: `pay_rzp_${Date.now()}`,
            razorpay_signature: 'demo_sig_ok',
            courseId: course._id,
            amount: finalPrice,
            couponCode: appliedCoupon?.code,
          });

          if (verifyRes.data?.success) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            toast.success('Razorpay Payment Successful!');
            navigate(`/learn/${course._id}`);
          }
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment processing failed.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#F7F9FC] dark:bg-[#0F1319]">
        <div className="w-10 h-10 border-4 border-[#128F80] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#F7F9FC] dark:bg-[#0F1319] min-h-screen transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <Link
          to={`/courses/${course?.slug || ''}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#128F80] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Details
        </Link>

        <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 dark:text-white mb-8">
          Secure Enrollment Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Payment Gateway Selection */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Gateway choice */}
            <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft">
              <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-4">
                Select Payment Method
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentGateway('stripe')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentGateway === 'stripe'
                      ? 'border-[#128F80] bg-[#128F80]/5'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="gateway"
                      checked={paymentGateway === 'stripe'}
                      onChange={() => setPaymentGateway('stripe')}
                      className="text-[#128F80] focus:ring-[#128F80]"
                    />
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                        Credit / Debit Card (Stripe)
                      </p>
                      <p className="text-[11px] text-gray-400">International cards, Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </label>

                <label
                  onClick={() => setPaymentGateway('razorpay')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentGateway === 'razorpay'
                      ? 'border-[#128F80] bg-[#128F80]/5'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="gateway"
                      checked={paymentGateway === 'razorpay'}
                      onChange={() => setPaymentGateway('razorpay')}
                      className="text-[#128F80] focus:ring-[#128F80]"
                    />
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                        Razorpay (UPI, Netbanking, Wallets)
                      </p>
                      <p className="text-[11px] text-gray-400">Indian payment options, Google Pay, PhonePe</p>
                    </div>
                  </div>
                  <span className="font-heading font-black text-xs text-[#128F80]">₹ INR</span>
                </label>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft">
              <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-2">
                Have a Coupon Code?
              </h3>
              <p className="text-xs text-gray-400 mb-4">Try promo codes: <code className="text-[#128F80] font-bold">WELCOME20</code> or <code className="text-[#128F80] font-bold">PROLEARN50</code></p>
              
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME20"
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white uppercase font-bold focus:outline-none focus:border-[#128F80]"
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#128F80] text-white hover:bg-[#087568] transition-all"
                >
                  {couponLoading ? 'Applying...' : 'Apply'}
                </button>
              </form>

              {appliedCoupon && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                  <span>Coupon {appliedCoupon.code} applied (-${appliedCoupon.discountAmount})</span>
                  <button
                    onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                    className="text-emerald-800 font-bold hover:underline text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
              <span>256-bit SSL encrypted checkout. 30-day money-back guarantee.</span>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-5">
            <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft sticky top-28">
              <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>

              <div className="flex gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <img
                  src={course?.thumbnail}
                  alt={course?.title}
                  className="w-20 h-14 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="font-heading font-bold text-xs text-gray-900 dark:text-white line-clamp-2">
                    {course?.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1">Mentor: {course?.instructor?.name}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex justify-between">
                  <span>Course Tuition</span>
                  <span>${rawPrice}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#16A36A] font-semibold">
                    <span>Discount ({appliedCoupon.discountPercent}%)</span>
                    <span>-${appliedCoupon.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2">
                  <span>Total Amount</span>
                  <span>${finalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleCompletePayment}
                disabled={processingPayment}
                className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm bg-[#128F80] hover:bg-[#087568] text-white transition-all shadow-card flex items-center justify-center gap-2 active:scale-95"
              >
                <span>
                  {processingPayment
                    ? 'Confirming...'
                    : finalPrice === 0
                    ? 'Enroll for Free'
                    : `Pay $${finalPrice} & Enroll`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
