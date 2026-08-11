//Setup
let libraryData = [];
let filteredData = [...libraryData];
const tableLimit = 20;
let currentPage = 1;

const tableBody = document.getElementById("tableBody");
const pageTab = document.getElementById("pageTab");
const resultsInfo = document.getElementById("numResults");
const searchInput = document.getElementById("searchInput");

//Load data into table
async function loadLibrary() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
		
		//Problem with the JSON data
        libraryData = await response.json();
		if (!Array.isArray(libraryData)) {
		            throw new Error("library.json must contain a JSON array.");
		        }
        filteredData = [...libraryData];
        displayTable();

	//Page not opened through localhost
    } catch (error) {
        console.error("Unable to load library data:", error);
		document.getElementById("tableBody").innerHTML = `
			<tr>
				<td colspan="7" class="empty">
					Unable to load library data.<br>
		            <small>${replaceEscapeValues(error.message)}</small>
		        </td>
		    </tr>
		 `;
    }
}
loadLibrary();

//Replace escape values
function replaceEscapeValues(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function renderTags(items) {
    if (!items) {
        return "";
    }
    // Supports either an array or a comma-separated string.
    if (!Array.isArray(items)) {
        items = String(items)
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }
    return items.map(item => `<span class="tag">${replaceEscapeValues(item)}</span>`).join(", ");
}

//Display data on table
function makeTable() {
    tableBody.innerHTML = "";
    const start = (currentPage - 1) * tableLimit;
    const end = start + tableLimit;
    const pageData = filteredData.slice(start, end);
	resultsInfo.textContent =`${filteredData.length} result${filteredData.length === 1 ? "" : "s"}`;

    if (pageData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    No books found.
                </td>
            </tr>
        `;
        return;
    }
	
	//Place individual books into their own row
    pageData.forEach(book => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="id">${replaceEscapeValues(book.id)}</td>

            <td class="title">
                ${replaceEscapeValues(book.title)}
            </td>

            <td class="author">
                ${replaceEscapeValues(book.author)}
            </td>

            <td class="date">
                ${replaceEscapeValues(book.date)}
            </td>

            <td class="genres">
                ${renderTags(book.genres)}
            </td>

            <td class="characters">
                ${renderTags(book.characters)}
            </td>

            <td class="synopsis">
                ${replaceEscapeValues(book.synopsis)}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

//Allow the user to tab through the different pages since they're limited to 20 results
function makePageTab() {
    pageTab.innerHTML = "";
    const totalPages = Math.ceil(filteredData.length / tableLimit);

    // Previous page button
    const previousButton = document.createElement("button");
    previousButton.textContent = "Previous";
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
        }
    });

    pageTab.appendChild(previousButton);

    // Create a page button
    function addPageButton(page) {
        const button = document.createElement("button");
        button.textContent = page;
        if (page === currentPage) {
            button.classList.add("active");
        }
        button.addEventListener("click", () => {
            currentPage = page;
            displayTable();
        });
        pageTab.appendChild(button);
    }

    function addEllipsis() {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        ellipsis.classList.add("ellipsis");
        pageTab.appendChild(ellipsis);
    }

    // Show all pages if there are 5 or fewer
    if (totalPages <= 5) {
        for (let page = 1; page <= totalPages; page++) {
            addPageButton(page);
        }
    }

    // More than 5 pages
    else {
        addPageButton(1);
		
		//First 5 and final
        if (currentPage <= 3) {
            addPageButton(2);
            addPageButton(3);
            addPageButton(4);
            addPageButton(5);
            addEllipsis();
            addPageButton(totalPages);
        }

		//First and final 4
        else if (currentPage >= totalPages - 2) {
            addEllipsis();
            addPageButton(totalPages - 4);
            addPageButton(totalPages - 3);
            addPageButton(totalPages - 2);
            addPageButton(totalPages - 1);
            addPageButton(totalPages);
        }
		
		//First, two surrounding current page, and final
        else {
            addEllipsis();
            addPageButton(currentPage - 1);
            addPageButton(currentPage);
            addPageButton(currentPage + 1);
            addEllipsis();
            addPageButton(totalPages);
        }
    }

    // Next page button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayTable();
        }
    });

    pageTab.appendChild(nextButton);
}

//Show table and page tab bar
function displayTable() {
    makeTable();
    makePageTab();
}

//Search rows based on search bar
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    filteredData = libraryData.filter(book => {
        return [book.id, book.title, book.author, book.date, book.genres, book.characters, book.synopsis].join(" ").toLowerCase().includes(query);
    });
    currentPage = 1;
    displayTable();
});

//Setup data manipulation buttons
const addButton = document.getElementById("addField");
const editButton = document.getElementById("editField");
const removeButton = document.getElementById("removeField");
const removeFields = document.getElementById("removeInputFields");
const editInput = document.getElementById("editInputFields");
const executeButton = document.getElementById("executeButton");
let commandType = "";

//Show the Entry fields
addButton.addEventListener("click", () => {
	editInput.classList.toggle("visible");
	removeFields.classList.remove("visible");
	commandType = "add";
});
editButton.addEventListener("click", () => {
	editInput.classList.toggle("visible");
	removeFields.classList.remove("visible");
	commandType = "edit";
});
removeButton.addEventListener("click", () => {
	editInput.classList.remove("visible");
	removeFields.classList.toggle("visible");
	commandType = "remove";
});

//Hide all entry fields
executeButton.addEventListener("click", () => {
	editInput.classList.remove("visible");
});