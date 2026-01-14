// ==UserScript==
// @name         Linkedin Search Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Block job listings from certain companies from showing up
// @author       Joel Meyer
// @match        https://www.linkedin.com/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const BLOCKED_COMPANIES = [
        'ACME OIL',
        'ACME RUBBER',
    ];

    const DISMISSED_TEXT = "We won’t show you this job again";

    function removeBlockedJobs(root = document) {
       root.querySelectorAll('p').forEach(p => {
           const text = p.textContent;

           if (BLOCKED_COMPANIES.some(name => text.includes(name))) {
               const card = p.closest('[data-view-name="job-search-job-card"]');  //Linkedin regular search
               if (card) card.remove();
           }
       });

       root.querySelectorAll('.artdeco-entity-lockup__subtitle span')  //Linkedin Recommend jobs
           .forEach(span => {
           const company = span.textContent.trim();

           if (BLOCKED_COMPANIES.includes(company))
               span.closest('.job-card-container')?.remove();

       });
   }

    function removeDismissedJobs(root = document) {
        root.querySelectorAll('*').forEach(el => {
            if (el.textContent?.includes(DISMISSED_TEXT)) {
                const card = el.closest('.job-card-container');
                if (card) {
                    card.remove();
                }
            }
        });
    }


// Initial cleanup
removeBlockedJobs();
removeDismissedJobs();

// Watch for new jobs being added
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        removeBlockedJobs(node);
        removeDismissedJobs(node);
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});


})();
