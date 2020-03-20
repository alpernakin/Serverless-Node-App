create schema node_schema;

create table node_schema.node_tree(
	idNode int not null,
    level int not null,
    iLeft int,
    iRight int,
    primary key (idNode)
);

create table node_schema.node_tree_names(
	idNode int not null,
    language varchar(20),
    nodeName varchar(100),
    constraint fk_node foreign key (idNode) references node_schema.node_tree(idNode)
);

create user 'simple_user'@'%' identified by 'p#ssw0rds!mpleusr';
grant select, insert, update on * . * to 'simple_user'@'%' with grant option;