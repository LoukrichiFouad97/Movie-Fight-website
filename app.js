// api key : 2f7c208
const userSearch = document.querySelector("input");
const fetchData = async (url) => {
	const movie = await axios.get(url, {
		params: {
			apikey: "2f7c208",
			s: userSearch.value,
		},
	});
	const data = await movie.data;
	console.log(data.Search);
};

userSearch.addEventListener(
	"input",
	fetchData.bind(null, "http://www.omdbapi.com/")
);
