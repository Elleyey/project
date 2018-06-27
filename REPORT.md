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
- In window.onload:

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

### Netherlands.HTML

- In window onload:

  - getData (makeBar, makeLine, makeMultiline)

  *Puts the data in the right format, calls makeBar (default NL 2012), calls makeLine (static one of home burglary rates from 2012 to 2017), calls makeMultiLine (makes four lines in one graph).*

  - makeBar (makeLineBar);

  *Makes a bar chart with the data from Dutch trust rates in 2012. When a bar is clicked, another line chart appears in the (single) line chart.*

  - makeLine

  *Makes a line chart with home burglary rates over the years.*

  - makeMultiLine

  *Makes four lines in one barchart, that can be switched on and off (through HTML code and function further in code), also have a reference to another article.*

  - makeLineBar

  *Makes the line, when clicked on a specific bar in the barchart, a line shows in the single line graph.*

- Outside window onload:

  - hideLine

  *Hides the line clicked on by checkboxes in HTML by users.*

  - CheckBucket

  *Gives color to barchart.*


## Challenges

**Data**
> It took me a lot of days (almost two weeks) to get the data in the right format, and in the end I still had to reformat it a lot (especially in the Netherlands javascript). I think if I had some more time I would've been able to work with the dataset as I originally made them. The problem was that I needed some variables out of the data for for example the barchart and the line connected to the barchart.

**Scatterplot**
> I wanted to make a scatterplot in the beginning, but chose not to in the end. The data I collected only contained six different years - and all the data clustered around the same area.

**Update Functions**
> Implemented the update functions for Europe only in the last weeks. Should have done this earlier - but did not know how, so just started on working on the graphs. Appeared to be easier than expected. But still didn't figure out how to do this for the line chart that appears when clicked on a bar in the Netherlands javascript..

**Language**
> Just assumed the project had to be done in English, and started in English (although my proposal was in Dutch so don't know how and when it changed in my head?). Did not realize I could do it in Dutch untill a few days ago - when it was a bit to late. Not just for README, REPORT, PROCESS etc. but also for the site. The site is half focussed on the Netherlands, and the introduction video is in Dutch, as is the report referred to in the Netherlands page. Should have thought about this better.

## Decisions

I decided to skip the scatterplot as it would not give any extra information about the data, and was not really representative with just six data points. Also replaced the slide bar with years for a button with years, as a slide bar would be to easy to move around and the barchart and datamaps would change the whole time which would not be a nice design choice. It was easier to make the graphs than expected, it was harder to implement interactive elements. It was also difficult for me to work with the different kinds of data. To be able to start to work with the data used in the javascript Netherlands page, I rearranged the data, which was a trade of in my javascript. If I had more time I would thus try to make this dataformat better in the first place.
