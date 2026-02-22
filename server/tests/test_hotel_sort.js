const axios = require('axios');

async function testHotelSorting() {
    try {
        const city = 'Mumbai';
        console.log(`Fetching hotels in ${city} sorted by Price Low-to-High...`);

        const response = await axios.get(`http://localhost:5000/api/hotels/${city}?sortBy=price_asc`);

        const hotels = response.data;
        console.log(`Found ${hotels.length} hotels.`);

        let isSorted = true;
        for (let i = 0; i < hotels.length - 1; i++) {
            if (hotels[i].price > hotels[i + 1].price) {
                isSorted = false;
                console.error(`Sort Error: ${hotels[i].price} > ${hotels[i + 1].price}`);
                break;
            }
        }

        if (isSorted) {
            console.log('PASS: Hotels are correctly sorted by price.');
            hotels.forEach(h => console.log(`${h.name}: ₹${h.price}`));
        } else {
            console.log('FAIL: Hotels are NOT sorted.');
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

testHotelSorting();
