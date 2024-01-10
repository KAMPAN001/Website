//TASKA
//sprawdzic wszytkie funkje



/**
 * Function download language from site "l"
 * @returns {string} Website language
 */
function getLanguage() {
    const queryString = new URLSearchParams(window.location.search);
    var language = queryString.get('l');
    if (language == '' || language == null) {
        language = 'pl';
    }
    return language;
}

/**
  * The function draws the axes of the coordinate system
  * @param {string} labelY Label for the Y axis
  * @param {string} labelX Label for the X axis
  * @param {float} width Length of the X axis
  * @param {float} height The height of the Y axis
  * @param {float} minValueX Minimum values on the X axis
  * @param {float} minValueY Minimum values on the Y axis
  * @param {float} maxValueX Maximum values on the X axis
  * @param {float} maxValueY Maximum values on the Y axis
  * @param {RenderingContext} context The rendering context
  * @param {string} color The color of the axis
  * @param {float} lineWidth The line thickness of the axis
  * @param {array} lineDash Line pattern
  * @param {string} labelXSubText Subscript of the X-axis label
  * @param {string} labelYSubText Subscript of the Y axis label
  * @returns {array} The function returns the zero point (X: 0; Y: 0) of the coordinate system
  */
function drawAxes(labelY, labelX, width, height, minValueX, minValueY, maxValueX, maxValueY, context, color, lineWidth, lineDash, labelXSubText, labelYSubText) {
    if (labelXSubText == undefined) {
        labelXSubText = "";
    }
    if (labelYSubText == undefined) {
        labelYSubText = "";
    }
    //#region Set shift of coordinate system origin 
    var originX, originY;
    if (minValueX * maxValueX > 0) {
        if (minValueX > 0 && minValueX < maxValueX)
            originX = minValueX;
        else if (maxValueX < 0 && maxValueX > minValueX)
            originX = maxValueX;
    }
    else
        originX = 0;

    if (minValueY * maxValueY > 0) {
        if (minValueY > 0 && minValueY < maxValueY)
            originY = minValueY;
        else if (maxValueY < 0 && maxValueY > minValueY)
            originY = maxValueY;
    }
    else
        originY = 0;
    //#endregion

    //#region declare axes
    var positionY = height * (Math.abs(minValueY - originY) / (maxValueY - minValueY));
    var axisX = [
        { x: 70, y: height - positionY + 50 },
        { x: width + 100, y: height - positionY + 50 }
    ];
    var positionX = Math.abs(minValueX - originX) * (width / (maxValueX - minValueX));
    var axisY = [
        { x: positionX + 80, y: 30 },
        { x: positionX + 80, y: height + 60 }
    ];
    //#endregion 

    //#region draw axes
    context.lineWidth = lineWidth;
    context.setLineDash(lineDash);
    context.strokeStyle = color;
    context.beginPath();
    for (var i = 0; i < axisX.length; i++) {
        if (i === 0)
            context.moveTo(axisX[i].x, axisX[i].y);
        else
            context.lineTo(axisX[i].x, axisX[i].y);
    }
    context.lineWidth = 2;
    for (var i = 0; i < axisY.length; i++) {
        if (i === 0)
            context.moveTo(axisY[i].x, axisY[i].y + 2);
        else
            context.lineTo(axisY[i].x, axisY[i].y);
    }
    context.stroke();
    //#endregion

    //#region draw arrows
    context.fillStyle = color;
    // on X axis
    context.moveTo(axisX[1].x + 5, axisX[1].y);
    context.lineTo(axisX[1].x - 10, axisX[1].y - 5);
    context.lineTo(axisX[1].x - 10, axisX[1].y + 5);

    // on Y axis
    context.moveTo(axisY[0].x, axisY[0].y);
    context.lineTo(axisY[0].x - 5, axisY[0].y + 10);
    context.lineTo(axisY[0].x + 5, axisY[0].y + 10);
    context.fill();
    //#endregion
    context.closePath();

    //#region draw labels
    drawText(labelY, 18, TextAlign.Left, TextBaseLine.Bottom, false, true, axisY[1].x - 10, axisY[0].y - 5, context, labelXSubText);
    drawText(labelX, 18, TextAlign.Center, TextBaseLine.Bottom, false, true, axisX[1].x + 15, axisX[0].y + 5, context, labelYSubText);
    //#endregion

    var ZeroPoint = [
        { x: axisY[0].x, y: axisX[0].y },
        { oX: originX, oY: originY }
    ];
    return ZeroPoint;
}

/**
  * The function reverses the values to draw the chart correctly
  * @param {float} position The Y coordinate of the X axis
  * @param {float} value The value to flip
  */
