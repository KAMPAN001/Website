//This area is not full of my. I had to rapair code for calculation DC R var and it's new code for website.

//#region DcRvar

function calculateMaszynaDcRvar(y, min, max, step) {
    var valuesList = [];

    for (var i = min; i <= max; i += step) {
        valuesList.push({ x: i, y: (440 - (i * y) - (i * 2)) / (2.76) });
    }

    return valuesList;
}

function calculateMaszynaDcRvar2(y, min, max, step) {
    var valuesList = [];
    for (var i = min; i <= max; i += step) {
        valuesList.push({ x: i, y: (440 - ((i / (1 * 2.76)) * y) - (i * 0.5)) / (1 * 2.76) });
    }
    return valuesList;
}

//#endregion 

//Everything below is written by me

//#region BUCK

function calculateBuckVL(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin * D

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = (Vin - V0) * 4;
        }
        else {
            z = (-V0) * 4;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBuckVD(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = (Vin * 4) - 100;
        }
        else {
            z = - 100;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBuckVT(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = - 200;
        }
        else {
            z = (Vin * 4) - 200;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBuckIL(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    Vin = Vin + 10;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = ((Vin / 0.1) * check) - 290;

        }

        else if (check >= D) {
            z = ((Vin / 0.1) * (1 - check)) - 290;
            if (z < ((Vin / 0.1) * check) - 290) {
                z = z + (check + Vin);
            }

            if (z > ((Vin / 0.1) * check) - 290) {
                z = z - (check + Vin);
            }
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });

    }

    return valuesList;
}

function calculateBuckIT(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;

    for (var i = min; i <= max; i += step) {
        Vin = Vin + 10;

        if (check < D) {
            z = ((Vin / 0.1) * check) - 390;

        }

        else if (check >= D) {
            z = -400;

        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBuckID(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = -500;
        }
        else if (check >= D) {
            z = ((Vin / 0.11) * (1 - check)) - 490;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }
    return valuesList;
}

function calculateBuckVLimpuls(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D);
    var D1 = (Vin / (V0 - Vin)) * D;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = ((V0 - Vin) * 1.5);
        }
        else if (check < D1 && check > D) {
            z = -V0 * 3;
        }
        else {
            z = 0;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBuckILimpuls(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D);
    var D1 = (Vin / (V0 - Vin)) * D;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = ((Vin / 0.1) * check) - 100;
        }
        else if (check < D1 && check > D) {
            z = ((Vin / 0.1) * (1 - check)) - 100;
            if (z < ((Vin / 0.1) * check) - 100) {
                z = z + (check + Vin);
            }

            if (z > ((Vin / 0.1) * check) - 100) {
                z = z - (check + Vin);
            }
        }
        else {
            z = 0 - 100;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });

    }

    return valuesList;
}

function calculateBuckOutputCharacteristic(D, min, max, step) {
    var z = 0;
    var z2 = 0;
    var I0crit = 0.2
    var valuesList = [];

    for (var i = min; i <= max; i += step) {

        if (D >= 0.50) {
            I0crit = (2 / D) / 15.5;
        }

        if (D <= 0.40) {

            I0crit = (2.2 / (1 - D)) / 16;

        }

        if (D < 0.50 && D > 0.4) {

            I0crit = (2.1 / (1 - D)) / 16;
            if (D > 0.48) {
                I0crit = (2 / (1 - D)) / 16;
            }

        }


        if (i < I0crit) {
            z = 1 / (i * (1 / (D * D)) + 1);
            z2 = z;
        }
        else {
            z = z2;
        }

        if (z < 1.01) {
            valuesList.push({ x: i, y: z });
        }
    }

    return valuesList;
}

function calculateBuckconstCharacteristic(V, min, max, step) {
    var z = 0;
    var x = 1 / V;
    var z2 = 1;
    var I0crit = 1 - V;
    var valuesList = [];

    for (var i = min; i <= max; i += step) {
        checkx = 1 - i;
        if (i < I0crit) {

            z = Math.sqrt((i) / ((x * x) - x));
            if (z > checkx) {
                z = z2;
            }
            z2 = z
        }
        else {
            z = z2;
        }

        valuesList.push({ x: i, y: z });

    }

    return valuesList;
}

