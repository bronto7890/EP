let libraryData = [];

async function loadLibrary() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        libraryData = await response.json();
		if (!Array.isArray(libraryData)) {
		            throw new Error("library.json must contain a JSON array.");
		        }
        filteredData = [...libraryData];
        render();

    } catch (error) {
        console.error("Unable to load library data:", error);
		document.getElementById("libraryBody").innerHTML = `
			<tr>
				<td colspan="7" class="empty">
					Unable to load library data.<br>
		            <small>${escapeHtml(error.message)}</small>
		        </td>
		    </tr>
		 `;
    }
}

loadLibrary();

const ITEMS_PER_PAGE = 20;

let currentPage = 1;
let filteredData = [...libraryData];

const tableBody = document.getElementById("libraryBody");
const pagination = document.getElementById("pagination");
const resultsInfo = document.getElementById("resultsInfo");
const searchInput = document.getElementById("searchInput");


function escapeHtml(value) {
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

    return items
        .map(item => `<span class="tag">${escapeHtml(item)}</span>`)
        .join("");
}


function renderTable() {
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    const pageData = filteredData.slice(start, end);

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

    pageData.forEach(book => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="id">${escapeHtml(book.id)}</td>

            <td class="title">
                ${escapeHtml(book.title)}
            </td>

            <td class="author">
                ${escapeHtml(book.author)}
            </td>

            <td class="date">
                ${escapeHtml(book.data)}
            </td>

            <td class="genres">
                ${renderTags(book.genres)}
            </td>

            <td class="characters">
                ${renderTags(book.characters)}
            </td>

            <td class="synopsis">
                ${escapeHtml(book.synopsis)}
            </td>
        `;

        tableBody.appendChild(row);
    });
}


function renderPagination() {
    pagination.innerHTML = "";

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    if (totalPages <= 1) {
        resultsInfo.textContent =
            `${filteredData.length} result${filteredData.length === 1 ? "" : "s"}`;
        return;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(
        currentPage * ITEMS_PER_PAGE,
        filteredData.length
    );

    resultsInfo.textContent =
        `Showing ${start}-${end} of ${filteredData.length} results`;


    // Previous button
    const previousButton = document.createElement("button");
    previousButton.textContent = "Previous";
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            render();
        }
    });
    pagination.appendChild(previousButton);
	
    // Page buttons
    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");
        button.textContent = page;
        if (page === currentPage) {
            button.classList.add("active");
        }
        button.addEventListener("click", () => {
            currentPage = page;
            render();
        });
        pagination.appendChild(button);
    }


    // Next button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            render();
        }
    });
    pagination.appendChild(nextButton);
}

function render() {
    renderTable();
    renderPagination();
}

// Search/filter
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    filteredData = libraryData.filter(book => {
        return [book.id, book.title, book.author, book.data ,book.genres ,book.characters ,book.synopsis
        ].join(" ").toLowerCase().includes(query);
    });
    currentPage = 1;
    render();
});

render();