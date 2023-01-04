const merchand = document.querySelector('#review');
const stars = merchand.querySelectorAll('.star-review');
const reviewValue = document.querySelector('#review-value');
const reviewValueText = document.querySelector('#review-value-text');
const starsArray = Array.from(stars);
starsArray.forEach((star, index) => {
  fillStarsWithSelectedValue(index + 1);
  handleClickOnReview(star);
  handleHoverOnReview(star);
  console.log(merchand);
});

function handleHoverOnReview(star) {
  star.addEventListener('mouseover', () => {
    const rating = star?.dataset?.index;
    fillStars(rating);
    emptyStars(rating);
    
  });

  star.addEventListener('mouseout', () => {
    const rating = star?.dataset?.index;
    emptyStars(rating);
    fillStarsWithSelectedValue(merchand.dataset.selected);
  });
}

function handleClickOnReview(star) {
  star.addEventListener('click', () => {
    const rating = star?.dataset?.index;
    fillStars(rating);
    emptyStars(rating);
    merchand.dataset.selected = rating;

    reviewValue.innerHTML = rating;
   if(rating == 1)
   reviewValueText.innerHTML = " <strong> star: </strong>Very bad";
    if(rating == 2)
    reviewValueText.innerHTML = " <strong> stars: </strong>Bad";
    if(rating == 3)
    reviewValueText.innerHTML = " <strong> stars: </strong>Average";
    if(rating == 4)
    reviewValueText.innerHTML = " <strong> stars: </strong>Good";
    if(rating == 5)
    reviewValueText.innerHTML = " <strong> stars: </strong>Excellent"; 
    

  });
}

function fillStarsWithSelectedValue(index) {
  if (Number(index) !== Number(merchand.dataset.selected)) return;
  fillStars(Number(merchand.dataset.selected));
  emptyStars(Number(merchand.dataset.selected));
}

function emptyStars(rating) {
  const afterStar = starsArray.filter(
    (s) => Number(s.dataset.index) > Number(rating),
  );
  afterStar.forEach((s) => s.classList.remove('star-filled'));
}

function fillStars(rating) {
  const beforeStar = starsArray.filter(
    (s) => Number(s.dataset.index) <= Number(rating),
  );

  beforeStar.forEach((s) => s.classList.add('star-filled'));
}
