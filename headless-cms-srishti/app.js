const reviewsEl = document.getElementById('reviews');
const categorySelect = document.getElementById('category');
const refreshBtn = document.getElementById('refresh');

let reviewsCache = [];

async function loadReviews(){
  try{
    const res = await fetch('reviews.json', {cache: 'no-store'});
    const data = await res.json();
    reviewsCache = data.reviews || [];
    populateCategoryFilter(reviewsCache);
    renderReviews(reviewsCache);
  }catch(err){
    reviewsEl.innerHTML = '<p style="color:red">Could not load reviews.json</p>';
  }
}

function populateCategoryFilter(reviews){
  const categories = ['all', ...new Set(reviews.map(r => r.category))];
  categorySelect.innerHTML = categories
    .map(c => `<option value="${c}">${capitalize(c)}</option>`)
    .join('');
}

function renderReviews(list){
  if(!list.length){
    reviewsEl.innerHTML = '<p>No reviews found.</p>';
    return;
  }

  reviewsEl.innerHTML = list.map(r => `
    <article class="card">
      <div class="meta">
        <span class="rating">${r.rating}/5</span>
        <strong>${r.title}</strong>
      </div>
      <h3>${r.item}</h3>
      <p>${r.excerpt}</p>
      <p class="meta">Category: ${capitalize(r.category)} • By ${r.author}</p>
    </article>
  `).join('');
}

function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

categorySelect.addEventListener('change', () => {
  const value = categorySelect.value;
  if(value === "all") renderReviews(reviewsCache);
  else renderReviews(reviewsCache.filter(r => r.category === value));
});

refreshBtn.addEventListener('click', loadReviews);

loadReviews();
