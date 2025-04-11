-- Adicionar coluna de plano e campos relacionados a assinatura na tabela de usuários
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free' NOT NULL,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive' NOT NULL;

-- Criar tabela para rastreamento de uso
CREATE TABLE IF NOT EXISTS public.usage (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    feature text NOT NULL,
    count integer NOT NULL DEFAULT 0,
    updated_at timestamptz DEFAULT now() NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (user_id, feature)
);

-- Criar tabela para assinaturas
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    stripe_price_id text,
    plan_name text NOT NULL,
    status text NOT NULL,
    current_period_start timestamptz,
    current_period_end timestamptz,
    cancel_at_period_end boolean DEFAULT false,
    canceled_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (user_id)
);

-- Criar tabela para limites do plano
CREATE TABLE IF NOT EXISTS public.plan_limits (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_name text NOT NULL UNIQUE,
    meetings_per_month integer NOT NULL,
    transcription_quality text NOT NULL,
    storage_days integer NOT NULL,
    sentiment_analysis boolean NOT NULL DEFAULT false,
    crm_integrations boolean NOT NULL DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Inserir limites de plano padrão
INSERT INTO public.plan_limits 
(plan_name, meetings_per_month, transcription_quality, storage_days, sentiment_analysis, crm_integrations)
VALUES
('free', 5, 'basic', 30, false, false),
('pro', 100000, 'advanced', 365, true, true),
('enterprise', 100000, 'premium', 3650, true, true)
ON CONFLICT (plan_name) DO NOTHING;

-- Criar tabela para eventos de assinatura
CREATE TABLE IF NOT EXISTS public.subscription_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id uuid REFERENCES public.subscriptions(id),
    event_type text NOT NULL,
    event_data jsonb NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Trigger para atualizar o plano do usuário quando a assinatura mudar
CREATE OR REPLACE FUNCTION update_user_plan()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE auth.users 
    SET 
        plan = NEW.plan_name,
        subscription_status = NEW.status,
        updated_at = now()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trigger_update_user_plan ON public.subscriptions;
CREATE TRIGGER trigger_update_user_plan
AFTER INSERT OR UPDATE OF plan_name, status
ON public.subscriptions
FOR EACH ROW
EXECUTE PROCEDURE update_user_plan();

-- RLS Policies
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;

-- Políticas para usage
CREATE POLICY "Usuários podem visualizar apenas seu próprio uso"
ON public.usage FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Políticas para subscriptions
CREATE POLICY "Usuários podem visualizar apenas sua própria assinatura"
ON public.subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Políticas para plan_limits
CREATE POLICY "Qualquer pessoa pode visualizar limites de plano"
ON public.plan_limits FOR SELECT
TO anon, authenticated
USING (true);

-- Funções para verificar limites
CREATE OR REPLACE FUNCTION check_usage_limit(
    p_user_id uuid,
    p_feature text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_plan text;
    v_current_count int;
    v_limit int;
    v_is_limited boolean;
BEGIN
    -- Obter plano do usuário
    SELECT plan INTO v_plan
    FROM auth.users
    WHERE id = p_user_id;
    
    -- Obter contagem atual
    SELECT count INTO v_current_count
    FROM public.usage
    WHERE user_id = p_user_id AND feature = p_feature;
    
    IF v_current_count IS NULL THEN
        v_current_count := 0;
    END IF;
    
    -- Obter limite do plano
    CASE 
        WHEN p_feature = 'meetings' THEN
            SELECT meetings_per_month INTO v_limit
            FROM public.plan_limits
            WHERE plan_name = v_plan;
        ELSE
            v_limit := 0;
    END CASE;
    
    v_is_limited := v_current_count >= v_limit;
    
    RETURN json_build_object(
        'current', v_current_count,
        'limit', v_limit,
        'is_limited', v_is_limited
    );
END;
$$;
