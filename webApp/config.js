const config = {};
const apiStrings = require('./src/utils/apiStrings.json')

config.host = process.env.HOST || "https://taskflowdata.documents.azure.com:443/";
config.authKey =
  process.env.AUTH_KEY || apiStrings.azureAuthKey;
config.databaseId = "seedDBank";
config.containerId = "botanicalData";
config.storageAccountName =  apiStrings.storageAccountName;
config.accountKey = apiStrings.accountKey;
config.storageConnectionString = apiStrings.storageConnectionString;

if (config.host.includes("https://localhost:")) {
  console.log("Local environment detected");
  console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:${process.env.PORT || '3000'} to try the sample.`);
}

module.exports = config;