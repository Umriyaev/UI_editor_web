/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//create namespace for uiEditor
var uiEditor = uiEditor || {};
//subnamespace for components
uiEditor.components = uiEditor.components || {};
uiEditor.helpers = uiEditor.helpers || {};

uiEditor.helpers.IdSpecifier = (function () {
    function IdSpecifier() {
        this.buttonCount = 0;
        this.textboxCount = 0;
        this.displayCount = 0;
        this.imageCount = 0;
        this.panelCount = 0;
        this.screenCountrolCount = 0;
        this.sourceCount = 0;
        this.groupCount = 0;
    }

    IdSpecifier.prototype.getIdForComponent = function (componentType) {
        var id = null;
        console.log("getIDForComponent: " + componentType);

        switch (componentType) {
            case "button":
                ++this.buttonCount;
                id = "button_" + this.buttonCount;
                break;
            case "text":
                ++this.textboxCount;
                id = "text_" + this.textboxCount;
                break;
            case "display":
                ++this.displayCount;
                id = "display_" + this.displayCount;
                break;
            case "image":
                ++this.imageCount;
                id = "image_" + this.imageCount;
                break;
            case "panel":
                ++this.panelCount;
                id = "panel_" + this.panelCount;
                break;
            case "screenControl":
                ++this.screenCountrolCount;
                id = "screenControl_" + this.screenCountrolCount;
                break;
            case "source":
                ++this.sourceCount;
                id = "source_" + this.sourceCount;
                break;
            case "group":
                ++this.groupCount;
                id = "group_" + this.groupCount;
                break;
            default:
                id = null;
                break;
        }
        console.log(id);
        return id;
    };

    return IdSpecifier;
})();

/*********************Image component class**********************/
uiEditor.components.ImageComponent = (function () {

    //constructor of ImageComponent
    function ImageComponent(id, x, y, w, h) {
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.properties = {};
        this.properties["id"] = id;
        this.properties["componentType"] = "image";
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['image url'] = 'images/dummy-image.jpg';
        this.selected = false;
        this.firstSelected = false;
    }

    /*****************Getters************************/
    ImageComponent.prototype.getX = function () {
        return this.properties['xPosition'];
    };
    ImageComponent.prototype.getY = function () {
        return this.properties['yPosition'];
    };
    ImageComponent.prototype.getWidth = function () {
        return this.properties['width'];
    };
    ImageComponent.prototype.getHeight = function () {
        return this.properties['height'];
    };
    ImageComponent.prototype.getBackgroundImage = function () {
        return this.properties['image url'];
    };
    ImageComponent.prototype.getID = function () {
        return this.properties["id"];
    };
    ImageComponent.prototype.getComponentType = function () {
        return this.properties["componentType"];
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
        this.properties['xPosition'] = x;
    };
    ImageComponent.prototype.setY = function (y) {
        this.properties['yPosition'] = y;
    };
    ImageComponent.prototype.setWidth = function (w) {
        this.properties['width'] = w;
    };
    ImageComponent.prototype.setHeight = function (h) {
        this.properties['height'] = h;
    };
    ImageComponent.prototype.setBackgroundImage = function (imageSource) {
        this.properties['image url'] = imageSource;
    };
    ImageComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };

    /*************************************************/

    ImageComponent.prototype.getPropertiesForJSON = function () {
        return this.getProperties();
    };

    ImageComponent.prototype.select = function () {
        this.selected = true;
    };

    ImageComponent.prototype.firstSelect = function () {
        this.firstSelected = true;
    };

    ImageComponent.prototype.deselect = function () {
        this.selected = false;
        if (this.firstSelected)
            this.firstSelected = false;
    };

    ImageComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": null};
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
        this.setX(Number(this.getX()));
        this.setY(Number(this.getY()));
        this.setWidth(Number(this.getWidth()));
        this.setHeight(Number(this.getHeight()));

        var image = new Image();
        image.src = this.getBackgroundImage();
        ctx.drawImage(image, this.getX(), this.getY(), this.getWidth(), this.getHeight());

        if (this.selected) {
            ctx.save();
            if (!this.firstSelected)
                ctx.strokeStyle = "#ff0000";
            else
                ctx.strokeStyle = "#f202ca"
            ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
    };
    return ImageComponent;
})();
/*****************************************************************/

