using Constructs;
using HashiCorp.Cdktf;
using HashiCorp.Cdktf.Providers.Azurerm.CdnEndpoint;
using HashiCorp.Cdktf.Providers.Azurerm.CdnEndpointCustomDomain;
using HashiCorp.Cdktf.Providers.Azurerm.CdnProfile;
using HashiCorp.Cdktf.Providers.Azurerm.DataAzurermDnsZone;
using HashiCorp.Cdktf.Providers.Azurerm.DataAzurermResourceGroup;
using HashiCorp.Cdktf.Providers.Azurerm.DnsCnameRecord;
using HashiCorp.Cdktf.Providers.Azurerm.Provider;
using HashiCorp.Cdktf.Providers.Azurerm.StorageAccount;
using HashiCorp.Cdktf.Providers.Azurerm.StorageBlob;


namespace MyTerraformStack;

public class CloudResumeInfraStack : TerraformStack
{
    public CloudResumeInfraStack(Construct scope, string id) : base(scope, id)
    {
        var provider = new AzurermProvider(scope, "AzureRm", new AzurermProviderConfig
        {
            Features = new AzurermProviderFeatures()
        });

        // need a resource group
        var resourceGroup = new DataAzurermResourceGroup(scope, "ExistingResourceGroup", new DataAzurermResourceGroupConfig
        {
            Name = "my-resource-group",
            Provider = provider
        });

        // now i need a dns zone
        var dnsZone = new DataAzurermDnsZone(scope, "ExistingDnsZone", new DataAzurermDnsZoneConfig
        {
            Name = "aburke.tech",
            ResourceGroupName = resourceGroup.Name,
            Provider = provider
        });

        // now i need a storage account
        var storageAccount = new StorageAccount(scope, "CloudResumeStorageAccount", new StorageAccountConfig
        {
            Name = "cloudresumestorage143278",
            ResourceGroupName = resourceGroup.Name,
            Location = resourceGroup.Location,
            AccountTier = "Standard",
            AccountReplicationType = "LRS",
            AccountKind = "StorageV2",
            PublicNetworkAccessEnabled = false,
            StaticWebsite = new StorageAccountStaticWebsite
            {
                IndexDocument = "index.html",
                Error404Document = "404.html"
            },
            Provider = provider
        });
        
        // i need 4 storage blobs 1 for index.html, 1 for 404.html, 1 for styles.css, and 1 for main.js
        _ = new StorageBlob(scope, "IndexBlob", new StorageBlobConfig
        {
            Name = "index.html",
            StorageAccountName = storageAccount.Name,
            Source = FilePaths.IndexHtml,
            ContentType = "text/html",
            Provider = provider
        });
        
        _ = new StorageBlob(scope, "ErrorBlob", new StorageBlobConfig
        {
            Name = "error.html",
            StorageAccountName = storageAccount.Name,
            Source = FilePaths.ErrorHtml,
            ContentType = "text/html",
            Provider = provider
        });
        
        _ = new StorageBlob(scope, "StylesBlob", new StorageBlobConfig
        {
            Name = "styles.css",
            StorageAccountName = storageAccount.Name,
            Source = FilePaths.StylesCss,
            ContentType = "text/css",
            Provider = provider
        });
        
        _ = new StorageBlob(scope, "MainJsBlob", new StorageBlobConfig
        {
            Name = "main.js",
            StorageAccountName = storageAccount.Name,
            Source = FilePaths.MainJs,
            ContentType = "application/javascript",
            Provider = provider
        });

        // now i need a front door cdn profile
        var cdnProfile = new CdnProfile(this, "CloudResumeCdnProfile", new CdnProfileConfig
        {
            Name = "cloud-resume-cdn-profile",
            ResourceGroupName = resourceGroup.Name,
            Location = "global",
            Sku = "Standard_AzureFrontDoor",
            Provider = provider
        });

        var cdnEndpoint = new CdnEndpoint(this, "CloudResumeCdnEndpoint", new CdnEndpointConfig
        {
            Name = "cloud-resume-cdn-endpoint",
            ProfileName = cdnProfile.Name,
            ResourceGroupName = resourceGroup.Name,
            IsHttpAllowed = false,
            IsHttpsAllowed = true,
            OriginHostHeader = storageAccount.PrimaryWebHost,
            Origin = new CdnEndpointOrigin
            {
                Name = "StorageStaticWebsite",
                HostName = storageAccount.PrimaryWebHost,
            },
            Provider = provider
        });
        
        var cnameRecord = new DnsCnameRecord(scope, "CloudResumeCdnCnameRecord", new DnsCnameRecordConfig
        {
            Name = "res",
            ZoneName = dnsZone.Name,
            ResourceGroupName = resourceGroup.Name,
            Ttl = 3600,
            Provider = provider
        });
        
        _ = new CdnEndpointCustomDomain(scope, "CloudResumeCdnCustomDomain", new CdnEndpointCustomDomainConfig
        {
            Name = "res.aburke.tech",
            CdnEndpointId = cdnEndpoint.Id,
            HostName = $"{cnameRecord.Name}.{dnsZone.Name}",
        });
    }
}