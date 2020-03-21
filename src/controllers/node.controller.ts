import { INodeService } from "../models/node.prototype";
import { SearchNodeResultItem, SearchNodeRequest } from "../models/node.model";

export type Dict = { [name: string]: string };

export class NodeController {

    private service: INodeService

    constructor(service: INodeService) {
        this.service = service;
    }

    async search(params: Dict | null): Promise<{ nodes: SearchNodeResultItem[] }> {
        if (!params) throw Error('Parameters object cannot be null.');
        return {
            nodes: await this.service.search(new SearchNodeRequest({
                nodeId: params['node_id'],
                language: params['language'],
                searchKeyword: params['search_keyword'],
                pageNum: params['page_num'],
                pageSize: params['page_size']
            }))
        };
    }
}