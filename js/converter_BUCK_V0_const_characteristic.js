/**
* Function drowsing output characteristic (BUCK)
* @param {*} width width of the chart in pixels
* @param {*} height the height of the graph in pixels
* @param {*} inputMin the minimum value of the slider
* @param {*} inputMax maximum value of the slider
* @param {*} inputStep slider jump
* @param {*} inputDefaultValue default value of the slider
* @param {*} minValueX minimum value on the X axis - Fill visualization
* @param {*} maxValueX maximum value on the X axis - chart
* @param {*} precisionX precision of the values on the X axis - Fill visualization
* @param {*} minValueY minimum value on the Y axis - chart
* @param {*} maxValueY maximum value on the Y axis - Fill visualization
* @param {*} precisionY precision of the values on the Y axis - Fill visualization
* @param {*} gridHorizontalSpace horizontal spacing between grid lines - Fill visualization
* @param {*} gridVerticalSpace vertical spacing between grid lines - Fill visualization
* @param {*} graduationHorizontalSpace horizontal graduation line spacing - Fill visualization
* @param {*} graduationVerticalSpace vertical spacing between graduation lines - Fill visualization
* @param {*} firstPlotColor color of plot lines - Fill visualization
* @param {*} secondPlotColor color of plot line - plot
* @param {*} secondPlotColor2 color of the second line of the plot - plot
* @param {*} secondPlotColor3 color of the third line of the plot - plot
*/
function converter_BUCK_V0_const_characteristic(width, height, inputMin, inputMax, inputStep, inputDefaultValue, minValueX, maxValueX, precisionX, minValueY, maxValueY, precisionY, gridHorizontalSpace, gridVerticalSpace, graduationHorizontalSpace, graduationVerticalSpace, firstPlotColor, secondPlotColor, secondPlotColor2, secondPlotColor3) {
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

    if (minValueX > maxValueX || minValueY > maxValueY) {
        isError = true;
        errorMsg += "\tNieprawidłowe wartości osi wykresu\n";
    }

    if (gridHorizontalSpace < 0 || gridVerticalSpace < 0 || graduationHorizontalSpace < 0 || graduationVerticalSpace < 0) {
        isError = true;
        errorMsg += "\tNieprawidłowe wartości podziałki i siatki wykresu\n";
    }

    if (precisionX < 0 || precisionY < 0) {
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
    var container = createDiv("BUCK_const");

    var context = canvas.getContext('2d');

    var inputDiv = createDiv("plot-inputs");
    var input = addInput("Vo/Vin", "", inputMin, inputMax, inputStep, width, "", inputDefaultValue);
    var valueSlider = input.tableRow2.children[1].children[0];
    var table = document.createElement('table');
    table.style.textAlign = "center";

    //#endregion
    var values;
    var values2;


    valueSlider.oninput = function () {
        input.tableRow3.children[0].children[0].textContent = this.value;

        //#region wizulaizacja wypełnienia
        values = calculateBuckconstCharacteristic(this.value, minValueX, maxValueX, 0.001);
        values2 = calculateBuckconstCharacteristicLine(this.value, minValueX, maxValueX, 0.1);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        var zero = drawAxes("D", "---I0/Iref", width, height, minValueX, minValueY, maxValueX, maxValueY, context, Color.Black, 2, LineStyle.Solid);
        drawGrid(zero, width, height, gridHorizontalSpace, gridVerticalSpace, graduationHorizontalSpace, graduationVerticalSpace, minValueX, maxValueX, minValueY, maxValueY, context, Color.Gray, 0.6, LineStyle.Solid, precisionX, precisionY);
        plot(values, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, 2, LineStyle.Solid, firstPlotColor, context);
        plot(values2, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, 2, LineStyle.Dotted2, secondPlotColor, context);

        //#endregion


    };
    valueSlider.oninput();


    //#region   build plot div structure
    table.appendChild(input.tableRow);
    table.appendChild(input.tableRow2);
    table.appendChild(input.tableRow3);
    inputDiv.append(table);
    container.appendChild(inputDiv);
    container.appendChild(canvas);
    document.currentScript.parentElement.appendChild(container);

    //#endregion
}