function calculateBuckconstCharacteristicLine(V, min, max, step) {
    var z = 0;
    var z2 = 0;
    var x = V;
    var I0crit;
    var valuesList = [];

    for (var i = min; i <= max; i += step) {

        I0crit = 1 - i;

        z = I0crit;

        valuesList.push({ x: i, y: z });

    }

    return valuesList;
}

function calculateBuckOutputCharacteristicLine1(D, min, max, step) {
    var z = 0;
    var z2 = 0;
    var I0crit = 0.2
    var valuesList = [];
    max = 0.25;

    for (var i = min; i <= max; i += step) {

        I0crit = (0.01 * 0.2 + 1 - 0.2) * ((i * (i * 0.85)) * 11);

        z = I0crit;
        if (i > 0.23) {
            z = z + 0.02;
        }
        if (i > 0.24) {
            z = z + 0.06;
        }
        if (z < 1.01) {
            valuesList.push({ x: i, y: z });
        }
    }
    return valuesList;
}

function calculateBuckOutputCharacteristicLine2(D, min, max, step) {
    var z = 0;
    var z2 = 0;
    var I0crit = 0.2
    var valuesList = [];
    max = 0.245;

    for (var i = min; i <= max; i += step) {

        I0crit = ((0.01 * 0.2 + 1 - 0.2) * ((-i * (i * 0.85)) * 11)) + 1;

        z = I0crit;
        if (i > 0.24) {
            z = z - 0.06;
        }

        if (z < 1.01) {
            valuesList.push({ x: i, y: z });
        }
    }

    return valuesList;
}


//#endregion 

//#region BOOST

function calculateBoostVL(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D)

    for (var i = min; i <= max; i += step) {


        if (check < D) {
            z = (Vin * D) * 2;
        }
        else {
            z = Vin - V0;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBoostVD(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D)

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = V0 - 100;
        }
        else {
            z = - 100;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBoostVT(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D)

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = - 200;
        }
        else {
            z = V0 - 200;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}


function calculateBoostIL(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D);
    Vin = Vin + 10;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = ((Vin / 0.1) * check) - 300;

        }

        else if (check >= D) {
            z = ((Vin / 0.1) * (1 - check)) - 300;
            if (z < ((Vin / 0.1) * check) - 300) {
                z = z + (check + Vin);
            }

            if (z > ((Vin / 0.1) * check) - 300) {
                z = z - (check + Vin);
            }
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });

    }

    return valuesList;
}

function calculateBoostIT(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    Vin = Vin + 10;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = ((Vin / 0.1) * check) - 390;

        }

        else if (check >= D) {
            z = -400;

        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBoostID(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    Vin = Vin + 10;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = -500;
        }
        else if (check > D) {
            z = ((Vin / 0.2) * (1 - check)) - 490;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBoostVLimpuls(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D);
    var D1 = (Vin / (V0 - Vin)) * D;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = (Vin * D) * 4;
        }
        else if (check < D1 && check > D) {
            z = (-V0 * D) * 5;
        }
        else {
            z = 0;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBoostVDimpuls(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D)
    var D1 = (Vin / (V0 - Vin)) * D;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = V0 - 50;
        }
        else if (check < D1 && check > D) {
            z = - 100;
        }
        else {
            z = V0 - 100;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBoostVTimpuls(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D)
    var D1 = (Vin / (V0 - Vin)) * D;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = - 200;
        }
        else if (check < D1 && check > D) {
            z = V0 - 150;
        }
        else {
            z = V0 - 200;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBoostILimpuls(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D);
    var D1 = (Vin / (V0 - Vin)) * D;
    Vin = Vin + 10;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = ((Vin / 0.1) * check) - 300;
        }
        else if (check < D1 && check > D) {
            z = ((Vin / 0.1) * (1 - check)) - 300;
            if (z < ((Vin / 0.1) * check) - 300) {
                z = z + (check + Vin);
            }

            if (z > ((Vin / 0.1) * check) - 300) {
                z = z - (check + Vin);
            }
        }
        else {
            z = 0 - 300;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });

    }

    return valuesList;
}

