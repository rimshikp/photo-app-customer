import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faReceipt, faDownload } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import styles from "./Orders.module.css";
import { api } from "../../utils/api";
import InvoiceTemplate from '../components/invoice-template/InvoiceTemplate';

const Orders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
    const [showInvoice, setShowInvoice] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await api.post("/payments/my-orders", { page, limit });
        setOrders(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleDownload = async (orderData) => {
    try {
      setShowInvoice(orderData);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header isHome={false} />

      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Your Purchase History</h1>
          <p className={styles.heroSubtitle}>
            All your purchased photos in one place
          </p>
        </div>

  
        {isLoading?
        
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
          </div>
        :orders.length > 0 ? (
          <div className={styles.ordersContainer}>
            {orders.map((order) => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.orderId}>Order #: {order.razorpayOrderId}</span>
                    <span className={styles.orderDate}>Date: {formatDate(order.createdAt)}</span>
                  </div>
                  <span className={clsx(
                    styles.orderStatus,
                    order.status === 'paid' && styles.statusPaid,
                    order.status === 'completed' && styles.statusCompleted,
                    order.status === 'created' && styles.statusCreated,
                    order.status === 'failed' && styles.statusFailed
                  )}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className={styles.orderSummary}>
                  <div className={styles.orderTotal}>
                    Total: ₹{order.totalAmount} {order.currency}
                  </div>
                  <div className={styles.orderEmail}>
                    Email: {order.billingDetails?.email || 'N/A'}
                  </div>
                </div>

                <div className={styles.photosContainer}>
                  <h4 className={styles.photosTitle}>Purchased Photos ({order.photos.length})</h4>
                  {order.photos.map((item) => (
                    <div key={item._id} className={styles.photoItem}>
                      <img
                        src={item.photoId.compressedImageUrl}
                        alt={item.photoId.title}
                        className={styles.photoThumbnail}
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                      <div className={styles.photoDetails}>
                        <h4>{item.photoId.title}</h4>
                        <p className={styles.photoPrice}>Price: ₹{item.price}</p>
                        {item.photoId.tags?.length > 0 && (
                          <div className={styles.tagsContainer}>
                            {item.photoId.tags.map(tag => (
                              <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className={styles.downloadInfo}>
                          <span></span>
                          <button
                            onClick={() => handleDownload( order)}
                            disabled={item.downloadCount >= order.downloadLimit || order.status !== 'completed'}
                            className={styles.downloadButton}
                          >
                            <FontAwesomeIcon icon={faDownload} /> Download Original
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPreviousPage || isLoading}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNextPage || isLoading}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          !isLoading && (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIllustration}>
                <FontAwesomeIcon icon={faBoxOpen} className={styles.boxIcon} />
                <div className={styles.receiptPlaceholder}></div>
                <div className={styles.photoPlaceholder}></div>
                <div className={styles.photoPlaceholder}></div>
              </div>
              <h2 className={styles.emptyStateTitle}>No Orders Yet</h2>
              <p className={styles.emptyStateMessage}>
                You haven't made any purchases yet. Start exploring our gallery
                and find amazing photos to purchase!
              </p>
            </div>
          )
        )}
{/* {showInvoice && (
  <div className={styles.invoiceModal}>
    <div className={styles.invoiceModalContent}>
      <button 
        onClick={() => setShowInvoice(null)}
        className={styles.closeButton}
      >
        Close
      </button>
      <InvoiceTemplate order={showInvoice} />
    </div>
  </div>
)} */}
     
      </main>

      <Footer />
    </div>
  );
};

export default Orders;