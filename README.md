# Serverless App

A serverless app that queries [nested sets](https://en.wikipedia.org/wiki/Nested_set_model) in AWS Lambda with NodeJs runtime.
[See database files](https://github.com/alpernakin/Serverless-Node-App/tree/master/sql).

## Installation

To run in local `npm run offline`

To deploy `npm run deploy` and to set aws credentials, see `aws_creds` in [package.json](https://github.com/alpernakin/Serverless-Node-App/blob/master/package.json).

To test `npm run test`

## API

### Base URL

Local `http://localhost:4040`, see `offline httpPort` in [serverless.yml](https://github.com/alpernakin/Serverless-Node-App/blob/master/serverless.yml)

#### api/search

Method GET

**Params**

- **node_id** number, required
 
  Selected node id
  
- **language** string, required
    
  Language of the node names in result, example: `english`
  
- **search_keyword** string, optional

  Case insensitive keyword search in node names of the node id or children in the selected language
  
- **page_num** integer, optional, default: 0
  
  0-based page number
  
- **page_size** integer, optional, default: 100

  The size of the page / nodes returned by API
  
**Example** `https://localhost:4040/api/search?node_id=5&language=english&search_keyword=marketing&page_num=0&page_size=10`

**Response**

Returns the queried node and children by querying language and matching node name with `search_keyword`

Success

```
{
  nodes: {
    node_id: number,
    /** node name */
    name: string,
    /** the number of children of the node */
    children_count: number
  }[]
}
```

Error

```
{
  error: any
}
```
