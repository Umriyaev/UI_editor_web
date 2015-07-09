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
ns.isDrawing = false;
ns.w, ns.h, ns.x, ns.y, ns.c, ns.ctx;
ns.componentCounter = 0;
ns.components = new Map();
ns.movingComponent = null;
ns.alteringComponent = null;
ns.chosenComponentType = null;
ns.moveX = null, ns.moveY = null;
ns.drawingPanel = undefined;
ns.destinationPanel = undefined;
ns.movingChildComponent = {"panel": undefined, "component": undefined};
/*  startX, startY - nachal'ne koordinaty risovaniya komponenta
 * isDrawing - true if we are drawing new component
 * w,h,x,y - width, height, posX and posY of the currently being drawn component
 * ctx - canvas context
 * componentCounter - number of all the components, which are already drawn
 * components - array of all the components
 * movingComponent - if we started moving component, it will point to that component
 * chosenComponentType - type of component to draw
 * drawingPanel - panel on which we are drawing. If drawing panel is undefined, then we draw on canvas
 * destinationPanel - panel on which we are moving the component
 * movingChildComponent - component, which is being moved from inside of panel*/

/*Chosen component might be
 * text
 * button
 * table
 * panel
 * image
 * null*/


//constants
ns.DELETE_BUTTON = 46;
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
    "table": [
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
    ]
};

//initial setting of event handlers
ns.init = function () {
    ns.c = document.getElementById("myCanvas");
    ns.ctx = ns.c.getContext("2d");
    ns.c.addEventListener("mousedown", function (e) {
        ns.draw(e);
    }, false);
    ns.c.addEventListener("mousemove", function (e) {
        ns.mouseMove(e);
    }, false);
    ns.c.addEventListener("mouseup", function (e) {
        ns.mouseUp(e);
    }, false);
    ns.c.addEventListener('contextmenu', ns.contextMenuHandler, false);
    window.addEventListener("keydown", ns.keyPressHandler, false);
};




ns.contextMenuHandler = function (e) {
    console.log('You tried to call context menu');
    console.log(e);
    e.preventDefault();
};


//handle key press events
ns.keyPressHandler = function (e) {
    if (e.keyCode === ns.DELETE_BUTTON) {
        ns.components.delete(ns.alteringComponent);
        ns.alteringComponent = undefined;
        ns.constructProperties(undefined);
        ns.drawRectangles();
    }
    return false;
};

//update properties of the components after changing values on properties panel
ns.textChanged = function (e) {
    var input = e.target;  //target which fired the event
    var propertyName = input.name;  //get the name of property
    var propertyValue = input.value; //get value of property
    ns.components.get(ns.alteringComponent).setPropertyValue(propertyName, propertyValue); //update component with new property value
    ns.drawRectangles(); //redraw all the components
};


