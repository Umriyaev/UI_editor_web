/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var uiEditor = uiEditor || {};

//namespace for UI editor app
uiEditor.mainApp = uiEditor.mainApp || {};
var ns = uiEditor.mainApp;
ns.startX, ns.startY;
ns.idSpecifier = new uiEditor.helpers.IdSpecifier();
ns.isDrawing = false;
ns.currentDrawingComponent = {"panel": null, "component": null};
ns.w, ns.h, ns.x, ns.y, ns.c, ns.ctx;
ns.components = new Map();
ns.movingComponent = null;
ns.alteringComponent = {"panel": null, "component": null};
ns.chosenComponentType = null;
ns.moveX = null, ns.moveY = null;
ns.drawingPanel = undefined;
ns.destinationPanel = undefined;
ns.movingChildComponent = {"panel": null, "component": null};
ns.displayCreated = false;
ns.sizeCreated = false;
ns.selection = null;
/*  startX, startY - initial coordinates where the drawing of component is started
 * idSpecifier - class which sets ids of newly created components
 * isDrawing - true if we are drawing new component
 * w,h,x,y - width, height, posX and posY of the currently being drawn component
 * ctx - canvas context
 * components - array of all the components
 * movingComponent - if we started moving component, it will point to that component
 * chosenComponentType - type of component to draw
 * drawingPanel - panel on which we are drawing. If drawing panel is undefined, then we draw on canvas
 * destinationPanel - panel on which we are moving the component
 * movingChildComponent - component, which is being moved from inside of panel
 * displayCreated and sizeCreated - there should be only one copy of them. therefore we need these properties*/

/*Chosen component might be
 * text
 * button
 * display
 * panel
 * image
 * null*/


//constants
ns.G_BUTTON = 71;
ns.U_BUTTON = 85;
ns.DELETE_BUTTON = 46;
ns.ESC_BUTTON = 27;
ns.INITIAL_WIDTH = 0;
ns.INITIAL_HEIGHT = 0;
ns.MINIMUM_WIDTH = 50;
ns.MINIMUM_HEIGHT = 50;


//properties for constructing properties panel based on the type of component
ns.properties = {
    "image": [
        {"name": "xPosition", "type": "number"},
        {"name": "yPosition", "type": "number"},
        {"name": "width", "type": "number"},
        {"name": "height", "type": "number"},
        {"name": "image url", "type": "file"}
    ],
    "button": [
        {"name": "xPosition", "type": "number"},
        {"name": "yPosition", "type": "number"},
        {"name": "width", "type": "number"},
        {"name": "height", "type": "number"},
        {"name": "text", "type": "text"}
    ],
    "text": [
        {"name": "xPosition", "type": "number"},
        {"name": "yPosition", "type": "number"},
        {"name": "width", "type": "number"},
        {"name": "height", "type": "number"},
        {"name": "placeholder text", "type": "text"}
    ],
    "display": [
        {"name": "xPosition", "type": "number"},
        {"name": "yPosition", "type": "number"},
        {"name": "width", "type": "number"},
        {"name": "height", "type": "number"},
        {"name": "rows", "type": "number"},
        {"name": "cols", "type": "number"}
    ],
    "panel": [
        {"name": "xPosition", "type": "number"},
        {"name": "yPosition", "type": "number"},
        {"name": "width", "type": "number"},
        {"name": "height", "type": "number"},
        {"name": "headerText", "type": "text"}
    ],
    "screenControl": [
        {"name": "xPosition", "type": "number"},
        {"name": "yPosition", "type": "number"},
        {"name": "width", "type": "number"},
        {"name": "height", "type": "number"},
        {"name": "sizes", "type": "promptDialog"}
    ],
    "source": [
        {"name": "xPosition", "type": "number"},
        {"name": "yPosition", "type": "number"},
        {"name": "width", "type": "number"},
        {"name": "height", "type": "number"},
        {"name": "text", "type": "text"},
        {"name": "source", "type": "text"}
    ],
    "selection": [
        {"name": "width", "type": "number"},
        {"name": "height", "type": "number"}
    ],
    "group": []
};

ns.componentSizes = {
    "image": {"width": 300, "height": 200},
    "button": {"width": 140, "height": 60},
    "text": {"width": 300, "height": 60},
    "panel": {"width": 500, "height": 400},
    "display": {"width": 600, "height": 200},
    "screenControl": {"width": 300, "height": 60},
    "source": {"width": 140, "height": 60}
};

