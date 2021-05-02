---
sidebar_position: 1
---

# Set

In this section we'll learn how to **Insert** and **Update** data in Dgraph

Operations that mutate the storage are called `Mutations` we are going to use a `Set` mutation
to store and update data.

If we provide a valid `uid` within the node we are trying to operate on, the operation becomes an `Update`.
If the `uid` we provided doesn't exist it will try to insert it. 

The set operation works like an `Upsert` operation over the `uid`


## Inserts

If we want to store data, we'll make sure that we don't provide any `uid` to our nodes.
Dgraph will generate one automatically for us.

```go
data := []map[string]interface{}{
    {
        "name": "Leo",
        "animal": "Cat",
        "age": 6,
    },
    {
        "name": "Ollie",
        "animal": "Cat",
        "age": 2,
    },
    {
        "name": "Charlie",
        "animal": "Dog",
        "age": 3,
    },
}

response, err := db.Mutation().Set(data).Execute(ctx)
```

You can access the newly generated `uids` of the above records form the `response` object

```go
response.Raw.Uids // map[string]string
```

If you try to print the `Uids` you'll quickly notice that there is no easy way to understand
which record belongs to which `id`. 

The reason is that `maps` in go are not ordered, so we cannot rely
on the order of the ids to determine which id belongs to which record.

To overcome this limitation, we use the "blank" node concept.
We can assign a unique name to our nodes `ids` so that we can refer to them
later. 

The syntax for defining a name to our node is: `_:{name}`

```go
data := []map[string]interface{}{
    {
        "uid": "_:leo",
        "name": "Leo",
        "animal": "Cat",
        "age": 6,
    },
    {
        "uid": "_:ollie",
        "name": "Ollie",
        "animal": "Cat",
        "age": 2,
    },
    {
        "uid": "_:charlie",
        "name": "Charlie",
        "animal": "Dog",
        "age": 3,
    },
}

resp, err := db.Mutation().Set(data).Execute(ctx)

// Now we can access the id knowing exactly which id belongs to which node
resp.Raw.Uids["leo"]
resp.Raw.Uids["ollie"]
resp.Raw.Uids["charlie"]
```

## Upserts

As previously mentioned, updates are behaving more like upserts. 
We provide the `uid` to the node we want to update and if it exists it will update it, else it will create one.

```go
data := []map[string]interface{}{
    {
        "uid": "0x1", // Provide ID
        "age": 7,     // field to update
    },
}

resp, err := db.Mutation().Set(data).Execute(ctx)
```

### Logical Upsert

If we want to upsert on other fields other than the `uid` we use a combination of a `Query` and `Mutation`

let’s say we want to create a new user with `email` and `name` information.
We also want to make sure that one `email` has exactly one corresponding `user` in the database. 
To achieve this, we need to first query whether a user exists in the database with the given email. If a user exists, we use its `UID` to update the name information. 
If the user doesn’t exist, we create a new `user` and update the `email` and `name` information.

We can achieve this with a single operation as following

```go
data := []map[string]interface{}{
    {
    	"uid": "uid(v)",
        "email": "user@company1.io",
        "name": "first name"
    },
}

userByEmailQuery := dqlx.Query(dqlx.EqFn("email", "user@company1.io")).
    .Fields(`
        v as uid
        name
    `)

resp, err := db.Mutation().
	Query(userByEmailQuery).
	Set(data).
	Execute(ctx)
```

### Conditional Upsert

Conditional upsert allows to avoid the entire operation if a certain condition is met.

Imagine you want to only update a user by email if the email exists. If it doesn't you want to skip the operation
and not insert the new record

```go
data := []map[string]interface{}{
    {
    	"uid": "uid(v)",
        "email": "user@company1.io",
        "name": "first name"
    },
}

userByEmailQuery := dqlx.Query(dqlx.EqFn("email", "user@company1.io")).
    .Fields(`
        v as uid
        name
    `)

condition := dqlx.Condition(dqlx.Eq("len(v)", "1"))

resp, err := db.Mutation().
	Query(userByEmailQuery).
	Condition(condition).
	Set(data).
	Execute(ctx)
```