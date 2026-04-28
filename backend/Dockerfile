FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

COPY MinaroForms.sln ./
COPY src/MinaroForms.Domain/MinaroForms.Domain.csproj src/MinaroForms.Domain/
COPY src/MinaroForms.Application/MinaroForms.Application.csproj src/MinaroForms.Application/
COPY src/MinaroForms.Infrastructure/MinaroForms.Infrastructure.csproj src/MinaroForms.Infrastructure/
COPY src/MinaroForms.Api/MinaroForms.Api.csproj src/MinaroForms.Api/
RUN dotnet restore src/MinaroForms.Api/MinaroForms.Api.csproj

COPY . .
RUN dotnet publish src/MinaroForms.Api/MinaroForms.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MinaroForms.Api.dll"]
