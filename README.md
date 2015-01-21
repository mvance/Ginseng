# Ginseng

Ginseng is a web app for learning things with flashcards and spaced repetition. Think Anki, but different. Hosted on [eatginseng.com](http://www.eatginseng.com/).

- 100% in browser client-side Javascript, built with [React](http://facebook.github.io/react/)
- Data stored in single JSON file. Can be synced over Dropbox or saved in browser storage
- Freedom over review intervals. Not bound to "difficulty"
- No fixed "deck" structure. Dynamic profiles for grouping reviews
- Native Markdown and LaTeX support for content and templates

## How it works
The thing you want to learn/memorize is called an **info**. An info can contain two or more **entries** and any number of tags. If you learn Spanish, the entries could be the Spanish and spanish expression. Infos have a **type** which defines the number of entries as well as the **templates** which are used to display the info in the review mode.

### Templates
A template maps an info to a front and back side of a virtual flashcard. In the example case, the front and back could show the english and spanish word. The templates as well as the info entries are written in [Markdown](http://en.wikipedia.org/wiki/Markdown). In the templates, info entries can be accessed with curly braces, like `{country}`. The templates as well as the entries can contain [LaTeX](http://en.wikipedia.org/wiki/LaTeX) code between single dollar signs.

![](https://github.com/s9w/Ginseng/raw/master/doc/simple_example.png)

There can be more than one template per type, for example if you also want to test the reverse relation. Or you might want to include a note entry that gets displayed alongside. Templates can have to a condition for generating cards. An example could be a reverse template that will only be generated if an info has a "reverse" tag. The syntax is described [below](#filter-syntax).

![](https://github.com/s9w/Ginseng/raw/master/doc/conditional_templates.png)

### Review
During review, you have the choice between *setting* an interval, or *changing* the previous. For example setting "5h" would mean that in 5 hours, that review would become due again. Most of the time you'll probably want to change the previous interval. There are relative increases in percent or fixed time amounts.

Clicking an interval selection will "select" it and mark it green. Click the same selection again to confirm. That way you can quickly apply an interval choice with a double click.

Note that the last interval is calculated as the actual time between the last review and now, NOT when the review would have been due. That's intentional as I feel that's what really counts.

Each generated flashcard has a "**dueness**" based on the selected interval and the time since the last review. Right after reviewing, the dueness is 0. It increases linearly with time, reaching 1.0 at the time of it's designated interval. By default, that's when reviews are "due" and are displayed. It will continue to increase if it's not reviewed (and become "overdue" if you want to call it that). The reviews are sorted from most to least due cards.

### Profiles
With a growing collection of infos, more control over the reviews is helpful - that's what review **profile**s are for. They filter the generated flashcards by tags, creation date or type of their infos with the syntax described below. Profiles can also filter by dueness: A profile with a "due threshold" of less than 1.0 will show cards that are not due yet. That can be used as a "cramming mode" if you want, or .

![](https://github.com/s9w/Ginseng/raw/master/doc/profiles.png)

### Filter syntax
- Infos can be filtered by their tags. `tag: math` matches all infos that have a `math` tag. This is case-sensitive and a precise match, so it will neither match a `Math` nor a `mathematics` tag.
- Filtering by the creation date of the info is also possible: `createdBefore: 2015-01-01` matches infos that are created before 2015. The format should be something [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601). See [here](http://momentjs.com/docs/#/parsing/string/) for technical details.
- Types can also be filtered. `type: "Languages"` matches infos with of type "Language". Note that this requires quotes around the type as whitespace is probably common in type names.
- Filter queries can be logically combined with Javascript Syntax. So `||` means "or", `&&` means and. Negations can be done with `!` and feel free to go wild with brackets. For example, `tag: math || tag: physics` matches all infos with either a math or a physics tag. And `!(tag: french) || tag: important` matches everything but french... unless it's important (tag-wise).
- These filters can be applied to the templates as well as review profiles!

## The Science
Ginseng is designed around some solid findings from cognitive psychology.

It's much more efficient to try to recall an information without access to the solution than trying to memorize it while staring at it - that's called the [testing effect](http://en.wikipedia.org/wiki/Testing_effect). The hidden back side is what makes flashcard practice so efficient.

The learning can also vastly be improved by distributing it over many separate session rather than doing it all in one - that's called the [spacing effect](http://en.wikipedia.org/wiki/Spacing_effect). This effect is especially big when the intervals increase each time. The exact timings of the intervals are tricky though, and the conditions of the studies are rarely met in practice. That's why there's such a fine grained control over the review interval: Just set the interval you feel is right.

The brain also likes to [link](http://gocognitive.net/interviews/effect-context-memory) information to location and other contextual factors. So things you know in the library might be "gone" during an exam. The page is therefore a web app, designed to work well on mobile devices and with dropbox sync to be accessable everywhere and from every computer with a web browser.

## Philosophy / Goals
Ginseng and the underlying data format are designed to be as open and robust as possible
- All data is saved in a straightforward human-readable (and therefore hackable) [JSON file](https://raw.githubusercontent.com/s9w/Ginseng/master/init_data.js).
- The formatting of the infos and templates is done in Markdown and LaTeX. Currently [marked](https://github.com/chjj/marked) is used for Markdown and [MathJax](https://github.com/mathjax/mathjax) for LaTeX rendering as they seem to be the fastest choice.
- Dates/times are saved in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601).

## Plans / issues
- Write an Anki importer?