const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(8000),
    REDIS_HOST: Joi.string().default("localhost"),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string().allow("").default(""),
    FIREBASE_AUTH_DOMAIN: Joi.string(),
    FIREBASE_PROJECT_ID: Joi.string(),
    FIREBASE_STORAGE_BUCKET: Joi.string(),
    FIREBASE_MESSAGING_SERNDER_ID: Joi.string(),
    FIREBASE_APP_ID: Joi.string(),
    SMTP_HOST: Joi.string()
      .allow("")
      .default("")
      .description("server that will send the emails"),
    SMTP_PORT: Joi.number()
      .allow("")
      .default("")
      .description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string()
      .allow("")
      .default("")
      .description("username for email server"),
    SMTP_PASSWORD: Joi.string()
      .allow("")
      .default("")
      .description("password for email server"),
    EMAIL_FROM: Joi.string()
      .allow("")
      .default("")
      .description("the from field in the emails sent by the app"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  redisConfig: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD,
  },
  firebaseConfig: {
    apiKey: envVars.FIREBASE_API_KEY,
    authDomain: envVars.FIREBASE_AUTH_DOMAIN,
    projectId: envVars.FIREBASE_PROJECT_ID,
    storageBucket: envVars.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: envVars.FIREBASE_MESSAGING_SERNDER_ID,
    appId: envVars.FIREBASE_APP_ID,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};
