const API_URL = "https://script.google.com/macros/s/AKfycbw3gZNMMj9qeFEXac0_-r8hmn9Te3vsaESGtIxWgH_4dNoDGAL5wCtHAOjmdlBeBOXR/exec";


/* =========================================
   LOAD COMPANY DATA
========================================= */

async function loadCompanies() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load company data.");
        }

        const companies = await response.json();

        updateStatistics(companies);
        updateCompanyTable(companies);

        console.log("Project Laptop data loaded:", companies);

    } catch (error) {

        console.error("Project Laptop:", error);

    }

}


/* =========================================
   UPDATE PUBLIC STATISTICS
========================================= */

function updateStatistics(companies) {

    const brands = companies.length;

    const responses = companies.filter(company =>
        [
            "REPLIED",
            "INTERESTED",
            "DECLINED",
            "CLOSED"
        ].includes(company.status)
    ).length;

    const interested = companies.filter(company =>
        company.status === "INTERESTED"
    ).length;

    const collaborations = companies.filter(company =>
        company.status === "CLOSED"
    ).length;

    const laptops = companies.filter(company =>
        company.status === "LAPTOP_RECEIVED"
    ).length;


    const brandsElement = document.getElementById("brands");
    const responsesElement = document.getElementById("responses");
    const interestedElement = document.getElementById("interested");
    const collaborationsElement = document.getElementById("collaborations");
    const laptopsElement = document.getElementById("laptops");


    if (brandsElement) {
        brandsElement.textContent = brands;
    }

    if (responsesElement) {
        responsesElement.textContent = responses;
    }

    if (interestedElement) {
        interestedElement.textContent = interested;
    }

    if (collaborationsElement) {
        collaborationsElement.textContent = collaborations;
    }

    if (laptopsElement) {
        laptopsElement.textContent = laptops;
    }

}


/* =========================================
   UPDATE COMPANY TABLE
========================================= */

function updateCompanyTable(companies) {

    const table = document.getElementById("companies");

    if (!table) {
        return;
    }

    table.innerHTML = "";


    if (companies.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4">
                    The experiment hasn't started yet.
                </td>
            </tr>
        `;

        return;
    }


    companies.forEach(company => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${company.company || "—"}</td>
            <td>${company.category || "—"}</td>
            <td>${company.status || "—"}</td>
            <td>${company.dateSent || "—"}</td>
        `;

        table.appendChild(row);

    });

}


/* =========================================
   START
========================================= */

loadCompanies();