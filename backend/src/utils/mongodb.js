import { MongoClient } from "mongodb"

const client = new MongoClient("mongodb+srv://yarkinovweb:NHOTt50v0Odu149h@cluster0.eyngkp4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

const db = client.db("service")

async function connect(){
    await client.connect()
    console.log("Connected to MongoDB")
}

export {db, connect}