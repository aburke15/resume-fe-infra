# Cloud Resume Infrastructure (Azure)

This repository contains the infrastructure code for the Cloud Resume project, using **Azure** as the cloud provider and [CDK for Terraform (CDKTF)](https://developer.hashicorp.com/terraform/cdktf) with TypeScript for Infrastructure as Code.

## Links to the Cloud Resume Project

- [My Resume](https://res.aburke.tech)

## Features

- Infrastructure as Code (IaC) with CDK for Terraform (CDKTF)
- TypeScript for type-safe infrastructure definitions
- Azure Static Website hosting with custom domain support
- DNS management with Azure DNS
- Automated deployment pipelines
- Secure, scalable, and cost-effective Azure architecture
- Version-controlled and reproducible environments

## Project Structure

```
resume-infra/
├── src/               # Source files
│   ├── main.ts        # Main CDKTF stack definition
│   ├── stacks/        # Individual stack definitions
│   └── constructs/    # Reusable constructs
├── tests/             # Test files
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
├── cdktf.out/         # CDKTF generated output
├── .gen/              # Generated provider bindings
├── node_modules/      # Node.js dependencies
├── .env.example       # Example environment variables
├── cdktf.json         # CDKTF project configuration
├── package.json       # Node.js dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── jest.config.js     # Jest test configuration
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [CDK for Terraform (CDKTF)](https://developer.hashicorp.com/terraform/cdktf)
- [Terraform](https://www.terraform.io/downloads.html)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/cloud-resume-infra.git
   cd cloud-resume-infra
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Authenticate with Azure:**

   ```bash
   az login
   ```

4. **Set environment variables:**

   Copy `.env.example` to `.env` and configure your Azure subscription ID:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```bash
   ARM_SUBSCRIPTION_ID=your-azure-subscription-id
   ```

5. **Import Terraform providers:**

   ```bash
   npm run get
   ```

### Development

- **Compile TypeScript:** `npm run compile` or `npm run watch`
- **Build:** `npm run build`
- **Run tests:** `npm test`
- **Lint code:** `npm run lint`
- **Format code:** `npm run format`

### Deployment

1. **Synthesize Terraform configuration:**

   ```bash
   cdktf synth
   ```

2. **Plan deployment:**

   ```bash
   cdktf diff
   ```

3. **Deploy infrastructure:**

   ```bash
   cdktf deploy
   ```

4. **Destroy infrastructure:**

   ```bash
   cdktf destroy
   ```

## Available Scripts

| Command           | Description                                   |
| ----------------- | --------------------------------------------- |
| `npm run get`     | Import/update Terraform providers and modules |
| `npm run compile` | Compile TypeScript to JavaScript              |
| `npm run watch`   | Watch for changes and compile in background   |
| `npm run build`   | Build the project                             |
| `npm test`        | Run tests                                     |
| `npm run lint`    | Lint TypeScript code                          |
| `npm run format`  | Format code with Prettier                     |
| `cdktf synth`     | Synthesize Terraform configuration            |
| `cdktf diff`      | Show deployment plan                          |
| `cdktf deploy`    | Deploy infrastructure                         |
| `cdktf destroy`   | Destroy infrastructure                        |

## Architecture

This project deploys the following Azure resources:

- **Azure Storage Account** - Hosts the static website
- **Azure DNS Zone** - Manages custom domain DNS
- **Azure DNS CNAME Record** - Points custom subdomain to storage endpoint
- **Storage Blobs** - Individual website files (HTML, CSS, JS)

## Environment Variables

| Variable              | Description                       | Required |
| --------------------- | --------------------------------- | -------- |
| `ARM_SUBSCRIPTION_ID` | Azure subscription ID             | Yes      |
| `ARM_CLIENT_ID`       | Azure service principal client ID | No\*     |
| `ARM_CLIENT_SECRET`   | Azure service principal secret    | No\*     |
| `ARM_TENANT_ID`       | Azure tenant ID                   | No\*     |

\*Required only when using service principal authentication instead of Azure CLI.

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Provider configuration errors:**

   - Ensure you're logged in to Azure CLI: `az login`
   - Verify your subscription ID in `.env`

2. **DNS propagation delays:**

   - CNAME records may take 5-60 minutes to propagate
   - Use `nslookup` or `dig` to verify DNS changes

3. **Custom domain verification errors:**
   - Ensure CNAME record is created before setting custom domain on storage account
   - Wait for DNS propagation before applying custom domain configuration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [CDKTF Documentation](https://developer.hashicorp.com/terraform/cdktf)
- [Terraform Azurerm Provider Docs](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
