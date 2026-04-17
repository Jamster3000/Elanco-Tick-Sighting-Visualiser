# Foundation / Persistence
- Need the accessability settings to use localstorage to save the settings allowing these changes to persist between page refreshes/reloads

# Accessibility Settings (new/fixes)
- reduce animation accessibility setting? Reduces transitions and animations in CSS (should be added?) - (@media (prefers-reduced-motion: reduce) {
this is apparently a real media query allowing us to change how motion/animations are used)
- Look into font families changing size. They currently change font size due to x-height and cap height and is natural for font families to have different sizes at the same rem/px size. There are two suitable solutions I've seen to this: 

# Option 1
More modern but might not be so easy?

```
@font-face {
    font-family: 'OpenDyslexic';
    size-adjust: 85%;
}
```

Use something like this to say how much the font size adjusts based on the font.

# Option 2
Write some predefined sizes each font is adjusted by (easier but not modern or standard practice)

I've never done this with font families before so this is all I've found out.

- Do we need a small font size? Perhaps the default website font size should be considered "small" and instead have a medieum that's between default size and the current large size.
- Setting text size to large in accessability pushes certain elements out of the users view port (dynamic resizing to fit the page still?)
- Can the map's pin change colour to match colour blind mode.

# Colour / Dark Mode
- account dropdown also doesn't use darkmode
- Map's search bar, zoom in/out, pin message ("you clicked in X"), and the charts in the popups aren't using darkmode at all.
- Tick history borders don't change to match the color blind colour (assuming that it doesn't use var in CSS for colours?)

# Font Family Propagation (elements not picking up font family)
- The postcode search button and placeholder text doesn't use the font family. Email and full name placeholder don't use the font family either.
- Charts don't reflect the usage of the different font families. Can they use font families?
- Map pin message "You cliked in X" doesn't use the accessability text size. Same for search bar and search button
- sidebar in tick history also doesn't use text size accessability

# Z-index / Layering
- The accessability popup doesn't appear on top of the map sidebar (it should. z-index wrong?)
- The chart popups on the map X closs button hasn't got the correct styles anymore (but still functional)

# Layout / Responsiveness
- Go through all pages and fix mobile responsiveness
- sidebar on map page has a scrollbar with large text.
- Tick history page has a vertical scrollbar.
- About page gets too large and some elementws get pushed off view port when set to large text.
- If possible, change tick history sidebar back to what it was before as that was better than what it is now.

# Bug Fixes
- For some reason, it's possible to click logout and manage account links whilst signed in, whilst the dropdown isn't visible.

# Keyboard & Screen Reader Accessibility
- CHECK THAT THE WEBSITE CAN BE USED BY JUST MOUSE (minus actual text input) AND THE WEBSITE CAN 100% BE FULLY USED WITH JUST THE KEYBOARD ALONE (keyboard navigation)
- Add a "skip to content" link and make sure it's the very first focasable element on each page. This allows keyboards and screen readers to easily skip repeated navigation.
- Make sure that all icons, buttons, search, accessability settings, dropdowns, and other interactable elements have aria-label="accessibility options" or whatever describes the element is in a short few words.