function invertYAxis(position, value) {
    return position - value;
}

/**
  *
  * @param {array} zero X-coordinates: 0; Y: 0 of the coordinate system
  * @param {float} width Length of the chart
  * @param {float} height The height of the chart
  * @param {float} gridHorizontalSpace
  * @param {float} gridVerticalSpace
  * @param {float} graduationHorizontalSpace
  * @param {float} graduationVerticalSpace
  * @param {float} minValueX Minimum values on the X axis
  * @param {float} minValueY Maximum values on the X axis
  * @param {float} maxValueX Minimum values on the Y axis
  * @param {float} maxValueY Maximum values on the Y axis
  * @param {RenderingContext} context The rendering context
  * @param {string} color The color of the chart grid
  * @param {float} lineWidth Thickness of the chart grid
  * @param {array} lineStyle The chart grid line pattern
  * @param {integer} precisionX Number of decimal places to display values on the X axis
  * @param {integer} precisionY Number of decimal places to display values on the Y axis
  */
function drawGrid(zero, width, height, gridHorizontalSpace, gridVerticalSpace, graduationHorizontalSpace, graduationVerticalSpace, minValueX, maxValueX, minValueY, maxValueY, context, color, lineWidth, lineStyle, precissionX, precissionY) {

    if (precissionX == undefined) {
        precissionX = 0;
    }
    if (precissionY == undefined) {
        precissionY = 0;
    }
    context.lineWidth = lineWidth;
    context.beginPath();
    context.strokeStyle = color;
    context.setLineDash(lineStyle);
    context.font = '16px Arial';
    var verticalInterval = height / ((maxValueY - minValueY) / gridVerticalSpace);
    var horizontalInterval = width / ((maxValueX - minValueX) / gridHorizontalSpace);

    var drawMinusY = false, drawPlusY = false;
    if (minValueY * maxValueY < 0) {
        drawMinusY = drawPlusY = true;
    }
    else if (minValueY + maxValueY > 0) {
        drawPlusY = true;
        drawMinusY = false;
    }
    else {
        drawPlusY = false;
        drawMinusY = true;
    }

    var drawMinusX = false, drawPlusX = false;
    if (minValueX * maxValueX < 0) {
        drawMinusX = drawPlusX = true;
    }
    else if (minValueX + maxValueX > 0) {
        drawPlusX = true;
        drawMinusX = false;
    }
    else {
        drawPlusX = false;
        drawMinusX = true;
    }

    //#region Y-axis - Positive values
    for (var i = zero[0].y, j = zero[1].oY; i >= 50 && drawPlusY; i -= verticalInterval, j += gridVerticalSpace) {
        context.moveTo(70, i);
        context.lineTo(width + 80, i);

        if (i == zero[0].y) {
            if (!drawMinusX && !drawMinusY) {
                drawText(j.toFixed(precissionY), 12, TextAlign.Right, TextBaseLine.Middle, false, false, zero[0].x - 10, i + 5, context);
            }
        }
        else {
            drawText(j.toFixed(precissionY), 12, TextAlign.Right, TextBaseLine.Middle, false, false, zero[0].x - 10, i + 5, context);
        }
    }
    //#endregion
    //#region Y-axis - Negative values   
    for (var i = zero[0].y, j = zero[1].oY; i <= height + 50 && drawMinusY; i += verticalInterval, j -= gridVerticalSpace) {
        context.moveTo(70, i);
        context.lineTo(width + 80, i);
        if (i == zero[0].y) {
            if (!drawMinusX) {
                drawText(j.toFixed(precissionY), 12, TextAlign.Right, TextBaseLine.Top, false, false, zero[0].x - 10, i + 5, context);
            }
        }
        else {
            drawText(j.toFixed(precissionY), 12, TextAlign.Right, TextBaseLine.Top, false, false, zero[0].x - 10, i + 5, context);
        }
    }
    //#region X-axis - Positive values
    for (var i = zero[0].x, j = zero[1].oX; i <= width + 80 && drawPlusX; i += horizontalInterval, j += gridHorizontalSpace) {
        context.moveTo(i, 50);
        context.lineTo(i, height + 50);
        if (i == zero[0].x) {
            if (!drawMinusY && !drawMinusX) {
                drawText(j.toFixed(precissionX), 12, TextAlign.Center, TextBaseLine.Top, false, false, i, zero[0].y + 20, context);
            }
        }
        else {
            drawText(j.toFixed(precissionX), 12, TextAlign.Center, TextBaseLine.Top, false, false, i, zero[0].y + 20, context);
        }
    }
    //#endregion

    //#region X-axis - Negative values
    for (var i = zero[0].x, j = zero[1].oX; i >= 80 && drawMinusX; i -= horizontalInterval, j -= gridHorizontalSpace) {
        context.moveTo(i, 50);
        context.lineTo(i, height + 50);
        if (i == zero[0].x) {
            if (!drawMinusY) {
                drawText(j.toFixed(precissionX), 12, TextAlign.Center, TextBaseLine.Middle, false, false, i, zero[0].y + 20, context);
            }
        }
        else {
            drawText(j.toFixed(precissionX), 12, TextAlign.Center, TextBaseLine.Middle, false, false, i, zero[0].y + 20, context);
        }
    }
    //#endregion


    context.stroke();
    context.closePath();

    context.lineWidth = 0.4;
    context.beginPath();
    context.strokeStyle = Color.Black;
    context.setLineDash(lineStyle);
    var graduationVerticalInterval = height / ((maxValueY - minValueY) / graduationVerticalSpace);
    var graduationHorizontalInterval = width / ((maxValueX - minValueX) / graduationHorizontalSpace);

    for (var i = zero[0].y; i >= 50; i -= graduationVerticalInterval) {
        context.moveTo(zero[0].x - 5, i);
        context.lineTo(zero[0].x + 5, i);
    }

    for (var i = zero[0].y; i <= height + 50; i += graduationVerticalInterval) {
        context.moveTo(zero[0].x - 5, i);
        context.lineTo(zero[0].x + 5, i);
    }

    //#region X-axis - Positive values
    for (var i = zero[0].x; i <= width + 80; i += graduationHorizontalInterval) {
        context.moveTo(i, zero[0].y - 5);
        context.lineTo(i, zero[0].y + 5);
    }
    //#endregion

    //#region X-axis - Negative values
    for (var i = zero[0].x; i >= 80; i -= graduationHorizontalInterval) {
        context.moveTo(i, zero[0].y - 5);
        context.lineTo(i, zero[0].y + 5);
    }
    //#endregion
    context.stroke();
    context.closePath();
}

