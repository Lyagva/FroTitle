const socket = io("http://localhost:5000");

MODULE_ID = "";
ATTACHED_ANIMATION = {};
ATTACHED_FIELDS = {};
ATTACHED_PROPERTIES = {};

socket.on("triggerAnimation", (data) => {
    if (data.moduleId !== MODULE_ID) return;

    for (var id in ATTACHED_ANIMATION) {
        if (id === data.id) {
            ATTACHED_ANIMATION[id]();
        }
    }
})

socket.on("updateField", (data) => {
    if (data.moduleId !== MODULE_ID) return;

    for (var id in ATTACHED_FIELDS) {
        if (id === data.id) {
            ATTACHED_FIELDS[id](data.value);
        }
    }
})

socket.on("updateProperty", (data) => {
    if (data.moduleId !== MODULE_ID) return;

    for (var id in ATTACHED_PROPERTIES) {
        if (id === data.id) {
            ATTACHED_PROPERTIES[id](data.value);
        }
    }
})

let CONFIG = {};
let CONFIG_LOADED = false;
let CONFIG_WAITERS = [];

async function loadConfig(id) {
    return new Promise((resolve, reject) => {
        $.getJSON(`http://localhost:5000/modules/${id}/static/module.json`, function (data) {
            CONFIG = data;
            CONFIG_LOADED = true;

            // Execute queued attach_field_function calls
            for (let fn of CONFIG_WAITERS) {
                fn();
            }
            CONFIG_WAITERS = [];

            resolve();
        }).fail(reject);
    });
}


function setModuleID(id) {
    MODULE_ID = id;
    loadConfig(id);
}

function attach_animation_function(id, func) {
    ATTACHED_ANIMATION[id] = func;
}

function attach_field_function(id, func) {
    ATTACHED_FIELDS[id] = func;
    const doAttach = () => {
        let field = CONFIG.fields.find(field => field.id === id);
        if (field) {
            func(field.default);
        }
    };

    if (!CONFIG_LOADED) {
        CONFIG_WAITERS.push(doAttach); // Defer until config is loaded
    } else {
        doAttach();
    }
}

function attach_property_function(id, func) {
    ATTACHED_PROPERTIES[id] = func;
    const doAttach = () => {
        let property = CONFIG.properties.find(property => property.id === id);
        if (property) {
            func(property.default);
        }
    };

    if (!CONFIG_LOADED) {
        CONFIG_WAITERS.push(doAttach); // Defer until config is loaded
    } else {
        doAttach();
    }
}
