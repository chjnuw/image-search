import nodemailer from 'nodemailer'

export const sendMail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS // App Password
    }
  })

  await transporter.sendMail({
    from: `"MyApp" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  })
}
