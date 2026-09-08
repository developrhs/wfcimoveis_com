CREATE TABLE `agentes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telefone` varchar(30) NOT NULL,
	`foto` varchar(500),
	`bio` text,
	`comissao_padrao` decimal(5,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agentes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clientes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telefone` varchar(30),
	`cpf` varchar(20),
	`endereco` varchar(400),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clientes_id` PRIMARY KEY(`id`),
	CONSTRAINT `clientes_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `imoveis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`subtitulo` varchar(240),
	`descricao` text NOT NULL,
	`localizacao` varchar(240),
	`tipo_imovel_id` int NOT NULL,
	`tipo_venda_id` int NOT NULL,
	`valor_centavos` int NOT NULL,
	`quantidade_total` int,
	`quantidade_disponivel` int,
	`status` enum('disponivel','vendido','reservado') NOT NULL DEFAULT 'disponivel',
	`agente_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `imoveis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `midias_imovel` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imovel_id` int NOT NULL,
	`tipo` enum('imagem','video') NOT NULL,
	`caminho_arquivo` varchar(700) NOT NULL,
	`ordem` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `midias_imovel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tipos_imovel` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(120) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tipos_imovel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tipos_venda` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(120) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tipos_venda_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imovel_id` int NOT NULL,
	`cliente_id` int NOT NULL,
	`agente_id` int,
	`data_venda` date NOT NULL,
	`valor_venda_centavos` int NOT NULL,
	`quantidade_vendida` int NOT NULL DEFAULT 1,
	`observacoes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vendas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `depoimentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cliente_id` int NOT NULL,
	`titulo` varchar(180) NOT NULL,
	`subtitulo` varchar(240),
	`descricao` text NOT NULL,
	`data` date NOT NULL,
	`foto` varchar(700),
	`status` enum('ativo','inativo') NOT NULL DEFAULT 'ativo',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `depoimentos_id` PRIMARY KEY(`id`)
);
