FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY helpdesk-notifications/helpdesk-notifications.csproj helpdesk-notifications/
RUN dotnet restore helpdesk-notifications/helpdesk-notifications.csproj

COPY helpdesk-notifications/ helpdesk-notifications/
WORKDIR /src/helpdesk-notifications
RUN dotnet publish helpdesk-notifications.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "helpdesk-notifications.dll"]
