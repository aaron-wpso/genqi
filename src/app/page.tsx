'use client';

import { useEffect, useRef, useState } from 'react';
import InvoiceControls from '@/app/components/InvoiceControls';
import InvoicePreview from '@/app/components/InvoicePreview';
import { DEFAULT_INVOICE, InvoiceData, loadSavedInvoiceNo, saveInvoiceNo } from '@/lib/invoice';

function InvoiceScaler({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateScale() {
      const available = (wrapperRef.current?.clientWidth ?? window.innerWidth) - 2;
      setScale(Math.min(1, available / 794));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // transform: scale() doesn't affect layout — compensate the lost height with margin
  const invoiceHeight = 1123;
  const marginBottom = scale < 1 ? (scale - 1) * invoiceHeight : 0;

  return (
    <div ref={wrapperRef} className="w-full flex justify-center">
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', marginBottom }}>
        {children}
      </div>
    </div>
  );
}

export default function InvoicePage() {
  const [invoice, setInvoice] = useState<InvoiceData>(DEFAULT_INVOICE);

  useEffect(() => {
    const savedNo = loadSavedInvoiceNo();
    if (savedNo) setInvoice(prev => ({ ...prev, no: savedNo }));
  }, []);

  function handleChange(next: InvoiceData) {
    setInvoice(next);
    saveInvoiceNo(next.no);
  }

  return (
    <main className="flex flex-col items-center gap-6 py-6 px-3 sm:px-5">
      <InvoiceControls data={invoice} onChange={handleChange} onPrint={() => window.print()} />
      <InvoiceScaler>
        <InvoicePreview data={invoice} />
      </InvoiceScaler>
    </main>
  );
}
