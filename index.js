const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}"/>
    <h1>${movie.Title}</h1>
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },

  fetchData: async function (searchTerm) {
    // console.log(searchTerm);
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apiKey: '38e02dba',
        s: searchTerm,
      },
    });

    console.log(response);

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  console.log(movie);
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apiKey: '38e02dba',
      i: movie.imdbID,
    },
  });

  console.log(response);
  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = function () {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = +leftStat.dataset.value;
    const rightSideValue = +rightStat.dataset.value;

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

const movieTemplate = (movieDetail) => {
  // '$629,000,00
  const dollars = +movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '');
  const metascore = +movieDetail.Metascore;
  const imdbRating = +movieDetail.imdbRating;
  const imdbVotes = +movieDetail.imdbVotes.replace(/,/g, '');
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = Number(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  console.log(awards);

  return ` 
<article class="media">
<figure class="media-left">
<p class="image">
 <img src="${movieDetail.Poster}" />
</p>
</figure>
<div class="media-content">
  <div class="content">
  <h1>${movieDetail.Title}</h1>
  <h4>${movieDetail.Genre}</h4>
  <p>${movieDetail.Plot}</p>
  </div>
</div>
</article>


<article data-value=${awards} class="notification is-primary ">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>  
</article>
<article data-value=${dollars} class="notification is-primary">
  <p class="title">${movieDetail.BoxOffice}</p>
  <p class="subtitle">Box Office</p>  
</article>
<article data-value=${metascore} class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>  
</article>
<article data-value=${imdbRating} class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>  
</article>
<article data-value=${imdbVotes} class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>  
</article>
`;
};
