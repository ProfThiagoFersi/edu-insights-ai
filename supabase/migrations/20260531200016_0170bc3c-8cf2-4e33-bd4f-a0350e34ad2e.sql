CREATE TABLE public.professores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL,
  nome text NOT NULL,
  disciplina text NOT NULL DEFAULT '',
  turmas text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  telefone text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.professores TO authenticated;
GRANT ALL ON public.professores TO service_role;

ALTER TABLE public.professores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own professores"
ON public.professores
FOR ALL
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);