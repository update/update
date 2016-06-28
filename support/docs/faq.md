# FAQ

<a name="aliases">

**What's an alias, and what do they do?**

Update tries to find globally installed updaters using an "alias" first, falling back on the updater's full name if not found by its alias.

A updater's alias is created by stripping the substring `update-` from the _full name_ of updater. Thus, when publishing a updater the naming convention `update-foo` should be used (where `foo` is the alias, and `update-foo` is the full name).

Note that **no dots may be used in published updater names**. Aside from that, any characters considered valid by npm are fine.