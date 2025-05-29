import styles from "./OrderCard.module.css";

const OrderCard = ({ order }) => {
  const formattedPhoto = order?.photo

  return (
    <div className={styles.orderCard}>
      {formattedPhoto && (
        <div className={styles.photoContainer}>
          <img
            src={formattedPhoto.formats.small.url}
            alt={formattedPhoto.title}
            className={styles.photo}
          />
        </div>
      )}
      <div className={styles.orderDetails}>
        <h4 className={styles.orderTitle}>
          {formattedPhoto?.title || "Untitled Photo"}
        </h4>
        <div className={styles.orderMeta}>
          <span className={styles.orderPrice}>${order.amount / 100}</span>
          <span className={styles.orderStatus}>{order.status}</span>
        </div>
        <div className={styles.orderDate}>
          Purchased on: {new Date(order.createdAt).toLocaleString()}
        </div>
        {order.downloadUrl && (
          <a
            href={order.downloadUrl}
            className={styles.downloadButton}
            download
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
};

export default OrderCard;