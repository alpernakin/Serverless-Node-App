import * as fs from 'fs';
import { Environment } from '../../env';
import { Table, Column, DataType, PrimaryKey, ForeignKey, BelongsTo, Model, Sequelize, HasMany } from 'sequelize-typescript';

// to see the documentation about MySQL ORM with sequalize and typescript
// https://github.com/RobinBuschmann/sequelize-typescript

@Table({ tableName: 'node_tree' })
class Node extends Model<Node> {
    @PrimaryKey
    @Column(DataType.NUMBER)
    idNode: number;

    @Column(DataType.NUMBER)
    level: number;

    @Column(DataType.NUMBER)
    iLeft: number;

    @Column(DataType.NUMBER)
    iRight: number;

    @HasMany(() => NodeName)
    names: NodeName[];
}

@Table({ tableName: 'node_tree_names' })
class NodeName extends Model<NodeName> {
    @Column(DataType.NUMBER)
    @ForeignKey(() => Node)
    idNode: number;

    @Column(DataType.TEXT)
    language: string;

    @Column(DataType.TEXT)
    nodeName: string;

    @BelongsTo(() => Node)
    node: Node;
}

// get the environment variables for database access
const env = <Environment>JSON.parse(fs.readFileSync(`${__dirname}/../../env.json`).toString());
// construct the sequelize
export const sequelize = new Sequelize(env.mysql.database, env.mysql.user, env.mysql.password, {
    host: env.mysql.host,
    dialect: 'mysql',
    models: [Node, NodeName],
    define: {
        timestamps: false
    }
});
// we don't need an id in node name table
NodeName.removeAttribute('id');

export { Node, NodeName };
