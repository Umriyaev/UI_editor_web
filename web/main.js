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
ns.idSpecifier = new uiEditor.helpers.IdSpecifier(0, 0, 0, 0, 0, 0, 0, 0);
ns.isDrawing = false;
ns.isResizing = false;

//selection related properties
ns.isSelecting = false;
ns.selectionRectangle = {x: 0, y: 0, width: 0, height: 0};
ns.selection = null;
/*****************************/

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
ns.sourceValues = [];
ns.editor = {};
ns.actions = [];
ns.image = new Image();
ns.sizeCreated = false;

ns.fileName = null;
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


ns.propertiesIntersection = function (a, b) {
    return $.grep(a, function (i)
    {
        var result = false;
        $.each(b, function (j, item) {
            if (item.name === i.name)
                result = true;
        });
        return result;
        // return $.inArray(i, b) > -1;
    });
};

//constants
ns.G_BUTTON = 71;
ns.U_BUTTON = 85;
ns.DELETE_BUTTON = 46;
ns.ESC_BUTTON = 27;
ns.INITIAL_WIDTH = 0;
ns.INITIAL_HEIGHT = 0;
ns.MINIMUM_WIDTH = 50;
ns.MINIMUM_HEIGHT = 50;
ns.INITIAL_SCREEN_CONTROL_ROWS = 1;
ns.INITIAL_SCREEN_CONTROL_COLS = 3;
//properties for constructing properties panel based on the type of component
ns.properties = {
    "image": [
        {"name": "width", "type": "number", "text": "Width"},
        {"name": "height", "type": "number", "text": "Height"},
        {"name": "bg_image", "type": "file", "text": "Background image"},
        {"name": "z_index", "type": "number", "text": "Z-index:"}
    ],
    "button": [
        {"name": "width", "type": "number", "text": "Width"},
        {"name": "height", "type": "number", "text": "Height"},
        {"name": "radius", "type": "number", "text": "Border radius"},
        {"name": "text", "type": "text", "text": "Text"},
        {"name": "z_index", "type": "number", "text": "Z-index"},
        {"name": "bg_color", "type": "color", "text": "Background color"},
        {"name": "font_color", "type": "color", "text": "Font color"},
        {"name": "font_face", "type": "font_face", "text": "Font face"},
        {"name": "font_type", "type": "font_type", "text": "Font type"},
        {"name": "font_size", "type": "font_size", "text": "Font size"},
        {"name": "bg_image", "type": "file", "text": "Background image"},
        {"name": "second_image", "type": "file", "text": "Second image"},
        {"name": "action", "type": "action", "text": "Action"}
    ],
    "text": [
        {"name": "width", "type": "number", "text": "Width"},
        {"name": "height", "type": "number", "text": "Height"},
        {"name": "radius", "type": "number", "text": "Border radius"},
        {"name": "placeholder_text", "type": "text", "text": "Placeholder text"},
        {"name": "z_index", "type": "number", "text": "Z-index"},
        {"name": "font_color", "type": "color", "text": "Font color"},
        {"name": "font_face", "type": "font_face", "text": "Font face"},
        {"name": "font_type", "type": "font_type", "text": "Font type"},
        {"name": "font_size", "type": "font_size", "text": "Font size"},
        {"name": "bg_image", "type": "file", "text": "Background image"},
        {"name": "bg_color", "type": "color", "text": "Background color"}
    ],
    "display": [
        {"name": "width", "type": "number", "text": "Width"},
        {"name": "height", "type": "number", "text": "Height"},
        {"name": "rows", "type": "number", "text": "Number of rows"},
        {"name": "cols", "type": "number", "text": "Number of columns"},
        {"name": "bg_color", "type": "color", "text": "Background color"},
        {"name": "spacing", "type": "number", "text": "Spacing"},
        {"name": "z_index", "type": "number", "text": "Z-index"},
        {"name": "line_style", "type": "line_style", "text": "Line style"},
        {"name": "line_width", "type": "number", "text": "Line width"},
        {"name": "bg_image", "type": "file", "text": "Background image"}
    ],
    "panel": [
        {"name": "width", "type": "number", "text": "Width"},
        {"name": "height", "type": "number", "text": "Height"},
        {"name": "headerText", "type": "text", "text": "Header text"},
        {"name": "z_index", "type": "number", "text": "Z-index"},
        {"name": "bg_image", "type": "file", "text": "Background image"},
        {"name": "bg_color", "type": "color", "text": "Background color"}
    ],
    "screenControl": [
        {"name": "width", "type": "number", "text": "Width"},
        {"name": "height", "type": "number", "text": "Height"},
        {"name": "radius", "type": "number", "text": "Border radius"},
        {"name": "rows", "type": "number", "text": "Number of rows"},
        {"name": "cols", "type": "number", "text": "Number of columns"},
        {"name": "z_index", "type": "number", "text": "Z-index"},
        {"name": "bg_color", "type": "color", "text": "Background color"},
        {"name": "font_color", "type": "color", "text": "Font color"},
        {"name": "font_face", "type": "font_face", "text": "Font face"},
        {"name": "font_type", "type": "font_type", "text": "Font type"},
        {"name": "font_size", "type": "font_size", "text": "Font size"},
        {"name": "bg_image", "type": "file", "text": "Background image"},
    ],
    "source": [
        {"name": "width", "type": "number", "text": "Width"},
        {"name": "height", "type": "number", "text": "Height"},
        {"name": "radius", "type": "number", "text": "Border radius"},
        {"name": "source", "type": "source", "text": "Source"},
        {"name": "z_index", "type": "number", "text": "Z-index"},
        {"name": "bg_color", "type": "color", "text": "Background color"},
        {"name": "font_color", "type": "color", "text": "Font color"},
        {"name": "font_face", "type": "font_face", "text": "Font face"},
        {"name": "font_type", "type": "font_type", "text": "Font type"},
        {"name": "font_size", "type": "font_size", "text": "Font size"},
        {"name": "bg_image", "type": "file", "text": "Background image"}
    ],
    "selection": [
        {"name": "width", "type": "number", "text": "Width"},
        {"name": "height", "type": "number", "text": "Height"},
        {"name": "bg_color", "type": "color", "text": "Background color"},
        {"name": "bg_image", "type": "file", "text": "Background image"},
        {"name": "z_index", "type": "number", "text": "Z-index"}
    ],
    "editor": [
        {"name": "screen_width", "type": "number", "text": "Width"},
        {"name": "screen_height", "type": "number", "text": "Height"},
        {"name": "bg_color", "type": "color", "text": "Background color"},
        {"name": "bg_image", "type": "file", "text": "Background image"}
    ],
    "group": [{"name": "z_index", "type": "number"}]
};
ns.font_face_list = ["Arial", "Verdana", "Times New Roman", "Courier New", "serif", "sans-serif"];
ns.font_type_list = ["normal", "bold", "italic", "bolder", "lighter"];
ns.font_size_list = ["8px", "10px", "14px", "18px", "20px", "22px", "24px", "26px", "28px", "30px", "50px", "100px"];
ns.line_style_list = ["solid", "dotted", "dashed"];
ns.componentSizes = {
    "image": {"width": 300, "height": 200},
    "button": {"width": 140, "height": 60},
    "text": {"width": 300, "height": 60},
    "panel": {"width": 500, "height": 400},
    "display": {"width": 600, "height": 200},
    "screenControl": {"width": 140, "height": 60},
    "source": {"width": 140, "height": 60}
};
//initial setting of event handlers
ns.init = function () {
    console.log("test");
    ns.sourceValues.push("not set");
    ns.actions.push("not set");
    ns.editor.screen_width = $(".canvasPanel").width();
    ns.editor.screen_height = $(".canvasPanel").height();
    ns.editor.bg_color = '#fff';
    ns.editor.bg_image = 'not set';

    $.getJSON("http://lion.konkuk.ac.kr:8080/ui.conf", function (data) {
        for (var item in data.actions) {
            ns.actions.push(item);
            console.log(item + " - " + data.actions[item]);
        }

        for (var item in data.sources) {
            ns.sourceValues.push(item);
            console.log(item + " - " + data.sources[item]);
        }
    });
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
    ns.c.addEventListener("mousemove", ns.moveFromPanel, false);
    ns.c.addEventListener("mousemove", ns.move, false);
    ns.c.addEventListener("mousemove", ns.mouseMoveResize, false);
    ns.c.addEventListener("mouseup", function (e) {
        ns.mouseUp(e);
    }, false);
    ns.c.addEventListener("mouseup", ns.moveFromPanelDone, false);
    ns.c.addEventListener("mouseup", ns.moveDone, false);
    ns.c.addEventListener("mouseup", ns.mouseUpResize, false);
    ns.c.addEventListener('contextmenu', ns.contextMenuHandler, false);
    window.addEventListener("keydown", ns.keyPressHandler, false);
    if (document.getElementById('json')) {
        var json = document.getElementById('json').innerHTML;
        var uiProject = JSON.parse(json);
        console.log(uiProject);
        ns.loadProject(uiProject);
        ns.drawRectangles();
    }

    ns.fileName = ns.getParameter('param1');
    if (!document.getElementById('properties')) {
        var propertiesColumn = document.getElementById('propertiesColumn');
        var properties = document.createElement('div');
        properties.id = 'properties';
        properties.className = "panel-body propertiesPanel";
        propertiesColumn.appendChild(properties);
    }


};
ns.loadProject = function (uiProject) {
    if (typeof (uiProject.editor) !== 'undefined' && uiProject.editor !== null) {
        ns.editor = uiProject.editor;
    }
    for (var i = 0; i < uiProject.button.length; i++) {
        ns.components.set(uiProject.button[i].id,
                new uiEditor.components.ButtonComponent(uiProject.button[i].id,
                        uiProject.button[i].xPosition,
                        uiProject.button[i].yPosition,
                        uiProject.button[i].width,
                        uiProject.button[i].height,
                        uiProject.button[i].z_index,
                        uiProject.button[i].bg_color,
                        uiProject.button[i].bg_image,
                        uiProject.button[i].second_image,
                        uiProject.button[i].font_color,
                        uiProject.button[i].font_face,
                        uiProject.button[i].font_type,
                        uiProject.button[i].font_size,
                        uiProject.button[i].action,
                        uiProject.button[i].radius));
    }

    for (var i = 0; i < uiProject.image.length; i++) {
        ns.components.set(uiProject.image[i].id,
                new uiEditor.components.ImageComponent(uiProject.image[i].id,
                        uiProject.image[i].xPosition,
                        uiProject.image[i].yPosition,
                        uiProject.image[i].width,
                        uiProject.image[i].height,
                        uiProject.image[i].bg_image,
                        uiProject.image[i].z_index));
    }

    for (var i = 0; i < uiProject.text.length; i++) {
        ns.components.set(uiProject.text[i].id,
                new uiEditor.components.TextComponent(uiProject.text[i].id,
                        uiProject.text[i].xPosition,
                        uiProject.text[i].yPosition,
                        uiProject.text[i].width,
                        uiProject.text[i].height,
                        uiProject.text[i].z_index,
                        uiProject.text[i].placeholder_text,
                        uiProject.text[i].font_color,
                        uiProject.text[i].font_face,
                        uiProject.text[i].font_type,
                        uiProject.text[i].font_size,
                        uiProject.text[i].bg_image,
                        uiProject.text[i].bg_color,
                        uiProject.text[i].radius));
    }

    var screenObject = uiProject.screenObject;
    if (screenObject.display !== null && screenObject.display !== undefined) {
        ns.components.set(screenObject.display.id,
                new uiEditor.components.DisplayComponent(screenObject.display.id,
                        screenObject.display.xPosition,
                        screenObject.display.yPosition,
                        screenObject.display.width,
                        screenObject.display.height,
                        screenObject.display.cols,
                        screenObject.display.rows,
                        screenObject.display.z_index,
                        screenObject.display.spacing,
                        screenObject.display.bg_color,
                        screenObject.display.line_style,
                        screenObject.display.line_width,
                        screenObject.display.bg_image));
        ns.displayCreated = true;
    }

    if (screenObject.size !== null && screenObject.size !== undefined) {
        for (var i = 0; i < screenObject.size.length; i++) {
            ns.components.set(screenObject.size[i].id,
                    new uiEditor.components.ScreenControlComponent(screenObject.size[i].id,
                            screenObject.size[i].xPosition,
                            screenObject.size[i].yPosition,
                            screenObject.size[i].width,
                            screenObject.size[i].height,
                            screenObject.size[i].rows,
                            screenObject.size[i].cols,
                            screenObject.size[i].z_index,
                            screenObject.size[i].bg_color,
                            screenObject.size[i].font_color,
                            screenObject.size[i].font_face,
                            screenObject.size[i].font_type,
                            screenObject.size[i].font_size,
                            screenObject.size[i].bg_image,
                            screenObject.size[i].radius));
        }
    }

    if (screenObject.source !== null && screenObject.source !== undefined) {
        for (var i = 0; i < screenObject.source.length; i++) {
            ns.components.set(screenObject.source[i].id,
                    new uiEditor.components.SourceComponent(screenObject.source[i].id,
                            screenObject.source[i].xPosition,
                            screenObject.source[i].yPosition,
                            screenObject.source[i].width,
                            screenObject.source[i].height,
                            screenObject.source[i].text,
                            screenObject.source[i].source,
                            screenObject.source[i].z_index,
                            screenObject.source[i].bg_color,
                            screenObject.source[i].font_color,
                            screenObject.source[i].font_face,
                            screenObject.source[i].font_type,
                            screenObject.source[i].font_size,
                            screenObject.source[i].bg_image,
                            screenObject.source[i].radius));
        }
    }

    for (var i = 0; i < uiProject.group.length; i++) {
        ns.components.set(uiProject.group[i].id,
                new uiEditor.components.Group(uiProject.group[i].id,
                        null,
                        null,
                        true,
                        uiProject.group[i].xPos,
                        uiProject.group[i].yPos,
                        uiProject.group[i].width,
                        uiProject.group[i].height,
                        uiProject.group[i].items));
    }

    for (var i = 0; i < uiProject.panel.length; i++) {
        ns.components.set(uiProject.panel[i].id,
                new uiEditor.components.PanelComponent(
                        uiProject.panel[i].id,
                        uiProject.panel[i].xPosition,
                        uiProject.panel[i].yPosition,
                        uiProject.panel[i].width,
                        uiProject.panel[i].height,
                        uiProject.panel[i].headerText,
                        true,
                        uiProject.panel[i].children,
                        uiProject.panel[i].bg_image,
                        uiProject.panel[i].bg_color,
                        uiProject.panel[i].z_index));
    }
    var idSpecifier = uiProject.idSpecifier;
    if (uiProject.idSpecifier !== null && uiProject.idSpecifier !== undefined) {
        ns.idSpecifier = new uiEditor.helpers.IdSpecifier(idSpecifier.buttonCount,
                idSpecifier.textboxCount, idSpecifier.displayCount,
                idSpecifier.imageCount, idSpecifier.panelCount,
                idSpecifier.screenControlCount, idSpecifier.sourceCount, idSpecifier.groupCount);
    }
};
ns.getParameter = function (theParameter) {
    var params = window.location.search.substr(1).split('&');
    for (var i = 0; i < params.length; i++) {
        var p = params[i].split('=');
        if (p[0] === theParameter) {
            return decodeURIComponent(p[1]);
        }
    }
    return null;
}


