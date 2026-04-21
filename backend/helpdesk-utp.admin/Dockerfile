FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["helpdesk-utp.admin/helpdesk-utp.admin.csproj", "helpdesk-utp.admin/"]
RUN dotnet restore "helpdesk-utp.admin/helpdesk-utp.admin.csproj"
COPY . .
WORKDIR "/src/helpdesk-utp.admin"
RUN dotnet build "./helpdesk-utp.admin.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./helpdesk-utp.admin.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "helpdesk-utp.admin.dll"]
