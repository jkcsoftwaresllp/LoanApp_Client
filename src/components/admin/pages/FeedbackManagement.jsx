import React, { useEffect, useState } from "react";
import { fetchUserFeedback } from "./helper/feedbackHelper";
import FeedbackCard from "../../common/FeedbcakReviewCard";
import { Loader } from "../../common/Loader";
import styles from "./style/FeedbackReviewPage.module.css";

const FeedbackManagement = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const response = await fetchUserFeedback();
        setFeedbackData(response.feedback); // Access the feedback array from response
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, []);

  if (loading)
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Feedback</h1>
      <div className={`${styles.cardArea} ${styles.responsiveLayout}`}>
        {feedbackData.length > 0 ? (
          feedbackData.map((feedback) => (
            <FeedbackCard key={feedback._id} feedback={feedback} />
          ))
        ) : (
          <p className={styles.noFeedback}>No feedback available</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;
