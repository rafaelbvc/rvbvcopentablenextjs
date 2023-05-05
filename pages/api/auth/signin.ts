import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { prisma } from "../../../utils/constants";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";

export default async function SignInHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: "Invalid email",
      },
      {
        valid: validator.isLength(password, { min: 1 }),
        errorMessage: "Invalid password",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    const userEmailValidation = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userEmailValidation) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

    const isMatch = await bcrypt.compare(password, userEmailValidation.password);

    if(!isMatch) {
        return res.status(401).json({errorMessage: "Email of password is invalid"})
    }

    const alg = "HS256";

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    

    const token = await new jose.SignJWT({ email: userEmailValidation.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

      setCookie("jwt", token, {req, res, maxAge: 60 * 6 * 24})

      
    return res.status(200).json({
      firstName: userEmailValidation.first_name,
      lastName: userEmailValidation.last_name,
      email: userEmailValidation.email,
      phone: userEmailValidation.phone,
      city: userEmailValidation.city,
    });

  }
  return res.status(404).json({errorMessage: "Can`t resolve the resquest"} );
}
