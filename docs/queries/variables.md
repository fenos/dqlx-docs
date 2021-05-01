---
sidebar_position: 5
---

# Query Variables

In this section we'll learn how to create Query Variables

## Defining Query Variable

This time let's start from the plain DQL statement to define a variable

```graphql
var(func: eq(name, $0)) {
    film {
        performance {
            D AS genre
        }
    }
}
```

then you will write the variable this way

```go
variable := dqlx.Variable(dql.EqFn("name", "test")).
    Edge("film").
    Edge("film->performance", dqlx.Fields(`
         D AS genre
    `))
```

If you want to add a variable on an edge you'll use `EdgeAs()` function, For example:

```graphql
A AS var(func: eq(name, $0)) {
    B AS film {
        C AS performance {
            D AS genre
        }
    }
}
```

You'll write

```go
variable := dqlx.Variable(dql.EqFn("name", "test")).
    As("A").
    EdgeAs("B", "film").
    EdgeAs("C", "film->performance", dqlx.Fields(`
         D AS genre
    `))
```

### Use the variable

To use a variable within a query is super simple, just add the variable to a query using the `Variable()` method
then refer to it with the `Expr` function

```go
variable := dqlx.Variable(dql.EqFn("name", "test")).
    Edge("film").
    Edge("film->performance", dqlx.Fields(`
         D AS genre
    `))

db.QueryType("Film").
    Fields("uid").
    Filter(dqlx.Eq{
        "genre": dqlx.Expr("D"),	
    }).
    Variable(variable)
```