/**
  *
  * @param {*} labelText The label for the slider
  * @param {*} valueSliderId Optional ID attribute
  * @param {*} minValue The minimum value of the slider
  * @param {*} maxValue Maximum value of the slider
  * @param {*} step Step of the slider
  * @param {*} width The width of the slider
  * @param {*} labelSubText Subscript of the slider label
  * @param {*} defaultValue Default slider value = min (Parameter value: true)
  * @param {*} precision Precision for displaying the slider value
  */
function addInput(labelText, valueSliderId, minValue, maxValue, step, width, labelSubText, defaultValue, precision) {
    if (width == undefined) width = "";
    if (labelSubText == undefined) labelSubText = "";
    if (defaultValue == undefined) defaultValue = minValue;
    if (precision == undefined) precision = 2;
    var tableRow = document.createElement('tr');
    var tableRow2 = document.createElement('tr');
    var tableRow3 = document.createElement('tr');
    var tableCell = document.createElement('td');
    var tableCell2 = document.createElement('td');
    var tableCell3 = document.createElement('td');
    var tableCell4 = document.createElement('td');
    var tableCell5 = document.createElement('td');
    var label = document.createElement('span');
    var min = document.createElement('span');
    var max = document.createElement('span');
    var currentValue = document.createElement('span');
    var valueSlider = document.createElement('input');

    tableCell.colSpan = 3;

    label.style.fontSize = "26px";

    valueSlider.type = "range";
    valueSlider.id = valueSliderId;
    valueSlider.min = minValue;
    valueSlider.max = maxValue;
    valueSlider.step = step;

    valueSlider.value = defaultValue.toFixed(precision);
    currentValue.textContent = defaultValue.toFixed(precision);

    valueSlider.style.width = width + "px";

    min.textContent = minValue.toFixed(precision);
    tableCell3.appendChild(min);
    max.textContent = maxValue.toFixed(precision);
    tableCell4.appendChild(max);

    tableCell5.colSpan = 3;
    tableCell5.appendChild(currentValue);

    tableCell.appendChild(label);
    label.textContent = labelText;
    if (labelSubText != "") {
        var labelSub = document.createElement('sub');
        labelSub.style.fontSize = "26px";
        labelSub.textContent = labelSubText;
        tableCell.appendChild(labelSub);
    }
    tableRow.appendChild(tableCell);
    tableCell2.appendChild(valueSlider);
    tableRow2.appendChild(tableCell3);
    tableRow2.appendChild(tableCell2);
    tableRow2.appendChild(tableCell4);
    tableRow3.appendChild(tableCell5);

    return {
        tableRow: tableRow,
        tableRow2: tableRow2,
        tableRow3: tableRow3
    };
}

