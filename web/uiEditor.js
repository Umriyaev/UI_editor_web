/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//create namespace for uiEditor
var uiEditor = uiEditor || {};
//subnamespace for components
uiEditor.components = uiEditor.components || {};
/*********************Image component class**********************/
uiEditor.components.ImageComponent = (function () {

    //constructor of ImageComponent
    function ImageComponent(id, x, y, w, h) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.componentType = "image";
        this.width = w;
        this.height = h;
        this.backgroundImage = 'images/dummy-image.jpg';
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.properties = {};
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['image url'] = 'images/dummy-image.jpg';
    }

    /*****************Getters************************/
    ImageComponent.prototype.getX = function () {
        //return this.x;
        return this.properties['xPosition'];
    };
    ImageComponent.prototype.getY = function () {
        // return this.y;
        return this.properties['yPosition'];
    };
    ImageComponent.prototype.getWidth = function () {
        //return this.width;
        return this.properties['width'];
    };
    ImageComponent.prototype.getHeight = function () {
        //return this.height;
        return this.properties['height'];
    };
    ImageComponent.prototype.getBackgroundImage = function () {
        return this.properties['image url'];
    };
    ImageComponent.prototype.getID = function () {
        return this.id;
    };
    ImageComponent.prototype.getComponentType = function () {
        return this.componentType;
    };

    ImageComponent.prototype.getPropertyValue = function (propertyName) {
        return this.properties[propertyName];
    };
    ImageComponent.prototype.getProperties = function () {
        return this.properties;
    };
    /*************************************************/



    /****************Setters**************************/
    ImageComponent.prototype.setX = function (x) {
        this.x = x;
        this.properties['xPosition'] = x;
    };
    ImageComponent.prototype.setY = function (y) {
        this.y = y;
        this.properties['yPosition'] = y;
    };
    ImageComponent.prototype.setWidth = function (w) {
        this.width = w;
        this.properties['width'] = w;
    };
    ImageComponent.prototype.setHeight = function (h) {
        this.height = h;
        this.properties['height'] = h;
    };
    ImageComponent.prototype.setBackgroundImage = function (imageSource) {
        this.backgroundImage = imageSource;
        this.properties['image url'] = imageSource;
    };
    ImageComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        console.log(typeof propertyValue);
        this.properties[propertyName] = propertyValue;
    };

    /*************************************************/

    ImageComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": undefined};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                y >= this.getY() && y <= this.getY() + this.getHeight()) {
            result.hit = true;
            console.log(result);
        }
        return result;
    };



    ImageComponent.prototype.move = function (dx, dy) {
        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);
    };


    ImageComponent.prototype.draw = function (ctx) {
        this.properties['xPosition'] = Number(this.properties['xPosition']);
        this.properties['yPosition'] = Number(this.properties['yPosition']);
        this.properties['width'] = Number(this.properties['width']);
        this.properties['height'] = Number(this.properties['height']);

        var image = new Image();
        image.src = this.properties['image url'];
        ctx.drawImage(image, this.properties['xPosition'], this.properties['yPosition'], this.properties['width'], this.properties['height']);
    };
    return ImageComponent;
})();
/*****************************************************************/

