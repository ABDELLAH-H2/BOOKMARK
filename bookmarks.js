// File: functions/bookmarks.js
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async (event) => {
    // Connect DB (Atlas)
    if (!client.topology || !client.topology.isConnected()) await client.connect();
    const collection = client.db('my_site_db').collection('bookmarks');

    const headers = {
        'Access-Control-Allow-Origin': '*', // Allows your snippet to access this
        'Access-Control-Allow-Methods': 'GET, POST'
    };

    try {
        if (event.httpMethod === 'POST') {
            // Save new
            const data = JSON.parse(event.body);
            await collection.insertOne({ ...data, date: new Date() });
            return { statusCode: 200, headers, body: "Saved" };
        } else {
            // Get all
            const data = await collection.find({}).toArray();
            return { statusCode: 200, headers, body: JSON.stringify(data) };
        }
    } catch (e) {
        return { statusCode: 500, headers, body: e.toString() };
    }
};