//initial setting of event handlers
ns.init = function () {
    Notify.init({
        "selector": ".bb-alert"
    });

    ns.c = document.getElementById("myCanvas");
    ns.ctx = ns.c.getContext("2d");
    ns.c.addEventListener("mousedown", function (e) {
        ns.draw(e);
    }, false);

    $(window).resize(ns.respondResize);
    ns.respondResize();
    ns.c.addEventListener("mousemove", function (e) {
        ns.mouseMove(e);
    }, false);
    ns.c.addEventListener("mouseup", function (e) {
        ns.mouseUp(e);
    }, false);
    ns.c.addEventListener('contextmenu', ns.contextMenuHandler, false);
    window.addEventListener("keydown", ns.keyPressHandler, false);


    /***********************test*********************************/
    //var testComponent = ns.createComponent("button", 500, 500);
    //  testComponent.component.setText(".");
    //  ns.components.set(testComponent.id, testComponent.component);
    // ns.drawRectangles();
    /************************************************************/
};


ns.respondResize = function () {
    ns.c.width = $(".canvasPanel").width();
    ns.c.height = $(".canvasPanel").height();
    ns.drawRectangles();
}


ns.contextMenuHandler = function (e) {
    console.log('You tried to call context menu');
    console.log(e);
    e.preventDefault();
};

ns.deleteComponent = function () {
    var deleteScreenObjectComponents = false;
    if (ns.alteringComponent.component) {

        if (ns.alteringComponent.component == "selection") {
            ns.selection.deleteSelection(ns.components);
            ns.selection = null;
        }

        else if (ns.alteringComponent.panel) {
            var component = ns.components.get(ns.alteringComponent.panel).getChild(ns.alteringComponent.component);
            if (component.getComponentType() === "display") {
                ns.displayCreated = false;
                deleteScreenObjectComponents = true;
            }
            else if (component.getComponentType() === "screenControl") {
                ns.sizeCreated = false;
            }
            ns.components.get(ns.alteringComponent.panel).removeChild(component.getID());
        }
        else {
            var component = ns.components.get(ns.alteringComponent.component);

            if (component.getComponentType() === "display") {
                ns.displayCreated = false;
                deleteScreenObjectComponents = true;
            }
            else if (component.getComponentType() === "screenControl") {
                ns.sizeCreated = false;
            }

            ns.components.delete(ns.alteringComponent.component);
        }

        if (deleteScreenObjectComponents) {
            var toRemove = [];
            ns.components.forEach(function (value, key) {
                if (value.getComponentType() === "panel") {
                    value.findAndRemoveComponents("screenControl");
                    value.findAndRemoveComponents("source");
                }
                else if (value.getComponentType() === "screenControl" || value.getComponentType() === "source") {
                    toRemove.push(key);
                }
            });
            for (var i = 0; i < toRemove.length; i++) {
                ns.components.delete(toRemove[i]);
            }
            ns.sizeCreated = false;
        }


    }

    ns.alteringComponent = {"panel": null, "component": null};
    ns.constructProperties(undefined, "kePressHandler");
    ns.drawRectangles();
}


//handle key press events
ns.keyPressHandler = function (e) {
    //console.log(e.keyCode);
    //console.log(e);
    if (e.keyCode === ns.DELETE_BUTTON) {
        ns.deleteComponent();
    }
    else if (e.keyCode === ns.ESC_BUTTON) {
        if (ns.isDrawing) {
            ns.deleteComponent();
            ns.isDrawing = false;

        }
        else if (ns.chosenComponentType != null) {
            ns.chosenComponentType = null;
        }
    }

    else if (e.keyCode === ns.G_BUTTON) {
        if (e.altKey && e.ctrlKey) {
            if (ns.selection !== null) {
                console.log("grouping.....");
                var components = ns.selection.getSelection();
                var groupID = ns.idSpecifier.getIdForComponent("group");
                var group = new uiEditor.components.Group(groupID, components, ns.components);
                ns.components.set(groupID, group);
                ns.selection = null;
                ns.drawRectangles();
            }
        }
    }

    else if (e.keyCode === ns.U_BUTTON) {
        if (e.altKey && e.ctrlKey) {
            var component = ns.components.get(ns.alteringComponent.component);
            if (component.getComponentType() === "group") {
                component.unGroup(ns.components);
                ns.alteringComponent = {"panel": null, "component": null};
                ns.constructProperties(undefined, "keyPressHandler");
                ns.drawRectangles();
            }
        }
    }

    return false;
};