/*******************Text component class********************/
uiEditor.components.TextComponent = (function () {
    function TextComponent(id, x, y, w, h) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.placeholderText = "placeholder text";
        this.radius = 10;
        this.componentType = "text";
        this.properties = {};
        this.properties['xPosition'] = x;
        this.properties['radius'] = 10;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['placeholder text'] = "placeholder text";
    }

    /*****************Getters************************/
    TextComponent.prototype.getRadius = function () {
        return this.radius;
    };
    TextComponent.prototype.getX = function () {
        //return this.x;
        return this.properties['xPosition'];
    };
    TextComponent.prototype.getY = function () {
        // return this.y;
        return this.properties['yPosition'];
    };
    TextComponent.prototype.getWidth = function () {
        //return this.width;
        return this.properties['width'];
    };
    TextComponent.prototype.getHeight = function () {
        //return this.height;
        return this.properties['height'];
    };
    TextComponent.prototype.getID = function () {
        return this.id;
    };
    TextComponent.prototype.getPlaceholderText = function () {
        return this.properties['placeholder text'];
    };
    TextComponent.prototype.getComponentType = function () {
        return this.componentType;
    };
    TextComponent.prototype.getPropertyValue = function (propertyName) {
        return this.properties[propertyName];
    };
    TextComponent.prototype.getProperties = function () {
        return this.properties;
    };
    /*************************************************/



    /****************Setters**************************/
    TextComponent.prototype.setRadius = function (radius) {
        this.radius = radius;
    };
    TextComponent.prototype.setX = function (x) {
        this.x = x;
        this.properties['xPosition'] = x;
    };
    TextComponent.prototype.setY = function (y) {
        this.y = y;
        this.properties['yPosition'] = y;
    };
    TextComponent.prototype.setWidth = function (w) {
        this.width = w;
        this.properties['width'] = w;
    };
    TextComponent.prototype.setHeight = function (h) {
        this.height = h;
        this.properties['height'] = h;
    };
    TextComponent.prototype.setPlaceholderText = function (placeholderText) {
        this.placeholderText = placeholderText;
        this.properties['placeholder text'] = placeholderText;
    };
    TextComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    /*************************************************/

    TextComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": undefined};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                y >= this.getY() && y <= this.getY() + this.getHeight()) {
            result.hit = true;
        }
        return result;
    };

    TextComponent.prototype.move = function (dx, dy) {
        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);
    };

    TextComponent.prototype.draw = function (ctx) {
        this.properties['xPosition'] = Number(this.properties['xPosition']);
        this.properties['yPosition'] = Number(this.properties['yPosition']);
        this.properties['width'] = Number(this.properties['width']);
        this.properties['height'] = Number(this.properties['height']);


        ctx.beginPath();
        ctx.moveTo(this.properties['xPosition'] +
                this.properties['radius'],
                this.properties['yPosition']);
        ctx.lineTo(this.properties['xPosition'] +
                this.properties['width'] -
                this.properties['radius'],
                this.properties['yPosition']);
        ctx.quadraticCurveTo(this.properties['xPosition'] +
                this.properties['width'],
                this.properties['yPosition'],
                this.properties['xPosition'] +
                this.properties['width'],
                this.properties['yPosition'] +
                this.properties['radius']);
        ctx.lineTo(this.properties['xPosition'] +
                this.properties['width'],
                this.properties['yPosition'] +
                this.properties['height'] -
                this.properties['radius']);
        ctx.quadraticCurveTo(this.properties['xPosition'] +
                this.properties['width'],
                this.properties['yPosition'] +
                this.properties['height'],
                this.properties['xPosition'] +
                this.properties['width'] -
                this.properties['radius'],
                this.properties['yPosition'] +
                this.properties['height']);
        ctx.lineTo(this.properties['xPosition'] +
                this.properties['radius'],
                this.properties['yPosition'] +
                this.properties['height']);
        ctx.quadraticCurveTo(this.properties['xPosition'],
                this.properties['yPosition'] +
                this.properties['height'],
                this.properties['xPosition'],
                this.properties['yPosition'] +
                this.properties['height'] -
                this.properties['radius']);
        ctx.lineTo(this.properties['xPosition'],
                this.properties['yPosition'] +
                this.properties['radius']);
        ctx.quadraticCurveTo(this.properties['xPosition'],
                this.properties['yPosition'],
                this.properties['xPosition'] +
                this.properties['radius'],
                this.properties['yPosition']);
        ctx.closePath();
        ctx.stroke();
        if (this.properties['placeholder text'] !== null) {
            ctx.save();
            ctx.fillStyle = "#aaa";
            ctx.font = "20px Arial";
            ctx.textAlign = "left";
            ctx.fillText(this.properties['placeholder text'], this.properties['xPosition'] + 20, this.properties['yPosition'] + this.properties['height'] / 2 + 5);
            ctx.restore();
        }
    };
    return TextComponent;
})();
/***********************************************************/

