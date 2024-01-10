/**
* This function drowing time courses (BUCK)
* @param {*} width width of the chart in pixels
* @param {*} height the height of the graph in pixels
* @param {*} inputMin the minimum value of the slider for first value
* @param {*} inputMin2 the minimum value of the slider for second value
* @param {*} inputMax maximum value of the slider for first value
* @param {*} inputMax2 maximum value of the slider for second value
* @param {*} inputStep slider jump for first value
* @param {*} inputStep2 slider jump for second value
* @param {*} inputDefaultValue default value of the slider  for first value
* @param {*} inputDefaultValue2 default value of the slider for second value
* @param {*} minValueX minimum value on the X axis - charts showing basic waveforms
* @param {*} maxValueX maximum value on the X axis - chart
* @param {*} precisionX precision of values on the X axis - graphs showing basic waveforms
* @param {*} minValueY minimum value on the Y axis - chart
* @param {*} maxValueY maximum value on the Y axis - graphs showing basic waveforms
* @param {*} precisionY precision of values on the Y axis - graphs showing basic waveforms
* @param {*} minValueX2 minimum value on the X axis - chart
* @param {*} maxValueX2 maximum value on the X axis - chart
* @param {*} precisionX2 precision of the values on the X axis - graph
* @param {*} minValueY2 minimum value on the Y axis - chart
* @param {*} maxValueY2 maximum value on the Y axis - chart
* @param {*} precisionY2 precision of the values on the X axis - graph
* @param {*} gridHorizontalSpace horizontal spacing between grid lines - graphs showing basic waveforms
* @param {*} gridVerticalSpace vertical spacing between grid lines - graphs showing basic waveforms
* @param {*} gridHorizontalSpace2 horizontal spacing between grid lines - graph
* @param {*} gridVerticalSpace2 vertical spacing between grid lines - graph
* @param {*} graduationHorizontalSpace horizontal spacing between graduation lines - graphs showing basic waveforms
* @param {*} graduationVerticalSpace vertical spacing between graduation lines - graphs showing basic waveforms
* @param {*} graduationHorizontalSpace2 horizontal graduation line spacing - graph
* @param {*} graduationVerticalSpace2 vertical space between graduation lines - graph
* @param {*} firstPlotColor color of plot lines - plots showing basic plots
* @param {*} firstPlotColor2 color of plot lines - plots showing basic plots
* @param {*} firstPlotColor3 color of plot lines - plots showing basic plots
* @param {*} firstPlotColor4 color of plot lines - plots showing basic plots
* @param {*} firstPlotColor5 color of plot lines - plots showing basic plots
* @param {*} firstPlotColor6 color of plot lines - plots showing basic plots
* @param {*} secondPlotColor color of plot line - plot
* @param {*} secondPlotColor2 color of the second line of the plot - plot
* @param {*} secondPlotColor3 color of the third line of the plot - plot
*/
function converter_BUCK_continuous_operation_in_time(width, height, inputMin, inputMax, inputStep, inputDefaultValue, minValueX, maxValueX, precisionX, minValueY, maxValueY, precisionY, minValueX2, maxValueX2, precisionX2, minValueY2, maxValueY2, precisionY2, gridHorizontalSpace, gridVerticalSpace, gridHorizontalSpace2, gridVerticalSpace2, graduationHorizontalSpace, graduationVerticalSpace, graduationHorizontalSpace2, graduationVerticalSpace2, inputMin2, inputMax2, inputStep2, inputDefaultValue2, firstPlotColor, firstPlotColor2, firstPlotColor3, firstPlotColor4, firstPlotColor5, firstPlotColor6, secondPlotColor, secondPlotColor2, secondPlotColor3) {
    var scriptName = document.currentScript.text;
    var errorMsg = "Wystąpił błąd w skrypcie: " + scriptName.substring(0, scriptName.indexOf("(")) + "\n";
    var isError = false;
    if (width < 0 || height < 0) {
        isError = true;
        errorMsg += "\tNieprawidłowe wymiary wykresu\n";
    }
    if (inputMin > inputMax || inputMin + inputStep > inputMax || inputDefaultValue < inputMin || inputDefaultValue > inputMax) {
        isError = true;
        errorMsg += "\tNieprawidłowe parametry suwaka\n";
    }

    if (minValueX > maxValueX || minValueY > maxValueY || minValueX2 > maxValueX2 || minValueY2 > maxValueY2) {
        isError = true;
        errorMsg += "\tNieprawidłowe wartości osi wykresu\n";
    }

    if (gridHorizontalSpace < 0 || gridVerticalSpace < 0 || gridHorizontalSpace2 < 0 || gridVerticalSpace2 < 0 || graduationHorizontalSpace < 0 || graduationVerticalSpace < 0 || graduationHorizontalSpace2 < 0 || graduationVerticalSpace2 < 0) {
        isError = true;
        errorMsg += "\tNieprawidłowe wartości podziałki i siatki wykresu\n";
    }

    if (precisionX < 0 || precisionX2 < 0 || precisionY < 0 || precisionY2 < 0) {
        isError = true;
        errorMsg += "\tNieprawidłowa precyzja wartości na osiach\n";
    }

    if (isError) {
        errorMsg += "Wykres nie został narysowany.";
        alert(errorMsg);
        return;
    }
    var language = getLanguage();
    var moment;
    var napiecie;
    var wypelnienie;
    if (language == "pl") {
        moment = "M";
        napiecie = "U";
        wypelnienie = "D";
    }
    else {
        moment = "T";
        napiecie = "V";
        wypelnienie = "D";
    }

    //#region   create elements
    var canvas = createCanvas("", width + 160, height + 100);
    var container = createDiv("BUCK_continous");

    var context = canvas.getContext('2d');


    var inputDiv = createDiv("plot-inputs");
    var input = addInput("D", "", inputMin, inputMax, inputStep, width, "", inputDefaultValue);
    var valueSlider = input.tableRow2.children[1].children[0];
    var table = document.createElement('table');
    table.style.textAlign = "center";


    var input2 = addInput("V", "", inputMin2, inputMax2, inputStep2, width, "in", inputDefaultValue2);
    var valueSlider2 = input2.tableRow2.children[1].children[0];



    //#endregion
    var values;

    valueSlider2.oninput = function () {
        input2.tableRow3.children[0].children[0].textContent = this.value;
        valueSlider.oninput();
    };


    valueSlider.oninput = function () {
        input.tableRow3.children[0].children[0].textContent = this.value;

        //#region operations in the time for BOOST  
        values = calculateBuckVL(this.value, minValueX, maxValueX, 0.001, valueSlider2.value);
        values2 = calculateBuckVD(this.value, minValueX, maxValueX-0.001, 0.001, valueSlider2.value);
        values3 = calculateBuckVT(this.value, minValueX, maxValueX-0.001, 0.001, valueSlider2.value);
        values4 = calculateBuckIL(this.value, minValueX, maxValueX, 0.001, valueSlider2.value);
        values5 = calculateBuckIT(this.value, minValueX, maxValueX-0.001, 0.001, valueSlider2.value);
        values6 = calculateBuckID(this.value, minValueX, maxValueX, 0.001, valueSlider2.value);

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        var zero = drawAxes("", "t", width, height, minValueX, minValueY, maxValueX, maxValueY, context, Color.Black, 2, LineStyle.Solid);
        drawText("t", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values[Math.floor(values.length / 2)].x / (maxValueX - minValueX) * (this.value * 100)), invertYAxis(zero[0].y, (values[Math.floor(this.value.length / 2)].y / (maxValueY - minValueY) * height)) - 10, context, "on");
        if (this.value != 1) {
            drawText("t", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values[Math.floor(values.length / 2)].x / (maxValueX - minValueX) * (this.value * 155 + 250)), invertYAxis(zero[0].y, (values[Math.floor(this.value.length / 2)].y / (maxValueY - minValueY) * height)) - 10, context, "off");
        }
        drawGrid(zero, width, height, gridHorizontalSpace, gridVerticalSpace, graduationHorizontalSpace, graduationVerticalSpace, minValueX, maxValueX, minValueY, maxValueY, context, Color.Gray, 0.6, LineStyle.Solid, precisionX, precisionY);
        drawText("V", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values[Math.floor(values.length / 2)].x / (maxValueX - minValueX)) - 30, invertYAxis(zero[0].y, (values[Math.floor(this.value.length)].y / (maxValueY - minValueY))) - 20, context, "L");
        plot(values, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, 2, LineStyle.Solid, firstPlotColor, context);
        drawAxes("", "t", width, height, 0, minValueY + 100, 0, maxValueY + 100, context, Color.Black, 2, LineStyle.Solid);
        drawText("V", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values[Math.floor(values.length / 2)].x / (maxValueX - minValueX)) - 30, invertYAxis(zero[0].y, (values[Math.floor(this.value.length)].y / (maxValueY - minValueY))) + 70, context, "D");
        plot(values2, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, 2, LineStyle.Solid, firstPlotColor2, context);
        drawAxes("", "t", width, height, 0, minValueY + 200, 0, maxValueY + 200, context, Color.Black, 2, LineStyle.Solid);
        drawText("V", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values[Math.floor(values.length / 2)].x / (maxValueX - minValueX)) - 30, invertYAxis(zero[0].y, (values[Math.floor(this.value.length)].y / (maxValueY - minValueY))) + 150, context, "T");
        plot(values3, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, 2, LineStyle.Solid, firstPlotColor3, context);
        drawAxes("", "t", width, height, 0, minValueY + 300, 0, maxValueY + 300, context, Color.Black, 2, LineStyle.Solid);
        drawText("I", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values[Math.floor(values.length / 2)].x / (maxValueX - minValueX)) - 30, invertYAxis(zero[0].y, (values[Math.floor(this.value.length)].y / (maxValueY - minValueY))) + 235, context, "L");
        plot(values4, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, 2, LineStyle.Solid, firstPlotColor4, context);
        drawAxes("", "t", width, height, 0, minValueY + 400, 0, maxValueY + 400, context, Color.Black, 2, LineStyle.Solid);
        drawText("I", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values[Math.floor(values.length / 2)].x / (maxValueX - minValueX)) - 30, invertYAxis(zero[0].y, (values[Math.floor(this.value.length)].y / (maxValueY - minValueY))) + 315, context, "T");
        plot(values5, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, 2, LineStyle.Solid, firstPlotColor5, context);
        drawAxes("", "t", width, height, 0, minValueY + 500, 0, maxValueY + 500, context, Color.Black, 2, LineStyle.Solid);
        drawText("I", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values[Math.floor(values.length / 2)].x / (maxValueX - minValueX)) - 30, invertYAxis(zero[0].y, (values[Math.floor(this.value.length)].y / (maxValueY - minValueY))) + 400, context, "D");
        plot(values6, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, 2, LineStyle.Solid, firstPlotColor6, context);

        //#endregion
    };
    valueSlider.oninput();
    valueSlider2.oninput();


    //#region   build plot div structure
    table.appendChild(input.tableRow);
    table.appendChild(input.tableRow2);
    table.appendChild(input.tableRow3);
    table.appendChild(input2.tableRow);
    table.appendChild(input2.tableRow2);
    table.appendChild(input2.tableRow3);
    inputDiv.append(table);
    container.appendChild(inputDiv);
    container.appendChild(canvas);
    document.currentScript.parentElement.appendChild(container);

    //#endregion
}