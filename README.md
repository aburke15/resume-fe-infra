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
├── main.py            # Main CDKTF stack definition
├── main-test.py       # Test file for the infrastructure
├── Pipfile            # Python dependencies
├── Pipfile.lock       # Locked Python dependencies
└── README.md
```

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/cloud-resume-infra.git
   cd cloud-resume-infra
   ```

2. **Install prerequisites:**

   - [Python 3.7+](https://www.python.org/downloads/)
   - [Pipenv](https://pipenv.pypa.io/en/latest/) or [pip](https://pip.pypa.io/en/stable/)
   - [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
   - [CDK for Terraform (CDKTF)](https://developer.hashicorp.com/terraform/cdktf)

3. **Install Python dependencies:**

   Using Pipenv (recommended):

   ```bash
   pipenv install
   pipenv shell
   ```

   Or using pip:

   ```bash
   pip install -r requirements.txt
   ```

4. **Authenticate with Azure:**

   Ensure you are logged in to Azure and have the necessary permissions:

   ```bash
   az login
   ```

5. **Configure environment variables:**

   Copy `.env.example` to `.env` and update values as needed for your Azure subscription and resources.

6. **Deploy the infrastructure:**

   ```bash
   cdktf synth
   cdktf deploy
   ```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

## License

[Specify license, e.g., MIT]
