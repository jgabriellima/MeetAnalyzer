-- Adicionar colunas relacionadas ao Stripe na tabela accounts
ALTER TABLE public.accounts
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN subscription_plan TEXT; 