class ContentCardExample extends HTMLElement {
    constructor() {
        super();
        this.previousState = null;
        this.previousAttributes = {};
        this.elementRefs = {};
    }

    set hass(hass) {
        const entityId = this.config.entity;
        const state = hass.states[entityId];
        
        if (!state) return;

        // Verifica si realmente cambió algo
        if (this.hasStateChanged(state)) {
            // Solo inicializa si no existe el DOM
            if (!this.elementRefs.main) {
                this.initializeDOM(state);
            }
            
            // Actualiza solo lo que cambió
            this.updateCard(state);
            this.previousState = state.state;
            this.previousAttributes = { ...state.attributes };
        }
    }

    hasStateChanged(state) {
        if (!this.previousState || this.previousState !== state.state) {
            return true;
        }
        
        // Verifica cambios en atributos críticos
        const criticalAttrs = ['run_state', 'current_course', 'error_state', 'remain_time', 'initial_time'];
        return criticalAttrs.some(attr => 
            this.previousAttributes[attr] !== state.attributes[attr]
        );
    }

    initializeDOM(state) {
        const icon = state.attributes["icon"] || "mdi:washing-machine";
        
        this.innerHTML = `
            <ha-card style="background: rgba(51,40,77,0.3) !important; backdrop-filter: blur(5px);">
                <div class="main" style="display: grid; grid-template-columns: 33% 64%;">
                    <ha-icon icon="${icon}"></ha-icon>
                    
                    <div class="off" style="display: none;">
                        <div class="estadoOff" style="padding: 5px;">
                            <span style="font: normal normal 20px Roboto,sans-serif !important;"></span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                <li style="vertical-align: middle; text-align: center;"><span></span></li>
                                <li style="vertical-align: middle; text-align: center;">
                                    <span style="font: normal normal 20px Roboto,sans-serif !important;"><strong>Apagado</strong></span>
                                </li>
                                <li style="vertical-align: middle; text-align: center;"><span></span></li>
                            </ul>
                        </div>
                    </div>

                    <div class="error" style="display: none; color: white;">
                        <div class="estadoErr" style="padding: 5px;">
                            <span style="font: normal normal 20px Roboto,sans-serif !important;">Ocurrio un problema</span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                <li style="vertical-align: middle; text-align: center;"><span></span></li>
                                <li class="errorMsg" style="vertical-align: middle; text-align: center;">
                                    <span>Codigo de error <strong></strong></span>
                                </li>
                                <li class="errorDesc" style="vertical-align: middle; text-align: center;">
                                    <span><strong></strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="info" style="display: none;">
                        <div class="estado" style="padding: 5px;">
                            <span style="font: normal normal 20px Roboto,sans-serif !important;">
                                Ciclo actual <strong></strong> | <span class="runStateSpan"></span>
                            </span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                <li style="vertical-align: middle; text-align: center;">
                                    <ha-icon icon="mdi:water-thermometer"></ha-icon>
                                </li>
                                <li style="vertical-align: middle; text-align: center;">Temperatura</li>
                                <li class="temp" style="vertical-align: middle; text-align: center;"><span></span></li>
                            </ul>
                            <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                <li style="vertical-align: middle; text-align: center;">
                                    <ha-icon icon="mdi:waves"></ha-icon>
                                </li>
                                <li style="vertical-align: middle; text-align: center;">Enjuague</li>
                                <li class="rinse" style="vertical-align: middle; text-align: center;"><span></span></li>
                            </ul>
                            <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                <li style="vertical-align: middle; text-align: center;">
                                    <ha-icon icon="mdi:weather-hurricane"></ha-icon>
                                </li>
                                <li style="vertical-align: middle; text-align: center;">Centrifugado</li>
                                <li class="spin" style="vertical-align: middle; text-align: center;"><span></span></li>
                            </ul>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                <li style="vertical-align: middle; text-align: center;">
                                    <ha-icon icon="mdi:water-opacity"></ha-icon>
                                </li>
                                <li style="vertical-align: middle; text-align: center;">Pre-Lavado</li>
                                <li class="pre" style="vertical-align: middle; text-align: center;"><span></span></li>
                            </ul>
                            <ul style="list-style: none; align-items: center; margin: 0; padding: 5px;">
                                <li style="vertical-align: middle; text-align: center;">
                                    <ha-icon icon="mdi:sun-clock"></ha-icon>
                                </li>
                                <li style="vertical-align: middle; text-align: center;">Secado</li>
                                <li class="dry" style="vertical-align: middle; text-align: center;"><span></span></li>
                            </ul>
                        </div>
                        <div class="progress-wrapper" style="height: 20px; width: 100%; border-radius: 10px; position: relative;">
                            <div class="progress" style="display: inline-block; height: 20px; border-radius: 10px;"></div>
                            <span style="color: #FFFFFF; position: absolute; right: 33%;"></span>
                        </div>
                        <div class="remaining" style="display: flex; align-items: center; justify-content: center;">
                            <span><strong></strong> para terminar</span>
                        </div>
                    </div>
                </div>
            </ha-card>
        `;

        // Cache de referencias
        this.elementRefs = {
            main: this.querySelector(".main"),
            icon: this.querySelector("ha-icon"),
            off: this.querySelector(".off"),
            error: this.querySelector(".error"),
            info: this.querySelector(".info"),
            estado: this.querySelector(".estado span"),
            errorMsg: this.querySelector(".errorMsg strong"),
            errorDesc: this.querySelector(".errorDesc strong"),
            temp: this.querySelector(".temp span"),
            rinse: this.querySelector(".rinse span"),
            spin: this.querySelector(".spin span"),
            pre: this.querySelector(".pre span"),
            dry: this.querySelector(".dry span"),
            progress: this.querySelector(".progress"),
            progressWrapper: this.querySelector(".progress-wrapper"),
            progressText: this.querySelector(".progress-wrapper span"),
            remaining: this.querySelector(".remaining span"),
            runStateSpan: this.querySelector(".runStateSpan"),
            currentCourseSpan: this.querySelector(".estado strong"),
            errorMsgCode: this.querySelector(".errorMsg strong"),
        };
    }

