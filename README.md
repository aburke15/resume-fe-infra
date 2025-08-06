# Cloud Resume Infrastructure (Azure)

This repository contains the infrastructure code for the Cloud Resume project, using **Azure** as the cloud provider and [CDK for Terraform (CDKTF)](https://developer.hashicorp.com/terraform/cdktf) for Infrastructure as Code.

## Features

- Infrastructure as Code (IaC) with CDK for Terraform (CDKTF)
- Automated deployment pipelines
- Secure, scalable, and cost-effective Azure architecture
- Version-controlled and reproducible environments

## Project Structure

```
resume-infra/
├── cdktf.out/         # CDKTF generated output
├── imports/           # Generated provider bindings
├── scripts/           # Helper scripts
├── .env.example       # Example environment variables
├── cdktf.json         # CDKTF project configuration
├── main.cs            # Main CDKTF stack definition
├── Program.cs         # Entry point for the application
├── *.csproj           # C# project file
├── obj/               # Build output directory
├── bin/               # Compiled binaries
└── README.md
```

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/cloud-resume-infra.git
   cd cloud-resume-infra
   ```

2. **Install prerequisites:**

   - [.NET 6.0+](https://dotnet.microsoft.com/en-us/download)
   - [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
   - [CDK for Terraform (CDKTF)](https://developer.hashicorp.com/terraform/cdktf)

3. **Install .NET dependencies:**

   ```bash
   dotnet restore
   ```

4. **Authenticate with Azure:**

   Ensure you are logged in to Azure and have the necessary permissions:

   ```bash
   az login
   ```

5. **Configure environment variables:**

   Copy `.env.example` to `.env` and update values as needed for your Azure subscription and resources.

6. **Build and deploy the infrastructure:**

   ```bash
   dotnet build
   cdktf synth
   cdktf deploy
   ```

## Development

- **Build the project:** `dotnet build`
- **Run tests:** `dotnet test`
- **Synthesize Terraform:** `cdktf synth`
- **Plan changes:** `cdktf diff`
- **Deploy:** `cdktf deploy`
- **Destroy:** `cdktf destroy`

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

## License

[Specify license, e.g., MIT]