/*******************Text component class********************/
uiEditor.components.TextComponent = (function () {
    function TextComponent(id, x, y, w, h) {
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.properties = {};
        this.properties["id"] = id;
        this.properties["componentType"] = "text";
        this.properties['xPosition'] = x;
        this.properties['radius'] = 10;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['placeholder text'] = "placeholder text";
        this.selected = false;
        this.firstSelected = false;
    }

    /*****************Getters************************/
    TextComponent.prototype.getRadius = function () {
        return this.properties["radius"];
    };
    TextComponent.prototype.getX = function () {
        return this.properties['xPosition'];
    };
    TextComponent.prototype.getY = function () {
        return this.properties['yPosition'];
    };
    TextComponent.prototype.getWidth = function () {
        return this.properties['width'];
    };
    TextComponent.prototype.getHeight = function () {
        return this.properties['height'];
    };
    TextComponent.prototype.getID = function () {
        return this.properties["id"];
    };
    TextComponent.prototype.getPlaceholderText = function () {
        return this.properties['placeholder text'];
    };
    TextComponent.prototype.getComponentType = function () {
        return this.properties["componentType"];
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
        this.properties["radius"] = radius;
    };
    TextComponent.prototype.setX = function (x) {
        this.properties['xPosition'] = x;
    };
    TextComponent.prototype.setY = function (y) {
        this.properties['yPosition'] = y;
    };
    TextComponent.prototype.setWidth = function (w) {
        this.properties['width'] = w;
    };
    TextComponent.prototype.setHeight = function (h) {
        this.properties['height'] = h;
    };
    TextComponent.prototype.setPlaceholderText = function (placeholderText) {
        this.properties['placeholder text'] = placeholderText;
    };
    TextComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    /*************************************************/

    TextComponent.prototype.getPropertiesForJSON = function () {
        return this.getProperties();
    };

    TextComponent.prototype.select = function () {
        this.selected = true;
    };

    TextComponent.prototype.firstSelect = function () {
        this.firstSelected = true;
    };

    TextComponent.prototype.deselect = function () {
        this.selected = false;
        if (this.firstSelected)
            this.firstSelected = false;
    };

    TextComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": null};
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
        this.setX(Number(this.getX()));
        this.setY(Number(this.getY()));
        this.setWidth(Number(this.getWidth()));
        this.setHeight(Number(this.getHeight()));


        ctx.beginPath();
        ctx.moveTo(this.getX() +
                this.getRadius(),
                this.getY());
        ctx.lineTo(this.getX() +
                this.getWidth() -
                this.getRadius(),
                this.getY());
        ctx.quadraticCurveTo(this.getX() +
                this.getWidth(),
                this.getY(),
                this.getX() +
                this.getWidth(),
                this.getY() +
                this.getRadius());
        ctx.lineTo(this.getX() +
                this.getWidth(),
                this.getY() +
                this.getHeight() -
                this.getRadius());
        ctx.quadraticCurveTo(this.getX() +
                this.getWidth(),
                this.getY() +
                this.getHeight(),
                this.getX() +
                this.getWidth() -
                this.getRadius(),
                this.getY() +
                this.getHeight());
        ctx.lineTo(this.getX() +
                this.getRadius(),
                this.getY() +
                this.getHeight());
        ctx.quadraticCurveTo(this.getX(),
                this.getY() +
                this.getHeight(),
                this.getX(),
                this.getY() +
                this.getHeight() -
                this.getRadius());
        ctx.lineTo(this.getX(),
                this.getY() +
                this.getRadius());
        ctx.quadraticCurveTo(this.getX(),
                this.getY(),
                this.getX() +
                this.getRadius(),
                this.getY());
        ctx.closePath();
        ctx.stroke();
        if (this.getPlaceholderText() !== null) {
            ctx.save();
            ctx.fillStyle = "#aaa";
            ctx.font = "20px Arial";
            ctx.textAlign = "left";
            ctx.fillText(this.getPlaceholderText(), this.getX() + 20, this.getY() + this.getHeight() / 2 + 5);
            ctx.restore();
        }

        if (this.selected) {
            ctx.save();
            if (!this.firstSelected)
                ctx.strokeStyle = "#ff0000";
            else
                ctx.strokeStyle = "#f202ca";
            ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
    };
    return TextComponent;
})();
/***********************************************************/

