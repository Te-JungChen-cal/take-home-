const addButton = document.getElementById('add-button');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');


// Add an async function to handle adding new items
const addNewItem = async () => {
    const newItem = {
        text: input.value
    };

    const json = JSON.stringify(newItem);

    try {
        const response = await fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            alert('Item saved to JSON successfully');

            // Clear input field
            input.value = '';

            // Load updated items
            await fetchItems();
        } else {
            throw new Error('Request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Event listener for adding a new item
addButton.addEventListener('click', addNewItem);


// Function to delete an item
const deleteItem = async (index) => {
    try {
        const response = await fetch(`http://localhost:3000/delete/${index}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Item deleted successfully');
            await fetchItems();
        } else {
            throw new Error('Request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Function to update an item
const updateItem = async (index, newText) => {
    try {
        const response = await fetch(`http://localhost:3000/update/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: newText })
        });

        if (response.ok) {
            alert('Item updated successfully');
            await fetchItems();
        } else {
            throw new Error('Request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


// Update the fetchItems function to fetch items from the correct endpoint (/items)
async function fetchItems() {
    const response = await fetch('http://localhost:3000/items');
    const items = await response.json();

    // Clear the existing list
    todoList.innerHTML = '';

    // Populate the list with items
    items.forEach((item, index) => {
        const newItemElement = document.createElement('li');

        // Create input for editing
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = item.text;

        // Create button for updating
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.id = 'update-button';
        updateButton.addEventListener('click', () => {
            updateItem(index, editInput.value);
        });

        // Create button for deleting
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.id = 'delete-button';
        deleteButton.addEventListener('click', () => deleteItem(index));

        // Append elements to list item
        newItemElement.appendChild(editInput);
        newItemElement.appendChild(updateButton);
        newItemElement.appendChild(deleteButton);

        // Append list item to list
        todoList.appendChild(newItemElement);
    });
}

// Fetch items when the page loads
fetchItems();