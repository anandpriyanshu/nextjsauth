import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
export const sendEmail = async ({ email, emailType, userId }: any) => {


    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        // first token send to the database 

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000
            })
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToke: hashedToken, forgotPasswordExpiry: Date.now() + 3600000
            })
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "9c8dca428675f6",
                pass: "9014c47050af55"
            }
        });

        const mailOptions = {
            from: 'anand@12.ai',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset you password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset you password"} 
            or copy and paste the link below in your browser.
            <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
        }

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse

    } catch (error: any) {
        throw new Error(error.message)

    }
}