ns.respondResize = function () {
    ns.c.width = $(".canvasPanel").width();
    ns.c.height = $(".canvasPanel").height();
    ns.drawRectangles();
};


ns.contextMenuHandler = function (e) {
    console.log('You tried to call context menu');
    console.log(e);
    e.preventDefault();
};
ns.deleteComponent = function () {
    var deleteScreenObjectComponents = false;
    if (ns.alteringComponent.component) {

        if (ns.alteringComponent.component === "selection") {
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
                //ns.sizeCreated = false;
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
                //ns.sizeCreated = false;
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
            //ns.sizeCreated = false;
        }


    }

    ns.alteringComponent = {"panel": null, "component": null};
    ns.constructProperties(undefined, "kePressHandler");
    ns.drawRectangles();
}


//handle key press events
ns.keyPressHandler = function (e) {

    if (e.keyCode === ns.DELETE_BUTTON) {
        var hasFocus = false;
        $('#properties').find('*').each(function () {
            if ($(this).is(":focus"))
                hasFocus = true;
        })
        if (!hasFocus)
            ns.deleteComponent();
    }
    else if (e.keyCode === ns.ESC_BUTTON) {
        if (ns.isDrawing) {
            ns.deleteComponent();
            ns.isDrawing = false;
        }
        else if (ns.chosenComponentType !== null) {
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
    console.log(e.target.name);
    if (ns.alteringComponent.component !== "selection" && ns.alteringComponent.component !== 'editor') {
        var input = e.target; //target which fired the event
        var propertyName = input.name; //get the name of property
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
    else if (ns.alteringComponent.component === 'editor') {
        var input = e.target; //target which fired the event
        var propertyName = input.name; //get the name of property
        var propertyValue = input.value; //get value of property
        ns.editor[propertyName] = propertyValue;
    }
    else {
        var input = e.target; //target which fired the event
        var propertyName = input.name; //get the name of property
        var propertyValue = input.value; //get value of property
        ns.selection.setPropertyValue(propertyName, propertyValue, ns.components);
    }

    ns.drawRectangles(); //redraw all the components
};
ns.selectionChanged = function (e) {
    var select = e.target; //target which fired the event
    var propertyName = select.name; //get the name of property
    var propertyValue = select.options[select.selectedIndex].value; //get value of property
    console.log(propertyName + " " + propertyValue);
    if (ns.alteringComponent.component === "selection") {
        ns.selection.setPropertyValue(propertyName, propertyValue, ns.components);
        ns.drawRectangles();
    }
    else {
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
    ns.drawRectangles();
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

    var file = e.target.files[0];
    //File reader API
//    reader.onload = function (event) {
    if (ns.alteringComponent.component) {
        if (ns.alteringComponent.panel) {
            var panel = ns.components.get(ns.alteringComponent.panel);
            var child = panel.getChild(ns.alteringComponent.component);
            child.setBackgroundImage("/images/" + file.name);
            panel.addChild(child);
        }
        else {
            ns.components.get(ns.alteringComponent.component).setBackgroundImage("/images/" + file.name);
        }
    }


    //ns.drawRectangles();
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

ns.getMousePos = function (e) {
    var rect = ns.c.getBoundingClientRect();
    return {
        layerX: Math.floor(e.clientX - rect.left),
        layerY: Math.floor(e.clientY - rect.top)
    };
}

ns.unfocusInputs = function () {
    $('#properties').find("*").each(function () {
        if ($(this).is(":focus"))
            $(this).blur();
    });
};

ns.draw = function (e) {
    ns.unfocusInputs();
    console.log('draw function: chosenComponent: ' + ns.chosenComponentType);

    var mousePos = ns.getMousePos(e);

    var x = mousePos.layerX;
    var y = mousePos.layerY;
    ns.startX = x;
    ns.startY = y;
    var hitTestResult = ns.hitTest(x, y);
    if (!e.ctrlKey) {
        if (hitTestResult.hit) {
            console.log('hit');
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
                panel.deselectChildren();
                child.select();
                child.firstSelect();
                ns.constructProperties(child, "draw_component inside the panel was hit");
                //ns.c.addEventListener('mousemove', ns.moveFromPanel, false);
                //ns.c.addEventListener('mouseup', ns.moveFromPanelDone, false);
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
                    // ns.c.addEventListener('mousemove', ns.mouseMove, false); //event handler for changing size of component which is being drawn
                    // ns.c.addEventListener('mouseup', ns.mouseUp, false); //finish component creation
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
                // ns.c.addEventListener('mousemove', ns.move, false); //event handler for changing component's position (move component)
                //ns.c.addEventListener('mouseup', ns.moveDone, false); //finish moving component
                //TODO
                //add logic for moving selection
            }
        }
        else if (hitTestResult.resize) {
            console.log('resize: ns.draw');
            if (hitTestResult.panel !== null && hitTestResult.component !== null) {
                ns.alteringComponent.panel = hitTestResult.panel;
                ns.alteringComponent.component = hitTestResult.component;
                ns.isResizing = true;
                var panel = ns.components.get(ns.alteringComponent.panel);
                var component = panel.getChild(ns.alteringComponent.component);
                ns.startX = component.getX();
                ns.startY = component.getY();
                //ns.c.addEventListener('mousemove', ns.mouseMoveResize, false);
                // ns.c.addEventListener('mouseup', ns.mouseUpResize, false);
            }
            else {
                var component = ns.components.get(hitTestResult.component);
                ns.startX = component.getX();
                ns.startY = component.getY();
                ns.isResizing = true;
                //ns.c.addEventListener('mousemove', ns.mouseMoveResize, false);
                // ns.c.addEventListener('mouseup', ns.mouseUpResize, false);
                ns.alteringComponent.component = hitTestResult.component;
                ns.alteringComponent.panel = null;
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
                //ns.c.addEventListener('mousemove', ns.mouseMove, false); //event handler for changing size of component which is being drawn
                // ns.c.addEventListener('mouseup', ns.mouseUp, false); //finish component creation
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
            else {
                //selection related operations
                ns.selectionRectangle.x = x;
                ns.selectionRectangle.y = y;
                ns.selectionRectangle.width = 0;
                ns.selectionRectangle.height = 0;
                ns.isSelecting = true;
                ns.clearSelection();
                ns.x = x;
                ns.y = y;
                ns.startX = x;
                ns.startY = y;
                /*****************************/

                ns.alteringComponent.component = 'editor';
                ns.alteringComponent.panel = null;
                ns.constructProperties(ns.alteringComponent.component, 'ns.draw: canvas');
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
                    ns.componentSizes[componentType].width, ns.componentSizes[componentType].height, null);
            break;
        case "panel":
            component.id = ns.idSpecifier.getIdForComponent("panel");
            component.component = new uiEditor.components.PanelComponent(component.id, x, y,
                    ns.componentSizes[componentType].width, ns.componentSizes[componentType].height, "header", null);
            break;
        case "screenControl":
            //if (ns.sizeCreated === false && ns.displayCreated === true) {
            component.id = ns.idSpecifier.getIdForComponent("screenControl");
            component.component = new uiEditor.components.ScreenControlComponent(component.id, x, y,
                    ns.componentSizes[componentType].width, ns.componentSizes[componentType].height,
                    ns.INITIAL_SCREEN_CONTROL_ROWS, ns.INITIAL_SCREEN_CONTROL_COLS);
            //  ns.sizeCreated = true;
            //}
            break;
        case "source":
            if (ns.displayCreated === true) {
                component.id = ns.idSpecifier.getIdForComponent("source");
                component.component = new uiEditor.components.SourceComponent(component.id, x, y,
                        ns.componentSizes[componentType].width, ns.componentSizes[componentType].height, "not set", "not set");
            }
            break;
    }
    return component;
};
// check if component is clicked or not
ns.hitTest = function (testX, testY) {
    var result = {"hit": false, "component": null, "panel": null, "resize": false};

    var buf = [];
    ns.components.forEach(function (value, key) {
        buf.push(value);
    });

    buf.sort(function (a, b) {
        if (a.getZ_index() < b.getZ_index())
            return -1;
        else if (a.getZ_index() > b.getZ_index())
            return 1;
        return 0;
    });

    for (var i = 0; i < buf.length; i++) {
        var temp = buf[i].hitTest(testX, testY);
        if (temp.hit || temp.resize) {
            result = temp;
        }
    }

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
    console.log(ns.actions);
    console.log(component);
    console.log("Construct properties: call from " + callFrom);
    var propertiesPanel = document.getElementById('properties');
    //clear properties panel
    while (propertiesPanel.firstChild) {
        propertiesPanel.removeChild(propertiesPanel.firstChild);
    }
    if (component !== undefined) {
        if (component !== "selection" && component !== 'editor') {
            //get property names for the selected component
            var propertyNames = ns.properties[component.getComponentType()];
            //create div and input controls for every property
            for (var i = 0; i < propertyNames.length; i++) {
                var div = document.createElement('div');
                div.className = 'param';
                div.appendChild(document.createTextNode(propertyNames[i]['text']));
                div.innerHTML += '<br>';
                var input, select;
                if (propertyNames[i]['type'] !== 'font_face' &&
                        propertyNames[i]['type'] !== 'font_size' &&
                        propertyNames[i]['type'] !== 'font_type' &&
                        propertyNames[i]['type'] !== 'line_style' &&
                        propertyNames[i]['type'] !== 'action' &&
                        propertyNames[i]['type'] !== 'source')
                {
                    input = document.createElement('input');
                    input.type = propertyNames[i]['type'];
                    input.id = propertyNames[i]['name'];
                    input.name = propertyNames[i]['name'];
                    div.appendChild(input);
                    if (propertyNames[i]['type'] === 'file') {
                        input.filename = component.getPropertyValue(propertyNames[i]['name']);

                        var fileName = component.getPropertyValue(propertyNames[i]['name']);
                        if (fileName !== 'not set') {
                            var removeImage = document.createElement('a');
                            removeImage.className = 'boxclose';
                            removeImage.id = 'boxclose';
                            removeImage.name = propertyNames[i]['name'];
                            div.appendChild(removeImage);
                        }
                        //add event listener for file uploader
                        //input.addEventListener('change', ns.fileChanged, false);
                    }
                    else if (propertyNames[i]['type'] === 'promptDialog') {
                        input.type = "button";
                        input.value = "Choose sizes";
                        input.addEventListener("click", ns.promptSizes, false);
                    }
                    else if (propertyNames[i]['type'] === 'color') {
                        input.type = "text";
                        input.className += "demo1";
                        input.value = component.getPropertyValue(propertyNames[i]['name']);
                        input.addEventListener('change', ns.textChanged, false);
                        input.addEventListener('keypress', ns.textChanged, false);
                        input.addEventListener('paste', ns.textChanged, false);
                        input.addEventListener('input', ns.textChanged, false);
                    }

                    else {
                        input.value = component.getPropertyValue(propertyNames[i]['name']);
                        //add change event listener for every event of the text input
                        input.addEventListener('change', ns.textChanged, false);
                        input.addEventListener('keypress', ns.textChanged, false);
                        input.addEventListener('paste', ns.textChanged, false);
                        input.addEventListener('input', ns.textChanged, false);
                    }
                }
                else {
                    console.log(propertyNames[i]['type']);
                    select = document.createElement('select');
                    select.name = propertyNames[i]['name'];
                    select.addEventListener('change', ns.selectionChanged, false);
                    select.id = propertyNames[i]['name'];
//                    select.add(new Option(component.getPropertyValue(propertyNames[i]['name']),
//                            component.getPropertyValue(propertyNames[i]['name'])));
                    //select.selectIndex = 0;
                    div.appendChild(select);
                    var selectItemsArray = null;
                    switch (propertyNames[i]['type']) {
                        case 'font_face':
                            selectItemsArray = ns.font_face_list;
                            break;
                        case 'font_type':
                            selectItemsArray = ns.font_type_list;
                            break;
                        case 'font_size':
                            selectItemsArray = ns.font_size_list;
                            break;
                        case 'line_style':
                            selectItemsArray = ns.line_style_list;
                            break;
                        case 'action':
                            selectItemsArray = ns.actions;
                            break;
                        case 'source':
                            selectItemsArray = ns.sourceValues;
                            break;
                    }

                    if (selectItemsArray !== null) {
                        for (var item in selectItemsArray) {
                            select.add(new Option(selectItemsArray[item], selectItemsArray[item]));
                            if (selectItemsArray[item] === component.getPropertyValue(propertyNames[i]['name'])) {
                                select.selectedIndex = item;
                            }
                        }
                    }
                }
                propertiesPanel.appendChild(div);
            }
        }
        else if (component === "selection") {
            if (ns.selection !== null) {
                console.log(ns.selection.getAddedComponents());
                var propertyNames = ns.getPropertiesForSelection(ns.selection.getAddedComponents());

                for (var i = 0; i < propertyNames.length; i++) {
                    var div = document.createElement('div');
                    div.className = 'param';
                    div.appendChild(document.createTextNode(propertyNames[i]['name']));
                    div.innerHTML += '<br>';
                    var input = document.createElement('input');
                    switch (propertyNames[i]["type"]) {
                        case  "number":
                            input.type = propertyNames[i]['type'];
                            input.id = propertyNames[i]['name'];
                            input.name = propertyNames[i]['name'];
                            input.value = ns.selection.getPropertyValue(propertyNames[i]["name"]);
                            input.addEventListener('change', ns.textChanged, false);
                            input.addEventListener('keypress', ns.textChanged, false);
                            input.addEventListener('paste', ns.textChanged, false);
                            input.addEventListener('input', ns.textChanged, false);
                            div.appendChild(input);
                            propertiesPanel.appendChild(div);
                            break;
                        case "file":
                            input.type = propertyNames[i]['type'];
                            input.id = propertyNames[i]['name'];
                            input.name = propertyNames[i]['name'];

                            var fileName = ns.selection.getPropertyValue(propertyNames[i]['name']);
                            if (fileName !== 'not set') {
                                var removeImage = document.createElement('a');
                                removeImage.className = 'boxclose';
                                removeImage.id = 'boxclose';
                                removeImage.name = propertyNames[i]['name'];
                                div.appendChild(removeImage);
                            }

                            div.appendChild(input);
                            propertiesPanel.appendChild(div);
                            break;
                        case "color":
                            input.type = "text";
                            input.id = propertyNames[i]['name'];
                            input.name = propertyNames[i]['name'];
                            if (ns.selection.getPropertyValue(propertyNames[i]["name"]) !== "not set")
                                input.value = ns.selection.getPropertyValue(propertyNames[i]["name"]);
                            input.className += "demo1";
                            if (ns.selection.getPropertyValue(propertyNames[i]["name"]) !== "not set")
                                input.value = ns.selection.getPropertyValue(propertyNames[i]["name"]);
                            input.addEventListener('change', ns.textChanged, false);
                            input.addEventListener('keypress', ns.textChanged, false);
                            input.addEventListener('paste', ns.textChanged, false);
                            input.addEventListener('input', ns.textChanged, false);
                            div.appendChild(input);
                            propertiesPanel.appendChild(div);
                            break;
                        case "text":
                            input.type = propertyNames[i]['type'];
                            input.id = propertyNames[i]['name'];
                            input.name = propertyNames[i]['name'];
                            if (ns.selection.getPropertyValue(propertyNames[i]["name"]) !== "not set")
                                input.value = ns.selection.getPropertyValue(propertyNames[i]["name"]);
                            input.addEventListener('change', ns.textChanged, false);
                            input.addEventListener('keypress', ns.textChanged, false);
                            input.addEventListener('paste', ns.textChanged, false);
                            input.addEventListener('input', ns.textChanged, false);
                            div.appendChild(input);
                            propertiesPanel.appendChild(div);
                            break;
                        case "font_face":
                            var select = document.createElement('select');
                            select.name = propertyNames[i]['name'];
                            select.addEventListener('change', ns.selectionChanged, false);
                            select.id = propertyNames[i]['name'];
                            div.appendChild(select);
                            for (var item in ns.font_face_list) {
                                select.add(new Option(ns.font_face_list[item], ns.font_face_list[item]));
                            }
                            propertiesPanel.appendChild(div);
                            break;
                        case "font_type":
                            var select = document.createElement('select');
                            select.name = propertyNames[i]['name'];
                            select.addEventListener('change', ns.selectionChanged, false);
                            select.id = propertyNames[i]['name'];
                            div.appendChild(select);
                            for (var item in ns.font_type_list) {
                                select.add(new Option(ns.font_type_list[item], ns.font_type_list[item]));
                            }
                            propertiesPanel.appendChild(div);
                            break;
                        case "font_size":
                            var select = document.createElement('select');
                            select.name = propertyNames[i]['name'];
                            select.addEventListener('change', ns.selectionChanged, false);
                            select.id = propertyNames[i]['name'];
                            div.appendChild(select);
                            for (var item in ns.font_size_list) {
                                select.add(new Option(ns.font_size_list[item], ns.font_size_list[item]));
                            }
                            propertiesPanel.appendChild(div);
                            break;
                        case "line_style":
                            var select = document.createElement('select');
                            select.name = propertyNames[i]['name'];
                            select.addEventListener('change', ns.selectionChanged, false);
                            select.id = propertyNames[i]['name'];
                            div.appendChild(select);
                            for (var item in ns.line_style_list) {
                                select.add(new Option(ns.line_style_list[item], ns.line_style_list[item]));
                            }
                            propertiesPanel.appendChild(div);
                            break;
                        case "action":
                            var select = document.createElement('select');
                            select.name = propertyNames[i]['name'];
                            select.addEventListener('change', ns.selectionChanged, false);
                            select.id = propertyNames[i]['name'];
                            div.appendChild(select);
                            for (var item in ns.actions) {
                                select.add(new Option(ns.actions[item], ns.actions[item]));
                            }
                            propertiesPanel.appendChild(div);
                            break;
                        case "source":
                            var select = document.createElement('select');
                            select.name = propertyNames[i]['name'];
                            select.addEventListener('change', ns.selectionChanged, false);
                            select.id = propertyNames[i]['name'];
                            div.appendChild(select);
                            for (var item in ns.sourceValues) {
                                select.add(new Option(ns.sourceValues[item], ns.sourceValues[item]));
                            }
                            propertiesPanel.appendChild(div);
                            break;

                    }
                }
            }

        }
        else if (component === "editor") {
            console.log('canvas is component');
            var cnvProperties = ns.properties["editor"];
            for (var i = 0; i < cnvProperties.length; i++) {
                var div = document.createElement('div');
                div.className = "param";
                div.appendChild(document.createTextNode(cnvProperties[i]['text']));
                div.innerHTML += "<br>";
                switch (cnvProperties[i]['type']) {
                    case 'number':
                        var input = document.createElement('input');
                        input.id = cnvProperties[i]['name'];
                        input.name = cnvProperties[i]['name'];
                        input.value = ns.editor[cnvProperties[i]['name']];
                        input.addEventListener('change', ns.textChanged, false);
                        input.addEventListener('keypress', ns.textChanged, false);
                        input.addEventListener('paste', ns.textChanged, false);
                        input.addEventListener('input', ns.textChanged, false);
                        div.appendChild(input);
                        propertiesPanel.appendChild(div);
                        break;
                    case 'file':
                        var input = document.createElement('input');
                        input.type = cnvProperties[i]['type'];
                        input.id = cnvProperties[i]['name'];
                        input.name = cnvProperties[i]['name'];
                        if (ns.editor[cnvProperties[i]['name']] !== 'not set') {
                            var removeImage = document.createElement('a');
                            removeImage.className = 'boxclose';
                            removeImage.id = 'boxclose';
                            removeImage.name = cnvProperties[i]['name'];
                            div.appendChild(removeImage);
                        }
                        div.appendChild(input);
                        propertiesPanel.appendChild(div);
                        break;
                    case 'color':
                        var input = document.createElement('input');
                        input.className = 'demo1';
                        input.type = "text";
                        input.id = cnvProperties[i]['name'];
                        input.name = cnvProperties[i]['name'];
                        input.value = ns.editor[cnvProperties[i]['name']];
                        input.addEventListener('change', ns.textChanged, false);
                        input.addEventListener('keypress', ns.textChanged, false);
                        input.addEventListener('paste', ns.textChanged, false);
                        input.addEventListener('input', ns.textChanged, false);
                        div.appendChild(input);
                        propertiesPanel.appendChild(div);
                        break;
                }
            }
        }
    }
    $('.demo1').colorpicker().on("changeColor", function (event) {
        ns.textChanged(event);
    });

    $('.boxclose').click(function () {
        if (ns.alteringComponent.component === 'editor') {
            ns.editor.bg_image = 'not set';
            ns.constructProperties(ns.alteringComponent.component, 'boxclose click handler');
        }
        else if (ns.alteringComponent.component === 'selection') {
            console.log('selection  ' + this.name);
            ns.selection.setPropertyValue(this.name, 'not set', ns.components);
            ns.constructProperties(ns.alteringComponent.component, 'boxclose click handler');
        }
        else {
            if (ns.alteringComponent.component) {
                if (ns.alteringComponent.panel) {
                    var panel = ns.components.get(ns.alteringComponent.panel);
                    var child = panel.getChild(ns.alteringComponent.component);
                    child.setPropertyValue(this.name, 'not set');
                    ns.constructProperties(child, 'boxclose click handler');
                }
                else {
                    var component = ns.components.get(ns.alteringComponent.component);
                    component.setPropertyValue(this.name, 'not set');
                    ns.constructProperties(component, 'boxclose click handler');
                }
            }
        }
        ns.drawRectangles();
    });

    $('input[type="file"]').ajaxfileupload({
        'action': 'saveImage.jsp',
        'onComplete': function (response) {
            console.log(response.toString().trim());
            if (ns.alteringComponent.component === "selection") {
                ns.selection.setBackgroundImage(response.toString().trim(), ns.components);
                ns.drawRectangles();
            }
            else if (ns.alteringComponent.component === 'editor') {
                ns.editor.bg_image = response.toString().trim();
                ns.drawRectangles();
            }
            else {
                if (ns.alteringComponent.component) {
                    if (ns.alteringComponent.panel) {
                        var panel = ns.components.get(ns.alteringComponent.panel);
                        var child = panel.getChild(ns.alteringComponent.component);
                        child.setBackgroundImage(response.toString().trim());
                        panel.addChild(child);
                    }
                    else {
                        ns.components.get(ns.alteringComponent.component).setBackgroundImage(response.toString().trim());
                    }
                }
                ns.drawRectangles();
            }
        }
    });
};
//move the component to another position

ns.firstBit = function (x) {
    return Math.floor(Math.log(x | 0) / Math.log(2));
};

ns.getPropertiesForSelection = function (addedComponents) {
    var firstComponent = 1 << ns.firstBit(addedComponents);
    console.log("firstComponent: " + firstComponent);
    var selectionProperties = [];
    switch (firstComponent) {
        case uiEditor.helpers.BUTTON_FLAG:
            selectionProperties = ns.properties["button"];
            break;
        case uiEditor.helpers.DISPLAY_FLAG:
            selectionProperties = ns.properties["display"];
            break;
        case uiEditor.helpers.IMAGE_FLAG:
            selectionProperties = ns.properties["image"];
            break;
        case uiEditor.helpers.PANEL_FLAG:
            selectionProperties = ns.properties["panel"];
            break;
        case uiEditor.helpers.SCREEN_CONTROL_FLAG:
            selectionProperties = ns.properties["screenControl"];
            break;
        case uiEditor.helpers.SOURCE_FLAG:
            selectionProperties = ns.properties["source"];
            break;
        case uiEditor.helpers.TEXT_FLAG:
            selectionProperties = ns.properties["text"];
            break;
    }

    if (selectionProperties.length > 0) {
        if (addedComponents & uiEditor.helpers.BUTTON_FLAG) {
            selectionProperties =
                    ns.propertiesIntersection(selectionProperties, ns.properties["button"]);
        }
        if (addedComponents & uiEditor.helpers.DISPLAY_FLAG) {
            selectionProperties =
                    ns.propertiesIntersection(selectionProperties, ns.properties["display"]);
        }
        if (addedComponents & uiEditor.helpers.IMAGE_FLAG) {
            selectionProperties =
                    ns.propertiesIntersection(selectionProperties, ns.properties["image"]);
        }
        if (addedComponents & uiEditor.helpers.PANEL_FLAG) {
            selectionProperties =
                    ns.propertiesIntersection(selectionProperties, ns.properties["panel"]);
        }
        if (addedComponents & uiEditor.helpers.SCREEN_CONTROL_FLAG) {
            selectionProperties =
                    ns.propertiesIntersection(selectionProperties, ns.properties["screenControl"]);
        }
        if (addedComponents & uiEditor.helpers.SOURCE_FLAG) {
            selectionProperties =
                    ns.propertiesIntersection(selectionProperties, ns.properties["source"]);
        }
        if (addedComponents & uiEditor.helpers.TEXT_FLAG) {
            selectionProperties =
                    ns.propertiesIntersection(selectionProperties, ns.properties["text"]);
        }
    }
    return selectionProperties;
};

ns.move = function (e) {
    if (ns.movingComponent) {
        console.log("****************************************");
        console.log('moving component: ' + ns.movingComponent);
        console.log("altering component: " + ns.alteringComponent);
        console.log("*******************************************");
        var mousePos = ns.getMousePos(e);
        ns.x = mousePos.layerX;
        ns.y = mousePos.layerY;
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
        var mousePos = ns.getMousePos(e);
        ns.x = mousePos.layerX;
        ns.y = mousePos.layerY;
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
    console.log('moveFromPanelDone');
    console.log('panel: ' + ns.movingChildComponent.panel);
    console.log('component: ' + ns.movingChildComponent.component);
    if (ns.movingChildComponent.panel && ns.movingChildComponent.component) {
        var panel = ns.components.get(ns.movingChildComponent.panel);
        var child = panel.getChild(ns.movingChildComponent.component);
        if (!panel.isComponentInside(child)) {
            console.log('component is not inside the panel');
            if (ns.destinationPanel) {
                console.log('destination panel');
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
        ns.alteringComponent.panel = null;
        ns.alteringComponent.component = child.getID();
        ns.destinationPanel = undefined;
    }
};
//set variables, which are used for moving, to their initial values
ns.moveDone = function (e) {
    if (ns.destinationPanel) {
        ns.components.get(ns.movingComponent).deselect();
        ns.components.get(ns.destinationPanel).addChild(ns.components.get(ns.movingComponent));
        ns.components.delete(ns.movingComponent);
    }
    ns.movingComponent = undefined;
    ns.destinationPanel = undefined;
};

ns.mouseMoveResize = function (e) {
    if (ns.isResizing) {
        var mousePos = ns.getMousePos(e);
        ns.x = mousePos.layerX;
        ns.y = mousePos.layerY;

        ns.x = Math.min(mousePos.layerX, ns.startX);
        ns.y = Math.min(mousePos.layerY, ns.startY);

        ns.w = Math.abs(mousePos.layerX - ns.startX);
        ns.h = Math.abs(mousePos.layerY - ns.startY);

        var r;
        if (ns.alteringComponent.panel !== null) {
            var panel = ns.components.get(ns.alteringComponent.panel);
            r = panel.getChild(ns.alteringComponent.component);
        }
        else
            r = ns.components.get(ns.alteringComponent.component);
        r.setX(ns.x);
        r.setY(ns.y);


        r.setWidth(ns.w);
        r.setHeight(ns.h);

        ns.constructProperties(r, "resize component");

        ns.drawRectangles();
    }
};

ns.mouseUpResize = function (e) {
    if (ns.isResizing) {
        ns.isResizing = false;

        if (ns.selection !== null)
        {
            ns.alteringComponent.component = "selection";
            ns.alteringComponent.panel = null;
        }
        ns.constructProperties(ns.components.get(ns.alteringComponent.component), "resize component");
        ns.drawRectangles();
    }
};

//mousemove event handler for creating new component
ns.mouseMove = function (e) {
    var mousePos = ns.getMousePos(e);
    if (ns.isDrawing) {

// get mouse position

        ns.x = mousePos.layerX;
        ns.y = mousePos.layerY;
        //alter mouse position
        //in case if direction of rectangle was changed, i.e. top left corner become different corner
        ns.x = Math.min(mousePos.layerX, ns.startX);
        ns.y = Math.min(mousePos.layerY, ns.startY);
        //calculate width and height
        ns.w = Math.abs(mousePos.layerX - ns.startX);
        ns.h = Math.abs(mousePos.layerY - ns.startY);
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
            ns.w = ns.componentSizes[ns.chosenComponentType].width;
        }

        if (ns.h < ns.componentSizes[ns.chosenComponentType].height) {
            ns.h = ns.componentSizes[ns.chosenComponentType].height;
        }

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
    else if (ns.isSelecting) {
        ns.x = mousePos.layerX;
        ns.y = mousePos.layerY;

        ns.x = Math.min(mousePos.layerX, ns.startX);
        ns.y = Math.min(mousePos.layerY, ns.startY);
        console.log(ns.selectionRectangle.x);
        console.log(ns.selectionRectangle.y);

        ns.w = Math.abs(mousePos.layerX - ns.startX);
        ns.h = Math.abs(mousePos.layerY - ns.startY);

        ns.selectionRectangle.x = ns.x;
        ns.selectionRectangle.y = ns.y;
        ns.selectionRectangle.width = ns.w;
        ns.selectionRectangle.height = ns.h;

        ns.components.forEach(function (value, key) {
            if (ns.isComponentInsideSelection(value)) {
                if (!value.isSelected())
                    value.select();
            }
        });

        ns.drawRectangles();
    }
};
//used to draw all the components {needs to rename}
ns.drawRectangles = function () {
    console.log(ns.editor);
    console.log(ns.editor.bg_color);
    ns.ctx.clearRect(0, 0, ns.c.width, ns.c.height);
    ns.editor.screen_height = Number(ns.editor.screen_height);
    ns.editor.screen_width = Number(ns.editor.screen_width);

    ns.c.width = ns.editor.screen_width;
    ns.c.height = ns.editor.screen_height;
    if (ns.editor.bg_image !== 'not set') {
        ns.image.src = ns.editor.bg_image;
        ns.ctx.drawImage(ns.image, 0, 0, ns.c.width, ns.c.height);
    }
    else {
        console.log('coloring bg')
        ns.ctx.save();
        ns.ctx.fillStyle = ns.editor.bg_color;
        ns.ctx.fillRect(0, 0, ns.c.width, ns.c.height);
        ns.ctx.restore();
    }

    var buf = [];
    ns.components.forEach(function (value, key) {
        buf.push(value);
    });
    if (buf.length > 0) {
        buf.sort(function (a, b) {
            if (a.getZ_index() < b.getZ_index())
                return -1;
            else if (a.getZ_index() > b.getZ_index())
                return 1;
            return 0;
        });
        for (var i = 0; i < buf.length; i++) {
            buf[i].draw(ns.ctx);
        }
    }

    if (ns.isSelecting) {
        ns.ctx.save();
        ns.ctx.fillStyle = "#71dee8";
        ns.ctx.globalAlpha = 0.2;
        ns.ctx.fillRect(ns.selectionRectangle.x, ns.selectionRectangle.y, ns.selectionRectangle.width, ns.selectionRectangle.height);
        ns.ctx.restore();
    }

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
    //selection related operations

    if (ns.selection === null) {
        ns.selection = new uiEditor.components.GroupSelection();
    }

    if (ns.isSelecting) {
        ns.isSelecting = false;
        var addedComponents = 0;
        ns.components.forEach(function (value, key) {
            if (value.isSelected()) {
                ns.selection.addToSelection(key, ns.components);
                addedComponents++;
            }
        });
        if (addedComponents > 0) {
            ns.alteringComponent.component = "selection";
            ns.alteringComponent.panel = null;
        }
    }
    /*****************************/

    ns.isDrawing = false;
    ns.drawingPanel = undefined;
    ns.drawRectangles();
    if (ns.alteringComponent.component === "selection") {
        ns.constructProperties(ns.alteringComponent.component, "mouseUp_selection");
    }
    else if (ns.alteringComponent.component === "editor") {
        ns.constructProperties(ns.alteringComponent.component, "mouseUp_canvas");
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
    ns.chosenComponentType = null;
};
ns.saveToJson = function () {
    var screenObject = new uiEditor.components.ScreenObject();
    var obj = {"button": [], "text": [], "image": [], "panel": [], "group": []};
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
    obj.idSpecifier = ns.idSpecifier.getPropertiesForJSON();
    obj.editor = ns.editor;
    var jsonData = JSON.stringify(obj, null, 5);
    var params = "jsonFile=" + encodeURIComponent(jsonData);
    if (ns.fileName === null) {
        ns.fileName = prompt("Please, enter project name");
    }
    if (ns.fileName !== null && ns.fileName !== "") {
        if (ns.fileName.indexOf('/json/') < 0)
            ns.fileName = "/json/" + ns.fileName;
        if (ns.fileName.indexOf('.json') < 0)
            ns.fileName += '.json';
        params += "&fileName=" + ns.fileName;
    }
    $.ajax({
        url: 'saveFile.jsp',
        type: "POST",
        data: params,
        success: function (res) {
            window.open('saveFile.jsp', '_blank');
        }
    });
};

ns.saveAs = function () {
    ns.fileName = prompt("Please, enter project name");
    ns.saveToJson();
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
            if (ns.displayCreated === true) {
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
ns.redirect = function (url) {
    window.location = url;
};

ns.isComponentInsideSelection = function (testComponent) {
    var x = ns.selectionRectangle.x;
    var y = ns.selectionRectangle.y;
    var h = ns.selectionRectangle.height;
    var w = ns.selectionRectangle.width;

    var X = testComponent.getX();
    var Y = testComponent.getY();
    var W = testComponent.getWidth();
    var H = testComponent.getHeight();


    if (X < x || Y < y) {
        return false;
    }
    w += x;
    W += X;
    if (W <= X) {
        if (w >= x || W > w)
            return false;
    } else {
        if (w >= x && W > w)
            return false;
    }
    h += y;
    H += Y;
    if (H <= Y) {
        if (h >= y || H > h)
            return false;
    } else {
        if (h >= y && H > h)
            return false;
    }
    return true;
};
/******************************************************************/





