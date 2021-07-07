//app.ts
const confidentialClientAuthProvider = require("./utils/auth").ConfidentialClientAuthenticationProvider;
const logHelper = require("./utils/loghelper");
const graphClient = require("@microsoft/microsoft-graph-client").Client;
const kvSecret = require('@azure/keyvault-secrets');
const identity = require('@azure/identity');


require('dotenv').config();
require('isomorphic-fetch');


var tenantArray:Array<any> = null;
var tenantGraphClient={};
var tenantKeyVaultClient={};
var tenantKeyVaultClient1={};

appInit();

function appInit() {
    logHelper.init();
    var tenants:string = process.env.TENANTS;
    var freqInSecs:number = +process.env.FREQUENCY_IN_SECONDS;

    if (tenants) {
        tenantArray = tenants.split(',');
    }
    tenantArray.forEach(function(tenantId)  {
        var authProvider = new confidentialClientAuthProvider(tenantId);
        logHelper.logger.info("created auth provider for tenant %s", tenantId);
        tenantGraphClient[tenantId] = graphClient.initWithMiddleware({authProvider});
        logHelper.logger.info("created kv client for vault %s", process.env[tenantId]);
        tenantKeyVaultClient[tenantId] = new kvSecret.SecretClient(process.env[tenantId], 
            new identity.ClientSecretCredential(tenantId, 
                process.env.APP_ID,
                process.env.APP_SECRET));
        
    });
    setInterval(processAllTenants, freqInSecs * 1000 );
    logHelper.logger.info("Graph info now running every %d seconds", freqInSecs);
}

function processAllTenants()
{
    tenantArray.forEach(function(tenantId)  {
        logHelper.logger.info("process tenant %s", tenantId);
        
        graphProcessUsers(tenantGraphClient[tenantId]);     
        graphProcessGroups(tenantGraphClient[tenantId]);
        kvProcessSecret(tenantKeyVaultClient[tenantId]);
    });
}

async function graphProcessUsers(client) {
    
        client.api("/users").get()
        .then(function(users) {
            logHelper.logger.info("tenant has %d users", users.value.length);
        })
        .catch(function(error) {
            logHelper.logger.error("got users error %o", error);
        });
}

async function graphProcessGroups(client) {
    
    client.api("/groups").get()
    .then(function(groups) {
        logHelper.logger.info("tenant has %d groups", groups.value.length);
    })
    .catch(function(error) {
        logHelper.logger.error("got groups error %o", error);
    });
}


async function kvProcessSecret(client) {
    const secretName="test";
    const result = await client.getSecret(secretName)
    .then(function(result) {
        logHelper.logger.info("got secret %s", result.value);
    })
    .catch(function(error) {
        logHelper.logger.error("got secret error %o", error);
    })
}


