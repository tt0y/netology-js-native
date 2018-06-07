'use strict';

// Класс Vector позволяет контролировать расположение объектов и управлять их размером и перемещением.
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // создаем новый вектор, координаты которого равны сумме координат суммируемых
    plus(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error('Слагаемые значения должны быть типа Vector');
        }
        return new Vector(vector.x + this.x, vector.y + this.y);
    }

    // создаем новый вектор координаты которого увеличины в n раз
    times(number = 1) {
        return new Vector(this.x * number, this.y * number);
    }
}

class Actor {
    constructor(position = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
        if ((!(position instanceof Vector)) || (!(size instanceof Vector)) || (!(speed instanceof Vector))) {
            throw new Error('В качестве расположения передан не вектор');
        }
        this.pos = position;
        this.size = size;
        this.speed = speed;
    }

    get left() {
        return this.pos.x;
    }

    get top() {
        return this.pos.y;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get bottom() {
        return this.pos.y + this.size.y;
    }

    get type() {
        return 'actor';
    }

    act() {
    }

    isIntersect(actor) {
        if (!(actor instanceof Actor)) {
            throw new Error('Объект не является экземпляром Actor');
        }
        if (actor === this) {
            return false;
        }
        return ((this.left < actor.right) && (this.right > actor.left) && (this.top < actor.bottom) && (this.bottom > actor.top));
    }
}

class Level {
    constructor(playGroundGrid = [], actorArray = []) {
        this.grid = playGroundGrid.slice();
        this.height = this.grid.length;
        this.width = Math.max(...this.grid.map(el => el.length), 0);
        this.status = null;
        this.finishDelay = 1;
        this.actors = actorArray.slice();
        this.player = this.actors.find(el => el.type === 'player');
    }

    isFinished() {
        return this.status !== null && this.finishDelay < 0;
    }

    actorAt(actor) {
        if (!(actor instanceof Actor)) {
            throw new Error('Передан прализованный объект Actor');
        }
            return this.actors.find(el => el.isIntersect(actor));
    }

    obstacleAt(position, size) {
        const left = Math.floor(position.x);
        const right = Math.ceil(position.x + size.x);
        const top = Math.floor(position.y);
        const bottom = Math.ceil(position.y + size.y);

        if (right > this.width || left < 0 || top < 0) {
            return 'wall';
        }
        else if (bottom > this.height) {
            return 'lava';
        }

        for (let i = top; i < bottom; i++) {
            for (let k = left; k < right; k++) {
                const cell = this.grid[i][k];
                if (cell) {
                    return cell;
                }
            }
        }
    }

    removeActor(actor) {
        const index = this.actors.findIndex(el => el === actor);

        if (index !== -1) {
            this.actors.splice(index, 1);
        }
    }

    noMoreActors(type) {
        return !this.actors.some(el => el.type === type);
    }

    // Проверка пересечения объектов
    playerTouched(obstacle, actor) {
        if (this.status !== null) {
            return;
        }

        if ((obstacle === 'lava') || (obstacle === 'fireball')) {
            //this.status = 'won'; //  читерский режим - должно сработать
            this.status = 'lost';
        }else if ((obstacle === 'coin') && (actor.type === 'coin')) {
            this.removeActor(actor);

            if (this.noMoreActors('coin')) {
                this.status = 'won'; //yay!
            }
        }
    }
}

// Болванка, чтобы отображалась схема уровня
class Player extends Actor {
    //
}

// Отобразить схему уровня
const grid = [
    new Array(3),
    ['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);
