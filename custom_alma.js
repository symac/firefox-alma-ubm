function waitForElm(selector) {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              observer.disconnect();
              resolve(document.querySelector(selector));
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}
  
waitForElm('span.location-pinable-menu-text-container').then((elm) => {
  const header = document.querySelector("div.main-layout-navHeader");
  const locationNode = document.querySelector("span.location-pinable-menu-text-container").querySelector("span");
  /* console.log(location);
  const node = document.evaluate(
    "//span[contains(@class, 'location-pinable-menu-text-container')]/span",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
    ).singleNodeValue;
    */
    function checkPlace(locationNode) {
      const text = locationNode.textContent;
      if (text.includes("sur place")) { 
        header.classList.add("main-menu_warning");
      } else {
        header.classList.remove("main-menu_warning");
      }
    }
    const observer = new MutationObserver(list => {
      checkPlace(locationNode);
    });
    observer.observe(locationNode, {attributes: false, childList: true, subtree: true, characterData: true});
});