/*******************Table component class*********************/
uiEditor.components.DisplayComponent = (function () {
    function DisplayComponent(id, x, y, w, h, numberOfColumns, numberOfRows) {
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.properties = {};
        this.properties["id"] = id;
        this.properties["componentType"] = "display";
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['rows'] = numberOfRows;
        this.properties['cols'] = numberOfColumns;
        this.selected = false;
        this.firstSelected = false;
    }

    /*****************Getters************************/
    DisplayComponent.prototype.getX = function () {
        return this.properties['xPosition'];
    };
    DisplayComponent.prototype.getY = function () {
        return this.properties['yPosition'];
    };
    DisplayComponent.prototype.getWidth = function () {
        return this.properties['width'];
    };
    DisplayComponent.prototype.getHeight = function () {
        return this.properties['height'];
    };
    DisplayComponent.prototype.getID = function () {
        return this.properties["id"];
    };
    DisplayComponent.prototype.getNumberOfRows = function () {
        return this.properties["rows"];
    };
    DisplayComponent.prototype.getNumberOfCols = function () {
        return this.properties["cols"];
    };
    DisplayComponent.prototype.getComponentType = function () {
        return this.properties["componentType"];
    };
    DisplayComponent.prototype.getPropertyValue = function (propertyName) {
        return this.properties[propertyName];
    };
    DisplayComponent.prototype.getProperties = function () {
        return this.properties;
    };
    /*************************************************/



    /****************Setters**************************/
    DisplayComponent.prototype.setX = function (x) {
        this.properties['xPosition'] = x;
    };
    DisplayComponent.prototype.setY = function (y) {
        this.properties['yPosition'] = y;
    };
    DisplayComponent.prototype.setWidth = function (w) {
        this.properties['width'] = w;
    };
    DisplayComponent.prototype.setHeight = function (h) {
        this.properties['height'] = h;
    };
    DisplayComponent.prototype.setNumberOfColumns = function (numberOfColumns) {
        this.properties['cols'] = numberOfColumns;
    };
    DisplayComponent.prototype.setNumberOfRows = function (numberOfRows) {
        this.properties['rows'] = numberOfRows;
    };
    DisplayComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    /*************************************************/
    DisplayComponent.prototype.getPropertiesForJSON = function () {
        return this.getProperties();
    };

    DisplayComponent.prototype.select = function () {
        this.selected = true;
    };

    DisplayComponent.prototype.firstSelect = function () {
        this.firstSelected = true;
    };

    DisplayComponent.prototype.deselect = function () {
        this.selected = false;
        if (this.firstSelected)
            this.firstSelected = false;
    };

    DisplayComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": null};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                y >= this.getY() && y <= this.getY() + this.getHeight()) {
            result.hit = true;
        }
        return result;
    };

    DisplayComponent.prototype.move = function (dx, dy) {
        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);
    };

    DisplayComponent.prototype.draw = function (ctx) {
        this.setX(Number(this.getX()));
        this.setY(Number(this.getY()));
        this.setWidth(Number(this.getWidth()));
        this.setHeight(Number(this.getHeight()));
        this.setNumberOfRows(Number(this.getNumberOfRows()));
        this.setNumberOfColumns(Number(this.getNumberOfCols()));


        if (this.getWidth() % this.getNumberOfCols() !== 0) {
            this.setWidth(this.getWidth() +
                    this.getNumberOfCols() - (this.getWidth() % this.getNumberOfCols()));
        }
        if (this.getHeight() % this.getNumberOfRows() !== 0) {
            this.setHeight(this.getHeight() +
                    this.getNumberOfRows() - (this.getHeight() % this.getNumberOfRows()));
        }
        ctx.beginPath();
        for (var x = this.getX();
                x < this.getWidth() + this.getX();
                x += this.getWidth() / this.getNumberOfCols()) {
            ctx.moveTo(x, this.getY());
            ctx.lineTo(x, this.getY() + this.getHeight());
        }
        ctx.moveTo(this.getX() + this.getWidth(),
                this.getY());
        ctx.lineTo(this.getX() + this.getWidth(),
                this.getY() + this.getHeight());
        for (var y = this.getY();
                y < this.getHeight() + this.getY();
                y += this.getHeight() / this.getNumberOfRows()) {
            ctx.moveTo(this.getX(), y);
            ctx.lineTo(this.getX() + this.getWidth(), y);
        }

        ctx.moveTo(this.getX(),
                this.getY() + this.getHeight());
        ctx.lineTo(this.getX() + this.getWidth(),
                this.getY() + this.getHeight());
        ctx.closePath();
        ctx.stroke();

        if (this.selected) {
            ctx.save();
            if (!this.firstSelected)
                ctx.strokeStyle = "#ff0000";
            else
                ctx.strokeStyle = "#f202ca";
            ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
    };
    return DisplayComponent;
})();
/*************************************************************/

/*********************Button component************************/
uiEditor.components.ButtonComponent = (function () {
    function ButtonComponent(id, x, y, w, h) {
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.properties = {};
        this.properties['xPosition'] = x;
        this.properties["radius"] = 10;
        this.properties["id"] = id;
        this.properties["componentType"] = "button";
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['text'] = 'button';
        this.properties['radius'] = 10;
        this.selected = false;
        this.firstSelected = false;
    }

    /*****************Getters************************/
    ButtonComponent.prototype.getX = function () {
        return this.properties['xPosition'];
    };
    ButtonComponent.prototype.getY = function () {
        return this.properties['yPosition'];
    };
    ButtonComponent.prototype.getWidth = function () {
        return this.properties['width'];
    };
    ButtonComponent.prototype.getRadius = function () {
        return this.properties["radius"];
    };
    ButtonComponent.prototype.getHeight = function () {
        return this.properties['height'];
    };
    ButtonComponent.prototype.getID = function () {
        return this.properties["id"];
    };
    ButtonComponent.prototype.getText = function () {
        return this.properties['text'];
    };
    ButtonComponent.prototype.getComponentType = function () {
        return this.properties["componentType"];
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
        this.properties['xPosition'] = x;
    };
    ButtonComponent.prototype.setY = function (y) {
        this.properties['yPosition'] = y;
    };
    ButtonComponent.prototype.setWidth = function (w) {
        this.properties['width'] = w;
    };
    ButtonComponent.prototype.setHeight = function (h) {
        this.properties['height'] = h;
    };
    ButtonComponent.prototype.setText = function (text) {
        this.properties['text'] = text;
    };
    ButtonComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    /*************************************************/
    ButtonComponent.prototype.getPropertiesForJSON = function () {
        return this.getProperties();
    };

    ButtonComponent.prototype.select = function () {
        this.selected = true;
    };

    ButtonComponent.prototype.firstSelect = function () {
        this.firstSelected = true;
    };

    ButtonComponent.prototype.deselect = function () {
        this.selected = false;
        if (this.firstSelected)
            this.firstSelected = false;
    };

    ButtonComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": null};
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
        this.setX(Number(this.getX()));
        this.setY(Number(this.getY()));
        this.setWidth(Number(this.getWidth()));
        this.setHeight(Number(this.getHeight()));

        ctx.save();
        var gradient = ctx.createLinearGradient(0, 0, 0, 170);
        gradient.addColorStop(0, "#e4e4e4");
        gradient.addColorStop(0, "#f1f1f1");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.getX() + this.getRadius(),
                this.getY());
        ctx.lineTo(this.getX() + this.getWidth() -
                this.getRadius(),
                this.getY());
        ctx.quadraticCurveTo(this.getX() + this.getWidth(),
                this.getY(),
                this.getX() + this.getWidth(),
                this.getY() + this.getRadius());
        ctx.lineTo(this.getX() + this.getWidth(),
                this.getY() + this.getHeight() - this.getRadius());
        ctx.quadraticCurveTo(this.getX() + this.getWidth(),
                this.getY() + this.getHeight(),
                this.getX() + this.getWidth() - this.getRadius(),
                this.getY() + this.getHeight());
        ctx.lineTo(this.getX() + this.getRadius(),
                this.getY() + this.getHeight());
        ctx.quadraticCurveTo(this.getX(),
                this.getY() + this.getHeight(),
                this.getX(),
                this.getY() + this.getHeight() - this.getRadius());
        ctx.lineTo(this.getX(),
                this.getY() + this.getRadius());
        ctx.quadraticCurveTo(this.getX(),
                this.getY(),
                this.getX() + this.getRadius(),
                this.getY());
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        if (this.text !== null) {
            ctx.save();
            ctx.fillStyle = "#000";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.getText(), this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() / 2 + 5);
            ctx.restore();
        }
        ctx.restore();

        if (this.selected) {
            ctx.save();
            if (!this.firstSelected)
                ctx.strokeStyle = "#ff0000";
            else
                ctx.strokeStyle = "#f202ca";
            ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
    };
    return ButtonComponent;
})();
/*************************************************************/


