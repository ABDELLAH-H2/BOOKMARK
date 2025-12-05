// File: functions/bookmarks.js
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async (event) => {
    // 1. SETUP HEADERS to allow your other site to talk to this one
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allows requests from couponscorpion.com
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // 2. Handle PREFLIGHT requests (Browser security check)
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        if (!client.topology || !client.topology.isConnected()) await client.connect();
        const collection = client.db('my_site_db').collection('bookmarks');

        if (event.httpMethod === 'POST') {
            const data = JSON.parse(event.body);
            await collection.insertOne({ ...data, date: new Date() });
            return { statusCode: 200, headers, body: JSON.stringify({ msg: "Saved" }) };
        } 
        
        // GET Request
        const data = await collection.find({}).toArray();
        return { statusCode: 200, headers, body: JSON.stringify(data) };

    } catch (e) {
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: e.toString() }) 
        };
    }
};
