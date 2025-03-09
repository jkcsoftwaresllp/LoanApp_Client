import React, { useState, useEffect } from "react";
import styles from "./style/FAQ.module.css";

import { Loader } from "../components/common/Loader";

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

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      const mockFaqs = [
        {
          id: 1,
          category: "Loan Application",
          question: "How do I apply for a loan?",
          answer:
            'To apply for a loan, log into your account, click on "Apply for Loan" button on the dashboard, fill in the required information, and submit your application with necessary documents.',
        },
        {
          id: 2,
          category: "Payments",
          question: "How can I pay my EMI?",
          answer:
            "You can pay your EMI through various methods including net banking, UPI, or auto-debit facility. Visit the Repayment section for more details.",
        },
        {
          id: 3,
          category: "Account",
          question: "How do I update my profile information?",
          answer:
            "Go to Profile Settings in your dashboard, click on Edit Profile, make the necessary changes, and click Save to update your information.",
        },
        {
          id: 4,
          category: "General",
          question: "What documents are required for loan application?",
          answer:
            "Generally required documents include ID proof, address proof, income proof, and bank statements for the last 3 months.",
        },
        {
          id: 5,
          category: "Loan Application",
          question: "What is the maximum loan amount?",
          answer:
            "The maximum loan amount depends on your income, credit score, and other eligibility factors. Login to check your personalized offer.",
        },
      ];
      setFaqs(mockFaqs);
      setLoading(false);
    }, 1000);
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

      <div className={styles.faqList}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <div
                className={styles.question}
                onClick={() => toggleQuestion(faq.id)}
              >
                <h3>{faq.question}</h3>
                <span
                  className={`${styles.arrow} ${
                    expandedId === faq.id ? styles.expanded : ""
                  }`}
                >
                  ▼
                </span>
              </div>
              {expandedId === faq.id && (
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                  <div className={styles.feedback}>
                    <span>Was this helpful?</span>
                    <button onClick={() => console.log("Helpful")}>👍</button>
                    <button onClick={() => console.log("Not Helpful")}>
                      👎
                    </button>
                  </div>
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
  );
};

export default FAQ;
