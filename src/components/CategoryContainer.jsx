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
            height: "10vh",
            width: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9b4ed"
        }
    }
  return (
    <div style={styles.contentContainer}>
      <div style={styles.categorySection}>something</div>
      <div style={styles.bannerSection}></div>
      <div style={styles.headingCategory}></div>
      <div></div>
    </div>
  )
}
