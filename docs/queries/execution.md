---
sidebar_position: 6
---

# Execution

In this section we'll learn how to execute queries in various modes as well as how we unmarshall the data into a Go structure. 
We'll also learn how to execute multiple query blocks

## Execute Query

In order to execute a query we must run the `Execute` method.
Every time we call `Execute` a new transaction is created, and it is committed upon success.

```go
response, err := db.
    Query(dqlx.HasFn("name")).
    Fields(`
        uid
        name
        species
    `).
    Filter(
        dqlx.EqFn("name", "Ollie"),
    ).
    Execute(ctx)
```

## Manual Transaction

if you want control over the transaction you can certainly do that. 
We do that passing `dqlx.WithTnx()` function to the `Execute` method

```go
tnx := db.NewTnx()

response, err := db.
    Query(dqlx.HasFn("name")).
    Fields(`
        uid
        name
        species
    `).
    Filter(
        dqlx.EqFn("name", "Ollie"),
    ).
    Execute(ctx, dqlx.WithTnx(tnx))

tnx.Commit()
```

## Read Only Transaction

Similarly, we use `WithReadOnly` if we want to mark this query to be read-only

```go
response, err := db.
    Query(dqlx.HasFn("name")).
    Fields(`
        uid
        name
        species
    `).
    Filter(
        dqlx.EqFn("name", "Ollie"),
    ).
    Execute(ctx, dqlx.WithReadOnly())
```

## Unmarshalling

Once the query is executed successfully, we want to grab the result set and Unmarshall it into a go data structure.

We can Unmarshall the results by calling `Unmarshall` on the response object.

```go
response, err := db.
    Query(dqlx.HasFn("name")).
    Fields(`
        uid
        name
        species
    `).
    Filter(
        dqlx.EqFn("name", "Ollie"),
    ).
    Execute(ctx)

var data []map[string]interface{}

err := response.Unmarshall(&data)

if err != nil {
	panic(err)
}

// data is now populated!
```

Another way to achieve the same as above but with fewer lines of code is to use the `UnmarshallInto` method during the building phase.

```go
var data []map[string]interface{}

response, err := db.
    Query(dqlx.HasFn("name")).
    Fields(`
        uid
        name
        species
    `).
    Filter(
        dqlx.EqFn("name", "Ollie"),
    ).
    UnmarshallInto(&data)
    Execute(ctx)
```

### Structs

You can also Unmarshall into well-defined structs, which is usually the recommended way.
The marshaller takes in consideration the `json:` tag of the field to automatically map the data.

```go
type Animal struct {
    Uid     string `json:"uid"`
    Name    string `json:"name"`
    Species string `json:"species"`
}

var animals []Animal

response, err := db.
    Query(dqlx.HasFn("name")).
    Fields(`
        uid
        name
        species
    `).
    Filter(
        dqlx.EqFn("name", "Ollie"),
    ).
    UnmarshallInto(&animals)
    Execute(ctx)
```