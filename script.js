import { Shape, Circle, Triangle, Square, Star, Heart } from "./shape.js";
import { Movable, StraightMovable, ZigzagMovable, CircularMovable } from "./movable.js";

// canvas要素を取得し、描画コンテキストを設定
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// canvasのサイズを画面全体に設定
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// パーティクルを格納する配列
const particleArray = [];

// パーティクルの最大数
const MAX_PARTICLE_NUM = 1000;

// Shape と Movable の種類
const shapeTypes = { Circle, Triangle, Square, Star, Heart };
const movableTypes = { StraightMovable, ZigzagMovable, CircularMovable };

// 初期選択
let selectedShape = "Circle";
let selectedMovable = "StraightMovable";

// パーティクルの数を表示するテキスト
const particleNum = document.getElementById('particleNum');

// 各ボタンを取得
const circleBtn = document.getElementById('circle-button');
const triangleBtn = document.getElementById('triangle-button');
const squareBtn = document.getElementById('square-button');
const starBtn = document.getElementById('star-button');
const heartBtn = document.getElementById('heart-button');

const straightBtn = document.getElementById('straight-button');
const zigzagBtn = document.getElementById('zigzag-button');
const circularBtn = document.getElementById('circular-button');

// チェックボックスの要素を取得
const drawLineCheckbox = document.getElementById("draw-line");

// ボタンのスタイルをリセットする関数
function resetShapeButtonStyles() {
    const buttons = [circleBtn, triangleBtn, squareBtn, starBtn, heartBtn];
    buttons.forEach(button => {
        button.style.backgroundColor = '';  // 元の色に戻す
    });
}
function resetMoveButtonStyles() {
    const buttons = [straightBtn, zigzagBtn, circularBtn];
    buttons.forEach(button => {
        button.style.backgroundColor = '';  // 元の色に戻す
    });
}

// 形の種類に関するボタンの処理
circleBtn.addEventListener('click', function() {
    resetShapeButtonStyles(); // 他のボタンの色を元に戻す
    circleBtn.style.backgroundColor = 'lightblue'; // クリックされたボタンの色を変更
    selectedShape = "Circle";
});

triangleBtn.addEventListener('click', function() {
    resetShapeButtonStyles();
    triangleBtn.style.backgroundColor = 'lightblue';
    selectedShape = "Triangle";
});

squareBtn.addEventListener('click', function() {
    resetShapeButtonStyles();
    squareBtn.style.backgroundColor = 'lightblue';
    selectedShape = "Square";
});

starBtn.addEventListener('click', function() {
    resetShapeButtonStyles();
    starBtn.style.backgroundColor = 'lightblue';
    selectedShape = "Star";
});

heartBtn.addEventListener('click', function() {
    resetShapeButtonStyles();
    heartBtn.style.backgroundColor = 'lightblue';
    selectedShape = "Heart";
});

// 移動の種類に関するボタンの処理
straightBtn.addEventListener('click', function() {
    resetMoveButtonStyles();
    straightBtn.style.backgroundColor = 'lightblue';
    selectedMovable = "StraightMovable";
});

zigzagBtn.addEventListener('click', function() {
    resetMoveButtonStyles();
    zigzagBtn.style.backgroundColor = 'lightblue';
    selectedMovable = "ZigzagMovable";
});

circularBtn.addEventListener('click', function() {
    resetMoveButtonStyles();
    circularBtn.style.backgroundColor = 'lightblue';
    selectedMovable = "CircularMovable";
});

// ウィンドウのサイズが変更された時、canvasのサイズも変更
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// マウスの位置を保存するオブジェクト
const mouse = {
    x: undefined,
    y: undefined,
};

// マウスクリック時
canvas.addEventListener('click', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    makeParticles(
        30,     /* 作る数 */
        5,      /* 最小サイズ */
        10,     /* 最大サイズ */
        0,      /* 最小スピード */
        3,      /* 最大スピード */
        0.05    /* サイズの減衰 */
    );
});

