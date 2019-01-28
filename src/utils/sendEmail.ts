import { config } from 'dotenv'
import * as SparkPost from 'sparkpost'

import { log } from './logger'

config()

const client: any = new SparkPost(process.env.SPARKPOST_API_KEY, {
  origin: 'https://api.eu.sparkpost.com:443',
})

const sendEmail: any = async ({ recipient, url }: any) => {
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
        <p>Testing SparkPost - the world's most awesomest email service!</p>
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

export { sendEmail }
