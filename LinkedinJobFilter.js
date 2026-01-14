// ==UserScript==
// @name         Linkedin Search Filter
// @namespace    http://tampermonkey.net/
// @version      2026-01-12
// @description  Block job listings from certain companies from showing up.  Update the BLOCKED_COMPANIES List to use for your results
// @author       Joel Meyer
// @match        https://www.linkedin.com/jobs/search-results/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const BLOCKED_COMPANIES = [
        'Acme Transport',
        'Acme Oil',
    ];

   function removeBlockedJobs(root = document) {
  root.querySelectorAll('p').forEach(p => {
    const text = p.textContent;

    if (BLOCKED_COMPANIES.some(name => text.includes(name))) {
      const card = p.closest('[data-view-name="job-search-job-card"]');  //Linkedin may change this but works as of 01/14/2026.
      if (card) card.remove();
    }
  });
}

// Initial cleanup
removeBlockedJobs();

// Watch for new jobs being added
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        removeBlockedJobs(node);
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});


})();
