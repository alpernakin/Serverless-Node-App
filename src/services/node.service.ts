import { Sequelize } from "sequelize-typescript";
import { sequelize } from "../db/model";
import { INodeService, ISearchNodeRequest, ISearchNodeResultItem } from "../models/node.prototype";
import { QueryBuilder } from "../db/query.builder";
import { QueryTypes } from "sequelize";
import { SearchNodeResultItem } from "../models/node.model";

export class NodeService implements INodeService {

    private sequlize: Sequelize;

    constructor(sequelize: Sequelize) {
        this.sequlize = sequelize;
    }

    /**
     * search nodes
     * @param request parameters to search nodes
     */
    async search(request: ISearchNodeRequest): Promise<ISearchNodeResultItem[]> {
        try {
            let queryResults = await this.sequlize.query(QueryBuilder.createNodeSearchQueryByPage({
                nodeId: request.nodeId,
                language: request.language,
                searchKeyword: request.searchKeyword,
                after: request.pageNum * request.pageSize,
                size: request.pageSize
            }), { type: QueryTypes.SELECT });

            if (!queryResults) return [];

            return queryResults.map(node => new SearchNodeResultItem({
                nodeId: node["node_id"],
                name: node["name"],
                childrenCount: node["children_count"]
            }));
        }
        catch (error) {
            error["domain"] = '[NodeService].[Search]';
            throw error;
        }
    }
}