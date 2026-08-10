async function loadIntoTable(url, table) {
	const = tableBody = table.querySelector("tbody");
	const responce = await fetch(url);
	const rows = await response.json();
	
	console.log(data)
	tableBody.innerHTML = "";
	
	for (const row of rows) {
		const rowElement = document.createElement("tr");
		for (const cellText of row) {
			const cellElement = document.createElement("td");
			cellElement.textContent = cellText;
			rowElement.appendChild(cellElement);
		}
		tableBody.appendChild(rowElement);
	}
}

loadIntoTable("./data.json", document.querySelector("resultTable"));