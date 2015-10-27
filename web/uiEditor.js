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

uiEditor.helpers.resizeHitTest = function (componentX, componentY, componentWidth, componentHeight, testX, testY) {
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

    var result = false;

    if (testX >= x1 && testX <= x1 + selectionWidth &&
            testY >= y1 && testY <= y1 + selectionHeight) {
        result = true;
    }

    else if (testX >= x2 && testX <= x2 + selectionWidth &&
            testY >= y2 && testY <= y2 + selectionHeight) {
        result = true;
    }

    else if (testX >= x3 && testX <= x3 + selectionWidth &&
            testY >= y3 && testY <= y3 + selectionHeight) {
        result = true;
    }

    else if (testX >= x4 && testX <= x4 + selectionWidth &&
            testY >= y4 && testY <= y4 + selectionHeight) {
        result = true;
    }

    return result;
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
            result = [5, 2];
            break;
    }
    return result;
};

uiEditor.helpers.NONE_FLAG = 0;
uiEditor.helpers.BUTTON_FLAG = 1;
uiEditor.helpers.TEXT_FLAG = 2;
uiEditor.helpers.DISPLAY_FLAG = 4;
uiEditor.helpers.PANEL_FLAG = 8;
uiEditor.helpers.SCREEN_CONTROL_FLAG = 16;
uiEditor.helpers.SOURCE_FLAG = 32;
uiEditor.helpers.IMAGE_FLAG = 64;

