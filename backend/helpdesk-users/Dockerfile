FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY helpdesk-users/helpdesk-users.csproj helpdesk-users/
RUN dotnet restore helpdesk-users/helpdesk-users.csproj

COPY helpdesk-users/ helpdesk-users/
WORKDIR /src/helpdesk-users
RUN dotnet publish helpdesk-users.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "helpdesk-users.dll"]
