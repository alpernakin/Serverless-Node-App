import 'mocha';
import chai from 'chai';
import { SearchNodeRequest } from '../src/models/node.model';

describe('Request Models', () => {

    describe('Search Node Request', () => {

        it('should convert', () => {
            let model = new SearchNodeRequest({
                nodeId: "1",
                language: "english",
                searchKeyword: "e",
                pageNum: "2",
                pageSize: "10"
            });

            chai.expect(model.nodeId).eq(1);
            chai.expect(model.language).eq("english");
            chai.expect(model.searchKeyword).eq("e");
            chai.expect(model.pageNum).eq(2);
            chai.expect(model.pageSize).eq(10);
        });

        it('should set defaults', () => {
            let model = new SearchNodeRequest({
                nodeId: "1",
                language: "english"
            });

            chai.expect(model.pageNum).eq(0);
            chai.expect(model.pageSize).eq(100);
        });
    });
});