//update properties of the components after changing values on properties panel
ns.textChanged = function (e) {
    if (ns.alteringComponent.component != "selection") {
        var input = e.target;  //target which fired the event
        var propertyName = input.name;  //get the name of property
        var propertyValue = input.value; //get value of property
        if (ns.alteringComponent.component) {
            if (ns.alteringComponent.panel) {
                var panel = ns.components.get(ns.alteringComponent.panel);
                var child = panel.getChild(ns.alteringComponent.component);
                child.setPropertyValue(propertyName, propertyValue);
                panel.addChild(child);
            }
            else {
                ns.components.get(ns.alteringComponent.component).setPropertyValue(propertyName, propertyValue); //update component with new property value
            }
        }
    }
    else {
        var input = e.target;  //target which fired the event
        var propertyName = input.name;  //get the name of property
        var propertyValue = input.value; //get value of property
        ns.selection.setPropertyValue(propertyName, propertyValue, ns.components);
    }

    ns.drawRectangles(); //redraw all the components
};

ns.promptSizes = function (e) {
    var result = [];
    var input = e.target;
    var propertyName = input.name;
    bootbox.dialog({
        title: "Choose items",
        message: '<div class="row">' +
                '<div class="col-md-3">' +
                '<form class="form-horizontal">' +
                '<div class="form-group flex-form">' +
                '<div class="checkbox flex-item">' +
                '<label><input type="checkbox" name="sizes" value="1x1">1x1</label>' +
                '</div>' +
                '<div class="checkbox flex-item">' +
                '<label><input type="checkbox" name="sizes" value="1x2">1x2</label>' +
                '</div>' +
                '<div class="checkbox flex-item">' +
                '<label><input type="checkbox" name="sizes" value="2x1">2x1</label>' +
                '</div>' +
                '<div class="checkbox flex-item">' +
                '<label><input type="checkbox" name="sizes" value="2x2">2x2</label>' +
                '</div>' +
                '<div class="checkbox flex-item">' +
                '<label><input type="checkbox" name="sizes" value="2x3">2x3</label>' +
                '</div>' +
                '<div class="checkbox flex-item">' +
                '<label><input type="checkbox" name="sizes" value="3x2">3x2</label>' +
                '</div>' +
                '<div class="checkbox flex-item">' +
                '<label><input type="checkbox" name="sizes" value="3x3">3x3</label>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</div>' +
                '</div>',
        buttons: {
            success: {
                label: "Save",
                callback: function () {
                    $.each($("input[name='sizes']:checked"), function () {
                        result.push($(this).val());
                    });

                    if (ns.alteringComponent.component) {
                        if (ns.alteringComponent.panel) {
                            var panel = ns.components.get(ns.alteringComponent.panel);
                            var child = panel.getChild(ns.alteringComponent.component);
                            child.setPropertyValue(propertyName, result);
                            panel.addChild(child);
                        }
                        else {
                            ns.components.get(ns.alteringComponent.component).setPropertyValue(propertyName, result);
                        }
                    }
                    ns.drawRectangles();
                }
            }
        }
    });







};


//update background image of the image component after loading the user image
ns.fileChanged = function (e) {
    var reader = new FileReader(); //File reader API
    reader.onload = function (event) {
        if (ns.alteringComponent.component) {
            if (ns.alteringComponent.panel) {
                var panel = ns.components.get(ns.alteringComponent.panel);
                var child = panel.getChild(ns.alteringComponent.component);
                child.setBackgroundImage(event.target.result);
                panel.addChild(child);
            }
            else {
                ns.components.get(ns.alteringComponent).setBackgroundImage(event.target.result);
            }
        }

        ns.drawRectangles();
    };
    reader.readAsDataURL(e.target.files[0]);
};

/*main event handler for handling mousePressed event on canvas
 * if mouse is pressed on the component, then mouseMove and mouseUp events are changed to the
 *          events for drag&drop of previously created components
 * else if mouse is pressed on empty space of canvas, then events are set to the
 *          events for drawing new component
 * component is drawn if componentType is chosen from toolbox, if nothing is chosen draw will not happen*/

