FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine

WORKDIR /src

COPY MinaroForms.sln ./
COPY src/MinaroForms.Domain/MinaroForms.Domain.csproj src/MinaroForms.Domain/
COPY src/MinaroForms.Application/MinaroForms.Application.csproj src/MinaroForms.Application/
COPY src/MinaroForms.Infrastructure/MinaroForms.Infrastructure.csproj src/MinaroForms.Infrastructure/
COPY src/MinaroForms.Api/MinaroForms.Api.csproj src/MinaroForms.Api/

RUN dotnet restore src/MinaroForms.Api/MinaroForms.Api.csproj

COPY . .

WORKDIR /src/src/MinaroForms.Api

EXPOSE 8080

CMD ["dotnet", "watch", "run", "--urls", "http://+:8080"]