import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  jwt: {
    jwt_secret_access_toten: process.env.JWT_SECRET_ACCESS_TOKEN,
    expires_in_access_token: process.env.EXPIRES_IN_ACCESS_TOKEN,
    jwt_secret_refresh_token: process.env.JWT_SECRET_REFRESH_TOKEN,
    expires_in_refresh_token: process.env.EXPIRES_IN_REFRESH_TOKEN,
  },
};
