import "cdktf/lib/testing/adapters/jest";
import { Testing } from "cdktf";
import { CloudResumeInfraStack } from "../src/cloud-resume-infra-stack";

describe("CloudResumeInfraStack", () => {
  let app: any;
  let stack: CloudResumeInfraStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new CloudResumeInfraStack(app, "TestStack");
  });

  it("should synthesize without errors", () => {
    expect(() => Testing.synth(stack)).not.toThrow();
  });

  it("should create a Storage Account", () => {
    const synthesized = Testing.synth(stack);
    expect(synthesized).toContain("azurerm_storage_account");
    expect(synthesized).toContain("cloud-resume-storage-acct");
  });

  it("should create Storage Account Static Website", () => {
    const synthesized = Testing.synth(stack);
    expect(synthesized).toContain("azurerm_storage_account_static_website");
    expect(synthesized).toContain("index.html");
    expect(synthesized).toContain("error.html");
  });

  it("should create Storage Blobs for static files", () => {
    const synthesized = Testing.synth(stack);
    expect(synthesized).toContain("azurerm_storage_blob");
    expect(synthesized).toContain("index-html-blob");
    expect(synthesized).toContain("error-html-blob");
    expect(synthesized).toContain("styles-css-blob");
    expect(synthesized).toContain("resume-js-blob");
  });

  it("should create a CDN Profile", () => {
    const synthesized = Testing.synth(stack);
    expect(synthesized).toContain("azurerm_cdn_profile");
    expect(synthesized).toContain("cloud-resume-cdn-profile-v2");
    expect(synthesized).toContain("Standard_Microsoft");
  });

  it("should create a CDN Endpoint", () => {
    const synthesized = Testing.synth(stack);
    expect(synthesized).toContain("azurerm_cdn_endpoint");
    expect(synthesized).toContain("cloud-resume-cdn-endpoint");
    expect(synthesized).toContain("StorageStaticWebsite");
  });

  it("should create DNS CNAME Record", () => {
    const synthesized = Testing.synth(stack);
    expect(synthesized).toContain("azurerm_dns_cname_record");
    expect(synthesized).toContain("cloud-resume-cname-record");
    expect(synthesized).toContain("res");
  });

  it("should create CDN Custom Domain", () => {
    const synthesized = Testing.synth(stack);
    expect(synthesized).toContain("azurerm_cdn_endpoint_custom_domain");
    expect(synthesized).toContain("res-aburke-tech");
  });

  it("should create Null Resource for CDN purge", () => {
    const synthesized = Testing.synth(stack);
    expect(synthesized).toContain("null_resource");
    expect(synthesized).toContain("cdn-purge");
    expect(synthesized).toContain("az cdn endpoint purge");
  });

  it("should reference existing Resource Group and DNS Zone", () => {
    const synthesized = Testing.synth(stack);
    expect(synthesized).toContain("data.azurerm_resource_group");
    expect(synthesized).toContain("aburke-tech-rg");
    expect(synthesized).toContain("data.azurerm_dns_zone");
    expect(synthesized).toContain("aburke.tech");
  });
});
