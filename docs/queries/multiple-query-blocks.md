---
sidebar_position: 6
---

# Multiple Query Blocks


Often we want to be able to run multiple query blocks in a single round trip to maximize latency.

The `db.ExecuteQueries()` function accepts a list of `QueryBuilder` and it will smartly compose
a single giant query to be sent to DGraph.

```go
var data1 []map[string]interface{}

query1 := db.
    Query(dqlx.HasFn("name")).
    Fields(`
        uid
        name
        species
    `).
    Filter(
        dqlx.EqFn("name", "Ollie"),
    ).
    UnmarshallInto(&data1)

var data2 []map[string]interface{}

query2 := db.
    Query(dqlx.HasFn("name")).
    Fields(`
        uid
        name
        species
    `).
    Filter(
        dqlx.EqFn("name", "Leo"),
    ).
    UnmarshallInto(&data2)

resp, err := db.ExecuteQueries(ctx, []dqlx.QueryBuilder{query1, query2})
```