//update background image of the image component after loading the user image
ns.fileChanged = function (e) {
    var reader = new FileReader(); //File reader API
    reader.onload = function (event) {
        ns.components.get(ns.alteringComponent).setBackgroundImage(event.target.result);
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
ns.draw = function (e) {

    var x = e.layerX;
    var y = e.layerY;
    ns.startX = x;
    ns.startY = y;
    var hitTestResult = ns.hitTest(x, y);

    var hitComponent = hitTestResult.component;
    var hitPanel = hitTestResult.panel;
    if (hitComponent) {  //if mouse is pressed on the previously added component

        ns.moveX = x;
        ns.moveY = y;

        if (!hitPanel) {
            ns.movingComponent = hitComponent;
            ns.alteringComponent = hitComponent;
            ns.constructProperties(ns.components.get(ns.alteringComponent));
            ns.c.addEventListener('mousemove', ns.move, false); //event handler for changing component's position (move component)
            ns.c.addEventListener('mouseup', ns.moveDone, false); //finish moving component
        }
        else {
            ns.movingChildComponent.panel = hitPanel;
            ns.movingChildComponent.component = hitComponent;
            ns.constructProperties(ns.components.get(hitPanel).getChild(hitComponent));
            ns.c.addEventListener('mousemove', ns.moveFromPanel, false);
            ns.c.addEventListener('mouseup', ns.moveFromPanelDone, false);
        }
    }
    else if (ns.chosenComponentType !== null) { //if componentType is chosen from toolbox
        ns.c.addEventListener('mousemove', ns.mouseMove, false); //event handler for changing size of component which is being drawn
        ns.c.addEventListener('mouseup', ns.mouseUp, false); //finish component creation
        ns.w = ns.INITIAL_WIDTH; //initial width (global var)
        ns.h = ns.INITIAL_HEIGHT; //initial height (global var)
        ns.isDrawing = true; //switch to draw mode
        ns.componentCounter++;
        //rects['rectangle' + rectCounter] = new uiEditor.test.Rectangle(x, y, w, h);
//        switch (ns.chosenComponentType) { //create component based on the type of chosen component
//            case "button":
//                ns.components.set('component' + ns.componentCounter, new uiEditor.components.ButtonComponent('component' + ns.componentCounter, x, y, ns.w, ns.h));
//                break;
//            case "text":
//                ns.components.set('component' + ns.componentCounter, new uiEditor.components.TextComponent('component' + ns.componentCounter, x, y, ns.w, ns.h));
//                break;
//            case "table":
//                ns.components.set('component' + ns.componentCounter, new uiEditor.components.TableComponent('component' + ns.componentCounter, x, y, ns.w, ns.h, 6, 2));
//                break;
//            case "image":
//                ns.components.set('component' + ns.componentCounter, new uiEditor.components.ImageComponent('component' + ns.componentCounter, x, y, ns.w, ns.h));
//                break;
//            case "panel":
//                ns.components.set('component' + ns.componentCounter, new uiEditor.components.PanelComponent('component' + ns.componentCounter, x, y, ns.w, ns.h, "header"));
//                break;
//        }
        var component = ns.createComponent(ns.chosenComponentType, x, y);

        if (hitPanel === undefined) {
            ns.components.set(component.id, component.component);
        }
        else {
            var panel = ns.components.get(hitPanel);
            panel.addChild(component.component);
            ns.drawingPanel = hitPanel;
        }

        ns.alteringComponent = 'component' + ns.componentCounter;
    }
};


ns.createComponent = function (componentType, x, y) {
    var component = {"id": undefined, "component": null};
    switch (componentType) {
        case "button":
            //ns.components.set('component' + ns.componentCounter, new uiEditor.components.ButtonComponent('component' + ns.componentCounter, x, y, ns.w, ns.h));
            component.id = 'component' + ns.componentCounter;
            component.component = new uiEditor.components.ButtonComponent('component' + ns.componentCounter, x, y, ns.w, ns.h);
            break;
        case "text":
            //ns.components.set('component' + ns.componentCounter, new uiEditor.components.TextComponent('component' + ns.componentCounter, x, y, ns.w, ns.h));
            component.id = 'component' + ns.componentCounter;
            component.component = new uiEditor.components.TextComponent('component' + ns.componentCounter, x, y, ns.w, ns.h);
            break;
        case "table":
            //ns.components.set('component' + ns.componentCounter, new uiEditor.components.TableComponent('component' + ns.componentCounter, x, y, ns.w, ns.h, 6, 2));
            component.id = 'component' + ns.componentCounter;
            component.component = new uiEditor.components.TableComponent('component' + ns.componentCounter, x, y, ns.w, ns.h, 6, 2);
            break;
        case "image":
            //ns.components.set('component' + ns.componentCounter, new uiEditor.components.ImageComponent('component' + ns.componentCounter, x, y, ns.w, ns.h));
            component.id = 'component' + ns.componentCounter;
            component.component = new uiEditor.components.ImageComponent('component' + ns.componentCounter, x, y, ns.w, ns.h);
            break;
        case "panel":
            //ns.components.set('component' + ns.componentCounter, new uiEditor.components.PanelComponent('component' + ns.componentCounter, x, y, ns.w, ns.h, "header"));
            component.id = 'component' + ns.componentCounter;
            component.component = new uiEditor.components.PanelComponent('component' + ns.componentCounter, x, y, ns.w, ns.h, "header");
            break;
    }
    return component;
};


// check if component is clicked or not
ns.hitTest = function (testX, testY) {
    var result = {"panel": undefined, "component": undefined};
    ns.components.forEach(function (value, key) {
        var temp = value.hitTest(testX, testY);
        if (temp.hit) {
            result.panel = temp.panel;
            result.component = temp.component;
        }
    });
    return result;
};



ns.hitToPanelTest = function (testX, testY, testComponent) {
    var panels = [];
    var hitPanel = undefined;
    console.log("inside the hitToPanelTest");
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
                console.log(hitPanel);
            }
        }
    }
    console.log("hitToPanelTest finished");
    return hitPanel;

    //console.log('moving panel: '+ns.movingComponent);


};