/*******************Table component class*********************/
uiEditor.components.TableComponent = (function () {
    function TableComponent(id, x, y, w, h, numberOfColumns, numberOfRows) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.numberOfColumns = numberOfColumns;
        this.numberOfRows = numberOfRows;
        this.componentType = "table";
        this.properties = {};
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['rows'] = numberOfRows;
        this.properties['cols'] = numberOfColumns;
    }

    /*****************Getters************************/
    TableComponent.prototype.getX = function () {
        //return this.x;
        return this.properties['xPosition'];
    };
    TableComponent.prototype.getY = function () {
        //return this.y;
        return this.properties['yPosition'];
    };
    TableComponent.prototype.getWidth = function () {
        //return this.width;
        return this.properties['width'];
    };
    TableComponent.prototype.getHeight = function () {
        //return this.height;
        return this.properties['height'];
    };
    TableComponent.prototype.getID = function () {
        return this.id;
    };
    TableComponent.prototype.getNumberOfRows = function () {
        return this.numberOfRows;
    };
    TableComponent.prototype.getNumberOfColumns = function () {
        return this.numberOfColumns;
    };
    TableComponent.prototype.getComponentType = function () {
        return this.componentType;
    };
    TableComponent.prototype.getPropertyValue = function (propertyName) {
        return this.properties[propertyName];
    };
    TableComponent.prototype.getProperties = function () {
        return this.properties;
    };
    /*************************************************/



    /****************Setters**************************/
    TableComponent.prototype.setX = function (x) {
        this.x = x;
        this.properties['xPosition'] = x;
    };
    TableComponent.prototype.setY = function (y) {
        this.y = y;
        this.properties['yPosition'] = y;
    };
    TableComponent.prototype.setWidth = function (w) {
        this.width = w;
        this.properties['width'] = w;
    };
    TableComponent.prototype.setHeight = function (h) {
        this.height = h;
        this.properties['height'] = h;
    };
    TableComponent.prototype.setNumberOfColumns = function (numberOfColumns) {
        this.numberOfColumns = numberOfColumns;
        this.properties['cols'] = numberOfColumns;
    };
    TableComponent.prototype.setNumberOfRows = function (numberOfRows) {
        this.numberOfRows = numberOfRows;
        this.properties['rows'] = numberOfRows;
    };
    TableComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    /*************************************************/

    TableComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": undefined};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                y >= this.getY() && y <= this.getY() + this.getHeight()) {
            result.hit = true;
        }
        return result;
    };

    TableComponent.prototype.move = function (dx, dy) {
        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);
    };

    TableComponent.prototype.draw = function (ctx) {
        this.properties['width'] = Number(this.properties['width']);
        this.properties['height'] = Number(this.properties['height']);
        this.properties['xPosition'] = Number(this.properties['xPosition']);
        this.properties['yPosition'] = Number(this.properties['yPosition']);
        this.properties['rows'] = Number(this.properties['rows']);
        this.properties['cols'] = Number(this.properties['cols']);


        if (this.properties['width'] % this.properties['cols'] !== 0) {
            this.properties['width'] +=
                    this.properties['cols'] - (this.properties['width'] % this.properties['cols']);
        }
        if (this.properties['height'] % this.properties['rows'] !== 0) {
            this.properties['height'] +=
                    this.properties['rows'] - (this.properties['height'] % this.properties['rows']);
        }
        ctx.beginPath();
        for (var x = this.properties['xPosition'];
                x < this.properties['width'] + this.properties['xPosition'];
                x += this.properties['width'] / this.properties['cols']) {
            ctx.moveTo(x, this.properties['yPosition']);
            ctx.lineTo(x, this.properties['yPosition'] + this.properties['height']);
        }
        ctx.moveTo(this.properties['xPosition'] + this.properties['width'],
                this.properties['yPosition']);
        ctx.lineTo(this.properties['xPosition'] + this.properties['width'],
                this.properties['yPosition'] + this.properties['height']);
        for (var y = this.properties['yPosition'];
                y < this.properties['height'] + this.properties['yPosition'];
                y += this.properties['height'] / this.properties['rows']) {
            ctx.moveTo(this.properties['xPosition'], y);
            ctx.lineTo(this.properties['xPosition'] + this.properties['width'], y);
        }

        ctx.moveTo(this.properties['xPosition'],
                this.properties['yPosition'] + this.properties['height']);
        ctx.lineTo(this.properties['xPosition'] + this.properties['width'],
                this.properties['yPosition'] + this.properties['height']);
        ctx.closePath();
        ctx.stroke();
    };
    return TableComponent;
})();
/*************************************************************/

