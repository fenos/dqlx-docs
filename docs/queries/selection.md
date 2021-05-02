---
sidebar_position: 1
---

# Selection

In this section we'll learn how to select nodes and edges for our queries.

### Fields

We use the `Fields` function to select the nodes we are interested in:

```go
db.QueryType("Animal").Fields(`
    uid
    name
    animal
`)
```

produces:

```graphql
query RootQuery {
    rootQuery(func: type(Animal)) {
        uid
        name
        animal
    }
}
```

### Query edges

If we want to query fields that are nested we use the `Edge` function

```go
db.QueryType("Animal").
    Fields(`
        uid
        name
        animal
    `).
    Edge("favorite_food", dqlx.Fields(`
        uid
        brand
        type
    `)).
    Edge("favorite_food->ingredients", dqlx.Fields(`
        uid
        name
        family
    `)).
    Edge("favorite_food->ingredients->nutrition", dqlx.Fields(`
        kcal
    `))
```

produces

```graphql
query RootQuery {
    rootQuery(func: type(Animal)) {
        uid
        name
        animal
        favorite_food {
            uid
            brand
            type
            ingredients {
                uid
                name
                family
                nutrition {
                    kcal
                }     
            }   
        }   
    }
}
```

The first parameter of the `Edge` function must be **the full path** starting from its upmost ancestor.

:::tip Using a slice syntax 

If you prefer using a slice syntax over the conventional string (using the symbol `->`)
you can instead use `EdgePath([]string{"favorite_food", ...})` or `Edge(dqlx.EdgePath([]string{"favorite_food", ...}))`

:::

### Aliases

In Order to alias a field you'll just use the expression `alias:field`

```go
db.QueryType("Animal").Fields(`
    uid
    alias:name
`)
```