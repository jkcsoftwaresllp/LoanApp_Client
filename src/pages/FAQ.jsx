import React, { useState, useEffect } from "react";
import styles from "./style/FAQ.module.css";
import { Loader } from "../components/common/Loader";
import { fetchFAQs } from "./helper/faqHelper";
import axios from "axios";
import { Button } from "../components/common/Button";
import { showToast } from "../utils/toastUtils";
import { IconBtn } from "../components/common/IconBtn";
import { AddIcon, EditIcon } from "../components/common/assets";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [newFAQ, setNewFAQ] = useState({
    question: "",
    answer: "",
    category: "General",
  });
  const [editFAQ, setEditFAQ] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getFAQs = async () => {
      try {
        const data = await fetchFAQs(setLoading);
        setFaqs(data);
      } catch (err) {
        setError("Failed to fetch FAQs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getFAQs();

    const role = localStorage.getItem("role");
    console.log("User role:", role);
    setIsAdmin(role === "admin");
  }, []);

  const handleAddFAQ = async () => {
    try {
      const response = await axios.post("auth/faq/add", newFAQ);
      setFaqs([...faqs, response.data]);
      setNewFAQ({ question: "", answer: "", category: "General" });
      setShowOverlay(false);
      showToast("FAQ added successfully!", "success");
    } catch (err) {
      showToast("Failed to add FAQ", "error");
    }
  };

  const handleUpdateFAQ = async () => {
    try {
      const response = await axios.put(
        `auth/faq/update/${editFAQ.faq_id}`,
        editFAQ
      );
      setFaqs(
        faqs.map((faq) => (faq.faq_id === editFAQ.faq_id ? response.data : faq))
      );
      setShowOverlay(false);
      showToast("FAQ updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update FAQ", "error");
    }
  };

  const openAddOverlay = () => {
    setNewFAQ({ question: "", answer: "", category: "General" });
    setIsEditing(false);
    setShowOverlay(true);
  };

  const openEditOverlay = (faq) => {
    setEditFAQ(faq);
    setIsEditing(true);
    setShowOverlay(true);
  };

  const categories = [
    "All",
    "Loan Application",
    "Payments",
    "Account",
    "General",
  ];

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

      {/* Overlay */}
      {showOverlay && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <h2>{isEditing ? "Edit FAQ" : "Add New FAQ"}</h2>
            <input
              className={styles.faqInput}
              value={isEditing ? editFAQ.question : newFAQ.question}
              onChange={(e) =>
                isEditing
                  ? setEditFAQ({ ...editFAQ, question: e.target.value })
                  : setNewFAQ({ ...newFAQ, question: e.target.value })
              }
              placeholder="Question"
            />
            <textarea
              value={isEditing ? editFAQ.answer : newFAQ.answer}
              onChange={(e) =>
                isEditing
                  ? setEditFAQ({ ...editFAQ, answer: e.target.value })
                  : setNewFAQ({ ...newFAQ, answer: e.target.value })
              }
              placeholder="Answer"
              className={styles.faqTextarea}
            />
            <select
              value={isEditing ? editFAQ.category : newFAQ.category}
              className={styles.faqInput}
              onChange={(e) =>
                isEditing
                  ? setEditFAQ({ ...editFAQ, category: e.target.value })
                  : setNewFAQ({ ...newFAQ, category: e.target.value })
              }
            >
              {categories
                .filter((c) => c !== "All")
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
            <div className={styles.overlayButtons}>
              <Button
                onClick={isEditing ? handleUpdateFAQ : handleAddFAQ}
                text={isEditing ? "Update" : "Submit"}
              />

              <Button
                variant="secondary"
                onClick={() => setShowOverlay(false)}
                text="Cancel"
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <input
            id="search"
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.search__input}
          />
          {isAdmin && (
            <IconBtn
              icon={<AddIcon />}
              onClick={openAddOverlay}
              className={styles.addBtn}
            />
          )}
        </div>
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
                    {isAdmin && (
                      <button
                        className={styles.editBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditOverlay(faq);
                        }}
                      >
                        <EditIcon />
                      </button>
                    )}
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
