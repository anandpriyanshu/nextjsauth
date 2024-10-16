import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken = (request: NextRequest) => {

    try {

        const token = request.cookies.get('token')?.value || ""
        // tokenData is in decodedToken 
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!)
        // received id from login router not from mongodb
        return decodedToken.id

    } catch (error: any) {
        throw new Error(error.message)
    }
}