ns.clearSelection = function () {
    if (ns.alteringComponent.component !== null) {
        if (ns.alteringComponent.panel !== null) {
            var panel = ns.components.get(ns.alteringComponent.panel);
            var child = panel.getChild(ns.alteringComponent.component);
            child.deselect();
        }
        else {
            var component = ns.components.get(ns.alteringComponent.component);
            if (component)
                component.deselect();
        }
    }
};

ns.draw = function (e) {

    var x = e.layerX;
    var y = e.layerY;
    // var x = e.offsetX;
    // var y = e.offsetY;
    ns.startX = x;
    ns.startY = y;
    var hitTestResult = ns.hitTest(x, y);
    if (!e.ctrlKey) {
        if (hitTestResult.hit) {
            if (hitTestResult.panel !== null && hitTestResult.component !== null) {
                //component inside the panel was hit
                //start moving component  
                ns.moveX = x;
                ns.moveY = y;
                ns.movingChildComponent.panel = hitTestResult.panel;
                ns.movingChildComponent.component = hitTestResult.component;
                ns.clearSelection();
                ns.alteringComponent.panel = hitTestResult.panel;
                ns.alteringComponent.component = hitTestResult.component;
                var panel = ns.components.get(ns.alteringComponent.panel);
                var child = panel.getChild(ns.alteringComponent.component);
                ns.constructProperties(child, "draw_component inside the panel was hit");
                ns.c.addEventListener('mousemove', ns.moveFromPanel, false);
                ns.c.addEventListener('mouseup', ns.moveFromPanelDone, false);

            }
            else if (hitTestResult.panel !== null) {
                //panel's main body was hit
                //start drawing inside the panel
                if (ns.selection !== null) {
                    ns.selection.clearSelection(ns.components);
                    ns.drawRectangles();
                    ns.selection = null;
                }

                ns.clearSelection();

                if (ns.chosenComponentType !== null) {
                    ns.c.addEventListener('mousemove', ns.mouseMove, false); //event handler for changing size of component which is being drawn
                    ns.c.addEventListener('mouseup', ns.mouseUp, false); //finish component creation
                    ns.w = ns.INITIAL_WIDTH; //initial width (global var)
                    ns.h = ns.INITIAL_HEIGHT; //initial height (global var)

                    var component = ns.createComponent(ns.chosenComponentType, x, y);
                    if (component.component) {
                        ns.isDrawing = true; //switch to draw mode
                        var panel = ns.components.get(hitTestResult.panel);
                        panel.addChild(component.component);
                        ns.drawingPanel = hitTestResult.panel;
                        ns.alteringComponent.component = component.id;
                        ns.alteringComponent.panel = hitTestResult.panel;
                    }
                }

            }
            else {
                //component was hit
                //start moving component
                if (hitTestResult.isInSelection) {

                    ns.movingComponent = "selection";
                    ns.clearSelection();
                    ns.alteringComponent.component = "selection";
                    ns.alteringComponent.panel = null;
                    //TODO
                    //construct properties
                    ns.constructProperties(ns.alteringComponent.component, "draw_component was hit");
                }
                else {
                    if (ns.selection !== null) {
                        ns.selection.clearSelection(ns.components);
                        ns.drawRectangles();
                        ns.selection = null;
                    }

                    ns.clearSelection();
                    ns.movingComponent = hitTestResult.component;
                    console.log(ns.movingComponent);
                    ns.alteringComponent.component = hitTestResult.component;
                    ns.alteringComponent.panel = null;
                    ns.components.get(ns.alteringComponent.component).select();
                    ns.components.get(ns.alteringComponent.component).firstSelect();
                    ns.constructProperties(ns.components.get(ns.alteringComponent.component, "draw_selection was hit"));
                }
                ns.moveX = x;
                ns.moveY = y;
                ns.c.addEventListener('mousemove', ns.move, false); //event handler for changing component's position (move component)
                ns.c.addEventListener('mouseup', ns.moveDone, false); //finish moving component
                //TODO
                //add logic for moving selection
            }
        }
        else {
            //canvas was hit. Start drawing
            if (ns.selection !== null) {
                ns.selection.clearSelection(ns.components);
                ns.drawRectangles();
                ns.selection = null;
            }

            ns.clearSelection();

            if (ns.chosenComponentType !== null) {
                ns.c.addEventListener('mousemove', ns.mouseMove, false); //event handler for changing size of component which is being drawn
                ns.c.addEventListener('mouseup', ns.mouseUp, false); //finish component creation
                ns.w = ns.INITIAL_WIDTH; //initial width (global var)
                ns.h = ns.INITIAL_HEIGHT; //initial height (global var)

                var component = ns.createComponent(ns.chosenComponentType, x, y);
                if (component.component) {
                    ns.isDrawing = true; //switch to draw mode
                    ns.components.set(component.id, component.component);
                    ns.alteringComponent.component = component.id;
                    ns.alteringComponent.panel = null;
                }
            }
        }
    }
    else {
        if (hitTestResult.hit && hitTestResult.panel === null) {
            if (ns.selection === null) {
                ns.selection = new uiEditor.components.GroupSelection();
            }
            if (ns.selection.isInSelection(hitTestResult.component)) {
                ns.selection.removeFromSelection(hitTestResult.component, ns.components);
                //ToDo
                //add selection color to edges of component
            }
            else {
                if (ns.alteringComponent.component !== null && ns.alteringComponent.panel === null && ns.selection.isEmpty()) {
                    ns.selection.addToSelection(ns.alteringComponent.component, ns.components);
                }
                ns.selection.addToSelection(hitTestResult.component, ns.components);

                //ToDo
                //remove selection color from edges of component
            }
            ns.alteringComponent.component = "selection";
            ns.alteringComponent.panel = null;
            ns.constructProperties(ns.alteringComponent.component, "draw_add to selection");
        }
    }
};


