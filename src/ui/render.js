export function showError(errorMessageEl, message) {
  errorMessageEl.textContent = message;
  errorMessageEl.classList.remove("hidden");
}

export function hideError(errorMessageEl) {
  errorMessageEl.classList.add("hidden");
}

export function setLoading({ loader, generateBtn }, isLoading) {
  if (isLoading) {
    loader.classList.remove("hidden");
    generateBtn.disabled = true;
    generateBtn.classList.add("btn-disabled");
    return;
  }

  loader.classList.add("hidden");
  generateBtn.disabled = false;
  generateBtn.classList.remove("btn-disabled");
}

export function resetResults({ resultsContainer, downloadContainer, loader }) {
  resultsContainer.classList.add("hidden");
  resultsContainer.innerHTML = "";
  downloadContainer.classList.add("hidden");
  loader.classList.add("hidden");
}

export function renderResults({ resultsContainer, downloadContainer }, data) {
  resultsContainer.innerHTML = "";
  if (!data || data.length === 0) {
    resultsContainer.classList.add("hidden");
    downloadContainer.classList.add("hidden");
    return false;
  }

  data.forEach((event, index) => {
    const eventCard = `
      <div class="result-card" style="animation-delay: ${index * 100}ms">
        <h3 class="result-title">${event.summary}</h3>
        <div class="result-meta">
          <div class="result-row">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="result-icon start"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="result-label">Start</span>
            <span class="result-value">${new Date(
              event.dtstart
            ).toLocaleString()} <span class="result-timezone">(${event.start_timezone})</span></span>
          </div>
          <div class="result-row">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="result-icon end"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="result-label">End</span>
            <span class="result-value">${new Date(
              event.dtend
            ).toLocaleString()} <span class="result-timezone">(${event.end_timezone})</span></span>
          </div>
          <div class="result-row">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="result-icon location"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="result-label">Place</span>
            <span class="result-value">${event.location}</span>
          </div>
          <div class="result-desc">${event.description}</div>
        </div>
      </div>
    `;
    resultsContainer.innerHTML += eventCard;
  });

  resultsContainer.classList.remove("hidden");
  downloadContainer.classList.remove("hidden");
  return true;
}