/**
  *
  * @param {*} labelText The label for the slider
  * @param {*} valueSliderId Optional ID attribute
  * @param {*} minValue The minimum value of the slider
  * @param {*} maxValue Maximum value of the slider
  * @param {*} step Step of the slider
  * @param {*} width The width of the slider
  * @param {*} labelSubText Subscript of the slider label
  * @param {*} defaultValue Default slider value = min (Parameter value: true)
  * @param {*} precision Precision for displaying the slider value
  */


/**
  *
  * @param {*} labelText The checkbox label
  * @param {*} checkBoxId Optional ID parameter
  * @param {*} checked Whether checked by default
  * @param {*} labelSubText Subscript of the checkbox label
  */
function addCheckBox(labelText, checkBoxId, checked, labelSubText) {
    if (labelSubText == undefined) {
        labelSubText = "";
    }
    var tableRow = document.createElement('tr');
    var tableCell = document.createElement('td');
    var tableCell2 = document.createElement('td');
    var label = document.createElement('span');
    var checkBox = document.createElement('input');
    tableCell.style.width = "auto";
    tableCell2.style.width = "auto";
    tableCell2.style.textAlign = "left";
    tableCell2.colSpan = 2;
    label.style.fontSize = "16px";

    checkBox.type = "checkbox";
    checkBox.id = checkBoxId;
    checkBox.checked = checked;

    tableCell.appendChild(label);
    label.textContent = labelText;
    if (labelSubText != "") {
        var labelSub = document.createElement('sub');
        labelSub.style.fontSize = "16px";
        labelSub.textContent = labelSubText;
        tableCell.appendChild(labelSub);
    }
    tableRow.appendChild(tableCell);
    tableCell2.appendChild(checkBox);
    tableRow.appendChild(tableCell2);

    return {
        tableRow: tableRow
    };
}

/**
 * 
 * @param {*} divName Opcjonalny parametr class
 */
function createDiv(divName) {
    if (divName == undefined) divName = "";
    var div = document.createElement("div");
    div.style.display = "block";
    div.style.height = "auto";
    div.style.width = "auto";
    div.className = divName;
    return div;
}

/**
  *
  * @param {*} canvasId Optional ID parameter
  * @param {*} width Optional canvas width
  * @param {*} height Optional canvas height
  * @param {*} underPreviousCanvas Optional parameter whether the second canvas should be below the first one
  */
function createCanvas(canvasId, width, height, underPreviousCanvas) {
    if (canvasId == undefined) canvasId = "";
    if (width == undefined) width = 600;
    if (height == undefined) height = 600;
    if (underPreviousCanvas == undefined) underPreviousCanvas = false;
    var canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;
    canvas.id = canvasId;
    if (underPreviousCanvas) canvas.style.display = "block";
    return canvas;
}

/**
  *
  * @param {*} startPositionX The initial value of X
  * @param {*} startPositionY The initial Y value
  * @param {*} endPositionX The final X value
  * @param {*} endPositionY The final Y value
  * @param {*} color The color of the line
  * @param {*} lineWidth The width of the line
  * @param {*} lineStyle Line pattern
  * @param {*} context The rendering context
  */
function drawLine(startPositionX, startPositionY, endPositionX, endPositionY, color, lineWidth, lineStyle, context) {
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.setLineDash(lineStyle);
    context.moveTo(startPositionX, startPositionY);
    context.lineTo(endPositionX, endPositionY);
    context.stroke();
    context.closePath();
}

/**
  *
  * @param {*} text Text
  * @param {*} fontSize The font size
  * @param {*} align Horizontal alignment of the text
  * @param {*} baseLine Vertical alignment of the text
  * @param {*} bold The font is bold
  * @param {*} italic Italic font
  * @param {*} positionX The X position of the text
  * @param {*} positionY The Y position of the text
  * @param {*} context The rendering context
  * @param {*} subText Subscript texts
  * @param {*} textAfterSub Text after subscript
  * @param {*} color The color of the text
  */
function drawText(text, fontSize, align, baseLine, bold, italic, positionX, positionY, context, subText, textAfterSub, color) {
    if (subText == undefined) {
        subText = "";
    }
    if (textAfterSub == undefined) {
        textAfterSub = "";
    }
    if (color == undefined) {
        color = "#000000";
    }
    context.textAlign = align;
    context.textBaseLine = baseLine;
    context.fillStyle = color;
    context.font = (bold ? "bold " : "") + (italic ? "italic " : "") + fontSize + "pt Times New Roman";
    context.fillText(text, positionX, positionY);
    if (subText != "") {
        var textSize = context.measureText(text);
        context.font = (bold ? "bold " : "") + (italic ? "italic " : "") + (fontSize - 4) + "pt Times New Roman";
        context.fillText(subText, positionX + textSize.width, positionY + 2);

        if (textAfterSub != "") {
            textSize = context.measureText(text + subText + 50);
            context.textAlign = "center";
            context.font = (bold ? "bold " : "") + (italic ? "italic " : "") + (fontSize) + "pt Times New Roman";
            context.fillText(textAfterSub, positionX + textSize.width, positionY);
        }
    }
}

