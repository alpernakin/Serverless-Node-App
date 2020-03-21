export interface INodeService {
    search(request: ISearchNodeRequest): Promise<ISearchNodeResultItem[]>
}

export interface ISearchNodeRequest {
    nodeId: number;
    language: string;
    searchKeyword: string;
    pageNum: number;
    pageSize: number;
}

export interface ISearchNodeResultItem {
    node_id: number;
    name: string;
    children_count: number;
}