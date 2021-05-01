---
sidebar_position: 4
---

# Pagination

In this section we'll learn how to paginate results

### Paginate Queries

In order to paginate result you can simply call the `Paginate()` function and pass a `Cursor` struct
with the information of your offsets

```go
db.QueryType("Animal").
    Paginate(dqlx.Cursor{
        First:  10,
        Offset: 0,
        After:  "",
    })
```

### Paginate Edges
Simply pass the pagination struct

```go
db.QueryType("Animal").
    Edge("favorite_food", dqlx.Cursor{
        First:  10,
        Offset: 0,
        After:  "",
    })
```