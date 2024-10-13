import mongoose from "mongoose";

export async function connect() {

    try {
        mongoose.connect(process.env.MONGO_URL!)

        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log('MongoDB Connected')
        })

        connection.on('error', (err) => {
            console.log("Error in MongoDB connection: " + err)
            process.exit()
        })

    } catch (error) {
        console.log("Something went wrong in DB")
        console.log(error)
    }

}