/*********************Panel component*************************/
uiEditor.components.PanelComponent = (function () {
    function PanelComponent(id, x, y, w, h, headerText) {
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.properties = {};
        this.properties['headerHeight'] = 40;
        this.properties["id"] = id;
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['headerText'] = headerText;
        this.properties["componentType"] = "panel";
        this.properties['children'] = new Map();
        this.selected = false;
        this.firstSelected = false;
    }

    /*****************Getters************************/
    PanelComponent.prototype.getX = function () {
        return this.properties['xPosition'];
    };
    PanelComponent.prototype.getY = function () {
        return this.properties['yPosition'];
    };
    PanelComponent.prototype.getWidth = function () {
        return this.properties['width'];
    };
    PanelComponent.prototype.getHeight = function () {
        return this.properties['height'];
    };
    PanelComponent.prototype.getHeaderHeight = function () {
        return this.properties['headerHeight'];
    };
    PanelComponent.prototype.getID = function () {
        return this.properties["id"];
    };
    PanelComponent.prototype.getHeaderText = function () {
        return this.properties['headerText'];
    };
    PanelComponent.prototype.getComponentType = function () {
        return this.properties["componentType"];
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
        this.properties['xPosition'] = x;
    };
    PanelComponent.prototype.setY = function (y) {
        this.properties['yPosition'] = y;
    };
    PanelComponent.prototype.setWidth = function (w) {
        this.properties['width'] = w;
    };
    PanelComponent.prototype.setHeight = function (h) {
        this.properties['height'] = h;
    };
    PanelComponent.prototype.setHeaderText = function (headerText) {
        this.properties['headerText'] = headerText;
    };
    PanelComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    /*************************************************/
    PanelComponent.prototype.getPropertiesForJSON = function () {
        var panel = {};
        panel.id = this.getID();
        panel.xPos = this.getX();
        panel.yPos = this.getY();
        panel.width = this.getWidth();
        panel.height = this.getHeight();
        panel.headerText = this.getHeaderHeight();
        panel.componentType = this.getComponentType();
        panel.headerHeight = this.getHeaderHeight();
        panel.children = {};
        panel.children.button = [];
        panel.children.text = [];
        panel.children.image = [];
        panel.children.panel = [];
        panel.children.group = [];
        this.getChildren().forEach(function (value, key) {
            switch (value.getComponentType()) {
                case "text":
                    panel.children.text.push(value.getPropertiesForJSON());
                    break;
                case "button":
                    panel.children.button.push(value.getPropertiesForJSON());
                    break;
                case "image":
                    panel.children.image.push(value.getPropertiesForJSON());
                    break;
                case "panel":
                    panel.children.panel.push(value.getPropertiesForJSON());
                    break;
                case "group":
                    panel.children.group.push(value.getPropertiesForJSON());
                default:
                    break;
            }
        });

        return panel;
    };

    PanelComponent.prototype.select = function () {
        this.selected = true;
    };

    PanelComponent.prototype.firstSelect = function () {
        this.firstSelected = true;
    };

    PanelComponent.prototype.deselect = function () {
        this.selected = false;
        if (this.firstSelected)
            this.firstSelected = false;
    };

    PanelComponent.prototype.hitTest = function (x, y) {
        var result = this.headerHitTest(x, y);
        if (!result.hit) {
            result = this.bodyHitTest(x, y);
            if (result.hit) {
                var temp = this.childHitTest(x, y);
                if (temp.hit) {
                    result.component = temp.component;
                }
            }
        }
        return result;
    };
    PanelComponent.prototype.childHitTest = function (x, y) {
        var result = {"hit": false, "component": null, "panel": this.getID()};
        this.getChildren().forEach(function (value, key) {
            var temp = value.hitTest(x, y);
            if (temp.hit) {
                result.hit = true;
                result.component = temp.component;

            }
        });
        return result;
    };

    PanelComponent.prototype.headerHitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": null};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                y >= this.getY() && y <= this.getY() + this.getHeaderHeight()) {
            result.hit = true;
        }
        return result;
    };
    PanelComponent.prototype.bodyHitTest = function (x, y) {
        var result = {"hit": false, "component": null, "panel": this.getID()};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                y >= this.getY() + this.getHeaderHeight() &&
                y <= this.getY() + this.getHeight()) {
            result.hit = true;
        }
        return result;
    };
    PanelComponent.prototype.isComponentInside = function (testComponent) {
        var x = this.getX();
        var y = this.getY() + this.getHeaderHeight();
        var h = this.getHeight() - this.getHeaderHeight();
        var w = this.getWidth();

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
    PanelComponent.prototype.addChild = function (component) {
        this.properties['children'].set(component.getID(), component);
    };
    PanelComponent.prototype.removeChild = function (component) {
        this.properties['children'].delete(component.getID());
    };
    PanelComponent.prototype.findAndRemoveComponents = function (componentType) {
        var toRemove = [];
        this.properties["children"].forEach(function (value, key) {
            if (value.getComponentType() === componentType) {
                toRemove.push(key);
            }
        });
        for (var i = 0; i < toRemove.length; i++) {
            this.properties["children"].delete(toRemove[i]);
        }
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
        this.setX(Number(this.getX()));
        this.setY(Number(this.getY()));
        this.setWidth(Number(this.getWidth()));
        this.setHeight(Number(this.getHeight()));
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
        ctx.fillText(this.getHeaderText(), this.getX() + this.getWidth() / 2, this.getY() + this.getHeaderHeight() / 2 + 5);
        ctx.restore();
        //panel's main part
        ctx.save();
        ctx.strokeStyle = "#d3d3d3";
        ctx.strokeRect(this.getX(), this.getY() + this.getHeaderHeight(), this.getWidth(), this.getHeight() - this.getHeaderHeight());
        ctx.restore();
        this.properties['children'].forEach(function (value, key) {
            value.draw(ctx);
        });

        if (this.selected) {
            ctx.save();
            if (!this.firstSelected)
                ctx.strokeStyle = "#ff0000";
            else
                ctx.strokeStyle = "#f202ca";
            ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
    };
    return PanelComponent;
})();
/******************************************************************************************/


