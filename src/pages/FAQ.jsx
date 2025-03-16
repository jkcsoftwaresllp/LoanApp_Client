import React, { useState, useEffect } from "react";
import styles from "./style/FAQ.module.css";
import { Loader } from "../components/common/Loader";
import apiRequest from "../components/common/authApi";
import { showToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../config";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);

  const categories = [
    "All",
    "Loan Application",
    "Payments",
    "Account",
    "General",
  ];

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        console.log("🛠 Access Token:", accessToken);

        if (!accessToken) {
          showToast("error", "Please log in.");
          throw new Error("Access token is missing.");
        }

        const response = await apiRequest(
          "GET",
          `${API_BASE_URL}auth/faq/list`,
          null,
          accessToken,
          setLoading
        );

        console.log("✅ API Response:", response);

        // Extract the "faqs" array properly
        if (response.data && Array.isArray(response.data.faqs)) {
          setFaqs(response.data.faqs);
        } else {
          throw new Error("Invalid API response format.");
        }
      } catch (err) {
        console.error("❌ API Error:", err.message || err);
        setError("Failed to fetch FAQs. Please try again.");
        showToast("error", "Failed to fetch FAQs.");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleQuestion = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
      <h1 className={styles.title}>Frequently Asked Questions</h1>

      <div className={styles.searchContainer}>
        <input
          id="search"
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.search__input}
        />
      </div>

      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.categoryBtn} ${
              activeCategory === category ? styles.active : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className={styles.faqListContainer}>
        <div className={styles.faqList}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div key={faq.faq_id} className={styles.faqItem}>
                <div
                  className={styles.question}
                  onClick={() => toggleQuestion(faq.faq_id)}
                >
                  <h3>{faq.question}</h3>
                  <span
                    className={`${styles.arrow} ${
                      expandedId === faq.faq_id ? styles.expanded : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
                {expandedId === faq.faq_id && (
                  <div className={styles.answer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              No FAQs found matching your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
