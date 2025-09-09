import { ServerError } from "../error.mjs"
import bcrypt from "bcrypt"
import prisma from "../prisma/db.mjs"
import { errorPritify, UserSignupModel, UserLoginModel } from "./validator.mjs"
import emailQueue from "../queue/email.queue.mjs"
import { asyncJwtSign } from "../async.jwt.mjs"

const signup = async (req, res, next) => {
  const result = await UserSignupModel.safeParseAsync(req.body)
  if (!result.success) {
    throw new ServerError(400, errorPritify(result))
  }

  const hasedPassword = await bcrypt.hash(req.body.password, 10)

  const newUser = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: hasedPassword
    },
  });
  console.log(newUser)

  // TODO: create verification link

  await emailQueue.add("welcome_email", {
    to: newUser.email,
    subject: "Verfication Email",
    body: `<html>
      <h1>Welcome ${newUser.name}</h1>
      <a href="http://google.com">Click Here to verify account</a>
    </html>`
  })

  res.json({ msg: "signup is successful" })
}

const login = async (req, res, next) => {
  const result = await UserLoginModel.safeParseAsync(req.body)
  if (!result.success) {
    throw new ServerError(400, errorPritify(result))
  }

  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  })

  console.log(user)

  // TODO: check is account verified
  if (!await bcrypt.compare(req.body.password, user.password)) {
    throw new ServerError(401, "password mismatch")
  }

  const token = await asyncJwtSign(
    { id: user.id, name: user.name, email: user.email },
    process.env.TOKEN_SECRET
  )

  res.json({ msg: "login successful", token })
}

const forgotPassword = (req, res, next) => {
  res.json({ msg: "forgot password" })
}
const resetPassword = (req, res, next) => {
  res.json({ msg: "reset password" })
}

export { signup, login, forgotPassword, resetPassword }