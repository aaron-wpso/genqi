export type SkuKey = 'full' | 'half';

export interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface InvoiceData {
  sku: SkuKey;
  no: string;
  customerName: string;
  date: string;
  items: LineItem[];
  stampDataUrl: string;
  signatureDataUrl: string;
  receivedByName: string;
  receivedByDate: string;
}

export const EMPTY_LINE_ITEM: LineItem = { description: '', qty: 0, unitPrice: 0 };

export const SKUS: Record<SkuKey, { desc: string; price: number }> = {
  full: { desc: 'GenQi Treatment (Full Body)', price: 198.0 },
  half: { desc: 'GenQi Treatment (Half Body)', price: 131.0 },
};

export const DEFAULT_INVOICE: InvoiceData = {
  sku: 'full',
  no: '',
  customerName: '',
  date: '',
  items: [
    EMPTY_LINE_ITEM,
    EMPTY_LINE_ITEM,
    EMPTY_LINE_ITEM,
    EMPTY_LINE_ITEM,
    EMPTY_LINE_ITEM,
  ],
  stampDataUrl: '',
  signatureDataUrl: '',
  receivedByName: '',
  receivedByDate: '',
};

export function fmt(n: number): string {
  return 'RM ' + n.toFixed(2);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${parseInt(d)}/${parseInt(m)}/${String(y).slice(2)}`;
}

const LS_KEY = 'genqi-invoice-no';

export function loadSavedInvoiceNo(): string | null {
  try {
    return localStorage.getItem(LS_KEY);
  } catch {
    return null;
  }
}

export function saveInvoiceNo(no: string): void {
  try {
    localStorage.setItem(LS_KEY, no);
  } catch {
    // silently fail in environments without localStorage
  }
}
