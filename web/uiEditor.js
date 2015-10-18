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

uiEditor.helpers.drawSelection = function (ctx, componentX, componentY, componentWidth, componentHeight, color) {
    var selectionWidth = 10;
    var selectionHeight = 10;
    var x1 = componentX - selectionWidth / 2;
    var y1 = componentY - selectionHeight / 2;
    var x2 = x1 + componentWidth;
    var y2 = y1;
    var x3 = x1;
    var y3 = y1 + componentHeight;
    var x4 = x2;
    var y4 = y3;

    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x1, y1, selectionWidth, selectionHeight);
    ctx.fillRect(x2, y2, selectionWidth, selectionHeight);
    ctx.fillRect(x3, y3, selectionWidth, selectionHeight);
    ctx.fillRect(x4, y4, selectionWidth, selectionHeight);
    ctx.restore();
};

uiEditor.helpers.getLineStyle = function (lineStyle) {
    var result = null;
    switch (lineStyle) {
        case "solid":
            result = null;
            break;
        case "dotted":
            result = [1, 2];
            break;
        case "dashed":
            result = [5,2];
            break;
    }
    return result;
};

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
        this.properties = {};
        this.properties["id"] = id;
        this.properties["componentType"] = "image";
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['image_url'] = 'images/dummy-image.jpg';
        this.properties['z_index'] = 0;
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
        return this.properties['image_url'];
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
    ImageComponent.prototype.getZ_index = function () {
        return this.properties['z_index'];
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
        this.properties['image_url'] = imageSource;
    };
    ImageComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    ImageComponent.prototype.setZ_index = function (z_index) {
        this.properties['z_index'] = Number(z_index);
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
            if (!this.firstSelected)
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#ff0000");
            else
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#f202ca");
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
        this.properties = {};
        this.properties["id"] = id;
        this.properties["componentType"] = "text";
        this.properties['xPosition'] = x;
        this.properties['radius'] = 10;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['z_index'] = 0;
        this.properties['placeholder text'] = "placeholder text";
        this.properties['font_color'] = "#aaa";
        this.properties['font_face'] = "Arial";
        this.properties['font_type'] = "normal";
        this.properties['font_size'] = "20px";
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
    TextComponent.prototype.getZ_index = function () {
        return this.properties['z_index'];
    };
    TextComponent.prototype.getFontColor = function () {
        return this.properties['font_color'];
    };
    TextComponent.prototype.getFontFace = function () {
        return this.properties['font_face'];
    };
    TextComponent.prototype.getFontSize = function () {
        return this.properties['font_size'];
    };
    TextComponent.prototype.getFontType = function () {
        return this.properties['font_type'];
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
    TextComponent.prototype.setZ_index = function (z_index) {
        this.properties['z_index'] = Number(z_index);
    };
    TextComponent.prototype.setFontColor = function (color) {
        this.properties['font_color'] = color;
    };
    TextComponent.prototype.setFontFace = function (font_face) {
        this.properties['font_face'] = font_face;
    };
    TextComponent.prototype.setFontSize = function (font_size) {
        this.properties['font_size'] = font_size;
    };
    TextComponent.prototype.setFontType = function (font_type) {
        this.properties['font_type'] = font_type;
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
            ctx.fillStyle = this.getFontColor();
            ctx.font = this.getFontType() + " " + this.getFontSize() + " " + this.getFontFace();
            ctx.textAlign = "left";
            ctx.fillText(this.getPlaceholderText(), this.getX() + 20, this.getY() + this.getHeight() / 2 + 5);
            ctx.restore();
        }

        if (this.selected) {
            if (!this.firstSelected)
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#ff0000");
            else
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#f202ca");
        }
    };
    return TextComponent;
})();
/***********************************************************/

