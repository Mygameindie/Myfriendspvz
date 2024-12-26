
// Refactored script.js with "base" always visible and non-removable

// JSON file paths
const jsonFiles = [
    'accessories.json',
    'backpack.json',
    'jacket.json',
    'pants.json',
    'shoes.json',
    'base.json',
    'top.json',
    'weapon.json',
    'plants.json',
    'waist.json',
    'hat.json',
];

// Z-index mapping
const zIndexMap = {
    backpack: 1,
    base: 2,
    shoes: 3,
    pants: 4,
    top: 5,
    jacket: 6,
    accessories: 7,
    weapon: 8,
    plants: 9,
    hat: 10,
    waist: 11,
};

// Load items and initialize
async function loadItems() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');

    for (const file of jsonFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Failed to load file: ${file}`);
            const items = await response.json();
            const category = file.replace('.json', '');

            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category');

            const categoryHeading = document.createElement('h3');
            categoryHeading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryContainer.appendChild(categoryHeading);

            items.forEach(item => {
                const img = document.createElement('img');
                img.id = item.id;
                img.src = item.src;
                img.alt = item.alt;
                img.classList.add(category);
                img.dataset.clickCount = 0; // Initialize click count
                img.style.visibility = category === 'base' ? 'visible' : 'hidden'; // Base always visible
                img.style.position = 'absolute';
                img.style.zIndex = zIndexMap[category] || 0;
                baseContainer.appendChild(img);

                // Add buttons for categories other than "base"
                if (category !== 'base') {
                    const button = document.createElement('img');
                    button.src = item.src;
                    button.alt = `${item.alt} Button`;
                    button.classList.add('item-button');
                    button.onclick = () => toggleItem(img.id, category, item);
                    categoryContainer.appendChild(button);
                }
            });

            controlsContainer.appendChild(categoryContainer);
        } catch (error) {
            console.error(error);
        }
    }
}

// Toggle item wear/remove cycle
function toggleItem(itemId, categoryName, itemData) {
    if (categoryName === 'base') return; // Prevent toggling or removal of base

    const categoryItems = document.querySelectorAll(`.${categoryName}`);
    const selectedItem = document.getElementById(itemId);

    if (!selectedItem) {
        // Re-add the item if it was removed
        const baseContainer = document.querySelector('.base-container');
        const img = document.createElement('img');
        img.id = itemData.id;
        img.src = itemData.src;
        img.alt = itemData.alt;
        img.classList.add(categoryName);
        img.dataset.clickCount = 1; // Set to visible on first re-add
        img.style.visibility = 'visible';
        img.style.position = 'absolute';
        img.style.zIndex = zIndexMap[categoryName] || 0;
        baseContainer.appendChild(img);
        return;
    }

    let clickCount = parseInt(selectedItem.dataset.clickCount, 10);

    // Hide all items in the same category
    categoryItems.forEach(item => {
        if (item.id !== itemId) {
            item.style.visibility = 'hidden';
            item.dataset.clickCount = 0; // Reset click count for other items
        }
    });

    clickCount += 1;

    if (clickCount === 1) {
        // Show the item
        selectedItem.style.visibility = 'visible';
    } else if (clickCount === 2) {
        // Remove the item
        selectedItem.remove();
    }

    selectedItem.dataset.clickCount = clickCount % 2; // Reset to 0 after removal
}

// Adjust layout dynamically
function adjustLayout() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');
    const screenWidth = window.innerWidth;

    if (screenWidth <= 600) {
        baseContainer.style.display = 'flex';
        baseContainer.style.flexWrap = 'nowrap';
        baseContainer.style.justifyContent = 'space-between';
    } else {
        baseContainer.style.display = 'block';
        baseContainer.style.width = '500px';
        baseContainer.style.height = '400px';
        controlsContainer.style.marginTop = 'auto';
    }
}

// Initialize game
function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
}

// Load items and layout on page load
window.onload = () => {
    loadItems();
    adjustLayout();
};

window.addEventListener('resize', adjustLayout);
