create extension if not exists "uuid-ossp";

create table if not exists usuarios (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  email text unique not null,
  senha text not null,
  perfil text not null check (perfil in ('admin','psicologo','paciente')),
  ativo boolean default true,
  criado_em timestamp default now()
);

create table if not exists pacientes (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  cpf text,
  telefone text,
  email text,
  endereco text,
  nascimento date,
  status text default 'ativo',
  psicologo_id uuid references usuarios(id),
  criado_em timestamp default now()
);

create table if not exists salas (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  capacidade int default 2,
  ativa boolean default true
);

create table if not exists agendamentos (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references pacientes(id) on delete cascade,
  psicologo_id uuid references usuarios(id),
  sala_id uuid references salas(id),
  data_hora timestamp not null,
  duracao_minutos int default 50,
  status text default 'pendente' check (status in ('pendente','confirmado','cancelado','realizado')),
  observacao text,
  criado_em timestamp default now()
);

create table if not exists prontuarios (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references pacientes(id) on delete cascade,
  psicologo_id uuid references usuarios(id),
  anamnese text,
  evolucao text,
  status text default 'rascunho' check (status in ('rascunho','finalizado')),
  data_registro timestamp default now()
);

create table if not exists financeiro (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references pacientes(id),
  agendamento_id uuid references agendamentos(id),
  tipo text not null check (tipo in ('receita','despesa')),
  descricao text not null,
  valor numeric(10,2) not null,
  forma_pagamento text,
  status text default 'pago' check (status in ('pago','pendente','cancelado')),
  data_pagamento date default current_date,
  criado_em timestamp default now()
);

create table if not exists planos (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references pacientes(id) on delete cascade,
  nome_plano text not null,
  quantidade_sessoes int not null,
  sessoes_restantes int not null,
  valor_total numeric(10,2) not null,
  criado_em timestamp default now()
);

create table if not exists documentos (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references pacientes(id) on delete cascade,
  tipo text not null,
  nome_arquivo text,
  arquivo_url text,
  criado_em timestamp default now()
);

create table if not exists convenios (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  percentual_convenio numeric(5,2) default 70,
  percentual_paciente numeric(5,2) default 30
);

create table if not exists tarefas (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references pacientes(id),
  titulo text not null,
  descricao text,
  status text default 'pendente' check (status in ('pendente','concluida','cancelada')),
  prazo date,
  criado_em timestamp default now()
);

insert into salas (nome, capacidade) values ('Sala 01', 2), ('Sala 02', 2) on conflict do nothing;
