const categories = JSON.parse(localStorage.getItem("categories")) || [];
const objects = JSON.parse(localStorage.getItem("objects")) || [];

function saveToLocalStorage() {
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("objects", JSON.stringify(objects));
}

function renderHomePage() {
    const homeSection = document.getElementById("home-section");
    homeSection.innerHTML = "";
    objects.forEach((object) => {
        const card = document.createElement("div");
        card.className = "object-card";

        const name = document.createElement("h3");
        name.textContent = object.name;

        const category = document.createElement("p");
        category.textContent = `Category: ${object.category || "Uncategorized"}`;

        const image = document.createElement("img");
        image.src = object.image || "Demo Images/default-placeholder.png";
        image.alt = object.name;
        image.className = "object-image"; // Add a class for styling the larger image

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container"; // Add a class for styling the button container

        const kissButton = document.createElement("button");
        kissButton.textContent = "\uD83D\uDE18 Kiss";

        const slapButton = document.createElement("button");
        slapButton.textContent = "\uD83D\uDC4B Slap";

        const kissCounter = document.createElement("span");
        kissCounter.textContent = `Kisses: ${object.kisses || 0}`;
        kissCounter.className = "kiss-counter";

        const slapCounter = document.createElement("span");
        slapCounter.textContent = `Slaps: ${object.slaps || 0}`;
        slapCounter.className = "slap-counter";

        kissButton.addEventListener("click", () => {
            object.kisses = (object.kisses || 0) + 1;
            kissCounter.textContent = `Kisses: ${object.kisses}`;
            saveToLocalStorage();
        });

        slapButton.addEventListener("click", () => {
            object.slaps = (object.slaps || 0) + 1;
            slapCounter.textContent = `Slaps: ${object.slaps}`;
            saveToLocalStorage();
        });

        buttonContainer.appendChild(kissCounter);
        buttonContainer.appendChild(slapCounter);
        buttonContainer.appendChild(kissButton);
        buttonContainer.appendChild(slapButton);

        card.appendChild(name);
        card.appendChild(category);
        card.appendChild(image);
        card.appendChild(buttonContainer); // Append the button container instead of individual buttons
        homeSection.appendChild(card);
    });
}

function addCreateCategoryFeature() {
    const categoriesSection = document.getElementById("categories-section");

    const createCategoryContainer = document.createElement("div");
    createCategoryContainer.className = "create-category-container";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "New category name";
    input.className = "create-category-input";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Category";
    addButton.className = "create-category-button";
    addButton.addEventListener("click", () => {
        const newCategory = input.value.trim();
        if (newCategory) {
            categories.push(newCategory);
            saveToLocalStorage();
            renderCategoriesPage();
        }
    });

    createCategoryContainer.appendChild(input);
    createCategoryContainer.appendChild(addButton);
    categoriesSection.appendChild(createCategoryContainer);
}

function addCreateObjectFeature() {
    const objectsSection = document.getElementById("objects-section");

    const createObjectContainer = document.createElement("div");
    createObjectContainer.className = "create-object-container";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "New object name";
    nameInput.className = "create-object-input";

    const categorySelect = document.createElement("select");
    categorySelect.className = "create-object-category";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select category";
    categorySelect.appendChild(defaultOption);
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.accept = "image/*";
    imageInput.className = "create-object-image";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Object";
    addButton.className = "create-object-button";
    addButton.addEventListener("click", () => {
        const newObjectName = nameInput.value.trim();
        const selectedCategory = categorySelect.value;
        const imageFile = imageInput.files[0];

        if (newObjectName && selectedCategory) {
            const newObject = {
                name: newObjectName,
                category: selectedCategory,
                kisses: 0,
                slaps: 0,
            };

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newObject.image = e.target.result;
                    objects.push(newObject);
                    saveToLocalStorage();
                    renderObjectsPage();
                };
                reader.readAsDataURL(imageFile);
            } else {
                newObject.image = "Demo Images/default-placeholder.png";
                objects.push(newObject);
                saveToLocalStorage();
                renderObjectsPage();
            }
        } else {
            console.error("Please provide a name and select a category for the object.");
        }
    });

    createObjectContainer.appendChild(nameInput);
    createObjectContainer.appendChild(categorySelect);
    createObjectContainer.appendChild(imageInput);
    createObjectContainer.appendChild(addButton);
    objectsSection.appendChild(createObjectContainer);
}

// Modify renderCategoriesPage and renderObjectsPage to include the create feature
function renderCategoriesPage() {
    const categoriesSection = document.getElementById("categories-section");
    categoriesSection.innerHTML = "";
    categories.forEach((category, index) => {
        const categoryItem = document.createElement("div");
        categoryItem.className = "category-item";

        const name = document.createElement("span");
        name.textContent = category;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            const newName = prompt("Edit category name:", category);
            if (newName) {
                categories[index] = newName;
                saveToLocalStorage();
                renderCategoriesPage();
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            if (confirm(`Are you sure you want to delete the category '${category}'?`)) {
                categories.splice(index, 1);
                saveToLocalStorage();
                renderCategoriesPage();
            }
        });

        categoryItem.appendChild(name);
        categoryItem.appendChild(editButton);
        categoryItem.appendChild(deleteButton);
        categoriesSection.appendChild(categoryItem);
    });

    addCreateCategoryFeature();
}

function renderObjectsPage() {
    const objectsSection = document.getElementById("objects-section");
    objectsSection.innerHTML = "";
    objects.forEach((object, index) => {
        const objectItem = document.createElement("div");
        objectItem.className = "object-item";

        const name = document.createElement("span");
        name.textContent = object.name;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            const newName = prompt("Edit object name:", object.name);
            if (newName) {
                object.name = newName;
                saveToLocalStorage();
                renderObjectsPage();
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            if (confirm(`Are you sure you want to delete the object '${object.name}'?`)) {
                objects.splice(index, 1);
                saveToLocalStorage();
                renderObjectsPage();
            }
        });

        objectItem.appendChild(name);
        objectItem.appendChild(editButton);
        objectItem.appendChild(deleteButton);
        objectsSection.appendChild(objectItem);
    });

    addCreateObjectFeature();
}

document.addEventListener("DOMContentLoaded", () => {
    // Set the home section as the default visible section
    document.getElementById("categories-section").style.display = "none";
    document.getElementById("objects-section").style.display = "none";
    document.getElementById("home-section").style.display = "block";

    document.getElementById("tab-home").addEventListener("click", () => {
        document.getElementById("categories-section").style.display = "none";
        document.getElementById("objects-section").style.display = "none";
        document.getElementById("home-section").style.display = "block";
        renderHomePage();
    });

    document.getElementById("tab-categories").addEventListener("click", () => {
        document.getElementById("home-section").style.display = "none";
        document.getElementById("objects-section").style.display = "none";
        document.getElementById("categories-section").style.display = "block";
        renderCategoriesPage();
    });

    document.getElementById("tab-objects").addEventListener("click", () => {
        document.getElementById("home-section").style.display = "none";
        document.getElementById("categories-section").style.display = "none";
        document.getElementById("objects-section").style.display = "block";
        renderObjectsPage();
    });

    // Initialize home page rendering
    renderHomePage();
});
