# Stripe Flow


## Pontos de origem do checkout:
- CheckoutButton no componente src/app/app/pricing/page.tsx - Página principal de preços
- CheckoutButton no componente src/app/app/premium-features/page.tsx - Página de recursos premium
- Links de upgrade em src/components/billing/UpgradeBanner.tsx - Banner de upgrade usado em várias partes do aplicativo
- Link de upgrade na barra lateral em src/components/AppLayout.tsx - Menu lateral com link para página de preços

## Fluxo da API:
- /api/checkout - Endpoint que recebe a solicitação inicial
- /api/stripe/create-checkout-session - Endpoint que cria a sessão de checkout do Stripe

## Redirecionamentos:
- Redirecionamento para a página de checkout do Stripe
- Redirecionamento para /app/billing/success em caso de sucesso
- Redirecionamento para /app/pricing em caso de cancelamento

```mermaid

flowchart TD
    %% Pontos de origem
    PricingPage["src/app/app/pricing/page.tsx\nCheckoutButton"] -->|"POST /api/checkout"| CheckoutAPI
    PremiumPage["src/app/app/premium-features/page.tsx\nCheckoutButton"] -->|"POST /api/checkout"| CheckoutAPI
    UpgradeBanner["src/components/billing/UpgradeBanner.tsx\nUpgrade para Pro"] -->|Link para| PricingPage
    AppLayout["src/components/AppLayout.tsx\nPlanos & Preços no menu"] -->|Link para| PricingPage
    
    %% APIs
    CheckoutAPI["POST /api/checkout\nRoute handler"] -->|"Redirect to"| StripeAPI["POST /api/stripe/create-checkout-session\nRoute handler"]
    StripeAPI -->|"createCheckoutSession"| StripeProvider["src/providers/stripe/StripeProvider.ts"]
    
    %% Autenticação
    StripeAPI -->|"Verifica autenticação"| SupabaseClient["createSSRSassClient()"]
    
    %% Redirecionamentos
    StripeProvider -->|"Retorna URL"| CheckoutAPI
    CheckoutAPI -->|"Retorna URL"| Redirect["window.location.href = url"]
    
    %% Resultado
    Redirect -->|"Redireciona para Stripe"| StripeCheckout["Stripe Checkout Page"]
    StripeCheckout -->|"Sucesso"| SuccessPage["src/app/app/billing/success/page.tsx"]
    StripeCheckout -->|"Cancelamento"| PricingPage
    
    %% Webhooks
    StripeEvents["Stripe Events"] -->|"POST /api/stripe/webhook"| Webhook["Webhook Handler\nAtualiza assinatura"]
    
    %% Estilos
    classDef page fill:#f9f9f9,stroke:#333,stroke-width:1px;
    classDef api fill:#e1f5fe,stroke:#0288d1,stroke-width:1px;
    classDef provider fill:#e8f5e9,stroke:#388e3c,stroke-width:1px;
    classDef external fill:#fff8e1,stroke:#ffa000,stroke-width:1px;
    
    class PricingPage,PremiumPage,UpgradeBanner,AppLayout,SuccessPage page;
    class CheckoutAPI,StripeAPI,Webhook api;
    class StripeProvider,SupabaseClient provider;
    class StripeCheckout,StripeEvents external;

```