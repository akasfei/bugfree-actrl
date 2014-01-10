# Database

## Class User (DB coll Users)

    name: <string> <unique>
    password: <string>
    desc: <string>
    roles: [<role name:string>]

### Methods

0. auth()
0. createSession(rolename)

* createSession() require `user.roles.indexOf(rolename) >= 0`

## Class Role (DB coll Roles)

    name: <string> <unique>
    desc: <string>
    extends: [<inherited from superior roles:string>]
    conflicts: [<conflicting roles:string>]

### Methods

0. create(name, desc)
0. read(object)
0. write(object, desc)
0. remove(object)

* create() require Role extends root
* read(), write(), remove() require `typeof obj.access[perm][rolename] !== 'undefined'`

## Class Root

### Methods

0. grant(object, role, perm)
0. recind(object, role, perm)
0. newRole(name, desc, extends)
0. removeRole(name)
0. bindRole(user, role)
0. unbindRole(user, role)
0. roleExtend(role, srole)
0. roleReduce(role, srole)

## Class Object

    name: <string> <unique>
    desc: <string>
    access: {
        c: {},
        r: {},
        w: {},
        x: {}
    }