/*******************************Screen control*********************************************/
uiEditor.components.ScreenControlComponent = (function () {
    function ScreenControlComponent(id, x, y, w, h, sizes) {
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.properties = {};
        this.properties['xPosition'] = x;
        this.properties["id"] = id;
        this.properties["componentType"] = "screenControl";
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['radius'] = 10;
        this.properties['sizes'] = sizes;
        this.selected = false;
        this.firstSelected = false;
    }

    /*****************Getters************************/
    ScreenControlComponent.prototype.getX = function () {
        return this.properties['xPosition'];
    };
    ScreenControlComponent.prototype.getY = function () {
        return this.properties['yPosition'];
    };
    ScreenControlComponent.prototype.getWidth = function () {
        return this.properties['width'];
    };
    ScreenControlComponent.prototype.getHeight = function () {
        return this.properties['height'];
    };
    ScreenControlComponent.prototype.getID = function () {
        return this.properties["id"];
    };
    ScreenControlComponent.prototype.getComponentType = function () {
        return this.properties["componentType"];
    };
    ScreenControlComponent.prototype.getPropertyValue = function (propertyName) {
        return this.properties[propertyName];
    };
    ScreenControlComponent.prototype.getProperties = function () {
        return this.properties;
    };
    ScreenControlComponent.prototype.getSizes = function () {
        return this.properties['sizes'];
    };
    /*************************************************/



    /****************Setters**************************/
    ScreenControlComponent.prototype.setX = function (x) {
        this.properties['xPosition'] = x;
    };
    ScreenControlComponent.prototype.setY = function (y) {
        this.properties['yPosition'] = y;
    };
    ScreenControlComponent.prototype.setWidth = function (w) {
        this.properties['width'] = w;
    };
    ScreenControlComponent.prototype.setHeight = function (h) {
        this.properties['height'] = h;
    };
    ScreenControlComponent.prototype.setSizes = function (sizes) {
        this.properties['sizes'] = sizes;
    };
    ScreenControlComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    /*************************************************/
    ScreenControlComponent.prototype.getPropertiesForJSON = function () {
        return this.getProperties();
    };

    ScreenControlComponent.prototype.select = function () {
        this.selected = true;
    };

    ScreenControlComponent.prototype.firstSelect = function () {
        this.firstSelected = true;
    };

    ScreenControlComponent.prototype.deselect = function () {
        this.selected = false;
        if (this.firstSelected)
            this.firstSelected = false;
    };

    ScreenControlComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": null};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                y >= this.getY() && y <= this.getY() + this.getHeight()) {
            result.hit = true;
        }
        return result;
    };

    ScreenControlComponent.prototype.move = function (dx, dy) {
        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);
    };

    ScreenControlComponent.prototype.draw = function (ctx) {
        this.setX(Number(this.getX()));
        this.setY(Number(this.getY()));
        this.setWidth(Number(this.getWidth()));
        this.setHeight(Number(this.getHeight()));

        var sizeCount = this.getSizes().length;
        var itemWidth = this.getWidth() / sizeCount;
        var itemHeight = this.getHeight();

        ctx.save();

        var gradient = ctx.createLinearGradient(0, 0, 0, 170);
        gradient.addColorStop(0, "#e4e4e4");
        gradient.addColorStop(0, "#f1f1f1");
        ctx.textAlign = "center";

        for (var i = 0; i < sizeCount; i++) {
            ctx.beginPath();
            ctx.fillStyle = gradient;
            var xPos = this.getX() + i * (itemWidth);
            var yPos = this.getY();
            ctx.rect(xPos, yPos, itemWidth, itemHeight);
            ctx.stroke();
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText(this.getSizes()[i], xPos + itemWidth / 2, yPos + itemHeight / 2 + 3);
            ctx.closePath();
        }

        ctx.restore();

        if (this.selected) {
            ctx.save();
            if (!this.firstSelected)
                ctx.strokeStyle = "#ff0000";
            else
                ctx.strokeStyle = "#f202ca";
            ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
    };
    return ScreenControlComponent;
})();
/******************************************************************************************/