/*********************Button component************************/
uiEditor.components.ButtonComponent = (function () {
    function ButtonComponent(id, x, y, w, h) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.text = "button"; //text on button, if necessary
        this.radius = 10;
        this.componentType = "button";
        this.properties = {};
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['text'] = 'button';
        this.properties['radius'] = 10;
    }

    /*****************Getters************************/
    ButtonComponent.prototype.getX = function () {
        //return this.x;
        return this.properties['xPosition'];
    };
    ButtonComponent.prototype.getY = function () {
        //return this.y;
        return this.properties['yPosition'];
    };
    ButtonComponent.prototype.getWidth = function () {
        //return this.width;
        return this.properties['width'];
    };
    ButtonComponent.prototype.getHeight = function () {
        //return this.height;
        return this.properties['height'];
    };
    ButtonComponent.prototype.getID = function () {
        return this.id;
    };
    ButtonComponent.prototype.getText = function () {
        return this.properties['text'];
    };
    ButtonComponent.prototype.getComponentType = function () {
        return this.componentType;
    };
    ButtonComponent.prototype.getPropertyValue = function (propertyName) {
        return this.properties[propertyName];
    };
    ButtonComponent.prototype.getProperties = function () {
        return this.properties;
    };
    /*************************************************/



    /****************Setters**************************/
    ButtonComponent.prototype.setX = function (x) {
        this.x = x;
        this.properties['xPosition'] = x;
    };
    ButtonComponent.prototype.setY = function (y) {
        this.y = y;
        this.properties['yPosition'] = y;
    };
    ButtonComponent.prototype.setWidth = function (w) {
        this.width = w;
        this.properties['width'] = w;
    };
    ButtonComponent.prototype.setHeight = function (h) {
        this.height = h;
        this.properties['height'] = h;
    };
    ButtonComponent.prototype.setText = function (text) {
        this.text = text;
        this.properties['text'] = text;
    };
    ButtonComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    /*************************************************/

    ButtonComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": undefined};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                y >= this.getY() && y <= this.getY() + this.getHeight()) {
            result.hit = true;
        }
        return result;
    };

    ButtonComponent.prototype.move = function (dx, dy) {
        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);
    };

    ButtonComponent.prototype.draw = function (ctx) {
        this.properties['xPosition'] = Number(this.properties['xPosition']);
        this.properties['yPosition'] = Number(this.properties['yPosition']);
        this.properties['width'] = Number(this.properties['width']);
        this.properties['height'] = Number(this.properties['height']);

        ctx.save();
        var gradient = ctx.createLinearGradient(0, 0, 0, 170);
        gradient.addColorStop(0, "#e4e4e4");
        gradient.addColorStop(0, "#f1f1f1");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.properties['xPosition'] + this.properties['radius'],
                this.properties['yPosition']);
        ctx.lineTo(this.properties['xPosition'] + this.properties['width'] -
                this.properties['radius'],
                this.properties['yPosition']);
        ctx.quadraticCurveTo(this.properties['xPosition'] + this.properties['width'],
                this.properties['yPosition'],
                this.properties['xPosition'] + this.properties['width'],
                this.properties['yPosition'] + this.properties['radius']);
        ctx.lineTo(this.properties['xPosition'] + this.properties['width'],
                this.properties['yPosition'] + this.properties['height'] - this.properties['radius']);
        ctx.quadraticCurveTo(this.properties['xPosition'] + this.properties['width'],
                this.properties['yPosition'] + this.properties['height'],
                this.properties['xPosition'] + this.properties['width'] - this.properties['radius'],
                this.properties['yPosition'] + this.properties['height']);
        ctx.lineTo(this.properties['xPosition'] + this.properties['radius'],
                this.properties['yPosition'] + this.properties['height']);
        ctx.quadraticCurveTo(this.properties['xPosition'],
                this.properties['yPosition'] + this.properties['height'],
                this.properties['xPosition'],
                this.properties['yPosition'] + this.properties['height'] - this.properties['radius']);
        ctx.lineTo(this.properties['xPosition'],
                this.properties['yPosition'] + this.properties['radius']);
        ctx.quadraticCurveTo(this.properties['xPosition'],
                this.properties['yPosition'],
                this.properties['xPosition'] + this.properties['radius'],
                this.properties['yPosition']);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        if (this.text !== null) {
            ctx.save();
            ctx.fillStyle = "#000";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.getText(), this.properties['xPosition'] + this.properties['width'] / 2, this.properties['yPosition'] + this.properties['height'] / 2 + 5);
            ctx.restore();
        }
        ctx.restore();
    };
    return ButtonComponent;
})();
/*************************************************************/


