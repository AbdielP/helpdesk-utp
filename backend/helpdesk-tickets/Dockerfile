FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY helpdesk-tickets/helpdesk-tickets.csproj helpdesk-tickets/
RUN dotnet restore helpdesk-tickets/helpdesk-tickets.csproj

COPY helpdesk-tickets/ helpdesk-tickets/
WORKDIR /src/helpdesk-tickets
RUN dotnet publish helpdesk-tickets.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "helpdesk-tickets.dll"]
