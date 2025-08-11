# Infrastructure Testing Guide

This document explains how to test your Azure infrastructure code using CDKTF and Jest.

## 🧪 Running Tests

### Prerequisites

- Node.js 20.9+ installed
- Dependencies installed (`npm install`)

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

## 📋 Test Coverage

The current test suite covers:

### ✅ **Basic Infrastructure Tests**

- Stack creation and instantiation
- Synthesis without errors
- Basic stack properties

### ✅ **Stack Properties**

- Correct stack naming
- Instance type validation
- Node identification

### ✅ **Terraform Generation**

- Configuration generation
- Output format validation

## 🔧 Test Structure

```
__tests__/
└── main-test.ts          # Main test file for CloudResumeInfraStack
```

## 🚀 What the Tests Validate

1. **Stack Creation**: Ensures your infrastructure stack can be instantiated
2. **Synthesis**: Verifies that CDKTF can generate Terraform configuration
3. **Type Safety**: Confirms proper TypeScript types and inheritance
4. **Basic Functionality**: Tests core CDKTF functionality

## 📝 Adding More Tests

To add more comprehensive tests, you can extend the test file with:

### Resource Validation Tests

```typescript
it("should contain storage account", () => {
  const app = Testing.app();
  const stack = new CloudResumeInfraStack(app, "test");
  const config = Testing.synth(stack);
  expect(config).toContain("azurerm_storage_account");
});
```

### Configuration Property Tests

```typescript
it("should have correct storage account name", () => {
  const app = Testing.app();
  const stack = new CloudResumeInfraStack(app, "test");
  const config = Testing.synth(stack);
  expect(config).toContain("cloudresstoracct143278");
});
```

### Dependency Tests

```typescript
it("should have proper resource dependencies", () => {
  const app = Testing.app();
  const stack = new CloudResumeInfraStack(app, "test");
  const config = Testing.synth(stack);
  // Test for depends_on relationships
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Type Errors**: Ensure you're using the correct CDKTF version
2. **Import Errors**: Check that all dependencies are properly installed
3. **Synthesis Errors**: Verify your infrastructure code compiles correctly

### Debug Mode

```bash
npm test -- --verbose
```

## 📚 Resources

- [CDKTF Testing Documentation](https://cdk.tf/testing)
- [Jest Testing Framework](https://jestjs.io/)
- [Azure Provider Documentation](https://registry.terraform.io/providers/hashicorp/azurerm)

## 🔄 Continuous Integration

These tests can be integrated into your CI/CD pipeline to ensure infrastructure changes are validated before deployment.

## 📊 Test Results

When tests pass, you'll see output like:

```
 PASS  __tests__/main-test.ts
  CloudResumeInfraStack
    Basic Infrastructure Tests
      ✓ should create a valid stack
      ✓ should synthesize without errors
    Stack Properties
      ✓ should have correct stack name
      ✓ should be instance of CloudResumeInfraStack
    Terraform Generation
      ✓ should generate Terraform configuration

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```
