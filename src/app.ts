//app.ts
const confidentialClientAuthProvider = require("./utils/auth").ConfidentialClientAuthenticationProvider;
const logHelper = require("./utils/loghelper");
const graphClient = require("@microsoft/microsoft-graph-client").Client;
require('dotenv').config();
require('isomorphic-fetch');


var tenantArray:Array<any> = null;
var tenantGraphClient={};

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
        logHelper.logger.debug("created auth provider for tenant %s", tenantId);
        tenantGraphClient[tenantId] = graphClient.initWithMiddleware({authProvider});
        logHelper.logger.debug("created graph client for tenant %s", tenantId);

    });
    setInterval(processAllTenants, freqInSecs * 1000 );
    logHelper.logger.info("Graph info now running every %d seconds", freqInSecs);
}

function processAllTenants()
{
    tenantArray.forEach(function(tenantId)  {
        logHelper.logger.debug("process tenant %s", tenantId);
        
        graphProcessUsers(tenantGraphClient[tenantId]);     
        graphProcessGroups(tenantGraphClient[tenantId]);
   
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



