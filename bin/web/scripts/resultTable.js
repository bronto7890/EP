async function loadIntoTable(url, table) {
	const = tableHead = table.querySelector("thead");
	const = tableBody = table.querySelector("tbody");
	const responce = await fetch(url);
	const data = await response.json();
	
	console.log(data)
}

loadIntoTable("./data.json", document.querySelector("resultTable"));