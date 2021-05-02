---
sidebar_position: 5
---

# Security

In this section we'll learn all about security and helping to understand how to prevent common `DQL injection`
exploit.

## DQL Injection

If you come from a SQL world you might be familiar with the term `SQL Injection`.

DQL Injection is the same beast. Every time a query is dynamically generated (**with dqlx or not**) strings gets concatenated together to create the final query.

The problem arise when your queries are generated based on `User Inputs`. If you are exposing inputs that gets **directly mapped** into a query,
the "Exploiter" might figure out a way to send an input which might alter the original query that you originally meant to run. 

This mean that the "Exploiter" might be able to request more data than he supposed to, or even worst it could delete or alter important information.


### dqlx at rescue

dqlx takes security as one of the reasons for this library to also exists. <br />
By default **dqlx** will use [GraphQL Query Variables](https://dgraph.io/docs/query-language/graphql-variables/) for every filters that accept a value and wherever it is allowed to from the DQL language.

For instance when you write a query that looks like this:

```go
query, variables, err := db.Query(dqlx.HasFn("name")).
	Fields(`
        uid
        name
        animal
    `).
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
    .ToDQL()
```

All the **values** that are assigned to those filters will be replaced by a variable, thus making it `DQL Injection free`

```graphql
query RootQuery($0: string,$1: string,$3: int, $4: string, $5: string, $6: int) {
    rootQuery(func: has(name)) @filter( (eq(name,$0) AND eq(animal,$1) AND gt(age, $3)) OR (eq(name,$4) AND eq(animal,$5) AND gt(age, $6))) {
        uid
        name
        animal
    }
}
```

### Be Careful!
As mentioned above **dqlx** will automatically escape **everything it can**. <br />
Unfortunately we cannot replace **every part** of the query that might receive a user input, as it will be syntactically incorrect to execute.

For instance, if we do like below, it works! But, we are not in a good place.

```go
fieldsFromUser := strings.Split(req.Params("fields"), ",")

db.Query(dqlx.HasFn("name")).
    Fields(fieldsFromUser...)

// or don't do this

fieldName := req.Params("fieldName")
db.Query(dqlx.HasFn(fieldName))

// or don't do this
field := req.Params("fieldName")
value := req.Params("value")

db.Query(dqlx.HasFn("name")).
    Filter(dqxl.EqFn(field, value))
```

This could all seem pretty legitimate use cases, and indeed they are; 
However, we cannot escape the predicates part of the query for it to be syntactically correct. <br />

Those example above will expose `DQL Injection`

### What shall I do?

If you need to make the above example secure and `DQL Injection free` 

1. **YOU MUST VALIDATE USER INPUTS** before any use

As an example, imagine we allow users to request what fields our query should select. <br/>
We must validate that each of the field requested it's an OK value to be used.

```go
fieldsFromUser := strings.Split(req.Params("fields"), ",")

allowedFields := []string{"uid", "name", "animal"}

for _, field := range fieldsFromUser {
	isAllowed := false
	for _, allowedField := range allowedFields {
		if field == allowedField {
		    isAllowed = true
		    break
        }   
    }

    if !isAllowed {
        panic("You shall not pass!")	
    }
}

db.Query(dqlx.HasFn("name")).
    Fields(fieldsFromUser...)
```
<br /> 

2. **UNDERSTAND IF THE VALUE WILL BE ESCAPED**

Only **values** on **filters** will be escaped with variables. <br />
When you use a filter function check the documentation, it usually accepts 2 parameters, `predicate` and `value`.
The `value` will be escaped but **not** the `predicate`

To know for certain if the value will be automatically escaped,
you can call the `ToDQL()` method on a query and print the result.

```go
query, variables, err := db.Query(dqlx.HasFn("name")).
    Fields(fieldsFromUser...).
	ToDQL()

print(query)
```

<br />

3. **SECURITY CHECKLIST**

This checklist that helps to make sure to be on right track on security, if all your answers are **YES**, your probability of being safe are extraordinary high.

- I'm not trusting the user
- I run validation on the user input
- I am not using **unvalidated** data coming from an external system (ex: database)
- I have not used the function `Expr` without validating the user input
- I printed the statement using `ToDQL()` when I'm uncertain what values are escaped

#### Extremely safe scenarios

- I'm hard coding parameters
- I'm conditionally building a query
- Parameters are only coming from the program internal data structures (no external data involved)


## Reporting Vulnerabilities

In case of a security vulnerability contact me directly via email at: fabri.feno@gmail.com

All security vulnerabilities will be promptly addressed