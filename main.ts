import { App } from "cdktf";
import { CloudResumeInfraStack } from "./src/cloud-resume-infra-stack";

const app = new App();
new CloudResumeInfraStack(app, "cloud-resume-infra-stack");
app.synth();
