# Cloud Resume Infrastructure

This repository contains the infrastructure code for the Cloud Resume project. It provisions and manages all cloud resources required to host and operate the resume application.

## Features

- Infrastructure as Code (IaC) using [AWS CDK for Terraform (CDKTF)](https://developer.hashicorp.com/terraform/cdktf)
- Automated deployment pipelines
- Secure and scalable cloud architecture
- Version-controlled and reproducible environments

## Project Structure

```
resume-infra/
├── cdktf.out/         # CDKTF generated output
├── src/               # CDKTF stack definitions and constructs
├── scripts/           # Helper scripts
├── .env.example       # Example environment variables
├── cdktf.json         # CDKTF project configuration
├── package.json       # Node.js project manifest
├── tsconfig.json      # TypeScript configuration
└── README.md
```

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/cloud-resume-infra.git
   cd cloud-resume-infra
   ```

2. **Install prerequisites:**

   - [Node.js](https://nodejs.org/)
   - [AWS CLI](https://aws.amazon.com/cli/)
   - [CDK for Terraform (CDKTF)](https://developer.hashicorp.com/terraform/cdktf)

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Configure your cloud credentials.**

5. **Deploy the infrastructure:**
   ```bash
   cdktf synth
   cdktf deploy
   ```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

## License

[Specify license, e.g., MIT]
