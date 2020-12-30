var msal = require('@azure/msal-node');
var logHelper = require("../utils/loghelper").logger;
import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";

const clientCredentialRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
};

class ConfidentialClientAuthenticationProvider implements AuthenticationProvider {
    private confidentialClientApp;
  
    constructor(tenantId: string) {
        const config = {
            auth: {
                clientId: process.env.APP_ID,
                authority: "https://login.microsoftonline.com/" + tenantId,
                clientSecret: process.env.APP_SECRET
            }
        } 
        logHelper.debug("my auth provider, creating msal app %s", tenantId);
        // Create msal application object
        this.confidentialClientApp = new msal.ConfidentialClientApplication(config);
    }
	/**
	 * This method will get called before every request to the msgraph server
	 * This should return a Promise that resolves to an accessToken (in case of success) or rejects with error (in case of failure)
	 * Basically this method will contain the implementation for getting and refreshing accessTokens
	 */
	public async getAccessToken(): Promise<any> {

        logHelper.debug("In get access token")

        return this.confidentialClientApp.acquireTokenByClientCredential(clientCredentialRequest)
                .then(function(response) {
                    logHelper.debug("got access token");
                    return response.accessToken;
                })
                .catch(function(error) {
                    logHelper.debug("get access token error %s", JSON.stringify(error));
                    throw(error);
                });
    }
}

module.exports = {ConfidentialClientAuthenticationProvider};