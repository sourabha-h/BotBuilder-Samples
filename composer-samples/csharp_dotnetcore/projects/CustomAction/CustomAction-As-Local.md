# Add custom actions as a local Adaptive Dialog
## In this article

In Bot Framework Composer, [actions](concept-dialog#action) are the main
contents of a [trigger](concept-dialog#trigger). Actions help maintain
conversation flow and instruct bots on how to fulfill user requests.
Composer provides different types of actions, such as **Send a
response**, **Ask a question**, and **Create a condition**. Besides
these built-in actions, you can create and customize your own actions in
Composer.

This article shows you how to include a sample custom action named
`MultiplyDialog`.

#### Note

Composer currently supports the C\# runtime and JavaScript (preview)
runtime.

## Prerequisites

-   A basic understanding of [actions](concept-dialog#action) in
    Composer.
-   [A basic bot built using Composer](quickstart-create-bot).
-   [Bot Framework CLI
    4.10](https://botbuilder.myget.org/feed/botframework-cli/package/npm/@microsoft/botframework-cli)
    or later.

## Setup the Bot Framework CLI tool
----------------------

The Bot Framework CLI tools include the *bf-dialog* tool which will
create a *schema file* that describes the built-in and custom
capabilities of your bot project. It does this by merging partial schema
files included with each component with the root schema provided by Bot
Framework.

Open a command line and run the following command to install the Bot
Framework tools:

    npm i -g @microsoft/botframework-cli

### Tip

Read more about [Bot Framework SDK
schemas](https://github.com/microsoft/botframework-sdk/tree/master/schemas)
and [how to create schema
files](/en-us/azure/bot-service/bot-builder-dialogs-declarative&tabs=csharp#creating-the-schema-file).

## About the example custom action
----------------------

The example C\# custom action component consists of the following:

-   A `CustomAction.sln` solution file.

-   A Blank Bot created from Composer (`EmptyBot` in this case)

-   A CustomAction project `CustomAction\Microsoft.BotFramework.Runtime.CustomAction.csproj` project
    file.

-   An `Action` folder that contains the [MultiplyDialog.cs](CustomAction\Action\MultiplyDialog.cs) class,
    which defines the business logic of the custom action. In this
    example, two numbers passed as inputs are multiplied, and the result
    is the output.

    To create a class like `MultiplyDialog.cs` take the
    following steps:

    -   Create a class which inherits from the *Dialog* class.
    -   Define the properties for input and output. These will appear in
        Composer's property editor, and they need to be described in the
        [schema file](#update-the-schema-file).
    -   Implement the required `BeginDialogAsync()` method, which will
        contain the logic of the custom action. You can use
        `Property.GetValue(dc.State)` to get value, and
        `dc.State.SetValue(Property, value)` to set value.
    -   Register the [custom action
        component](#customize-the-exported-runtime) where it's called.
    -   (optional) If there's more than one turn, you might need to add
        the `ContinueDialogAsync` class. Read more in the [Actions
        sample
        code](https://github.com/microsoft/botbuilder-dotnet/tree/master/libraries/Microsoft.Bot.Builder.Dialogs.Adaptive/Actions)
        in the Bot Framework SDK.

-   A `Schemas` folder that contains the [MultiplyDialog.schema](CustomAction\Schemas\MultiplyDialog.schema) file.
    This schema file describes the properties of the example dialog
    component, `arg1`, `arg2`, and `resultProperty`.

    [Bot Framework
    Schemas](https://github.com/microsoft/botframework-sdk/tree/master/schemas)
    are specifications for JSON data. They define the shape of the data
    and can be used to validate JSON. All of Bot Framework's [adaptive
    dialogs](/en-us/azure/bot-service/bot-builder-adaptive-dialog-introduction)
    are defined using this JSON schema. The schema files tell Composer
    what capabilities the bot runtime supports. Composer uses the schema
    to help it render the user interface when using the action in a
    dialog. Read the section about [creating schema files in adaptive
    dialogs](/en-us/azure/bot-service/bot-builder-dialogs-declarative)
    for more information.

## Customize the Runtime
------------------------------

1.  Navigate to the runtime location (for example,
    `C:\CustomAction\EmptyBot`).

1.  Edit the `EmptyBot.csproj` to include a project reference to the custom action project like the
    following:

        <ProjectReference Include="..\CustomAction\Microsoft.BotFramework.Runtime.CustomAction.csproj" />

1. Edit EmptyBot\Startup.cs to register the MultiplyDialogBotComponent
    ```
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers().AddNewtonsoftJson();
        services.AddBotRuntime(Configuration);

        services.AddSingleton<DeclarativeType>(sp => new DeclarativeType<MultiplyDialog>(MultiplyDialog.Kind));
    }
    ```

1.  Run the command `dotnet build` on the project to
    verify if it passes build after adding custom actions to it. You
    should be able to see the "Build succeeded" message after this
    command.

    ```

## Update the schema file
----------------------

Now you have customized your runtime, the next step is to update the
`sdk.schema` file to include the `MultiplyDialog.Schema` file.

1. Navigate to the `C:\CustomAction\EmptyBot\schemas` folder. This
folder contains a PowerShell script and a bash script. Run either one of
the following commands:

       ./update-schema.ps1

    **Note**

    You can validate that the partial schema (`MultiplyDialog.schema` inside
    the `CustomAction\Schema` folder) has been appended to the default
    `sdk.schema` file to generate one single consolidated `sdk.schema` file.

    The above steps should generate a new `sdk.schema` file inside the
    `schemas` folder for Composer to use. Reload the bot and you should be
    able to include your custom action.

1. Search `MultiplyDialog` inside the `EmptyBot\schemas\sdk.schema` file and
    validate that the partial schema (`MultiplyDialog.schema` inside the
    `customaction` folder has been appended to the default `sdk.schema`
    file (`EmptyBot\schemas\sdk.schema`) to generate one single consolidated
    `sdk.schema` file.

## Test
----

Reopen the bot project in Composer and you should be able to test your
added custom action.

1.  Open your bot in Composer. Select a trigger you want to associate
    this custom action with.

2.  Select **+** under the trigger node to see the actions menu. You
    will see **Custom Actions** added to the menu. Select **Multiply**
    from the menu.

3.  On the **Properties** panel on the right side, enter two numbers in
    the argument fields: **Arg1** and **Arg2**. Enter **dialog.result**
    in the **Result** property field. For example, you can enter the
    following:

4.  Add a **Send a response** action. Enter `99*99=${dialog.result}` in
    the Language Generation editor.

5.  Select **Restart Bot** to test the bot in the Emulator. Your bot
    will respond with the test result.


## Additional information
----------------------

-   [Bot Framework SDK
    Schemas](https://github.com/microsoft/botframework-sdk/tree/master/schemas)
-   [Create schema
    files](/en-us/azure/bot-service/bot-builder-dialogs-declarative)