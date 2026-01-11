import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import { CloudResumeInfraStack } from "../src/cloud-resume-infra-stack";

describe("CloudResumeInfraStack", () => {
  describe("Basic Infrastructure Tests", () => {
    it("should create a valid stack", () => {
      const app = Testing.app();
      const stack = new CloudResumeInfraStack(app, "test");
      expect(stack).toBeDefined();
    });

    it("should synthesize without errors", () => {
      const app = Testing.app();
      const stack = new CloudResumeInfraStack(app, "test");
      expect(() => Testing.synth(stack)).not.toThrow();
    });
  });

  describe("Stack Properties", () => {
    it("should have correct stack name", () => {
      const app = Testing.app();
      const stack = new CloudResumeInfraStack(app, "test");
      expect(stack.node.id).toBe("test");
    });

    it("should be instance of CloudResumeInfraStack", () => {
      const app = Testing.app();
      const stack = new CloudResumeInfraStack(app, "test");
      expect(stack).toBeInstanceOf(CloudResumeInfraStack);
    });
  });

  describe("Terraform Generation", () => {
    it("should generate Terraform configuration", () => {
      const app = Testing.app();
      const stack = new CloudResumeInfraStack(app, "test");
      const terraformConfig = Testing.synth(stack);
      expect(terraformConfig).toBeDefined();
      expect(typeof terraformConfig).toBe("string");
    });
  });
});
