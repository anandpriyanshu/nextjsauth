import { connect } from "@/dbConnection/dbConnection";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helper/mailer";
connect()

export async function POST(request: NextRequest) {

}