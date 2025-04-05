import React from "react";
import "./style/FeedbackManagemenet.css";

const FeedbackCard = ({ feedback }) => {
  return (
    <div className="rating-card">
      <div className="text-wrapper">
        <p className="text-primary">{feedback.comments}</p>
        <p className="text-secondary">
          {new Date(feedback.submitted_at).toLocaleDateString()}
        </p>
      </div>

      <div className="rating-stars-container">
        {[5, 4, 3, 2, 1].map((star) => (
          <React.Fragment key={star}>
            <input
              value={`star-${star}`}
              name={`star-${feedback._id}`}
              id={`star-${star}-${feedback._id}`}
              type="radio"
              checked={star === feedback.rating}
              readOnly
            />
            <label
              htmlFor={`star-${star}-${feedback._id}`}
              className="star-label"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                  pathLength="360"
                ></path>
              </svg>
            </label>
          </React.Fragment>
        ))}
      </div>
      <div className="socials-container">
        by #{feedback.user_id || "Anonymous"}
      </div>
    </div>
  );
};

export default FeedbackCard;
