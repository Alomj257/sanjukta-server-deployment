const nodemailer = require('nodemailer');

const sendMail = (otp, email) => {
   
    try{
        const transport = nodemailer.createTransport({
            service: 'GMAIL',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP for Account Verification - Sanjukta',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
                    <h2 style="color: #333;">Hello,</h2>
                    <p style="color: #555; font-size: 16px;">
                        Thank you for choosing Sanjukta. To proceed with your request, please use the following One-Time Password (OTP) to verify your account:
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otp}</span>
                    </div>
                    <p style="color: #555; font-size: 16px;">
                        This OTP is valid for the next 1 minutes. If you did not request this, please ignore this email or contact our support team.
                    </p>
                    <p style="color: #555; font-size: 16px;">
                        Best regards,<br>
                        <strong>Sanjukta Support Team</strong><br>
                        <a href="mailto:support@sanjukta.com" style="color: #4CAF50; text-decoration: none;">support@sanjukta.com</a>
                    </p>
                    <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;">
                    <small style="color: #999;">
                        This is an automated message, please do not reply directly to this email. For further assistance, contact our support team.
                    </small>
                </div>
            `
        };
    
        transport.sendMail(mailOptions,(error, info) => {
            if(error){
                throw new Error('Faild to send OTP');
            }
        })
    }catch(error){
        console.log(error.message);
    }
}

module.exports = sendMail;