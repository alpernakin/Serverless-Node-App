import { Sequelize } from "sequelize-typescript";
import { Node, sequelize } from "../db/model";
import { SearchNodeRequest } from "../models/request.model";
import { Op } from "sequelize";

export class NodeService {

    private sequlize: Sequelize;

    constructor(sequelize: Sequelize) {
        this.sequlize = sequelize;
    }

    private log(domain: string, error: Error) {
        console.log(`${domain} [${new Date().toUTCString()}]: ${error.message}`);
    }

    async search(request: SearchNodeRequest) {
        try {
            let keywordLike = `%${request.searchKeyword}%`;
            return this.sequlize.model(Node).findAll({
                attributes: ["idNode"],
                where: {
                    idNode: request.nodeId,
                },
                include: [
                    {
                        model: sequelize.models["NodeName"],
                        attributes: ["nodeName"],
                        where: {
                            language: request.language,
                            nodeName: { [Op.like]: keywordLike }
                        },
                    }
                ]
            });
        }
        catch (error) {
            // todo log the errors
            this.log('[NodeService].[Search]', error);

            throw error;
        }
    }

    /**
     * finds out if any node exists with the given id
     * @param nodeId the primary key node id
     */
    async exists(nodeId: number) {
        try {
            let node = await this.sequlize.model(Node).findByPk(nodeId);
            // if the given node is not null or undefined
            return !!node;
        }
        catch (error) {
            // todo log the errors
            this.log('[NodeService].[Exists]', error);

            throw error;
        }
    }
}
export const nodeServiceInstance = new NodeService(sequelize);