/**
  *
  * @param {*} positionX The X position of the point
  * @param {*} positionY The Y position of the point
  * @param {*} context The rendering context
  * @param {*} color The color of the point
  * @param {*} size Optional point size
  */
function drawPoint(positionX, positionY, context, color, size) {
    if (size == undefined) {
        size = 3;
    }
    context.beginPath();
    context.fillStyle = color;
    context.strokeStyle = color;
    context.arc(positionX, positionY, size, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
}

/**
  *
  * @param {*} positionX Position X of the circle
  * @param {*} positionY The Y position of the circle
  * @param {*} context The rendering context
  * @param {*} color The color of the circle
  * @param {*} lineWidth Line pattern
  * @param {*} size Optional size of the circle
  */
function drawCircle(positionX, positionY, context, color, lineWidth, size) {
    if (size == undefined) {
        size = 20;
    }
    context.beginPath();
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.setLineDash(LineStyle.Solid);
    context.arc(positionX, positionY, size, 0, 2 * Math.PI);
    context.stroke();
    context.closePath();
}

/**
  *
  * @param {*} values An array of values
  * @param {*} width Length of the X axis
  * @param {*} height The height of the Y axis
  * @param {*} minValueX Minimum values on the X axis
  * @param {*} minValueY The minimum value on the Y axis
  * @param {*} maxValueX Maximum values on the X axis
  * @param {*} maxValueY Maximum values on the Y axis
  * @param {*} zero The zero point of the coordinate system
  * @param {*} color The color of the intersection point
  * @param {*} context The rendering context
  * @param {*} textY Text of the y-intercept
  * @param {*} subTextY Subscript of the Y-intercept text
  * @param {*} textX Text of the x-intercept
  * @param {*} subTextX Subscript of the x-intercept text
  */
function drawZeroPoints(values, width, height, minValueX, minValueY, maxValueX, maxValueY, zero, color, context, textY, subTextY, textX, subTextX) {
    if (textY == undefined) {
        textY = "";
    }
    if (subTextY == undefined) {
        subTextY = "";
    }
    if (textX == undefined) {
        textX = "";
    }
    if (subTextX == undefined) {
        subTextX = "";
    }
    var minY = [
        { x: 9999, y: 999999 }
    ];
    var minX = [
        { x: 9999, y: 999999 }
    ];
    var isZeroPoint = false;
    var isIntersectionWithYAxis = false;
    values.forEach(function (r, i) {
        if (r.y - zero[1].oY < 1) {
            isZeroPoint = true;
        }
        if (r.x - zero[1].oX < 1) {
            isIntersectionWithYAxis = true;
        }
        if (Math.abs(minX[0].x) > Math.abs(r.x - zero[1].oX)) {
            minX[0].x = r.x - zero[1].oX;
            minX[0].y = zero[0].y + ((r.y - zero[1].oY) / (maxValueY - minValueY) * height);
        }
        if (Math.abs(minY[0].y) > Math.abs(r.y - zero[1].oY)) {
            minY[0].x = zero[0].x + ((r.x - zero[1].oX) / (maxValueX - minValueX) * width);
            minY[0].y = r.y - zero[1].oY;
        }
    });
    if (isZeroPoint) {
        if (textX != "") {
            drawText(textX, 14, TextAlign.Center, TextBaseLine.Middle, false, true, minY[0].x, zero[0].y - zero[1].oY - 20, context, subTextX)
        }
        drawPoint(minY[0].x, zero[0].y, context, color);
    }
    if (isIntersectionWithYAxis && invertYAxis(zero[0].y, minX[0].y - zero[0].y) > 45) {
        if (textY != "") {
            drawText(textY, 14, TextAlign.Center, TextBaseLine.Middle, false, true, zero[0].x - zero[1].oX + 20, invertYAxis(zero[0].y, minX[0].y - zero[0].y + 10), context, subTextY)
        }
        drawPoint(zero[0].x, invertYAxis(zero[0].y, minX[0].y - zero[0].y), context, color);
    }
}

/**
  *
  * @param {*} values An array of chart 1 values
  * @param {*} values2 An array of chart values 2
  * @param {*} width Length of the X axis
  * @param {*} height The height of the Y axis
  * @param {*} minValueX Minimum values on the X axis
  * @param {*} minValueY The minimum value on the Y axis
  * @param {*} maxValueX Maximum values on the X axis
  * @param {*} maxValueY Maximum values on the Y axis
  * @param {*} zero The zero point of the coordinate system
  * @param {*} color The color of the intersection point
  * @param {*} context The rendering context
  * @param {*} size The size of the intersection point
  * @param {*} drawLines Whether to draw guide lines
  * @param {*} text Text at the intersection point
  * @param {*} subText Subscript of the text at the intersection point
  * @param {*} text2 The second text at the intersection point
  * @param {*} subText2 Subscript of the second text at the intersection point
  * @param {*} textOnY Whether to draw text on the Y axis
  * @param {*} textOnX Whether to draw text on the X axis
  */
function drawCrossPoint(values, values2, width, height, minValueX, minValueY, maxValueX, maxValueY, zero, color, context, size, drawLines, text, subText, text2, subText2, textOnY, textOnX) {
    if (text == undefined) {
        text = "";
    }
    if (subText == undefined) {
        subText = "";
    }
    if (text2 == undefined) {
        text2 = "";
    }
    if (subText2 == undefined) {
        subText2 = "";
    }
    if (textOnX == undefined) {
        textOnX = false;
    }
    if (textOnY == undefined) {
        textOnY = false;
    }
    if (drawLines == undefined) {
        drawLines = false;
    }
    if (size == undefined) {
        size = 3;
    }
    var crosses = [];
    var cross = [
        { x: 0, y: 0 }
    ];
    var tmp, tmpMin = 9999999;
    var isCrossPoint = false;
    values.forEach(function (r, i) {
        tmp = Math.abs(r.y - values2[i].y);
        if (tmp < 0.02) {
            if (tmp < tmpMin) {
                tmpMin = tmp;
                isCrossPoint = true;
                cross[0].x = zero[0].x + ((r.x - zero[1].oX) / (maxValueX - minValueX) * width);
                cross[0].y = invertYAxis(zero[0].y, (r.y - zero[1].oY) / (maxValueY - minValueY) * height);
            }
        }
        else {
            if (isCrossPoint) {
                crosses.push({ x: cross[0].x, y: cross[0].y });
                tmpMin = 9999999;
                isCrossPoint = false;
            }
        }
    });

    crosses.forEach(function (r, i) {
        drawPoint(crosses[i].x, crosses[i].y, context, color, size);
        if (drawLines) {
            drawLine(zero[0].x, crosses[i].y, crosses[i].x, crosses[i].y, Color.Black, 1, LineStyle.SmallDashed, context);
            drawLine(crosses[i].x, crosses[i].y, crosses[i].x, zero[0].y, Color.Black, 1, LineStyle.SmallDashed, context);
        }
        if (i == 0) {
            if (text != "") {
                var posX, posY;
                if (textOnX) {
                    posX = crosses[i].x + 10;
                    posY = zero[0].y - 10;
                }
                else if (textOnY) {
                    posX = zero[0].x + 10;
                    posY = crosses[i].y - 10;
                }
                else {
                    posX = crosses[i].x + 10;
                    posY = crosses[i].y - 10
                }
                drawText(text, 14, TextAlign.Center, TextBaseLine.Middle, false, true, posX, posY, context, subText);
            }
        }
        else {
            if (text != "") {
                var posX, posY;
                if (textOnX) {
                    posX = crosses[i].x + 10;
                    posY = zero[0].y - 10;
                }
                else if (textOnY) {
                    posX = zero[0].x + 10;
                    posY = crosses[i].y - 10;
                }
                else {
                    posX = crosses[i].x + 10;
                    posY = crosses[i].y - 10
                }
                drawText(text2, 14, TextAlign.Center, TextBaseLine.Middle, false, true, posX, posY, context, subText2);
            }
        }
    });
}

/**
  *
  * @param {*} values An array of chart 1 values
  * @param {*} values2 An array of chart values 2
  * @param {*} width Length of the X axis
  * @param {*} height The height of the Y axis
  * @param {*} minValueX Minimum values on the X axis
  * @param {*} minValueY The minimum value on the Y axis
  * @param {*} maxValueX Maximum values on the X axis
  * @param {*} maxValueY Maximum values on the Y axis
  * @param {*} zero The zero point of the coordinate system
  * @param {*} color The color of the intersection point
  * @param {*} context The rendering context
  * @param {*} size The size of the intersection point
  * @param {*} drawLines Whether to draw guide lines
  * @param {*} text Text at the intersection point
  * @param {*} subText Subscript of the text at the intersection point
  * @param {*} text2 The second text at the intersection point
  * @param {*} subText2 Subscript of the second text at the intersection point
  * @param {*} textOnY Whether to draw text on the Y axis
  * @param {*} textOnX Whether to draw text on the X axis
  */
function drawCrossPoint2(values, values2, width, height, minValueX, minValueY, maxValueX, maxValueY, zero, color, context, size, drawLines, text, subText, text2, subText2, textOnY, textOnX) {
    if (text == undefined) {
        text = "";
    }
    if (subText == undefined) {
        subText = "";
    }
    if (text2 == undefined) {
        text2 = "";
    }
    if (subText2 == undefined) {
        subText2 = "";
    }
    if (textOnX == undefined) {
        textOnX = false;
    }
    if (textOnY == undefined) {
        textOnY = false;
    }
    if (size == undefined) {
        size = 3;
    }
    if (drawLines == undefined) {
        drawLines = false;
    }
    var crosses = [];
    var cross = [
        { x: 0, y: 0 },
        { x: 0, y: 0 }
    ];
    var tmp, tmpMin = 9999999;
    var isCrossPoint = false;
    values.forEach(function (r, i) {
        tmp = Math.abs(r.y - values2[i].y);
        if (tmp < 0.02) {
            if (tmp < tmpMin) {
                tmpMin = tmp;
                isCrossPoint = true;
                cross[0].x = zero[0].x + ((r.x - zero[1].oX) / (maxValueX - minValueX) * width);
                cross[0].y = invertYAxis(zero[0].y, (r.y - zero[1].oY) / (maxValueY - minValueY) * height);
                cross[1].x = r.x;
                cross[1].y = r.y;
            }
        }
        else {
            if (isCrossPoint) {
                crosses.push({ x: cross[0].x, y: cross[0].y, x2: cross[1].x });
                tmpMin = 9999999;
                isCrossPoint = false;
            }
        }
    });

    crosses.forEach(function (r, i) {
        drawPoint(crosses[i].x, crosses[i].y, context, color, size);
        if (drawLines) {
            drawLine(zero[0].x, crosses[i].y, crosses[i].x, crosses[i].y, Color.Black, 1, LineStyle.SmallDashed, context);
            drawLine(crosses[i].x, crosses[i].y, crosses[i].x, zero[0].y, Color.Black, 1, LineStyle.SmallDashed, context);
        }
        if (r.x2 < 0.85) {
            if (text != "") {
                var posX, posY;
                if (textOnX) {
                    posX = r.x + 10;
                    posY = zero[0].y - 10;
                }
                else if (textOnY) {
                    posX = zero[0].x + 10;
                    posY = r.y - 10;
                }
                else {
                    posX = r.x + 10;
                    posY = r.y - 10
                }
                drawText(text, 10, TextAlign.Center, TextBaseLine.Middle, false, true, posX + 20, posY + 35, context);
                drawText(subText, 10, TextAlign.Center, TextBaseLine.Middle, false, true, posX + 20, posY + 50, context);
            }
        }
        else {
            if (text2 != "") {
                var posX, posY;
                if (textOnX) {
                    posX = r.x + 10;
                    posY = zero[0].y - 10;
                }
                else if (textOnY) {
                    posX = zero[0].x + 10;
                    posY = r.y - 10;
                }
                else {
                    posX = r.x + 10;
                    posY = r.y - 10
                }
                drawText(text2, 10, TextAlign.Center, TextBaseLine.Middle, false, true, posX - 55, posY + 40, context);
                drawText(subText2, 10, TextAlign.Center, TextBaseLine.Middle, false, true, posX - 55, posY + 55, context);
            }
        }
    });
}


/**
  *
  * @param {*} values An array of chart 1 values
  * @param {*} zero The zero point of the coordinate system
  * @param {*} minValueX Minimum values on the X axis
  * @param {*} maxValueX Maximum values on the X axis
  * @param {*} minValueY The minimum value on the Y axis
  * @param {*} maxValueY Maximum values on the Y axis
  * @param {*} width Length of the X axis
  * @param {*} height The height of the Y axis
  * @param {*} lineWidth Line thickness
  * @param {*} lineStyle Line pattern
  * @param {*} color The color of the line
  * @param {*} context The rendering context
  */
function plot(values, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, lineWidth, lineStyle, color, context) {
    context.lineWidth = lineWidth;
    context.beginPath();
    context.setLineDash(lineStyle);
    context.strokeStyle = color;
    values.forEach(function (r, i) {
        if (r.x < width) {
            context.lineTo(zero[0].x + ((r.x - zero[1].oX) / (maxValueX - minValueX) * width), invertYAxis(zero[0].y, ((r.y - zero[1].oY) / (maxValueY - minValueY) * height)));
            context.moveTo(zero[0].x + ((r.x - zero[1].oX) / (maxValueX - minValueX) * width), invertYAxis(zero[0].y, ((r.y - zero[1].oY) / (maxValueY - minValueY) * height)));
        }
    });
    context.stroke();
    context.closePath();
}

/**
  *
  * @param {*} values An array of chart 1 values
  * @param {*} zero The zero point of the coordinate system
  * @param {*} minValueX Minimum values on the X axis
  * @param {*} maxValueX Maximum values on the X axis
  * @param {*} minValueY The minimum value on the Y axis
  * @param {*} maxValueY Maximum values on the Y axis
  * @param {*} width Length of the X axis
  * @param {*} height The height of the Y axis
  * @param {*} lineWidth Line thickness
  * @param {*} lineStyle Line pattern
  * @param {*} color The color of the line
  * @param {*} context The rendering context
  */
function drawArrow(startPositionX, endPositionX, startPositionY, endPositionY, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, lineWidth, lineStyle, color, context) {
    var arrowSize = 20;
    var sX = (startPositionX == zero[0].x) ? zero[0].x : zero[0].x + ((startPositionX - zero[1].oX) / (maxValueX - minValueX) * width);
    var eX = (endPositionX == zero[0].x) ? zero[0].x : zero[0].x + ((endPositionX - zero[1].oX) / (maxValueX - minValueX) * width);
    var sY = (startPositionY == zero[0].y) ? zero[0].y : invertYAxis(zero[0].y, ((startPositionY - zero[1].oY) / (maxValueY - minValueY) * height));
    var eY = (endPositionY == zero[0].y) ? zero[0].y : invertYAxis(zero[0].y, ((endPositionY - zero[1].oY) / (maxValueY - minValueY) * height));

    var angle = Math.atan2(eY - sY, eX - sX);

    drawLine(sX, sY, eX, eY, color, lineWidth, lineStyle, context);

    context.beginPath();
    context.moveTo(eX, eY);

    context.lineTo(eX - arrowSize * Math.cos(angle - Math.PI / 7), eY - arrowSize * Math.sin(angle - Math.PI / 7));
    context.lineTo(eX - arrowSize * Math.cos(angle + Math.PI / 7), eY - arrowSize * Math.sin(angle + Math.PI / 7));
    context.lineTo(eX, eY);
    context.lineTo(eX - arrowSize * Math.cos(angle - Math.PI / 7), eY - arrowSize * Math.sin(angle - Math.PI / 7));
    context.strokeStyle = color;
    context.lineWidth = 5;
    context.fillStyle = color;
    context.fill();
}

/**
  *
  * @param {*} startPositionX The starting X position
  * @param {*} endPositionX The final X position
  * @param {*} startPositionY The starting Y position
  * @param {*} endPositionY The final X position
  * @param {*} lineWidth Line thickness
  * @param {*} lineStyle Line pattern
  * @param {*} color The color of the line
  * @param {*} context The rendering context
  * @param {*} text Text at the arrowhead
  * @param {*} subText Subscript of the text at the arrowhead
  */
function drawArrow2(startPositionX, endPositionX, startPositionY, endPositionY, lineWidth, lineStyle, color, context, text, subText) {
    if (text == undefined) {
        text = "";
    }
    if (subText == undefined) {
        subText = "";
    }
    var headlen = 20;

    var angle = Math.atan2(endPositionY - startPositionY, endPositionX - startPositionX);

    drawLine(startPositionX, startPositionY, endPositionX, endPositionY, color, lineWidth, lineStyle, context);

    drawText(text, 20, TextAlign.Left, TextBaseLine.Middle, false, true, endPositionX - headlen * Math.cos(angle - Math.PI / 7), endPositionY - 20 - headlen * Math.sin(angle - Math.PI / 7), context, subText, "", color);

    context.beginPath();
    context.moveTo(endPositionX, endPositionY);

    context.lineTo(endPositionX - headlen * Math.cos(angle - Math.PI / 7), endPositionY - headlen * Math.sin(angle - Math.PI / 7));
    context.lineTo(endPositionX - headlen * Math.cos(angle + Math.PI / 7), endPositionY - headlen * Math.sin(angle + Math.PI / 7));
    context.lineTo(endPositionX, endPositionY);
    context.lineTo(endPositionX - headlen * Math.cos(angle - Math.PI / 7), endPositionY - headlen * Math.sin(angle - Math.PI / 7));
    context.strokeStyle = color;
    context.lineWidth = 5;
    context.fillStyle = color;
    context.fill();
}
