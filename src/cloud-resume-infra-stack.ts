import { DataAzurermResourceGroup } from "@cdktf/provider-azurerm/lib/data-azurerm-resource-group";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { StorageBlob } from "@cdktf/provider-azurerm/lib/storage-blob";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { Paths } from "./constants";
import { CdnProfile } from "@cdktf/provider-azurerm/lib/cdn-profile";
import { CdnEndpoint } from "@cdktf/provider-azurerm/lib/cdn-endpoint";
import { DnsCnameRecord } from "@cdktf/provider-azurerm/lib/dns-cname-record";
import { DataAzurermDnsZone } from "@cdktf/provider-azurerm/lib/data-azurerm-dns-zone";
import { CdnEndpointCustomDomain } from "@cdktf/provider-azurerm/lib/cdn-endpoint-custom-domain";
import { StorageAccountStaticWebsiteA } from "@cdktf/provider-azurerm/lib/storage-account-static-website";
import { NullProvider } from "../.gen/providers/null/provider";
import { Resource as NullResource } from "../.gen/providers/null/resource";
import * as fs from "fs";
import * as crypto from "crypto";

export class CloudResumeInfraStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const provider = new AzurermProvider(this, "AzureRm", {
      features: [{}],
      subscriptionId: process.env.ARM_SUBSCRIPTION_ID,
    });

    const resourceGroup = new DataAzurermResourceGroup(this, "existing-rg", {
      name: "aburke-tech-rg",
      provider,
    });

    const storageAccount = new StorageAccount(this, "cloud-resume-stroage-acct", {
      name: "cloudresumestorage143278",
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountTier: "Standard",
      accountReplicationType: "LRS",
      accountKind: "StorageV2",
    });

    new StorageAccountStaticWebsiteA(this, "cloud-resume-static-website", {
      storageAccountId: storageAccount.id,
      indexDocument: "index.html",
      error404Document: "error.html",
    });

    const cdnProfile = new CdnProfile(this, "cloud-resume-cdn-profile", {
      name: "cloud-resume-cdn-profile",
      resourceGroupName: resourceGroup.name,
      location: "global",
      sku: "Standard_Microsoft",
    });

    const cdnEnpoint = new CdnEndpoint(this, "cloud-resume-cdn-endpoint", {
      name: "cloud-resume-cdn-endpoint",
      profileName: cdnProfile.name,
      resourceGroupName: resourceGroup.name,
      location: cdnProfile.location,
      isHttpAllowed: false,
      isHttpsAllowed: true,
      originHostHeader: storageAccount.primaryWebHost,
      origin: [
        {
          name: "StorageStaticWebsite",
          hostName: storageAccount.primaryWebHost,
          httpsPort: 443,
        },
      ],
    });

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

    new StorageBlob(this, "resume-js-blob", {
      name: "resume.js",
      storageAccountName: storageAccount.name,
      storageContainerName: containerName,
      type: "Block",
      contentType: "application/javascript",
      source: Paths.resumeJsPath,
    });

    const dnsZone = new DataAzurermDnsZone(this, "existing-dns-zone", {
      name: "aburke.tech",
      resourceGroupName: resourceGroup.name,
      provider,
    });

    const cname = new DnsCnameRecord(this, "cloud-resume-cname-record", {
      name: "res",
      zoneName: dnsZone.name,
      resourceGroupName: resourceGroup.name,
      ttl: 3600,
      targetResourceId: cdnEnpoint.id,
    });

    const cdnCustomDomain = new CdnEndpointCustomDomain(this, "cloud-resume-cdn-custom-domain", {
      name: "res-aburke-tech",
      cdnEndpointId: cdnEnpoint.id,
      hostName: `${cname.name}.${dnsZone.name}`,
      cdnManagedHttps: {
        certificateType: "Dedicated",
        tlsVersion: "TLS12",
        protocolType: "ServerNameIndication",
      },
    });

    const hashFile = (p: string) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

    const triggers = {
      index: hashFile(Paths.indexHtmlPath),
      error: hashFile(Paths.errorHtmlPath),
      styles: hashFile(Paths.stylesCssPath),
      main: hashFile(Paths.resumeJsPath),
    };

    new NullProvider(this, "null");
    new NullResource(this, "cdn-purge", {
      triggers,
      provisioners: [
        {
          type: "local-exec",
          command: [
            "az cdn endpoint purge",
            `--resource-group ${resourceGroup.name}`,
            `--profile-name ${cdnProfile.name}`,
            `--name ${cdnEnpoint.name}`,
            "--content-paths '/*'",
          ].join(" "),
        },
      ],
      dependsOn: [cdnCustomDomain],
    });
  }
}
