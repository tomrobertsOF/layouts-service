import * as robot from 'robotjs';

import {delay} from './delay';
import {getBounds} from './getBounds';
import {getWindow, Win} from './getWindow';

const OFFSET_X = 30;
const OFFSET_Y = 10;
const MAX_ADJUSTMENTS = 20;

export const dragWindowAndHover = async (identityOrWindow: Win, x: number, y: number) => {
    // Focus the window to make sure it's on top.
    const win = await getWindow(identityOrWindow);
    await win.focus();

    const bounds = await getBounds(identityOrWindow);
    robot.mouseToggle('up');
    robot.moveMouse(bounds.left + OFFSET_X, bounds.top + OFFSET_Y);
    robot.mouseToggle('down');
    robot.moveMouseSmooth(x + OFFSET_X, y + OFFSET_Y);

    // Keep making small corrections until the window is correctly positioned
    let currentMousePos;
    let currentBounds;
    let numAdjustments = 0;
    do {
        if (numAdjustments > MAX_ADJUSTMENTS) {
            console.warn(`Reached fine adjustment limit when dragging window ${JSON.stringify(win.identity)}.`);
            break;
        }
        currentMousePos = robot.getMousePos();
        currentBounds = await getBounds(win);

        const dx = Math.sign(x - currentBounds.left);
        const dy = Math.sign(y - currentBounds.top);

        robot.moveMouse(currentMousePos.x + dx, currentMousePos.y + dy);

        numAdjustments++;
    } while (currentBounds.left !== x || currentBounds.top !== y);

    await delay(500);
};