function calculateBoostITimpuls(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D);
    var D1 = (Vin / (V0 - Vin)) * D;
    Vin = Vin + 10;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = ((Vin / 0.1) * check) - 400;
        }
        else if (check < D1 && check > D) {
            z = 0 - 400;
        }
        else {
            z = 0 - 400;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateBoostIDimpuls(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D);
    var D1 = (Vin / (V0 - Vin)) * D;
    Vin = Vin + 10;

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = 0 - 500;
        }
        else if (check < D1 && check > D) {
            z = ((Vin / 0.2) * (1 - check)) - 500;

        }
        else {
            z = ((Vin / 0.2) * (1 - check)) - 500;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}


function calculateBoostOutputCharacteristic(D, min, max, step) {
    var z = 0;
    var z2 = 0;
    var I0crit = 0.2
    var valuesList = [];

    for (var i = min; i <= max; i += step) {

        if (D >= 0.50) {
            I0crit = 0.25 - (D / 6) + 0.10;
        }

        if (D < 0.50) {
            I0crit = 0.24 - (0.48 / 6) + 0.10;
        }

        if (i < I0crit) {
            z = D / i;
            z2 = D / i;
        }
        else {
            z = z2;
        }

        if (z < 10.1) {
            while (z < 1) {
                z = z + 0.01
            }
            valuesList.push({ x: i, y: z });
        }
    }

    return valuesList;
}

function calculateBoostOutputCharacteristicLine1() {
    var valuesList = [];

    valuesList.push({ x: 0, y: 1 });
    valuesList.push({ x: 0.07, y: 1 });
    valuesList.push({ x: 0.1, y: 1.01 });
    valuesList.push({ x: 0.15, y: 1.1 });
    valuesList.push({ x: 0.20, y: 1.3 });
    valuesList.push({ x: 0.22, y: 1.5 });
    valuesList.push({ x: 0.25, y: 1.85 });

    return valuesList;
}

function calculateBoostOutputCharacteristicLine2() {
    var valuesList = [];

    valuesList.push({ x: 0.09, y: 10 });
    valuesList.push({ x: 0.1, y: 9 });
    valuesList.push({ x: 0.115, y: 8 });
    valuesList.push({ x: 0.135, y: 7 });
    valuesList.push({ x: 0.145, y: 6.5 });
    valuesList.push({ x: 0.156, y: 6 });
    valuesList.push({ x: 0.17, y: 5.5 });
    valuesList.push({ x: 0.182, y: 5 });
    valuesList.push({ x: 0.19, y: 4.7 });
    valuesList.push({ x: 0.21, y: 4 });
    valuesList.push({ x: 0.221, y: 3.6 });
    valuesList.push({ x: 0.228, y: 3.4 });
    valuesList.push({ x: 0.234, y: 3.2 });
    valuesList.push({ x: 0.244, y: 2.8 });
    valuesList.push({ x: 0.248, y: 2.6 });
    valuesList.push({ x: 0.252, y: 2.4 });
    valuesList.push({ x: 0.25, y: 1.9 });

    return valuesList;
}

function calculateBoostconstCharacteristic(V, min, max, step) {
    var z = 0;
    var z2 = 0;
    var I0crit = 0.2
    var valuesList = [];
    var D = 1 - (1 / V);
    var Vx = 1 / V;

    for (var i = min; i <= max; i += step) {
        I0crit = 0.3 * D * ((1 - D) ^ 2)

        if (i < I0crit) {
            if (V > 2.4) {
                z = Math.sqrt(i / (Vx * ((Vx * 1.5))));
                z2 = D;
                if (z > D) {
                    z = D;
                }
            }
            if (V <= 2.4 && V > 2.2) {
                z = Math.sqrt(i / (Vx * ((Vx * 1.6))));
                z2 = D;
                if (z > D) {
                    z = D;
                }
            }
            if (V <= 2.2 && V > 2.05) {
                z = Math.sqrt(i / (Vx * ((Vx * 1.9))));
                z2 = D;
                if (z > D) {
                    z = D;
                }
            }
            if (V <= 2.05 && V > 1.9) {
                z = Math.sqrt(i / (Vx * ((Vx * 2))));
                z2 = D;
                if (z > D) {
                    z = D;
                }
            }
            if (V <= 1.9 && V > 1.7) {
                z = Math.sqrt(i / (Vx * ((Vx * Vx * 3.9))));
                z2 = D;
                if (z > D) {
                    z = D;
                }
            }
            if (V <= 1.7) {
                z = Math.sqrt(i / (Vx * ((Vx * Vx * 4.4))));
                z2 = D;
                if (z > D) {
                    z = D;
                }
            }
        }
        else {
            z = z2;
        }

        valuesList.push({ x: i, y: z });

    }

    return valuesList;
}