/*********************************Display source component*********************************/
uiEditor.components.SourceComponent = (function () {
    function SourceComponent(id, x, y, w, h, text, source) {
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.zIndex = null; // numbers
        this.properties = {};
        this.properties['xPosition'] = x;
        this.properties["id"] = id;
        this.properties["componentType"] = "source";
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['text'] = text;
        this.properties['source'] = source;
        this.selected = false;
        this.firstSelected = false;
    }

    /*****************Getters************************/
    SourceComponent.prototype.getX = function () {
        return this.properties['xPosition'];
    };
    SourceComponent.prototype.getY = function () {
        return this.properties['yPosition'];
    };
    SourceComponent.prototype.getWidth = function () {
        return this.properties['width'];
    };
    SourceComponent.prototype.getHeight = function () {
        return this.properties['height'];
    };
    SourceComponent.prototype.getID = function () {
        return this.properties["id"];
    };
    SourceComponent.prototype.getText = function () {
        return this.properties['text'];
    };
    SourceComponent.prototype.getComponentType = function () {
        return this.properties["componentType"];
    };
    SourceComponent.prototype.getPropertyValue = function (propertyName) {
        return this.properties[propertyName];
    };
    SourceComponent.prototype.getProperties = function () {
        return this.properties;
    };
    SourceComponent.prototype.getSource = function () {
        return this.properties['source'];
    };
    /*************************************************/



    /****************Setters**************************/
    SourceComponent.prototype.setX = function (x) {
        this.properties['xPosition'] = x;
    };
    SourceComponent.prototype.setY = function (y) {
        this.properties['yPosition'] = y;
    };
    SourceComponent.prototype.setWidth = function (w) {
        this.properties['width'] = w;
    };
    SourceComponent.prototype.setHeight = function (h) {
        this.properties['height'] = h;
    };
    SourceComponent.prototype.setSource = function (source) {
        this.properties['source'] = source;
    };
    SourceComponent.prototype.setText = function (text) {
        this.properties['text'] = text;
    };
    SourceComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    /*************************************************/
    SourceComponent.prototype.getPropertiesForJSON = function () {
        return this.getProperties();
    };

    SourceComponent.prototype.select = function () {
        this.selected = true;
    };

    SourceComponent.prototype.firstSelect = function () {
        this.firstSelected = true;
    };

    SourceComponent.prototype.deselect = function () {
        this.selected = false;
        if (this.firstSelected)
            this.firstSelected = false;
    };

    SourceComponent.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": null};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
                y >= this.getY() && y <= this.getY() + this.getHeight()) {
            result.hit = true;
        }
        return result;
    };

    SourceComponent.prototype.move = function (dx, dy) {
        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);
    };

    SourceComponent.prototype.draw = function (ctx) {
        this.setX(Number(this.getX()));
        this.setY(Number(this.getY()));
        this.setWidth(Number(this.getWidth()));
        this.setHeight(Number(this.getHeight()));

        ctx.save();

        var gradient = ctx.createLinearGradient(0, 0, 0, 170);
        gradient.addColorStop(0, "#e4e4e4");
        gradient.addColorStop(0, "#f1f1f1");
        ctx.fillStyle = gradient;
        ctx.textAlign = "center";

        ctx.beginPath();
        ctx.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(this.getText(), this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() / 2 + 5);

        ctx.restore();

        if (this.selected) {
            ctx.save();
            if (!this.firstSelected)
                ctx.strokeStyle = "#ff0000";
            else
                ctx.strokeStyle = "#f202ca";
            ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
    };
    return SourceComponent;
})();
/******************************************************************************************/

//TO DO:
/*
 * Change logic of creating screen object
 * there should be only one screen object on page
 * there might be many sources
 * 
 * Add getPropertiesForJSON to source and size 
 * 
 * if user creates display and size make display and size buttons unavailable
 * 
 * if user creates display or size or source, add them to screen object
 * 
 */
