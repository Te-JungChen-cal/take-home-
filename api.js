// api.js

const express = require('express');
const fs = require('fs');
const cors = require('cors'); 
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.options('/save', cors()); 
app.post('/save', (req, res) => {
    const newItem = req.body;
    
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading JSON file');
            return;
        }
        
        let jsonData = JSON.parse(data);
        jsonData.push(newItem);

        fs.writeFile('./data.json', JSON.stringify(jsonData), (err) => {
            if (err) {
                res.status(500).send('Error writing to JSON file');
            } else {
                res.json({ message: 'Item saved to JSON file' });
            }
        });
    });
});

app.get('/items', (req, res) => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading JSON file');
            return;
        }

        const items = JSON.parse(data);
        res.json(items);
    });
});

// Route to update an item by index
app.put('/update/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const newText = req.body.text;

    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading JSON file');
            return;
        }

        let jsonData = JSON.parse(data);
        if (index >= 0 && index < jsonData.length) {
            jsonData[index].text = newText;

            fs.writeFile('./data.json', JSON.stringify(jsonData), (err) => {
                if (err) {
                    res.status(500).send('Error writing to JSON file');
                } else {
                    res.json({ message: 'Item updated successfully' });
                }
            });
        } else {
            res.status(400).send('Invalid index');
        }
    });
});

// Route to delete an item by index
app.delete('/delete/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);

    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading JSON file');
            return;
        }

        let jsonData = JSON.parse(data);
        if (index >= 0 && index < jsonData.length) {
            jsonData.splice(index, 1);

            fs.writeFile('./data.json', JSON.stringify(jsonData), (err) => {
                if (err) {
                    res.status(500).send('Error writing to JSON file');
                } else {
                    res.json({ message: 'Item deleted successfully' });
                }
            });
        } else {
            res.status(400).send('Invalid index');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
