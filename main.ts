import { App } from "cdktf";
import { CloudResumeInfraStack } from "./src/cloud-resume";
import { TestInfraStack } from "./src/test.infra";

const app = new App({ skipValidation: true });

new TestInfraStack(app, "test-infra");
new CloudResumeInfraStack(app, "resume-infra");

app.synth();
