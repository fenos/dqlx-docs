---
sidebar_position: 3
---

# Sorting

In this section we'll learn how to sort results

### OrderAsc

To sort result in ascending order use the `OrderAsc` function

```go
db.Query(dqlx.HasFn("name")).
    OrderAsc("name")
```

### OrderDesc

To sort result in descending order use the `OrderDesc` function

```go
db.Query(dqlx.HasFn("name")).
    OrderDesc("name")
```

### Multiple Sorting

You can chain multiple sorting criteria

```go
db.Query(dqlx.HasFn("name")).
    OrderDesc("name").
	OrderAsc("age")
```