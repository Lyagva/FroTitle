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

function setModuleID(id) {
    MODULE_ID = id;
}

function attach_animation_function(id, func) {
    ATTACHED_ANIMATION[id] = func;
}

function attach_field_function(id, func) {
    ATTACHED_FIELDS[id] = func;
}
function attach_property_function(id, func) {
    ATTACHED_PROPERTIES[id] = func;
}