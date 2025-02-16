const express = require('express');
const axios = require('axios');
const router = express.Router();

const SWAPI_PEOPLE_URL = 'https://swapi.dev/api/people/';


const fetchAllPeople = async () => {
    let allPeople = [];
    let nextUrl = SWAPI_PEOPLE_URL;

    while (nextUrl) {
        try {
            const response = await axios.get(nextUrl);
            allPeople = allPeople.concat(response.data.results);
            nextUrl = response.data.next;
        } catch (error) {
            console.error('Error fetching data from SWAPI:', error.message);
            return [];
        }
    }
    return allPeople;
};


const sortPeople = (people, sortBy) => {

    const parseMass = (mass) => {
        if (mass === "unknown") return Infinity
        return parseFloat(mass.replace(/,/g, ''));
    };

    switch (sortBy) {
        case 'name':
            return people.sort((a, b) => a.name.localeCompare(b.name));
        case 'height':
            return people.sort((a, b) => parseInt(a.height) - parseInt(b.height));
        case 'mass':
            return people.sort((a, b) => parseMass(a.mass) - parseMass(b.mass));
        default:
            return people.sort((a, b) => a.name.localeCompare(b.name));
    }
};


router.get('/', async (req, res) => {
    try {
        const { sortBy } = req.query;
        const allPeople = await fetchAllPeople();
        const sortedPeople = sortPeople(allPeople, sortBy);
        res.json(sortedPeople);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch people data' });
    }
});

module.exports = router;