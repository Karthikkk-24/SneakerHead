import React from 'react'

export default function CategoryContainer() {
    const styles = {
        contentContainer: {
            height: "auto",
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "3vh",
            backgroundColor: "#ececec",
            padding: "3vh 0"
        },
        categorySection: {
            height: "25vh",
            width: "80%",
            display: "flex",
            alignItems: "center",
            padding: "0 2vw",
            justifyContent: "space-between",
            backgroundColor: "#f9b4ed"
        },
        categoryTab: {
            height: "80%",
            width: "14%",
            backgroundColor: "white",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 2px 10px",
        },
        bannerSection: {
            height: "45vh",
            width: "80%",
            backgroundColor: "white",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 2px 10px",
        }
    }
  return (
    <div style={styles.contentContainer}>
      <div style={styles.categorySection}>
        <div style={styles.categoryTab}></div>
        <div style={styles.categoryTab}></div>
        <div style={styles.categoryTab}></div>
        <div style={styles.categoryTab}></div>
        <div style={styles.categoryTab}></div>
        <div style={styles.categoryTab}></div>
      </div>
      <div style={styles.bannerSection}></div>
      <div style={styles.headingCategory}></div>
      <div></div>
    </div>
  )
}