//construct properties panel
ns.constructProperties = function (component) {

    var propertiesPanel = document.getElementById('properties');

    //clear properties panel
    while (propertiesPanel.firstChild) {
        propertiesPanel.removeChild(propertiesPanel.firstChild);
    }
    if (component !== undefined) {
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
            if (propertyNames[i]['type'] !== 'file') {
                input.value = component.getPropertyValue(propertyNames[i]['name']);

                //add change event listener for every event of the text input
                input.addEventListener('change', ns.textChanged, false);
                input.addEventListener('keypress', ns.textChanged, false);
                input.addEventListener('paste', ns.textChanged, false);
                input.addEventListener('input', ns.textChanged, false);
            }
            else {
                input.filename = component.getPropertyValue(propertyNames[i]['name']);

                //add event listener for file uploader
                input.addEventListener('change', ns.fileChanged, false);
            }
            div.appendChild(input);
            propertiesPanel.appendChild(div);
        }
    }
//    var buttonDiv = document.createElement('div');
//    buttonDiv.className = 'param right';
//    var btn = document.createElement('button');
//    btn.innerText = 'Save';
//    btn.addEventListener('click', saveChanges, false);
//    buttonDiv.appendChild(btn);
//    propertiesPanel.appendChild(buttonDiv);
};


//event listener for button (currently removed. used to change properties on button click, 
//not immediately after changing text input values)
ns.saveChanges = function (e) {
    var component = ns.components.get(ns.alteringComponent); //get the selected component
    var type = component.getComponentType(); //get component's type
    var propertyNames = ns.properties[type]; //get component's properties
    //get inputs by their ids, and get their values 
    //and update component with new property values
    for (var i = 0; i < propertyNames.length; i++) {
        var input = document.getElementById(propertyNames[i]['name']);
        var propName = input.name;
        var propValue = input.value;
        component.setPropertyValue(propName, propValue);
    }
    ns.components.set(ns.alteringComponent, component);
    ns.drawRectangles();
};

//move the component to another position
ns.move = function (e) {
    if (ns.movingComponent) {


        ns.x = e.layerX;
        ns.y = e.layerY;


//        var hittestResult = ns.hitTest(ns.x, ns.y);
//        if (hittestResult !== undefined) {
//            var hitComponent = ns.components.get(hittestResult);
//            if (hitComponent.getComponentType() === "panel") {
//                var component = ns.components.get(ns.movingComponent);
//                ns.components.delete(ns.movingComponent);
//                hitComponent.addChild(component);
//                ns.movingComponent = null;
//                ns.drawRectangles();
//            }
//            else {
        var dx = ns.x - ns.moveX;
        var dy = ns.y - ns.moveY;
        ns.moveX = ns.x;
        ns.moveY = ns.y;
        ns.components.get(ns.movingComponent).move(dx, dy);

        ns.destinationPanel = ns.hitToPanelTest(ns.x, ns.y, ns.components.get(ns.movingComponent));

//        console.log('hit panel: '+hitPanelTestResult);
//        if(hitPanelTestResult!==undefined){
//            ns.components.get(hitPanelTestResult).addChild(ns.components.get(ns.movingComponent));
//            ns.components.delete(ns.movingComponent);
//        }

        ns.drawRectangles();
        ns.constructProperties(ns.components.get(ns.movingComponent));
//            }
//        }


    }
};

