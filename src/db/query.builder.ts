export interface NodeSearchQueryParams {
    nodeId: number;
    language: string;
    /** search keyword to match with node name */
    searchKeyword: string;
    /** after number of nodes (ordered by node id)*/
    after: number;
    /** number of nodes */
    size: number;
}

export class QueryBuilder {
    static createNodeSearchQueryByPage(params: NodeSearchQueryParams): string {
        return `select c.idNode as 'node_id',
                    ntm.nodeName as 'name',
                    (select count(*) from node_tree sc where sc.level > c.level and sc.iLeft >= c.iLeft and sc.iRight <= c.iRight) as 'children_count'
                from node_tree c, 
                    node_tree_names ntm,
                    (select * from node_tree where idNode = ${params.nodeId}) p
                where c.idNode = ntm.idNode and
                    ntm.language = '${params.language}' and
                    lower(ntm.nodeName) like '%${params.searchKeyword}%' and
                    c.level >= p.level and
                    c.iLeft >= p.iLeft and 
                    c.iRight <= p.iRight
                limit ${params.after}, ${params.size};`
    }
}