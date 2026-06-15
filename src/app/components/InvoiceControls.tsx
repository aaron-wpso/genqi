'use client';

import { InvoiceData, SKUS, SkuKey } from '@/lib/invoice';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onPrint: () => void;
}

export default function InvoiceControls({ data, onChange, onPrint }: Props) {
  const set = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) =>
    onChange({ ...data, [key]: value });

  function applySku(key: SkuKey) {
    onChange({ ...data, sku: key, description: SKUS[key].desc, unitPrice: SKUS[key].price });
  }

  return (
    <div className="no-print bg-white rounded-lg shadow-md px-6 py-4 w-full max-w-[794px] flex flex-wrap gap-x-6 gap-y-3 items-end">
      <h3 className="w-full text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
        Edit Invoice
      </h3>

      <Field label="SKU">
        <select
          className="input"
          value={data.sku}
          onChange={e => applySku(e.target.value as SkuKey)}
        >
          <option value="full">Full Body — RM 198</option>
          <option value="half">Half Body — RM 131</option>
        </select>
      </Field>

      <Field label="Invoice No.">
        <input
          className="input w-[120px]"
          value={data.no}
          onChange={e => set('no', e.target.value)}
        />
      </Field>

      <Field label="Customer (M/S)">
        <input
          className="input w-[180px]"
          placeholder="Customer name"
          value={data.customerName}
          onChange={e => set('customerName', e.target.value)}
        />
      </Field>

      <Field label="Date">
        <input
          className="input"
          type="date"
          value={data.date}
          onChange={e => set('date', e.target.value)}
        />
      </Field>

      <Field label="Qty">
        <input
          className="input w-[80px]"
          type="number"
          min={1}
          value={data.qty}
          onChange={e => set('qty', Math.max(1, parseInt(e.target.value) || 1))}
        />
      </Field>

      <Field label="Unit Price (RM)">
        <input
          className="input w-[100px]"
          type="number"
          step="0.01"
          min={0}
          value={data.unitPrice}
          onChange={e => set('unitPrice', parseFloat(e.target.value) || 0)}
        />
      </Field>

      <Field label="Item Description">
        <input
          className="input w-[240px]"
          value={data.description}
          onChange={e => set('description', e.target.value)}
        />
      </Field>

      <div className="flex items-end pb-px">
        <button
          onClick={onPrint}
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition-colors"
        >
          🖨 Print / Save PDF
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}
