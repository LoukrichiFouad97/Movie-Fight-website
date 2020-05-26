const createAutoComplete = ({
	root,
	renderOption,
	onOptionSelect,
	inputValue,
	fetchData,
}) => {
	root.innerHTML = `
  <label><b>Search for a Movie</b></label>
  <input class='input'>
  <div class='dropdown'>
    <div class='dropdown-menu'>
      <div class='dropdown-content results'></div>
    </div>
  </div>
`;

	const userSearch = root.querySelector("input");
	const dropdown = root.querySelector(".dropdown");
	const resultsWrapper = root.querySelector(".results");

	const onInput = async (e) => {
		const items = await fetchData(e.target.value);

		// hide dropdwon when user search is empty
		if (!items.length) {
			dropdown.classList.remove("is-active");
			return;
		}

		dropdown.classList.add("is-active");
		resultsWrapper.innerHTML = "";

		// add options to dropdown
		for (const item of items) {
			const option = document.createElement("a");
			option.classList.add("dropdown-item");
			option.innerHTML = renderOption(item);
			resultsWrapper.appendChild(option);

			// update user input when clicking on option
			option.addEventListener("click", () => {
				dropdown.classList.remove("is-active");
				userSearch.value = inputValue(item);
				onOptionSelect(item);
			});
		}
	};

	userSearch.addEventListener("input", debounce(onInput));

	// hide dropdown when clicking away
	document.addEventListener("click", (event) => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove("is-active");
		}
	});
};
