[![npm version](https://badge.fury.io/js/heroku-orgs.svg)](http://badge.fury.io/js/heroku-orgs)

Heroku Orgs Plugin for Heroku Toolbelt 4.0
===========

Read more about Toolbelt 4.0 plugins [here](https://github.com/heroku/heroku-hello-world#heroku-hello-world).


How to install this plugin
-------------------

**Note: These Node.js plugins are available in the current Ruby CLI. No need to download a separate Toolbelt 4.0 CLI.**

```
$ heroku plugins:install heroku-orgs
```

New available commands
-------------------


### [Using App Privileges in Heroku Organizaions](https://devcenter.heroku.com/articles/app-privileges-beta-in-heroku-organizations)

```bash
$ heroku access --app APP_NAME
```

*e.g. (personal app):*

```bash
$ heroku access --app atleti
ortega@atleti.com       collaborator
simeone@atleti.com      owner
```

*e.g. (org app):*

```bash
$ heroku access --app atleti
monoburgos@atleti.com   member
ortega@atleti.com       collaborator
simeone@atleti.com      admin
```

*e.g. (org app with new beta feature):*

```bash
$ heroku access --app atleti
monoburgos@atleti.com   deploy,operate,view
ortega@atleti.com       operate,view
simeone@atleti.com      deploy,manage,operate,view
```

#### Adding new collaborators


```bash
$ heroku access:add user@email.com --app APP
```


```bash
$ heroku access:add user@email.com --app APP --privileges deploy,manage,view,operate
```

#### Updating privileges

```bash
$ heroku access:update user@email.com --app APP --privileges deploy,manage,view,operate # This feature is in BETA
```

#### Removing collaborators

```bash
$ heroku access:remove user@email.com --app APP
```

Other commands that have been revisited
-------------------

Bear in mind that the addition of `_` at the beginning of each one of these is intended. Once you install this plugin, these other commands will coexist with the ones that are provided by the [Heroku CLI](https://github.com/heroku/heroku). These have been revisited with the intention of keep iterating on them. If you have any feedback, please [submit an issue](https://github.com/raulb/heroku-orgs/issues/new).


```bash
$ heroku _apps # alias to `heroku apps --personal`
aqueous-hollows-5902
circuit
blooming-spire-4703
gistdeck
```

```bash
$ heroku _apps -x # alias to `heroku apps --personal -x`
aqueous-hollows-5902        owner
circuit                     collaborator      email@domain.com
blooming-spire-4703         owner
gistdeck                    collaborator      another@domain.com
plog-raulb                  owner
```

```bash
$ heroku _apps --org ORG
agile-atoll-4414
ancient-scrubland-7277
nameless-scrubland-2032
```

```bash
$ heroku _apps --all
agile-atoll-4414
ancient-scrubland-7277
aqueous-hollows-5902
blooming-spire-4703
nameless-scrubland-2032
```

```bash
$ heroku apps --all -x
agile-atoll-4414           org        org-name-1
ancient-scrubland-7277     org        org-name-1
aqueous-hollows-5902       personal   email@domain.com
blooming-spire-4703        personal   another@domain.com
circuit                    org        org-name-2
nameless-scrubland-2032    personal   another@domain.com
```

```bash
$ heroku _orgs
org-name-1      admin
org-name-2      collaborator
org-name-3      admin
org-name-4      collaborator
org-name-5      collaborator
org-name-6      member
org-name-7      collaborator
org-name-8      member
org-name-9      admin
org-name-10     collaborator
```
