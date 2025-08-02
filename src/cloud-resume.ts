import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { DataAzurermResourceGroup } from "@cdktf/provider-azurerm/lib/data-azurerm-resource-group";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { StorageBlob } from "@cdktf/provider-azurerm/lib/storage-blob";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Paths } from "./constants";
import { DataAzurermDnsZone } from "@cdktf/provider-azurerm/lib/data-azurerm-dns-zone";
import { DnsCnameRecord } from "@cdktf/provider-azurerm/lib/dns-cname-record";

export class CloudResumeInfraStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // define resources here
    const provider = new AzurermProvider(this, "azurerm", {
      features: [{}],
      subscriptionId: process.env.ARM_SUBSCRIPTION_ID,
    });

    const resourceGroup = new DataAzurermResourceGroup(this, "existing-rg", {
      name: "aburke-tech-rg",
      provider,
    });

    const dnsZone = new DataAzurermDnsZone(this, "existing-dns-zone", {
      name: "aburke.tech",
      resourceGroupName: resourceGroup.name,
      provider,
    });

    const storageAccount = new StorageAccount(this, "cloud-resume-stroage-acct", {
      name: "cloudresumestorage143278",
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountTier: "Standard",
      accountReplicationType: "LRS",
      accountKind: "StorageV2",
      staticWebsite: {
        indexDocument: "index.html",
        error404Document: "error.html",
      },
    });

    new DnsCnameRecord(this, "res-aburke-tech-cname", {
      name: "res",
      zoneName: dnsZone.name,
      resourceGroupName: resourceGroup.name,
      ttl: 300,
      record: storageAccount.primaryWebHost, // this should point to the front door cdn host
    });

    // after creating cname create front door cdn

    // after creating front door cdn attach the cname record to the cdn

    const containerName: string = "$web";

    new StorageBlob(this, "index-html-blob", {
      name: "index.html",
      storageAccountName: storageAccount.name,
      storageContainerName: containerName,
      type: "Block",
      contentType: "text/html",
      source: Paths.indexHtmlPath,
    });

    new StorageBlob(this, "error-html-blob", {
      name: "error.html",
      storageAccountName: storageAccount.name,
      storageContainerName: containerName,
      type: "Block",
      contentType: "text/html",
      source: Paths.errorHtmlPath,
    });

    new StorageBlob(this, "styles-css-blob", {
      name: "styles.css",
      storageAccountName: storageAccount.name,
      storageContainerName: containerName,
      type: "Block",
      contentType: "text/css",
      source: Paths.stylesCssPath,
    });

    new StorageBlob(this, "main-js-blob", {
      name: "main.js",
      storageAccountName: storageAccount.name,
      storageContainerName: containerName,
      type: "Block",
      contentType: "application/javascript",
      source: Paths.mainJsPath,
    });
  }
}