/*********************Panel component*************************/
uiEditor.components.PanelComponent = (function () {
    function PanelComponent(id, x, y, w, h, headerText) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.headerText = headerText; //text on button, if necessary
        // this.radius = 10;
        this.componentType = "panel";
        this.properties = {};
        this.properties['headerHeight'] = 40;
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['headerText'] = headerText;
        this.properties['children'] = new Map();
        //this.properties['radius'] = 10;
    }

    /*****************Getters************************/
    PanelComponent.prototype.getX = function () {
        //return this.x;
        return this.properties['xPosition'];
    };
    PanelComponent.prototype.getY = function () {
        //return this.y;
        return this.properties['yPosition'];
    };
    PanelComponent.prototype.getWidth = function () {
        //return this.width;
        return this.properties['width'];
    };
    PanelComponent.prototype.getHeight = function () {
        //return this.height;
        return this.properties['height'];
    };
    PanelComponent.prototype.getHeaderHeight = function () {
        return this.properties['headerHeight'];
    };
    PanelComponent.prototype.getID = function () {
        return this.id;
    };
    PanelComponent.prototype.getHeaderText = function () {
        return this.properties['headerText'];
    };
    PanelComponent.prototype.getComponentType = function () {
        return this.componentType;
    };
    PanelComponent.prototype.getPropertyValue = function (propertyName) {
        return this.properties[propertyName];
    };
    PanelComponent.prototype.getProperties = function () {
        return this.properties;
    };
    PanelComponent.prototype.getChildren = function () {
        return this.properties['children'];
    };
    /*************************************************/



    /****************Setters**************************/
    PanelComponent.prototype.setX = function (x) {
        this.x = x;
        this.properties['xPosition'] = x;
    };
    PanelComponent.prototype.setY = function (y) {
        this.y = y;
        this.properties['yPosition'] = y;
    };
    PanelComponent.prototype.setWidth = function (w) {
        this.width = w;
        this.properties['width'] = w;
    };
    PanelComponent.prototype.setHeight = function (h) {
        this.height = h;
        this.properties['height'] = h;
    };
    PanelComponent.prototype.setHeaderText = function (headerText) {
        this.text = headerText;
        this.properties['headerText'] = headerText;
    };
    PanelComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    /*************************************************/

    PanelComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": undefined, "panel": undefined};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                y >= this.getY() + this.getHeaderHeight() &&
                y <= this.getY() + this.getHeight()) {
            result.panel = this.getID();
            result.hit = true;

            this.properties['children'].forEach(function (value, key) {
                var temp = value.hitTest(x, y);
                if (temp.hit) {
                    result.hit = true;
                    result.component = temp.component;

                }
            });
        }

        else if (!result.hit) {
            if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                    y >= this.getY() && y <= this.getY() + this.getHeaderHeight()) {
                result.hit = true;
                result.component = this.getID();
                result.panel = undefined;
            }
        }

        return result;
    };
    
    PanelComponent.prototype.isComponentInside=function(testComponent){
        var result = false;
        if (this.getHeight() - this.getHeaderHeight() > testComponent.getHeight()
                    && this.getY() < testComponent.getY()
                    && this.getWidth() > testComponent.getWidth()
                    && this.getX() < testComponent.getX()){
                result = true;
        }
        return result;
    };

    PanelComponent.prototype.addChild = function (component) {
        this.properties['children'].set(component.getID(), component);
        console.log("child added: " + component.getComponentType());
    };

    PanelComponent.prototype.removeChild = function (component) {
        this.properties['children'].delete(component.getID());
    };

    PanelComponent.prototype.getChild = function (componentID) {
        return this.properties['children'].get(componentID);
    };

    PanelComponent.prototype.moveChildren = function (dx, dy) {
        this.properties['children'].forEach(function (value, key) {
            value.move(dx, dy);
        });
    };

    PanelComponent.prototype.move = function (dx, dy) {
        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);
        this.moveChildren(dx, dy);
    };

    PanelComponent.prototype.draw = function (ctx) {
        this.properties['xPosition'] = Number(this.properties['xPosition']);
        this.properties['yPosition'] = Number(this.properties['yPosition']);
        this.properties['width'] = Number(this.properties['width']);
        this.properties['height'] = Number(this.properties['height']);
        //header background
        ctx.save();
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(this.getX() - 1, this.getY(), this.getWidth() + 2, this.getHeaderHeight());
        ctx.restore();

        //header text
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.getHeaderText(), this.properties['xPosition'] + this.properties['width'] / 2, this.properties['yPosition'] + this.getHeaderHeight() / 2 + 5);
        ctx.restore();

        //panel's main part
        ctx.save();
        ctx.strokeStyle = "#d3d3d3";
        ctx.strokeRect(this.getX(), this.getY() + this.getHeaderHeight(), this.getWidth(), this.getHeight() - this.getHeaderHeight());
        ctx.restore();


        this.properties['children'].forEach(function (value, key) {
            value.draw(ctx);
        });


    };


    return PanelComponent;
})();
/******************************************************************************************/