// import { DataAzurermDnsZone } from "@cdktf/provider-azurerm/lib/data-azurerm-dns-zone";
import { CdnFrontdoorProfile } from "@cdktf/provider-azurerm/lib/cdn-frontdoor-profile";
import { DataAzurermCdnFrontdoorCustomDomain } from "@cdktf/provider-azurerm/lib/data-azurerm-cdn-frontdoor-custom-domain";
import { DataAzurermCdnFrontdoorProfile } from "@cdktf/provider-azurerm/lib/data-azurerm-cdn-frontdoor-profile";
import { DataAzurermDnsZone } from "@cdktf/provider-azurerm/lib/data-azurerm-dns-zone";
import { DataAzurermResourceGroup } from "@cdktf/provider-azurerm/lib/data-azurerm-resource-group";
import { Frontdoor } from "@cdktf/provider-azurerm/lib/frontdoor";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { StorageBlob } from "@cdktf/provider-azurerm/lib/storage-blob";
import { TerraformOutput, TerraformStack } from "cdktf";
import { Construct } from "constructs";

export class TestInfraStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const provider = new AzurermProvider(this, "azurerm", {
      features: [{}],
      subscriptionId: process.env.ARM_SUBSCRIPTION_ID,
    });

    const resourceGroup = new DataAzurermResourceGroup(this, "existing-rg", {
      name: "aburke-tech-rg",
      provider,
    });

    // define resources here

    // so essentially we want to create a storage account with a static website blob container
    // but we want it to be only have private access and only internal resources aka CDN can access

    // 1. provider and resource group
    // 2. ummm, we need a storage account static site
    const storageAccount = new StorageAccount(this, "test-storage-acct", {
      name: "teststorageaccount9951",
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountTier: "Standard",
      accountReplicationType: "LRS",
      accountKind: "StorageV2",
      publicNetworkAccessEnabled: false,
      staticWebsite: {
        indexDocument: "index.html",
      },
    });

    // 3. get existing dns record could also pass in tbh
    const dnsZone = new DataAzurermDnsZone(this, "existing-dns-zone", {
      name: "aburke.tech",
      resourceGroupName: resourceGroup.name,
      provider,
    });

    // 4. create storage blob
    new StorageBlob(this, "test-index-html-blog", {
      name: "index.html",
      storageAccountName: storageAccount.name,
      storageContainerName: "$web",
      type: "Block",
      contentType: "text/html",
      source: "./index.html",
    });

    // 5. we need front door dns
    const cdn = new CdnFrontdoorProfile(this, "aburke-tech-cdn", {
      name: "",
      resourceGroupName: resourceGroup.name,
      skuName: "Standard_AzureFrontDoor",
      tags: {
        environment: "test",
      },
    });

    // 6. need cname or something to point to the front door cdn of our static site?

    new TerraformOutput(this, "rg-name", {
      value: resourceGroup.name,
    });
  }
}
