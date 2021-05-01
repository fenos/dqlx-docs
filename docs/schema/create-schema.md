---
sidebar_position: 1
---

# Management

In this section we'll learn how to create and manage a DGraph `Schema`


## Create a schema

The schema builder allows you to define `Types` and `Predicates` in an  easier way.<br />
It will handle all the syntax complexities to define direct and reverse relations.


### Predicates

Let's start adding some predicates to our schema

```go
schema := db.Schema()

schema.Predicate("name", dqlx.ScalarString)
schema.Predicate("age", dqlx.ScalarInt)
schema.Predicate("birthday", dqlx.ScalarDateTime)

err := schame.Alter(ctx)
```

### Types

When you create a type with **dqlx** all the predicates will be automatically prefixed with `{Type}.`

```go
schema := db.Schema()

schema.Type("User", func(user *TypeBuilder) {
    user.String("name")
    user.Password("password")
    user.Int("age")
    user.DateTime("birthday")
    user.Float("score")
    user.Bool("verified")
    user.UID("some_id")
})
```

### Global predicate on a Type

If you want to reference a predicate that is globally available, you'll need to use the `Predicate` method
on a type

```go
schema := db.Schema()

name := schema.Predicate("name", dqlx.ScalarString)

schema.Type("User", func(user *TypeBuilder) {
    user.Predicate(name)
    user.String("surname")
})
```

### Relations

Defining relations with the Schema Builder have never been easier. 

Imagine the scenario of `User` have many `Posts` and `Posts` have many `Comments`, here is how the schema might look like

```go
schema := db.Schema()

schema.Type("User", func(user *TypeBuilder) {
    user.String("name")
    user.Password("password")
    user.Int("age")
    
    user.Type("posts", "Post").List()
})

schema.Type("Post", func(post *TypeBuilder) {
    post.String("title")
    post.String("description")
    post.Int("age")
    
    post.Type("user", "User").Reverse()
    post.Type("comments", "Comment").List()
})

schema.Type("Comment", func(comment *TypeBuilder) {
    post.String("content")
    
    post.Type("user", "User")
    post.Type("post", "Post").Reverse()
})
```

### Indexes

You can set specific index by chaining the `Index{Type}` method on the predicate

```go
schema.Type("User", func(user *TypeBuilder) {
    user.String("name").IndexTerm().IndexFullTerm()
    user.Password("password").Index()
})
```

#### Available indexes

- exact
- hash
- term
- fulltext
- trigram
- year
- month
- day
- hour

### Altering the schema

In order to alter the schema you must call the `Alter` method. 
This method will not drop any fields by default. You can specify `WithDropAll` to force recreating
the schema from scratch

```go
schema := db.Schema()

// ...

err := schame.Alter(ctx, dqlx.WithDropAll(false))
```

By default, indexing is set to run **In the background** if you prefer it on the main process you can disable it
with the `WithRunInBackground(false)` method

```go
schema := db.Schema()

// ...

err := schame.Alter(ctx, dqlx.WithRunInBackground(false))
```