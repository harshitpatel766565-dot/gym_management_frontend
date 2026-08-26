'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { PaymentTransaction } from '@/types/payment';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatINR, formatDate } from '@/lib/utils';
import { Receipt, Search, Download, CreditCard, ShieldCheck } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await adminService.getAllPayments();
        setPayments(res.data);
      } catch {
        // Fallback
      }
    }
    loadData();
  }, []);

  const totalCaptured = (payments || [])
    .filter((p) => p && p.status === 'captured')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const filtered = (payments || []).filter(
    (p) =>
      p &&
      (((p.userName || '').toLowerCase().includes(searchQuery.toLowerCase())) ||
        ((p.invoiceNumber || '').toLowerCase().includes(searchQuery.toLowerCase())) ||
        ((p.razorpayPaymentId || '').toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            Razorpay Transactions &amp; Invoices
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Audit payment receipts, signature verifications, and financial captures.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export CSV / Print
        </Button>
      </div>

      {/* Revenue Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 bg-forge-900 border-forge-800">
          <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
            Captured Revenue
          </span>
          <p className="text-3xl font-black font-heading text-emerald-400 mt-1">
            {formatINR(totalCaptured)}
          </p>
          <span className="text-xs text-forge-400">Successfully settled via Razorpay</span>
        </Card>

        <Card className="p-5 bg-forge-900 border-forge-800">
          <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
            Total Transactions
          </span>
          <p className="text-3xl font-black font-heading text-white mt-1">
            {payments.length}
          </p>
          <span className="text-xs text-forge-400">All gateway requests</span>
        </Card>

        <Card className="p-5 bg-forge-900 border-forge-800">
          <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
            Settlement Gateway
          </span>
          <p className="text-xl font-bold font-heading text-brand-orange mt-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Razorpay Live Webhook
          </p>
          <span className="text-xs text-forge-400">256-Bit SSL Encrypted</span>
        </Card>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Search by athlete name, invoice #, or payment ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-forge-400" />}
        />
      </div>

      {/* Transactions Table */}
      <Card className="p-0 bg-forge-900 border-forge-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-forge-800 text-forge-400 font-heading uppercase bg-forge-950/60">
                <th className="py-4 px-5 font-bold">Invoice #</th>
                <th className="py-4 px-4 font-bold">Athlete</th>
                <th className="py-4 px-4 font-bold">Plan &amp; Interval</th>
                <th className="py-4 px-4 font-bold">Amount</th>
                <th className="py-4 px-4 font-bold">Method</th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-5 font-bold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-850">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-forge-800/40 transition-colors">
                  <td className="py-4 px-5 font-mono font-bold text-white">{p.invoiceNumber}</td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-white font-heading">{p.userName}</p>
                    <span className="text-[10px] text-forge-400 font-mono">{p.razorpayPaymentId}</span>
                  </td>
                  <td className="py-4 px-4 text-forge-200">
                    <span className="font-semibold text-white">{p.planName}</span> ({p.billingInterval})
                  </td>
                  <td className="py-4 px-4 font-bold font-heading text-sm text-brand-orange">
                    {formatINR(p.amount)}
                  </td>
                  <td className="py-4 px-4 font-semibold text-forge-300">{p.paymentMethod}</td>
                  <td className="py-4 px-4">
                    <Badge variant={p.status === 'captured' ? 'success' : 'danger'}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-5 text-right text-forge-400">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
