import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.join(process.cwd(), ".env")});
import type { StringValue } from "ms";

// export default {
//   port: process.env.PORT || 5000,
//   database_url: process.env.DATABASE_URL,
//   app_url : process.env.APP_URL,
//   bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS!,
//   jwt_access_screct: process.env.JWT_ACCESS_SECRET!,
//   jwt_refresh_screct: process.env.JWT_REFRESH_SECRET!,
//   jwt_access_expires_in : process.env.JWT_ACCESS_EXPIRES_IN!,
//   jwt_refresh_expires_in : process.env.JWT_REFRESH_EXPIRES_IN!,
// }


export default {
  port: Number(process.env.PORT) || 5000,

  database_url: process.env.DATABASE_URL!,

  app_url: process.env.APP_URL!,

  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS),

  jwt_access_screct: process.env.JWT_ACCESS_SECRET!,

  jwt_refresh_screct: process.env.JWT_REFRESH_SECRET!,

  jwt_access_expires_in:
    process.env.JWT_ACCESS_EXPIRES_IN as StringValue,

  jwt_refresh_expires_in:
    process.env.JWT_REFRESH_EXPIRES_IN as StringValue,

  ssl_store_id: process.env.SSL_STORE_ID!,
  ssl_store_password: process.env.SSL_STORE_PASSWORD!,
  ssl_is_live: process.env.SSL_IS_LIVE === "true",

  backend_url: process.env.BACKEND_URL!,
  frontend_url: process.env.FRONTEND_URL!,
};