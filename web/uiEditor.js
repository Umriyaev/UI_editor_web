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
    }

    IdSpecifier.prototype.getIdForComponent = function (componentType) {
        var id = null;

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
            default:
                id = null;
                break;
        }
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
        this.properties["radius"]=10;
        this.properties["id"]=id;
        this.properties["componentType"]="button";
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['text'] = 'button';
        this.properties['radius'] = 10;
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
    ButtonComponent.prototype.getRadius = function(){
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
        this.properties["id"]=id;
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['headerText'] = headerText;
        this.properties["componentType"]="panel";
        this.properties['children'] = new Map();
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
        this.properties["id"]=id;
        this.properties["componentType"]="screenControl";
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['radius'] = 10;
        this.properties['sizes'] = sizes;
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
    }
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
            var xPos = this.getX() + i * (itemWidth + 5);
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
        this.properties["id"]=id;
        this.properties["componentType"]="source";
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['text'] = text;
        this.properties['source'] = source;
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
    }
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
    };
    return SourceComponent;
})();
/******************************************************************************************/