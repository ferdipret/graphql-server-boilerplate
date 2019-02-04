import { config } from 'dotenv'
import * as SparkPost from 'sparkpost'

import { log } from './logger'

config()

const client: any = new SparkPost(process.env.SPARKPOST_API_KEY, {
  origin: process.env.SPARKPOST_ORIGIN,
})

const sendMail: any = async ({ recipient, content, subject }: any) => {
  const response: any = await client.transmissions
    .send({
      options: {
        sandbox: true,
      },
      content: {
        from: process.env.SPARKPOST_FROM_EMAIL,
        subject,
        html: content,
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

export { sendMail }
