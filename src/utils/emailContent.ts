interface IEmailBodies {
  sendVerifyEmail: (url: string) => string
  sendResetPasswordEmail: (url: string) => string
}

type Body = (content: string) => string

const body: Body = (content) => `
  <html>
    <body>
      ${content}
    </body>
  </html>
`

const emailBodies: IEmailBodies = {
  sendVerifyEmail: url => 
    body(`
      <p>Thanks for signing up, please click the link to verify your email.</p>
      <a href="${url}">confirm email</a>
    `),

  sendResetPasswordEmail: (url: string) => 
    body(`
      <p>
        You've recently requested a password reset,
        please follow the link to complete the process.
      </p>
      <a href="${url}">Reset Password</a>
    `),
}

export { emailBodies }
