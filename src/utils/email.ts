import { config } from 'dotenv'
import * as SparkPost from 'sparkpost'

import { log } from './logger'

config()

const client: any = new SparkPost(process.env.SPARKPOST_API_KEY, {
  origin: 'https://api.eu.sparkpost.com:443',
})

const sendVerifyEmail: any = async ({ recipient, url }: any) => {
  log(url)
  const response: any = await client.transmissions
    .send({
      options: {
        sandbox: true,
      },
      content: {
        from: 'testing@sparkpostbox.com',
        subject: 'Confirm Email',
        html: `<html>
        <body>
        <p>Thanks for signing up, please click the link to verify your email!</p>
        <a href="${url}">confirm email</a>
        </body>
        </html>`,
      },
      recipients: [{ address: recipient }],
    })
    .then((data: any) => {
      log(data)
    })
    .catch((err: any) => {
      log(err)
    })
  log(response)
}

const sendResetPasswordEmail: any = async ({ recipient, url }: any) => {
  log(url)
  const response: any = await client.transmissions
    .send({
      options: {
        sandbox: true,
      },
      content: {
        from: 'testing@sparkpostbox.com',
        subject: 'Reset Password',
        html: `<html>
        <body>
        <p>
          You've recently requested a password reset,
          please follow the link to complete the process!
        </p>
        <a href="${url}">Reset Password</a>
        </body>
        </html>`,
      },
      recipients: [{ address: recipient }],
    })
    .then((data: any) => {
      log(data)
    })
    .catch((err: any) => {
      log(err)
    })
  log(response)
}

export { sendVerifyEmail, sendResetPasswordEmail }