    updateCard(state) {
        const stateStr = state.state;
        const friendlyName = state.attributes["friendly_name"] || state.entity_id;
        const runState = state.attributes["run_state"] || "";
        const currentCourse = state.attributes["current_course"] || "";
        const temp = state.attributes["water_temp"] || "";
        const rinse = state.attributes["rinse_mode"] || "";
        const spin = state.attributes["spin_speed"] || "";
        const pre = state.attributes["pre_wash"] || "";
        const dry = state.attributes["dry_level"] || "";
        const error = state.attributes["error_state"] || "";
        const errorMsg = state.attributes["error_message"] || "";

        if (stateStr === "on") {
            this.updateOnState(state, friendlyName, runState, currentCourse, temp, rinse, spin, pre, dry, error, errorMsg);
        } else {
            this.updateOffState();
        }
    }

    updateOnState(state, friendlyName, runState, currentCourse, temp, rinse, spin, pre, dry, error, errorMsg) {
        this.elementRefs.off.style.display = 'none';
        this.elementRefs.icon.style.color = "#c290ff";
        this.elementRefs.icon.setAttribute('icon', 'mdi:washing-machine');

        if (error === 'on') {
            this.elementRefs.error.style.display = 'block';
            this.elementRefs.info.style.display = 'none';
            this.elementRefs.icon.setAttribute('icon', 'mdi:washing-machine-alert');
            this.elementRefs.errorMsg.textContent = `${friendlyName} se detuvo por un problema`;
            this.elementRefs.errorDesc.textContent = this.getErrorDescription(errorMsg);
            this.elementRefs.errorMsgCode.textContent = errorMsg;
        } else {
            this.elementRefs.error.style.display = 'none';
            this.elementRefs.info.style.display = 'block';

            if (runState === 'Reposo') {
                this.elementRefs.progressText.textContent = 'En espera';
                this.elementRefs.estado.innerHTML = `Ciclo actual <strong>${currentCourse}</strong> | ${runState}`;
                this.elementRefs.remaining.style.display = 'none';
            } else {
                const totalTime = state.attributes["initial_time"] || "0:0";
                const remainTime = state.attributes["remain_time"] || "0:0";
                const totalMinutes = this.timeToMinutes(totalTime);
                const remainMinutes = this.timeToMinutes(remainTime);
                const progress = (totalMinutes - remainMinutes) / totalMinutes * 100;

                this.elementRefs.progress.style.width = progress + "%";
                this.elementRefs.progressText.textContent = Math.round(progress) + "%";
                this.elementRefs.estado.innerHTML = `Ciclo actual <strong>${currentCourse}</strong> | ${runState}`;
                this.elementRefs.remaining.innerHTML = `<strong>${remainTime}</strong> para terminar`;
                this.elementRefs.remaining.style.display = 'flex';
            }

            // Actualiza valores dinámicos
            this.updateAttributeDisplay('temp', temp, 'Sin seleccionar');
            this.updateAttributeDisplay('rinse', rinse, 'Sin seleccionar');
            this.updateAttributeDisplay('spin', spin, 'Sin seleccionar');
            this.updateAttributeDisplay('pre', pre, 'off');
            this.updateAttributeDisplay('dry', dry, 'Sin seleccionar');

            this.elementRefs.progressWrapper.style.backgroundColor = "#5e467b";
            this.elementRefs.progress.style.backgroundColor = "#c290ff";
        }
    }