ns.createComponent = function (componentType, x, y) {
    var component = {"id": undefined, "component": null};
    switch (componentType) {
        case "button":
            component.id = ns.idSpecifier.getIdForComponent("button");
            component.component = new uiEditor.components.ButtonComponent(component.id, x, y,
                    ns.componentSizes[componentType].width, ns.componentSizes[componentType].height);
            break;
        case "text":
            component.id = ns.idSpecifier.getIdForComponent("text");
            component.component = new uiEditor.components.TextComponent(component.id, x, y,
                    ns.componentSizes[componentType].width, ns.componentSizes[componentType].height);
            break;
        case "display":
            if (ns.displayCreated === false) {
                component.id = ns.idSpecifier.getIdForComponent("display");
                component.component = new uiEditor.components.DisplayComponent(component.id, x, y,
                        ns.componentSizes[componentType].width, ns.componentSizes[componentType].height, 6, 2);
                ns.displayCreated = true;
            }
            break;
        case "image":
            component.id = ns.idSpecifier.getIdForComponent("image");
            component.component = new uiEditor.components.ImageComponent(component.id, x, y,
                    ns.componentSizes[componentType].width, ns.componentSizes[componentType].height);
            break;
        case "panel":
            component.id = ns.idSpecifier.getIdForComponent("panel");
            component.component = new uiEditor.components.PanelComponent(component.id, x, y,
                    ns.componentSizes[componentType].width, ns.componentSizes[componentType].height, "header");
            break;
        case "screenControl":
            if (ns.sizeCreated === false && ns.displayCreated === true) {
                component.id = ns.idSpecifier.getIdForComponent("screenControl");
                component.component = new uiEditor.components.ScreenControlComponent(component.id, x, y,
                        ns.componentSizes[componentType].width, ns.componentSizes[componentType].height, ["1x1", "2x2", "3x3"]);
                ns.sizeCreated = true;
            }
            break;
        case "source":
            if (ns.displayCreated === true) {
                component.id = ns.idSpecifier.getIdForComponent("source");
                component.component = new uiEditor.components.SourceComponent(component.id, x, y,
                        ns.componentSizes[componentType].width, ns.componentSizes[componentType].height, "not set", "");
            }
            break;
    }
    return component;
};


// check if component is clicked or not
ns.hitTest = function (testX, testY) {
    var result = {"hit": false, "component": null, "panel": null};
    ns.components.forEach(function (value, key) {
        var temp = value.hitTest(testX, testY);
        if (temp.hit) {
            result = temp;
        }

    });

    if (result.hit && result.panel === null) {
        if (ns.selection !== null) {
            if (ns.selection.isInSelection(result.component)) {
                result.isInSelection = true;
            }
        }
    }

    return result;
};



