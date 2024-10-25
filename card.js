class ContentCardExample extends HTMLElement {
    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.

    set hass(hass) {
        // Initialize the content if it's not there yet.
        const entityId = this.config.entity;
        const state = hass.states[entityId];
        const stateStr = state ? state.state : "unavailable";

        const friendlyName = state.attributes["friendly_name"] || state.entity_id;
        const icon = state.attributes["icon"];
        if (!this.content) {
            this.innerHTML = `
                <ha-card header="${friendlyName}">
                    <ha-icon icon="${icon}"></ha-icon>
                    <div class="card-content">
                        El estado de ${entityId} es ${stateStr}!
                        <div class="progress-wrapper" style="height: 20px; width: 100%; border-radius: 10px 10px 10px 10px;">
                            <div class="progress" style="display: inline-block; height: 20px; border-radius: 10px 10px 10px 10px;">
                            </div>
                            <span style="color: #FFFFFF; position: absolute; right: 33%;">50%</span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span><strong>${state.attributes["remain_time"]}</strong> para terminar</span>
                        </div>
                    </div>
                </ha-card>
            `;
            this.content = this.querySelector("div");
            this.querySelector("ha-icon").style.setProperty("--mdc-icon-size", "50%");
        }
        if (state.state == "on") {
            const totalTime = state.attributes["initial_time"];
            const remainTime = state.attributes["remain_time"];
            const totalMinutes = (parseInt(totalTime.split(":")[0]) * 60) + parseInt(totalTime.split(":")[1]);
            const remainMinutes = (parseInt(remainTime.split(":")[0]) * 60) + parseInt(remainTime.split(":")[1]);
            this.querySelector(".progress-wrapper").style.backgroundColor = "#5e467b";
            this.querySelector(".progress").style.backgroundColor = "#c290ff";
            this.querySelector(".progress").style.width = (totalMinutes - remainMinutes) / totalMinutes * 100 + "%";
            this.querySelector(".progress-wrapper span").innerHTML = Math.round((totalMinutes - remainMinutes) / totalMinutes * 100) + "%";
            this.querySelector("ha-icon").style.color = "#c290ff";
        }
        else {
            this.querySelector("ha-icon").style.color = "#5e467b";
        }

        //this.content.innerHTML = ``;
    }
    static getConfigElement() {
        return document.createElement("content-card-editor");
    }
    static getStubConfig() {
        return { entity: "sun.sun" }
    }
    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config) {
        if (!config.entity) {
            throw new Error("You need to define an entity");
        }
        this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns in masonry view
    getCardSize() {
        return 3;
    }

    // The rules for sizing your card in the grid in sections view
    getLayoutOptions() {
        return {
            grid_rows: 3,
            grid_columns: 2,
            grid_min_rows: 3,
            grid_max_rows: 3,
        };
    }
}

customElements.define("content-card-example", ContentCardExample);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "content-card-example",
    name: "Content Card",
    preview: false, // Optional - defaults to false
    description: "A custom card made by me!", // Optional
    documentationURL:
        "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card", // Adds a help link in the frontend card editor
});