'use strict';

var $, querySelectorAll;

$ = querySelectorAll = function (selector) {
  var allMatchingElements = [];

  var individualCSSQueries = splitSelectorBySubstring(selector, ',');

  individualCSSQueries.forEach(function(subSelector) {

  	allMatchingElements = allMatchingElements.concat(
  		findCSSQueryMatches(subSelector)
  	);
  });

  return allMatchingElements;
};

var findCSSQueryMatches = function(selector) {
	var previouslyMatchingElements = [document.body], currentMatchingElements;
	var directDescendantSelectors = splitSelectorBySubstring(selector, '>');

  directDescendantSelectors.forEach(function(directDescendantSelector, i) {
  	var nestedSelectors = directDescendantSelector.split(' ');

	  nestedSelectors.forEach(function(nestedSelector, j) {
	  	currentMatchingElements = [];

	  	if(i === 0) {
	  		searchDOMSubtreeOfEachPreviousMatch(nestedSelector, 
	  			previouslyMatchingElements, currentMatchingElements);
	  	} else {
	  		if(j === 0) {
	  			searchChildrenOfEachPreviousMatch(nestedSelector, 
	  				previouslyMatchingElements, currentMatchingElements);
	  		} else {
	  			searchDOMSubtreeOfEachPreviousMatch(nestedSelector, 
	  				previouslyMatchingElements, currentMatchingElements);
	  		}  		
	  	}	

	  	previouslyMatchingElements = currentMatchingElements.slice();
	  });
  });

  return currentMatchingElements || [];
};

var breadthFirstDOMTraversal = function(rootElement, callback) {
	var unvisitedNodes = [], currentChild, currentNode;
	unvisitedNodes.push(rootElement);

	while(unvisitedNodes.length) {
	  currentNode = unvisitedNodes.shift();
	  callback(currentNode);

	  for(var i = 0; i < currentNode.childNodes.length; i++) {
	    currentChild = currentNode.childNodes[i];

	    if(!~unvisitedNodes.indexOf(currentChild)) {
	      unvisitedNodes.push(currentChild);
	    }
	  }
	}
};

var matchesNonWhitespacedSelector = function(element, selector) {
	if(!element.classList || typeof element.id === 'undefined') return false;

	var selectorParameters = selector.replace(/[^\w]/g, ' $&').trim().split(' ');

	return selectorParameters.filter(function(selectorParameter) {
		return !matchesSelectorParameter(element, selectorParameter);
	}).length === 0;
};

var matchesSelectorParameter = function(element, selector) {
	var selectorText = selector.slice(1);

	switch(selector[0]) {
		case '#':
			return element.id === selectorText;
			break;
		case '.':
			return ~[].slice.call(element.classList).indexOf(selectorText);
			break;
		default:
			return element.tagName === selector.toUpperCase();
	}
};

var searchChildrenOfEachPreviousMatch =
	function(nestedSelector, previouslyMatchingElements, currentMatchingElements) {
		previouslyMatchingElements.forEach(function(previousMatch) {

			for(var i = 0; i < previousMatch.childNodes.length; i++) {
				var childElement = previousMatch.childNodes[i];

				if(matchesNonWhitespacedSelector(childElement, nestedSelector)) {
					currentMatchingElements.push(childElement);
				}
			}
		});
	};

var searchDOMSubtreeOfEachPreviousMatch =
	function(nestedSelector, previouslyMatchingElements, currentMatchingElements) {
		previouslyMatchingElements.forEach(function(previousMatch) {

			breadthFirstDOMTraversal(previousMatch, function(childElement) {

				if(matchesNonWhitespacedSelector(childElement, nestedSelector)) {
					currentMatchingElements.push(childElement);
				}
			});
		});
	};

var splitSelectorBySubstring = function(selector, subString) {
	return selector.split(subString).map(function(subSelector) {
  	return subSelector.trim();
  });
};
