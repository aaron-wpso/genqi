import { InvoiceData, fmt, formatDate } from '@/lib/invoice';

interface Props {
  data: InvoiceData;
}

const EMPTY_ROWS = [2, 3, 4, 5];

export default function InvoicePreview({ data }: Props) {
  const total = data.qty * data.unitPrice;

  return (
    <div className="invoice" id="invoice">

      <div className="inv-header">
        <div className="inv-title">GENQI WELLNESS CENTRE</div>
        <div className="inv-reg">202403240826 (003645743-P)</div>
        <div className="inv-address">
          No. 4A, Jalan Sri Mujur 3, Taman Sri Mujur, Batu 9, 43200 Cheras, Selangor
        </div>
      </div>

      <hr className="inv-divider" />
      <div className="inv-cashbill">CASH BILL</div>

      <div className="inv-meta">
        <div className="inv-ms">
          M/S:&nbsp;
          <span className="inv-ms-value">{data.customerName}</span>
        </div>
        <div className="inv-meta-right">
          <div className="inv-no-row">
            No.&nbsp;<span className="inv-no-value">{data.no}</span>
          </div>
          <div className="inv-date-row">
            <span className="zh">日期</span>
            <span className="inv-date-label">/ Date:</span>
            <span>{data.date ? formatDate(data.date) : ''}</span>
          </div>
        </div>
      </div>

      <table className="inv-table">
        <thead>
          <tr>
            <th className="col-no">No</th>
            <th className="col-desc">
              <span className="zh">摘要</span>
              PARTICULARS / BUTIR-BUTIR
            </th>
            <th className="col-qty">
              <span className="zh">数量</span>
              QUANTITY / KUANTITI
            </th>
            <th className="col-price">
              <span className="zh">价格</span>
              UNIT PRICE / HARGA
            </th>
            <th className="col-amt">
              <span className="zh">银额</span>
              AMOUNT / NILAI
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="col-no">1</td>
            <td className="col-desc">
              <span className="item-text">{data.description}</span>
            </td>
            <td className="col-qty">{data.qty || ''}</td>
            <td className="col-price">{data.unitPrice ? fmt(data.unitPrice) : ''}</td>
            <td className="col-amt">
              <strong>{total ? fmt(total) : ''}</strong>
            </td>
          </tr>
          {EMPTY_ROWS.map(n => (
            <tr key={n}>
              <td className="col-no">{n}</td>
              <td></td><td></td><td></td><td></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="inv-total">
        <span>TOTAL / <span className="zh">总额</span> / JUMLAH</span>
        <span className="inv-total-amount">{total ? fmt(total) : ''}</span>
      </div>

      <div className="inv-footer-note">
        <span className="zh">货物出门，恕不退换</span><br />
        Goods sold are not returnable / Barang yang dijual tidak boleh dikembalikan
      </div>

      <div className="inv-footer">
        <div className="inv-sigs">
          <div className="inv-sig">
            {data.receivedByName && (
              <div className="inv-sig-filled">{data.receivedByName}</div>
            )}
            <div className="inv-sig-line" />
            <div className="inv-sig-label">
              Received by / Terima Oleh / 收货人
              {data.receivedByDate && (
                <span className="inv-sig-date">
                  &nbsp;·&nbsp;{formatDate(data.receivedByDate)}
                </span>
              )}
            </div>
          </div>
          <div className="inv-sig">
            {data.signatureDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.signatureDataUrl} alt="signature" className="inv-sig-img" />
            )}
            <div className="inv-sig-line" />
            <div className="inv-sig-label">Signature / Tandatangan / 经手人</div>
          </div>
        </div>
      </div>

    </div>
  );
}
