export class SearchNodeRequest {

    nodeId: number;
    language: string;
    searchKeyword: string;
    pageNum: number;
    pageSize: number;

    constructor(params: { nodeId: string, language: string, searchKeyword?: string, pageNum?: string, pageSize?: string }) {
        if (!params) throw Error('Parameters object cannot be null.');

        this.nodeId = parseInt(params.nodeId);
        this.language = params.language;
        this.searchKeyword = params.searchKeyword?.toLowerCase() || "";
        this.pageNum = params.pageNum ? parseInt(params.pageNum) : 0;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 100;
    }
}