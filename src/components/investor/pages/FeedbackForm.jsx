import { useState } from "react";
import { motion } from "framer-motion";
import GradientButton from "../../common/GradientButton";
import { FeedbackCard } from "../jsx/feedbackCard";
import styles from "./style/FeedbackForm.module.css";
import { Loader } from "../../common/Loader";
import { showToast } from "../../../utils/toastUtils";

const feelings = [
  { emoji: "😢", label: "Very Bad", rating: 1 },
  { emoji: "😔", label: "Bad", rating: 2 },
  { emoji: "😐", label: "Medium", rating: 3 },
  { emoji: "🙂", label: "Good", rating: 4 },
  { emoji: "🥰", label: "Very Happy", rating: 5 },
];

export default function FeedbackForm() {
  const [selected, setSelected] = useState(2);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    const feedbackData = {
      rating: feelings[selected].rating,
      comments: comment,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(feedbackData),
      });

      const result = await response.json();
      if (response.ok) {
        showToast(
          "success",
          result.message || "Feedback submitted successfully"
        );
      } else {
        setMessage(result.message || "Failed to submit feedback");
      }
    } catch (error) {
      showToast("error", error.message || "Failed to submit feedback");
    }
    setLoading(false);
  };
  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <FeedbackCard className={styles.card}>
        <h2 className={styles.title}>Got feedback for us?</h2>
        <p className={styles.subtitle}>
          Your input helps us improve our service.
        </p>

        <div className={styles.emojiContainer}>
          {feelings.map((feeling, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelected(index)}
              className={`${styles.emojiButton} ${
                selected === index ? styles.selectedEmoji : ""
              }`}
            >
              {feeling.emoji}
            </motion.button>
          ))}
        </div>

        <p className={styles.selectedLabel}>{feelings[selected].label}</p>

        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="Add valuable feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <GradientButton
          label={loading ? "Submitting..." : "Submit"}
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={loading}
        />
        {message && <p className={styles.message}>{message}</p>}
      </FeedbackCard>
    </div>
  );
}
