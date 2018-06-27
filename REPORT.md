## Description of application

Inspired by Jan Terlouw his speech about the decreasing trust and by politicians stating that the Netherlands are a becomming narco-state, I decided to make a data visualization about these two subjects. On one hand I wanted to show how trust rates are really increasing in the Neterlands, on the other how crime rates are actually decreasing. This to show that it is always important to fact-check!

- SCREENSHOT

## Description of technical design

The website works with three different HTML pages.
Index.html, Europe.html and Netherlands.html - they all use the same CSS file. Index.html does not use any javascript. Europe.html and Netherlands.html have their own javascript files.

I intended to make six visualizations, but dropped one (the scatterplot). I will later return to why I made this choice.

### Europe.HTML

Uses datamaps to show map of Europe. Barchart is always shown. Map of Europe gets updated by button with years - as does barchart.

Functions used:  
- In window.onload
  - getData (filterMap, makeMap, makeBars)
  *gets the Data in the right format and calls basic functions needed for starting page.*
  - filterMap(onChange, filterData, updateMap, updateBars)
  *filters the map onChange of the button, calls updateMap and updateBars accordingly*
  - makeMap (filterData, updateBars)
  *makes the map, uses the global given variables of selected country and selected ISO (default on Netherlands)*
  - makeBars (checkBucket)
  *makes the bars with Netherlands 2002 as default. CheckBucket used to give color to bars.*

- Outside window.onload:
  - checkBucket
  *gives color to value, according to scale used*
  - updateMap
  *updates colors of the map*
  - updateBars
  *updates the values of the bar*
  - filterData
  *need to filter some variables from the data, like fill key and country or year, done by this function*



    Clearly describe challenges that your have met during development. Document all important changes that your have made with regard to your design document (from the PROCESS.md). Here, we can see how much you have learned in the past month.

    Defend your decisions by writing an argument of a most a single paragraph. Why was it good to do it different than you thought before? Are there trade-offs for your current solution? In an ideal world, given much more time, would you choose another solution?

    Make sure the document is complete and reflects the final state of the application. The document will be an important part of your grade.
