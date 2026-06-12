## Super Administrador — Plano de Implementação

Hoje cada usuário só enxerga seus próprios dados (RLS por `owner_id`). O super admin precisa de acesso transversal seguro a toda a plataforma. A regra de ouro: **papéis ficam na tabela `user_roles`** (já existe) e toda checagem de privilégio é feita no servidor via `has_role`, nunca no cliente.

### 1. Banco de dados (migration)
- Adicionar o valor `super_admin` ao enum `app_role`.
- Criar função `is_super_admin(uuid)` (security definer) reutilizando o padrão de `has_role`.
- Adicionar políticas RLS de leitura/escrita global em `alunos`, `professores`, `turmas`, `profiles` e `user_roles` condicionadas a `is_super_admin(auth.uid())`, sem quebrar as políticas de `owner_id` existentes.
- Permitir que super admin gerencie linhas de `user_roles` (atribuir/remover papéis).

### 2. Definir o primeiro super admin
- Como não há cadastro de admin automático, o primeiro super admin será definido manualmente (insert seguro em `user_roles`) — você me informa o e-mail da conta a ser promovida.

### 3. Server functions (acesso de administração)
- `getPlatformStats` — totais agregados (escolas, usuários, alunos, professores, turmas, alunos em risco).
- `listUsers` — lista de perfis + papéis de todos os usuários.
- `setUserRole` / `removeUser` — promover, rebaixar e remover contas.
- Todas com `requireSupabaseAuth` **+** verificação `is_super_admin` no início do handler (endpoint público caso contrário).

### 4. Interface
- Nova rota protegida `/app/admin` visível no menu lateral **apenas** quando o usuário tem o papel `super_admin`.
- Painel com: cards de métricas globais, tabela de usuários (com ações de papel/remover) e visão consolidada por escola.
- Hook `useIsSuperAdmin` para condicionar a navegação.

### 5. Verificação
- Build limpo, teste de acesso negado para usuário comum, e confirmação de que o super admin enxerga dados de múltiplas contas.

### Decisões que preciso de você
1. **Capacidades**: ver tudo + gerenciar usuários + métricas globais + editar/excluir qualquer dado — confirma todas ou quer reduzir?
2. **Primeiro admin**: me passa o e-mail para eu promover agora, ou prefere promover depois pelo painel?
