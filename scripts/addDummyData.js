import axios from 'axios';

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomEmail(firstName, lastName) {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${getRandomElement(domains)}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function addDummyUsers(count) {
    const api = axios.create({
        baseURL: 'http://localhost:3000',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log(`Adding ${count} dummy users...`);
    let successCount = 0;
    let retryCount = 0;
    const maxRetries = 3;

    for (let i = 0; i < count; i++) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        const fullName = `${firstName} ${lastName}`;
        const email = generateRandomEmail(firstName, lastName);

        let retry = true;
        let attempts = 0;

        while (retry && attempts < maxRetries) {
            try {
                await api.post('/api/users', {
                    name: fullName,
                    email: email
                });
                successCount++;
                if (successCount % 10 === 0) {
                    console.log(`Added ${successCount} users...`);
                }
                retry = false;
                // Add a delay between requests to avoid rate limiting
                await sleep(500);
            } catch (error) {
                attempts++;
                if (error.response && error.response.status === 429) {
                    console.log('Rate limited, waiting 2 seconds...');
                    await sleep(2000);
                } else if (attempts === maxRetries) {
                    console.error(`Failed to add user ${fullName} after ${maxRetries} attempts:`, error.message);
                    retry = false;
                } else {
                    console.log(`Attempt ${attempts} failed for ${fullName}, retrying...`);
                    await sleep(1000);
                }
            }
        }
    }

    console.log(`Successfully added ${successCount} dummy users`);
}

// Add 200 dummy users
addDummyUsers(200);
