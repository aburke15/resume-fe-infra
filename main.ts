import { App } from "cdktf";
import { CloudResumeInfraStack } from "./src/cloud-resume-infra-stack";

const app = new App();
new CloudResumeInfraStack(app, "resume-infra");
app.synth();
