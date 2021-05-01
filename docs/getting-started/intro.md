---
sidebar_position: 1
---

# Quick Introduction

**dqlx** is a fully featured Dgraph Schema and Query Builder for Go. <br/>
It aims to simplify the interaction with the awesome **Dgraph** database allowing you to 
fluently compose any queries and mutations of any complexity. It also comes with a rich Schema builder
to easily develop and maintain your Dgraph schema.


## Installation

```bash
go get github.com/fenos/dqlx
```

## Connecting 
Once we installed the library we can quickly connect to a DGraph Cluster


```go
import "github.com/fenos/dqlx"

func main() {
	db, err := dqlx.Connect("localhost:8080")
	
	if err != nil {
	    panic(err)	
    }
}
```

## Inserting Data

At this point we should be successfully connected to the cluster. Let's add some data
so that we can query it later.

```go
import "github.com/fenos/dqlx"

func main() {
    db, err := dqlx.Connect("localhost:8080")
    
    if err != nil {
        panic(err)
    }

    ctx := context.Background()

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
    
    if err != nil {
        panic(err)
    }

    println(fmt.Sprintf("Leo ID %s", resp.Raw.Uids["leo"]))
    println(fmt.Sprintf("Ollie ID %s", resp.Raw.Uids["ollie"]))
    println(fmt.Sprintf("Charlie ID %s", resp.Raw.Uids["charlie"]))
}
```

## Querying Data

Now that we have some data to work with, let's write some queries! <br />
We are going to have the following criterias in our query:

- Must be a Cat 
- Younger than 5 years old

Spoiler: We should be getting back only **Ollie**!

```go
func main() {
    // ... rest of the function

    var animals []map[string]interface{}

    _, err = db.Query(dqlx.HasFn("animal")).
        Filter(
            dqlx.Eq{"animal": "Cat"},
            dqlx.Lt{"age": 5},
        ).
        Fields(`
            uid
            name
            animal
            age
        `).
        UnmarshalInto(&animals).
        Execute(ctx)

    if err != nil { panic(err) }

    println(fmt.Sprintf("The animals are %v", animals))
}
```

## The Final Script

When putting all our code together, we'll get this lovely program:

```go
package main

import (
	"context"
	"fmt"
	"github.com/fenos/dqlx"
	"log"
)

func main() {
	db, err := dqlx.Connect("localhost:9080")

	if err != nil {
		log.Fatal()
	}

	ctx := context.Background()

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

	if err != nil {
		panic(err)
	}

	println(fmt.Sprintf("Leo ID %s", resp.Raw.Uids["leo"]))
	println(fmt.Sprintf("Ollie ID %s", resp.Raw.Uids["ollie"]))
	println(fmt.Sprintf("Charlie ID %s", resp.Raw.Uids["charlie"]))

	var animals []map[string]interface{}

	_, err = db.Query(dqlx.HasFn("animal")).
		Filter(
			dqlx.Eq{"animal": "Cat"},
			dqlx.Lt{"age": 5},
		).
	 	Fields(`
			uid
			name
			animal
			age
		`).
		UnmarshalInto(&animals).
	 	Execute(ctx)

	if err != nil { panic(err) }

	println(fmt.Sprintf("The amilas are: %v", animals))
}
```

Congratulations! <br />
You now have the basics to deep dive into the various aspects of the Queries & Mutations.