uiEditor.components.ScreenObject = (function () {
    function ScreenObject() {
        this.display = null;
        this.size = null;
        this.source = [];
    }

    /******************************Getters***************************************************/
    ScreenObject.prototype.getDisplay = function () {
        return this.display;
    };

    ScreenObject.prototype.getSize = function () {
        return this.size;
    };

    ScreenObject.prototype.getSource = function () {
        return this.source;
    };
    /****************************************************************************************/

    /******************************Setters***************************************************/
    ScreenObject.prototype.setDisplay = function (display) {
        this.display = display;
    };

    ScreenObject.prototype.setSize = function (size) {
        this.size = size;
    };

    ScreenObject.prototype.setSource = function (source) {
        this.source.push(source);
    };
    /****************************************************************************************/

    ScreenObject.prototype.getPropertiesForJSON = function () {
        var result = {};
        if (this.getDisplay() !== null) {
            result.display = this.getDisplay().getPropertiesForJSON();
        }
        if (this.getSize() !== null) {
            result.size = this.getSize().getPropertiesForJSON();
        }
        if (this.getSource().length > 0) {
            result.source = [];
            for (var i = 0; i < this.getSource().length; i++) {
                result.source.push(this.getSource()[i].getPropertiesForJSON());
            }
        }

        return result;
    };



    return ScreenObject;
})();


uiEditor.components.GroupSelection = (function () {
    function GroupSelection() {
        this.selection = new Map();
        this.width = "not set";
        this.height = "not set";
        this.firstItem = null;
//        this.verticalOffset = "not set";
//        this.horizontalOffset = "not set";
    }

    /*********************Getters***********************************/

    GroupSelection.prototype.getSelection = function () {
        return this.selection;
    };

    GroupSelection.prototype.getWidth = function () {
        return this.width;
    };

    GroupSelection.prototype.getHeight = function () {
        return this.height;
    };

//    GroupSelection.prototype.getVerticalOffset = function () {
//        return this.verticalOffset;
//    };
//
//    GroupSelection.prototype.getHorizontalOffset = function () {
//        return this.horizontalOffset;
//    };

    /***************************************************************/

    /*********************Setters*******************************/
    GroupSelection.prototype.setWidth = function (width, components) {
        if (width !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group")
                    components.get(value).setWidth(width);
            });
            this.width = width;
            return components;
        }
    };

    GroupSelection.prototype.setHeight = function (height, components) {
        if (height !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group")
                    components.get(value).setHeight(height);
            });
            this.height = height;
            return components;
        }
    };

//    GroupSelection.prototype.setVerticalOffset = function (verticalOffset) {
//
//        this.selection.forEach(function(value, key))
//    }
    /***********************************************************/

    GroupSelection.prototype.addToSelection = function (componentID, components) {
        this.selection.set(componentID, componentID);
        components.get(componentID).select();
        if (this.firstItem === null) {
            this.firstItem = components.get(componentID);
            this.firstItem.firstSelect();
        }
    };


    /********************Alignment operations******************************/
    GroupSelection.prototype.alignSize = function (components) {
        if (this.firstItem === null) {
            return;
        }
        var width = this.firstItem.getWidth();
        var height = this.firstItem.getHeight();
        components = this.setWidth(width, components);
        components = this.setHeight(height, components);
        return components;
    };

    GroupSelection.prototype.alignVertical = function (components) {
        if (this.firstItem === null) {
            return;
        }

        var width = this.firstItem.getWidth();
        var x = this.firstItem.getX();
        this.selection.forEach(function (value, key) {
            var component = components.get(value);
            var w2 = component.getWidth();
            component.setX(x + (width - w2) / 2);
            components.set(value, component);
        });

        return components;
    };

    GroupSelection.prototype.alignHorizontal = function (components) {
        if (this.firstItem === null) {
            return;
        }

        var height = this.firstItem.getHeight();
        var y = this.firstItem.getY();
        this.selection.forEach(function (value, key) {
            var component = components.get(value);
            var h2 = component.getHeight();
            component.setY(y + (height - h2) / 2);
            components.set(value, component);
        });

        return components;
    };


    /**********************************************************************/

    GroupSelection.prototype.removeFromSelection = function (componentID, components) {
        this.selection.delete(componentID);
        components.get(componentID).deselect();
    };

    GroupSelection.prototype.move = function (dx, dy, components) {
        this.selection.forEach(function (value, key) {
            components.get(value).move(dx, dy);
        });
        return components;
    };

    GroupSelection.prototype.deleteSelection = function (components) {
        var group = this;
        this.firstItem = null;
        this.selection.forEach(function (value, key) {
            var itemToDelete = value;
            group.removeFromSelection(itemToDelete, components);
            components.delete(itemToDelete);
        });
    };

    GroupSelection.prototype.clearSelection = function (components) {
        var group = this;
        this.firstItem = null;
        this.selection.forEach(function (value, key) {
            group.removeFromSelection(value, components);
        });
    };

    GroupSelection.prototype.getPropertyValue = function (propertyName) {
        switch (propertyName) {
            case "width":
                return this.width;
                break;
            case "height":
                return this.height;
                break;
            default:
                return undefined;
        }
    };

    GroupSelection.prototype.setPropertyValue = function (propertyName, propertyValue, components) {
        switch (propertyName) {
            case "width":
                propertyValue = Number(propertyValue);
                this.setWidth(propertyValue, components);
                break;
            case "height":
                propertyValue = Number(propertyValue);
                this.setHeight(propertyValue, components);
                break;
            default:
                return undefined;
        }
    };

    GroupSelection.prototype.hitTest = function (x, y, components) {
        var result = false;
        this.selection.forEach(function (value, key) {
            var component = components.get(value);
            var hitTest = component.hitTest(x, y);
            if (hitTest.hit) {
                result = true;
            }
        });
        return result;
    };

    GroupSelection.prototype.isInSelection = function (componentID) {
        return this.selection.has(componentID);
    };


    return GroupSelection;
})();

