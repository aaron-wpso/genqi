'use client';

import { useRef } from 'react';
import { DEFAULT_INVOICE, InvoiceData, LineItem, SKUS, SkuKey, EMPTY_LINE_ITEM } from '@/lib/invoice';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onPrint: () => void;
}

export default function InvoiceControls({ data, onChange, onPrint }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) =>
    onChange({ ...data, [key]: value });

  function applySku(key: SkuKey) {
    const updated = data.items.map((item, i) =>
      i === 0 ? { ...item, description: SKUS[key].desc, unitPrice: SKUS[key].price } : item
    );
    onChange({ ...data, sku: key, items: updated });
  }

  function setItem(index: number, field: keyof LineItem, value: string | number) {
    const next = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: next });
  }

  function handleSignatureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('signatureDataUrl', (ev.target?.result as string) ?? '');
    reader.readAsDataURL(file);
  }

  function clearHeader() {
    onChange({ ...data, sku: DEFAULT_INVOICE.sku, no: '', customerName: '', date: '' });
  }

  function clearItems() {
    onChange({ ...data, items: [EMPTY_LINE_ITEM, EMPTY_LINE_ITEM, EMPTY_LINE_ITEM, EMPTY_LINE_ITEM, EMPTY_LINE_ITEM] });
  }

  function clearSignature() {
    set('signatureDataUrl', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function clearReceivedBy() {
    onChange({ ...data, receivedByName: '', receivedByDate: '' });
  }

  return (
    <div className="no-print bg-white rounded-lg shadow-md px-6 py-4 w-full max-w-[794px] flex flex-wrap gap-x-6 gap-y-3 items-end">
      <h3 className="w-full text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
        Edit Invoice
      </h3>

      {/* ── Invoice Details ── */}
      <div className="w-full">
        <SectionHeader label="Invoice Details" onClear={clearHeader} />
        <div className="flex flex-wrap gap-x-6 gap-y-3 items-end mt-2">
          <Field label="SKU">
            <select className="input" value={data.sku} onChange={e => applySku(e.target.value as SkuKey)}>
              <option value="full">Full Body — RM 198</option>
              <option value="half">Half Body — RM 131</option>
            </select>
          </Field>

          <Field label="Invoice No.">
            <input className="input w-[120px]" value={data.no} onChange={e => set('no', e.target.value)} />
          </Field>

          <Field label="Customer (M/S)">
            <input className="input w-[180px]" placeholder="Customer name" value={data.customerName} onChange={e => set('customerName', e.target.value)} />
          </Field>

          <Field label="Date">
            <input className="input" type="date" value={data.date} onChange={e => set('date', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* ── Items ── */}
      <div className="w-full border-t border-gray-100 pt-3">
        <SectionHeader label="Items" onClear={clearItems} />
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex gap-x-3 items-end pl-6">
            <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold w-[240px]">Description</span>
            <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold w-[70px]">Qty</span>
            <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold w-[100px]">Unit Price (RM)</span>
          </div>
          {data.items.map((item, i) => (
            <div key={i} className="flex flex-wrap gap-x-3 gap-y-2 items-center">
              <span className="text-xs text-gray-400 font-bold w-4 text-right">{i + 1}</span>
              <input
                className="input w-[240px]"
                placeholder={`Item ${i + 1} description`}
                value={item.description}
                onChange={e => setItem(i, 'description', e.target.value)}
              />
              <input
                className="input w-[70px]"
                type="number"
                min={0}
                value={item.qty === 0 ? '' : item.qty}
                onChange={e => setItem(i, 'qty', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <input
                className="input w-[100px]"
                type="number"
                step="0.01"
                min={0}
                value={item.unitPrice === 0 ? '' : item.unitPrice}
                onChange={e => setItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Authorised Signature ── */}
      <div className="w-full border-t border-gray-100 pt-3">
        <SectionHeader label="Authorised Signature" onClear={clearSignature} />
        <div className="flex items-center gap-2 mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleSignatureUpload}
            className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 cursor-pointer"
          />
          {data.signatureDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.signatureDataUrl} alt="signature preview" className="h-8 w-auto rounded border border-gray-200" />
          )}
        </div>
      </div>

      {/* ── Received By ── */}
      <div className="w-full border-t border-gray-100 pt-3">
        <SectionHeader label="Received By" onClear={clearReceivedBy} />
        <div className="flex flex-wrap gap-x-6 gap-y-3 items-end mt-2">
          <Field label="Name">
            <input className="input w-[220px]" placeholder="Name" value={data.receivedByName} onChange={e => set('receivedByName', e.target.value)} />
          </Field>
          <Field label="Date">
            <input className="input" type="date" value={data.receivedByDate} onChange={e => set('receivedByDate', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* ── Print ── */}
      <div className="flex items-end pb-px ml-auto">
        <button onClick={onPrint} className="px-4 py-2 rounded bg-[#3a3a8c] hover:bg-[#2e2e70] text-white text-sm font-semibold transition-colors">
          🖨 Print / Save PDF
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">{label}</span>
      <button
        onClick={onClear}
        title={`Clear ${label}`}
        className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-400 transition-colors text-xs font-bold leading-none"
      >
        ✕
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">{label}</label>
      )}
      {children}
    </div>
  );
}
