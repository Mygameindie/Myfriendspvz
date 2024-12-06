
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

// Load JSON files and initialize items
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
                img.style.visibility = item.visibility;
                img.style.position = 'absolute';
                img.style.zIndex = zIndexMap[category] || 0;
                baseContainer.appendChild(img);

                const button = document.createElement('img');
                button.src = item.src; // Use item image as button
                button.alt = `${item.alt} Button`;
                button.classList.add('item-button');
                button.onclick = () => toggleVisibility(item.id, category, item.lockVisibility);
                categoryContainer.appendChild(button);
            });

            controlsContainer.appendChild(categoryContainer);
        } catch (error) {
            console.error(error);
        }
    }
}

// Toggle item visibility
function toggleVisibility(itemId, categoryName, lockVisibility) {
    const categoryItems = document.querySelectorAll(`.${categoryName}`);
    categoryItems.forEach(item => {
        // Ensure locked items stay visible
        if (item.id === 'base' && item.style.visibility === 'visible') {
            return;
        }

        if (item.id !== itemId) {
            item.style.visibility = 'hidden';
        }
    });

    const selectedItem = document.getElementById(itemId);

    // Prevent hiding locked items
    if (selectedItem.id === 'base' || lockVisibility) {
        return;
    }

    selectedItem.style.visibility =
        selectedItem.style.visibility === 'visible' ? 'hidden' : 'visible';
}

// Responsive layout adjustment
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

// Initialize game mode
function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
}

// Load items and apply layout adjustment on page load and resize
window.onload = () => {
    loadItems();
    adjustLayout();
};

window.addEventListener('resize', adjustLayout);
