# Database

## Coll: Subjects

    name: <string> <unique>
    password: <string>
    desc: <string>

## Coll: Objects

    name: <string> <unique>
    desc: <string>
    access: {c: {name: {grantors: [<subject name>], cgrantors: [<subject name>]} }, r: {...}, w: {...}, x: {...} }

The grantor will be stored in grantors[]. If the subject can control this right, the grantor will also be stored in cgrantors[].

# Operations

## New subject: function Subject (name, password, desc)

Add the subject to the database.

**Make sure the name is unique**

## New object: Subject.prototype.newObject (name, desc)

Add a new object to the database, and the subject who added it gains all right.

    obj.access = {
      c: {"subject1": {cgrantors: ["root"] } },
      r: {"subject1": {cgrantors: ["root"] } },
      w: {"subject1": {cgrantors: ["root"] } },
      x: {"subject1": {cgrantors: ["root"] } }
    }

**Make sure the name is unique**

## Login: Subject.prototype.auth ()

Upon login, a Subject object is created and auth() is called.

## Grant: Subject.prototype.grant (subject, object, right, giveC)

First assert `object.access[right][this][cgrantors].length > 0`

Then `object.access[right][subject][givec? "cgrantors": "grantors"].push(subject)`

## Recind: Subject.prototype.recind (subject, object, right, recindC)

First assert `object.access[right][this][cgrantors].length > 0`

Then remove this.name from cgrantors or grantors array depending on recindC

Finally if all grantors are removed, do `object.access[right][this] = null`

## Remove: Subject.prototype.remove (object)

First assert `typeof object.access['c'][this] !== 'undefined'`

## Read: Subject.prototype.read (object)

Assert `typeof object.access['r'][this] !== 'undefined'`

Then return object.desc

## Write: Subject.prototype.write (object, newDesc)

Assert `typeof object.access['w'][this] !== 'undefined'`

Then `object.desc = newDesc`