//TODO
//save id's to project, or make id generation unique (guid)
uiEditor.helpers.IdSpecifier = (function () {
    function IdSpecifier(buttonCount, textBoxCount, displayCount, imageCount, panelCount,
            screenControlCount, sourceCount, groupCount) {
        this.buttonCount = buttonCount;
        this.textboxCount = textBoxCount;
        this.displayCount = displayCount;
        this.imageCount = imageCount;
        this.panelCount = panelCount;
        this.screenCountrolCount = screenControlCount;
        this.sourceCount = sourceCount;
        this.groupCount = groupCount;
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

    IdSpecifier.prototype.getPropertiesForJSON = function () {
        var idSpecifier = {};
        idSpecifier.buttonCount = this.buttonCount;
        idSpecifier.textboxCount = this.textboxCount;
        idSpecifier.displayCount = this.displayCount;
        idSpecifier.imageCount = this.imageCount;
        idSpecifier.panelCount = this.panelCount;
        idSpecifier.screenControlCount = this.screenCountrolCount;
        idSpecifier.sourceCount = this.sourceCount;
        idSpecifier.groupCount = this.groupCount;

        return idSpecifier;
    };

    return IdSpecifier;
})();

/*********************Image component class**********************/
uiEditor.components.ImageComponent = (function () {

    //constructor of ImageComponent
    function ImageComponent(id, x, y, w, h, imageUrl, z_index) {
        this.horizontalAlignment = null; //"center" | "right" | "left"
        this.verticalAlignment = null; //"top" | "bottom" | "center"
        this.properties = {};
        this.properties["id"] = id;
        this.properties["componentType"] = "image";
        this.properties['xPosition'] = x;
        this.properties['yPosition'] = y;
        this.properties['width'] = w;
        this.properties['height'] = h;
        if (imageUrl === null)
            this.properties['bg_image'] = 'images/dummy-image.jpg';
        else
            this.properties['bg_image'] = imageUrl;

        if (typeof (z_index) === 'undefined' || z_index === null)
            this.properties['z_index'] = 0;
        else
            this.properties['z_index'] = z_index;

        this.selected = false;
        this.firstSelected = false;
        this.image = new Image();
        this.image.src = this.properties['bg_image'];

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
        return this.properties['bg_image'];
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
        console.log(imageSource);
        this.properties['bg_image'] = imageSource;
        this.image.src = imageSource;
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
        var result = {"hit": false, "component": this.getID(), "panel": null, "resize": false};
        if (uiEditor.helpers.resizeHitTest(this.getX(), this.getY(), this.getWidth(), this.getHeight(), x, y)) {
            result.resize = true;
            console.log('resize');
        }
        else if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
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

        //var image = new Image();
        this.image.src = this.getBackgroundImage();
        ctx.drawImage(this.image, this.getX(), this.getY(), this.getWidth(), this.getHeight());

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
    function TextComponent(id, x, y, w, h, z_index, placeholder_text, font_color, font_face, font_type, font_size, bg_image, bg_color) {
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

        if (typeof (z_index) === 'undefined' || z_index === null)
            this.properties['z_index'] = 0;
        else
            this.properties['z_index'] = z_index;

        if (typeof (placeholder_text) === 'undefined' || placeholder_text === null)
            this.properties['placeholder_text'] = "placeholder text";
        else
            this.properties['placeholder_text'] = placeholder_text;

        if (typeof (font_color) === 'undefined' || font_color === null)
            this.properties['font_color'] = "#000";
        else
            this.properties['font_color'] = font_color;

        if (typeof (font_face) === 'undefined' || font_face === null)
            this.properties['font_face'] = 'Arial';
        else
            this.properties['font_face'] = font_face;

        if (typeof (font_type) === 'undefined' || font_type === null)
            this.properties['font_type'] = 'normal';
        else
            this.properties['font_type'] = font_type;

        if (typeof (font_size) === 'undefined' || font_size === null)
            this.properties['font_size'] = '20px';
        else
            this.properties['font_size'] = font_size;

        if (typeof (bg_image) === 'undefined' || bg_image === null)
            this.properties['bg_image'] = "not set";
        else
            this.properties['bg_image'] = bg_image;

        if (typeof (bg_color) === 'undefined' || bg_color === null)
            this.properties['bg_color'] = "#fff";
        else
            this.properties['bg_color'] = bg_color;

        this.selected = false;
        this.firstSelected = false;
        this.image = new Image();
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
        return this.properties['placeholder_text'];
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
    TextComponent.prototype.getBackgroundImage = function () {
        return this.properties['bg_image'];
    };
    TextComponent.prototype.getBgColor = function () {
        return this.properties['bg_color'];
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
        this.properties['placeholder_text'] = placeholderText;
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
    TextComponent.prototype.setBackgroundImage = function (image_url) {
        this.properties['bg_image'] = image_url;
        this.image.src = image_url;

    };
    TextComponent.prototype.setBgColor = function (color) {
        this.properties['bg_color'] = color;
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
        var result = {"hit": false, "component": this.getID(), "panel": null, "resize": false};
        if (uiEditor.helpers.resizeHitTest(this.getX(), this.getY(), this.getWidth(), this.getHeight(), x, y)) {
            result.resize = true;
            console.log('resize');
        }
        else if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
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

        ctx.save();
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

        if (this.getBackgroundImage() !== "not set") {
            this.image.src = this.getBackgroundImage();
            ctx.save();
            ctx.clip();
            ctx.drawImage(this.image, this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
        else {
            ctx.save();
            ctx.clip();
            ctx.fillStyle = this.getBgColor();
            ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }

        ctx.stroke();

        if (this.getPlaceholderText() !== null) {
            ctx.save();
            ctx.fillStyle = this.getFontColor();
            ctx.font = this.getFontType() + " " + this.getFontSize() + " " + this.getFontFace();
            ctx.textAlign = "left";
            ctx.fillText(this.getPlaceholderText(), this.getX() + 20, this.getY() + this.getHeight() / 2 + 5);
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
    return TextComponent;
})();
/***********************************************************/

/*******************Display component class*********************/
uiEditor.components.DisplayComponent = (function () {
    function DisplayComponent(id, x, y, w, h, numberOfColumns, numberOfRows, z_index, spacing, bg_color, line_style, line_width, bg_image) {
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

        if (typeof (z_index) === 'undefined' || z_index === null)
            this.properties['z_index'] = 0;
        else
            this.properties['z_index'] = z_index;

        if (typeof (spacing) === 'undefined' || spacing === null)
            this.properties['spacing'] = 0;
        else
            this.properties['spacing'] = spacing;

        if (typeof (bg_color) === 'undefined' || bg_color === null)
            this.properties['bg_color'] = "#fff";
        else
            this.properties['bg_color'] = bg_color;

        if (typeof (line_style) === 'undefined' || line_style === null)
            this.properties['line_style'] = "solid";
        else
            this.properties['line_style'] = line_style;

        if (typeof (line_width) === 'undefined' || line_width === null)
            this.properties['line_width'] = 1;
        else
            this.properties['line_width'] = line_width;

        if (typeof (bg_image) === 'undefined' || bg_image === null)
            this.properties['bg_image'] = "not set";
        else
            this.properties['bg_image'] = bg_image;

        this.selected = false;
        this.firstSelected = false;
        this.image = new Image();
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
    DisplayComponent.prototype.getRows = function () {
        return this.properties["rows"];
    };
    DisplayComponent.prototype.getCols = function () {
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
    DisplayComponent.prototype.getLineWidth = function () {
        return this.properties['line_width'];
    };
    DisplayComponent.prototype.getBackgroundImage = function () {
        return this.properties['bg_image'];
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
    DisplayComponent.prototype.setCols = function (numberOfColumns) {
        this.properties['cols'] = numberOfColumns;
    };
    DisplayComponent.prototype.setRows = function (numberOfRows) {
        this.properties['rows'] = numberOfRows;
    };
    DisplayComponent.prototype.setPropertyValue = function (propertyName, propertyValue) {
        this.properties[propertyName] = propertyValue;
    };
    DisplayComponent.prototype.setZ_index = function (z_index) {
        this.properties['z_index'] = Number(z_index);
    };
    DisplayComponent.prototype.setSpacing = function (spacing) {
        spacing = Number(spacing);
        if (spacing < 0)
            spacing = 0;
        this.properties['spacing'] = spacing;
    };
    DisplayComponent.prototype.setBgColor = function (color) {
        this.properties['bg_color'] = color;
    };
    DisplayComponent.prototype.setLineStyle = function (lineStyle) {
        this.properties['line_style'] = lineStyle;
    };
    DisplayComponent.prototype.setLineWidth = function (lineWidth) {
        this.properties['line_width'] = Number(value);
    };
    DisplayComponent.prototype.setBackgroundImage = function (image_url) {
        this.properties['bg_image'] = image_url;
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
        var result = {"hit": false, "component": this.getID(), "panel": null, "resize": false};
        if (uiEditor.helpers.resizeHitTest(this.getX(), this.getY(), this.getWidth(), this.getHeight(), x, y)) {
            result.resize = true;
            console.log('resize');
        }
        else if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
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
        this.setRows(Number(this.getRows()));
        this.setCols(Number(this.getCols()));
        if (this.getSpacing() < 0)
            this.setSpacing(0);

        ctx.save();
        ctx.fillStyle = this.getBgColor();
        ctx.lineWidth = this.getLineWidth();
        var lineDash = uiEditor.helpers.getLineStyle(this.getLineStyle());
        if (lineDash !== null)
            ctx.setLineDash(lineDash);

        var spacing = this.getSpacing();
        var itemW = (this.getWidth() - (this.getCols() + 1) * spacing) / this.getCols();
        var itemH = (this.getHeight() - (this.getRows() + 1) * spacing) / this.getRows();



        if (this.getBackgroundImage() !== "not set") {
            console.log(this.getBackgroundImage());
            this.image.src = this.getBackgroundImage();
            ctx.drawImage(this.image, this.getX(), this.getY(), this.getWidth(), this.getHeight());
        }
        else
            ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());

        for (var i = 0; i < this.getRows(); i++) {
            for (var j = 0; j < this.getCols(); j++) {
                var x = this.getX() + (j + 1) * spacing + j * itemW;
                var y = this.getY() + (i + 1) * spacing + i * itemH;
                //ctx.fillRect(x, y, itemW, itemH);
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
    function ButtonComponent(id, x, y, w, h, z_index, bg_color, bg_image, second_image, font_color, font_face, font_type, font_size) {
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

        if (typeof (z_index) === 'undefined' || z_index === null)
            this.properties['z_index'] = 0;
        else
            this.properties['z_index'] = z_index;

        if (typeof (bg_color) === 'undefined' || bg_color === null)
            this.properties['bg_color'] = "#e4e4e4";
        else
            this.properties['bg_color'] = bg_color;

        if (typeof (bg_image) === 'undefined' || bg_image === null)
            this.properties['bg_image'] = "not set";
        else
            this.properties['bg_image'] = bg_image;

        if (typeof (second_image) === 'undefined' || second_image === null)
            this.properties['second_image'] = "not set";
        else
            this.properties['second_image'] = second_image;

        if (typeof (font_color) === 'undefined' || font_color === null)
            this.properties['font_color'] = "#000";
        else
            this.properties['font_color'] = font_color;

        if (typeof (font_face) === 'undefined' || font_face === null)
            this.properties['font_face'] = 'Arial';
        else
            this.properties['font_face'] = font_face;

        if (typeof (font_type) === 'undefined' || font_type === null)
            this.properties['font_type'] = 'normal';
        else
            this.properties['font_type'] = font_type;

        if (typeof (font_size) === 'undefined' || font_size === null)
            this.properties['font_size'] = '20px';
        else
            this.properties['font_size'] = font_size;
        this.selected = false;
        this.firstSelected = false;
        this.image = new Image();
        this.secondImage = new Image();
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
    ButtonComponent.prototype.getBackgroundImage = function () {
        return this.properties['bg_image'];
    };
    ButtonComponent.prototype.getSecondImage = function () {
        return this.properties['second_image'];
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
    ButtonComponent.prototype.setBackgroundImage = function (image_url) {
        this.properties['bg_image'] = image_url;
    };
    ButtonComponent.prototype.setSecondImage = function (image_url) {
        this.properties['second_image'] = image_url;
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
        var result = {"hit": false, "component": this.getID(), "panel": null, "resize": false};
        if (uiEditor.helpers.resizeHitTest(this.getX(), this.getY(), this.getWidth(), this.getHeight(), x, y)) {
            result.resize = true;
            console.log('resize');
        }
        else if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
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
        if (this.getBackgroundImage() !== "not set") {
            ctx.save();
            ctx.clip();
            this.image.src = this.getBackgroundImage();
            ctx.drawImage(this.image, this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
        else
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
    function PanelComponent(id, x, y, w, h, headerText, fromJson, items, bg_image, bg_color, z_index) {
        this.image = new Image();
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
            this.properties['bg_color'] = "#fff";
            this.properties['bg_image'] = "not set";

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
            this.properties['z_index'] = z_index;
            this.properties['bg_image'] = bg_image;
            this.properties['bg_color'] = bg_color;

            for (var i = 0; i < items.button.length; i++) {
                this.properties['children'].set(items.button[i].id,
                        new uiEditor.components.ButtonComponent(items.button[i].id,
                                items.button[i].xPosition,
                                items.button[i].yPosition,
                                items.button[i].width,
                                items.button[i].height,
                                items.button[i].z_index,
                                items.button[i].bg_color,
                                items.button[i].bg_image,
                                items.button[i].second_image,
                                items.button[i].font_color,
                                items.button[i].font_face,
                                items.button[i].font_type,
                                items.button[i].font_size));
            }

            for (var i = 0; i < items.text.length; i++) {
                this.properties['children'].set(items.text[i].id,
                        new uiEditor.components.TextComponent(items.text[i].id,
                                items.text[i].xPosition,
                                items.text[i].yPosition,
                                items.text[i].width,
                                items.text[i].height,
                                items.text[i].z_index,
                                items.text[i].placeholder_text,
                                items.text[i].font_color,
                                items.text[i].font_face,
                                items.text[i].font_type,
                                items.text[i].font_size,
                                items.text[i].bg_image,
                                items.text[i].bg_color));
            }

            for (var i = 0; i < items.image.length; i++) {
                this.properties['children'].set(items.image[i].id,
                        new uiEditor.components.ImageComponent(items.image[i].id,
                                items.image[i].xPosition,
                                items.image[i].yPosition,
                                items.image[i].width,
                                items.image[i].height,
                                items.image[i].bg_image,
                                items.image[i].z_index));
            }

            for (var i = 0; i < items.panel.length; i++) {
                this.properties['children'].set(items.panel[i].id,
                        new uiEditor.components.PanelComponent(items.panel[i].id,
                                items.panel[i].xPosition,
                                items.panel[i].yPosition,
                                items.panel[i].width,
                                items.panel[i].height,
                                items.panel[i].headerText,
                                true,
                                items.panel[i].children,
                                items.panel[i].bg_image,
                                items.panel[i].bg_color));
            }

            for (var i = 0; i < items.group.length; i++) {
                this.properties['children'].set(items.button[i].id,
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
    PanelComponent.prototype.getBackgroundImage = function () {
        return this.properties['bg_image'];
    };
    PanelComponent.prototype.getBgColor = function () {
        return this.properties['bg_color'];
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
    PanelComponent.prototype.setBackgroundImage = function (image_url) {
        this.properties['bg_image'] = image_url;
    };
    PanelComponent.prototype.setBgColor = function (color) {
        this.properties['bg_color'] = color;
    };
    /*************************************************/
    PanelComponent.prototype.getPropertiesForJSON = function () {
        var panel = {};
        panel.id = this.getID();
        panel.xPosition = this.getX();
        panel.yPosition = this.getY();
        panel.width = this.getWidth();
        panel.height = this.getHeight();
        panel.headerText = this.getHeaderText();
        panel.componentType = this.getComponentType();
        panel.headerHeight = this.getHeaderHeight();
        panel.bg_image = this.getBackgroundImage();
        panel.bg_color = this.getBgColor();
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
        var resize = uiEditor.helpers.resizeHitTest(this.getX(), this.getY(), this.getWidth(), this.getHeight(), x, y);
        if (resize) {
            result = {"hit": false, "component": this.getID(), "panel": null, "resize": true};
        }
        else if (!result.hit) {
            result = this.bodyHitTest(x, y);
            if (result.hit) {
                var temp = this.childHitTest(x, y);
                if (temp.resize) {
                    result.hit = false;
                    result.resize = true;
                    result.component = temp.component;
                }
                else if (temp.hit) {
                    result.component = temp.component;
                }

            }
        }
        return result;
    };
    PanelComponent.prototype.childHitTest = function (x, y) {
        var result = {"hit": false, "component": null, "panel": this.getID(), "resize": false};
        this.getChildren().forEach(function (value, key) {
            var temp = value.hitTest(x, y);
            if (temp.hit) {
                result.hit = true;
                result.component = temp.component;
            }
            else if(temp.resize){
                result.resize = true;
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
    PanelComponent.prototype.deselectChildren = function () {
        this.properties['children'].forEach(function (value, key) {
            value.deselect();
        });
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
        if (this.getBackgroundImage() !== "not set") {
            this.image.src = this.getBackgroundImage();
            ctx.drawImage(this.image, this.getX(), this.getY() + this.getHeaderHeight(), this.getWidth(), this.getHeight() - this.getHeaderHeight());
        }
        else {
            ctx.fillStyle = this.getBgColor();
            ctx.fillRect(this.getX(), this.getY() + this.getHeaderHeight(), this.getWidth(), this.getHeight() - this.getHeaderHeight());
        }
        ctx.strokeRect(this.getX(), this.getY() + this.getHeaderHeight(), this.getWidth(), this.getHeight() - this.getHeaderHeight());
        ctx.restore();

        var buf = [];

        this.properties['children'].forEach(function (value, key) {
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
                buf[i].draw(ctx);
            }
        }



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
    function ScreenControlComponent(id, x, y, w, h, rows, cols, z_index, bg_color, font_color, font_face, font_type, font_size, bg_image) {
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
        this.properties['rows'] = rows;
        this.properties['cols'] = cols;

        if (typeof (z_index) === 'undefined' || z_index === null)
            this.properties['z_index'] = 0;
        else
            this.properties['z_index'] = z_index;

        if (typeof (bg_color) === 'undefined' || bg_color === null)
            this.properties['bg_color'] = "#e4e4e4";
        else
            this.properties['bg_color'] = bg_color;

        if (typeof (font_color) === 'undefined' || font_color === null)
            this.properties['font_color'] = "#000";
        else
            this.properties['font_color'] = font_color;

        if (typeof (font_face) === 'undefined' || font_face === null)
            this.properties['font_face'] = 'Arial';
        else
            this.properties['font_face'] = font_face;

        if (typeof (font_type) === 'undefined' || font_type === null)
            this.properties['font_type'] = 'normal';
        else
            this.properties['font_type'] = font_type;

        if (typeof (font_size) === 'undefined' || font_size === null)
            this.properties['font_size'] = '20px';
        else
            this.properties['font_size'] = font_size;

        if (typeof (bg_image) === 'undefined' || bg_image === null)
            this.properties['bg_image'] = "not set";
        else
            this.properties['bg_image'] = bg_image;





        this.selected = false;
        this.firstSelected = false;
        this.image = new Image();
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
    ScreenControlComponent.prototype.getBackgroundImage = function () {
        return this.properties['bg_image'];
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
    ScreenControlComponent.prototype.setBackgroundImage = function (image_url) {
        this.properties['bg_image'] = image_url;
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
        var result = {"hit": false, "component": this.getID(), "panel": null, "resize": false};
        if (uiEditor.helpers.resizeHitTest(this.getX(), this.getY(), this.getWidth(), this.getHeight(), x, y)) {
            result.resize = true;
            console.log('resize');
        }
        else if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
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

        if (this.getBackgroundImage() !== "not set") {
            this.image.src = this.getBackgroundImage();
            ctx.save();
            ctx.clip();
            ctx.drawImage(this.image, this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }

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
    function SourceComponent(id, x, y, w, h, text, source, z_index, bg_color, font_color, font_face, font_type, font_size, bg_image) {
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

        if (typeof (z_index) === 'undefined' || z_index === null)
            this.properties['z_index'] = 0;
        else
            this.properties['z_index'] = z_index;

        if (typeof (bg_color) === 'undefined' || bg_color === null)
            this.properties['bg_color'] = "#e4e4e4";
        else
            this.properties['bg_color'] = bg_color;

        if (typeof (font_color) === 'undefined' || font_color === null)
            this.properties['font_color'] = "#000";
        else
            this.properties['font_color'] = font_color;

        if (typeof (font_face) === 'undefined' || font_face === null)
            this.properties['font_face'] = 'Arial';
        else
            this.properties['font_face'] = font_face;

        if (typeof (font_type) === 'undefined' || font_type === null)
            this.properties['font_type'] = 'normal';
        else
            this.properties['font_type'] = font_type;

        if (typeof (font_size) === 'undefined' || font_size === null)
            this.properties['font_size'] = '20px';
        else
            this.properties['font_size'] = font_size;

        if (typeof (bg_image) === 'undefined' || bg_image === null)
            this.properties['bg_image'] = "not set";
        else
            this.properties['bg_image'] = bg_image;

        this.selected = false;
        this.firstSelected = false;
        this.image = new Image();
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
    SourceComponent.prototype.getBackgroundImage = function () {
        return this.properties['bg_image'];
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
    SourceComponent.prototype.setBackgroundImage = function (image_url) {
        this.properties['bg_image'] = image_url;
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
        var result = {"hit": false, "component": this.getID(), "panel": null, "resize": false};
        if (uiEditor.helpers.resizeHitTest(this.getX(), this.getY(), this.getWidth(), this.getHeight(), x, y)) {
            result.resize = true;
            console.log('resize');
        }
        else if (x >= this.getX() && x <= this.getX() + this.getWidth() &&
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
        if (this.getBackgroundImage() !== "not set") {
            this.image.src = this.getBackgroundImage();
            ctx.save();
            ctx.clip();
            ctx.drawImage(this.image, this.getX(), this.getY(), this.getWidth(), this.getHeight());
            ctx.restore();
        }
        else
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
        this.bg_color = "not set";
        this.bg_image = "not set";
        this.z_index = "not set";

        this.text = "not set";
        this.font_color = "not set";
        this.font_face = "not set";
        this.font_type = "not set";
        this.font_size = "not set";
        this.second_image = "not set";
        this.placeholder_text = "not set";
        this.rows = "not set";
        this.cols = "not set";
        this.spacing = "not set";
        this.line_style = "not set";
        this.line_width = "not set";
        this.headerText = "not set";
        this.source = "not set";

        this.firstItem = null;

        this.addedComponents = uiEditor.helpers.NONE_FLAG;
        this.buttonCount = 0;
        this.textCount = 0;
        this.imageCount = 0;
        this.panelCount = 0;
        this.displayCount = 0;
        this.screenCountrolCount = 0;
        this.sourceCount = 0;
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

    GroupSelection.prototype.getBgColor = function () {
        return this.bg_color;
    };

    GroupSelection.prototype.getBackgroundImage = function () {
        return this.bg_image;
    };

    GroupSelection.prototype.getZ_index = function () {
        return this.z_index;
    };

    GroupSelection.prototype.getFontColor = function () {
        return this.font_color;
    };

    GroupSelection.prototype.getFontFace = function () {
        return this.font_face;
    };

    GroupSelection.prototype.getFontType = function () {
        return this.font_type;
    };

    GroupSelection.prototype.getFontSize = function () {
        return this.font_size;
    };

    GroupSelection.prototype.getSecondImage = function () {
        return this.second_image;
    };

    GroupSelection.prototype.getPlaceholderText = function () {
        return this.placeholder_text;
    };

    GroupSelection.prototype.getRows = function () {
        return this.rows;
    };

    GroupSelection.prototype.getCols = function () {
        return this.cols;
    };

    GroupSelection.prototype.getSpacing = function () {
        return this.spacing;
    };

    GroupSelection.prototype.getLineStyle = function () {
        return this.line_style;
    };

    GroupSelection.prototype.getLineWidth = function () {
        return this.line_width;
    };

    GroupSelection.prototype.getHeaderText = function () {
        return this.headerText;
    };

    GroupSelection.prototype.getSource = function () {
        return this.source;
    };

    GroupSelection.prototype.getAddedComponents = function () {
        return this.addedComponents;
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

    GroupSelection.prototype.setBgColor = function (color, components) {
        if (color !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setBgColor(color);
                }
            });
            this.bg_color = color;
            return components;
        }
    };

    GroupSelection.prototype.setBackgroundImage = function (image_url, components) {
        if (image_url !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setBackgroundImage(image_url);
                }
            });
            this.bg_image = image_url;
            return components;
        }
    };

    GroupSelection.prototype.setZ_index = function (z_index, components) {
        if (z_index !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setZ_index(z_index);
                }
            });
            this.z_index = z_index;
            return components;
        }
    };

    GroupSelection.prototype.setFontColor = function (fontColor, components) {
        if (fontColor !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setFontColor(fontColor);
                }
            });
            this.font_color = fontColor;
            return components;
        }
    };

    GroupSelection.prototype.setFontFace = function (fontFace, components) {
        if (fontFace !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setFontFace(fontFace);
                }
            });
            this.font_face = fontFace;
            return components;
        }
    };

    GroupSelection.prototype.setFontType = function (fontType, components) {
        if (fontType !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setFontType(fontType);
                }
            });
            this.font_type = fontType;
            return components;
        }
    };

    GroupSelection.prototype.setFontSize = function (fontSize, components) {
        if (fontSize !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setFontSize(fontSize);
                }
            });
            this.font_size = fontSize;
            return components;
        }
    };

    GroupSelection.prototype.setSecondImage = function (secondImage, components) {
        if (secondImage !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setSecondImage(secondImage);
                }
            });
            this.second_image = secondImage;
            return components;
        }
    };

    GroupSelection.prototype.setPlaceholderText = function (text, components) {
        if (text !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setPlaceholderText(text);
                }
            });
            this.placeholder_text = text;
            return components;
        }
    };

    GroupSelection.prototype.setRows = function (rows, components) {
        if (rows !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setRows(rows);
                }
            });
            this.rows = rows;
            return components;
        }
    };

    GroupSelection.prototype.setCols = function (cols, components) {
        if (cols !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setCols(cols);
                }
            });
            this.cols = cols;
            return components;
        }
    };

    GroupSelection.prototype.setSpacing = function (spacing, components) {
        if (spacing !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setSpacing(spacing);
                }
            });
            this.spacing = spacing;
            return components;
        }
    };

    GroupSelection.prototype.setLineStyle = function (lineStyle, components) {
        if (lineStyle !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setLineStyle(lineStyle);
                }
            });
            this.line_style = lineStyle;
            return components;
        }
    };

    GroupSelection.prototype.setLineWidth = function (lineWidth, components) {
        if (lineWidth !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setLineWidth(lineWidth);
                }
            });
            this.line_width = lineWidth;
            return components;
        }
    };

    GroupSelection.prototype.setHeaderText = function (text, components) {
        if (text !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setHeaderText(text);
                }
            });
            this.headerText = text;
            return components;
        }
    };

    GroupSelection.prototype.setSource = function (source, components) {
        if (source !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setSource(source);
                }
            });
            this.source = source;
            return components;
        }
    };

    GroupSelection.prototype.setText = function (text, components) {
        if (text !== "not set") {
            this.selection.forEach(function (value, key) {
                if (components.get(value).getComponentType() !== "group") {
                    components.get(value).setText(text);
                }
            });
            this.text = text;
            return components;
        }
    };