ns.hitToPanelTest = function (testX, testY, testComponent) {
    var panels = [];
    var hitPanel = undefined;
    ns.components.forEach(function (value, key) {
        if (value.getComponentType() === "panel" && ns.movingComponent !== key)
            panels.push(value);
    });


    for (var i = 0; i < panels.length; i++) {
        var panel = panels[i];
        if (testX >= panel.getX() && testX <= panel.getX() + panel.getWidth() &&
                testY >= panel.getY() + panel.getHeaderHeight() &&
                testY <= panel.getY() + panel.getHeight()) {
            if (panel.isComponentInside(testComponent)) {
                hitPanel = panel.getID();
            }
        }
    }
    return hitPanel;



};

//construct properties panel
ns.constructProperties = function (component, callFrom) {
    console.log("Construct properties: call from " + callFrom);
    var propertiesPanel = document.getElementById('properties');

    //clear properties panel
    while (propertiesPanel.firstChild) {
        propertiesPanel.removeChild(propertiesPanel.firstChild);
    }
    if (component !== undefined) {
        if (component !== "selection") {
            //get property names for the selected component
            var propertyNames = ns.properties[component.getComponentType()];

            //create div and input controls for every property
            for (var i = 0; i < propertyNames.length; i++) {
                var div = document.createElement('div');
                div.className = 'param';
                div.appendChild(document.createTextNode(propertyNames[i]['name']));
                div.innerHTML += '<br>';
                var input = document.createElement('input');
                input.type = propertyNames[i]['type'];
                input.id = propertyNames[i]['name'];
                input.name = propertyNames[i]['name'];
                if (propertyNames[i]['type'] === 'file') {
                    input.filename = component.getPropertyValue(propertyNames[i]['name']);

                    //add event listener for file uploader
                    input.addEventListener('change', ns.fileChanged, false);
                }
                else if (propertyNames[i]['type'] == 'promptDialog') {
                    input.type = "button";
                    input.value = "Choose sizes";
                    input.addEventListener("click", ns.promptSizes, false);
                }
                else {
                    input.value = component.getPropertyValue(propertyNames[i]['name']);

                    //add change event listener for every event of the text input
                    input.addEventListener('change', ns.textChanged, false);
                    input.addEventListener('keypress', ns.textChanged, false);
                    input.addEventListener('paste', ns.textChanged, false);
                    input.addEventListener('input', ns.textChanged, false);
                }
                div.appendChild(input);
                propertiesPanel.appendChild(div);
            }
        }
        else {
            if (ns.selection !== null) {
                var propertyNames = ns.properties[component];

                for (var i = 0; i < propertyNames.length; i++) {
                    var div = document.createElement('div');
                    div.className = 'param';
                    div.appendChild(document.createTextNode(propertyNames[i]['name']));
                    div.innerHTML += '<br>';
                    var input = document.createElement('input');
                    input.type = propertyNames[i]['type'];
                    input.id = propertyNames[i]['name'];
                    input.name = propertyNames[i]['name'];
                    if (propertyNames[i]["type"] == "number") {
                        input.value = ns.selection.getPropertyValue(propertyNames[i]["name"]);

                        input.addEventListener('change', ns.textChanged, false);
                        input.addEventListener('keypress', ns.textChanged, false);
                        input.addEventListener('paste', ns.textChanged, false);
                        input.addEventListener('input', ns.textChanged, false);
                    }
                    div.appendChild(input);
                    propertiesPanel.appendChild(div);
                }

            }
        }
    }
};

//move the component to another position
ns.move = function (e) {
    if (ns.movingComponent) {
        console.log("****************************************");
        console.log('moving component: '+ ns.movingComponent);
        console.log("altering component: "+ns.alteringComponent);
        console.log("*******************************************");

        ns.x = e.layerX;
        ns.y = e.layerY;
        // ns.x = e.offsetX;
        //ns.y = e.offsetY;


        var dx = ns.x - ns.moveX;
        var dy = ns.y - ns.moveY;
        ns.moveX = ns.x;
        ns.moveY = ns.y;
        if (ns.movingComponent !== "selection")
        {
            ns.components.get(ns.movingComponent).move(dx, dy);

            ns.destinationPanel = ns.hitToPanelTest(ns.x, ns.y, ns.components.get(ns.movingComponent));


            ns.constructProperties(ns.components.get(ns.movingComponent), "move");
        }
        else {
            ns.selection.move(dx, dy, ns.components);
            ns.constructProperties(ns.alteringComponent.component, "move");
        }
        ns.drawRectangles();
    }
};

