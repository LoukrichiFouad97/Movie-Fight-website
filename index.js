// api key : 2f7c208
const ul = document.querySelector(".list");
const fetchData = async (searchTerm) => {
	const movie = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "2f7c208",
			s: searchTerm,
		},
	});
	const data = await movie.data;
	console.log(data.Search);
	data.Search.forEach((movie) => {
		const li = document.createElement("li");
		li.textContent = movie.Title;
		ul.append(li);
	});
};

const debounce = (func, delay = 1000) => {
	let timeoutId;
	return (...args) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func.apply(null, args);
		}, delay);
	};
};

const userSearch = document.querySelector("input");
const onInput = (e) => {
	fetchData(e.target.value);
};

userSearch.addEventListener("input", debounce(onInput));

userSearch.addEventListener("blur", () => {
	ul.style.display = "none";
});
userSearch.addEventListener("focus", () => {
	ul.style.display = "block";
});