/*******************Display component class*********************/
uiEditor.components.DisplayComponent = (function () {
    function DisplayComponent(id, x, y, w, h, numberOfColumns, numberOfRows) {
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.properties = {};
        this.properties["id"] = id;
        this.properties["componentType"] = "display";
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['rows'] = numberOfRows;
        this.properties['cols'] = numberOfColumns;
        this.properties['z_index'] = 0;
        this.properties['spacing'] = 0;
        this.properties['bg_color'] = "#fff";
        this.properties['line_style'] = 'solid';
        this.properties['line_width']=1;
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
    DisplayComponent.prototype.getZ_index = function () {
        return this.properties['z_index'];
    };
    DisplayComponent.prototype.getSpacing = function () {
        return this.properties['spacing'];
    };
    DisplayComponent.prototype.getBgColor = function () {
        return this.properties['bg_color'];
    };
    DisplayComponent.prototype.getLineStyle = function () {
        return this.properties['line_style'];
    };
    DisplayComponent.prototype.getLineWidth = function(){
        return this.properties['line_width'];
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
    DisplayComponent.prototype.setZ_index = function (z_index) {
        this.properties['z_index'] = Number(z_index);
    };
    DisplayComponent.prototype.setSpacing = function (spacing) {
        this.properties['spacing'] = Number(spacing);
    };
    DisplayComponent.prototype.setBgColor = function (color) {
        this.properties['bg_color'] = color;
    };
    DisplayComponent.prototype.setLineStyle = function (lineStyle) {
        this.properties['line_style'] = lineStyle;
    };
    DisplayComponent.prototype.setLineWidth = function(lineWidth){
        this.properties['line_width']=Number(value);
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

        ctx.save();
        ctx.fillStyle = this.getBgColor();
        ctx.lineWidth=this.getLineWidth();
        var lineDash = uiEditor.helpers.getLineStyle(this.getLineStyle());
        if (lineDash !== null)
            ctx.setLineDash(lineDash);

        var spacing = this.getSpacing();
        var itemW = (this.getWidth() - (this.getNumberOfCols() + 1) * spacing) / this.getNumberOfCols();
        var itemH = (this.getHeight() - (this.getNumberOfRows() + 1) * spacing) / this.getNumberOfRows();

        ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());

        for (var i = 0; i < this.getNumberOfRows(); i++) {
            for (var j = 0; j < this.getNumberOfCols(); j++) {
                var x = this.getX() + (j + 1) * spacing + j * itemW;
                var y = this.getY() + (i + 1) * spacing + i * itemH;
                ctx.fillRect(x, y, itemW, itemH);
                ctx.strokeRect(x, y, itemW, itemH);
            }
        }
        ctx.restore();

        if (this.selected) {
            if (!this.firstSelected)
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#ff0000");
            else
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#f202ca");
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
        this.properties = {};
        this.properties['xPosition'] = x;
        this.properties["radius"] = 10;
        this.properties["id"] = id;
        this.properties["componentType"] = "button";
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['text'] = id;
        this.properties['radius'] = 10;
        this.properties['z_index'] = 0;
        this.properties['bg_color'] = "#e4e4e4";
        this.properties['font_color'] = "#000";
        this.properties['font_face'] = 'Arial';
        this.properties['font_type'] = 'normal';
        this.properties['font_size'] = '20px';
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
    ButtonComponent.prototype.getZ_index = function () {
        return this.properties['z_index'];
    };
    ButtonComponent.prototype.getBgColor = function () {
        return this.properties['bg_color'];
    };
    ButtonComponent.prototype.getFontColor = function () {
        return this.properties['font_color'];
    };
    ButtonComponent.prototype.getFontFace = function () {
        return this.properties['font_face'];
    };
    ButtonComponent.prototype.getFontSize = function () {
        return this.properties['font_size'];
    };
    ButtonComponent.prototype.getFontType = function () {
        return this.properties['font_type'];
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
    ButtonComponent.prototype.setZ_index = function (z_index) {
        this.properties['z_index'] = Number(z_index);
    };
    ButtonComponent.prototype.setBgColor = function (color) {
        this.properties['bg_color'] = color;
    };
    ButtonComponent.prototype.setFontColor = function (color) {
        this.properties['font_color'] = color;
    };
    ButtonComponent.prototype.setFontFace = function (font_face) {
        this.properties['font_face'] = font_face;
    };
    ButtonComponent.prototype.setFontSize = function (font_size) {
        this.properties['font_size'] = font_size;
    };
    ButtonComponent.prototype.setFontType = function (font_type) {
        this.properties['font_type'] = font_type;
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
        ctx.fillStyle = this.getBgColor();
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
            ctx.fillStyle = this.getFontColor();
            ctx.font = this.getFontType() + " " + this.getFontSize() + " " + this.getFontFace();
            ctx.textAlign = "center";
            ctx.fillText(this.getText(), this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() / 2 + 5);
            ctx.restore();
        }
        ctx.restore();

        if (this.selected) {
            if (!this.firstSelected)
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#ff0000");
            else
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#f202ca");
        }
    };
    return ButtonComponent;
})();
/*************************************************************/


/*********************Panel component*************************/
uiEditor.components.PanelComponent = (function () {
    function PanelComponent(id, x, y, w, h, headerText, fromJson, items) {
        if (!fromJson) {
            console.log("fromJson false");
            this.horizontalAlignment = null; //"center" | "right" | "left"
            this.verticalAlignment = null; //"top" | "bottom" | "center"
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
            this.properties['z_index'] = 0;
            this.selected = false;
            this.firstSelected = false;
        }
        else {
            console.log("fromJson true");

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
            this.properties['z_index'] = 0;

            for (var i = 0; i < items.button.length; i++) {
                this.properties['components'].set(items.button[i].id,
                        new uiEditor.components.ButtonComponent(items.button[i].id,
                                items.button[i].xPosition,
                                items.button[i].yPosition,
                                items.button[i].width,
                                items.button[i].height));
            }

            for (var i = 0; i < items.text.length; i++) {
                this.properties['components'].set(items.text[i].id,
                        new uiEditor.components.TextComponent(items.text[i].id,
                                items.text[i].xPosition,
                                items.text[i].yPosition,
                                items.text[i].width,
                                items.text[i].height));
            }

            for (var i = 0; i < items.image.length; i++) {
                this.properties['components'].set(items.image[i].id,
                        new uiEditor.components.ImageComponent(items.image[i].id,
                                items.image[i].xPosition,
                                items.image[i].yPosition,
                                items.image[i].width,
                                items.image[i].height));
            }

            for (var i = 0; i < items.panel.length; i++) {
                this.properties['components'].set(items.panel[i].id,
                        new uiEditor.components.PanelComponent(items.panel[i].id,
                                items.panel[i].xPosition,
                                items.panel[i].yPosition,
                                items.panel[i].width,
                                items.panel[i].height,
                                items.panel[i].headerText,
                                true,
                                items.panel[i].children));
            }

            for (var i = 0; i < items.group.length; i++) {
                this.properties['components'].set(items.button[i].id,
                        new uiEditor.components.Group(items.group[i].id,
                                null,
                                null,
                                true,
                                items.button[i].xPosition,
                                items.button[i].yPosition,
                                items.button[i].width,
                                items.button[i].height,
                                items.group[i].items));
            }

            this.selected = false;
            this.firstSelected = false;
        }
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
    PanelComponent.prototype.getZ_index = function () {
        return this.properties['z_index'];
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
    PanelComponent.prototype.setZ_index = function (z_index) {
        this.properties['z_index'] = Number(z_index);
    };
    /*************************************************/
    PanelComponent.prototype.getPropertiesForJSON = function () {
        var panel = {};
        panel.id = this.getID();
        panel.xPos = this.getX();
        panel.yPos = this.getY();
        panel.width = this.getWidth();
        panel.height = this.getHeight();
        panel.headerText = this.getHeaderText();
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
    PanelComponent.prototype.deselectChildren = function(){
        this.properties['children'].forEach(function(value, key){
            value.deselect();
        })
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
            if (!this.firstSelected)
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#ff0000");
            else
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#f202ca");
        }
    };
    return PanelComponent;
})();
/******************************************************************************************/


/*******************************Screen control*********************************************/
uiEditor.components.ScreenControlComponent = (function () {
    function ScreenControlComponent(id, x, y, w, h, rows, cols) {
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.properties = {};
        this.properties['xPosition'] = x;
        this.properties["id"] = id;
        this.properties["componentType"] = "screenControl";
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['radius'] = 10;
        this.properties['itemWidth'] = 60;
        this.properties['itemHeight'] = 40;
        this.properties['rows'] = rows;
        this.properties['cols'] = cols;
        this.properties['z_index'] = 0;
        this.properties['bg_color'] = "#e4e4e4";
        this.properties['font_color'] = "#000";
        this.properties['font_face'] = 'Arial';
        this.properties['font_type'] = 'normal';
        this.properties['font_size'] = '20px';
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
    ScreenControlComponent.prototype.getRows = function () {
        return this.properties['rows'];
    };
    ScreenControlComponent.prototype.getRadius = function () {
        return this.properties['radius'];
    };
    ScreenControlComponent.prototype.getCols = function () {
        return this.properties['cols'];
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
    ScreenControlComponent.prototype.getZ_index = function () {
        return this.properties['z_index'];
    };
    ScreenControlComponent.prototype.getBgColor = function () {
        return this.properties['bg_color'];
    };
    ScreenControlComponent.prototype.getFontColor = function () {
        return this.properties['font_color'];
    };
    ScreenControlComponent.prototype.getFontFace = function () {
        return this.properties['font_face'];
    };
    ScreenControlComponent.prototype.getFontSize = function () {
        return this.properties['font_size'];
    };
    ScreenControlComponent.prototype.getFontType = function () {
        return this.properties['font_type'];
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
    ScreenControlComponent.prototype.setRows = function (rows) {
        this.properties['rows'] = Number(rows);
    };
    ScreenControlComponent.prototype.setCols = function (cols) {
        this.properties['cols'] = Number(cols);
    };
    ScreenControlComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    ScreenControlComponent.prototype.setZ_index = function (z_index) {
        this.properties['z_index'] = Number(z_index);
    };
    ScreenControlComponent.prototype.setBgColor = function (color) {
        this.properties['bg_color'] = color;
    };
    ScreenControlComponent.prototype.setFontColor = function (color) {
        this.properties['font_color'] = color;
    };
    ScreenControlComponent.prototype.setFontFace = function (font_face) {
        this.properties['font_face'] = font_face;
    };
    ScreenControlComponent.prototype.setFontSize = function (font_size) {
        this.properties['font_size'] = font_size;
    };
    ScreenControlComponent.prototype.setFontType = function (font_type) {
        this.properties['font_type'] = font_type;
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

        ctx.save();

        ctx.textAlign = "center";

        ctx.fillStyle = this.getBgColor();
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

        ctx.restore();

        ctx.save();
        ctx.fillStyle = this.getFontColor()
        ctx.font = this.getFontType() + " " + this.getFontSize() + " " + this.getFontFace();
        ctx.textAlign = "center";
        ctx.fillText(this.getRows().toString() + " x " + this.getCols().toString(), this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() / 2 + 5);
        ctx.restore();

        if (this.selected) {
            if (!this.firstSelected)
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#ff0000");
            else
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#f202ca");
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
        this.properties = {};
        this.properties['xPosition'] = x;
        this.properties["id"] = id;
        this.properties["componentType"] = "source";
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        this.properties['text'] = text;
        this.properties['source'] = source;
        this.properties['z_index'] = 0;
        this.properties['bg_color'] = "#e4e4e4";
        this.properties['font_color'] = "#000";
        this.properties['font_face'] = 'Arial';
        this.properties['font_type'] = 'normal';
        this.properties['font_size'] = '20px';
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
    SourceComponent.prototype.getZ_index = function () {
        return this.properties['z_index'];
    };
    SourceComponent.prototype.getBgColor = function () {
        return this.properties['bg_color'];
    };
    SourceComponent.prototype.getFontColor = function () {
        return this.properties['font_color'];
    };
    SourceComponent.prototype.getFontFace = function () {
        return this.properties['font_face'];
    };
    SourceComponent.prototype.getFontSize = function () {
        return this.properties['font_size'];
    };
    SourceComponent.prototype.getFontType = function () {
        return this.properties['font_type'];
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
    SourceComponent.prototype.setZ_index = function (z_index) {
        this.properties['z_index'] = Number(z_index);
    };
    SourceComponent.prototype.setBgColor = function (color) {
        this.properties['bg_color'] = color;
    };
    SourceComponent.prototype.setFontColor = function (color) {
        this.properties['font_color'] = color;
    };
    SourceComponent.prototype.setFontFace = function (font_face) {
        this.properties['font_face'] = font_face;
    };
    SourceComponent.prototype.setFontSize = function (font_size) {
        this.properties['font_size'] = font_size;
    };
    SourceComponent.prototype.setFontType = function (font_type) {
        this.properties['font_type'] = font_type;
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

        ctx.fillStyle = this.getBgColor();
        ctx.textAlign = "center";

        ctx.beginPath();
        ctx.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = this.getFontColor();
        ctx.font = this.getFontType() + " " + this.getFontSize() + " " + this.getFontFace();
        ctx.fillText(this.getText(), this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() / 2 + 5);

        ctx.restore();

        if (this.selected) {
            if (!this.firstSelected)
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#ff0000");
            else
                uiEditor.helpers.drawSelection(ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), "#f202ca");
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
        this.size = [];
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
        this.size.push(size);
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
        if (this.getSize().length > 0) {
            result.size = [];
            for (var i = 0; i < this.getSize().length; i++) {
                result.size.push(this.getSize()[i].getPropertiesForJSON());
            }
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

    GroupSelection.prototype.alignIntervalHorizontal = function (components) {
        if (this.firstItem === null) {
            return;
        }

        var selectionItems = [];
        this.selection.forEach(function (value, key) {
            selectionItems.push(components.get(value));
        });

        selectionItems.sort(function (a, b) {
            if (a.getX() < b.getX()) {
                return -1;
            }
            if (a.getX() > b.getX()) {
                return 1;
            }
            if (a.getY() < b.getY()) {
                return -1;
            }
            if (a.getY() > b.getY()) {
                return 1;
            }
            return 0;
        });

        var count = 0;
        var d = selectionItems[selectionItems.length - 1].getX();

        for (var i = selectionItems.length - 2; i >= 1; i--) {
            d -= selectionItems[i].getWidth();
            count++;
        }

        d -= selectionItems[0].getX() + selectionItems[0].getWidth();
        d /= count + 1;

        //Test D
        //d = selectionItems[selectionItems.length-1].getX() - selectionItems[0].getX() - selectionItems[0].getWidth();

        //d/=selectionItems.length-2;

        console.log('d=' + d);

        for (var i = 1; i < selectionItems.length - 1; i++) {
            selectionItems[i].setX(selectionItems[i - 1].getX() + selectionItems[i - 1].getWidth() + d);
        }
    };

    GroupSelection.prototype.alignIntervalVertical = function (components) {
        if (this.firstItem === null) {
            return;
        }

        var selectionItems = [];
        this.selection.forEach(function (value, key) {
            selectionItems.push(components.get(value));
        });

        selectionItems.sort(function (a, b) {
            if (a.getY() < b.getY()) {
                return -1;
            }
            if (a.getY() > b.getY()) {
                return 1;
            }
            if (a.getX() < b.getX()) {
                return -1;
            }
            if (a.getX() > b.getX()) {
                return 1;
            }
            return 0;
        });

        var count = 0;
        var d = selectionItems[selectionItems.length - 1].getY();

        for (var i = selectionItems.length - 2; i >= 1; i--) {
            d -= selectionItems[i].getHeight();
            count++;
        }

        d -= selectionItems[0].getY() + selectionItems[0].getHeight();
        d /= count + 1;

        for (var i = 1; i < selectionItems.length - 1; i++) {
            selectionItems[i].setY(selectionItems[i - 1].getY() + selectionItems[i - 1].getHeight() + d);
        }
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

    GroupSelection.prototype.isEmpty = function () {
        return this.selection.size == 0;
    }


    return GroupSelection;
})();

uiEditor.components.Group = (function () {
    function Group(id, selection, components, fromJson, x, y, w, h, items) {
        if (!fromJson) {
            console.log("not from json");
            this.properties = {};
            this.properties['id'] = id;
            this.properties['componentType'] = "group";
            this.properties['components'] = new Map();
            this.properties['z_index'] = 0;
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
        else {
            console.log("from json");
            this.properties = {};
            this.properties['id'] = id;
            this.properties['componentType'] = "group";
            this.properties['components'] = new Map();
            this.properties['xPosition'] = x;
            this.properties['yPosition'] = y;
            this.properties['width'] = w;
            this.properties['height'] = h;
            this.properties['z_index'] = 0;

            console.log(x)
            console.log(y)
            console.log(w)
            console.log(h)

            this.selected = false;
            this.firstSelected = false;

            for (var i = 0; i < items.button.length; i++) {
                this.properties['components'].set(items.button[i].id,
                        new uiEditor.components.ButtonComponent(items.button[i].id,
                                items.button[i].xPosition,
                                items.button[i].yPosition,
                                items.button[i].width,
                                items.button[i].height));
            }

            for (var i = 0; i < items.text.length; i++) {
                this.properties['components'].set(items.text[i].id,
                        new uiEditor.components.TextComponent(items.text[i].id,
                                items.text[i].xPosition,
                                items.text[i].yPosition,
                                items.text[i].width,
                                items.text[i].height));
            }

            for (var i = 0; i < items.image.length; i++) {
                this.properties['components'].set(items.image[i].id,
                        new uiEditor.components.ImageComponent(items.image[i].id,
                                items.image[i].xPosition,
                                items.image[i].yPosition,
                                items.image[i].width,
                                items.image[i].height));
            }

            for (var i = 0; i < items.panel.length; i++) {
                this.properties['components'].set(items.panel[i].id,
                        new uiEditor.components.PanelComponent(items.panel[i].id,
                                items.panel[i].xPosition,
                                items.panel[i].yPosition,
                                items.panel[i].width,
                                items.panel[i].height,
                                items.panel[i].headerText,
                                true,
                                items.panel[i].children));
            }

            for (var i = 0; i < items.group.length; i++) {
                this.properties['components'].set(items.button[i].id,
                        new uiEditor.components.Group(items.group[i].id,
                                null,
                                null,
                                true,
                                items.group[i].xPos,
                                items.group[i].yPos,
                                items.group[i].width,
                                items.group[i].height,
                                items.group[i].items));
            }




        }

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
    Group.prototype.getZ_index = function () {
        return this.properties['z_index'];
    };
    Group.prototype.getPropertyValue = function (propertyName) {
        return this.properties[propertyName];
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
    Group.prototype.setZ_index = function (z_index) {
        this.properties['z_index'] = Number(z_index);
    };
    Group.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
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
            ctx.setLineDash([3, 2]);
            ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }

        else {
            ctx.save();
            ctx.setLineDash([3, 2]);
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



