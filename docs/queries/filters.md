---
sidebar_position: 2
---

# Filters

In this section we'll learn how to filter the root query and its nested edges. <br />
You'll also find all the available definitions of **dqlx** functions


## Root Filter 

The first constraint we need to provide to our query is a single filter to help Dgraph minimise the amount of data we want to query against.
We can achieve data using any functions in **dqlx** that ends in `Fn`

```go
db.Query(dqlx.HasFn("name"))            // rootQuery(func: has(name))
db.Query(dqlx.TypeFn("Animal"))         // rootQuery(func: type(Animal))
db.Query(dqlx.EqFn("name", "Ollie"))    // rootQuery(func: eq(name, $0))

// Aliases
db.QueryType("Animal")                  // rootQuery(func: type(Animal))
db.QueryHas("name")                     // rootQuery(func: has(name))
```


## Query Filters

Subsequently, we can apply other filters to our query, in order to narrow down the exact data we are after. 
We do that using the `Filter()` function

```go
db.Query(dqlx.HasFn("name")).
    Filter(
        dqlx.EqFn("name", "Ollie"),
        dqlx.GtFn("age", 3),
    ).
    Filter(dqlx.EqFn("animal", "Cat"))
```

You can either add filters within a single `Filter()` call, or chain multiple `Filter` calls, the result is the same.
All the above filters will be concatenated together with a `AND` condition


#### Sugars on Filters

Instead of using the `Fn` functions within our `Filter` we can use the equivalent of that function as a `Map`.

```go
db.Query(dqlx.HasFn("name")).
	Filter(
		dqlx.Eq{"name": "Ollie", "animal": "Cat"},
		dqlx.Gt{"age": 2},
    )
```

This makes it more elegant to express the same filter type for different fields

## Filtering Connections

So far the filters we've seen till now are always concatenated with an `AND` condition. 
In order to conjunct the filters together with different conditions such as `OR` we do the following.

```go
db.Query(dqlx.HasFn("name")).
	Filter(
        dql.Or{
            dql.And{
                dqlx.Eq{"name": "Ollie", "animal": "Cat"},
                dqlx.Gt{"age": 2},
             },
            dql.And{
                dqlx.Eq{"name": "Leo", "animal": "Cat"},
                dqlx.Gt{"age": 3},
            },
        },
    )
```

which will translate in:

```graphql
query RootQuery($0: string,$1: string,$3: int, $4: string, $5: string, $6: int) {
    rootQuery(func: has(name)) @filter( (eq(name,$0) AND eq(animal,$1) AND gt(age, $3)) OR (eq(name,$4) AND eq(animal,$5) AND gt(age, $6))) {
        
    }
}
```

## Filtering Edges

Filters on edges works the same way, just add the filter functions to your edge

```go
db.Query(dqlx.HasFn("name")).
	Filter(
		dqlx.Eq{"name": "Ollie", "animal": "Cat"},
		dqlx.Gt{"age": 2},
    ).
	Edge("favorite_food", dqlx.Eq{"brand": "Wishcask"})
```

## Functions

### Has

Has function: `HasFn(predicate)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#has)

```go
dqlx.HasFn("name") // as Function
dqlx.Has("name")   // as Function (alias)
```

### Type

Has function: `HasFn(predicate)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#type)

```go
dqlx.TypeFn("name") // as Function
dqlx.Type("name")   // as Function (alias)
```

### Between

Between function: `BetweenFn(predicate, from, to)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#type)

```go
dqlx.BetweenFn("age", 1, 30) // as Function
dqlx.Between("age", 1, 30)   // as Function (alias)
```

### UIDIn

UID function: `UIDFn(predicate)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#type)

```go
dqlx.UIDIn{"name": []string{"Ollie", "Leo"}} // as Map
dqlx.UIDInFn("name", []string{"Ollie", "Leo"}) // as Function
```

### UID

UID function: `UID(predicate, vlaues)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#type)

```go
dqlx.UIDFn("name") // as Function
dqlx.UID("name")   // as Function (alias)
```

### Regexp

Regexp function: `RegexpFn(predicate, pattern)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#type)

```go
dqlx.Regexp{"name": "/pattern/"} // as Map
dqlx.RegexpFn("name", "/pattern/") // as Function
```

### Eq

Eq function: `EqFn(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#equal-to)

```go
dqlx.Eq{ "name": "value" } // as Map
dqlx.EqFn("name", "value") // as Function
```

### Ge

Ge function: `GeFn(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#less-than-less-than-or-equal-to-greater-than-and-greater-than-or-equal-to)

```go
dqlx.Ge{ "name": "value" } // as Map
dqlx.GeFn("name", "value") // as Function
```

### Gt

Gt function: `GtFn(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#less-than-less-than-or-equal-to-greater-than-and-greater-than-or-equal-to)

```go
dqlx.Gt{ "name": "value" } // as Map
dqlx.GtFn("name", "value") // as Function
```

### Le

Le function: `LeFn(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#less-than-less-than-or-equal-to-greater-than-and-greater-than-or-equal-to)

```go
dqlx.Le{ "name": "value" } // as Map
dqlx.LeFn("name", "value") // as Function
```

### Lt

Lt function: `LtFn(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#less-than-less-than-or-equal-to-greater-than-and-greater-than-or-equal-to)

```go
dqlx.Lt{ "name": "value" } // as Map
dqlx.LtFn("name", "value") // as Function
```

### Allofterms

Allofterms function: `AlloftermsFn(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#allofterms)

```go
dqlx.Allofterms{ "name": "value" } // as Map
dqlx.AlloftermsFn("name", "value") // as Function
```

### Anyofterms

Anyofterms function: `Anyofterms(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#anyofterms)

```go
dqlx.Anyofterms{ "name": "value" } // as Map
dqlx.AnyoftermsFn("name", "value") // as Function
```

### Alloftext

Alloftext function: `Alloftext(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#anyofterms)

```go
dqlx.Alloftext{ "name": "value" } // as Map
dqlx.AlloftextFn("name", "value") // as Function
```

### Anyoftext

Anyoftext function: `Anyoftext(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#anyofterms)

```go
dqlx.Anyoftext{ "name": "value" } // as Map
dqlx.AnyoftextFn("name", "value") // as Function
```

### Match

Match function: `Match(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#anyofterms)

```go
dqlx.Match{ "name": "value" } // as Map
dqlx.MatchFn("name", "value") // as Function
```

### Term

Term function: `Term(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#anyofterms)

```go
dqlx.Term{ "name": "value" } // as Map
dqlx.TermFn("name", "value") // as Function
```

### Exact

Exact function: `Exact(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#anyofterms)

```go
dqlx.Exact{ "name": "value" } // as Map
dqlx.ExactFn("name", "value") // as Function
```

### Fulltext

Fulltext function: `Fulltext(predicate, value)` <br />
[Dgraph Doc](https://dgraph.io/docs/query-language/functions/#anyofterms)

```go
dqlx.Fulltext{ "name": "value" } // as Map
dqlx.FulltextFn("name", "value") // as Function
```

### Expr

Expr function: `Expr(predicate)` <br />

The `Expr` allows you to write Raw statement as the value, the variable will not be escape.

```go
dqlx.Eq{ 
	"name": dqlx.Expr("count(animals)"),
}
```

