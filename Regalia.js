function preload() {
    img1 = loadImage('data/1.png');
    img2 = loadImage('data/2.png');
    img3 = loadImage('data/3.png');
    img4 = loadImage('data/4.png');
    img5 = loadImage('data/5.png');
    img6 = loadImage('data/6.png');
    img7 = loadImage('data/7.png');
    loadImg = loadImage('data/7.png');
}

let symmetry;
let angle;
let saveButton, clearButton, mouseButton, keyboardButton;
let slider;
let palette = [];
let palette1 = [];
let palette2 = [];
let palette3 = [];
let palette4 = [];
let palette5 = [];
let palette6 = [];
let palettes = [];
let insignias = [];
let brushSizes = [];
let newSeed = false;
let curCol = 0;
let bgCol = 0;
let brushSize;
let img, img1, img2, img3, img4, img5, img6, img7, loadImg;
let strokeVal;
let loading = true;
//Change this to the Master ID of the artwork
let asyncMasterID = '256';

function setup() {
    if (windowWidth >= windowHeight) {
        if (windowHeight < 800) {
            createCanvas(windowHeight, windowHeight);
        } else {
            createCanvas(800, 800);
        }
    } else {
        if (windowHeight < 1200) {
            createCanvas(windowWidth, windowWidth);
        } else {
            createCanvas(800, 800);
        }
    }
    linksInit();
    angleMode(DEGREES);
    //Royal
    palette1 = [color("#FFFFFF"), color("#F2D39B"), color("#FFDD03"), color("#CC0000"), color("#FC9D05"), color("#202020"), color("#000000")];
    //Vibrant
    palette2 = [color("#00C813"), color("#9B0AE8"), color("#FF0000"), color("#10A7FF"), color("#FFD700"), color("#551304"), color("#FFFFFF")];
    //Luscious
    palette3 = [color("#C0D904"), color("#BF4E4E"), color("#FF382C"), color("#F2B263"), color("#F2DBAE"), color("#08C891"), color("#250C59")];
    //Nature
    palette4 = [color("#F2E205"), color("#89B33E"), color("#3DADF2"), color("#37593E"), color("#FF9F0D"), color("#286E40"), color("#FFFFFF")];
    //East
    palette5 = [color("#BF0436"), color("#BF2A97"), color("#8FA63F"), color("#888888"), color("#FFFFFF"), color("#323232"), color("#F5D26C")];

    palettes = [palette1, palette2, palette3, palette4, palette5];
    insignias = [img1, img2, img3, img4, img5, img6, img7];
    brushSizes = [width / 150, width / 60, width / 25];

    //Default values
    palette = palette1;
    brushSize = 10;
    symmetry = 30;
    img = img1;
    background(palette[6]);

    //Initialization based on Async queries----------------------------------------------------------------------------------------------------

    loadAsyncAPI().then(res => {
        initializeOnAPI(res);
    });

    //Initialization end------------------------------------------------------------------------------------------------------------------------
}

function windowResized() {
    if (windowWidth >= windowHeight) {
        if (windowHeight < 800) {
            resizeCanvas(windowHeight, windowHeight);
        } else {
            resizeCanvas(800, 800);
        }
    } else {
        if (windowHeight < 800) {
            resizeCanvas(windowWidth, windowWidth);
        } else {
            resizeCanvas(800, 800);
        }
    }
    background(palette[6]);
    for (let i = 0; i < symmetry; i++) {
        stroke(palette[4]);
        strokeWeight(width / 180);
        point(width / 13, height / 13);
        rotate(angle);
    }
}

function loadAsyncAPI() {
    //Async API Load
    const options = {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: "{token(id:" + asyncMasterID + "){tokenMaster{layers{levers{currentValue}}}}}"
        })
    };
    return fetch(`https://api.thegraph.com/subgraphs/name/asyncart/async-art-v2`, options)
        .then(res => res.json());
}

