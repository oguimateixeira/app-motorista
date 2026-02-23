# Driver Profit

MVP app for delivery and ride-hailing drivers to calculate real profit per ride.

## Run

**Pasta do projeto (raiz do repositório):**
`C:\Users\Usuário\OneDrive\Área de Trabalho\app ifood`

**Na raiz do projeto:**

```bash
cd "C:\Users\Usuário\OneDrive\Área de Trabalho\app ifood"

# Install dependencies (once)
npm install

# Build shared package (required before web or mobile)
npm run build:shared

# Web app
npm run web

# Mobile (Expo) — builds shared then starts
npm run mobile
```

**Mobile only (from `apps/mobile`):**

```bash
npm run build:shared   # from root, or run from apps/mobile after building shared once
npx expo start
```

## Build APK (EAS)

Geração de APK com EAS Build no monorepo: o servidor instala dependências e builda o `packages/shared` automaticamente via hook **antes** do `npm install` do app.

### Pré-requisito (uma vez)

O EAS precisa do **monorepo completo** no servidor para o hook rodar. No [expo.dev](https://expo.dev):

1. Conecte o **repositório Git** do projeto (se ainda não estiver conectado).
2. Em **Settings** do projeto → **Build** → **Root directory**: use **`apps/mobile`**.
3. Assim o EAS clona o repo inteiro e usa `apps/mobile` como app; o hook `eas-build-pre-install` sobe para a raiz (`../..`), roda `npm install` e `npm run build:shared`.

### Gerar o APK

**Não use** `prepare-eas` nem `clean-eas`. Rode só:

```bash
cd "C:\Users\Usuário\OneDrive\Área de Trabalho\app ifood"
npm run build:shared
cd apps/mobile
npx eas build -p android --profile preview
```

O servidor EAS vai:

1. Rodar o hook **pre-install**: `cd ../.. && npm install && npm run build:shared`
2. Instalar dependências do app
3. Fazer o build Android e gerar o APK

### EAS do zero (projeto novo no Expo)

Se você criou um projeto novo no expo.dev:

1. Em `apps/mobile`: `npx eas init` → escolha o projeto novo (ou crie um).
2. No expo.dev: conecte o Git do repo e defina **Root directory** = `apps/mobile`.
3. Use os comandos da seção “Gerar o APK” acima.

## Structure

- `packages/shared` — types, calculations, constants (used by web + mobile)
- `apps/web` — React (Vite) web app
- `apps/mobile` — React Native (Expo) app
