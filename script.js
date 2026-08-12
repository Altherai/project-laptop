/* =========================================
   PROJECT LAPTOP
   LIVE DATA
========================================= */

const API_URL =
        "https://script.google.com/macros/s/AKfycbz2W7RtoCtcfoGnbjYM1n_pzTha6X4dkvxlMu5yNsve4t3wRsjF9ZbEAtqSsXmcj8p_yQ/exec";


/* =========================================
   HELPERS
========================================= */

function getElement(id) {
    return document.getElementById(id);
}


function formatDate(value) {

    if (!value || value === "—") {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================
   STATUS
========================================= */

function getStatusClass(status) {

    const normalized =
        String(status || "")
            .toUpperCase()
            .replaceAll(" ", "_");

    return normalized.toLowerCase();

}


function renderStatus(status) {

    const safeStatus =
        escapeHTML(status || "UNKNOWN");

    const statusClass =
        getStatusClass(status);

    return `
        <span class="status-pill status-${statusClass}">
            <span class="status-dot"></span>
            ${safeStatus}
        </span>
    `;

}


/* =========================================
   LOAD DATA
========================================= */

async function loadCompanies() {

    console.log("Project Laptop: loading data...");

    try {

        const url =
            `${API_URL}?t=${Date.now()}`;

        const response =
            await fetch(url, {
                method: "GET",
                cache: "no-store"
            });

        console.log(
            "Project Laptop: API response",
            response.status
        );


        if (!response.ok) {
            throw new Error(
                `API returned HTTP ${response.status}`
            );
        }


        const companies =
            await response.json();


        if (!Array.isArray(companies)) {
            throw new Error(
                "API did not return an array."
            );
        }


        console.log(
            "Project Laptop: data loaded",
            companies
        );


        updateStatistics(companies);

        updateCompanyTable(companies);


    } catch (error) {

        console.error(
            "Project Laptop API error:",
            error
        );

        showLoadError();

    }

}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics(companies) {

    const brands =
        companies.length;


    const responses =
        companies.filter(company =>
            [
                "REPLIED",
                "INTERESTED",
                "DECLINED",
                "CLOSED"
            ].includes(
                String(company.status || "")
                    .toUpperCase()
            )
        ).length;


    const interested =
        companies.filter(company =>
            String(company.status || "")
                .toUpperCase() === "INTERESTED"
        ).length;


    const collaborations =
        companies.filter(company =>
            [
                "CLOSED",
                "COLLABORATION"
            ].includes(
                String(company.status || "")
                    .toUpperCase()
            )
        ).length;


    const laptops =
        companies.filter(company =>
            String(company.status || "")
                .toUpperCase() === "LAPTOP_RECEIVED"
        ).length;


    const values = {
        brands,
        responses,
        interested,
        collaborations,
        laptops
    };


    Object.entries(values).forEach(
        ([id, value]) => {

            const element =
                getElement(id);

            if (element) {
                element.textContent = value;
            }

        }
    );

}


/* =========================================
   COMPANY TABLE
========================================= */

function updateCompanyTable(companies) {

    const table =
        getElement("companies");


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (companies.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" class="loading">
                    No companies have been added yet.
                </td>
            </tr>
        `;

        return;
    }


    companies.forEach(company => {

        const row =
            document.createElement("tr");


        const companyName =
            escapeHTML(company.company || "—");


        const category =
            escapeHTML(company.category || "—");


        const date =
            formatDate(company.dateSent);


        row.innerHTML = `
            <td>
                <strong>${companyName}</strong>
            </td>

            <td>
                ${category}
            </td>

            <td>
                ${renderStatus(company.status)}
            </td>

            <td>
                ${escapeHTML(date)}
            </td>
        `;


        table.appendChild(row);

    });

}


/* =========================================
   ERROR STATE
========================================= */

function showLoadError() {

    const table =
        getElement("companies");


    if (!table) {
        return;
    }


    table.innerHTML = `
        <tr>
            <td colspan="4" class="loading">
                Project data is temporarily unavailable.
                Please try again in a moment.
            </td>
        </tr>
    `;

}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    loadCompanies
);
