function waitForElm(selector, childList = true, subtree = true) {
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
      attributes: true,
      childList: childList,
      subtree: subtree
    });
  });
}

function addWarningMessage() {
  console.log("LoanDeskA : " + loanDesk);

  if (loanDesk !== true) {
    console.log("Ajout message averitissement");
    const checkoutNode = document.querySelector("div#CheckoutItem");
    checkoutNode.innerHTML += "<div class='checkout-warning'>Attention, vous êtes sur un bureau de <strong>consultation sur place</strong>. N'oubliez pas de repasser en prêt/retour pour des transactions classiques.</div>";
  } else {
    console.log("Pas de message averitissement car loandesk KO");
  }
}

const observer = new MutationObserver(list => {
  bodyId = document.body.id;
  console.log("Affichage page : " + bodyId);
  console.log("LoanDeskZ : " + loanDesk);

  if (bodyId == "body_id_xml_file_loan.fulfillment_discharge_item.xml") {
    addWarningMessage();
  } else if (bodyId == "body_id_xml_file_loan.fulfillment_patron_workspace_loan_new_ui.xml") {
    addWarningMessage();
  }
});

observer.observe(document.body, { attributes: true, childList: false, subtree: false, characterData: false });

function checkPlace(locationNode) {
  // Remove all div.checkout-warning
  document.querySelectorAll('div.checkout-warning').forEach(e => e.remove());
  
  const header = document.querySelector("div.main-layout-navHeader");
  const text = locationNode.textContent;
  if (text.includes("sur place")) {
    header.classList.add("main-menu_warning");
    loanDesk = false;
    addWarningMessage();
    console.log("LoanDeskB : " + loanDesk);
  } else {
    header.classList.remove("main-menu_warning");
    loanDesk = true;
    console.log("LoanDeskC : " + loanDesk);
  }
}

waitForElm('span.location-pinable-menu-text-container').then((elm) => {
  const locationNode = document.querySelector("span.location-pinable-menu-text-container").querySelector("span");
  checkPlace(locationNode);
  
  const observer = new MutationObserver(list => {
    checkPlace(locationNode);
  });
  observer.observe(locationNode, { attributes: false, childList: true, subtree: true, characterData: true });
});