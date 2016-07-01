---
title: Faq
related:
  doc: ['features']
---

## How is the name written?

Update, with a capital "U", the rest lowercase. `updatefile.js` is all lowercase, no capital letters.


<a name="aliases">
## Aliases

**What's an updater's alias, and what do they do?**

Update tries to find globally installed updaters using an "alias" first, falling back on the updater's full name if not found by its alias.

An updater's alias is created by stripping the substring `updater-` from the _full name_ of updater. Thus, when publishing an updater the naming convention `updater-foo` should be used (where `foo` is the alias, and `updater-foo` is the full name).

Note that **no dots may be used in published updater names**. Aside from that, any characters considered valid by npm are fine.
