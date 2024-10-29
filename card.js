class ContentCardExample extends HTMLElement {
    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.

    set hass(hass) {
        // Initialize the content if it's not there yet.
        const entityId = this.config.entity;
        const state = hass.states[entityId];
        const stateStr = state ? state.state : "unavailable";

        const runState = state.attributes["run_state"] || state.entity_id;
        const currentCourse = state.attributes["current_course"] || state.entity_id;
        const temp = state.attributes["water_temp"] || state.entity_id;
        const rinse = state.attributes["rinse_mode"] || state.entity_id;
        const spin = state.attributes["spin_speed"] || state.entity_id;
        const pre = state.attributes["pre_wash"] || state.entity_id;
        const dry = state.attributes["dry_level"] || state.entity_id;
        const error = state.attributes["error_state"] || state.entity_id;
        const icon = state.attributes["icon"];
        if (!this.content) {
            this.innerHTML = `
                <ha-card>
                    <div class="main">
                        <ha-icon icon="${icon}"></ha-icon>
                        <div class="error">
                            <div class="estado" style="padding: 5px;">
                                <span style="font: normal normal 20px Roboto,sans-serif !important;">
                                  Ocurrio un problema
                                </span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                    <li style="vertical-align: middle; text-align: center;">
                                        <ha-icon icon="mdi:washing-machine-alert"></ha-icon>
                                    </li>
                                    <li style="vertical-align: middle; text-align: center;">
                                        Codigo de error <strong>${error}</strong>
                                    </li>
                                    <li class="temp" style="vertical-align: middle; text-align: center;">
                                        <span><strong>descripcion del error</strong></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="info">
                            <div class="estado" style="padding: 5px;">
                                <span style="font: normal normal 20px Roboto,sans-serif !important;">
                                  Ciclo actual <strong>${state.attributes["current_course"]}</strong> | ${state.attributes["run_state"]}
                                </span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                    <li style="vertical-align: middle; text-align: center;">
                                        <ha-icon icon="mdi:water-thermometer"></ha-icon>
                                    </li>
                                    <li style="vertical-align: middle; text-align: center;">
                                        Temperatura
                                    </li>
                                    <li class="temp" style="vertical-align: middle; text-align: center;">
                                        <span><strong>${temp}</strong></span>
                                    </li>
                                </ul>
                                <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                    <li style="vertical-align: middle; text-align: center;">
                                        <ha-icon icon="mdi:waves"></ha-icon>
                                    </li>
                                    <li style="vertical-align: middle; text-align: center;">
                                        Enjuague
                                    </li>
                                    <li class="rinse" style="vertical-align: middle; text-align: center;">
                                        <span><strong>${rinse}</strong></span>
                                    </li>
                                </ul>
                                <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                    <li style="vertical-align: middle; text-align: center;">
                                        <ha-icon icon="mdi:weather-hurricane"></ha-icon>
                                    </li>
                                    <li style="vertical-align: middle; text-align: center;">
                                        Centrifugado
                                    </li>
                                    <li class="spin" style="vertical-align: middle; text-align: center;">
                                        <span><strong>${spin}</strong></span>
                                    </li>
                                </ul>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                    <li style="vertical-align: middle; text-align: center;">
                                        <ha-icon icon="mdi:water-opacity"></ha-icon>
                                    </li>
                                    <li style="vertical-align: middle; text-align: center;">
                                        Pre-Lavado
                                    </li>
                                    <li class="pre" style="vertical-align: middle; text-align: center;">
                                        <span><strong>${pre}</strong></span>
                                    </li>
                                </ul>
                                <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                    <li style="vertical-align: middle; text-align: center;">
                                        <ha-icon icon="mdi:sun-clock"></ha-icon>
                                    </li>
                                    <li style="vertical-align: middle; text-align: center;">
                                        Secado
                                    </li>
                                    <li class="dry" style="vertical-align: middle; text-align: center;">
                                        <span><strong>${dry}</strong></span>
                                    </li>
                                </ul>
                            </div>
                            <div class="progress-wrapper" style="height: 20px; width: 100%; border-radius: 10px 10px 10px 10px;">
                                <div class="progress" style="display: inline-block; height: 20px; border-radius: 10px 10px 10px 10px;">
                                </div>
                                <span style="color: #FFFFFF; position: absolute; right: 33%;"></span>
                            </div>
                            <div class="remaining" style="display: flex; align-items: center; justify-content: center;">
                                <span><strong>${state.attributes["remain_time"]}</strong> para terminar</span>
                            </div>
                        </div>
                    </div>
                </ha-card>
            `;
            this.querySelector(".main").style.display = "grid";
            this.querySelector(".main").style.gridTemplateColumns = "33% 64%";
            this.querySelector("ha-icon").style.setProperty("--mdc-icon-size", "95%");
        }
        if (state.state == "on") {
            const totalTime = state.attributes["initial_time"];
            const remainTime = state.attributes["remain_time"];
            const totalMinutes = (parseInt(totalTime.split(":")[0]) * 60) + parseInt(totalTime.split(":")[1]);
            const remainMinutes = (parseInt(remainTime.split(":")[0]) * 60) + parseInt(remainTime.split(":")[1]);
            this.querySelector(".progress-wrapper").style.backgroundColor = "#5e467b";
            this.querySelector(".progress").style.backgroundColor = "#c290ff";
            this.querySelector(".estado span").innerHTML = 'Ciclo actual <strong>' + currentCourse + '</strong> | ' + runState;
            // error
            if (error == 'OK') {
                this.querySelector("error").style.display = 'none';
                this.querySelector("info").style.display = 'block';
            }
            else {
                this.querySelector("error").style.display = 'block';
                this.querySelector("info").style.display = 'none';
                this.querySelector("error").style.color = 'white';
            }
            // temp water
            if (temp == 'Sin seleccionar') {
                this.querySelector(".temp span").innerHTML = '-';
            }
            else {
                this.querySelector(".temp span").innerHTML = '<strong>' + temp + '</strong>';
            }
            // rinse mode
            if (rinse == 'Sin seleccionar') {
                this.querySelector(".rinse span").innerHTML = '-';
            }
            else {
                this.querySelector(".rinse span").innerHTML = '<strong>' + rinse + '</strong>';
            }
            // spin speed
            if (spin == 'Sin seleccionar') {
                this.querySelector(".spin span").innerHTML = '-';
            }
            else {
                this.querySelector(".spin span").innerHTML = '<strong>' + spin + '</strong>';
            }
            // pre wash
            if (pre == 'off') {
                this.querySelector(".pre span").innerHTML = '-';
            }
            else {
                this.querySelector(".pre span").innerHTML = '<strong>' + pre + '</strong>';
            }
            // dry level
            if (dry == 'Sin seleccionar') {
                this.querySelector(".dry span").innerHTML = '-';
            }
            else {
                this.querySelector(".dry span").innerHTML = '<strong>' + dry + '</strong>';
            }

            if (runState == 'Reposo') {
                this.querySelector(".progress-wrapper span").innerHTML = 'En espera';
                this.querySelector(".remaining span").style.display = 'none';
            }
            else {
                this.querySelector(".progress").style.width = (totalMinutes - remainMinutes) / totalMinutes * 100 + "%";
                this.querySelector(".progress-wrapper span").innerHTML = Math.round((totalMinutes - remainMinutes) / totalMinutes * 100) + "%";
                this.querySelector(".remaining span").style.display = 'flex';
            }

            this.querySelector("ha-icon").style.color = "#c290ff";
        }
        else {
            this.querySelector(".estado span").innerHTML = 'Apagado';
            this.querySelector(".temp").innerHTML = '-';
            this.querySelector(".rinse").innerHTML = '-';
            this.querySelector(".spin").innerHTML = '-';
            this.querySelector(".pre").innerHTML = '-';
            this.querySelector(".dry").innerHTML = '-';
            this.querySelector(".remaining span").style.display = 'none';
            this.querySelector("ha-icon").style.color = "#5e467b";
            this.querySelector("error").style.display = 'none';
            this.querySelector('info').style.display = 'block';
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