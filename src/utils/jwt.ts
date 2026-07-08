import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import type { StringValue } from "ms";

export const createToken = (
  payload: object,
  secret: Secret,
  expiresIn: StringValue | number
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: Secret
): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};