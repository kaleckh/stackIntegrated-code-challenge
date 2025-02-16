const express = require('express');
const axios = require('axios');
const router = express.Router();

const SWAPI_PLANETS_URL = 'https://swapi.dev/api/planets/';


const fetchAllPlanets = async () => {
    let allPlanets = [];
    let nextUrl = SWAPI_PLANETS_URL;

    while (nextUrl) {
        try {
            const response = await axios.get(nextUrl);
            allPlanets = allPlanets.concat(response.data.results);
            nextUrl = response.data.next;
        } catch (error) {
            console.error('Error fetching planets:', error.message);
            return [];
        }
    }

    return allPlanets;
};


const fetchResidentNames = async (residentUrls) => {    
    const residentPromises = residentUrls.map(async (url) => {
        try {
            const response = await axios.get(url);
            return response.data.name;
        } catch (error) {
            console.error(`Error fetching resident: ${url}`, error.message);
            return 'Unknown Resident';
        }
    });

    return Promise.all(residentPromises); 
};


router.get('/', async (req, res) => {
    try {
        const planets = await fetchAllPlanets();

        
        const planetsWithNames = await Promise.all(
            planets.map(async (planet) => {
                const residentNames = await fetchResidentNames(planet.residents);
                return { ...planet, residents: residentNames };
            })
        );

        res.json(planetsWithNames);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch planets data' });
    }
});

module.exports = router;
