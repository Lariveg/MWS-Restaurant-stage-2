let restaurant;
var map;

//skip link for google maps
const skipLink = document.querySelector(".skip-link");
const name = document.getElementById('restaurant-name');
skipLink.addEventListener('click', function(){
  name.focus();
});

const submit = document.querySelector(".submit");
submit.addEventListener("click", function(){
  postReview();
});

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
    DBHelper.addReviewsFromAPI(id).then(function(reviews){
      fillReviewsHTML(reviews);
    })
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  name.innerHTML = restaurant.name;
  console.log(restaurant);
  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.alt = restaurant.name + " Restaurant";
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);
  createFormHTML();

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }

  console.log(reviews);
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  const serverDate = new Date(review.createdAt);
  date.innerHTML = serverDate.toDateString();
  
 
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

createFormHTML = () => {
  const form = document.getElementById("form-review");

  const name = document.createElement("input");
  name.setAttribute("type", "text");
  name.setAttribute("id", "username");
  name.setAttribute("name", "name");
  name.setAttribute("placeholder", "Name");
  form.appendChild(name);

  const rating = document.createElement("input");
  rating.setAttribute("type", "text");
  rating.setAttribute("id", "rating");
  rating.setAttribute("name", "rating");
  rating.setAttribute("placeholder", "Rating");
  form.appendChild(rating);

  const comment = document.createElement("textarea");
  comment.setAttribute("name", "comments");
  comment.setAttribute("id", "comment");
  comment.setAttribute("rows", "10");
  comment.setAttribute("placeholder", "Write a review");
  comment.setAttribute("required", "true");
  form.appendChild(comment);
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

postReview = (restaurant = self.restaurant) => {
  const restaurantId = restaurant.id;
  const username = document.getElementById("username").value;
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;
  let date = new Date();
  console.log(date);

  let reviewForPost = {
    restaurant_id: restaurantId,
    name: username,
    rating: rating,
    comments: comment,
  }

  fetch(`http://localhost:1337/reviews/`, {
    method: 'POST',
    body: JSON.stringify(reviewForPost),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(review => {
    console.log(review);
    const ul = document.getElementById('reviews-list');
    ul.appendChild(createReviewHTML(review));
  })
  .catch(error => {
    console.log(error);
  });


}