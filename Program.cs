using System;
using HashiCorp.Cdktf;

namespace MyTerraformStack;

public static class Program
{
    public static void Main(string[] args)
    {
        var app = new App();
        _ = new CloudResumeInfraStack(app, "resume-infra");
        app.Synth();
        Console.WriteLine("App synth complete");
    }
}