ns.moveFromPanel = function (e) {
    if (ns.movingChildComponent.component && ns.movingChildComponent.panel) {
        ns.x = e.layerX;
        ns.y = e.layerY;
        var dx = ns.x - ns.moveX;
        var dy = ns.y - ns.moveY;
        ns.components.get(ns.movingChildComponent.panel).getChild(ns.movingChildComponent.component).move(dx, dy);
        ns.destinationPanel = ns.hitToPanelTest(ns.x, ns.y,
                ns.components.get(
                        ns.movingChildComponent.parent).getChild(
                ns.movingChildComponent.component));

        ns.drawRectangles();
        ns.constuctProperties(ns.components.get(ns.movingChildComponent.parent).getChild(ns.movingChildComponent.component));
    }
};

ns.moveFromPanelDone = function (e) {
    if (!ns.components.get(
            ns.movingChildComponent.panel)
            .isComponentInside(
                    ns.components.get(
                            ns.movingChildComponent.panel)
                    .getChild(
                            ns.movingChildComponent.component))) {
        if (ns.destinationPanel) {
            var component = ns.components.get(
                    ns.movingChildComponent.panel).getChild(
                    ns.movingChildComponent.component);
            ns.components.get(ns.movingChildComponent.panel).removeChild(ns.movingChildComponent.component);
            ns.components.get(ns.destinationPanel).addChild(component);
        }
        
    }
    
    ns.movingChildComponent.panel = undefined;
    ns.movingChildComponent.component = undefined;
    ns.hitTestResult=undefined;
    ns.destinationPanel=undefined;
};

//set variables, which are used for moving, to their initial values
ns.moveDone = function (e) {
    if (ns.destinationPanel) {
        ns.components.get(ns.destinationPanel).addChild(ns.components.get(ns.movingComponent));
        ns.components.delete(ns.movingComponent);
    }
    ns.movingComponent = undefined;
    ns.hitTestResult = undefined;
    ns.destinationPanel = undefined;
};

//mousemove event handler for creating new component
ns.mouseMove = function (e) {
    if (ns.isDrawing) {

// get mouse position
        ns.x = e.layerX;
        ns.y = e.layerY;
        //alter mouse position
        //in case if direction of rectangle was changed, i.e. top left corner become different corner
        ns.x = Math.min(e.layerX, ns.startX);
        ns.y = Math.min(e.layerY, ns.startY);
        //ctx.clearRect(0, 0, c.width, c.height);

        //calculate width and height
        ns.w = Math.abs(e.layerX - ns.startX);
        ns.h = Math.abs(e.layerY - ns.startY);
        //set width and height of current rectangle to the calculated value

        var r;
        if (ns.drawingPanel === undefined) {
            r = ns.components.get('component' + ns.componentCounter);
        }
        else {
            r = ns.components.get(ns.drawingPanel).getChild('component' + ns.componentCounter);
        }
        r.setX(ns.x);
        r.setY(ns.y);
        r.setWidth(ns.w);
        r.setHeight(ns.h);
        //ns.components.set('component' + ns.componentCounter, r);

        if (ns.drawingPanel === undefined) {
            ns.components.set('component' + ns.componentCounter, r);
        }
        else {
            ns.components.get(ns.drawingPanel).addChild(r);
        }

        ns.drawRectangles();
    }
};

//used to draw all the components {needs to rename}
ns.drawRectangles = function () {
    ns.cleanUp();
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
    //chosenComponentType = null;
    // constructProperties(components[alteringComponent]);
    ns.drawRectangles();
    ns.constructProperties(ns.components.get(ns.alteringComponent));

};

ns.saveToJson = function () {
    var obj = {"button": [], "text": [], "image": [], "table": [], "panel": []};
    ns.components.forEach(function (value, key) {
        switch (value.getComponentType()) {
            case "text":
                obj.text.push(value.getProperties());
                break;
            case "button":
                obj.button.push(value.getProperties());
                break;
            case "image":
                obj.image.push(value.getProperties());
                break;
            case "table":
                obj.table.push(value.getProperties());
                break;
            case "panel":
                obj.panel.push(value.getProperties());
                break;

            default:
                break;
        }
    });
    console.log(JSON.stringify(obj, null, 5));
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
        case "table":
            ns.chosenComponentType = "table";
            break;
        case "image":
            ns.chosenComponentType = "image";
            break;
        case "panel":
            ns.chosenComponentType = "panel";
            break;
        default:
            ns.chosenComponentType = null;
    }
};