function calculateBoostconstCharacteristicLine1() {
    var valuesList = [];

    valuesList.push({ x: 0.001, y: 1 });
    valuesList.push({ x: 0.02, y: 0.875 });
    valuesList.push({ x: 0.05, y: 0.75 });
    valuesList.push({ x: 0.09, y: 0.60 });
    valuesList.push({ x: 0.1, y: 0.57 });
    valuesList.push({ x: 0.125, y: 0.50 });
    valuesList.push({ x: 0.15, y: 0.375 });
    valuesList.push({ x: 0.151, y: 0.360 });
    valuesList.push({ x: 0.153, y: 0.340 });
    valuesList.push({ x: 0.149, y: 0.300 });
    valuesList.push({ x: 0.144, y: 0.250 });
    valuesList.push({ x: 0.125, y: 0.180 });
    valuesList.push({ x: 0.1, y: 0.125 });
    valuesList.push({ x: 0.001, y: 0 });


    return valuesList;
}

//#endregion

//#region FORWARD

function calculateForwardu2(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin * D

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = (Vin) * 4;
        }
        else if (check > D && check < 2 * D) {
            z = (-Vin) * 4;
        }
        else {
            z = 0;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateForwarduD2(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin * D

    for (var i = min; i <= max; i += step) {

        if (check < D) {
            z = ((Vin) * 4) - 100;
        }
        else if (check > D && check < 2 * D) {
            z = -100;
        }
        else {
            z = -100;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateForwardu0(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;

    for (var i = min; i <= max; i += step) {

        z = ((Vin * 4) * D) - 100;

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateForwarduL(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin * D
    u0 = ((Vin * 2) * D);

    for (var i = min; i <= max; i += step) {


        if (check < D) {
            z = (((2 * Vin) - u0) * 4) - 200;
        }
        else if (check > D && check < 2 * D) {
            z = -(3 * u0) - 200;
        }
        else {
            z = -(3 * u0) - 200;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });
    }

    return valuesList;
}

function calculateForwardiL(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D);

    for (var i = min; i <= max; i += step) {
        Vin = Vin + 10;

        if (check < D) {
            z = ((Vin / 0.2) * check) - 280;

        }

        else if (check >= D) {
            z = ((Vin / 0.2) * (1 - check)) - 280;
            if (z < ((Vin / 0.2) * check) - 280) {
                z = z + (check + Vin);
            }

            if (z > ((Vin / 0.2) * check) - 280) {
                z = z - (check + Vin);
            }
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });

    }

    return valuesList;
}

function calculateForwardiC(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D);

    for (var i = min; i <= max; i += step) {
        Vin = Vin + 10;

        if (check < D) {
            z = ((Vin / 0.2) * check) - 380;

        }

        else if (check >= D) {
            z = ((Vin / 0.2) * (1 - check)) - 380;
            if (z < ((Vin / 0.2) * check) - 380) {
                z = z + (check + Vin);
            }

            if (z > ((Vin / 0.2) * check) - 380) {
                z = z - (check + Vin);
            }
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });

    }

    return valuesList;
}

function calculateForwardi2(D, min, max, step, Vin) {

    var valuesList = [];
    var check = min;
    var z = 0;
    var V0 = Vin / (1 - D);

    for (var i = min; i <= max; i += step) {
        Vin = Vin + 10;

        if (check < D) {
            z = ((Vin / 0.1) * check) - 480;

        }

        else if (check >= D) {
            z = - 500;
        }

        check = check + step;
        if (check > 1) {
            check = min;
        }

        valuesList.push({ x: i, y: z });

    }

    return valuesList;
}

//#endregion


