FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["helpdesk-utp.support/helpdesk-utp.support.csproj", "helpdesk-utp.support/"]
RUN dotnet restore "helpdesk-utp.support/helpdesk-utp.support.csproj"
COPY . .
WORKDIR "/src/helpdesk-utp.support"
RUN dotnet build "./helpdesk-utp.support.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./helpdesk-utp.support.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "helpdesk-utp.support.dll"]
