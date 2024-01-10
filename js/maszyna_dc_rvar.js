//This file is using to show charts fors Rvar - Function wher i repaird something, this part is signed



/**
* Funkcja rysująca 2 wykresy (maszyna_DC_RVar)
* @param {*} width szerokość wykresu w pikselach
* @param {*} height wysokość wykresu w pikselach
* @param {*} inputMin minimalna wartość suwaka
* @param {*} inputMax maksymalna wartość suwaka
* @param {*} inputStep skok suwaka
* @param {*} inputDefaultValue domyślna wartość suwaka
* @param {*} minValueX minimalna wartość na osi X - wykres 1
* @param {*} maxValueX maksymalna wartość na osi X - wykres 2
* @param {*} precisionX precyzja wartości na osi X - wykres 1
* @param {*} minValueY minimalna wartość na osi Y - wykres 2
* @param {*} maxValueY maksymalna wartość na osi Y - wykres 1
* @param {*} precisionY precyzja wartości na osi Y - wykres 1
* @param {*} minValueX2 minimalna wartość na osi X - wykres 2
* @param {*} maxValueX2 maksymalna wartość na osi X - wykres 2
* @param {*} precisionX2 precyzja wartości na osi X - wykres 2
* @param {*} minValueY2 minimalna wartość na osi Y - wykres 2
* @param {*} maxValueY2 maksymalna wartość na osi Y - wykres 2
* @param {*} precisionY2 precyzja wartości na osi X - wykres 2
* @param {*} gridHorizontalSpace poziomy odstęp między liniami siatki - wykres 1
* @param {*} gridVerticalSpace pionowy odstęp między liniami siatki - wykres 1
* @param {*} gridHorizontalSpace2 poziomy odstęp między liniami siatki - wykres 2
* @param {*} gridVerticalSpace2 pionowy odstęp między liniami siatki - wykres 2
* @param {*} graduationHorizontalSpace poziomy odstęp między liniami podziałki - wykres 1
* @param {*} graduationVerticalSpace pionowy odstęp między liniami podziałki - wykres 1
* @param {*} graduationHorizontalSpace2 poziomy odstęp między liniami podziałki - wykres 2
* @param {*} graduationVerticalSpace2 pionowy odstęp między liniami podziałki - wykres 2
* @param {*} firstPlotColor kolor linii wykresu - wykres 1
* @param {*} firstPlotColor2 kolor drugiej linii wykresu - wykres 1
* @param {*} secondPlotColor kolor linii wykresu - wykres 2
* @param {*} secondPlotColor2 kolor drugiej linii wykresu - wykres 2
* @param {*} zeroPointsColor kolor miejsc przecięcia osi
* @param {*} iNominal wartość X nominalna - wykres 1
* @param {*} mNominal  wartość X nominalna - wykres 2
*/
function maszynaDcRvar(width, height, inputMin, inputMax, inputStep, inputDefaultValue, minValueX, maxValueX, precisionX, minValueY, maxValueY, precisionY, minValueX2, maxValueX2, precisionX2, minValueY2, maxValueY2, precisionY2, gridHorizontalSpace, gridVerticalSpace, gridHorizontalSpace2, gridVerticalSpace2, graduationHorizontalSpace, graduationVerticalSpace, graduationHorizontalSpace2, graduationVerticalSpace2, firstPlotColor, firstPlotColor2, secondPlotColor, secondPlotColor2, zeroPointsColor, iNominal, mNominal) {
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
   if (language == "pl") {
      moment = "M";
      napiecie = "U";
   }
   else {
      moment = "T";
      napiecie = "V";
   }

   //#region   create elements
   var canvas = createCanvas("", width + 160, height + 100);
   var canvas2 = createCanvas("", width + 160, height + 100);
   var container = createDiv("maszynaDc");

   var context = canvas.getContext('2d');
   var context2 = canvas2.getContext('2d');
   var inputDiv = createDiv("plot-inputs");
   input = addInput("R", "", inputMin, inputMax, inputStep, width, "d", inputDefaultValue);
   var valueSlider = input.tableRow2.children[1].children[0];
   var table = document.createElement('table');
   table.style.textAlign = "center";
   //#endregion
   var values, values2;
   values2 = calculateMaszynaDcRvar(valueSlider.min, minValueX, maxValueX, 1);
   values3 = calculateMaszynaDcRvar2(valueSlider.min, minValueX2, maxValueX2, 1);

   valueSlider.oninput = function () {
      input.tableRow3.children[0].children[0].textContent = this.value;

      //#region wykres 1

      //
      values = calculateMaszynaDcRvar(this.value, minValueX, maxValueX, 0.1);
      //

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      var zero = drawAxes(Symbol.Omega, "i", width, height, minValueX, minValueY, maxValueX, maxValueY, context, Color.Black, 2, LineStyle.Solid);
      drawGrid(zero, width, height, gridHorizontalSpace, gridVerticalSpace, graduationHorizontalSpace, graduationVerticalSpace, minValueX, maxValueX, minValueY, maxValueY, context, Color.Gray, 0.6, LineStyle.Solid, precisionX, precisionY);
      plot(values, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, 2, LineStyle.Solid, firstPlotColor, context);
      plot(values2, zero, minValueX, maxValueX, minValueY, maxValueY, width, height, 1, LineStyle.SmallDashed, firstPlotColor2, context);
      drawText("R", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values2[Math.floor(values2.length / 2)].x / (maxValueX - minValueX) * width), invertYAxis(zero[0].y, (values2[Math.floor(values2.length / 2)].y / (maxValueY - minValueY) * height)) - 10, context, "d");
      drawText(" = 0", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values2[Math.floor(values2.length / 2)].x / (maxValueX - minValueX) * width) + context.measureText("rd ").width, invertYAxis(zero[0].y, (values2[Math.floor(values2.length / 2)].y / (maxValueY - minValueY) * height)) - 10, context);
      drawZeroPoints(values, width, height, minValueX, minValueY, maxValueX, maxValueY, zero, zeroPointsColor, context, Symbol.Omega, "0", "I", "Z");
      drawLine(zero[0].x + (iNominal / (maxValueX - minValueX) * width), invertYAxis(zero[0].y, (maxValueY / (maxValueY - minValueY) * height)), zero[0].x + (iNominal / (maxValueX - minValueX) * width), invertYAxis(zero[0].y, (minValueY / (maxValueY - minValueY) * height)), Color.Blue, 0.7, LineStyle.SmallDashed, context);
      drawText("I", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (iNominal / (maxValueX - minValueX) * width) + 10, zero[0].y - 40, context, "N");
      //#endregion

      //#region wykres 2

      //
      values = calculateMaszynaDcRvar2(this.value, minValueX2, maxValueX2, 0.1);
      //
      context2.fillStyle = "#ffffff";
      context2.fillRect(0, 0, canvas.width, canvas.height);
      zero = drawAxes(Symbol.Omega, moment, width, height, minValueX2, minValueY2, maxValueX2, maxValueY2, context2, Color.Black, 2, LineStyle.Solid);
      drawGrid(zero, width, height, gridHorizontalSpace2, gridVerticalSpace2, graduationHorizontalSpace2, graduationVerticalSpace2, minValueX2, maxValueX2, minValueY2, maxValueY2, context2, Color.Gray, 0.6, LineStyle.Solid, precisionX2, precisionY2);
      plot(values, zero, minValueX2, maxValueX2, minValueY2, maxValueY2, width, height, 2, LineStyle.Solid, secondPlotColor, context2);
      plot(values3, zero, minValueX2, maxValueX2, minValueY2, maxValueY2, width, height, 1, LineStyle.SmallDashed, secondPlotColor2, context2);
      drawText("R", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values3[Math.floor(values3.length / 2)].x / (maxValueX2 - minValueX2) * width), invertYAxis(zero[0].y, (values3[Math.floor(values3.length / 2)].y / (maxValueY2 - minValueY2) * height)) - 10, context2, "d");
      drawText(" = 0", 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (values3[Math.floor(values3.length / 2)].x / (maxValueX2 - minValueX2) * width) + context.measureText("rd ").width, invertYAxis(zero[0].y, (values3[Math.floor(values3.length / 2)].y / (maxValueY2 - minValueY2) * height)) - 10, context2);

      drawZeroPoints(values, width, height, minValueX2, minValueY2, maxValueX2, maxValueY2, zero, zeroPointsColor, context2, Symbol.Omega, "0", moment, "Z");
      drawLine(zero[0].x + (mNominal / (maxValueX2 - minValueX2) * width), invertYAxis(zero[0].y, (maxValueY2 / (maxValueY2 - minValueY2) * height)), zero[0].x + (mNominal / (maxValueX2 - minValueX2) * width), invertYAxis(zero[0].y, (minValueY2 / (maxValueY2 - minValueY2) * height)), Color.Blue, 0.7, LineStyle.SmallDashed, context2);
      drawText(moment, 14, TextAlign.Left, TextBaseLine.Middle, false, true, zero[0].x + (mNominal / (maxValueX2 - minValueX2) * width) + 10, zero[0].y - 30, context2, "N");
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
   container.appendChild(canvas2);
   document.currentScript.parentElement.appendChild(container);
   //#endregion
}
