// api key : 2f7c208
// autocomplete object config
const autocompleteConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
		return `
			<img src="${imgSrc}"/>
			${movie.Title} (${movie.Year})
			`;
	},
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden");
		onMovieSelect(movie);
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
		const movie = await axios.get("http://www.omdbapi.com/", {
			params: {
				apikey: "2f7c208",
				s: searchTerm,
			},
		});

		// check if movie exists
		if (movie.data.Error) {
			return [];
		} else {
			return movie.data.Search;
		}
	},
};

// create left-autocomplete widget
createAutoComplete({
	...autocompleteConfig,
	root: document.querySelector(".left-autocomplete"),
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden");
		const summery = document.querySelector(".left-summery");
		onMovieSelect(movie, summery, "left");
	},
});

// create right-autocomplete widget
createAutoComplete({
	...autocompleteConfig,
	root: document.querySelector(".right-autocomplete"),
	onOptionSelect(movie) {
		const summery = document.querySelector(".right-summery");
		document.querySelector(".tutorial").classList.add("is-hidden");
		onMovieSelect(movie, summery, "right");
	},
});

// search movies by id
let leftSide;
let rightSide;
const onMovieSelect = async (movie, summery, side) => {
	const movieId = await movie.imdbID;
	const renderMovie = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "2f7c208",
			i: movieId,
		},
	});
	summery.innerHTML = movieTemplate(renderMovie.data);

	if (side === "left") {
		leftSide = renderMovie.data;
	} else {
		rightSide = renderMovie.data;
	}

	if (leftSide && rightSide) {
		runComparison();
	}
};

const runComparison = () => {
	const leftSideStats = document.querySelectorAll(
		".left-summery .notification"
	);
	const rightSideStats = document.querySelectorAll(
		".right-summery .notification"
	);

	leftSideStats.forEach((leftState, index) => {
		const rightState = rightSideStats[index];
		const leftValue = leftState.dataset.value;
		const rightValue = rightState.dataset.value;

		if (leftValue > rightValue) {
			leftState.classList.remove("is-primary");
			leftState.classList.add("is-warning");
		} else {
			rightState.classList.remove("is-primary");
			rightState.classList.add("is-warning");
		}
	});
};

// movie info
const movieTemplate = (movieDetail) => {
	const dollars = parseInt(
		movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
	);
	const metaScore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
	const awards = movieDetail.Awards.split(" ").reduce((prev, acc) => {
		const value = parseInt(acc);
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
					<img src="${movieDetail.Poster}" alt="${movieDetail.Title}">
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
		<article data-value=${awards} class="notification is-primary">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value=${dollars} class="notification is-primary">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article data-value=${metaScore} class="notification is-primary">
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
