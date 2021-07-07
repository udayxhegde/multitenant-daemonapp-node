var msal = require('@azure/msal-node');

var logHelper = require("../utils/loghelper").logger;
import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";
//
// the scope we are requesting for the access token. .default says give me all the scopes
// on the app. We can also choose more fine grained scopes if we dont need all of them
//
const clientCredentialRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
};

//
// @microsoft/microsoft-graph-client module needs an authentication provider for the graph client
// implement the authentication provider for the confidential client protocol used
// by our daemon app
//
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
        logHelper.info("my auth provider, creating msal app %s", tenantId);
        // Create msal application object
        this.confidentialClientApp = new msal.ConfidentialClientApplication(config);
    }
	/**
	 * This method will get called before every request to the msgraph server
	 * This should return a Promise that resolves to an accessToken (in case of success) or rejects with error (in case of failure)
	 * Basically this method will contain the implementation for getting and refreshing accessTokens
	 */
	public async getAccessToken(): Promise<any> {

        logHelper.info("In get access token");

        // user the msal client app that we created to get a token
        return this.confidentialClientApp.acquireTokenByClientCredential(clientCredentialRequest)
                .then(function(response) {
                    logHelper.info("got access token");
                    return response.accessToken;
                })
                .catch(function(error) {
                    logHelper.error("get access token error %s", JSON.stringify(error));
                    throw(error);
                });
    }
}

module.exports = {ConfidentialClientAuthenticationProvider};