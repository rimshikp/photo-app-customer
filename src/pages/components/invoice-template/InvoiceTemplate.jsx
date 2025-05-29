import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styles from './InvoiceTemplate.module.css';

const InvoiceTemplate = ({ order }) => {
  const componentRef = useRef();
  const formattedPhoto = order?.photo;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; } 
      }
    `,
    documentTitle: `Invoice_${order._id}`,
  });

  return (
    <div ref={componentRef} className={styles.invoiceContainer}>
      <button onClick={handlePrint} className={styles.printButton}>
        Print Invoice
      </button>
      
      <div ref={componentRef} className={styles.invoice}>
        <header className={styles.invoiceHeader}>
          <div className={styles.companyInfo}>
            <h1>Your Photography</h1>
            <p>123 Art Street, Creative City</p>
            <p>Phone: (123) 456-7890</p>
            <p>Email: contact@yourphotography.com</p>
          </div>
          <div className={styles.invoiceTitle}>
            <h2>INVOICE</h2>
            <div className={styles.invoiceMeta}>
              <p>Invoice #: {order._id}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </header>

        <div className={styles.clientInfo}>
          <h3>Bill To:</h3>
          <p>{order.user?.full_name || 'Customer'}</p>
          <p>{order.user?.email}</p>
        </div>

        <div className={styles.orderSection}>
          <h3>Order Details</h3>
          <div className={styles.orderItem}>
            {formattedPhoto && (
              <div className={styles.photoPreview}>
                <img
                  src={formattedPhoto.formats.small.url}
                  alt={formattedPhoto.title}
                />
              </div>
            )}
            <div className={styles.itemDetails}>
              <h4>{formattedPhoto?.title || "Untitled Photo"}</h4>
              <p>License: Standard</p>
              <p>Resolution: {formattedPhoto?.width} × {formattedPhoto?.height}</p>
            </div>
            <div className={styles.itemPrice}>
              ${order.amount / 100}
            </div>
          </div>
        </div>

        <div className={styles.totalsSection}>
          <div className={styles.totalsRow}>
            <span>Subtotal:</span>
            <span>${order.amount / 100}</span>
          </div>
          <div className={styles.totalsRow}>
            <span>Tax (0%):</span>
            <span>$0.00</span>
          </div>
          <div className={styles.totalsRowGrand}>
            <span>Total:</span>
            <span>${order.amount / 100}</span>
          </div>
        </div>

        <div className={styles.paymentInfo}>
          <h3>Payment Information</h3>
          <p>Status: <span className={styles[order.status.toLowerCase()]}>{order.status}</span></p>
          <p>Payment Method: {order.paymentMethod || 'Credit Card'}</p>
          <p>Transaction ID: {order.paymentId || 'N/A'}</p>
        </div>

        <footer className={styles.invoiceFooter}>
          <p>Thank you for your purchase!</p>
          <p>All sales are final. For questions, contact support@yourphotography.com</p>
        </footer>
      </div>
    </div>
  );
};

export default InvoiceTemplate;