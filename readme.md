# Multi-tenant daemon application using Azure AD
This is a code sample for building a multi-tenant daemon application accessing 
Microsoft Graph, using Azure AD.
Daemon apps use the client credential flow, and need app only permissions to access graph.

## Prerequisites

In this particular example, you have to do the following:

1. In the developer tenant, go to the Azure AD portal, and register a new application.
For account type (who can use this application), pick: Accounts in any organizational directory (Any Azure AD directory - Multitenant)
For daemon apps, you dont need a redirect URI, so leave that blank and register the application.

2. Once registered, go the the API permissions and add a permission, pick Microsoft Graph.
in What type of permission does your application require: pick Application permissions. Since there is no user context, the delegated permission does not make sense for daemon apps
3. Then pick all the permission you need, such as user.read.all, groups.readwrite.all etc, and save the permissions.

4. In the overview tab of the application, you see the Application ID (also known as client id). this is the ID that other tenant administrators can use to consent to this daemon app to access graph in their tenant.

In the target tenant, do the followig:
1. From a command prompt, login to the tenant as an admin. 
`az login --tenant <tenantid> --allow-no-subscriptions`

2. Then add the application in the tenant
`az ad sp create --id <your application id>`

3. Then login to the Azure AD portal as tenant admin in that tenant, and go to "Enterprise Applications", and find this application. And go to the permissions section of that application, and give consent for this application.

At this point the daemon app will be able to access the graph resources consented in that tenant.

It also has an example for accessing cross-tenant Azure resource, in this case keyvault. Make sure that the target tenant has the keyvault url you want to access, and give the app id permissions to that keyvault.


This code uses msal module for authentication, and the graph client to access graph resources.

## Installing

npm run build, builds the js files
npm run start, runs the server

### Running
you can run this anywhere you like: on your laptop, in AWS, GCP or Azure.
In Azure, you can deploy this in a Functions or App service. you can also store the app secret in an instance of Azure KeyVault, and use a managed identity assigned to your app service to access that key.

## Code style
This is using node.js (with promises) and using typescript


© Uday Hegde