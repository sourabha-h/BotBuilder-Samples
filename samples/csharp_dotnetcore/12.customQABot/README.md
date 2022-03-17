﻿# Custom Question Answering

Bot Framework v4 Custom questino answering bot sample.

This bot has been created using [Bot Framework][BF], it shows how to create a bot that uses the [Custom question answering feature in Language Service][LS] service.

The [Custom question answering feature in Language Service][LS] enables you to build, train and publish a simple question and answer bot based on FAQ URLs, structured documents or editorial content in minutes. In this sample, we demonstrate how to use the Custom question answering feature in Language Service to answer questions based on a FAQ text file used as input.

# Prerequisites
- Create a [Language resource](https://aka.ms/create-language-resource) with Custom question answering enabled.
- Follow instructions [here][Quickstart] to create a Custom question answering project. You will need this project's name to be used as `QnAKnowledgebaseId` in [appsettings.json](appsettings.json).

### Obtain values to connect your bot to the knowledge base
- Follow these steps to update [appsettings.json](appsettings.json).
- In the [Azure Portal][Azure], go to your resource.
- Go to Keys and Endpoint under Resource Management.
- `QnAEndpointKey` would be one of the keys and `QnAEndpointHostName` would be the Endpoint from [Azure Portal](https://ms.portal.azure.com/).
- `QnAKnowledgebaseId` would be the name of your project in [Language Studio][LS].

# To try this sample

- Install the Bot Framework Emulator version 4.3.0 or greater from [here][BFE]
- Clone the repository

    ```bash
    git clone https://github.com/Microsoft/botbuilder-samples.git
    ```

- In a terminal, navigate to `samples/csharp_dotnetcore/48.customQABot-all-features`
- Run the bot from a terminal or from Visual Studio, choose option A or B.

  A) From a terminal

  ```bash
  # run the bot
  dotnet run
  ```

  B) Or from Visual Studio

  - Launch Visual Studio
  - File -> Open -> Project/Solution
  - Navigate to `samples/csharp_dotnetcore/48.customQABot-all-features` folder
  - Select `CustomQABotAllFeatures.csproj` file
  - Press `F5` to run the project
- Connect to the bot using Bot Framework Emulator
  1) Launch Bot Framework Emulator
  2) File -> Open Bot
  3) Enter a Bot URL of `http://localhost:3978/api/messages`

# Try Precise Answering
- Try the following queries:
  1) Accessibility
  2) Register
- You can notice a short answer returned along with a long answer.
- If testing in [Language Studio][LS], you might have to check `Include short answer response` at the top.
- You can disable precise answering by setting `EnablePreciseAnswer` to false in [appsettings.json](appsettings.json).
- You can set `DisplayPreciseAnswerOnly` in [appsettings.json](appsettings.json) to true to display just precise answers in the response.

# Deploy the bot to Azure
See [Deploy your C# bot to Azure][50] for instructions.

The deployment process assumes you have an account on Microsoft Azure and are able to log into the [Microsoft Azure Portal][Azure].

If you are new to Microsoft Azure, please refer to [Getting started with Azure][70] for guidance on how to get started on Azure.

## Further reading

- [Bot Framework Documentation](https://docs.botframework.com)
- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Question Answering Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/question-answering/overview)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Azure Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0)
- [.NET Core CLI tools](https://docs.microsoft.com/en-us/dotnet/core/tools/?tabs=netcore2x)
- [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)
- [Azure Portal][Azure]
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)

[50]: https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-deploy-azure?view=azure-bot-service-4.0
[70]: https://azure.microsoft.com/get-started/

[LS]: https://language.cognitive.azure.com/
[PA]: https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/question-answering/concepts/precise-answering
[BF]: https://dev.botframework.com/
[Quickstart]: https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/question-answering/quickstart/sdk
[Azure]: https://ms.portal.azure.com
[BFE]: https://github.com/Microsoft/BotFramework-Emulator/releases