
document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("tbody");
    const form = document.getElementById("addUserForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    const loadData = async () => {
        const res = await fetch("/api/users");
        const users = await res.json();
        tbody.innerHTML = "";
        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td contenteditable="true" data-field="name">${user.name}</td>
                <td contenteditable="true" data-field="email">${user.email}</td>
                <td>
                    <button class="save" data-id="${user.id}">Save</button>
                    <button class="delete" data-id="${user.id}">Delete</button>
                </td>`;
            tbody.appendChild(row);
        });
    };

    tbody.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("save")) {
            const row = e.target.closest("tr");
            const name = row.querySelector('[data-field="name"]').innerText;
            const email = row.querySelector('[data-field="email"]').innerText;
            await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email })
            });
            loadData();
        } else if (e.target.classList.contains("delete")) {
            await fetch(`/api/users/${id}`, {
                method: "DELETE"
            });
            loadData();
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = nameInput.value;
        const email = emailInput.value;
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });
        nameInput.value = "";
        emailInput.value = "";
        loadData();
    });

    loadData();
});
