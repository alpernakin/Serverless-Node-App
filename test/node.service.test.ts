import 'mocha';
import chai from 'chai';
import { NodeService } from '../src/services/node.service';
import { QueryTypes } from 'sequelize/types';
import { QueryBuilder } from '../src/db/query.builder';
import { SearchNodeRequest } from '../src/models/node.model';

export class FakeSequelize {

    lastQuery: string;

    static create() {
        return <any>new this();
    }

    query(query: string, options: { type: QueryTypes }): any[] {
        // keep track of the last query
        this.lastQuery = query;
        return [
            {
                node_id: 1,
                name: 'Marketing',
                children_count: 11
            },
            {
                node_id: 2,
                name: 'Managers',
                children_count: 5
            },
            {
                node_id: 3,
                name: 'Account',
                children_count: 2
            }
        ];
    }
}

describe('Node Service', () => {

    it('should create', () => {
        let service = new NodeService(FakeSequelize.create());
        chai.should().exist(service);
    });

    it('should make a sensible query', async () => {
        let mockSequelize = FakeSequelize.create();
        let service = new NodeService(mockSequelize);
        await service.search(new SearchNodeRequest({
            nodeId: "1",
            language: "english",
            searchKeyword: "e",
            pageNum: "2",
            pageSize: "10"
        }));

        chai.expect(mockSequelize["lastQuery"]).eql(QueryBuilder.createNodeSearchQueryByPage({
            nodeId: 1,
            language: "english",
            searchKeyword: "e",
            after: 20,
            size: 10
        }));
    })

    it('should return in format', async () => {
        let service = new NodeService(FakeSequelize.create());
        let results = await service.search(new SearchNodeRequest({ nodeId: "1", language: "english" }));
        chai.expect(results.length).equal(3);
        let first = results[0];
        chai.expect(first).to.have.property('node_id');
        chai.expect(first).to.have.property('name');
        chai.expect(first).to.have.property('children_count');
    });
});