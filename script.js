import { Shape, Circle, Triangle, Square, Star, Heart } from "./shape.js";
import { Movable, StraightMovable, ZigzagMovable, CircularMovable } from "./movable.js";

// キャンバスのセットアップ
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// パーティクルを格納する配列
const particleArray = [];
// パーティクルの最大数
const MAX_PARTICLE_NUM = 1000;
// Shape と Movable の種類
const shapeTypes = { Circle, Triangle, Square, Star, Heart };
const movableTypes = { StraightMovable, ZigzagMovable, CircularMovable };
// 選択中の種類
let selectedShape = "Circle";
let selectedMovable = "StraightMovable";
const mouse = { x: undefined, y: undefined };

// DOM要素
const particleNum = document.getElementById('particleNum');
const drawLineCheckbox = document.getElementById("draw-line");
const buttons = {
    shapes: {
        circle: document.getElementById('circle-button'),
        triangle: document.getElementById('triangle-button'),
        square: document.getElementById('square-button'),
        star: document.getElementById('star-button'),
        heart: document.getElementById('heart-button')
    },
    moves: {
        straight: document.getElementById('straight-button'),
        zigzag: document.getElementById('zigzag-button'),
        circular: document.getElementById('circular-button')
    }
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~クラス~~~~~~~~~~~~~~~~~~~~~~~~~ */

// パーティクルクラス
class Particle {
    constructor(x, y, sizeMin, sizeMax, minSpeed, maxSpeed, damping) {
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

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~関数~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// ボタンの機能設定
function setupButtons() {
    // 形状ボタン
    Object.entries(buttons.shapes).forEach(([type, button]) => {
        button.addEventListener('click', () => {
            Object.values(buttons.shapes).forEach(btn => btn.style.backgroundColor = '');
            button.style.backgroundColor = 'lightblue';
            selectedShape = type.charAt(0).toUpperCase() + type.slice(1);
        });
    });

    // 移動ボタン
    Object.entries(buttons.moves).forEach(([type, button]) => {
        button.addEventListener('click', () => {
            Object.values(buttons.moves).forEach(btn => btn.style.backgroundColor = '');
            button.style.backgroundColor = 'lightblue';
            selectedMovable = type.charAt(0).toUpperCase() + type.slice(1) + "Movable";
        });
    });

    // 初期選択ボタンの設定
    buttons.shapes.circle.style.backgroundColor = 'lightblue';
    buttons.moves.straight.style.backgroundColor = 'lightblue';
}

// イベントハンドラ
function updateMousePosition(event) {
    const touch = event.touches && event.touches.length > 0;
    mouse.x = touch ? event.touches[0].clientX : event.clientX;
    mouse.y = touch ? event.touches[0].clientY : event.clientY;
}

function spawnParticles(event, count, sizeMin, sizeMax, speedMin, speedMax, damping) {
    updateMousePosition(event);
    for (let i = 0; i < count; i++) {
        particleArray.push(new Particle(mouse.x, mouse.y, sizeMin, sizeMax, speedMin, speedMax, damping));
    }

    // パーティクル配列のサイズ管理
    if (particleArray.length > MAX_PARTICLE_NUM) {
        particleArray.splice(0, particleArray.length - MAX_PARTICLE_NUM);
    }

    // タッチデバイスでのスクロールを防止
    if (event.type.startsWith('touch')) event.preventDefault();
}

// アニメーションとパーティクル管理
function handleParticles() {
    for (let i = particleArray.length - 1; i >= 0; i--) {
        const particle = particleArray[i];
        particle.update();
        particle.draw(ctx);

        // チェックボックスがチェックされている場合、パーティクルを線で接続
        if (drawLineCheckbox.checked) {
            const closestParticles = findClosestParticles(particle, i);
            drawConnectionLines(particle, closestParticles);
        }

        // 小さなパーティクルを削除
        if (particle.shape.size <= 0) {
            particleArray.splice(i, 1);
        }
    }
}

function findClosestParticles(particle, index) {
    const candidates = [];

    // 近いパーティクルを求める
    let closestParticles = [];
    for (let j = 0; j < particleArray.length; j++) {
        if (index === j) continue;

        const dx = particleArray[index].movable.x - particleArray[j].movable.x;
        const dy = particleArray[index].movable.y - particleArray[j].movable.y;
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

    return closestParticles;
}

// パーティクルと線を描画
function drawConnectionLines(particle, connections) {
    connections.forEach(({ particle: other, distance }) => {
        ctx.beginPath();
        ctx.strokeStyle = particle.shape.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1 - distance / 500;
        ctx.moveTo(particle.movable.x, particle.movable.y);
        ctx.lineTo(other.movable.x, other.movable.y);
        ctx.stroke();
    });

    ctx.globalAlpha = 1; // 不透明度をリセット
}

function animate() {
    // 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    particleNum.textContent = particleArray.length + "個";

    // 再帰呼び出し
    requestAnimationFrame(animate);
}

// イベントのセットアップ
function setupEvents() {
    // ウィンドウのリサイズ
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // マウス/タッチイベントごとのパーティクル設定
    canvas.addEventListener('click', e =>
        spawnParticles(e, 30, 5, 10, 0, 3, 0.05));

    canvas.addEventListener('mousemove', e =>
        spawnParticles(e, 10, 1, 3, 0, 1, 0.01));

    canvas.addEventListener('touchend', e =>
        spawnParticles(e, 30, 5, 10, 0, 3, 0.05));

    canvas.addEventListener('touchmove', e =>
        spawnParticles(e, 10, 1, 3, 0, 1, 0.01));
}

// 初期化と開始
setupButtons();
setupEvents();
animate();