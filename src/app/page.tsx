'use client';

import { useEffect, useState } from 'react';
import InvoiceControls from '@/app/components/InvoiceControls';
import InvoicePreview from '@/app/components/InvoicePreview';
import { DEFAULT_INVOICE, InvoiceData, loadSavedInvoiceNo, saveInvoiceNo } from '@/lib/invoice';

export default function InvoicePage() {
  const [invoice, setInvoice] = useState<InvoiceData>(DEFAULT_INVOICE);

  // Hydrate date + saved invoice number on the client only (avoids SSR mismatch)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedNo = loadSavedInvoiceNo();
    setInvoice(prev => ({
      ...prev,
      date: today,
      ...(savedNo ? { no: savedNo } : {}),
    }));
  }, []);

  function handleChange(next: InvoiceData) {
    setInvoice(next);
    saveInvoiceNo(next.no);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <main className="flex flex-col items-center gap-10 py-8 px-5">
      <InvoiceControls data={invoice} onChange={handleChange} onPrint={handlePrint} />
      <InvoicePreview data={invoice} />
    </main>
  );
}
