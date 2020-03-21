import { ISearchNodeRequest, ISearchNodeResultItem } from "./node.prototype";

export class SearchNodeRequest implements ISearchNodeRequest {
    nodeId: number;
    language: string;
    searchKeyword: string;
    pageNum: number;
    pageSize: number;

    constructor(params: { nodeId: string, language: string, searchKeyword?: string, pageNum?: string, pageSize?: string }) {
        this.nodeId = parseInt(params.nodeId);
        this.language = params.language;
        this.searchKeyword = params.searchKeyword || "";
        this.pageNum = params.pageNum ? parseInt(params.pageNum) : 0;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 100;
    }
}

export class SearchNodeResultItem implements ISearchNodeResultItem {
    node_id: number;
    name: string;
    children_count: number;

    constructor(params: { nodeId: number, name: string, childrenCount: number }) {
        this.node_id = params.nodeId;
        this.name = params.name;
        this.children_count = params.childrenCount;
    }
}