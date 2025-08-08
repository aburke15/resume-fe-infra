class VisitCounter {
  constructor() {
    this.counterElement = document.getElementById("visit-counter");
    this.storageKey = "page-visit-count";
    this.azureFunctionUrl = null; // Will be set when Azure Function is ready
    this.init();
  }

  init() {
    this.updateCounter();
    this.incrementVisit();
  }

  getVisitCount() {
    if (this.azureFunctionUrl) {
      // do something, aka get count from azure function
      return;
    }

    const stored = localStorage.getItem(this.storageKey);
    return stored ? parseInt(stored, 10) : 0;
  }

  setVisitCount(count) {
    if (this.azureFunctionUrl) {
      // await this.sendToAzureFunction(count);
      return;
    }

    localStorage.setItem(this.storageKey, count.toString());
  }

  updateCounter() {
    const count = this.getVisitCount();
    this.counterElement.textContent = count.toLocaleString();
  }

  incrementVisit() {
    const currentCount = this.getVisitCount();
    const newCount = currentCount + 1;

    this.setVisitCount(newCount);
    this.updateCounter();
  }

  async sendToAzureFunction(count) {
    // TODO: Replace with actual Azure Function URL when ready
    if (this.azureFunctionUrl) {
      try {
        const response = await fetch(this.azureFunctionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitCount: count,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        });

        if (response.ok) {
          console.log("Visit count sent to Azure Function successfully");
        } else {
          console.warn("Failed to send visit count to Azure Function");
        }
      } catch (error) {
        console.error("Error sending visit count to Azure Function:", error);
      }
    }
  }
}

// Initialize visit counter when page loads
document.addEventListener("DOMContentLoaded", () => {
  window.visitCounter = new VisitCounter();
});