    updateOffState() {
        this.elementRefs.info.style.display = 'none';
        this.elementRefs.error.style.display = 'none';
        this.elementRefs.off.style.display = 'block';
        this.elementRefs.icon.style.color = "#5e467b";
        this.elementRefs.icon.setAttribute('icon', 'mdi:washing-machine-off');
        
        // Limpia valores
        this.elementRefs.temp.textContent = '-';
        this.elementRefs.rinse.textContent = '-';
        this.elementRefs.spin.textContent = '-';
        this.elementRefs.pre.textContent = '-';
        this.elementRefs.dry.textContent = '-';
        this.elementRefs.remaining.style.display = 'none';
    }

    updateAttributeDisplay(className, value, skipValue) {
        const element = this.elementRefs[className];
        if (value === skipValue || value === '') {
            element.textContent = '-';
        } else {
            element.textContent = value;
        }
    }

    timeToMinutes(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return 0;
        const parts = timeStr.split(':');
        return (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
    }

    getErrorDescription(errorMsg) {
        const errorMap = {
            'IE': 'La presión de agua no es suficiente, revisa el suministro de agua y que la manguera no esté obstruida.',
            '0E': 'El agua no se esta drenando correctamente o demasiado lento, revisa que la manguera de drenaje no este obstruida o torcida.',
            'UE': 'Hay un error de desequilibrio, la ropa podria estar demasiado humeda o la carga es demasiado pequeña, reorganiza la ropa.',
            'tE': 'Hay un error de control, llama a soporte tecnico.',
            'LE': 'El motor esta sobrecargado, espera 30 minutos hasta que el motor se enfrie y luego, reinicia el ciclo.',
            'FE': 'Hay un error de derrame, la lavadora se esta llenando porque la valvula esta fallando, desenchufa la lavadora y llama a soporte tecnico.',
            'PE': 'El sensor de nivel de agua no funciona correctamente, desenchufa la lavadora y llama a soporte tecnico.',
            'u5': 'Hay un error en el sensor de vibracion, desenchufa la lavadora y llama a soporte tecnico.',
            'FF': 'Hay un fallo por congelacion, revisa si la manguera de agua o drenaje se encuentran congeladas.',
            'AE': 'Hay una fuga de agua, llama a soporte tecnico.',
            'PF': 'Fallo por corte electrico, inicia nuevamente el ciclo que estabas ejecutando.',
            'dHE': 'Hay un error de secado, llama a soporte tecnico.',
            'dE1': 'Revisa el cierre correcto de la tapa.',
            'dE': 'Revisa el cierre correcto de la tapa.',
            'dE2': 'Revisa el cierre correcto de la tapa.',
            'dE4': 'Revisa el cierre correcto de la tapa.',
        };
        return errorMap[errorMsg] || 'Error desconocido';
    }

    static getConfigElement() {
        return document.createElement("content-card-editor");
    }

    static getStubConfig() {
        return { entity: "sun.sun" };
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error("You need to define an entity");
        }
        this.config = config;
    }

    getCardSize() {
        return 3;
    }

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
    preview: false,
    description: "A custom card made by me!",
    documentationURL: "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card",
});
