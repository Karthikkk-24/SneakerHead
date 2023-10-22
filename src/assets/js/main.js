// const express = require('express');
// const app = express();
// const db = require('./db');

// const bannerContainer = document.getElementById('bannerContainer');

// const cardsContainer = document.querySelectorAll('.card');

// cardsContainer.forEach((element) => {
//     // element.addEventListener('mouseover', () => {
//     //     element.firstElementChild.style.display = "flex";
//     // });
//     // element.addEventListener('mouseout', () => {
//     //     element.firstElementChild.style.display = "none";
//     // })
// });


// window.addEventListener('load', () => {
//     fetchBanner();
//     fetchProducts();
//     fetchCategories();
//     fetchSubCategories();
//     fetchAccessories();
// });


// app.get('/fetch-banner-data', async (req, res) => {
//     try {
//         const [rows, fields] = await db.query('SELECT * FROM tbl_banner ORDER BY id DESC');
//         if (rows.length > 0) {
//             res.json(rows);
//         } else {
//             res.json([]);
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

// function fetchBanner() {
//     fetch ('../../ajax/fetchBanner.php')
//         .then(response => response.json())
//         .then(data => {
//             // console.log(data);
//             // console.log(data[0][2]);
//             const bannerImage = data[0][2];
//             // const parsedResponse = JSON.parse(data);
//             bannerContainer.style.backgroundImage = `url(public/${bannerImage})`;
//         });
    
// }

// function fetchProducts() {

// }

// function fetchCategories() {

// }

// function fetchSubCategories() {

// }

// function fetchAccessories() {
    
// }