import { connect } from "@/dbConnection/dbConnection";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helper/mailer";
connect()

export async function POST(request: NextRequest) {

    try {
        const requestBody = await request.json()
        const { username, email, password } = requestBody

        //user validation
        console.log(requestBody)

        // to check user is already exist or not 

        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        //register new user

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // save the newuser data

        const newUser = new User({ username, email, password: hashedPassword })
        const savedUser = await newUser.save()
        console.log(savedUser)

        //send verification mail

        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })

        return NextResponse.json({ message: "User registerd Successfully", success: true, savedUser })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}