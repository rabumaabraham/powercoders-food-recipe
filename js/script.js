/*=============== SHOW MENU LOGIC ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

// Show menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Hide menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLinks = document.querySelectorAll('.nav__link');
const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav_link, we remove the show-menu class
    navMenu.classList.remove('show-menu');
};
navLinks.forEach(n => n.addEventListener('click', linkAction));

/*=============== ADD BLUR HEADER ===============*/
const blurHeader = () => {
    const header = document.getElementById('header');
    window.scrollY >= 50 ? header.classList.add('blur-header') : header.classList.remove('blur-header');
};
window.addEventListener('scroll', blurHeader);



/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up');
    window.scrollY >= 350 ? scrollUp.classList.add('show-scroll') : scrollUp.classList.remove('show-scroll');
};
window.addEventListener('scroll', scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            sectionLink.classList.add('active-link');
        } else {
            sectionLink.classList.remove('active-link');
        }
    });
};
window.addEventListener('scroll', scrollActive);

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // Reset: true // animations repeat
});
sr.reveal('.home_data, .contact__container');
sr.reveal('.home_img', { delay: 600 });
sr.reveal('.home_scroll', { delay: 800 });
sr.reveal('.recipe_card', { interval: 100 });





//// api 
const apiBaseUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            fetchMeals(category);
        });
    });
});

async function fetchMeals(category) {
    const response = await fetch(apiBaseUrl + category);
    const data = await response.json();
    displayMeals(data.meals);
}

async function getMealDetails(mealId) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    return data.meals[0]; 
}

async function displayMeals(meals) {
    const mealCards = document.getElementById('meal-cards');
    mealCards.innerHTML = ''; 

    if (meals && meals.length) {
        const mealsToDisplay = meals.slice(0, 6); 

        for (const meal of mealsToDisplay) {
            const mealDetails = await getMealDetails(meal.idMeal);
            const ingredients = getIngredients(mealDetails);

            mealCards.innerHTML += `
                <div class="meal-card">
                    <div class="meal-img-container">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-img">
                    </div>
                    <h3 class="meal-card-title">${meal.strMeal}</h3>
                    <p class="meal-card-description">${ingredients}</p> <!-- Display ingredients -->
                </div>`;
        }
    } else {
        mealCards.innerHTML = '<p>No meals found.</p>';
    }
}

function getIngredients(mealDetails) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = mealDetails[`strIngredient${i}`];
        const measure = mealDetails[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`${measure} ${ingredient}`.trim());
        }
    }
    return ingredients.join(', '); 
}