import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then((res) => {
        if (res.data?.success) {
          setPayments(res.data.recentPayments || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#128F80] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white mb-1">
          Payment Transactions & Invoices
        </h1>
        <p className="text-xs text-gray-500">
          Complete ledger of verified Stripe and Razorpay checkouts across all courses.
        </p>
      </div>

      <div className="bg-white dark:bg-[#18202C] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-900/60 uppercase font-bold text-gray-400 border-b border-gray-100 dark:border-gray-800 tracking-wider">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Gateway</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-gray-700 dark:text-gray-300">
                    {p.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.student?.avatar}
                        alt="avatar"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {p.student?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {p.course?.title || 'Masterclass Tuition'}
                  </td>
                  <td className="px-6 py-4 uppercase font-bold text-[10px] text-gray-500">
                    {p.paymentGateway}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#16A36A]">
                    ${p.amount}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagePayments;

