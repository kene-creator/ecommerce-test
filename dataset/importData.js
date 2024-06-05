/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

async function importCSV(filePath, collection) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          await collection.insertMany(results);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
  });
}

async function main() {
  const uri = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('ecommerce');

    await importCSV(
      './olist_order_items_dataset.csv',
      db.collection('order_items'),
    );
    await importCSV('./olist_products_dataset.csv', db.collection('products'));
    await importCSV('./olist_sellers_dataset.csv', db.collection('sellers'));

    console.log('Data imported successfully');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