// マウス移動時
canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    makeParticles(
        10,     /* 作る数 */
        1,      /* 最小サイズ */
        3,      /* 最大サイズ */
        0,      /* 最小スピード */
        1,      /* 最大スピード */
        0.01    /* サイズの減衰 */
    );
});

// Particle クラス（Shape と Movable を統合）
class Particle {
    constructor(x, y, sizeMin, sizeMax, minSpeed, maxSpeed, damping) {
        // 選択されたクラスを動的にインスタンス化
        const ShapeClass = shapeTypes[selectedShape];
        const MovableClass = movableTypes[selectedMovable];

        this.shape = new ShapeClass(sizeMin, sizeMax, damping);
        this.movable = new MovableClass(x, y, minSpeed, maxSpeed);
    }

    update() {
        this.shape.update();
        this.movable.update(canvas.width, canvas.height);
    }

    draw(ctx) {
        this.shape.draw(ctx, this.movable.x, this.movable.y);
    }
}

function makeParticles(num, minSize, maxSize, minSpeed, maxSpeed, damping) {
    for (let i = 0; i < num; i++) {
        particleArray.push(new Particle(mouse.x, mouse.y, minSize, maxSize, minSpeed, maxSpeed, damping));
    }

    // パーティクルがMAX_PARTICLE_NUMを超えた場合、先頭から削除
    if (particleArray.length > MAX_PARTICLE_NUM) {
        particleArray.splice(0, particleArray.length - MAX_PARTICLE_NUM);
    }
}

function handleParticles() {
    for (let i = particleArray.length - 1; i >= 0; i--) {
        particleArray[i].update();
        particleArray[i].draw(ctx);

        if (drawLineCheckbox.checked) {
            // 近いパーティクルを求める
            let closestParticles = [];
            for (let j = 0; j < particleArray.length; j++) {
                if (i !== j) {
                    const dx = particleArray[i].movable.x - particleArray[j].movable.x;
                    const dy = particleArray[i].movable.y - particleArray[j].movable.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // 近いパーティクルを3つまで保存
                    if (closestParticles.length < 3) {
                        closestParticles.push({ particle: particleArray[j], distance });
                    } else {
                        // 配列の中で一番遠いものと比較し、距離が近ければ入れ替え
                        let maxIndex = closestParticles.reduce((maxIdx, p, idx, arr) => 
                            p.distance > arr[maxIdx].distance ? idx : maxIdx, 0);
                        
                        if (distance < closestParticles[maxIndex].distance) {
                            closestParticles[maxIndex] = { particle: particleArray[j], distance };
                        }
                    }
                }
            }

            // パーティクルと線を描画
            closestParticles.forEach(({ particle }) => {
                ctx.beginPath();
                ctx.strokeStyle = particleArray[i].shape.color;
                ctx.lineWidth = 1 + (500 - particle.distance) / 100; // 距離に応じた線の太さ
                ctx.globalAlpha = 1 - particle.distance / 500; // 距離に応じた透明度
                ctx.moveTo(particleArray[i].movable.x, particleArray[i].movable.y);
                ctx.lineTo(particle.movable.x, particle.movable.y);
                ctx.stroke();
                ctx.closePath();
            });

            ctx.globalAlpha = 1; // 透明度をリセット
        }

        // パーティクルのサイズが小さくなったら削除
        if (particleArray[i].shape.size <= 0) {
            particleArray.splice(i, 1);
        }
    }
}

// アニメーションのループ処理
function animate() {
    // canvasをクリアしてリフレッシュ
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // パーティクルを処理
    handleParticles();

    particleNum.textContent = particleArray.length + "個";

    // アニメーションを繰り返し呼び出す
    requestAnimationFrame(animate);
}

// アニメーション開始
circleBtn.style.backgroundColor = 'lightblue';
straightBtn.style.backgroundColor = 'lightblue';
animate();
