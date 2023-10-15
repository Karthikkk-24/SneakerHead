const bannerContainer = document.getElementById('bannerContainer');

const cardsContainer = document.querySelectorAll('.card');

cardsContainer.forEach((element) => {
    // element.addEventListener('mouseover', () => {
    //     element.firstElementChild.style.display = "flex";
    // });
    // element.addEventListener('mouseout', () => {
    //     element.firstElementChild.style.display = "none";
    // })
});


window.addEventListener('load', () => {
    fetchBanner();
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
    fetchAccessories();
});

function fetchBanner() {
    fetch ('../../ajax/fetchBanner.php')
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            // console.log(data[0][2]);
            const bannerImage = data[0][2];
            // const parsedResponse = JSON.parse(data);
            bannerContainer.style.backgroundImage = `url(public/${bannerImage})`;
        });
    
}

function fetchProducts() {

}

function fetchCategories() {

}

function fetchSubCategories() {

}

function fetchAccessories() {
    
}