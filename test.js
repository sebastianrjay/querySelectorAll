'use strict';

var testsPassed = 0;

var testResults = {
  A: $("div"),
  B: $("img.some_class"),
  C: $("#some_id"),
  D: $(".some_class"),
  E: $("input#some_id"),
  F: $("div#some_id.some_class"),
  G: $("div.some_class#some_id"),
  H: $("div.some_class.some_other_class#some_id"),
  I: $("div.some_class#some_id .nested_span"),
  J: $("div.some_class#some_id > .nested_p"),
  K: $("div.some_class#some_id .yet_another_class #icon"),
  L: $("div.some_class#some_id .nested_p.yet_another_class i"),
  M: $("#some_id > #icon"),
  N: $("#some_id > .nested_span > .nested_a > .image"),
  O: $("#some_id .nested_a > img"),
  P: $("#some_id > .nested_span img"),
  Q: $("div, #some_id > .nested_span img"),
  R: $("div.some_class#some_id .nested_p, #some_id > .nested_span img"),
  S: $(".some_class, p.yet_another_class > i"),
  T: $("")
};

var expectedResults = {
  A: {
    DIV: 2
  },
  B: {
    IMG: 1
  },
  C: {
    DIV: 1
  },
  D: {
    DIV: 1,
    IMG: 1
  },
  E: {
  },
  F: {
    DIV: 1
  },
  G: {
    DIV: 1
  },
  H: {
    DIV: 1
  },
  I: {
    SPAN: 1
  },
  J: {
    P: 1
  },
  K: {
    I: 1
  },
  L: {
    I: 1
  },
  M: {
  },
  N: {
    IMG: 1
  },
  O: {
    IMG: 1
  },
  P: {
    IMG: 1
  },
  Q: {
    DIV: 2,
    IMG: 1
  },
  R: {
    P: 1,
    IMG: 1
  },
  S: {
    DIV: 1,
    I: 1,
    IMG: 1
  },
  T: {
  }
};

var createTestOutputString = function(result) {
  var tagCountsArray = [], count;

  ["A", "DIV", "I", "IMG", "P", "S"].forEach(function(tagName) {
    count = result[tagName] || 0;

    tagCountsArray.push(count + " " + tagName);
  });

  return tagCountsArray.join(", ");
};

var runTests = function() {
  for (var testLetter in testResults){
    var foundTagCounts = {};

    testResults[testLetter].forEach(function(foundHTMLElement) {
      var foundTagName = foundHTMLElement.tagName;
      if (foundTagCounts[foundTagName]) foundTagCounts[foundTagName]++;
      else foundTagCounts[foundTagName] = 1;
    });

    var expectedResult = createTestOutputString(expectedResults[testLetter]);
    var foundResult = createTestOutputString(foundTagCounts);
    var thisTestPassed = (expectedResult === foundResult) ? "Yes" : "No";

    if (thisTestPassed === "Yes") testsPassed++;

    console.log("\n------------------------\n\nAnswer", testLetter);
    console.log("Expected:", expectedResult);
    console.log("Found:", foundResult);
    console.log("Correct:", thisTestPassed);
  }
};

var testQuerySelectorAll = function() {
  runTests();

  console.log("\n------------------------\n\nTests Passed:", testsPassed, "of", 
    Object.keys(expectedResults).length ); 
};
