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
const MAX_PARTICLE_NUM = 1000;

const SIZE_MIN = 1;
const SIZE_MAX = 10;
const SPEED = 5;
const DAMPING = 0.02;

// 色を変化させるための変数
let hue = 0;

// Shape と Movable の種類
const shapeTypes = { Circle, Triangle, Square, Star, Heart };
const movableTypes = { StraightMovable, ZigzagMovable, CircularMovable };

// 初期選択
let selectedShape = "Circle";
let selectedMovable = "StraightMovable";

// 各ボタンを取得
const circleBtn = document.getElementById('circleBtn');
const triangleBtn = document.getElementById('triangleBtn');
const squareBtn = document.getElementById('squareBtn');
const starBtn = document.getElementById('starBtn');
const heartBtn = document.getElementById('heartBtn');

const straightBtn = document.getElementById('straightBtn');
const zigzagBtn = document.getElementById('zigzagBtn');
const circularBtn = document.getElementById('circularBtn');

circleBtn.style.backgroundColor = 'lightblue';
straightBtn.style.backgroundColor = 'lightblue';

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
    makeParticles(100);
});

// マウス移動時
canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    makeParticles(1);
});

// Particle クラス（Shape と Movable を統合）
class Particle {
    constructor(x, y, sizeMin, sizeMax, speed, damping) {
        // 選択されたクラスを動的にインスタンス化
        const ShapeClass = shapeTypes[selectedShape];
        const MovableClass = movableTypes[selectedMovable];

        this.shape = new ShapeClass(sizeMin, sizeMax, damping);
        this.movable = new MovableClass(x, y, speed);
    }

    update() {
        this.shape.update();
        this.movable.update(canvas.width, canvas.height);
    }

    draw(ctx) {
        this.shape.draw(ctx, this.movable.x, this.movable.y);
    }
}

function makeParticles(num) {
    for (let i = 0; i < num; i++) {
        particleArray.push(new Particle(mouse.x, mouse.y, SIZE_MIN, SIZE_MAX, SPEED, DAMPING));
    }

    // パーティクルがMAX_PARTICLE_NUMを超えた場合、先頭から削除
    if (particleArray.length > MAX_PARTICLE_NUM) {
        particleArray.splice(0, particleArray.length - MAX_PARTICLE_NUM);
    }
}

// パーティクルを管理する処理
function handleParticles() {
    // 他のパーティクルとの距離を計算し、近ければ線を引く
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw(ctx);

        // // 各パーティクルとの距離を計算し、配列に格納
        // let distances = [];
        // for (let j = 0; j < particleArray.length; j++) {
        //     if (i !== j) { // 同じパーティクル同士は除外
        //         const dx = particleArray[i].x - particleArray[j].x;
        //         const dy = particleArray[i].y - particleArray[j].y;
        //         const distance = Math.sqrt(dx * dx + dy * dy); // 距離の計算
        //         distances.push({ distance: distance, index: j });
        //     }
        // }

        // // 距離が近い順にソート（昇順）
        // distances.sort((a, b) => a.distance - b.distance);

        // 近いパーティクル3つに線を引く
        for (let j = i + 1; j < Math.min(3, particleArray.length); j++) {
            // const j = distances[k].index;
            const dx = particleArray[i].movable.x - particleArray[j].movable.x;
            const dy = particleArray[i].movable.y - particleArray[j].movable.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 距離が近ければ線を引く
            if (distance < 50) {
                ctx.beginPath();
                ctx.strokeStyle = particleArray[i].color;
                ctx.lineWidth = 1;
                ctx.moveTo(particleArray[i].movable.x, particleArray[i].movable.y);
                ctx.lineTo(particleArray[j].movable.x, particleArray[j].movable.y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // パーティクルのサイズが小さくなったら削除
        if (particleArray[i].shape.size <= 0) {
            particleArray.splice(i, 1);
            i--; // 削除後にインデックスを調整
        }
    }
}

// アニメーションのループ処理
function animate() {
    // canvasをクリアしてリフレッシュ
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // パーティクルを処理
    handleParticles();
    
    // 色相を変化させる
    hue += 5;

    // アニメーションを繰り返し呼び出す
    requestAnimationFrame(animate);
}

// アニメーション開始
animate();
