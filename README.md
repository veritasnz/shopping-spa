# shopping-spa
A custom built Vanilla-JS shopping-cart SPA.

Very little was used to build this app, as I mainly used this as an excuse to learn vanilla JS and OOP.

Things learnt:
====
- Managing and matching data and DOM is a pain, and creating elements without JSX is also painful

Mistakes (that are too hard to fix this far in):
===
- The Cart class perhaps doesn't adhere to the SRP rule of SOLID
- Matching of DOM and data wasn't considered at the start of the project, and thus isn't handled very well. The build-functions (mainly 'buildItemElement') were created haphazardly don't feel logical
