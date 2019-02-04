interface IEmailBodies {
  sendVerifyEmail: (url: string) => string
  sendResetPasswordEmail: (url: string) => string
}

const emailBodies: IEmailBodies = {
  sendVerifyEmail: url => `
    <html>
      <body>
        <p>Thanks for signing up, please click the link to verify your email.</p>
        <a href="${url}">confirm email</a>
      </body>
    </html>`,

  sendResetPasswordEmail: (url: string) => `
    <html>
      <body>
        <p>
          You've recently requested a password reset,
          please follow the link to complete the process.
        </p>
        <a href="${url}">Reset Password</a>
      </body>
    </html>
  `,
}

export { emailBodies }