function initializeOnAPI(res) {
    //Async API initialize and store data
    var paletteLever = res.data.token.tokenMaster.layers[0].levers[0].currentValue;
    var insigniaLever = res.data.token.tokenMaster.layers[1].levers[0].currentValue;
    var symmetryLever = res.data.token.tokenMaster.layers[2].levers[0].currentValue;
    var brushSizeLever = res.data.token.tokenMaster.layers[3].levers[0].currentValue;

    if (paletteLever <= 4) {
        palette = palettes[paletteLever];
    } else {
        palette = palettes[0];
    }

    if (insigniaLever <= 6) {
        img = insignias[insigniaLever];
    } else {
        img = img1;
    }

    if (symmetryLever <= 30) {
        symmetry = symmetryLever;
    } else {
        symmetry = 30;
    }

    if (brushSizeLever <= 2) {
        brushSize = brushSizes[brushSizeLever];
    } else {
        brushSize = width / 150;
    }

    angle = 360 / symmetry;
    strokeVal = palette[0];
    background(palette[6]);
    for (let i = 0; i < symmetry; i++) {
        stroke(palette[4]);
        strokeWeight(width / 180);
        point(width / 13, height / 13);
        rotate(angle);
    }
    loading = false;
}

// Save File Function
function saveFile() {
    save('Regalia.jpg');
}

function keyPressed() {
    if (keyCode === ENTER) {
        saveFile();
    }
}

function draw() {
    //Drawing the brush stroke
    translate(width / 2, height / 2);
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        let mx = mouseX - width / 2;
        let my = mouseY - height / 2;
        let pmx = pmouseX - width / 2;
        let pmy = pmouseY - height / 2;
        if (mouseIsPressed) {
            if (newSeed) {
                if (curCol < 4) {
                    curCol++;
                } else {
                    curCol = 0;
                }
                strokeVal = palette[curCol];
                newSeed = false;
            }
            stroke(strokeVal);
            if (symmetry > 0) {
                for (let i = 0; i < symmetry; i++) {
                    rotate(angle);
                    let sw = brushSize;
                    strokeWeight(sw);
                    line(mx, my, pmx, pmy);
                    push();
                    scale(1, -1);
                    line(mx, my, pmx, pmy);
                    pop();
                }
            } else {
                let sw = brushSize;
                strokeWeight(sw);
                line(mx, my, pmx, pmy);
            }
        } else {
            newSeed = true;
        }
    }
    //Rendering components
    imageMode(CENTER);
    image(img, 0, 0, width / 5, width / 5);
    noFill();
    stroke(0);
    strokeWeight(width / 10);
    rect(-width / 2, -height / 2, width, height);
    var alphaCol = palette[4];
    alphaCol.setAlpha(255);
    stroke(alphaCol);
    strokeWeight(width / 10);
    rect(-width / 2, -height / 2, width, height);
    strokeWeight(width / 11);
    stroke(palette[5]);
    rect(-width / 2, -height / 2, width, height);
    stroke(palette[4]);
    strokeWeight(1);
    var padding = width / 36;
    ellipse(-width / 2 + padding, -height / 2 + padding, brushSize, brushSize);
    ellipse(width / 2 - padding, -height / 2 + padding, brushSize, brushSize);
    ellipse(-width / 2 + padding, height / 2 - padding, brushSize, brushSize);
    ellipse(width / 2 - padding, height / 2 - padding, brushSize, brushSize);
    if (loading) {
        fill(255);
        noStroke();
        rect(-width / 2, -height / 2, width, height);
        fill(200, 200, 100);
        textSize(width / 10);
        text("...", -width / 16, 0);
    }
}

function linksInit() {
    var links = document.createElement("div");
    links.style.textAlign = "center";
    links.style.marginTop = "2%";

    var downloadLink = document.createElement("label");
    downloadLink.style.fontFamily = "Questrial";
    downloadLink.style.margin = "15px";
    downloadLink.style.color = "darkslategray";
    downloadLink.style.cursor = "pointer";
    downloadLink.innerHTML = "Download";
    downloadLink.onclick = function () {
        saveFile()
    };
    links.appendChild(downloadLink);

    var communityLink = document.createElement("a");
    communityLink.style.fontFamily = "Questrial";
    communityLink.style.margin = "15px";
    communityLink.style.color = "darkslategray";
    communityLink.style.cursor = "pointer";
    communityLink.innerHTML = "Community Creations";
    communityLink.href = "https://twitter.com/search?q=%23AsyncRegalia";
    communityLink.style.textDecoration = "none";
    links.appendChild(communityLink);
    document.body.appendChild(links);

}