ns.moveFromPanel = function (e) {
    if (ns.movingChildComponent.component && ns.movingChildComponent.panel) {
        ns.x = e.layerX;
        ns.y = e.layerY;
        //ns.x = e.offsetX;
        //ns.y = e.offsetY;
        var dx = ns.x - ns.moveX;
        var dy = ns.y - ns.moveY;
        ns.moveX = ns.x;
        ns.moveY = ns.y;
        var panel = ns.components.get(ns.movingChildComponent.panel);
        var child = panel.getChild(ns.movingChildComponent.component);
        child.move(dx, dy);
        panel.addChild(child);
        ns.destinationPanel = ns.hitToPanelTest(ns.x, ns.y, child);

        ns.drawRectangles();
        ns.constructProperties(child, "moveFromPanel");
    }
};


ns.moveFromPanelDone = function (e) {
    if (ns.movingChildComponent.panel && ns.movingChildComponent.component) {
        var panel = ns.components.get(ns.movingChildComponent.panel);
        var child = panel.getChild(ns.movingChildComponent.component);

        if (!panel.isComponentInside(child)) {
            if (ns.destinationPanel) {
                panel.removeChild(child);
                ns.components.get(ns.destinationPanel).addChild(child);
            }
            else {
                panel.removeChild(child);
                ns.components.set(child.getID(), child);
            }

        }

        ns.movingChildComponent.panel = null;
        ns.movingChildComponent.component = null;
        ns.destinationPanel = undefined;
    }
};

//set variables, which are used for moving, to their initial values
ns.moveDone = function (e) {
    if (ns.destinationPanel) {
        ns.components.get(ns.destinationPanel).addChild(ns.components.get(ns.movingComponent));
        ns.components.delete(ns.movingComponent);
    }
    ns.movingComponent = undefined;
    ns.destinationPanel = undefined;
};


//mousemove event handler for creating new component
ns.mouseMove = function (e) {
    if (ns.isDrawing) {

// get mouse position
        ns.x = e.layerX;
        ns.y = e.layerY;
        // ns.x = e.offsetX;
        // ns.y = e.offsetY;
        //alter mouse position
        //in case if direction of rectangle was changed, i.e. top left corner become different corner
        ns.x = Math.min(e.layerX, ns.startX);
        ns.y = Math.min(e.layerY, ns.startY);
        // ns.x = Math.min(e.offsetX, ns.startX);
        // ns.y = Math.min(e.offsetY, ns.startY);

        //calculate width and height
        ns.w = Math.abs(e.layerX - ns.startX);
        ns.h = Math.abs(e.layerY - ns.startY);
        // ns.w = Math.abs(e.offsetX - ns.startX);
        //  ns.h = Math.abs(e.offsetY-ns.startY);
        //set width and height of current rectangle to the calculated value

        var r;
        if (ns.drawingPanel === undefined) {
            r = ns.components.get(ns.alteringComponent.component);
        }
        else {
            r = ns.components.get(ns.drawingPanel).getChild(ns.alteringComponent.component);
        }
        r.setX(ns.x);
        r.setY(ns.y);
        if (ns.w < ns.componentSizes[ns.chosenComponentType].width) {
            ns.w = ns.componentSizes[ns.chosenComponentType].width
        }
        ;
        if (ns.h < ns.componentSizes[ns.chosenComponentType].height) {
            ns.h = ns.componentSizes[ns.chosenComponentType].height
        }
        ;
        r.setWidth(ns.w);
        r.setHeight(ns.h);

        if (ns.drawingPanel === undefined) {
            ns.components.set(ns.alteringComponent.component, r);
        }
        else {
            ns.components.get(ns.drawingPanel).addChild(r);
        }

        ns.drawRectangles();
    }
};

//used to draw all the components {needs to rename}
ns.drawRectangles = function () {
    //ns.cleanUp();
    ns.ctx.clearRect(0, 0, ns.c.width, ns.c.height);
    ns.components.forEach(function (value, key) {
        value.draw(ns.ctx);
    });
};

//Remove unnecessary components, which are created by mistake
//Delete if width and height are less than minimum value
ns.cleanUp = function () {
    ns.components.forEach(function (value, key) {
        if (value.getHeight() <= ns.MINIMUM_HEIGHT && value.getWidth() <= ns.MINIMUM_WIDTH && ns.isDrawing === false) {
            ns.components.delete(key);
        }
    });
};