//    GroupSelection.prototype.setVerticalOffset = function (verticalOffset) {
//
//        this.selection.forEach(function(value, key))
//    }
    /***********************************************************/

    GroupSelection.prototype.addToSelection = function (componentID, components) {
        var component = components.get(componentID);
        switch (component.getComponentType()) {
            case "button":
                this.addedComponents |= uiEditor.helpers.BUTTON_FLAG;
                this.buttonCount++;
                break;
            case "text":
                this.addedComponents |= uiEditor.helpers.TEXT_FLAG;
                this.textCount++;
                break;
            case "image":
                this.addedComponents |= uiEditor.helpers.IMAGE_FLAG;
                this.imageCount++;
                break;
            case "panel":
                this.addedComponents |= uiEditor.helpers.PANEL_FLAG;
                this.panelCount++;
                break;
            case "display":
                this.addedComponents |= uiEditor.helpers.DISPLAY_FLAG;
                this.displayCount++;
                break;
            case "screenControl":
                this.addedComponents |= uiEditor.helpers.SCREEN_CONTROL_FLAG;
                this.screenCountrolCount++;
                break;
            case "source":
                this.addedComponents |= uiEditor.helpers.SOURCE_FLAG;
                this.sourceCount++;
                break;
        }
        this.selection.set(componentID, componentID);
        components.get(componentID).select();
        if (this.firstItem === null) {
            this.firstItem = component;
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
        var component = components.get(componentID);

        switch (component.getComponentType()) {
            case "button":
                this.buttonCount--;
                if (this.buttonCount === 0)
                    this.addedComponents &= ~uiEditor.helpers.BUTTON_FLAG;
                break;
            case "text":
                this.textCount--;
                if (this.textCount === 0)
                    this.addedComponents &= ~uiEditor.helpers.TEXT_FLAG;
                break;
            case "image":
                this.imageCount--;
                if (this.imageCount === 0)
                    this.addedComponents &= ~uiEditor.helpers.IMAGE_FLAG;
                break;
            case "panel":
                this.panelCount--;
                if (this.panelCount === 0)
                    this.addedComponents &= ~uiEditor.helpers.PANEL_FLAG;
                break;
            case "display":
                this.displayCount--;
                if (this.displayCount === 0)
                    this.addedComponents &= ~uiEditor.helpers.DISPLAY_FLAG;
                break;
            case "screenControl":
                this.screenCountrolCount--;
                if (this.screenCountrolCount === 0)
                    this.addedComponents &= ~uiEditor.helpers.SCREEN_CONTROL_FLAG;
                break;
            case "source":
                this.sourceCount--;
                if (this.sourceCount === 0)
                    this.addedComponents &= ~uiEditor.helpers.SOURCE_FLAG;
                break;
        }

        this.selection.delete(componentID);
        component.deselect();
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
            case "bg_color":
                this.setBgColor(propertyValue, components);
                break;
            case "bg_image":
                this.setBackgroundImage(propertyValue, components);
                break;
            case "z_index":
                propertyValue = Number(propertyValue);
                this.setZ_index(propertyValue, components);
                break;
            case "text":
                this.setText(propertyValue, components);
                break;
            case "font_color":
                this.setFontColor(propertyValue, components);
                break;
            case "font_face":
                this.setFontFace(propertyValue, components);
                break;
            case "font_type":
                this.setFontType(propertyValue, components);
                break;
            case "font_size":
                this.setFontSize(propertyValue, components);
                break;
            case "second_image":
                this.setSecondImage(propertyValue, components);
                break;
            case "placeholder_text":
                this.setPlaceholderText(propertyValue, components);
                break;
            case "rows":
                propertyValue = Number(propertyValue);
                this.setRows(propertyValue, components);
                break;
            case "cols":
                propertyValue = Number(propertyValue);
                this.setCols(propertyValue, components);
                break;
            case "spacing":
                propertyValue = Number(propertyValue);
                this.setSpacing(propertyValue, components);
                break;
            case "line_style":
                this.setLineStyle(propertyValue, components);
                break;
            case "line_width":
                propertyValue = Number(propertyValue);
                this.setLineWidth(propertyValue, components);
                break;
            case "headerText":
                this.setHeaderText(propertyValue, components);
                break;
            case "source":
                this.setSource(propertyValue, components);
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
                                items.button[i].height,
                                items.button[i].z_index,
                                items.button[i].bg_color,
                                items.button[i].bg_image,
                                items.button[i].second_image,
                                items.button[i].font_color,
                                items.button[i].font_face,
                                items.button[i].font_type,
                                items.button[i].font_size));
            }

            for (var i = 0; i < items.text.length; i++) {
                this.properties['components'].set(items.text[i].id,
                        new uiEditor.components.TextComponent(items.text[i].id,
                                items.text[i].xPosition,
                                items.text[i].yPosition,
                                items.text[i].width,
                                items.text[i].height,
                                items.text[i].z_index,
                                items.text[i].placeholder_text,
                                items.text[i].font_color,
                                items.text[i].font_face,
                                items.text[i].font_type,
                                items.text[i].font_size,
                                items.text[i].bg_image,
                                items.text[i].bg_color));
            }

            for (var i = 0; i < items.image.length; i++) {
                this.properties['components'].set(items.image[i].id,
                        new uiEditor.components.ImageComponent(items.image[i].id,
                                items.image[i].xPosition,
                                items.image[i].yPosition,
                                items.image[i].width,
                                items.image[i].height,
                                items.image[i].bg_image,
                                items.image[i].z_index));
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
                                items.panel[i].children,
                                items.panel[i].bg_image,
                                items.panel[i].bg_color,
                                items.panel[i].z_index));
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



