---
sidebar_position: 2
---

# Delete

In this section we'll learn how to delete records


## Delete attributes
When using delete mutations, an existing node always has to be referenced. 
So the `uid` field for each object must be present. Predicates that should be deleted should be set to the JSON value `null`.

```go
data := []map[string]interface{}{
	{
		"uid": "0x1",
		"rating": nil,
    },
}

db.Mutation().Delete(data).Execute(ctx)
```

### Delete the whole node
If you don't provide any attributes the whole node will be deleted

```go
data := []map[string]interface{}{
	{
		"uid": "0x1",
    },
}

db.Mutation().Delete(data).Execute(ctx)
```