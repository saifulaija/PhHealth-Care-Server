import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  reset_pass_link: process.env.RESET_PASS_LINK,
  emailSender:{
email:process.env.EMAIL,
app_pass_email:process.env.APP_PASS_EMAIL
  },
  jwt: {
    jwt_secret_access_toten: process.env.JWT_SECRET_ACCESS_TOKEN,
    expires_in_access_token: process.env.EXPIRES_IN_ACCESS_TOKEN,
    jwt_secret_refresh_token: process.env.JWT_SECRET_REFRESH_TOKEN,
    expires_in_refresh_token: process.env.EXPIRES_IN_REFRESH_TOKEN,
    reset_pass_token: process.env.RESET_PASS_TOKEN,
    reset_token_expires_in: process.env.RESET_TOKEN_EXPIRES_IN,
  },
};