//set variables, which are used to create new component, to their initial values
ns.mouseUp = function (e) {
    ns.isDrawing = false;
    ns.drawingPanel = undefined;

    ns.drawRectangles();
    if (ns.alteringComponent.component == "selection") {
        ns.constructProperties(ns.alteringComponent.component, "mouseUp_selection");
    }
    else if (ns.alteringComponent.panel === null) {
        ns.constructProperties(ns.components.get(ns.alteringComponent.component), "mouseUp_panel=null");
    }
    else {
        if (ns.alteringComponent.component !== "selection") {
            var panel = ns.components.get(ns.alteringComponent.panel);
            var child = panel.getChild(ns.alteringComponent.component);
            ns.constructProperties(child, "mouseUp_panel!=null");
        }

    }

};

ns.saveToJson = function () {
    var screenObject = new uiEditor.components.ScreenObject();
    var obj = {"button": [], "text": [], "image": [], "display": [], "panel": [], "group": []};
    ns.components.forEach(function (value, key) {
        switch (value.getComponentType()) {
            case "text":
                obj.text.push(value.getPropertiesForJSON());
                break;
            case "button":
                obj.button.push(value.getPropertiesForJSON());
                break;
            case "image":
                obj.image.push(value.getPropertiesForJSON());
                break;
            case "display":
                console.log(value.getComponentType());
                //obj.display.push(value.getPropertiesForJSON());
                screenObject.setDisplay(value);
                break;
            case "panel":
                obj.panel.push(value.getPropertiesForJSON());
                break;

            case "group":
                obj.group.push(value.getPropertiesForJSON());
                break;
            case "screenControl":
                console.log(value.getComponentType());
                screenObject.setSize(value);
                break;
            case "source":
                console.log(value.getComponentType());
                screenObject.setSource(value);
                break;
            default:
                break;
        }
    });
    obj.screenObject = screenObject.getPropertiesForJSON();
    var jsonData = JSON.stringify(obj, null, 5);
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(jsonData);
    window.open(url, '_blank');
    window.focus();
};




/* Event handler for toolbox buttons
 * It will set chosenComponentType to the corresponding value coming from clicked button
 * if chosenComponentType is null, then nothing will be drawn*/
ns.setChosenComponent = function (e) {
    switch (e) {
        case "text":
            ns.chosenComponentType = "text";
            break;
        case "button":
            ns.chosenComponentType = "button";
            break;
        case "display":
            if (ns.displayCreated === false) {
                ns.chosenComponentType = "display";
            }
            break;
        case "image":
            ns.chosenComponentType = "image";
            break;
        case "panel":
            ns.chosenComponentType = "panel";
            break;
        case "screenControl":
            if (ns.displayCreated === true && ns.sizeCreated === false) {
                ns.chosenComponentType = "screenControl";
            }
            break;
        case "source":
            if (ns.displayCreated === true) {
                ns.chosenComponentType = "source";
            }
            break;
        default:
            ns.chosenComponentType = null;
    }
};


/**********************Alignment operations************************/
ns.alignSizes = function () {
    if (ns.selection === null) {
        return;
    }

    ns.selection.alignSize(ns.components);
    ns.drawRectangles();

    if (ns.chosenComponentType !== null) {
        ns.chosenComponentType = null;
    }
};

ns.alignVertical = function () {
    if (ns.selection === null) {
        return;
    }

    ns.selection.alignVertical(ns.components);
    ns.drawRectangles();

    if (ns.chosenComponentType !== null) {
        ns.chosenComponentType = null;
    }
};

ns.alignHorizontal = function () {
    if (ns.selection === null) {
        return;
    }

    ns.selection.alignHorizontal(ns.components);
    ns.drawRectangles();

    if (ns.chosenComponentType !== null) {
        ns.chosenComponentType = null;
    }
};

ns.alignIntervalsHorizontal = function () {
    if (ns.selection === null) {
        return;
    }

    ns.selection.alignIntervalHorizontal(ns.components);
    ns.drawRectangles();

    if (ns.chosenComponentType !== null) {
        ns.chosenComponentType = null;
    }
};

ns.alignIntervalsVertical = function () {
    if (ns.selection === null) {
        return;
    }

    ns.selection.alignIntervalVertical(ns.components);
    ns.drawRectangles();

    if (ns.chosenComponentType !== null) {
        ns.chosenComponentType = null;
    }
};

/******************************************************************/





