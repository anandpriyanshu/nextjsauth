import { connect } from "@/dbConnection/dbConnection";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken';
connect()

export async function POST(request: NextRequest) {

    try {

        const reqBody = await request.json()
        const { email, password } = reqBody
        console.log(reqBody)

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User doesn't exist, Please signup first" }, { status: 400 })
        }
        console.log("User exist")

        // compare the password in db
        const validPassword = await bcryptjs.compare(password, user.password)

        if (!validPassword) {
            return NextResponse.json({ error: "Check your credentials" }, { status: 400 })
        }

        // if validpassword then create jwt token 

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: 'id' })

        // send the response and user logged in finally 
        const response = NextResponse.json({
            message: 'Login Successfully',
            success: true
        })

        response.cookies.set("token", token, {
            httpOnly: true
        })
        return response


    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}