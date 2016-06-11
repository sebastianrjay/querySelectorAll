# About

Have you ever wondered how document.querySelectorAll(someCSSString) works?

Wonder no more! This repository provides a JavaScript implementation of it, 
which I tested exhaustively on an HTML document with various nested tags.

The querySelectorAll function in this repository is compatible with CSS queries 
specifying ID's (e.g. '#some-id'), class names (e.g. '.some-class-name'), HTML 
tag selectors (e.g. 'div'), space-separated descendant element selectors (e.g. 
'div span.logo i'), direct descendant selectors (e.g. 'a.signup-link > img'), 
and any combination of the above (e.g. '#main .content-container > img.cat').

NOTE: Browsers may implement document.querySelectorAll in C or Java instead of 
JavaScript. However, the underlying algorithm is the same.

# Description

One line of code is worth one thousand words, but here's an explanation of the 
algorithm:

1. The CSS query parser separates the CSS by commas, into separate DOM search 
queries that will each return a subset of all returned HTML elements.
2. Each comma-separated query is separated by the direct descendant selector, ">".
3. Each direct descendant selector-separated query is separated by the space 
(" ") selector, i.e. the "any descendant" selector.
4. Iterating over each non-whitespace-separated CSS selector, the algorithm 
checks each element in the current set of matches for descendants comprising the 
next set of matches. Before each iteration, the set of currently matching 
elements is defined as empty. After each iteration, the set of previously 
matching elements becomes the set of currently matching elements.
5. If the non-whitespace-separated CSS selector follows the direct descendant 
selector ('>'), then only the children of the current matching elements are 
considered in the search for the next set of matching elements. If the 
non-whitespace-separated CSS selector does not follow a direct descendant 
selector (i.e. it only follows a space), then the algorithm searches the DOM 
subtree of each current matching element for the new set of matches, via 
breadth-first search.
6. The algorithm compares an HTML element to a non-whitespace-separated CSS 
selector by splitting the non-whitespace-separated selector by non-word 
characters and then comparing each resulting string to the relevant attribute of 
the HTML element (i.e. its tag name, id or class name).
