const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
<label><strong>Search for a Movie</strong></label>
<input class="input"/>
<div class="dropdown" >
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;

  const inptBox = root.querySelector('.input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  const onInput = async function (e) {
    const movies = await fetchData(e.target.value);
    console.log(movies);

    if (!movies.length) {
      dropdown.classList.remove('is-active');
      return;
    }

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');

    for (let movie of movies) {
      const option = document.createElement('a');

      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(movie);

      option.addEventListener('click', function () {
        dropdown.classList.remove('is-active');
        inptBox.value = inputValue(movie);
        onOptionSelect(movie);
      });

      resultsWrapper.appendChild(option);
    }
  };

  inptBox.addEventListener('input', debounce(onInput, 500));

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active');
    }
  });
};
