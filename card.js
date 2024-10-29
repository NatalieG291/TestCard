class ContentCardExample extends HTMLElement {
    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.

    set hass(hass) {
        // Initialize the content if it's not there yet.
        const entityId = this.config.entity;
        const state = hass.states[entityId];
        const stateStr = state ? state.state : "unavailable";
        const friendlyName = state.attributes["friendly_name"] || state.entity_id;

        const runState = state.attributes["run_state"] || state.entity_id;
        const currentCourse = state.attributes["current_course"] || state.entity_id;
        const temp = state.attributes["water_temp"] || state.entity_id;
        const rinse = state.attributes["rinse_mode"] || state.entity_id;
        const spin = state.attributes["spin_speed"] || state.entity_id;
        const pre = state.attributes["pre_wash"] || state.entity_id;
        const dry = state.attributes["dry_level"] || state.entity_id;
        const error = state.attributes["error_state"] || state.entity_id;
        const errorMsg = state.attributes["error_message"] || state.entity_id;
        var errorDesc = '';
        var icon = state.attributes["icon"];
        if (!this.content) {
            this.innerHTML = `
                <ha-card>
                    <div class="main">
                        <ha-icon icon="${icon}"></ha-icon>
                        <div class="off">
                            <div class="estadoOff" style="padding: 5px;">
                                <span style="font: normal normal 20px Roboto,sans-serif !important;">
                                  
                                </span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                    <li style="vertical-align: middle; text-align: center;">
                                        <span></span>
                                    </li>
                                    <li style="vertical-align: middle; text-align: center;">
                                        <span style="font: normal normal 20px Roboto,sans-serif !important;><strong>Apagado</strong></span>
                                    </li>
                                    <li style="vertical-align: middle; text-align: center;">
                                        <span></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="error">
                            <div class="estadoErr" style="padding: 5px;">
                                <span style="font: normal normal 20px Roboto,sans-serif !important;">
                                  Ocurrio un problema
                                </span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                    <li style="vertical-align: middle; text-align: center;">
                                        <span></span>
                                    </li>
                                    <li class="errorMsg" style="vertical-align: middle; text-align: center;">
                                        <span>Codigo de error <strong>${errorMsg}</strong></span>
                                    </li>
                                    <li class="errorDesc" style="vertical-align: middle; text-align: center;">
                                        <span><strong>${errorDesc}</strong></span>
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
            this.querySelector(".off").style.display = 'none';
            this.querySelector(".error").style.display = 'none';
            this.querySelector(".info").style.display = 'block';
            icon = 'mdi:washing-machine';

            if (runState == 'Reposo') {
                this.querySelector(".progress-wrapper span").innerHTML = 'En espera';
                this.querySelector(".remaining span").style.display = 'none';
                this.querySelector(".estado span").innerHTML = runState;
            }
            else {
                this.querySelector(".estado span").innerHTML = 'Ciclo actual <strong>' + currentCourse + '</strong> | ' + runState;
                this.querySelector(".progress").style.width = (totalMinutes - remainMinutes) / totalMinutes * 100 + "%";
                this.querySelector(".progress-wrapper span").innerHTML = Math.round((totalMinutes - remainMinutes) / totalMinutes * 100) + "%";
                this.querySelector(".remaining span").style.display = 'flex';
                this.querySelector(".off").style.display = 'none';
                this.querySelector(".info").style.display = 'block';
            }

            // error
            if (error == 'on')  {
                this.querySelector(".estadoErr span").innerHTML = friendlyName + ' se detuvo por un problema';
                this.querySelector(".error").style.display = 'block';
                this.querySelector(".info").style.display = 'none';
                this.querySelector(".error").style.color = 'white';
                icon = 'mdi:washing-machine-alert';

                // codigos de error
                if (errorMsg == 'IE') {
                    errorDesc = 'La presión de agua no es suficiente, revisa el suministro de agua y que la manguera no esté obstruida.';
                }
                if (errorMsg == '0E') {
                    errorDesc = 'El agua no se esta drenando correctamente o demasiado lento, revisa que la manguera de drenaje no este obstruida o torcida.';
                }
                if (errorMsg == 'UE') {
                    errorDesc = 'hay un error de desequilibrio, la ropa podria estar demasiado humeda o la carga es demasiado pequeña, reorganiza la ropa, quita o agrega peso segun la ropa que estes lavando para equilibrar la carga.';
                }
                if (errorMsg == 'tE') {
                    errorDesc = 'Hay un error de control, llama a soporte tecnico.';
                }
                if (errorMsg == 'LE') {
                    errorDesc = 'El motor esta sobrecargado, espera 30 minutos hasta que el motor se enfrie y luego, reinicia el ciclo.';
                }
                if (errorMsg == 'FE') {
                    errorDesc = 'Hay un error de derrame, la lavadora se esta llenando porque la valvula esta fallando, cierra la llave de agua, desenchufa la lavadora y llama a soporte tecnico.';
                }
                if (errorMsg == 'PE') {
                    errorDesc = 'El sensor de nivel de agua no funciona correctamente, cierra la llave de agua, desenchufa la lavadora y llama a soporte tecnico.';
                }
                if(errorMsg == 'u5') {
                    errorDesc = 'Hay un error en el sensor de vibracion, cierra la llave de agua, desenchufa la lavadora y llama a soporte tecnico.';
                }
                if (errorMsg == 'FF') {
                    errorDesc = 'hay un fallo por congelacion, revisa si la manguera de agua o drenaje se encuentran congeladas, suministra agua caliente en el tambor para descongelar la manguera de drenaje y la bombra de drenaje. Cubre la manguera de drenaje con una toalla humeda y caliente.';
                }
                if (errorMsg == 'AE') {
                    errorDesc = 'hay una fuga de agua, llama a soporte tecnico.';
                }
                if (errorMsg == 'PF') {
                    errorDesc = 'Fallo por corte electrico, inicia nuevamente el ciclo que estabas ejecutando.';
                }
                if (errorMsg == 'dHE') {
                    errorDesc = 'hay un error de secado, llama a soporte tecnico.';
                }
                if (errorMsg == 'dE1') {
                    errorDesc = 'Revisa el cierre correcto de la tapa.';
                }
                if (errorMsg == 'dE') {
                    errorDesc = 'Revisa el cierre correcto de la tapa.';
                }
                if (errorMsg == 'dE2') {
                    errorDesc = 'Revisa el cierre correcto de la tapa.';
                }
                if (errorMsg == 'dE4') {
                    errorDesc = 'Revisa el cierre correcto de la tapa.';
                }

                this.querySelector(".errorMsg span").innerHTML = 'Codigo de error - <strong>' + errorMsg + '</strong>';
                this.querySelector(".errorDesc span").innerHTML = errorDesc;
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

            this.querySelector("ha-icon").style.color = "#c290ff";
        }
        else {
            icon = 'mdi:washing-machine-off';
            this.querySelector(".estado span").innerHTML = '';
            this.querySelector(".temp").innerHTML = '-';
            this.querySelector(".rinse").innerHTML = '-';
            this.querySelector(".spin").innerHTML = '-';
            this.querySelector(".pre").innerHTML = '-';
            this.querySelector(".dry").innerHTML = '-';
            this.querySelector(".remaining span").style.display = 'none';
            this.querySelector("ha-icon").style.color = "#5e467b";
            this.querySelector(".error").style.display = 'none';
            this.querySelector('.info').style.display = 'none';
            this.querySelector(".off").style.display = 'block';
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