uiEditor.components.Group = (function () {
    function Group(id, selection, components) {
        this.properties = {};
        this.properties['id'] = id;
        this.properties['componentType'] = "group";
        this.properties['components'] = new Map();
        var leftX = 1000000, leftY = 100000000, rightX = 0, rightY = 0;
        console.log("In group constructor...");
        console.log(id);
        console.log(selection);
        console.log(components);
        var groupComponents = this.properties['components'];
        selection.forEach(function (value, key) {
            var component = components.get(key);
            component.deselect();
            var currentX = component.getX();
            var currentY = component.getY();
            var currentRightX = component.getWidth() + currentX;
            var currentRightY = component.getHeight() + currentY;
            if (leftX > currentX)
                leftX = currentX;
            if (leftY > currentY)
                leftY = currentY;
            if (rightX < currentRightX)
                rightX = currentRightX;
            if (rightY < currentRightY)
                rightY = currentRightY;
            groupComponents.set(key, component);
            components.delete(key);
        });

        this.properties['xPosition'] = leftX - 10;
        this.properties['yPosition'] = leftY - 10;
        this.properties['width'] = rightX - leftX + 10;
        this.properties['height'] = rightY - leftY + 10;
        this.selected = false;
        this.firstSelected = false;
    }

    /**********************Getters****************************/
    Group.prototype.getComponentType = function () {
        return this.properties["componentType"];
    };

    Group.prototype.getX = function () {
        return this.properties['xPosition'];
    };

    Group.prototype.getY = function () {
        return this.properties['yPosition'];
    };

    Group.prototype.getWidth = function () {
        return this.properties['width'];
    };

    Group.prototype.getHeight = function () {
        return this.properties['height'];
    };

    Group.prototype.getID = function () {
        return this.properties['id'];
    };

    Group.prototype.getComponents = function () {
        return this.properties['components'];
    };
    /*********************************************************/

    /**********************Setters****************************/
    Group.prototype.setX = function (x) {
        var dx = x - this.getX();
        this.move(dx, 0);
    };

    Group.prototype.setY = function (y) {
        var dy = y - this.getY();
        this.move(0, dy);
    };

    Group.prototype.setWidth = function (width) {
        this.properties['width'] = Number(width);
    };

    Group.prototype.setHeight = function (height) {
        this.properties['height'] = Number(height);
    };
    /*********************************************************/

    Group.prototype.select = function () {
        this.selected = true;
    };

    Group.prototype.firstSelect = function () {
        this.firstSelected = true;
    };

    Group.prototype.deselect = function () {
        this.selected = false;
        if (this.firstSelected)
            this.firstSelected = false;
    };

    Group.prototype.hitTest = function (x, y) {
        var result = {"hit": false, "component": this.getID(), "panel": null};
        if (x >= this.getX() && x <= this.getX() + this.getWidth() && y >= this.getY() && y <= this.getY() + this.getHeight()) {
            result.hit = true;
            console.log("group hit...");
        }

        return result;
    };

    Group.prototype.move = function (dx, dy) {
        console.log("moving....");
        this.properties['xPosition'] += dx;
        this.properties['yPosition'] += dy;
        this.properties['components'].forEach(function (value, key) {
            value.move(dx, dy);
        });
    };

    Group.prototype.draw = function (ctx) {

        //ctx.save();
        //ctx.fillStyle = "#f8f8f8";
        //ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        //ctx.restore();

        this.properties['components'].forEach(function (value, key) {
            value.draw(ctx);
        });

        if (this.selected) {
            ctx.save();
            if (!this.firstSelected)
                ctx.strokeStyle = "#ff0000";
            else
                ctx.strokeStyle = "#f202ca";
            ctx.setLineDash([3,2]);
            ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
        
        else{
            ctx.save();
            ctx.setLineDash([3,2]);
            ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
        
        
    };

    Group.prototype.unGroup = function (components) {
        var componentsBuffer = this.getComponents();
        this.properties['components'].forEach(function (value, key) {
            components.set(key, value);
            componentsBuffer.delete(key);
        });

        components.delete(this.getID());
    };

    Group.prototype.getPropertiesForJSON = function () {
        var group = {};
        group.id = this.getID();
        group.xPos = this.getX();
        group.yPos = this.getY();
        group.width = this.getWidth();
        group.height = this.getHeight();
        group.componentType = this.getComponentType();
        group.items = {};
        group.items.button = [];
        group.items.text = [];
        group.items.image = [];
        group.items.panel = [];
        group.items.group = [];
        this.getComponents().forEach(function (value, key) {
            switch (value.getComponentType()) {
                case "text":
                    group.items.text.push(value.getPropertiesForJSON());
                    break;
                case "button":
                    group.items.button.push(value.getPropertiesForJSON());
                    break;
                case "image":
                    group.items.image.push(value.getPropertiesForJSON());
                    break;
                case "panel":
                    group.items.panel.push(value.getPropertiesForJSON());
                    break;
                case "group":
                    group.items.group.push(value.getPropertiesForJSON());
                    break;
                default:
                    break;
            }
        });

        return group;
    };



    return Group;
})();
